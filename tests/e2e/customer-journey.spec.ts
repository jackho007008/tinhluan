import { test, expect } from "./fixtures/worker";
import { loadEnvFile } from "node:process";
import { Pool } from "pg";
import { readFile, writeFile } from "node:fs/promises";
loadEnvFile(".env");
for (const width of [360, 390, 1280])
  test(`customer journey ${width}: demo order, retry-safe webhook and private recovery`, async ({
    page,
    context,
  }) => {
    test.setTimeout(90000);
    const db = new Pool({ connectionString: process.env.DATABASE_URL });
    const shot = async (name: string) => {
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBe(true);
      await page.screenshot({
        path: `docs/evidence/customer-journey/${width}-${name}.png`,
      });
    };
    try {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.getByLabel("Ngày sinh", { exact: false }).fill("1992-06-15");
      await page.getByLabel("Giờ sinh", { exact: true }).selectOption("10");
      await page.getByLabel("Phút sinh", { exact: true }).selectOption("30");
      await page
        .getByLabel("Nơi sinh", { exact: true })
        .fill("Hà Nội — mẫu QA giả lập");
      await page.getByLabel("Tôi hiểu giới hạn").check();
      await page.getByRole("button", { name: "Kiểm tra thông tin" }).click();
      await expect(page.locator(".confirmation")).toContainText(
        "1992-06-15 · 10:30",
      );
      await page.locator(".confirmation").scrollIntoViewIfNeeded();
      await shot("confirmation");
      const response = page.waitForResponse(
        (r) =>
          r.url().endsWith("/api/chart") && r.request().method() === "POST",
      );
      await page
        .getByRole("button", { name: "Xác nhận & lập lá số miễn phí" })
        .click();
      const first = await (await response).json();
      expect(first.normalized.date).toBe("1992-06-15");
      expect(first.profile.id).toBe("tanbien-vn-trial-v2");
      await page
        .getByRole("button", { name: "Sửa thông tin", exact: true })
        .click();
      await expect(page.getByLabel("Ngày sinh", { exact: false })).toHaveValue(
        "1992-06-15",
      );
      await page.getByLabel("Ngày sinh", { exact: false }).fill("1992-06-16");
      await page.getByRole("button", { name: "Kiểm tra thông tin" }).click();
      const changed = page.waitForResponse(
        (r) =>
          r.url().endsWith("/api/chart") && r.request().method() === "POST",
      );
      await page
        .getByRole("button", { name: "Xác nhận & lập lá số miễn phí" })
        .click();
      const second = await (await changed).json();
      expect(second.resultId).not.toBe(first.resultId);
      expect(second.normalized.date).toBe("1992-06-16");
      await page
        .getByRole("button", { name: "Danh sách", exact: true })
        .click();
      await expect(page.locator(".palace")).toHaveCount(12);
      await page.getByRole("button", { name: "Phóng to", exact: true }).click();
      await shot("chart");
      await page.getByRole("button", { name: "Xem các gói luận giải" }).click();
      await page
        .getByLabel("Email nhận kết quả")
        .fill(`journey-${width}@example.invalid`);
      await shot("packages");
      const before = (
        await db.query("SELECT count(*)::int n FROM orders WHERE email=$1", [
          `journey-${width}@example.invalid`,
        ])
      ).rows[0].n;
      await page
        .getByRole("button", { name: "Tiếp tục thanh toán QR demo" })
        .dblclick();
      await expect(
        page.getByText("Đang chờ thanh toán", { exact: true }),
      ).toBeVisible();
      const id = await page.evaluate(() => localStorage.getItem("tuvi-order"));
      const o = (
        await db.query("SELECT code,amount,scope FROM orders WHERE id=$1", [id])
      ).rows[0];
      expect(o.amount).toBe(199000);
      expect(o.scope.interpretation).toBe(false);
      await expect(
        page.getByText("QR MÔ PHỎNG · KHÔNG CHUYỂN TIỀN"),
      ).toBeVisible();
      await shot("qr");
      await page.reload();
      await expect(
        page.getByText("Đang chờ thanh toán", { exact: true }),
      ).toBeVisible();
      expect(
        (
          await db.query("SELECT count(*)::int n FROM orders WHERE email=$1", [
            `journey-${width}@example.invalid`,
          ])
        ).rows[0].n,
      ).toBe(before + 1);
      // Existing signed demo webhook; repeat must not duplicate downstream jobs.
      await page
        .getByRole("button", { name: "Mô phỏng webhook đã nhận tiền" })
        .click();
      await page.request.post("/api/mock-pay", {
        headers: { Origin: process.env.E2E_ORIGIN || "http://localhost:3000" },
        data: { id },
      });
      await expect(
        page.getByRole("heading", { name: "Báo cáo dữ kiện tham chiếu" }),
      ).toBeVisible({ timeout: 30000 });
      await page.getByTestId("customer-report").scrollIntoViewIfNeeded();
      await shot("report");
      const result = await (
        await page.request.get("/api/order?id=" + id)
      ).json();
      expect(JSON.stringify(result.report)).not.toMatch(
        /combination\.|reading\.overview|evidencePaths|not-approved/,
      );
      expect(
        result.report.topics.every(
          (t: { claims: unknown[] }) => t.claims.length === 0,
        ),
      ).toBe(true);
      const counts = (
        await db.query(
          "SELECT (SELECT count(*)::int FROM report_jobs WHERE order_id=$1) jobs,(SELECT count(*)::int FROM reports WHERE order_id=$1) reports,(SELECT count(*)::int FROM email_deliveries WHERE order_id=$1) emails",
          [id],
        )
      ).rows[0];
      expect(counts).toEqual({ jobs: 1, reports: 1, emails: 1 });
      await page.reload();
      await expect(page.getByTestId("customer-report")).toBeVisible();
      await expect
        .poll(
          async () =>
            (
              await db.query("SELECT email_status FROM orders WHERE id=$1", [
                id,
              ])
            ).rows[0].email_status,
        )
        .toBe("local");
      const delivery = (
        await db.query("SELECT id FROM email_deliveries WHERE order_id=$1", [
          id,
        ])
      ).rows[0].id;
      const mail = JSON.parse(
        await readFile(`.local/mail/${delivery}.json`, "utf8"),
      );
      const other = await context.browser()!.newContext();
      try {
        expect(
          (
            await other.request.get(`${process.env.E2E_ORIGIN || "http://localhost:3000"}/api/order?id=${id}`)
          ).status(),
        ).toBe(401);
        const p = await other.newPage();
        await p.goto((process.env.E2E_ORIGIN || "http://localhost:3000")+"/");
        // Token stays in memory; never print URL, trace it, or put it in an assertion message.
        await p.evaluate((link: string) => location.assign(link), mail.link);
        await p.getByRole("button", { name: "Xác thực liên kết" }).waitFor();
        expect(new URL(p.url()).hash.length).toBe(0);
        await p.getByRole("button", { name: "Xác thực liên kết" }).click();
        await expect(p.getByTestId("customer-report")).toBeVisible();
        await p.evaluate((link: string) => location.assign(link), mail.link);
        await p.getByRole("button", { name: "Xác thực liên kết" }).click();
        await expect(p.getByRole("status")).toContainText(
          "không hợp lệ hoặc đã hết hạn",
        );
      } finally {
        await other.close();
      }
      await writeFile(
        `docs/evidence/customer-journey/order-${width}.json`,
        JSON.stringify(
          {
            label: "Đơn demo QA mới — thông tin giả lập",
            id,
            code: o.code,
            width,
            date: "1992-06-16",
            hour: 10,
            minute: 30,
            profile: "vn-utc7-midnight-v1",
            counts,
          },
          null,
          2,
        ),
      );
    } finally {
      await db.end();
    }
  });
