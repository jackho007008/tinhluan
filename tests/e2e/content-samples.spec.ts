import { test, expect } from "@playwright/test";
import { loadEnvFile } from "node:process";
import { Pool } from "pg";
loadEnvFile(".env");
test("protected samples: A → B → A, missing facts, mobile evidence; no database writes", async ({
  page,
}) => {
  test.setTimeout(90000);
  const db = new Pool({ connectionString: process.env.DATABASE_URL });
  // Compare IDs/hashes in memory only, never log real customer data.
  const state = async () =>
    (
      await db.query(
        "SELECT (SELECT count(*)::int FROM orders) orders,(SELECT count(*)::int FROM payment_transactions) payments,(SELECT md5(COALESCE(string_agg(data::text,'' ORDER BY order_id),'')) FROM reports) reports",
      )
    ).rows[0];
  try {
    const before = await state();
    await page.goto("/internal?sample=engine-combo");
    await expect(
      page.getByRole("heading", { name: "Đăng nhập nội bộ" }),
    ).toBeVisible();
    await expect(page.getByLabel("Chọn mẫu kiểm thử")).toHaveCount(0);
    await page
      .getByLabel("Khóa truy cập nội bộ")
      .fill(process.env.INTERNAL_REVIEW_KEY!);
    await page.getByRole("button", { name: "Mở bản kiểm tra" }).click();
    await page.getByLabel("Chọn mẫu kiểm thử").waitFor();
    for (const width of [360, 390]) {
      await page.setViewportSize({ width, height: 844 });
      for (const id of [
        "engine-combo",
        "engine-partial",
        "engine-combo",
        "syn-missing-major",
      ]) {
        await page.getByLabel("Chọn mẫu kiểm thử").selectOption(id);
        await page.getByRole("button", { name: "Xem mẫu kiểm thử" }).click();
        await expect(page).toHaveURL(new RegExp("sample=" + id + "$"));
        const t = page.locator("#preview-overview");
        await expect(
          t.locator('[data-rule="reading.overview.pojun"]'),
        ).toHaveCount(id === "engine-combo" ? 1 : 0);
        if (id === "engine-combo") {
          await t.getByText("Xem căn cứ", { exact: true }).click();
          await expect(t.locator(".evidence").first()).toBeVisible();
        }
        if (id === "syn-missing-major") {
          await expect(page.locator("#execution")).toContainText(
            "missing-facts",
          );
          await expect(
            t.locator('[data-rule="reading.overview.empty"]'),
          ).toHaveCount(0);
        }
        await expect
          .poll(() =>
            page.evaluate(() => ({
              width: innerWidth,
              scroll: document.documentElement?.scrollWidth,
            })),
          )
          .toEqual({ width, scroll: width });
      }
    }
    await page.screenshot({
      path: ".local/reading-review/content-samples-390.png",
    });
    await page.goto("/internal?sample=unknown");
    await expect(
      page.getByRole("heading", { name: "Không tìm thấy mẫu kiểm thử" }),
    ).toBeVisible();
    expect(await state()).toEqual(before);
  } finally {
    await db.end();
  }
});
