import { test, expect } from "@playwright/test";
for (const width of [360, 390, 1280])
  test(`date investigation ${width}: keyboard, blur, validation, edit and picker opening`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const date = page.getByLabel("Ngày sinh", { exact: false });
    await date.focus();
    await date.press("ArrowLeft");
    await date.press("ArrowLeft");
    await date.press("ArrowLeft");
    await date.pressSequentially("15061992");
    await date.press("Tab");
    await expect(date).toHaveValue("1992-06-15");
    await page.getByLabel("Giờ sinh", { exact: true }).selectOption("10");
    await page.getByLabel("Phút sinh", { exact: true }).selectOption("30");
    await page.getByRole("button", { name: "Kiểm tra thông tin" }).click();
    await expect(date).toHaveValue("1992-06-15");
    await page
      .getByRole("textbox", { name: /^Nơi sinh/ })
      .fill("Hà Nội — mẫu kiểm thử");
    await page.getByLabel("Tôi hiểu giới hạn").check();
    await page.getByRole("button", { name: "Kiểm tra thông tin" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".confirmation")).toContainText(
      "1992-06-15 · 10:30",
    );
    await date.fill("1992-06-16");
    await date.press("Tab");
    await expect(page.locator(".confirmation")).toHaveCount(0);
    await date.fill("1992-06-15");
    await page.getByRole("button", { name: "Kiểm tra thông tin" }).click();
    await expect(page.locator(".confirmation")).toContainText("1992-06-15");
    // Open the native picker via its indicator and use its keyboard day selection.
    await date.evaluate((el) =>
      el.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    const box = (await date.boundingBox())!;
    await page.mouse.click(box.x + box.width - 18, box.y + box.height / 2);
    await page.screenshot({
      path: `docs/evidence/customer-journey/${width}-date-picker.png`,
    });
    // Popup opening is captured; automated selection is not claimed by this test.
    await page.keyboard.press("Escape");
    await date.focus();
    await date.press("Tab");
    await expect(date).toHaveValue("1992-06-15");
  });
test("diagnostic: changing DOM value without input/change events does not update React state", async ({
  page,
}) => {
  await page.goto("/");
  const date = page.getByLabel("Ngày sinh", { exact: false });
  await date.evaluate((el: HTMLInputElement) => {
    el.value = "1992-06-15";
  });
  await expect(date).toHaveValue("1992-06-15");
  await page.getByRole("button", { name: "Kiểm tra thông tin" }).click();
  await expect(date).toHaveValue("");
  await expect(page.getByRole("alert").first()).toBeVisible();
});
test("profile validation agrees with server and retains civil date on profile change", async ({
  page,
}) => {
  await page.goto("/");
  const date = page.getByLabel("Ngày sinh", { exact: false });
  await date.fill("1960-01-01");
  await page.getByLabel("Tôi hiểu giới hạn").check();
  await page.getByRole("button", { name: "Kiểm tra thông tin" }).click();
  await expect(page.getByText(/chỉ hỗ trợ ngày sinh từ/)).toContainText(
    "1976–2050",
  );
  await expect(date).toHaveValue("1960-01-01");
  await page.getByLabel("Hệ lịch tính lá số").selectOption("cn-reference");
  await expect(date).toHaveAttribute("min", "1900-01-01");
  await expect(date).toHaveValue("1960-01-01");
  const r = await page.request.post("/api/chart", {
    headers: { Origin: process.env.E2E_ORIGIN || "http://localhost:3000" },
    data: {
      date: "1960-01-01",
      hour: 10,
      minute: 30,
      unknownTime: false,
      place: "Hà Nội — QA",
      gender: "female",
      calendar: "solar",
      profile: "vn-utc7-midnight-v1",
      timezone: "Asia/Ho_Chi_Minh",
      consent: true,
    },
  });
  expect(r.status()).toBe(400);
  expect((await r.json()).fields.date.join()).toContain("1976–2050");
});
