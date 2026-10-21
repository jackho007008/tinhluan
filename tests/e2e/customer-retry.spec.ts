// Run with external worker stopped. Only a new QA order is fault-injected.
import { test, expect } from "@playwright/test";
import { loadEnvFile } from "node:process";
import { Pool } from "pg";
import { pool as jobPool } from "../../lib/db";
test.afterAll(async () => { await jobPool.end(); });
import { runReportJob, runEmailJob } from "../../lib/jobs";
loadEnvFile(".env");
test("demo queued and failed report recovers without another payment", async ({
  page,
}) => {
  const db = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const r = await page.request.post("/api/orders", {
      headers: { Origin: process.env.E2E_ORIGIN || "http://localhost:3000" },
      data: {
        birth: {
          date: "1992-06-15",
          hour: 10,
          minute: 30,
          unknownTime: false,
          place: "Hà Nội — QA retry giả lập",
          gender: "female",
          calendar: "solar",
          profile: "vn-utc7-midnight-v1",
          timezone: "Asia/Ho_Chi_Minh",
          consent: true,
        },
        packageId: "complete",
        topic: "Tổng quan",
        year: 2026,
        email: "journey-retry@example.invalid",
        confirmed: true,
      },
    });
    expect(r.ok()).toBe(true);
    const { id } = await r.json();
    await page.addInitScript(
      (id) => localStorage.setItem("tuvi-order", id),
      id,
    );
    await page.goto("/");
    await page
      .getByRole("button", { name: "Mô phỏng webhook đã nhận tiền" })
      .click();
    for (const width of [360, 390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator(".progress-list").scrollIntoViewIfNeeded();
      await expect(page.locator(".progress-list")).toContainText(
        "Đang chờ xử lý",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `docs/evidence/customer-journey/${width}-processing.png`,
      });
    }
    await db.query(
      "UPDATE report_jobs SET status='failed', attempts=5 WHERE order_id=$1",
      [id],
    );
    await db.query("UPDATE orders SET report_status='failed' WHERE id=$1", [
      id,
    ]);
    await page.reload();
    await expect(page.locator(".progress-list")).toContainText(
      "Tạo báo cáo chưa thành công",
    );
    await page.getByRole("button", { name: "Thử tạo lại báo cáo" }).click();
    await expect
      .poll(
        async () =>
          (
            await db.query(
              "SELECT payment_status,report_status FROM orders WHERE id=$1",
              [id],
            )
          ).rows[0],
      )
      .toEqual({ payment_status: "paid", report_status: "queued" });
    await expect
      .poll(async () => {
        await runReportJob();
        await runEmailJob();
        return (
          await db.query("SELECT report_status FROM orders WHERE id=$1", [id])
        ).rows[0].report_status;
      })
      .toBe("ready");
    await page.reload();
    await expect(page.getByTestId("customer-report")).toBeVisible();
    const { writeFile } = await import("node:fs/promises");
    await writeFile(
      "docs/evidence/customer-journey/retry-order.json",
      JSON.stringify(
        {
          id,
          label:
            "Đơn QA retry: trạng thái lỗi được chèn riêng bằng SQL, phục hồi bằng endpoint/worker có sẵn",
        },
        null,
        2,
      ),
    );
  } finally {
    await db.end();
  }
});
