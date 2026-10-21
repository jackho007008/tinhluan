import { test, expect } from "@playwright/test";
test("beta default-off releases no draft from page or API even with a supplied token", async ({
  page,
}) => {
  await page.goto("/beta");
  await expect(
    page.getByRole("heading", { name: "Đợt đọc thử chưa được mở" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Tôi hiểu phạm vi và đồng ý bắt đầu" }),
  ).toHaveCount(0);
  const reading = await page.request.get("/api/beta/reading");
  expect(reading.status()).toBe(404);
  expect(await reading.json()).not.toHaveProperty("document");
  for (const action of ["exchange", "start", "feedback"]) {
    const res = await page.request.post("/api/beta/" + action, {
      headers: { Origin: process.env.E2E_ORIGIN || "http://localhost:3000" },
      data: { token: "synthetic-invalid-not-a-real-token" },
    });
    expect(res.status()).toBe(404);
    expect(await res.json()).not.toHaveProperty("document");
  }
});
