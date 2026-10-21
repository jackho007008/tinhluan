import { test, expect } from "@playwright/test";
import { loadEnvFile } from "node:process";
loadEnvFile(".env");
test("coverage protected; filters, six sourced readings and mobile table work", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/internal?view=coverage");
  await expect(
    page.getByRole("heading", { name: "Đăng nhập nội bộ" }),
  ).toBeVisible();
  await expect(page.getByLabel("Lọc độ phủ")).toHaveCount(0);
  await page
    .getByLabel("Khóa truy cập nội bộ")
    .fill(process.env.INTERNAL_REVIEW_KEY!);
  await page.getByRole("button", { name: "Mở bản kiểm tra" }).click();
  await page.getByLabel("Chọn mẫu kiểm thử").waitFor();
  await page.waitForLoadState("load");
  await page
    .getByText("Đo độ phủ nội dung và xem các bản Tổng quan mẫu", {
      exact: true,
    })
    .click();
  await expect(page.locator("tr[data-sample]")).toHaveCount(56);
  await expect(page.locator("[data-reading]")).toHaveCount(6);
  await page.waitForLoadState("load");
  for (const [filter, width] of [
    ["empty", 360],
    ["single", 390],
    ["combination", 360],
    ["missing", 390],
    ["uncovered", 390],
  ] as const) {
    await page.setViewportSize({ width, height: 844 });
    await page.getByLabel("Lọc độ phủ").selectOption(filter);
    await page.getByRole("button", { name: "Lọc kết quả" }).click();
    await expect(page).toHaveURL(new RegExp("filter=" + filter + "$"));
    await page.waitForLoadState("load");
    if (filter === "empty")
      await expect(page.locator('tr[data-sample="vn-2"]')).toBeVisible();
    if (filter === "single")
      await expect(page.locator('tr[data-sample="syn-combo"]')).toHaveCount(0);
    if (filter === "combination")
      await expect(page.locator('tr[data-sample="syn-combo"]')).toBeVisible();
    if (filter === "missing")
      await expect(
        page.locator('tr[data-sample="syn-missing-major"]'),
      ).toBeVisible();
    if (filter === "uncovered")
      await expect(
        page.getByText("context.career-labels @ 1.0.0 · fact", { exact: true }),
      ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  }
  const reading = page.locator('[data-reading="engine-exception"]');
  await reading.getByText("Căn cứ của bản mẫu", { exact: true }).click();
  await expect(reading).toContainText("reading.overview.pojun @");
  await expect(reading.locator('a[href^="https://"]')).not.toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: ".local/reading-review/content-coverage-390.png",
  });
});
