import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import {
  prepareV1Edit,
  approveV1Edit,
  approvedV1Edit as readApproved,
  contentHash,
  validateV1Edit,
  v1EditKey,
  type V1EditUnit,
  type V1Editor,
} from "../lib/ai/v1-edit";
import {
  v1SourceContext,
  type V1ReviewAssessment,
} from "../lib/ai/v1-review-store";
import { aiModels } from "../lib/ai/config";
const approvedV1Edit = (unit: V1EditUnit) =>
  readApproved(unit, v1SourceContext(unit, "catalog-fixture-1"));
const assessment = (): V1ReviewAssessment => ({
  requestedState: "approved",
  previousReviewId: null,
  note: "Fixture: full source and output compared, not a real astrology approval.",
  checks: Object.fromEntries(
    ["factsAndScope", "conditions", "noNewClaims", "meaning", "sources"].map(
      (k) => [
        k,
        {
          status: "pass",
          evidence:
            "Fixture: this criterion was checked against the whole original.",
        },
      ],
    ),
  ) as V1ReviewAssessment["checks"],
});
let dir: string;
const source = (): V1EditUnit => ({
  sourceVersion: "unit-fixture-not-a-chart",
  title: "Biên tập",
  text: "Vũ Khúc gợi nét quả quyết trong lời luận truyền thống. Nhận định này chưa xác nhận tính cách thực tế.",
  original: "Lời nguồn kỹ thuật kiểm thử.",
  conditions: [
    {
      id: "fixture",
      version: "1",
      status: "draft",
      conditions: [],
      exceptions: [],
      applicability: "Chỉ tọa Mệnh.",
      sourceConditions: [],
      limits: ["Không phải sao chiếu."],
      sources: [{ title: "Nguồn fixture", location: "Không phải sách thật" }],
    },
  ],
  conditionalAssessment: [],
  context: null,
  relations: [],
  sentences: [],
});
const edit: V1Editor = async (unit, model) => ({
  text: unit.text + "\n",
  model,
  responseId: "resp_mock_not_live",
  usage: { inputTokens: 10, cachedInputTokens: 0, outputTokens: 10 },
  durationMs: 5,
});
beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "v1-copyedit-tests-"));
  vi.stubEnv("AI_V1_EDIT_DIR", dir);
  vi.stubEnv("AI_FREE_EDIT_MODEL", "unit-free-edit-model-not-live");
  vi.stubEnv("AI_PAID_READING_MODEL", "unit-paid-model-not-live");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
describe("V1 editorial artifacts", () => {
  it("requires explicit purpose models and never falls back to OPENAI_MODEL", () => {
    vi.stubEnv("OPENAI_MODEL", "legacy-astra");
    vi.stubEnv("AI_FREE_EDIT_MODEL", "");
    vi.stubEnv("AI_PAID_READING_MODEL", "");
    expect(aiModels()).toEqual({ freeEdit: undefined, paidReading: undefined });
  });
  it("claims one immutable content/conditions/model/prompt key across concurrent prepares, requires exact review before reuse", async () => {
    const unit = source(),
      narrator = vi.fn(edit);
    const results = await Promise.all([
      prepareV1Edit(unit, narrator),
      prepareV1Edit(unit, narrator),
    ]);
    expect(narrator).toHaveBeenCalledTimes(1);
    const candidate = results.find((r) => r.candidate)!.candidate!;
    expect(await approvedV1Edit(unit)).toBeNull();
    await expect(
      approveV1Edit(
        candidate.key,
        "wrong",
        v1SourceContext(unit, "catalog-fixture-1"),
        assessment(),
      ),
    ).rejects.toThrow("V1_EDIT_REVIEW_MISMATCH");
    await approveV1Edit(
      candidate.key,
      contentHash(candidate),
      v1SourceContext(unit, "catalog-fixture-1"),
      assessment(),
    );
    expect((await approvedV1Edit(structuredClone(unit)))?.text).toBe(
      candidate.text,
    );
    const changed = source();
    changed.conditions[0].applicability = "Chỉ sao chiếu.";
    expect(v1EditKey(changed, candidate.model)).not.toBe(candidate.key);
    expect(await approvedV1Edit(changed)).toBeNull();
    vi.stubEnv("AI_FREE_EDIT_MODEL", "different-model");
    expect(await approvedV1Edit(unit)).toBeNull();
  });
  it("keeps original fallback after timeout or invalid output and never automatically repeats an ambiguous dispatch", async () => {
    const unit = source(),
      failing = vi.fn(async () => {
        throw Error("provider accepted but connection lost");
      });
    await prepareV1Edit(unit, failing);
    await prepareV1Edit(unit, failing);
    expect(failing).toHaveBeenCalledTimes(1);
    expect(await approvedV1Edit(unit)).toBeNull();
    const other = source();
    other.text += " Lời khác.";
    await prepareV1Edit(other, async (u, m) => ({
      ...(await edit(u, m)),
      text: "Văn bản mới thêm Hóa Khoa và kết quả 99 điểm.",
    }));
    expect(await approvedV1Edit(other)).toBeNull();
    expect(() =>
      validateV1Edit({ text: unit.text, extra: true }, unit),
    ).toThrow();
    expect(() => validateV1Edit({ text: unit.text + " engine" }, unit)).toThrow(
      "V1_EDIT_INTERNAL_TEXT",
    );
    expect(() => validateV1Edit({ text: unit.text + " 10 năm" }, unit)).toThrow(
      "V1_EDIT_CHANGED_NUMBER",
    );
    expect(() =>
      validateV1Edit({ text: unit.text.replace("Vũ Khúc", "Thiên Phủ") }, unit),
    ).toThrow("V1_EDIT_CHANGED_TERM");
  });
  it("rejects a corrupted or changed approved artifact without using its text", async () => {
    const unit = source(),
      prepared = await prepareV1Edit(unit, edit),
      c = prepared.candidate!;
    await approveV1Edit(
      c.key,
      contentHash(c),
      v1SourceContext(unit, "catalog-fixture-1"),
      assessment(),
    );
    const filename = path.join(dir, "candidates", c.key + ".json"),
      a = JSON.parse(await fs.readFile(filename, "utf8"));
    a.text = "Nội dung đã bị đổi ngoài quy trình.";
    await fs.writeFile(filename, JSON.stringify(a));
    expect(await approvedV1Edit(unit)).toBeNull();
  });
});
