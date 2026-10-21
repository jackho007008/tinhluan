import { test, expect } from "@playwright/test";
import { issueReviewSession } from "../../lib/internal-review/auth";
import { loadSample } from "../../lib/internal-review/samples";
import { readFileSync } from "node:fs";
import type { ChartSnapshot } from "../../lib/tuvi-engine";
const saved = JSON.parse(
  readFileSync("exports/demo-wuqu-tianfu-review.json", "utf8"),
) as { snapshot: ChartSnapshot };
import { Pool } from "pg";
const origin = process.env.E2E_ORIGIN!;
const route = "/internal/editorial/demo-wuqu-tianfu?view=reading";
const cases = [
  ["", "Vũ Khúc", 7],
  ["vn-12", "Tử Vi", 3],
  ["vn-20", "Vũ Khúc", 4],
  ["vn-2", "", 1],
  ["vn-4", "Tử Vi", 2],
  ["vn-6", "Thiên Tướng", 2],
] as const;
for (const width of [360, 390])
  test(`six snapshots, reload/back and trace remain consistent at ${width}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      baseURL: origin,
      viewport: { width, height: 844 },
    });
    await context.addCookies([
      {
        name: "tuvi_internal",
        value: issueReviewSession(),
        url: origin,
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    try {
      for (const [sample, star, count] of cases) {
        const snapshot = sample
          ? (await loadSample(sample))!.report.snapshot
          : saved.snapshot;
        const life = snapshot.chart.palaces.find((p) => p.name === "Mệnh")!;
        if (star) expect(life.majorStars.map((s) => s.name)).toContain(star);
        else expect(life.majorStars).toEqual([]);
        const response = await page.goto(route + "&sample=" + sample);
        expect(response?.status()).toBe(200);
        expect(response?.headers()["content-type"]).toContain("text/html");
        await expect(
          page.locator("[data-testid=rule-reading]"),
        ).toHaveAttribute("data-snapshot", snapshot.resultId);
        await expect(page.locator("[data-claim]")).toHaveCount(count);
        if (sample === "vn-20")
          await expect(
            page.getByRole("heading", { name: "Sự chủ động", exact: true }),
          ).toBeVisible();
        if (sample === "vn-4" || sample === "vn-6") {
          expect(life.earthlyBranch).toBe(sample === "vn-4" ? "Ngọ" : "Tỵ");
          const claim = page.locator("[data-section=action] [data-claim]");
          await expect(claim).toContainText("Chú giải nền");
          await claim.locator("[data-evidence] > summary").click();
          await claim.locator("[data-technical] > summary").click();
          await expect(claim).toContainText(
            sample === "vn-4" ? "tanbien.r08" : "tanbien.r09",
          );
          await expect(claim).toContainText(snapshot.resultId);
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.reload();
        await expect(
          page.locator("[data-testid=rule-reading]"),
        ).toHaveAttribute("data-snapshot", snapshot.resultId);
      }
      // Offline before submit: preserve explicitly named old sample, no false empty result.
      await context.setOffline(true);
      await page.locator("select[name=sample]").selectOption("vn-4");
      await page.getByRole("button", { name: "Đối chiếu rule" }).click();
      await expect(page.locator("form").getByRole("alert")).toContainText(
        "Bài bên dưới vẫn là",
      );
      await expect(page).toHaveURL(/sample=vn-6/);
      await context.setOffline(false);
      await page.goBack();
      await expect(page).toHaveURL(/sample=vn-4/);
      await expect(page.locator("[data-claim]")).toHaveCount(2);
      await expect(page.locator("[data-section=action] [data-claim]")).toContainText("Tử Vi");
      await page.goto(route + "&sample=syn-missing-major");
      await expect(page.getByRole("status")).toContainText("Chưa có dữ liệu xác định đủ");
      await expect(page.getByText("Chưa có nhận định khớp", {exact:false})).toHaveCount(0);
      await expect(page.locator("[data-claim]")).toHaveCount(0);
      // Expired authentication is not empty content or a waiting state.
      await context.clearCookies();
      await page.reload();
      await expect(
        page.getByRole("heading", { name: "Cần quyền kiểm tra nội bộ" }),
      ).toBeVisible();
      await expect(page.locator("[data-claim]")).toHaveCount(0);
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  });
test("login rate limit is isolated, eight attempts then intentional 429 with retry guidance", async ({
  browser,
}) => {
  const db = process.env.DATABASE_URL!;
  const target = new URL(db);
  if (!["localhost", "127.0.0.1"].includes(target.hostname) || target.pathname !== "/" + process.env.E2E_ISOLATED_DATABASE || !process.env.E2E_ISOLATED_DATABASE?.startsWith("tuvi_stability_"))
    throw Error("ISOLATED_DATABASE_REQUIRED");
  const pool = new Pool({ connectionString: db });
  const context = await browser.newContext({ baseURL: origin });
  try {
    await pool.query("DELETE FROM rate_limits WHERE key='internal-login'");
    for (let i = 0; i < 8; i++) {
      const res = await context.request.post("/api/internal-login", {
        headers: { Origin: origin },
        form: { key: "synthetic-invalid-key" },
        maxRedirects: 0,
      });
      expect(res.status()).toBe(303);
    }
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/internal");
    await page.getByLabel("Khóa truy cập nội bộ").fill("synthetic-invalid-key");
    const received = page.waitForResponse((r) =>
      r.url().endsWith("/api/internal-login"),
    );
    await page.getByRole("button", { name: "Mở bản kiểm tra" }).click();
    const response = await received;
    expect(response.status()).toBe(429);
    expect(response.headers()["content-type"]).toContain("text/plain");
    await expect(page.locator("form").getByRole("alert")).toHaveText("Thử lại sau 10 phút.");
    await expect(
      page.getByRole("button", { name: "Mở bản kiểm tra" }),
    ).toBeEnabled();
    // Error HTML and transport failure are not parsed as JSON or mistaken for success.
    await page.route("**/api/internal-login", r => r.fulfill({status:500,contentType:"text/html",body:"<p>synthetic server failure</p>"}));
    await page.getByRole("button",{name:"Mở bản kiểm tra"}).click();
    await expect(page.locator("form").getByRole("alert")).toHaveText("Không thể xác thực. Vui lòng thử lại.");
    await page.unroute("**/api/internal-login");
    await page.route("**/api/internal-login", r => r.abort("connectionfailed"));
    await page.getByRole("button",{name:"Mở bản kiểm tra"}).click();
    await expect(page.locator("form").getByRole("alert")).toHaveText("Không thể kết nối. Vui lòng thử lại.");
    await expect(page.getByRole("button",{name:"Mở bản kiểm tra"})).toBeEnabled();
    expect(errors).toEqual([]);
  } finally {
    await context.close();
    await pool.query("DELETE FROM rate_limits WHERE key='internal-login'");
    await pool.end();
  }
});
