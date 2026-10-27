import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { randomUUID, createHash } from "node:crypto";
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
