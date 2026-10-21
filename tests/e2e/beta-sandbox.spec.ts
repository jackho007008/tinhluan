import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { pool } from "../../lib/db";
import { issueBetaGrant } from "../../lib/beta/store";
test.afterAll(async () => { await pool.end(); });
const origin = process.env.BETA_SANDBOX_ORIGIN || "http://127.0.0.1:3002";
const target = new URL(process.env.DATABASE_URL || "postgres://localhost/none");
const database = process.env.BETA_SANDBOX_DATABASE || "tuvi_beta_demo_20261008";
const enabled =
  process.env.BETA_SANDBOX_E2E === "true" &&
  ["localhost", "127.0.0.1"].includes(target.hostname) &&
  ["localhost", "127.0.0.1"].includes(new URL(origin).hostname) &&
  (database === "tuvi_beta_demo_20261008" || database.startsWith("tuvi_stability_beta_")) &&
  target.pathname === "/" + database;
test.skip(!enabled, "Only run in the isolated DEMO database and source copy.");
test("three frozen DEMO readings: evidence, paragraph/full feedback, admin and revocation", async ({
  browser,
}) => {
  test.setTimeout(120000);
  const editions = JSON.parse(await readFile("../editions.json", "utf8")) as {
    sample: string;
    reportId: string;
    versions: unknown;
  }[];
  const before = (
    await pool.query(
      "SELECT md5(string_agg(document::text||snapshot::text||versions::text,'' ORDER BY id)) hash FROM beta_reports",
    )
  ).rows[0].hash;
  for (const [index, e] of editions.entries()) {
    const grant = await issueBetaGrant(e.reportId);
    const ctx = await browser.newContext({
      viewport: { width: index === 1 ? 390 : 360, height: 844 },
    });
    try {
      const page = await ctx.newPage();
      await page.addInitScript((token) => {
        if (
          location.pathname === "/beta" &&
          !sessionStorage.getItem("demo-initialized")
        ) {
          sessionStorage.setItem("demo-initialized", "true");
          history.replaceState(null, "", "/beta#" + token);
        }
      }, grant.token);
      await page.goto(origin + "/beta");
      await page
        .getByRole("button", { name: "Tôi hiểu phạm vi và đồng ý bắt đầu" })
        .click();
      await expect(page.locator("article").first()).toBeVisible();
      const article = page
        .locator("article")
        .filter({ has: page.locator("details") })
        .nth(1);
      await article.getByText("Xem căn cứ", { exact: true }).click();
      await expect(article.locator("details")).toHaveAttribute("open", "");
      await article.getByRole("button", { name: /Đánh dấu đoạn/ }).click();
      await page.getByLabel("Bạn hiểu nội dung ở mức nào?").selectOption("3");
      await page.getByLabel("Hữu ích", { exact: true }).check();
      await page
        .getByLabel("Bạn có tìm được căn cứ không?")
        .selectOption("yes");
      const marker =
        "DEMO tự động · " +
        e.sample +
        " · kiểm tra lưu phản hồi, không phải ý kiến người thật.";
      await page
        .getByLabel("Đoạn nào chung chung, khó hiểu hoặc mâu thuẫn?", {
          exact: false,
        })
        .fill(marker);
      await page
        .getByRole("button", { name: "Gửi phản hồi", exact: true })
        .click();
      await expect(page.getByRole("status")).toContainText("Đã lưu");
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
      expect(await page.evaluate(() => location.hash === "")).toBe(true);
      const feedback = (
        await pool.query(
          "SELECT report_id,section_id,claim_id,versions FROM beta_feedback WHERE grant_id=$1",
          [grant.id],
        )
      ).rows;
      expect(feedback.length).toBe(2);
      for (const f of feedback) {
        expect(f.report_id).toBe(e.reportId);
        expect(f.versions).toEqual(e.versions);
      }
      expect(feedback.some((f) => f.claim_id)).toBe(true);
      expect(feedback.some((f) => f.section_id === "report")).toBe(true);
      await page.goto(origin + "/internal/beta");
      await expect(
        page.getByRole("heading", { name: "Cần quyền kiểm tra nội bộ" }),
      ).toBeVisible();
      const owner = await browser.newContext();
      try {
        const p = await owner.newPage();
        await p.goto(origin + "/internal");
        await p
          .getByLabel("Khóa truy cập nội bộ")
          .fill(process.env.INTERNAL_REVIEW_KEY!);
        await p.getByRole("button", { name: "Mở bản kiểm tra" }).click();
        await p.getByLabel("Chọn mẫu kiểm thử").waitFor();
        await p.goto(origin + "/internal/beta");
        await expect(
          p.getByText(marker, { exact: false }).first(),
        ).toBeVisible();
      } finally {
        await owner.close();
      }
      await pool.query(
        "UPDATE beta_grants SET revoked_at=now(),token_hash=NULL,session_hash=NULL WHERE id=$1",
        [grant.id],
      );
      expect(
        (await page.request.get(origin + "/api/beta/reading")).status(),
      ).toBe(401);
    } finally {
      await pool.query(
        "UPDATE beta_grants SET revoked_at=now(),token_hash=NULL,session_hash=NULL WHERE id=$1",
        [grant.id],
      );
      await ctx.close();
    }
  }
  expect(
    (
      await pool.query(
        "SELECT md5(string_agg(document::text||snapshot::text||versions::text,'' ORDER BY id)) hash FROM beta_reports",
      )
    ).rows[0].hash,
  ).toBe(before);
  for (const table of ["orders", "payment_transactions", "email_deliveries"])
    expect(
      Number((await pool.query("SELECT count(*) FROM " + table)).rows[0].count),
    ).toBe(0);
  const main = await browser.newPage();
  try {
    await main.goto((process.env.BETA_OFF_ORIGIN || "http://localhost:3000") + "/beta");
    await expect(
      main.getByRole("heading", { name: "Đợt đọc thử chưa được mở" }),
    ).toBeVisible();
  } finally {
    await main.close();
  }
});
