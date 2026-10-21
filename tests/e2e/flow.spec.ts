import { test, expect } from "./fixtures/worker";
for (const width of [360, 390])
  test(`mobile ${width}: input, chart, demo payment, durable report`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Để lập lá số của bạn" }),
    ).toBeVisible();
    await page.getByLabel("Ngày sinh", { exact: false }).fill("2000-08-16");
    await page.getByLabel("Giờ sinh", { exact: true }).selectOption("3");
    await page.getByLabel("Phút sinh", { exact: true }).selectOption("0");
    await page.getByLabel("Nơi sinh", { exact: true }).fill("Hà Nội");
    await page
      .getByLabel("Hệ lịch tính lá số")
      .selectOption(width === 360 ? "vn-utc7-midnight-v1" : "cn-reference");
    await page.getByLabel("Tôi hiểu giới hạn").check();
    await page.getByRole("button", { name: "Kiểm tra thông tin" }).click();
    await page
      .getByRole("button", { name: "Xác nhận & lập lá số miễn phí" })
      .click();
    await expect(
      page.getByRole("heading", { name: "Mười hai cung, một tổng thể" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Danh sách", exact: true }).click();
    await expect(page.locator(".palace")).toHaveCount(12);
    await page.getByRole("button", { name: "Phóng to", exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "12 cung", exact: true }).click();
    await expect(page.locator(".palace-picker button")).toHaveCount(12);
    await page.locator(".palace-picker button").first().click();
    await expect(page.locator(".explorer-detail")).toContainText("Mệnh");
    await page.getByRole("button", { name: "Xem các gói luận giải" }).click();
    await page.getByLabel("Email nhận kết quả").fill("mobile@example.invalid");
    await page
      .getByRole("button", { name: "Tiếp tục thanh toán QR demo" })
      .click();
    await expect(
      page.getByText("Đang chờ thanh toán", { exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByText("Đang chờ thanh toán", { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Mô phỏng webhook đã nhận tiền" })
      .click();
    await expect(
      page.getByRole("heading", { name: "Báo cáo dữ kiện tham chiếu" }),
    ).toBeVisible({ timeout: 30000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const topic of ["overview", "career"]) {
      const section = page.getByTestId(`topic-${topic}`);
      await expect(section).toBeVisible();
      await section.getByText("Xem căn cứ", { exact: true }).click();
      await expect(section.locator(".evidence").first()).toBeVisible();
      await expect(page.locator(".reading-status")).toContainText(
        "chưa được chuyên gia độc lập xác nhận",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    const id = await page.evaluate(() => localStorage.getItem("tuvi-order"));
    const payload = await (
      await page.request.get(`/api/order?id=${id}`)
    ).json();
    expect(payload.report.snapshot).toBeUndefined();
    expect(JSON.stringify(payload.report)).not.toMatch(
      /evidencePaths|isBodyPalace|not-approved|ruleSetHash/,
    );
    await page.getByTestId("topic-overview").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `.local/reading-review/customer-${width}.png`,
    });
    const anonymous = await context.browser()!.newContext();
    const denied = await anonymous.request.get(
      `${process.env.E2E_ORIGIN || "http://localhost:3000"}/api/order?id=${id}`,
    );
    expect(denied.status()).toBe(401);
    await anonymous.close();
  });
test("keyboard, unknown time and server price tampering", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Tử vi trang chủ" }),
  ).toBeFocused();
  await page.getByLabel("Ngày sinh", { exact: false }).fill("2000-08-16");
  await page.getByLabel("Tôi chưa rõ giờ sinh").check();
  await page.getByLabel("Nơi sinh", { exact: true }).fill("Hà Nội");
  await page.getByLabel("Hệ lịch tính lá số").selectOption("cn-reference");
  await page.getByLabel("Tôi hiểu giới hạn").check();
  await page.getByRole("button", { name: "Kiểm tra thông tin" }).click();
  await page
    .getByRole("button", { name: "Xác nhận & lập lá số miễn phí" })
    .click();
  await expect(page.locator(".alert.error")).toContainText("Chưa rõ giờ sinh");
  const res = await page.request.post("/api/orders", {
    headers: { Origin: process.env.E2E_ORIGIN || "http://localhost:3000" },
    data: {
      birth: {
        date: "2000-08-16",
        hour: 3,
        minute: 0,
        unknownTime: false,
        place: "Hà Nội",
        gender: "female",
        calendar: "solar",
        profile: "cn-reference",
        timezone: "Asia/Ho_Chi_Minh",
        consent: true,
      },
      packageId: "complete",
      topic: "Tổng quan",
      year: 2026,
      email: "test@example.invalid",
      confirmed: true,
      amount: 1,
    },
  });
  expect(res.status()).toBe(400);
});

test("email fragment exchange and replay rejection", async ({ page }) => {
  const { readdir, readFile, stat } = await import("node:fs/promises");
  const files = await readdir(".local/mail");
  const messages = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (f) => ({
        ...JSON.parse(await readFile(".local/mail/" + f, "utf8")),
        mtime: (await stat(".local/mail/" + f)).mtimeMs,
      })),
  );
  const mail = messages
    .sort((a, b) => b.mtime - a.mtime)
    .find((m) => m.to === "mobile@example.invalid");
  expect(mail).toBeTruthy();
  await page.goto(mail.link);
  await expect(
    page.getByRole("button", { name: "Xác thực liên kết" }),
  ).toBeVisible();
  expect(new URL(page.url()).hash).toBe("");
  await page.getByRole("button", { name: "Xác thực liên kết" }).click();
  await expect(
    page.getByRole("heading", { name: "Báo cáo dữ kiện tham chiếu" }),
  ).toBeVisible();
  await page.goto(mail.link);
  await page.getByRole("button", { name: "Xác thực liên kết" }).click();
  await expect(page.getByRole("status")).toContainText(
    "không hợp lệ hoặc đã hết hạn",
  );
});

test("legacy report without interpretation remains readable; presentation fixture only", async ({
  page,
}) => {
  const { calculate } = await import("../../lib/tuvi-engine");
  const { buildReport } = await import("../../lib/reports");
  const { interpretation: _newField, ...legacy } = await buildReport(
    await calculate({
      date: "2000-08-16",
      hour: 3,
      minute: 0,
      unknownTime: false,
      place: "Hà Nội",
      gender: "female",
      calendar: "solar",
      profile: "cn-reference",
      timezone: "Asia/Ho_Chi_Minh",
      consent: true,
    }),
    { groups: ["Tổng quan"], year: null },
  );
  const id = "00000000-0000-4000-8000-000000000001";
  await page.setViewportSize({ width: 360, height: 844 });
  await page.addInitScript((id) => localStorage.setItem("tuvi-order", id), id);
  await page.route("**/api/order?*", async (route) =>
    route.fulfill({
      json: {
        order: {
          id,
          code: "TEST-LEGACY",
          amount: 99000,
          package: { name: "Một chủ đề" },
          scope: legacy.scope,
          expiresAt: "2099-01-01",
          paymentStatus: "paid",
          reportStatus: "ready",
          emailStatus: "local",
        },
        payment: null,
        report: (await import("../../lib/reading/customer")).customerReport(
          legacy,
        ),
      },
    }),
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Báo cáo dữ kiện tham chiếu" }),
  ).toBeVisible();
  await expect(page.getByTestId("topic-overview")).toBeVisible();
  await page.getByText("Xem căn cứ", { exact: true }).click();
  await expect(page.getByTestId("customer-report")).not.toContainText(
    "snapshot",
  );
  await expect(page.getByTestId("customer-report")).not.toContainText(
    "fact.palace",
  );
});
