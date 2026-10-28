import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import {
  prepareV1Edit,
  approveV1Edit,
  decideV1Edit,
  approvedV1Edit,
  contentHash,
  v1EditFindings,
  v1EditKey,
  v1EditInstructions,
  V1_EDIT_INSTRUCTIONS,
  type V1EditUnit,
  type V1Editor,
} from "../lib/ai/v1-edit";
import {
  v1SourceContext,
  v1ReviewHistory,
  registerV1Source,
  listV1Sources,
  sourceContextId,
  type V1ReviewAssessment,
} from "../lib/ai/v1-review-store";
import { writeEditArtifact } from "../lib/ai/v1-edit-storage";
import { v1TextSimilarity } from "../lib/ai/v1-inventory";
let dir: string;
const unit = (): V1EditUnit => ({
  sourceVersion: "1.79.0",
  title: "Fixture",
  text: "Vũ Khúc tại Mệnh Tý chỉ có lời riêng trong điều kiện này, chưa phải kết luận chung về tính cách.",
  original: "Fixture original, not a real book quotation.",
  conditions: [
    {
      id: "fixture-vu-khuc",
      version: "1",
      status: "draft",
      conditions: [],
      exceptions: [],
      applicability: "Chỉ tọa Mệnh.",
      sourceConditions: [],
      limits: ["Chưa luận toàn cung."],
      sources: [{ title: "Fixture source", location: "Not an actual book" }],
    },
  ],
  conditionalAssessment: [],
  context: null,
  relations: [],
  sentences: [],
});
const editor: V1Editor = async (u, model) => ({
  text: u.text + "\n",
  model,
  responseId: "mock-response-not-live",
  usage: { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1 },
  durationMs: 1,
});
const assessment = (
  requestedState: "draft" | "approved" | "rejected" = "approved",
  previousReviewId: string | null = null,
): V1ReviewAssessment => ({
  requestedState,
  previousReviewId,
  note: "Technical fixture review, not a real astrology approval.",
  checks: Object.fromEntries(
    ["factsAndScope", "conditions", "noNewClaims", "meaning", "sources"].map(
      (k) => [
        k,
        {
          status: "pass",
          evidence:
            "Fixture: compared the full original and candidate for this criterion.",
        },
      ],
    ),
  ) as V1ReviewAssessment["checks"],
});
beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "v1-review-tests-"));
  vi.stubEnv("AI_V1_EDIT_DIR", dir);
  vi.stubEnv("AI_FREE_EDIT_MODEL", "unit-editor-not-live");
  vi.stubEnv("OPENAI_API_KEY", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
describe("versioned source registry and review journal", () => {
  it("persists approved/rejected/draft history without overwriting candidates, and rejects stale reviews", async () => {
    const u = unit(),
      source = v1SourceContext(u, "catalog-1"),
      c = (await prepareV1Edit(u, editor)).candidate!,
      hash = contentHash(c);
    await registerV1Source(u, source);
    await registerV1Source(u, source);
    expect((await listV1Sources()).length).toBe(1);
    const first = await approveV1Edit(c.key, hash, source, assessment());
    expect(first.state).toBe("approved");
    expect((await approvedV1Edit(u, source))?.text).toBe(c.text);
    const rejected = await decideV1Edit(
      c.key,
      hash,
      source,
      assessment("rejected", first.id),
    );
    expect(rejected.state).toBe("rejected");
    expect(await approvedV1Edit(u, source)).toBeNull();
    await expect(
      decideV1Edit(c.key, hash, source, assessment("approved", first.id)),
    ).rejects.toThrow("V1_REVIEW_STALE");
    const draft = await decideV1Edit(
      c.key,
      hash,
      source,
      assessment("draft", rejected.id),
    );
    expect(await approvedV1Edit(u, source)).toBeNull();
    await decideV1Edit(c.key, hash, source, assessment("approved", draft.id));
    expect((await v1ReviewHistory(c.key, source)).map((e) => e.state)).toEqual([
      "approved",
      "rejected",
      "draft",
      "approved",
    ]);
    expect(
      contentHash(
        JSON.parse(
          await fs.readFile(
            path.join(dir, "candidates", c.key + ".json"),
            "utf8",
          ),
        ),
      ),
    ).toBe(hash);
  });
  it("never treats fluency or an uncertain checklist as approval; lost negation/scope stays draft", async () => {
    const u = unit(),
      source = v1SourceContext(u, "catalog-1"),
      c = (await prepareV1Edit(u, editor)).candidate!,
      a = assessment();
    a.checks.meaning.status = "uncertain";
    const first = await approveV1Edit(c.key, contentHash(c), source, a);
    expect(first.state).toBe("draft");
    expect(await approvedV1Edit(u, source)).toBeNull();
    const changed = unit();
    changed.text += " Nội dung gốc khác.";
    const altered = (
      await prepareV1Edit(changed, async (u, m) => ({
        ...(await editor(u, m)),
        text: u.text.replace("chưa", "đã"),
      }))
    ).candidate!;
    const blocked = await approveV1Edit(
      altered.key,
      contentHash(altered),
      v1SourceContext(changed, "catalog-1"),
      assessment(),
    );
    expect(blocked.state).toBe("draft");
    expect(blocked.technicalFindings.join(" ")).toContain("chưa");
    expect(
      v1EditFindings(
        "Vũ Khúc chỉ có lời riêng trong điều kiện này, chưa phải kết luận chung về tính cách.",
        u,
      ).join(" "),
    ).toContain("Mệnh");
    await expect(
      decideV1Edit(c.key, contentHash(c), source, {
        ...assessment("approved", first.id),
        checks: { meaning: { status: "pass", evidence: "Trôi chảy" } },
      } as any),
    ).rejects.toThrow();
  });
  it("requires exact catalog, V1, model, conditions and candidate hash; keeps legacy prompt identity", async () => {
    const u = unit(),
      source = v1SourceContext(u, "catalog-1"),
      c = (await prepareV1Edit(u, editor)).candidate!;
    await approveV1Edit(c.key, contentHash(c), source, assessment());
    expect(await approvedV1Edit(u, v1SourceContext(u, "catalog-2"))).toBeNull();
    const other = unit();
    other.sourceVersion = "1.80.0";
    expect(
      await approvedV1Edit(other, v1SourceContext(other, "catalog-1")),
    ).toBeNull();
    other.sourceVersion = u.sourceVersion;
    other.conditions[0].applicability = "Chỉ chiếu về Mệnh.";
    expect(
      await approvedV1Edit(other, v1SourceContext(other, "catalog-1")),
    ).toBeNull();
    await expect(
      decideV1Edit(c.key, "0".repeat(64), source, assessment()),
    ).rejects.toThrow("V1_EDIT_REVIEW_MISMATCH");
    const legacyUnit = unit();
    legacyUnit.text += " Văn bản nguồn khác.";
    const model = "unit-editor-not-live",
      promptVersion = "menh-v1-copyedit-1.0.0",
      key = v1EditKey(legacyUnit, model, promptVersion);
    const legacy = {
      ...(await editor(legacyUnit, model)),
      key,
      unit: legacyUnit,
      promptVersion,
      createdAt: new Date().toISOString(),
    };
    await writeEditArtifact("candidates", key, legacy);
    const legacySource = v1SourceContext(legacyUnit, "catalog-1");
    expect(await approvedV1Edit(legacyUnit, legacySource)).toBeNull();
    await approveV1Edit(key, contentHash(legacy), legacySource, assessment());
    expect(
      (await approvedV1Edit(legacyUnit, legacySource))?.promptVersion,
    ).toBe(promptVersion);
    expect(v1EditInstructions(promptVersion)).toBe(V1_EDIT_INSTRUCTIONS);
    expect(v1EditInstructions()).toContain("Giọng Tinh Luận");
    const current = (await prepareV1Edit(legacyUnit, editor)).candidate!;
    await approveV1Edit(
      current.key,
      contentHash(current),
      legacySource,
      assessment(),
    );
    await fs.writeFile(
      path.join(
        dir,
        "reviews",
        current.key,
        sourceContextId(legacySource),
        "00000001.json",
      ),
      "{}",
    );
    expect(await approvedV1Edit(legacyUnit, legacySource)).toBeNull();
  });
  it("serializes competing reviewers with atomic sequence slots; a corrupt journal fails closed", async () => {
    const u = unit(),
      s = v1SourceContext(u, "catalog-1"),
      c = (await prepareV1Edit(u, editor)).candidate!;
    const r = await Promise.allSettled([
      approveV1Edit(c.key, contentHash(c), s, assessment()),
      decideV1Edit(c.key, contentHash(c), s, assessment("rejected")),
    ]);
    expect(r.filter((x) => x.status === "fulfilled")).toHaveLength(1);
    expect(await v1ReviewHistory(c.key, s)).toHaveLength(1);
    await fs.writeFile(
      path.join(dir, "reviews", c.key, sourceContextId(s), "00000001.json"),
      "{}",
    );
    expect(await approvedV1Edit(u, s)).toBeNull();
  });
  it("uses near-duplicate similarity only as a hint, never a reusable content identity", () => {
    const a = unit(),
      b = unit();
    b.conditions[0].applicability = "Một điều kiện áp dụng khác.";
    expect(v1TextSimilarity(a.text, b.text)).toBe(1);
    expect(sourceContextId(v1SourceContext(a, "catalog-1"))).not.toBe(
      sourceContextId(v1SourceContext(b, "catalog-1")),
    );
  });
});
