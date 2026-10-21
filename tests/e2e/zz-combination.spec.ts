import { test, expect } from "@playwright/test";
import { loadEnvFile } from "node:process";
loadEnvFile(".env");
test("combination preview narrows Phá Quân scope, keeps sources and no favorable replacement", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("/internal");
  await page
    .getByLabel("Khóa truy cập nội bộ")
    .fill(process.env.INTERNAL_REVIEW_KEY!);
  await page.getByRole("button", { name: "Mở bản kiểm tra" }).click();
  for (const width of [360, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const id of [
      "syn-combo",
      "engine-combo",
      "engine-exception",
      "syn-combo",
    ]) {
      await page.getByLabel("Chọn mẫu kiểm thử").selectOption(id);
      await page.getByRole("button", { name: "Xem mẫu kiểm thử" }).click();
      const topic = page.locator("#preview-overview");
      await expect(
        topic.locator('[data-rule="combination.ziwei-assistants"]'),
      ).toHaveCount(id === "syn-combo" ? 1 : 0);
      if (id === "syn-combo") {
        await expect(
          topic.locator('[data-rule="reading.overview.ziwei"]'),
        ).not.toBeVisible();
        await topic.getByText("Chú giải yếu tố riêng", { exact: true }).click();
      } else {
        await expect(
          topic.locator('[data-rule="combination.ziwei-assistants-qualified"]'),
        ).toHaveCount(0);
        await expect(
          topic.locator('[data-rule="reading.overview.pojun"]'),
        ).toBeVisible();
        await expect(topic).toContainText(
          "phần tổng hợp chủ tinh–phụ tá tạm dừng",
        );
      }
      await expect(
        topic.locator('[data-rule="reading.overview.ziwei"]'),
      ).toBeVisible();
      await topic.getByText("Xem căn cứ", { exact: true }).click();
      await expect(topic.locator(".evidence").first()).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (id === "engine-exception") {
        await topic.evaluate((el) => el.scrollIntoView({ block: "start" }));
        await page.screenshot({
          path: `.local/reading-review/overview-revised-${width}.png`,
        });
      }
    }
  }
});
