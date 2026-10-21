import { savedReports } from "./fixtures/saved-reports";
import { test, expect } from "@playwright/test";
import { loadEnvFile } from "node:process";
loadEnvFile(".env");
test("internal preview protected, readable at 390px, evidence and logout work", async ({
  page,
}) => {
  const seeded = await savedReports();
  try {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/internal?report=" + seeded.ids[0]);
  await expect(
    page.getByRole("heading", { name: "Đăng nhập nội bộ" }),
  ).toBeVisible();
  await expect(page.locator("#technical")).toHaveCount(0);
  await page
    .getByLabel("Khóa truy cập nội bộ")
    .fill(process.env.INTERNAL_REVIEW_KEY!);
  await page.getByRole("button", { name: "Mở bản kiểm tra" }).click();
  await expect(page.getByRole("heading", {name:"Đọc thử Tổng quan & Sự nghiệp"})).toBeVisible();
  await page.goto("/internal?report=" + seeded.ids[0]);
  await expect(
    page.getByRole("heading", { name: "Đọc thử Tổng quan & Sự nghiệp" }),
  ).toBeVisible();
  await expect(page.locator(".badge")).toHaveText(
    "Bản nháp nội bộ — chưa kiểm duyệt",
  );
  for (const topic of ["overview", "career"]) {
    const section = page.locator("#preview-" + topic);
    await section.getByText("Xem căn cứ", { exact: true }).click();
    await expect(section.locator(".evidence").first()).toBeVisible();
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator("#claim-map tbody tr")).toHaveCount(11);
  await page.screenshot({
    path: ".local/reading-review/internal-preview-390.png",
    fullPage: true,
  });
  await page.locator("#preview-overview").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: ".local/reading-review/preview-overview-390.png",
  });
  await page.setViewportSize({ width: 360, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator("#technical summary").first().click();
  await expect(page.locator("#technical pre").first()).toContainText(
    "evidencePaths",
  );
  const select = page.getByLabel("Chọn báo cáo đã lưu");
  const initial = await select.inputValue();
  await select.selectOption(seeded.ids[1]);
  await page.getByRole("button", { name: "Xem lá số này" }).click();
  await expect(page).toHaveURL(new RegExp("report="+seeded.ids[1]));
  await expect(page.locator('[data-rule="reading.wuqu"]')).toHaveCount(0);
  await expect(page.locator("#preview-overview")).toContainText(
    "Mệnh tại Ngọ, ghi nhận Tử Vi",
  );
  await expect(
    page.locator('[data-rule="reading.overview.ziwei"]'),
  ).toHaveCount(1);
  await expect(page.locator("#execution")).toContainText("condition-false");
  await select.selectOption(initial);
  await page.getByRole("button", { name: "Xem lá số này" }).click();
  await expect(page.locator('[data-rule="reading.wuqu"]')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('[data-rule="reading.wuqu"]')).toHaveCount(1);
  await page.locator("#preview-overview summary").click();
  await expect(
    page.locator("#preview-overview .evidence").first(),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Đăng xuất" }).click();
  await expect(
    page.getByRole("heading", { name: "Đăng nhập nội bộ" }),
  ).toBeVisible();
  const rejected = await page.request.post("/api/internal-login", {
    form: { key: "wrong" },
    headers: { Origin: "https://example.invalid" },
  });
  expect(rejected.status()).toBe(403);
  } finally { await seeded.cleanup(); }
});
