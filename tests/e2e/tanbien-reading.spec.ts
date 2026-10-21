const artifacts =
  process.env.E2E_ARTIFACT_DIR || "exports/tanbien-reading-v1.2";
import { observeJSON } from "./json-observation";
import { test, expect, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { loadSample } from "../../lib/internal-review/samples";
import { issueReviewSession } from "../../lib/internal-review/auth";
const origin = process.env.E2E_ORIGIN || "http://localhost:3000";
const url = "/internal/editorial/demo-wuqu-tianfu?view=reading";
// Current default is the customer report. These legacy assertions exercise the
// explicit internal verification view; their source/history expectations stay intact.
async function openVerification(page: Page) {
  await page.waitForURL(/\/internal\/readings\?id=/);
  const u = new URL(page.url());
  if (u.searchParams.get("mode") !== "internal") {
    u.searchParams.set("mode", "internal");
    await page.goto(u.toString(), { waitUntil: "networkidle" });
  }
}
test("rule narrative stays internal, switches samples, and opens evidence on 360/390", async ({
  browser,
}) => {
  test.setTimeout(90000);
  const anon = await browser.newContext();
  const denied = await anon.newPage();
  await denied.goto(url);
  await expect(
    denied.getByRole("heading", { name: "Cần quyền kiểm tra nội bộ" }),
  ).toBeVisible();
  await anon.close();
  await mkdir(artifacts, { recursive: true });
  for (const width of [360, 390]) {
    const ctx = await browser.newContext({
      viewport: { width, height: 844 },
      baseURL: origin,
    });
    await ctx.addCookies([
      {
        name: "tuvi_internal",
        value: issueReviewSession(),
        url: origin,
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    const runtimeErrors: string[] = [];
    const page = await ctx.newPage();
    await observeJSON(page);
    page.on("pageerror", (error) => {
      runtimeErrors.push(error.message);
      console.error("Preview runtime error:", error.stack);
    });
    try {
      await page.goto(url);
      await expect(page.locator("[data-claim]")).toHaveCount(7);
      const a = await page
        .locator('[data-testid="rule-reading"]')
        .getAttribute("data-snapshot");
      await page
        .getByRole("heading", { name: "Các yếu tố tại cung Mệnh" })
        .scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${artifacts}/reading-${width}.png`,
      });
      const first = page.locator("[data-claim]").first();
      await first.locator("[data-evidence] > summary").click();
      await expect(first.locator("details").first()).toHaveAttribute(
        "open",
        "",
      );
      await expect(first.locator("[data-technical]")).not.toHaveAttribute(
        "open",
        "",
      );
      const ordinary = await first.locator("[data-evidence]").evaluate((el) => {
        const clone = el.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("[data-technical]").forEach((n) => n.remove());
        return clone.textContent;
      });
      expect(ordinary).not.toMatch(
        /fact\.|chart\.|tanbien\.r|dan-than|Snapshot:|Claim ID/,
      );
      await first.locator("[data-technical] > summary").click();
      await expect(first.locator("[data-technical]")).toHaveAttribute(
        "open",
        "",
      );
      await expect(first).toContainText("tanbien.r01@0.5.0");
      await expect(first).toContainText(a!);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await first.locator("[data-technical]").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${artifacts}/technical-${width}.png`,
      });
      await first.locator("[data-technical] > summary").click();
      await first.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${artifacts}/evidence-${width}.png`,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const finance = page
        .locator('[data-section="finance"] [data-evidence]')
        .first();
      await finance.locator(":scope > summary").click();
      await expect(finance).toContainText("Tài Bạch tại Thân.");
      await expect(finance).toContainText(
        "Tài Bạch có một chính tinh là Liêm Trinh.",
      );
      const context = page.locator('[data-context="finance"]');
      await page.locator('[data-section="finance"] a[href="#context-finance"]').first().click();
      await expect(context).toBeVisible();
      await expect(context).toHaveAttribute("open", "");
      await expect(context).toContainText("Tài Bạch ghi nhận Tuần Không.");
      await context.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${artifacts}/context-${width}.png`,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.locator('select[name="sample"]').selectOption("vn-2");
      await page.getByRole("button", { name: "Đối chiếu rule" }).click();
      await expect(
        page.locator('[data-testid="rule-reading"]'),
      ).not.toHaveAttribute("data-snapshot", a!);
      await expect(
        page.locator('[data-section="action"] [data-claim]'),
      ).toHaveCount(0);
      await expect(page.locator("[data-life-major-notice]")).toContainText("Mệnh");
      await expect(page.locator("[data-section=finance] [data-claim]")).toHaveCount(1);
      await page.locator('select[name="sample"]').selectOption("vn-12");
      await page.getByRole("button", { name: "Đối chiếu rule" }).click();
      await expect(page.locator('[data-section="action"]')).toContainText(
        "Thiên Phủ thủ Mệnh",
      );
      await expect(page.locator('[data-section="action"]')).not.toContainText(
        "Vũ Khúc tại Mệnh ở",
      );
      await page.locator('select[name="sample"]').selectOption("vn-20");
      await page.getByRole("button", { name: "Đối chiếu rule" }).click();
      await expect(page.locator("[data-claim]")).toHaveCount(4);
      await expect(
        page.locator("[data-section=action] [data-interpretation]").filter({ hasText: "Thiên Phủ" }),
      ).toHaveCount(0);
      await expect(page.locator('[data-context="finance"]')).toHaveCount(1);
      const current = await page
        .locator('[data-testid="rule-reading"]')
        .getAttribute("data-snapshot");
      const evidence = page.locator("[data-evidence]").first();
      await evidence.locator(":scope > summary").click();
      await evidence.locator("[data-technical] > summary").click();
      await expect(evidence).toContainText(current!);
      await expect(evidence).not.toContainText(a!);
      await expect(
        page.getByRole("heading", { name: "Sự chủ động", exact: true }),
      ).toBeVisible();
      for (const [sample, star, rule] of [
        ["vn-4", "Tử Vi", "tanbien.r08"],
        ["vn-6", "Thiên Tướng", "tanbien.r09"],
        ["vn-lianzhen", "Liêm Trinh", "tanbien.r10"],
        ["vn-tanlang", "Tham Lang", "tanbien.r11"],
        ["vn-jumen", "Cự Môn", "tanbien.r12"],
        ["vn-jumen", "Thiên Cơ", "tanbien.r13"],
        ["vn-0", "Thái Âm", "tanbien.r16"],
        ["vn-taiyang", "Thái Dương", "tanbien.r14"],
        ["vn-tiantong", "Thiên Đồng", "tanbien.r15"],
        ["vn-tianliang", "Thiên Lương", "tanbien.r17"],
        ["vn-qisha", "Thất Sát", "tanbien.r18"],
        ["vn-pojun", "Phá Quân", "tanbien.r19"],
      ]) {
        await page.locator('select[name="sample"]').selectOption(sample);
        await page.getByRole("button", { name: "Đối chiếu rule" }).click();
        await expect(page.locator("[data-claim]")).toHaveCount(
          ["vn-lianzhen", "vn-jumen", "vn-0", "vn-tianliang", "vn-qisha"].includes(sample)
            ? 3
            : 2,
        );
        const article = page
          .locator("[data-section=action] [data-claim], [data-section=learning] [data-claim]")
          .filter({
            has: page
              .locator("[data-interpretation]")
              .filter({ hasText: star }),
          })
          .last();
        const evidence = article.locator("[data-evidence]");
        await article.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${artifacts}/${sample}-${rule}-reading-${width}.png`,
        });
        await evidence.locator(":scope > summary").click();
        await expect(evidence).toContainText(star);
        const selected = (await loadSample(sample))!.report.snapshot;
        await expect(
          page.locator("[data-testid=rule-reading]"),
        ).toHaveAttribute("data-snapshot", selected.resultId);
        const main = await article.evaluate((el) => {
          const copy = el.cloneNode(true) as HTMLElement;
          copy.querySelectorAll("details").forEach((d) => d.remove());
          return copy.textContent || "";
        });
        expect(main).not.toContain("chưa đồng nhất");
        if (["vn-6", "vn-lianzhen"].includes(sample))
          await expect(evidence).toContainText("chưa đồng nhất với Địa Không");
        if (["tanbien.r14", "tanbien.r16"].includes(rule))
          await expect(
            article.locator("[data-scope-note]").last(),
          ).toContainText("Chưa đánh giá mức thuận theo ngày/đêm");
        await expect(page).toHaveURL(new RegExp(`sample=${sample}`));
        if (sample === "vn-4")
          await expect(page.locator("[data-unassessed]")).toContainText(
            "Triệt Lộ tại Mệnh",
          );
        if (sample === "vn-6")
          await expect(page.locator("[data-unassessed]")).toContainText(
            "Hỏa Tinh",
          );
        await expect(evidence).toContainText("Điều kiện và nội dung trong tài liệu nguồn");
        await expect(evidence).toContainText("Phạm vi triển khai và giới hạn biên soạn");
        await evidence.locator("[data-technical] > summary").click();
        await expect(evidence).toContainText(
          rule +
            (["tanbien.r08", "tanbien.r09"].includes(rule)
              ? "@0.3.1"
              : "@0.1.1"),
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await evidence.locator("[data-technical] > summary").click();
        await article.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${artifacts}/${sample}-${rule}-${width}.png`,
        });
      }
      await page.locator('select[name="sample"]').selectOption("vn-16");
      await page.getByRole("button", { name: "Đối chiếu rule" }).click();
      await expect(page).toHaveURL(/sample=vn-16/);
      await expect(page.locator("[data-claim]")).toHaveCount(3);
      await expect(
        page.locator("[data-section=finance] [data-interpretation]"),
      ).toContainText("Lộc Tồn");
      await expect(
        page.locator("[data-section=learning] [data-interpretation]"),
      ).toContainText("Thái Dương");
      await expect(page.locator("[data-section=action]")).toHaveCount(0);
      await page.locator('select[name="sample"]').selectOption("");
      await page.getByRole("button", { name: "Đối chiếu rule" }).click();
      await expect(
        page.locator('[data-testid="rule-reading"]'),
      ).toHaveAttribute("data-snapshot", a!);
      await expect(page.locator("[data-claim]")).toHaveCount(7);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(runtimeErrors).toEqual([]);
    } catch (error) {
      await page.screenshot({ path: `${artifacts}/diagnostic-${width}.png` });
      console.error(
        "Internal preview diagnostic:",
        await page.locator("h1").allTextContents(),
      );
      throw error;
    } finally {
      await ctx.close();
    }
  }
});

test("Cơ–Cự source condition stays distinct while switching matched and unmatched snapshots", async ({
  browser,
}) => {
  await mkdir(artifacts, { recursive: true });
  for (const width of [360, 390]) {
    const ctx = await browser.newContext({
      viewport: { width, height: 844 },
      baseURL: origin,
    });
    await ctx.addCookies([
      {
        name: "tuvi_internal",
        value: issueReviewSession(),
        url: origin,
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    const page = await ctx.newPage();
    await observeJSON(page);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    try {
      await page.goto(url + "&sample=vn-co-cu-loc");
      const selected = (await loadSample("vn-co-cu-loc"))!.report.snapshot;
      const check = async () => {
        await expect(
          page.locator("[data-testid=rule-reading]"),
        ).toHaveAttribute("data-snapshot", selected.resultId);
        await expect(page.locator("[data-claim]")).toHaveCount(4);
        await expect(
          page
            .locator("[data-interpretation]")
            .filter({ hasText: "cách ăn nói thiếu thận trọng" }),
        ).toHaveCount(1);
      };
      await check();
      const combined = page.locator("[data-claim]").filter({
        has: page
          .locator("[data-interpretation]")
          .filter({ hasText: "cách ăn nói thiếu thận trọng" }),
      });
      await expect(combined).toContainText("Nhận định phối hợp có điều kiện");
      await expect(combined).toContainText("không tự hòa giải");
      await combined.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${artifacts}/co-cu-reading-${width}.png`,
      });
      const evidence = combined.locator("[data-evidence]");
      await evidence.locator(":scope > summary").click();
      await expect(evidence).toContainText("Lộc Tồn");
      await expect(evidence).toContainText("Mệnh tại Dậu");
      await expect(evidence).toContainText("PDF 89 / trang in 89");
      await combined.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${artifacts}/co-cu-evidence-${width}.png`,
      });
      await evidence.locator("[data-technical] > summary").click();
      await expect(evidence).toContainText("tanbien.r20@0.1.1");
      await expect(evidence).toContainText(selected.resultId);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await evidence.locator("[data-technical]").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${artifacts}/co-cu-trace-${width}.png` });
      await page.locator("select[name=sample]").selectOption("vn-jumen");
      await page.getByRole("button", { name: "Đối chiếu rule" }).click();
      await expect(page).toHaveURL(/sample=vn-jumen/);
      await expect(page.locator("[data-claim]")).toHaveCount(3);
      await expect(
        page
          .locator("[data-interpretation]")
          .filter({ hasText: "cách ăn nói thiếu thận trọng" }),
      ).toHaveCount(0);
      await expect(page.locator("[data-testid=rule-reading]")).toHaveAttribute(
        "data-snapshot",
        (await loadSample("vn-jumen"))!.report.snapshot.resultId,
      );
      await page.reload();
      await expect(page.locator("[data-claim]")).toHaveCount(3);
      await page.goBack();
      await check();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
    } finally {
      await ctx.close();
    }
  }
});

test("editorial five readings preserve displayed text, evidence and navigation at 360/390", async ({
  browser,
}) => {
  const url = "/internal/editorial/demo-wuqu-tianfu?view=reading&readingVersion=1.8.0";
  const { readFileSync } = await import("node:fs");
  const rows = JSON.parse(
    readFileSync("exports/tanbien-reading-examples.json", "utf8"),
  );
  await mkdir(artifacts, { recursive: true });
  for (const width of [360, 390]) {
    const ctx = await browser.newContext({
      viewport: { width, height: 844 },
      baseURL: origin,
    });
    await ctx.addCookies([
      {
        name: "tuvi_internal",
        value: issueReviewSession(),
        url: origin,
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    const page = await ctx.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    try {
      await page.goto(url);
      for (const id of [
        "demo-wuqu-tianfu",
        "vn-0",
        "vn-co-cu-loc",
        "vn-jumen",
        "vn-16",
      ]) {
        const row = rows.find((r: any) => r.id === id);
        await page
          .locator("select[name=sample]")
          .selectOption(id === "demo-wuqu-tianfu" ? "" : id);
        await page.getByRole("button", { name: "Đối chiếu rule" }).click();
        await expect(
          page.locator("[data-testid=rule-reading]"),
        ).toHaveAttribute("data-snapshot", row.snapshotId);
        await expect(page.locator("[data-editorial-introduction]")).toHaveText(
          row.introduction.text,
        );
        await expect(page.locator("[data-opening-facts]")).toHaveText(
          row.openingFacts.map((f: any) => f.text).join(" "),
        );
        await expect(page.locator("[data-interpretation]")).toHaveText(
          row.sections.flatMap((s: any) =>
            s.paragraphs.map((p: any) => p.display.text),
          ),
        );
        await page.locator("[data-glossary] > summary").click();
        await expect(page.locator("[data-glossary]")).toContainText(
          "Đồng cung nghĩa",
        );
        await page.locator("[data-glossary] > summary").click();
        await page
          .locator("[data-testid=rule-reading] h1")
          .scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${artifacts}/${id}-opening-${width}.png`,
        });
        const cards = page.locator("[data-claim]");
        const selected = id === "vn-co-cu-loc" ? cards.last() : cards.first();
        await selected.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${artifacts}/${id}-reading-${width}.png`,
        });
        const main = await selected.evaluate((el) => {
          const c = el.cloneNode(true) as HTMLElement;
          c.querySelectorAll("details").forEach((x) => x.remove());
          return c.textContent || "";
        });
        expect(main).not.toMatch(
          /không tự hòa giải|brightness|evaluator|chart\.|fact\./,
        );
        const ev = selected.locator("[data-evidence]");
        await ev.locator(":scope > summary").click();
        if (id === "vn-co-cu-loc") {
          await expect(ev).toContainText("không tự hòa giải");
          await expect(selected.locator("[data-scope-note]")).toContainText(
            "chưa đủ để đánh giá",
          );
        }
        await selected.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${artifacts}/${id}-evidence-${width}.png`,
        });
        await ev.locator("[data-technical] > summary").click();
        await expect(ev).toContainText(row.snapshotId);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await ev.locator("[data-technical] > summary").click();
        await ev.locator(":scope > summary").click();
        if (id === "vn-16") {
          await expect(page.locator("[data-section=action]")).toHaveCount(0);
          await expect(
            page.locator("[data-section=finance] [data-interpretation]"),
          ).toContainText("Lộc Tồn");
          await expect(
            page.locator("[data-section=learning] [data-interpretation]"),
          ).toContainText("văn chương");
        }
      }
      await page.goBack();
      await expect(page.locator("[data-claim]")).toHaveCount(2);
      await page.reload();
      await expect(page.locator("[data-claim]")).toHaveCount(2);
      expect(errors).toEqual([]);
    } finally {
      await ctx.close();
    }
  }
});

test("Sun source branches and linked limits remain distinct on 360/390", async ({
  browser,
}) => {
  const url = "/internal/editorial/demo-wuqu-tianfu?view=reading&readingVersion=1.8.0";
  const { readFileSync } = await import("node:fs");
  const rows = JSON.parse(
    readFileSync("exports/tanbien-reading-examples.json", "utf8"),
  );
  await mkdir(artifacts, { recursive: true });
  for (const width of [360, 390]) {
    const ctx = await browser.newContext({
      viewport: { width, height: 844 },
      baseURL: origin,
    });
    await ctx.addCookies([
      {
        name: "tuvi_internal",
        value: issueReviewSession(),
        url: origin,
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    const page = await ctx.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    try {
      await page.goto(url);
      for (const id of ["vn-16", "vn-taiyang", "vn-16"]) {
        await page.locator("select[name=sample]").selectOption(id);
        await page.getByRole("button", { name: "Đối chiếu rule" }).click();
        const row = rows.find((r: any) => r.id === id);
        await expect(
          page.locator("[data-testid=rule-reading]"),
        ).toHaveAttribute("data-snapshot", row.snapshotId);
        await expect(page.locator("[data-interpretation]")).toHaveText(
          row.sections.flatMap((s: any) =>
            s.paragraphs.map((p: any) => p.display.text),
          ),
        );
        const card = page.locator("[data-claim]").first();
        await expect(card).toContainText(
          id === "vn-16" ? "văn chương, triết học" : "thẳng thắn, cương nghị",
        );
        await expect(page.locator("[data-life-major-notice]")).toHaveCount(0);
        await card.scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${artifacts}/${id}-main-${width}.png` });
        const link = card.getByRole("link", {
          name: "Xem các yếu tố liên quan chưa được tổng hợp",
        });
        const target = await link.getAttribute("href");
        await link.click();
        await expect(page.locator(target!)).toHaveAttribute("open", "");
        await expect(page.locator(target! + ">summary")).toBeFocused();
        await page.goBack();
        await card.locator("[data-evidence]>summary").click();
        await expect(card.locator("[data-evidence]")).toContainText(
          id === "vn-16" ? "PDF 69" : "PDF / trang in 68",
        );
        await card.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${artifacts}/${id}-evidence-${width}.png`,
        });
        await card.locator("[data-evidence] [data-technical]>summary").click();
        await expect(card).toContainText(row.snapshotId);
        await expect(card).toContainText("tanbien-taiyang-state");
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
      await page.reload();
      await expect(page.locator("[data-section=learning]")).toContainText(
        "văn chương",
      );
      expect(errors).toEqual([]);
    } finally {
      await ctx.close();
    }
  }
});

test("review pack evidence layers and six samples stay aligned at 360/390", async ({
  browser,
}) => {
  const url = "/internal/editorial/demo-wuqu-tianfu?view=reading&readingVersion=1.9.0";
  const { readFileSync } = await import("node:fs");
  const pack = JSON.parse(
    readFileSync("exports/tanbien-review-1.9.0/readings.json", "utf8"),
  );
  await mkdir(artifacts, { recursive: true });
  for (const width of [360, 390]) {
    const ctx = await browser.newContext({
      baseURL: origin,
      viewport: { width, height: 844 },
    });
    await ctx.addCookies([
      {
        name: "tuvi_internal",
        value: issueReviewSession(),
        url: origin,
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    const page = await ctx.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    try {
      await page.goto(url);
      for (const id of [
        "vn-16",
        "demo-wuqu-tianfu",
        "vn-0",
        "vn-co-cu-loc",
        "vn-jumen",
        "vn-2",
        "vn-16",
      ]) {
        await page
          .locator("select[name=sample]")
          .selectOption(id === "demo-wuqu-tianfu" ? "" : id);
        await page.getByRole("button", { name: "Đối chiếu rule" }).click();
        const r = pack.rows.find((x: any) => x.id === id);
        await expect(
          page.locator("[data-testid=rule-reading]"),
        ).toHaveAttribute("data-snapshot", r.snapshotId);
        await expect(page.locator("[data-interpretation]")).toHaveText(
          r.sections.flatMap((s: any) =>
            s.paragraphs.map((p: any) => p.display.text),
          ),
        );
        if (id === "vn-2") {
          await expect(page.locator("[data-claim]")).toHaveCount(0);
          await expect(page.locator("[data-life-major-notice]")).toBeVisible();
          continue;
        }
        const card = page.locator("[data-claim]").first(),
          evidence = card.locator("[data-evidence]");
        if (id === "vn-16") {
          await expect(card.locator("[data-interpretation]")).toContainText(
            "Mệnh ở Tý,",
          );
          await expect(card.locator("[data-interpretation]")).not.toContainText(
            "Hợi hoặc",
          );
          await card.scrollIntoViewIfNeeded();
          await page.screenshot({ path: `${artifacts}/r21-main-${width}.png` });
        }
        await evidence.locator(":scope > summary").click();
        for (const title of [
          "Dữ kiện trên lá số",
          "Điều kiện và nội dung trong tài liệu nguồn",
          "Phạm vi triển khai và giới hạn biên soạn",
        ])
          await expect(
            evidence.getByRole("heading", { name: title, exact: true }),
          ).toBeVisible();
        await expect(evidence.locator("[data-technical]")).not.toHaveAttribute(
          "open",
          "",
        );
        const ordinary = await evidence.evaluate((el) => {
          const c = el.cloneNode(true) as HTMLElement;
          c.querySelectorAll("[data-technical]").forEach((x) => x.remove());
          return c.textContent || "";
        });
        expect(ordinary).not.toMatch(
          /Đối chiếu bảng nguồn:\s*(Đoạn này|Chưa đánh giá|Bản thử|Đoạn phối hợp)/,
        );
        if (id === "vn-16") {
          await expect(evidence).toContainText("Hợi hoặc Tý");
          expect(ordinary).not.toContain(
            "Đoạn này không xác định sở thích thực tế",
          );
          await card.scrollIntoViewIfNeeded();
          await page.screenshot({
            path: `${artifacts}/r21-evidence-${width}.png`,
          });
        }
        await evidence.locator("[data-technical] > summary").click();
        await expect(evidence).toContainText(r.snapshotId);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
      await page.reload();
      await expect(
        page.locator("[data-section=learning] [data-interpretation]"),
      ).toContainText("Mệnh ở Tý,");
      expect(errors).toEqual([]);
    } finally {
      await ctx.close();
    }
  }
});

test("chart conventions mobile separates states, opens palace layers and switches snapshot", async ({
  browser,
}) => {
  await mkdir(artifacts, { recursive: true });
  for (const width of [360, 390]) {
    const ctx = await browser.newContext({
      baseURL: origin,
      viewport: { width, height: 844 },
    });
    await ctx.addCookies([
      {
        name: "tuvi_internal",
        value: issueReviewSession(),
        url: origin,
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    const page = await ctx.newPage();
    try {
      await page.goto(url);
      await page.locator("[data-chart-preview]>summary").click();
      await expect(page.locator("[data-state-context]")).toContainText(
        "Trạng thái theo Tân Biên",
      );
      await page.getByRole("button", { name: "Cung Quan Lộc tại Thìn", exact: true }).click();
      await expect(page.locator(".chart-card")).toContainText("Mệnh chủ");
      await expect(page.locator(".chart-card")).toContainText("Tham Lang");
      const evidence = page.locator(".chart-card > div.evidence");
      await expect(evidence).toContainText("Vòng Trường Sinh");
      await evidence
        .getByText("Nguồn trạng thái — Tử Vi", { exact: true })
        .click();
      await expect(evidence).toContainText("Trạng thái theo Tân Biên: Vượng");
      await expect(evidence).toContainText("Trạng thái gốc iztro đã lưu: Đắc");
      await evidence.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${artifacts}/states-${width}.png` });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.getByRole("button", {name: /^Cung Mệnh tại/}).click();
      await expect(page.locator(".chart-card > div.evidence")).toContainText(
        "Hóa Quyền (bản mệnh)",
      );
      await page.locator("select[name=sample]").selectOption("vn-16");
      await page.getByRole("button", { name: "Đối chiếu rule" }).click();
      const chart = page.locator("[data-chart-preview]");
      if (!(await chart.getAttribute("open")))
        await chart.locator(":scope>summary").click();
      await expect(page.locator(".chart-card > div.evidence")).toHaveCount(0);
      await expect(page.locator(".chart-card")).not.toContainText(
        "Mộc Tam Cục",
      );
      await page.getByRole("button", {name: /^Cung Mệnh tại/}).click();
      await page.locator(".chart-card > div.evidence").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${artifacts}/switched-${width}.png` });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    } finally {
      await ctx.close();
    }
  }
});

test("linh trial is protected, isolated and switches diagnostic samples on mobile", async ({
  browser,
}) => {
  const anon = await browser.newContext({ baseURL: origin });
  const denied = await anon.newPage();
  await denied.goto("/internal/linh-comparison");
  await expect(
    denied.getByRole("heading", { name: "Cần quyền kiểm tra nội bộ" }),
  ).toBeVisible();
  await anon.close();
  await mkdir(artifacts, { recursive: true });
  for (const width of [360, 390]) {
    const ctx = await browser.newContext({
      baseURL: origin,
      viewport: { width, height: 844 },
    });
    await ctx.addCookies([
      {
        name: "tuvi_internal",
        value: issueReviewSession(),
        url: origin,
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    const page = await ctx.newPage();
    try {
      await page.goto("/internal/linh-comparison?sample=vn-tiantong");
      await expect(page.locator("[data-position-change]")).toContainText(
        "ra Mệnh",
      );
      await page.locator("[data-linh-trace]>summary").click();
      await page.screenshot({
        path: `${artifacts}/linh-before-${width}.png`,
        fullPage: true,
      });
      await page.locator("select[name=sample]").selectOption("linh-entry");
      await page.getByRole("button", { name: "Đối chiếu Linh" }).click();
      await expect(page.locator("[data-linh-result]")).toHaveAttribute(
        "data-sample",
        "linh-entry",
      );
      await expect(page.locator("[data-position-change]")).toContainText(
        "vào Mệnh",
      );
      await page.locator("[data-linh-trace]>summary").click();
      await page
        .getByText("Chi tiết kỹ thuật và dữ liệu dẫn xuất", { exact: true })
        .click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `${artifacts}/linh-entry-${width}.png`,
        fullPage: true,
      });
      for (const [sample, transition] of [
        ["technical-linh-enter", "matched → exception"],
        ["technical-linh-leave", "exception → matched"],
      ]) {
        await page.locator("select[name=sample]").selectOption(sample);
        await page.getByRole("button", { name: "Đối chiếu Linh" }).click();
        await expect(page.locator("[data-linh-result]")).toContainText(
          "Fixture kỹ thuật — không phải lá số hợp lệ do engine sinh",
        );
        await expect(
          page.getByRole("heading", { name: "Đối chiếu trạng thái rule" }),
        ).toBeVisible();
        await expect(page.locator("[data-linh-result]")).toContainText(
          transition,
        );
        await page
          .getByText("Lý do trước/sau — combination.ziwei-assistants", {
            exact: true,
          })
          .click();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({
          path: `${artifacts}/${sample}-${width}.png`,
          fullPage: true,
        });
      }
      await page
        .locator("select[name=sample]")
        .selectOption("syn-missing-minor");
      await page.getByRole("button", { name: "Đối chiếu Linh" }).click();
      await expect(page.locator("[data-linh-result]")).toContainText(
        "Chưa xác định",
      );
      await expect(page.locator("[data-position-change]")).toHaveCount(0);
      await page.goBack();
      await expect(page.locator("[data-linh-result]")).toHaveAttribute(
        "data-sample",
        "technical-linh-leave",
      );
    } finally {
      await ctx.close();
    }
  }
});

test("dynamic internal birth to frozen Tan Bien reading stays authorized and snapshot-bound", async ({
  browser,
}) => {
  const { readFile } = await import("node:fs/promises");
  const pack = JSON.parse(
    await readFile("exports/tanbien-review-1.9.0/readings.json", "utf8"),
  );
  const anon = await browser.newContext({ baseURL: origin });
  const denial = await anon.request.post("/api/internal-readings", {
    data: {},
  });
  expect(denial.status()).toBe(401);
  const denied = await anon.newPage();
  await denied.goto("/internal/readings");
  await expect(
    denied.getByRole("heading", { name: "Cần quyền kiểm tra nội bộ" }),
  ).toBeVisible();
  await anon.close();
  await mkdir(artifacts, { recursive: true });
  for (const width of [360, 390]) {
    const ctx = await browser.newContext({
      baseURL: origin,
      viewport: { width, height: 844 },
    });
    await ctx.addCookies([
      {
        name: "tuvi_internal",
        value: issueReviewSession(),
        url: origin,
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    const page = await ctx.newPage();
    try {
      let previousURL = "",
        previousID = "",
        previousText = "";
      for (const sample of ["vn-20", "vn-2"]) {
        const input = pack.rows.find((r: any) => r.id === sample).snapshot
          .normalized;
        await page.goto("/internal/readings");
        await page.getByLabel("Ngày sinh dương lịch").fill(input.date);
        await page
          .getByRole("combobox", { name: "Giờ sinh", exact: true })
          .selectOption(String(input.hour));
        await page.getByLabel("Phút sinh").selectOption(String(input.minute));
        await page.getByLabel("Nơi sinh").fill("Hà Nội — dữ liệu giả lập");
        await page
          .getByLabel("Giới tính theo quy tắc")
          .selectOption(input.gender);
        await page.getByLabel("Tôi hiểu đây").check();
        await page.getByRole("button", { name: "Kiểm tra thông tin" }).click();
        await expect(page.locator("[data-confirmation]")).toContainText(
          input.date,
        );
        await page
          .getByRole("button", { name: "Xác nhận & mở bản đọc nội bộ" })
          .click();
        await openVerification(page);
    await page.getByText("Bài đọc gốc đã lưu — không đổi theo năm đang chọn", {exact:true}).click();
        await expect(page.locator("[data-testid=rule-reading]")).toBeVisible();
        await expect(
          page.getByRole("link", { name: "Nhập mới / hồ sơ đã lưu" }),
        ).toBeVisible();
        await expect(page.locator("[data-birth-summary]")).toContainText(
          input.date,
        );
        const result = await page
          .locator("[data-testid=rule-reading]")
          .getAttribute("data-snapshot");
        await expect(page.locator(".chart-card")).toBeVisible();
        await expect(page.locator("[data-state-context]")).toContainText(
          "Tân Biên",
        );
        const ids = await page.locator('[data-claim]').evaluateAll(els => els.map(el => el.getAttribute('data-claim')));
        expect(new Set(ids).size).toBe(ids.length);
        const storedId = new URL(page.url()).searchParams.get('id')!;
        const { getReading } = await import('../../lib/internal-review/reading-store');
        const stored = await getReading(storedId);
        expect(stored).not.toBeNull();
        const paragraphs = stored!.frozen.reading.sections.flatMap(s => s.paragraphs);
        expect(ids.sort()).toEqual(paragraphs.map(p => p.claim.id).sort());
        // Versioned source-branch contract for these two engine inputs, not a size-only assertion.
        // P1: TH108 Mệnh–Cục for both; TH109 one-star for 20h, TH108 empty-Mệnh for 2h.
        // Existing palace branches are retained, so wrong/substituted/duplicate claims fail too.
        // TH107–108: Canh Thìn dương / Mệnh Tuất dương; Mùi âm. TB169: C+→A- at Mệnh/Nô, direct voids absent.
        const expectedRules = sample === 'vn-20' ? [
          'npl.life-polarity-aligned','tanbien.no-table-cbright-adim',
          'npl.life-foundation-cuc','npl.life-foundation-one','tanbien.life-body-same-trine',
          'tanbien.life-body-role','npl.life-body-wealth','tanbien.r01','tanbien.r04','tanbien.r37',
          'tanbien.career-closing-tu-phu','tanbien.r43','tanbien.phuc-pha-ty-ngo','tanbien.di-tham-good',
          'tanbien.dien-co-low','tanbien.parents-sun-low','tanbien.parents-hoa-loc',
          'tanbien.siblings-dong-dau','tanbien.siblings-ky'
        ] : [
          'npl.life-polarity-opposed','npl.life-foundation-cuc','npl.life-foundation-empty','tanbien.life-body-other-trine',
          'tanbien.life-body-role','tanbien.life-empty-mui-sun-moon-trine',
          'tanbien.career-closing-am-dau-hoi','tanbien.finance-nhat-luong-mao',
          'tanbien.finance-extra-loc-position','tanbien.di-hoa-ky','tanbien.di-dong-cu',
          'tanbien.dien-liem-phu','tanbien.parents-pha-dan-than','tanbien.siblings-tu-ngo','tanbien.children-tu'
        ];
        expect(paragraphs.flatMap(p => p.claim.rules.map(r => r.id)).sort()).toEqual(expectedRules.sort());
        expect(paragraphs.flatMap(p => p.claim.rules.map(r => r.id))).toContain('npl.life-foundation-cuc');
        expect(paragraphs.flatMap(p => p.claim.rules.map(r => r.id))).toContain(sample === 'vn-20' ? 'npl.life-foundation-one' : 'npl.life-foundation-empty');
        if (sample === "vn-20") {
          await expect(page.locator("[data-claim]")).toHaveCount(19);
          // Current full report: P1 adds independent Mệnh–Cục and one-star paragraphs.
          await expect(page.locator("[data-section=life-elements]")).toContainText("Bản Mệnh–Cục");
          // TB Quan Lộc §8.1/8.7: Tử–Phủ adds one local career claim.
          await expect(page.locator("[data-section=work]")).toContainText("Tử Vi–Thiên Phủ");
          await page.locator("[data-evidence]>summary").first().click();
          await expect(
            page.locator("[data-technical]").first(),
          ).not.toHaveAttribute("open", "");
          previousURL = page.url();
          previousID = result!;
          previousText = await page
            .locator("[data-interpretation]")
            .allTextContents()
            .then((x) => x.join("\n"));
        } else {
          expect(result).not.toBe(previousID);
          // TB PDF71: empty Mùi with Sun Mão / Moon Hợi adds one local trine gloss.
          await expect(page.locator("[data-claim]")).toHaveCount(15);
          await expect(page.locator("[data-section=life-elements]")).toContainText("Bản Mệnh–Cục");
          await expect(page.locator("[data-section=structure]")).toContainText("hai cung tam hợp chiếu về Mệnh");
          // Baseline1.26.0: TB PDF32 adds the Hóa Lộc position gloss at Tài.
          await expect(page.locator("[data-section=finance]")).toContainText("Hóa Lộc ở cung Tài");
          // TB §8.8: Thái Âm độc thủ Hợi adds one career claim.
          await expect(page.locator("[data-section=work]")).toContainText("Thái Âm độc thủ");
          await expect(page.locator("[data-life-major-notice]")).toHaveCount(0);
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({
          path: `${artifacts}/dynamic-${sample}-${width}.png`,
          fullPage: true,
        });
      }
      const noAccess = await browser.newContext({ baseURL: origin });
      const noAccessPage = await noAccess.newPage();
      await noAccessPage.goto(previousURL);
      await expect(
        noAccessPage.getByRole("heading", {
          name: "Cần quyền kiểm tra nội bộ",
        }),
      ).toBeVisible();
      await expect(noAccessPage.locator("[data-birth-summary]")).toHaveCount(0);
      await noAccess.close();
      const badOrigin = await ctx.request.post("/api/internal-readings", {
        headers: { Origin: "https://untrusted.invalid" },
        data: {},
      });
      expect(badOrigin.status()).toBe(403);
      await page.goto(previousURL);
      await page.reload();
      await expect(page.locator("[data-testid=rule-reading]")).toHaveAttribute(
        "data-snapshot",
        previousID,
      );
      expect(
        (await page.locator("[data-interpretation]").allTextContents()).join(
          "\n",
        ),
      ).toBe(previousText);
      await page.goto(
        "/internal/readings?id=00000000-0000-4000-8000-000000000000",
      );
      await expect(page.locator("main").getByRole("alert")).toContainText(
        "Không tìm thấy",
      );
      await expect(page.locator("[data-testid=rule-reading]")).toHaveCount(0);
    } finally {
      await ctx.close();
    }
  }
});

test("full chart renders exact saved layers, switches density and snapshot without stale palace", async ({
  browser,
}) => {
  const { readFile } = await import("node:fs/promises");
  const { randomUUID } = await import("node:crypto");
  const pack = JSON.parse(
    await readFile("exports/tanbien-review-1.9.0/readings.json", "utf8"),
  );
  const ctx = await browser.newContext({ baseURL: origin });
  await ctx.addCookies([
    {
      name: "tuvi_internal",
      value: issueReviewSession(),
      url: origin,
      httpOnly: true,
      sameSite: "Strict",
    },
  ]);
  const docs = [];
  for (const sample of ["vn-20", "vn-2"]) {
    const snapshot = pack.rows.find((r: any) => r.id === sample).snapshot;
    const res = await ctx.request.post("/api/internal-readings", {
      headers: { Origin: origin },
      data: { id: randomUUID(), birth: snapshot.normalized },
    });
    expect(res.status()).toBe(200);
    const created = await res.json();
    expect(created.snapshot.chart.palaces).toEqual(snapshot.chart.palaces);
    docs.push({ id: created.id, snapshot: created.snapshot });
  }
  const page = await ctx.newPage();
  await mkdir(artifacts, { recursive: true });
  try {
    for (const width of [360, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/internal/readings?id=" + docs[0].id + "&mode=internal");
      await expect(page.locator(".chart-card")).toBeVisible();
      const chart = page.locator("[data-chart-snapshot]");
      await expect(chart).toHaveAttribute(
        "data-chart-snapshot",
        docs[0].snapshot.resultId,
      );
      await expect(
        page.getByRole("button", { name: "Đầy đủ: dữ liệu đã lưu" }),
      ).toHaveAttribute("aria-pressed", "true");
      await page.getByRole("button", {name:"Danh sách",exact:true}).click();
      const expected = docs[0].snapshot.chart.palaces.flatMap(
        (p: any, i: number) =>
          ["majorStars", "minorStars", "adjectiveStars"].flatMap((g) =>
            p[g].map((s: any, j: number) => ({
              path: `chart.palaces.${i}.${g}.${j}`,
              name: s.name,
            })),
          ),
      );
      const actual = await chart
        .locator(".palace [data-star-path]")
        .evaluateAll((es) =>
          es.map((e) => ({
            path: e.getAttribute("data-star-path"),
            name: e.getAttribute("data-star-name"),
          })),
        );
      expect(actual).toEqual(expected);
      for (const [i, p] of docs[0].snapshot.chart.palaces.entries()) {
        const palace = chart.locator(`[data-palace-index="${i}"]`);
        for (const key of [
          "changsheng12",
          "boshi12",
          "suiqian12",
          "jiangqian12",
        ])
          await expect(palace.locator(`[data-layer="${key}"]`)).toContainText(
            p[key],
          );
        for (const g of ["majorStars", "minorStars", "adjectiveStars"])
          for (const [j, s] of p[g].entries())
            if (s.mutagen)
              await expect(
                palace.locator(
                  `[data-mutagen-for="chart.palaces.${i}.${g}.${j}"]`,
                ),
              ).toContainText("Hóa " + s.mutagen);
      }
      await page.getByRole("button", {name:"Vừa màn hình",exact:true}).click();
      await expect(chart.locator("svg [data-palace-index]")).toHaveCount(12);
      await chart.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${artifacts}/full-grid-${width}.png`,
        fullPage: width === 1440,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.getByRole("button", {name:"Danh sách",exact:true}).click();
      await page.getByRole("button", { name: "Rút gọn: chính tinh" }).click();
      expect(
        await chart
          .locator(".palace [data-star-path]")
          .evaluateAll((es) => es.map((e) => e.getAttribute("data-star-path"))),
      ).toEqual(
        expected
          .filter((x: any) => x.path.includes(".majorStars."))
          .map((x: any) => x.path),
      );
      await page
        .getByRole("button", { name: "Đầy đủ: dữ liệu đã lưu" })
        .click();
      await page
        .getByRole("button", { name: "Danh sách", exact: true })
        .click();
      const target = docs[0].snapshot.chart.palaces.findIndex((p: any) =>
        p.minorStars.some((s: any) => s.name === "Linh Tinh"),
      );
      await chart.locator(`[data-palace-index="${target}"]`).click();
      await expect(chart.locator("div.evidence")).toContainText("Linh Tinh");
      await expect(chart.locator("div.evidence")).toContainText("chưa đổi");
      await chart
        .locator("div.evidence")
        .getByText("Nguồn trạng thái — Linh Tinh", { exact: true })
        .click();
      await chart.locator("div.evidence").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${artifacts}/full-detail-${width}.png` });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.getByRole("button", { name: "Đóng chi tiết cung" }).click();
      await expect(chart.locator("div.evidence")).toHaveCount(0);
      await page.goto("/internal/readings?id=" + docs[1].id + "&mode=internal");
      await expect(page.locator(".chart-card")).toBeVisible();
      await expect(chart).toHaveAttribute(
        "data-chart-snapshot",
        docs[1].snapshot.resultId,
      );
      await expect(chart.locator("div.evidence")).toHaveCount(0);
    }
  } finally {
    await ctx.close();
  }
});

test("Tan Bien new profile live entry, saved recreation, full layers and source pairs stay snapshot-bound", async ({
  browser,
}) => {
  test.setTimeout(90000);
  const { randomUUID } = await import("node:crypto");
  const context = await browser.newContext({ baseURL: origin });
  await context.addCookies([
    {
      name: "tuvi_internal",
      value: issueReviewSession(),
      url: origin,
      httpOnly: true,
      sameSite: "Strict",
    },
  ]);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await mkdir(artifacts, { recursive: true });
  try {
    const birth = {
      date: "2000-08-16",
      hour: 20,
      minute: 0,
      unknownTime: false,
      place: "DEMO kiểm thử",
      gender: "female",
      calendar: "solar",
      profile: "vn-utc7-midnight-v1",
      timezone: "Asia/Ho_Chi_Minh",
      consent: true,
    };
    const id = randomUUID();
    const created = await context.request.post("/api/internal-readings", {
      headers: { Origin: origin },
      data: { id, birth },
    });
    expect(created.ok()).toBe(true);
    await page.goto("/internal/readings?recreate=" + id);
    await expect(page.getByLabel("Hệ lịch tính lá số")).toHaveValue(
      "tanbien-vn-trial-v2",
    );
    await page.getByLabel(/^Năm âm xem/).fill("2015");
    await page.getByLabel("Ngày dương xem (tùy chọn)").fill("2015-03-10");
    await page.getByLabel("Chi giờ xem (tùy chọn)").selectOption("8");
    await page.getByRole("checkbox", { name: /Tôi hiểu/ }).check();
    await page
      .getByRole("button", { name: "Kiểm tra thông tin", exact: true })
      .click();
    await page
      .getByRole("button", {
        name: "Xác nhận & mở bản đọc nội bộ",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(/\/internal\/readings\?id=/);
    expect(new URL(page.url()).searchParams.get("id")).not.toBe(id);
    await openVerification(page);
    const newURL = page.url();
    const recreated = (await (await import("../../lib/internal-review/reading-store")).getReading(new URL(newURL).searchParams.get("id")!))!;
    expect(recreated.snapshot.profile.id).toBe("tanbien-vn-trial-v2");
    expect(recreated.snapshot.versions.engine).toBe("tanbien-trial-0.3.0");
    await expect(
      page.getByRole("link", { name: "Mở hồ sơ nguồn (không đổi)" }),
    ).toHaveAttribute("href", "/internal/readings?id=" + id);
    for (const width of [360, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(newURL);
      await expect(page.locator(".chart-card")).toBeVisible();
      const chart = page.locator(".chart-card");
      await expect(
        page.getByRole("button", { name: "Đầy đủ: dữ liệu đã lưu" }),
      ).toHaveAttribute("aria-pressed", "true");
      expect(recreated.snapshot.chart.tanBien).toBeDefined();
      expect(await chart.locator("[data-void-pair]").evaluateAll(es=>es.map(e=>e.getAttribute("data-void-pair")).sort())).toEqual([...new Set(recreated.snapshot.chart.tanBien!.voidRanges.map((v:any)=>v.branches.join("|")))].sort());
      await expect(chart).toContainText("Tuần");
      await expect(chart).toContainText("Triệt");
      await expect(chart.locator('[data-star-name="Thiên Quý"]')).toHaveCount(
        1,
      );
      await expect(chart.locator('[data-scope="year"]')).toHaveCount(0);
      await page.getByRole("checkbox", {name:"Sao lưu năm", exact:true}).check();
      await expect(chart.locator('[data-scope="year"]')).toHaveCount(9);
      await chart.locator("[data-view-year]>summary").click();
      await expect(chart.locator("[data-view-year]")).toContainText(
        "2015-03-10",
      );
      await expect(chart.locator('[data-star-name="Thiên Riêu"]')).toHaveCount(
        0,
      );
      await expect(chart.locator('[data-star-name="Thiên Diêu"]')).toHaveCount(
        1,
      );
      await expect(chart.locator('[data-layer="ages"]')).toHaveCount(0); // no long age arrays in grid
      const identity = await chart.getAttribute("data-chart-snapshot");
      await expect(
        page.locator('[data-testid="rule-reading"]'),
      ).toHaveAttribute("data-snapshot", identity!);
      await chart.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${artifacts}/tanbien-new-${width}.png`,
        fullPage: width === 1440,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page
        .getByRole("button", { name: "Danh sách", exact: true })
        .click();
      await chart
        .locator(".palace")
        .filter({ has: page.locator('[data-star-name="Thiên Quý"]') })
        .click();
      await expect(chart.locator("div.evidence")).toContainText(
        "đếm nghịch từ Văn Khúc",
      );
      await chart
        .locator("div.evidence")
        .getByText("Nguồn trạng thái — Thiên Quý", { exact: true })
        .click();
      await chart.locator("div.evidence").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${artifacts}/tanbien-basis-${width}.png`,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.goto("/internal/readings?id=" + id + "&mode=internal");
      await expect(page.locator(".chart-card")).toBeVisible();
      await expect(page.locator(".chart-card")).not.toHaveAttribute(
        "data-chart-snapshot",
        identity!,
      );
      await expect(page.locator("div.evidence")).toHaveCount(0);
    }
    expect(errors).toEqual([]);
  } finally {
    await context.close();
  }
});

test("Tan Bien actual free chart entry defaults to new profile and full grid", async ({
  page,
}) => {
  for (const width of [360, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByLabel("Hệ lịch tính lá số")).toHaveValue(
      "tanbien-vn-trial-v2",
    );
    await page.getByLabel("Ngày sinh", { exact: false }).fill("2000-08-16");
    await page.getByLabel("Giờ sinh", { exact: true }).selectOption("3");
    await page.getByLabel("Phút sinh", { exact: true }).selectOption("0");
    await page.getByLabel("Nơi sinh", { exact: true }).fill("DEMO kiểm thử");
    await page.getByLabel("Tôi hiểu giới hạn").check();
    await page
      .getByRole("button", { name: "Kiểm tra thông tin", exact: true })
      .click();
    const chartResponse = page.waitForResponse(r=>r.url().endsWith("/api/chart") && r.request().method()==="POST");
    await page
      .getByRole("button", {
        name: "Xác nhận & lập lá số miễn phí",
        exact: true,
      })
      .click();
    const chart = page.locator(".chart-card");
    await expect(chart).toBeVisible();
    const payload = await (await chartResponse).json();
    expect(payload.profile.id).toBe("tanbien-vn-trial-v2");
    expect(payload.versions.engine).toBe("tanbien-trial-0.3.0");
    expect(await chart.locator("[data-void-pair]").evaluateAll(es=>es.map(e=>e.getAttribute("data-void-pair")).sort())).toEqual([...new Set(payload.chart.tanBien.voidRanges.map((v:any)=>v.branches.join("|")))].sort());
    expect(
      await chart
        .locator('[data-sheet-paths*=".minorStars."][data-star-name]')
        .count(),
    ).toBeGreaterThan(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await chart.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${artifacts}/free-entry-${width}.png` });
  }
});

test("career source reading uses new saved snapshot, evidence and no stale work claims on mobile", async ({
  browser,
}) => {
  const pack = JSON.parse(
    (await import("node:fs")).readFileSync(
      "exports/tanbien-career-1.10.0/readings.json",
      "utf8",
    ),
  );
  await mkdir(artifacts, { recursive: true });
  for (const width of [360, 390]) {
    const ctx = await browser.newContext({
      baseURL: origin,
      viewport: { width, height: 844 },
    });
    await ctx.addCookies([
      {
        name: "tuvi_internal",
        value: issueReviewSession(),
        url: origin,
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    const page = await ctx.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const input = pack.rows.find((r: any) => r.id === "engine-career-co-luong")
      .snapshot.normalized;
    await page.goto("/internal/readings");
    await page.getByLabel("Ngày sinh dương lịch").fill(input.date);
    await page
      .getByRole("combobox", { name: "Giờ sinh", exact: true })
      .selectOption(String(input.hour));
    await page.getByLabel("Phút sinh").selectOption(String(input.minute));
    await page.getByLabel("Nơi sinh").fill("Hà Nội — mẫu kiểm thử giả lập");
    await page.getByLabel("Giới tính theo quy tắc").selectOption(input.gender);
    await page.getByLabel("Tôi hiểu đây").check();
    await page.getByRole("button", { name: "Kiểm tra thông tin" }).click();
    await page
      .getByRole("button", { name: "Xác nhận & mở bản đọc nội bộ" })
      .click();
    await openVerification(page);
    await page.getByText("Bài đọc gốc đã lưu — không đổi theo năm đang chọn", {exact:true}).click();
    const work = page.locator("[data-section=work]");
    await expect(work).toContainText("Thiên Cơ–Thiên Lương");
    await expect(work.locator("[data-work-facts]")).toContainText("Quan Lộc");
    await expect(work.locator("[data-interpretation]")).toHaveCount(3);
    const savedURL = page.url();
    const snapshot = await page
      .locator("[data-testid=rule-reading]")
      .getAttribute("data-snapshot");
    await work.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${artifacts}/career-reading-${width}.png` });
    await work.locator("[data-evidence]>summary").first().click();
    await expect(work.locator("[data-technical]").first()).not.toHaveAttribute(
      "open",
      "",
    );
    await expect(work).toContainText("160");
    await expect(work).toContainText("162");
    await work.locator("[data-technical]>summary").first().click();
    await expect(work).toContainText("tanbien.r22");
    await expect(work).toContainText(snapshot!);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await work.locator("[data-evidence]").first().scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `${artifacts}/career-evidence-${width}.png`,
    });
    await page.goto(
      "/internal/editorial/demo-wuqu-tianfu?view=reading&sample=vn-jumen",
    );
    await expect(page.locator("[data-testid=rule-reading]")).toBeVisible();
    await expect(page.locator("[data-section=work] [data-interpretation]")).toHaveCount(0);
    await expect(page.locator("[data-section=work] [data-work-facts]")).toContainText("Sửu");
    await expect(page.locator("[data-section=work]")).toContainText("Chưa có lời luận Công việc phù hợp");
    await expect(
      page
        .locator("[data-interpretation]")
        .filter({ hasText: "Thiên Cơ–Thiên Lương" }),
    ).toHaveCount(0);
    await page.goto(savedURL);
    await openVerification(page);
    await page.getByText("Bài đọc gốc đã lưu — không đổi theo năm đang chọn", {exact:true}).click();
    await expect(work).toContainText("Thiên Cơ–Thiên Lương");
    await page.reload();
    await expect(page.locator("[data-testid=rule-reading]")).toHaveAttribute(
      "data-snapshot",
      snapshot!,
    );
    expect(errors).toEqual([]);
    await ctx.close();
  }
});

test("career 1.11 expanded local and natal-ring claims on mobile with source and sample isolation", async ({
  browser,
}) => {
  const pack = JSON.parse(
    (await import("node:fs")).readFileSync(
      "exports/tanbien-career-1.11.0/readings.json",
      "utf8",
    ),
  );
  await mkdir(artifacts, { recursive: true });
  for (const width of [360, 390]) {
    const ctx = await browser.newContext({
      baseURL: origin,
      viewport: { width, height: 844 },
    });
    await ctx.addCookies([
      {
        name: "tuvi_internal",
        value: issueReviewSession(),
        url: origin,
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    const page = await ctx.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const urls: string[] = [];
    for (const id of ["career-engine-133", "career-extra-35"]) {
      const row = pack.rows.find((r: any) => r.id === id),
        input = row.snapshot.normalized;
      await page.goto("/internal/readings");
      await page.getByLabel("Ngày sinh dương lịch").fill(input.date);
      await page
        .getByRole("combobox", { name: "Giờ sinh", exact: true })
        .selectOption(String(input.hour));
      await page.getByLabel("Phút sinh").selectOption(String(input.minute));
      await page.getByLabel("Nơi sinh").fill("Hà Nội — mẫu giả lập");
      await page
        .getByLabel("Giới tính theo quy tắc")
        .selectOption(input.gender);
      await page.getByLabel("Tôi hiểu đây").check();
      await page.getByRole("button", { name: "Kiểm tra thông tin" }).click();
      await page
        .getByRole("button", { name: "Xác nhận & mở bản đọc nội bộ" })
        .click();
      await openVerification(page);
    await page.getByText("Bài đọc gốc đã lưu — không đổi theo năm đang chọn", {exact:true}).click();
      const work = page.locator("[data-section=work]");
      await expect(work).toBeVisible();
      await expect(work.locator("[data-interpretation]")).toHaveText(
        row.after.section.paragraphs.map((p: any) => p.display.text),
      );
      const beforeSnapshot = await page
        .locator("[data-testid=rule-reading]")
        .getAttribute("data-snapshot");
      urls.push(page.url());
      await work.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${artifacts}/${id}-reading-${width}.png`,
      });
      await work.locator("[data-evidence]>summary").first().click();
      await expect(work).toContainText(
        id === "career-extra-35" ? "vòng Bác Sỹ bản mệnh" : "Thiên Cơ",
      );
      await expect(
        work.locator("[data-technical]").first(),
      ).not.toHaveAttribute("open", "");
      await work.locator("[data-technical]>summary").first().click();
      await expect(work).toContainText(
        id === "career-extra-35" ? "tanbien.r38" : "tanbien.r23",
      );
      await expect(work).toContainText(beforeSnapshot!);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await work.locator("[data-evidence]").first().scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${artifacts}/${id}-evidence-${width}.png`,
      });
    }
    await page.goto(
      "/internal/editorial/demo-wuqu-tianfu?view=reading&sample=vn-jumen",
    );
    await expect(page.locator("[data-testid=rule-reading]")).toBeVisible();
    await expect(page.locator("[data-section=work] [data-interpretation]")).toHaveCount(0);
    await expect(page.locator("[data-section=work] [data-work-facts]")).toContainText("Sửu");
    await expect(page.locator("[data-section=work]")).toContainText("Chưa có lời luận Công việc phù hợp");
    await page.goto(urls[0]);
    await openVerification(page);
    await page.getByText("Bài đọc gốc đã lưu — không đổi theo năm đang chọn", {exact:true}).click();
    await expect(
      page.locator("[data-section=work] [data-interpretation]"),
    ).toContainText("Thiên Cơ–Cự Môn");
    await expect(
      page.locator("[data-section=work] [data-interpretation]"),
    ).not.toContainText("ngoại ngữ");
    await page.reload();
    await expect(page.locator("[data-section=work]")).toContainText("máy móc");
    expect(errors).toEqual([]);
    await ctx.close();
  }
});
