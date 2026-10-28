import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { randomUUID, createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  describe,
  it,
  expect,
  vi,
} from "vitest";
import { NextRequest } from "next/server";
import { pool } from "../lib/db";
import {
  calculateInternal,
  freezeReading,
} from "../lib/internal-review/dynamic-reading";
import type { InternalReading } from "../lib/internal-review/reading-store";
import { readingHash } from "../lib/order-readings";
import { captureReadingPolicy } from "../lib/trial/reading-policy";
import {
  createTrialOwner,
  saveTrialReading,
  getTrialReading,
  TRIAL_COOKIE,
} from "../lib/trial/store";
import {
  captureAiPolicy,
  requestMenh,
  readMenh,
  findAiJob,
  retryMenh,
} from "../lib/ai/store";
import { menhFacts } from "../lib/ai/facts";
import { retrieveMenhKnowledge } from "../lib/ai/knowledge";
import { executeRules } from "../lib/interpretation-rules/execute";
import { tanBienRules } from "../lib/interpretation-rules/profile-rules";
import { menhInstructions } from "../lib/ai/prompt";
import { runAiMenhJob } from "../lib/ai/worker";
import { GenerationFailure, openaiNarrator } from "../lib/ai/provider";
import { validateNarration } from "../lib/ai/validate";
import { mockMenhGeneration } from "./fixtures/ai-menh-mock";
import { reconcileAiOutbox } from "../lib/ai/outbox";
import { GET, POST } from "../app/api/trial/readings/[id]/ai-menh/route";
import { POST as createReading } from "../app/api/trial/readings/route";
let template: InternalReading,
  owner: Awaited<ReturnType<typeof createTrialOwner>>,
  dir: string;
const base = "http://127.0.0.1:3111";
const req = (id: string, token = owner.token, body?: unknown) =>
  new NextRequest(base + "/api/trial/readings/" + id + "/ai-menh", {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Cookie: TRIAL_COOKIE + "=" + token,
      Origin: base,
      "Content-Type": "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
const params = (id: string) => ({ params: Promise.resolve({ id }) });
const record = (legacy = false) => {
  const r = { ...structuredClone(template), id: randomUUID() };
  if (legacy) delete r.aiPolicy;
  return r;
};
beforeAll(async () => {
  if (
    !new URL(process.env.DATABASE_URL!).pathname.startsWith(
      "/tinhluan_ai_menh_",
    )
  )
    throw Error("ISOLATED_AI_DATABASE_REQUIRED");
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "menh-ai-tests-"));
  vi.stubEnv("TRIAL_READING_DIR", dir);
  vi.stubEnv("AI_MENH_ENABLED", "true");
  vi.stubEnv("FREE_TRIAL_ENABLED", "true");
  vi.stubEnv("CUSTOMER_AUTH_ENABLED", "false");
  vi.stubEnv("READING_RECOVERY_ENABLED", "false");
  vi.stubEnv("APP_ORIGIN", base);
  vi.stubEnv("CUSTOMER_ALLOWED_ORIGINS", base);
  const { snapshot, receipt } = await calculateInternal({
    name: "Hồ sơ kiểm AI riêng",
    date: "2005-06-07",
    hour: 8,
    minute: 30,
    gender: "female",
    calendar: "solar",
    timezone: "Asia/Ho_Chi_Minh",
    profile: "tanbien-vn-trial-v2",
    place: "Không ghi",
    unknownTime: false,
    consent: true,
  });
  const r = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    snapshot,
    receipt,
    frozen: freezeReading(snapshot, receipt),
    aiPolicy: captureAiPolicy(),
  };
  template = { ...r, accessPolicy: captureReadingPolicy(r) };
  owner = await createTrialOwner();
});
beforeEach(async () => {
  vi.stubEnv("AI_MENH_BACKGROUND", "false");
  vi.stubEnv("OPENAI_MODEL", "unit-test-model-not-live");
  vi.stubEnv("OPENAI_API_KEY", "unit-test-key-not-real");
  await pool.query("TRUNCATE ai_reading_attempts,ai_reading_jobs");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
afterAll(async () => {
  vi.unstubAllEnvs();
  await pool.end();
});
describe("facts and source retrieval", () => {
  it("prioritizes only saved V1 Mệnh for this snapshot, keeps draft provenance, and removes unmatched branches/templates", async () => {
    const r = record(),
      before = JSON.stringify(r),
      input = await retrieveMenhKnowledge(r, menhFacts(r));
    expect(input.editorial?.acceptedGroups).toBeGreaterThan(0);
    expect(input.knowledge[0].selection).toBe("matched-v1-editorial");
    const matched = new Set(
      executeRules(
        r.snapshot,
        tanBienRules(r.snapshot),
        "internal-draft",
      ).previewClaims.flatMap((c) => c.rules.map((r) => r.id)),
    );
    for (const k of input.knowledge) {
      expect(JSON.stringify(k)).not.toContain("{{");
      expect([
        "matched-v1-editorial",
        "matched-snapshot",
        "background-method",
      ]).toContain(k.selection);
      for (const id of k.provenance?.ruleIds || [])
        expect(matched.has(id)).toBe(true);
      if (k.provenance)
        expect(k.provenance.certification).toBe(
          "editorial-reference-not-expert-approved",
        );
    }
    expect(JSON.stringify(r)).toBe(before);
  });
  it("rejects V1 copied from a different snapshot and falls back without inventing another report", async () => {
    const r = record();
    r.frozen.continuousReport!.snapshotId = "different-chart";
    r.frozen.continuousReport!.palaces.find(
      (p) => p.name === "Mệnh",
    )!.groups[0].text = "FOREIGN_EDITORIAL_NEVER_SEND";
    let input = await retrieveMenhKnowledge(r, menhFacts(r));
    expect(input.editorial?.status).toBe("mismatch");
    expect(JSON.stringify(input)).not.toContain("FOREIGN_EDITORIAL_NEVER_SEND");
    expect(
      input.knowledge.every((k) => k.selection !== "matched-v1-editorial"),
    ).toBe(true);
    delete r.frozen.continuousReport;
    input = await retrieveMenhKnowledge(r, menhFacts(r));
    expect(input.editorial?.status).toBe("absent");
    expect(input.knowledge.length).toBeGreaterThan(0);
  });
  it("does not copy an unresolved V1 template and preserves legacy prompt versions", async () => {
    const r = record();
    r.frozen.continuousReport!.palaces.find(
      (p) => p.name === "Mệnh",
    )!.groups[0].text = "{{fact.unresolved}}";
    const input = await retrieveMenhKnowledge(r, menhFacts(r));
    expect(input.editorial?.excludedGroups).toBeGreaterThan(0);
    expect(JSON.stringify(input)).not.toContain("{{");
    expect(menhInstructions("menh-vietnamese-1.0.0")).toContain(
      "Phiên bản menh-vietnamese-1.0.0",
    );
    expect(menhInstructions()).toContain("matched-v1-editorial");
    expect(() => menhInstructions("unknown")).toThrow(
      "AI_PROMPT_VERSION_UNSUPPORTED",
    );
  });
  it("accepts a narrow negative lifespan disclaimer but blocks actual/contrasting predictions and internal jargon", () => {
    const input = menhFacts(record()),
      raw = mockMenhGeneration(input).raw as any;
    for (const text of [
      "Bài tham khảo này không dự đoán tuổi thọ.",
      "Long Trì và Thiên Thọ cũng không được tự mở thành phẩm chất hay lời đoán tuổi thọ.",
    ]) {
      raw.sections[4].content = text;
      expect(() => validateNarration(raw, input)).not.toThrow();
    }
    for (const text of [
      "Tuổi thọ của bạn là 90, đây là điều chắc chắn.",
      "Không dự đoán tuổi thọ nhưng bạn sẽ sống 90 tuổi.",
      "Bài không dự đoán tuổi thọ. Bạn sẽ sống 90 tuổi.",
      "Engine cho thấy các sao tọa Mệnh cần được phân tích.",
    ]) {
      raw.sections[4].content = text;
      expect(() => validateNarration(raw, input)).toThrow("AI_SCOPE_VIOLATION");
    }
    raw.sections[4].content =
      "Đoạn tham khảo giữ đúng phạm vi riêng của cung Mệnh.";
    raw.limitations[0] = "Engine chưa có schema cho thông tin này.";
    expect(() => validateNarration(raw, input)).toThrow("AI_SCOPE_VIOLATION");
  });
  it("reads natal stars/states and geometry, omits identity, and never changes snapshot", async () => {
    const r = record(),
      before = JSON.stringify(r),
      input = menhFacts(r);
    expect(input.facts.some((f) => f.text.includes("Vũ Khúc"))).toBe(true);
    expect(input.facts.find((f) => f.id === "geometry.tam-hop")?.kind).toBe(
      "geometry",
    );
    expect(input.facts.filter((f) => f.id.startsWith("natal."))).toHaveLength(
      5,
    );
    expect(JSON.stringify(input)).not.toContain(r.snapshot.normalized.name);
    expect(JSON.stringify(input)).not.toContain("2005-06-07");
    const withKnowledge = await retrieveMenhKnowledge(r, input);
    expect(withKnowledge.knowledge.length).toBeGreaterThan(4);
    expect(
      withKnowledge.knowledge.every(
        (k) => k.references.length && k.conditions.length && k.limits.length,
      ),
    ).toBe(true);
    expect(JSON.stringify(r)).toBe(before);
  });
  it("rejects inconsistent receipts and keeps absent transformation certificate unknown", () => {
    const r = record();
    r.snapshot.chart.palaces[0].majorStars = [];
    expect(() => menhFacts(r)).toThrow("AI_UNVERIFIED_SNAPSHOT");
    const other = record();
    delete other.snapshot.chart.natalTransformations;
    other.receipt!.chartHash = createHash("sha256")
      .update(JSON.stringify(other.snapshot.chart))
      .digest("hex");
    expect(menhFacts(other).missing.join(" ")).toContain("Tứ Hóa");
    expect(menhFacts(other).facts.some((f) => f.id === "natal.Lộc")).toBe(
      false,
    );
  });
  it("retrieves knowledge even when no stored Mệnh claim exists; citations outside packet are refused", async () => {
    const r = record();
    r.frozen.continuousReport!.palaces.find((p) => p.name === "Mệnh")!.groups =
      [];
    const input = await retrieveMenhKnowledge(r, menhFacts(r));
    expect(input.knowledge.length).toBeGreaterThan(0);
    const out = mockMenhGeneration(input).raw as any;
    out.sections[0].knowledgeIds = ["invented-book-page"];
    expect(() => validateNarration(out, input)).toThrow("AI_UNKNOWN_REFERENCE");
    out.sections[0].knowledgeIds = [];
    out.sections[0].content = "Theo sách PDF 999, chắc chắn bạn sẽ thành công.";
    expect(() => validateNarration(out, input)).toThrow("AI_SCOPE_VIOLATION");
  });
});
describe("durable queue, workers and immutable artifacts", () => {
  it("reports a delayed queue without retrying it, then exposes a stored failure instead of pending", async () => {
    const r = record();
    await saveTrialReading(owner.owner, r);
    await requestMenh(r);
    const initial = await findAiJob(r);
    expect(await readMenh(r)).toMatchObject({
      queued: true,
      queueDelayed: false,
    });
    await pool.query(
      "UPDATE ai_reading_jobs SET created_at=now()-interval '3 minutes' WHERE id=$1",
      [initial.id],
    );
    for (let n = 0; n < 2; n++) {
      const response = await GET(req(r.id), params(r.id));
      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({
        state: "not-created",
        queued: true,
        queueDelayed: true,
        canRetry: false,
      });
    }
    expect((await findAiJob(r)).attempts).toBe(0);
    expect(
      +(await pool.query("SELECT count(*) FROM ai_reading_jobs")).rows[0].count,
    ).toBe(1);
    expect(
      +(await pool.query("SELECT count(*) FROM ai_reading_attempts")).rows[0]
        .count,
    ).toBe(0);
    await runAiMenhJob(
      async () => {
        throw new GenerationFailure("AI_REQUEST_REJECTED", false);
      },
      { readingId: r.id },
    );
    const failed = await GET(req(r.id), params(r.id));
    expect(await failed.json()).toMatchObject({
      state: "error",
      queued: false,
      canRetry: false,
      errorCode: "AI_REQUEST_REJECTED",
    });
    expect((await findAiJob(r)).attempts).toBe(1);
  });
  it("scopes the worker to one reading, leaves other backlog untouched, and honors read-only mode", async () => {
    const invalidBudget = spawnSync(
      process.execPath,
      ["--import", "tsx", "scripts/ai-worker.ts"],
      {
        env: {
          ...process.env,
          AI_MENH_READING_ID: randomUUID(),
          AI_MENH_MAX_NEW_JOBS: "Infinity",
        },
        encoding: "utf8",
        timeout: 5000,
      },
    );
    expect(invalidBudget.status).not.toBe(0);
    expect(invalidBudget.stderr).toContain("AI_INVALID_PROCESS_LIMIT");
    const a = record(),
      b = record();
    await requestMenh(a);
    await requestMenh(b);
    expect(
      await runAiMenhJob(async (input) => mockMenhGeneration(input), {
        readingId: a.id,
        allowCreate: false,
      }),
    ).toBe(false);
    await runAiMenhJob(
      async (input, _attempt, recovery) => {
        expect(recovery?.promptVersion).toBe("menh-vietnamese-1.1.0");
        return mockMenhGeneration(input);
      },
      { readingId: a.id },
    );
    expect((await findAiJob(a)).status).toBe("completed");
    expect((await findAiJob(b)).status).toBe("queued");
    expect((await findAiJob(b)).attempts).toBe(0);
    await expect(
      runAiMenhJob(undefined, { revalidateOutput: true }),
    ).rejects.toThrow("AI_REVALIDATE_REQUIRES_READ_ONLY_SCOPE");
  });
  it("revalidates an existing provider output by ID without a new attempt and retains original duration/cost", async () => {
    const r = record();
    await requestMenh(r);
    await runAiMenhJob(async (input, _attempt, recovery) => {
      await recovery!.onResponseCreated("resp_review", "fixture-model");
      return {
        ...mockMenhGeneration(input),
        provider: "openai",
        responseId: "resp_review",
        raw: {},
        durationMs: 12000,
        estimatedCostUsd: 0.1,
      };
    });
    const before = await findAiJob(r);
    await pool.query(
      "UPDATE ai_reading_jobs SET run_after=now()-interval '1 second'",
    );
    await runAiMenhJob(
      async (input, _attempt, recovery) => {
        expect(recovery?.responseId).toBe("resp_review");
        return {
          ...mockMenhGeneration(input),
          provider: "openai",
          responseId: "resp_review",
          durationMs: 50,
          estimatedCostUsd: 0.2,
        };
      },
      { readingId: r.id, allowCreate: false, revalidateOutput: true },
    );
    const after = await findAiJob(r);
    expect(after.status).toBe("completed");
    expect(after.attempt_id).toBe(before.attempt_id);
    expect(after.attempts).toBe(1);
    expect(after.result.durationMs).toBeGreaterThanOrEqual(12000);
    expect(after.result.estimatedCostUsd).toBe(0.1);
  });
  it("deduplicates concurrent enqueue and worker claims; completion/reopen/retry never calls again", async () => {
    const r = record(),
      before = readingHash(r);
    await saveTrialReading(owner.owner, r);
    await Promise.all(Array.from({ length: 4 }, () => requestMenh(r)));
    expect(
      +(await pool.query("SELECT count(*) FROM ai_reading_jobs")).rows[0].count,
    ).toBe(1);
    let release: () => void = () => {};
    const gate = new Promise<void>((res) => {
      release = res;
    });
    const narrator = vi.fn(async (input) => {
      await gate;
      return mockMenhGeneration(input);
    });
    const pending = runAiMenhJob(narrator);
    for (let i = 0; i < 50 && !narrator.mock.calls.length; i++)
      await new Promise((r) => setTimeout(r, 5));
    expect((await readMenh(r)).state).toBe("generating");
    expect(await runAiMenhJob(narrator)).toBe(false);
    await requestMenh(r, true);
    release();
    await pending;
    expect(narrator).toHaveBeenCalledTimes(1);
    const first = await readMenh(r);
    expect(first.state).toBe("completed");
    expect(first.result?.provider).toBe("test-mock");
    await retryMenh(r);
    await requestMenh(r, true);
    expect(await runAiMenhJob(narrator)).toBe(false);
    expect(await readMenh(r)).toEqual(first);
    expect(readingHash((await getTrialReading(owner.owner, r.id))!)).toBe(
      before,
    );
  });
  it("handles invalid schema/reference output, persists error/usage, and safely retries one failed attempt", async () => {
    const r = record();
    await requestMenh(r);
    await runAiMenhJob(async (input) => ({
      ...mockMenhGeneration(input),
      raw: { bad: "schema" },
    }));
    expect((await readMenh(r)).errorCode).toBe("AI_INVALID_OUTPUT");
    expect((await findAiJob(r)).result).toBeNull();
    await pool.query(
      "UPDATE ai_reading_jobs SET run_after=now()-interval '1 second'",
    );
    await retryMenh(r);
    await runAiMenhJob(async (input) => mockMenhGeneration(input));
    expect((await readMenh(r)).state).toBe("completed");
    expect(
      +(await pool.query("SELECT count(*) FROM ai_reading_attempts")).rows[0]
        .count,
    ).toBe(2);
  });
  it("keeps timeout/network outcome uncertain, with no automatic or owner retry that could bill twice", async () => {
    const r = record();
    await requestMenh(r);
    const narrator = vi.fn(async () => {
      throw new GenerationFailure("AI_OUTCOME_UNCERTAIN", false, true);
    });
    await runAiMenhJob(narrator);
    expect(await readMenh(r)).toMatchObject({
      state: "error",
      canRetry: false,
      errorCode: "AI_OUTCOME_UNCERTAIN",
    });
    await requestMenh(r, true);
    expect(await runAiMenhJob(narrator)).toBe(false);
    expect(narrator).toHaveBeenCalledTimes(1);
  });
  it("can retry a known rate limit, caps attempts and never changes a completed result", async () => {
    const r = record();
    await requestMenh(r);
    for (let i = 0; i < 3; i++) {
      await runAiMenhJob(async () => {
        throw new GenerationFailure("AI_RATE_LIMITED", true);
      });
      await pool.query(
        "UPDATE ai_reading_jobs SET run_after=now()-interval '1 second'",
      );
      await retryMenh(r);
    }
    expect((await findAiJob(r)).attempts).toBe(3);
    expect((await readMenh(r)).canRetry).toBe(false);
    expect(await runAiMenhJob()).toBe(false);
  });
  it("marks stale dispatched work uncertain rather than re-dispatching", async () => {
    const r = record();
    await requestMenh(r);
    await pool.query(
      "UPDATE ai_reading_jobs SET status='running',locked_at=now()-interval '10 minutes'",
    );
    const narrator = vi.fn(async (input) => mockMenhGeneration(input));
    expect(await runAiMenhJob(narrator)).toBe(false);
    expect((await readMenh(r)).errorCode).toBe("AI_INTERRUPTED");
    expect(narrator).not.toHaveBeenCalled();
  });
  it("reconciles only new marked outbox requests; historical files/rights remain byte-identical", async () => {
    const old = record(true),
      r = record();
    await saveTrialReading(owner.owner, old);
    await saveTrialReading(owner.owner, r);
    const before = readingHash((await getTrialReading(owner.owner, old.id))!);
    await reconcileAiOutbox();
    expect(await findAiJob(old)).toBeUndefined();
    expect(await findAiJob(r)).toBeDefined();
    expect(readingHash((await getTrialReading(owner.owner, old.id))!)).toBe(
      before,
    );
  });
});
describe("saved AI editions remain immutable", () => {
  it("keeps completed results readable when generation is disabled or the supported edition changes", async () => {
    const r = record();
    await requestMenh(r);
    await runAiMenhJob(async (input) => mockMenhGeneration(input));
    const saved = (await readMenh(r)).result;
    vi.stubEnv("AI_MENH_ENABLED", "false");
    expect(await readMenh(r)).toMatchObject({
      state: "completed",
      canRetry: false,
      result: saved,
    });
    await expect(requestMenh(r, true)).rejects.toThrow("AI_NOT_ELIGIBLE");
    vi.stubEnv("AI_MENH_ENABLED", "true");
    const previousHash = readingHash(r);
    r.aiPolicy!.edition = "menh-ai-historical-fixture";
    await pool.query(
      "UPDATE ai_reading_jobs SET edition=$2,reading_hash=$3 WHERE reading_hash=$1",
      [previousHash, r.aiPolicy!.edition, readingHash(r)],
    );
    expect(await readMenh(r)).toMatchObject({
      state: "completed",
      eligible: false,
      result: saved,
    });
    await expect(requestMenh(r, true)).rejects.toThrow("AI_NOT_ELIGIBLE");
  });
});
describe("server ownership and creation integration", () => {
  it("allows free Mệnh without payment; GET/open does not enqueue; denies strangers, CSRF, old editions and other palaces", async () => {
    const r = record(),
      old = record(true);
    await saveTrialReading(owner.owner, r);
    await saveTrialReading(owner.owner, old);
    expect((await GET(req(r.id), params(r.id))).status).toBe(200);
    expect(await findAiJob(r)).toBeUndefined();
    expect((await POST(req(r.id, owner.token, {}), params(r.id))).status).toBe(
      200,
    );
    expect(
      (await POST(req(r.id, "f".repeat(64), {}), params(r.id))).status,
    ).toBe(404);
    expect((await GET(req(r.id, "f".repeat(64)), params(r.id))).status).toBe(
      404,
    );
    expect(
      (await POST(req(old.id, owner.token, {}), params(old.id))).status,
    ).toBe(403);
    expect(
      (await POST(req(r.id, owner.token, { palace: "Quan Lộc" }), params(r.id)))
        .status,
    ).toBe(400);
    const cross = new NextRequest(
      base + "/api/trial/readings/" + r.id + "/ai-menh",
      {
        method: "POST",
        headers: {
          Cookie: TRIAL_COOKIE + "=" + owner.token,
          Origin: "https://untrusted.invalid",
          "Content-Type": "application/json",
        },
        body: "{}",
      },
    );
    expect((await POST(cross, params(r.id))).status).toBe(403);
    expect(
      (await pool.query("SELECT DISTINCT palace FROM ai_reading_jobs")).rows,
    ).toEqual([{ palace: "Mệnh" }]);
  });
  it("saves engine snapshot first, then queues the exact saved hash once, including duplicate creation request", async () => {
    const id = randomUUID(),
      body = {
        id,
        customerInput: {
          name: "Kiểm tạo AI Mệnh",
          day: 7,
          month: 6,
          year: 2005,
          calendar: "solar",
          isLeap: false,
          hourIndex: 4,
          gender: "female",
        },
      };
    const request = () =>
      new NextRequest(base + "/api/trial/readings", {
        method: "POST",
        headers: {
          Cookie: TRIAL_COOKIE + "=" + owner.token,
          Origin: base,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    const response = await createReading(request());
    expect(response.status).toBe(200);
    const saved = (await getTrialReading(owner.owner, id))!;
    expect(saved.aiPolicy?.palace).toBe("Mệnh");
    expect((await findAiJob(saved)).reading_hash).toBe(readingHash(saved));
    expect((await createReading(request())).status).toBe(200);
    expect(
      +(
        await pool.query(
          "SELECT count(*) FROM ai_reading_jobs WHERE reading_id=$1",
          [id],
        )
      ).rows[0].count,
    ).toBe(1);
  });
});
describe("bounded cost and recovery controls", () => {
  it("stores a missing-configuration error without any provider request", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    const r = record();
    await requestMenh(r);
    await runAiMenhJob();
    expect(await readMenh(r)).toMatchObject({
      state: "error",
      errorCode: "AI_NOT_CONFIGURED",
      canRetry: false,
    });
    expect(
      (await pool.query("SELECT response_id FROM ai_reading_attempts")).rows[0]
        .response_id,
    ).toBeNull();
  });
  it("serializes the daily budget check across distinct simultaneous requests", async () => {
    vi.stubEnv("AI_MENH_MAX_DAILY_JOBS", "1");
    try {
      const outcomes = await Promise.allSettled([
        requestMenh(record()),
        requestMenh(record()),
      ]);
      expect(outcomes.filter((x) => x.status === "fulfilled")).toHaveLength(1);
      expect(outcomes.filter((x) => x.status === "rejected")).toHaveLength(1);
      expect(
        +(await pool.query("SELECT count(*) FROM ai_reading_jobs")).rows[0]
          .count,
      ).toBe(1);
    } finally {
      vi.stubEnv("AI_MENH_MAX_DAILY_JOBS", "20");
    }
  });
  it("does not change completed artifacts when the additive migration is reapplied", async () => {
    const r = record();
    await requestMenh(r);
    await runAiMenhJob(async (input) => mockMenhGeneration(input));
    const before = await readMenh(r);
    await pool.query(await fs.readFile("db/011_ai_readings.sql", "utf8"));
    expect(await readMenh(r)).toEqual(before);
  });
});
describe("official SDK adapter with intercepted HTTP, no real API calls", () => {
  it("does not reuse the previous provider response ID when a known invalid output is manually retried", async () => {
    const r = record();
    await requestMenh(r);
    await runAiMenhJob(async (input, _attempt, recovery) => {
      await recovery!.onResponseCreated("resp_invalid_output", "fixture-model");
      return {
        ...mockMenhGeneration(input),
        provider: "openai",
        responseId: "resp_invalid_output",
        raw: {},
      };
    });
    expect((await findAiJob(r)).status).toBe("error");
    await pool.query(
      "UPDATE ai_reading_jobs SET run_after=now()-interval '1 second'",
    );
    await retryMenh(r);
    await runAiMenhJob(async (input, _attempt, recovery) => {
      expect(recovery!.responseId).toBeUndefined();
      await recovery!.onResponseCreated("resp_valid_retry", "fixture-model");
      return {
        ...mockMenhGeneration(input),
        provider: "openai",
        responseId: "resp_valid_retry",
      };
    });
    expect((await findAiJob(r)).attempts).toBe(2);
    expect((await readMenh(r)).state).toBe("completed");
    const attempts = (
      await pool.query(
        "SELECT status,response_id FROM ai_reading_attempts ORDER BY started_at",
      )
    ).rows;
    expect(attempts).toEqual([
      { status: "error", response_id: "resp_invalid_output" },
      { status: "completed", response_id: "resp_valid_retry" },
    ]);
  });
  it("persists background response ID before GET, survives a lost connection, and resumes the same attempt without another CREATE", async () => {
    vi.stubEnv("AI_MENH_BACKGROUND", "true");
    const r = record();
    await requestMenh(r);
    const output = mockMenhGeneration((await findAiJob(r)).input);
    let creates = 0,
      gets = 0;
    const fetcher = vi.fn(async (url: any, init: any) => {
      const address = String(url);
      const headers = { "Content-Type": "application/json" };
      if (address.includes("/models/"))
        return new Response(
          JSON.stringify({
            id: "unit-test-model-not-live",
            object: "model",
            created: 0,
            owned_by: "test",
          }),
          { headers },
        );
      if (init.method === "POST") {
        creates++;
        const body = JSON.parse(init.body);
        expect(body.background).toBe(true);
        expect(body.store).toBe(true);
        expect(body.text.format.schema.properties.sections.minItems).toBe(8);
        return new Response(
          JSON.stringify({
            id: "resp_recoverable",
            object: "response",
            status: "queued",
            model: "actual-fixture-model",
            output: [],
          }),
          { headers },
        );
      }
      gets++;
      const attempt = (
        await pool.query("SELECT response_id,provider FROM ai_reading_attempts")
      ).rows[0];
      expect(attempt).toMatchObject({
        response_id: "resp_recoverable",
        provider: "openai",
      });
      expect(address).toContain("/responses/resp_recoverable");
      if (gets === 1)
        throw new DOMException(
          "connection dropped after provider accepted",
          "AbortError",
        );
      return new Response(
        JSON.stringify({
          id: "resp_recoverable",
          object: "response",
          status: "completed",
          model: "actual-fixture-model",
          output: [
            {
              type: "message",
              id: "msg",
              status: "completed",
              role: "assistant",
              content: [
                {
                  type: "output_text",
                  text: JSON.stringify(output.raw),
                  annotations: [],
                },
              ],
            },
          ],
          usage: {
            input_tokens: 100,
            input_tokens_details: { cached_tokens: 0 },
            output_tokens: 200,
            output_tokens_details: { reasoning_tokens: 20 },
          },
        }),
        { headers },
      );
    });
    vi.stubGlobal("fetch", fetcher);
    await runAiMenhJob();
    expect(await readMenh(r)).toMatchObject({
      state: "error",
      canRetry: false,
      errorCode: "AI_OUTCOME_UNCERTAIN",
    });
    const first = await findAiJob(r);
    await retryMenh(r);
    expect((await findAiJob(r)).status).toBe("uncertain");
    // A missing key during GET recovery must not turn an already dispatched
    // response into a retryable CREATE when configuration is restored.
    vi.stubEnv("OPENAI_API_KEY", "");
    await pool.query(
      "UPDATE ai_reading_jobs SET run_after=now()-interval '1 second'",
    );
    await runAiMenhJob();
    expect((await findAiJob(r)).status).toBe("uncertain");
    expect((await findAiJob(r)).attempts).toBe(1);
    expect(creates).toBe(1);
    vi.stubEnv("OPENAI_API_KEY", "unit-test-key-not-real");
    await pool.query(
      "UPDATE ai_reading_jobs SET run_after=now()-interval '1 second'",
    );
    await Promise.all([runAiMenhJob(), runAiMenhJob()]);
    expect(await readMenh(r)).toMatchObject({
      state: "completed",
      result: { model: "actual-fixture-model", provider: "openai" },
    });
    const last = await findAiJob(r);
    expect(last.attempt_id).toBe(first.attempt_id);
    expect(last.attempts).toBe(1);
    expect(creates).toBe(1);
    expect(gets).toBe(2);
    expect(
      (await pool.query("SELECT count(*) FROM ai_reading_attempts")).rows[0]
        .count,
    ).toBe("1");
    expect(
      (await pool.query("SELECT error_code FROM ai_reading_attempts")).rows[0]
        .error_code,
    ).toBeNull();
    const calls = fetcher.mock.calls.length;
    await readMenh(r);
    await requestMenh(r, true);
    await runAiMenhJob();
    expect(fetcher).toHaveBeenCalledTimes(calls);
  });
  it("does not repeat a background CREATE if the provider accepted it but the response ID was lost", async () => {
    vi.stubEnv("AI_MENH_BACKGROUND", "true");
    const r = record();
    await requestMenh(r);
    let creates = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: any) => {
        if (String(url).includes("/models/"))
          return new Response(
            JSON.stringify({
              id: "unit-test-model-not-live",
              object: "model",
              created: 0,
              owned_by: "test",
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        creates++;
        throw new DOMException(
          "accepted, but no response received",
          "AbortError",
        );
      }),
    );
    await runAiMenhJob();
    expect((await findAiJob(r)).status).toBe("uncertain");
    await pool.query(
      "UPDATE ai_reading_jobs SET run_after=now()-interval '1 hour',locked_at=now()-interval '1 hour'",
    );
    await retryMenh(r);
    expect(await runAiMenhJob()).toBe(false);
    expect(creates).toBe(1);
    expect(
      (await pool.query("SELECT response_id FROM ai_reading_attempts")).rows[0]
        .response_id,
    ).toBeNull();
  });
  it("recovers a crashed worker by GET and blocks retries when the stored provider response was deleted", async () => {
    const r = record();
    await requestMenh(r);
    await runAiMenhJob(async (_input, _attempt, recovery) => {
      await recovery!.onResponseCreated("resp_deleted", "original-model");
      throw new GenerationFailure("AI_OUTCOME_UNCERTAIN", false, true);
    });
    await pool.query(
      "UPDATE ai_reading_jobs SET status='running',locked_at=now()-interval '7 minutes',run_after=now()-interval '1 hour'",
    );
    const fetcher = vi.fn(async (url: any, init: any) => {
      expect(init.method).not.toBe("POST");
      expect(String(url)).toContain("/responses/resp_deleted");
      return new Response(
        JSON.stringify({
          error: { message: "deleted", type: "invalid_request_error" },
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    });
    vi.stubGlobal("fetch", fetcher);
    await runAiMenhJob();
    expect(await readMenh(r)).toMatchObject({
      state: "error",
      canRetry: false,
      errorCode: "AI_RESPONSE_UNAVAILABLE",
    });
    expect((await findAiJob(r)).attempts).toBe(1);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(await runAiMenhJob()).toBe(false);
  });
  it("uses Responses + strict schema, actual model/usage, no stored provider response or hidden SDK retry", async () => {
    const r = record(),
      input = await retrieveMenhKnowledge(r, menhFacts(r)),
      output = mockMenhGeneration(input);
    const fetcher = vi.fn(async (url: any, init: any) => {
      if (String(url).includes("/models/"))
        return new Response(
          JSON.stringify({
            id: "unit-test-model-not-live",
            object: "model",
            created: 0,
            owned_by: "test",
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      const body = JSON.parse(init.body);
      expect(body.store).toBe(false);
      expect(body.text.format.strict).toBe(true);
      expect(body.instructions).toContain("không bị giới hạn viết lại catalog");
      expect(init.body).not.toContain(r.snapshot.normalized.name);
      return new Response(
        JSON.stringify({
          id: "resp_mock",
          object: "response",
          status: "completed",
          model: "actual-model-returned-by-fixture",
          output: [
            {
              type: "message",
              id: "msg_mock",
              status: "completed",
              role: "assistant",
              content: [
                {
                  type: "output_text",
                  text: JSON.stringify(output.raw),
                  annotations: [],
                },
              ],
            },
          ],
          usage: {
            input_tokens: 123,
            input_tokens_details: { cached_tokens: 10 },
            output_tokens: 234,
            output_tokens_details: { reasoning_tokens: 80 },
          },
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    });
    vi.stubGlobal("fetch", fetcher);
    const result = await openaiNarrator(input, randomUUID());
    expect(result.model).toBe("actual-model-returned-by-fixture");
    expect(result.usage.inputTokens).toBe(123);
    expect(validateNarration(result.raw, input).sections).toHaveLength(8);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("never falls back on model access failure, timeout ambiguity or missing key", async () => {
    const input = menhFacts(record()),
      fetcher = vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              error: { message: "access denied", type: "permission_error" },
            }),
            { status: 403, headers: { "Content-Type": "application/json" } },
          ),
      );
    vi.stubGlobal("fetch", fetcher);
    await expect(openaiNarrator(input, randomUUID())).rejects.toMatchObject({
      code: "AI_MODEL_UNAVAILABLE",
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
    vi.stubEnv("OPENAI_API_KEY", "");
    await expect(openaiNarrator(input, randomUUID())).rejects.toMatchObject({
      code: "AI_NOT_CONFIGURED",
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("does not SDK-retry an ambiguous Responses network timeout", async () => {
    const fetcher = vi.fn(async (url: any) => {
      if (String(url).includes("/models/"))
        return new Response(
          JSON.stringify({
            id: "unit-test-model-not-live",
            object: "model",
            created: 0,
            owned_by: "test",
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      throw new DOMException("test timeout, no secret", "AbortError");
    });
    vi.stubGlobal("fetch", fetcher);
    await expect(
      openaiNarrator(menhFacts(record()), randomUUID()),
    ).rejects.toMatchObject({
      code: "AI_OUTCOME_UNCERTAIN",
      retryable: false,
      uncertain: true,
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
