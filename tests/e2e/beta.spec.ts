import { test, expect } from "@playwright/test";
import { loadEnvFile } from "node:process";
import { randomUUID } from "node:crypto";
import { pool } from "../../lib/db";
import { loadSample } from "../../lib/internal-review/samples";
import { prepareBeta, issueBetaGrant } from "../../lib/beta/store";
loadEnvFile(".env");
const origin = process.env.BETA_E2E_ORIGIN;
test.skip(
  !origin,
  "Opt-in only: run isolated loopback beta test server; never enable the current public site.",
);
test("isolated beta: one report, preflight, mobile evidence/feedback, resume, revoke, no internal rights", async ({
  browser,
}) => {
  test.setTimeout(90000);
  const ids: string[] = [];
  const baseline = async () =>
    (
      await pool.query(
        "SELECT (SELECT count(*) FROM orders) orders,(SELECT md5(COALESCE(string_agg(data::text,'' ORDER BY order_id),'')) FROM reports) reports,(SELECT count(*) FROM payment_transactions) payments",
      )
    ).rows[0];
  const before = await baseline();
  try {
    for (const width of [360, 390]) {
      const loaded = (await loadSample(
        width === 360 ? "engine-combo" : "vn-0",
      ))!;
      const id = await prepareBeta(loaded.report, {
        cohort: "demo-e2e-" + randomUUID(),
        demo: true,
        expires: new Date(Date.now() + 3600000).toISOString(),
        deleteAfter: new Date(Date.now() + 7200000).toISOString(),
      });
      ids.push(id);
      await pool.query(
        "UPDATE beta_reports SET released_at=now() WHERE id=$1",
        [id],
      );
      const grant = await issueBetaGrant(id);
      const ctx = await browser.newContext({
          viewport: { width, height: 844 },
        }),
        page = await ctx.newPage();
      const failures: string[] = [];
      page.on("pageerror", () => failures.push("pageerror"));
      // Deliver fragment without including the bearer token in the navigation URL used by test logs.
      await page.addInitScript((token) => {
        if (
          location.pathname === "/beta" &&
          !sessionStorage.getItem("beta-e2e-initialized")
        ) {
          sessionStorage.setItem("beta-e2e-initialized", "yes");
          history.replaceState(null, "", "/beta#" + token);
        }
      }, grant.token);
      await page.goto(origin + "/beta");
      await expect(
        page.getByRole("button", {
          name: "Tôi hiểu phạm vi và đồng ý bắt đầu",
        }),
      ).toBeVisible();
      expect(await page.evaluate(() => location.hash.length === 0)).toBe(true);
      await expect(
        page.getByText("DỮ LIỆU GIẢ LẬP", { exact: false }),
      ).toBeVisible();
      expect(
        (await page.request.get(origin + "/api/beta/reading")).headers()[
          "referrer-policy"
        ],
      ).toBe("no-referrer");
      await page
        .getByRole("button", { name: "Tôi hiểu phạm vi và đồng ý bắt đầu" })
        .click();
      const section = page.locator("article").nth(1);
      await expect(section).toBeVisible();
      await section.getByText("Xem căn cứ", { exact: true }).click();
      await expect(section.locator("details")).toHaveAttribute("open", "");
      await section.getByRole("button", { name: /Đánh dấu đoạn/ }).click();
      await page.getByLabel("Bạn hiểu nội dung ở mức nào?").selectOption("3");
      await page.getByLabel("Khó hiểu", { exact: true }).check();
      await page
        .getByLabel("Bạn có tìm được căn cứ không?")
        .selectOption("yes");
      await page
        .getByLabel("Đoạn nào chung chung, khó hiểu hoặc mâu thuẫn?", {
          exact: false,
        })
        .fill("DEMO: cần giải thích thuật ngữ rõ hơn.");
      await page
        .getByRole("button", { name: "Gửi phản hồi", exact: true })
        .click();
      await expect(page.getByRole("status")).toContainText("Đã lưu");
      const row = (
        await pool.query("SELECT * FROM beta_feedback WHERE grant_id=$1", [
          grant.id,
        ])
      ).rows[0];
      expect(row.report_id).toBe(id);
      expect(row.claim_id).toBeTruthy();
      expect(row.versions.template).toBe("beta-reader-1.0.0");
      await page
        .getByLabel("Phản hồi cho", { exact: true })
        .selectOption("report");
      await page
        .getByRole("button", { name: "Gửi phản hồi", exact: true })
        .click();
      await expect(
        page.getByText("Đã ghi nhận phản hồi toàn báo cáo.", { exact: false }),
      ).toBeVisible();
      await page.reload();
      await expect(page.locator("article").first()).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.locator("#beta-feedback").evaluate((el) =>
        window.scrollTo({
          top: el.getBoundingClientRect().top + scrollY,
          behavior: "instant",
        }),
      );
      await page.screenshot({
        path: `.local/reading-review/beta-feedback-${width}.png`,
      });
      const owner = await browser.newContext();
      const ownerPage = await owner.newPage();
      await ownerPage.goto(origin + "/internal");
      await ownerPage
        .getByLabel("Khóa truy cập nội bộ")
        .fill(process.env.INTERNAL_REVIEW_KEY!);
      await ownerPage.getByRole("button", { name: "Mở bản kiểm tra" }).click();
      await ownerPage.getByLabel("Chọn mẫu kiểm thử").waitFor();
      await ownerPage.goto(origin + "/internal/beta");
      await expect(
        ownerPage
          .getByText("DEMO: cần giải thích thuật ngữ rõ hơn.", { exact: false })
          .first(),
      ).toBeVisible();
      await ownerPage.setViewportSize({ width, height: 844 });
      await ownerPage
        .getByText("Xem chính bản nội dung đã chốt", { exact: true })
        .first()
        .click();
      expect(
        await ownerPage.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await owner.close();
      const invalid = await page.request.post(origin + "/api/beta/feedback", {
        headers: { Origin: origin! },
        data: {
          id: randomUUID(),
          sectionId: "another-report-claim",
          reportId: id,
          readerAlias: grant.alias,
          understanding: 3,
          tags: [],
          basisFound: "no",
          useful: "",
          unclear: "",
          concern: "",
          missing: "",
        },
      });
      expect(invalid.status()).toBe(400);
      await page.goto(origin + "/internal");
      await expect(
        page.getByRole("heading", { name: "Đăng nhập nội bộ" }),
      ).toBeVisible();
      await page.goto(origin + "/internal/beta");
      await expect(
        page.getByRole("heading", { name: "Cần quyền kiểm tra nội bộ" }),
      ).toBeVisible();
      await pool.query("UPDATE beta_grants SET revoked_at=now() WHERE id=$1", [
        grant.id,
      ]);
      expect(
        (await page.request.get(origin + "/api/beta/reading")).status(),
      ).toBe(401);
      expect(failures).toEqual([]);
      await ctx.close();
    }
    expect(await baseline()).toEqual(before);
  } finally {
    await pool.query("DELETE FROM beta_reports WHERE id=ANY($1::uuid[])", [
      ids,
    ]);
    await pool.end();
  }
});
