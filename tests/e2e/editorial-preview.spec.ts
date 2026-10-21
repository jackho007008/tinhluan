import { catalog } from "../../lib/interpretation-rules/catalog";
const artifacts =
  process.env.E2E_ARTIFACT_DIR || "exports/editorial-preview-v1.1";
import { issueReviewSession } from "../../lib/internal-review/auth";
import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const origin = process.env.E2E_ORIGIN || "http://localhost:3000";
const path = "/internal/editorial/demo-wuqu-tianfu";
test("editorial DEMO stays internal and reads on mobile with paragraph evidence", async ({
  browser,
}) => {
  test.setTimeout(60000);
  const anonymous = await browser.newContext();
  const denied = await anonymous.newPage();
  await denied.goto(path);
  await expect(
    denied.getByRole("heading", { name: "Cần quyền kiểm tra nội bộ" }),
  ).toBeVisible();
  await expect(
    denied.getByText("Bức tranh chung", { exact: true }),
  ).toHaveCount(0);
  await anonymous.close();
  await mkdir(artifacts, { recursive: true });
  for (const width of [360, 390]) {
    const ctx = await browser.newContext({
      viewport: { width, height: 844 },
      baseURL: origin,
    });
    try {
      // Reading tests use a valid session fixture; login/rate limit have an isolated test.
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
      await page.goto(path);
      await expect(
        page.getByRole("heading", {
          name: "Tổng quan Vũ Khúc–Thiên Phủ",
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.locator(".editorial-paragraph")).toHaveCount(21);
      await expect(
        page.getByText("Bản biên soạn riêng cho DEMO · phiên bản 1.1", {
          exact: true,
        }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `${artifacts}/header-${width}.png`,
      });
      const reading = page.locator("#reading-3");
      await reading.evaluate((el) =>
        window.scrollTo({
          top: el.getBoundingClientRect().top + scrollY,
          behavior: "instant",
        }),
      );
      await page.screenshot({
        path: `${artifacts}/reading-${width}.png`,
      });
      const evidence = page.locator("#paragraph-7 > details");
      await evidence.locator("summary").first().click();
      await expect(evidence).toHaveAttribute("open", "");
      await expect(
        evidence.getByText("R02 Tổ hợp hai sao", { exact: true }),
      ).toBeVisible();
      await expect(evidence.getByText(/Khác chiều:/)).toBeVisible();
      await evidence.evaluate((el) =>
        window.scrollTo({
          top: el.getBoundingClientRect().top + scrollY,
          behavior: "instant",
        }),
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `${artifacts}/evidence-${width}.png`,
      });
      // Closed destinations open before scrolling, retain keyboard focus, and work through history.
      const differences = page.locator("#source-differences"),
        boundaries = page.locator("#editorial-boundaries");
      await expect(differences).not.toHaveAttribute("open", "");
      await evidence
        .getByRole("link", { name: "Sai khác và điều kiện chưa giải quyết" })
        .click();
      await expect(differences).toHaveAttribute("open", "");
      await expect(differences.locator("summary").first()).toBeFocused();
      await expect(boundaries).not.toHaveAttribute("open", "");
      const boundaryLink = evidence.getByRole("link", {
        name: "Ranh giới sử dụng bản thảo",
      });
      await boundaryLink.focus();
      await page.keyboard.press("Enter");
      await expect(boundaries).toHaveAttribute("open", "");
      await differences
        .locator("summary")
        .first()
        .evaluate(
          (el) => ((el.parentElement as HTMLDetailsElement).open = false),
        );
      await page.goBack();
      await expect(differences).toHaveAttribute("open", "");
      await expect(differences.locator("summary").first()).toBeFocused();
      await page.goto("/internal"); // Fresh same-origin document; preserve the Strict authentication boundary.
      await page.goto(path + "#editorial-boundaries");
      await expect
        .poll(async () =>
          page.evaluate(() => ({
            hash: location.hash,
            open: (
              document.getElementById(
                "editorial-boundaries",
              ) as HTMLDetailsElement
            )?.open,
          })),
        )
        .toEqual({ hash: "#editorial-boundaries", open: true });
      await expect(differences).not.toHaveAttribute("open", "");
      await page.goto(path + "?v=1.0");
      await expect(page.locator("#paragraph-3 > p")).toContainText(
        "Vế sau là diễn đạt hiện đại",
      );
      await page.goto(path + "?view=rules");
      // Inventory contract: every current Tân Biên rule appears exactly once, no foreign rule.
      const expectedRules = catalog.filter(r => r.id.startsWith("tanbien.")).map(r => r.id).sort();
      const shownRules = await page.locator('[data-rule]').evaluateAll(els => els.map(el => el.getAttribute('data-rule')!).sort());
      expect(shownRules).toEqual(expectedRules);
      expect(new Set(shownRules).size).toBe(shownRules.length);
      await expect(page.locator('[data-testid="rule-status"]')).toHaveCount(expectedRules.length);
      const newGloss = page.locator('[data-rule="tanbien.life-empty-mui-sun-moon-opposite"]');
      await expect(newGloss.locator('[data-testid="rule-status"]')).toHaveText("unknown");
      await newGloss.locator("summary").click();
      await expect(newGloss).toContainText("Trace: wrong-profile");
      const matched = ["r01","r02","r03","r04","r05","r06","r07"];
      for(const id of matched) await expect(page.locator(`[data-rule="tanbien.${id}"] [data-testid="rule-status"]`)).toHaveText("matched");
      await expect(page.locator('[data-testid="rule-status"]').filter({hasText:/^matched$/})).toHaveCount(7);
      await page.locator('[data-rule="tanbien.r02"] summary').click();
      await expect(page.getByText(/Tý: Vượng/).first()).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `${artifacts}/rules-${width}.png`,
      });
      await page.goto(path + "?view=rules&sample=syn-wuqu");
      await expect(
        page.locator('[data-rule="tanbien.r02"] [data-testid="rule-status"]'),
      ).not.toHaveText("matched");
      await page.goto("/beta");
      await expect(
        page.getByRole("heading", { name: "Đợt đọc thử chưa được mở" }),
      ).toBeVisible();
    } finally {
      await ctx.close();
    }
  }
});
