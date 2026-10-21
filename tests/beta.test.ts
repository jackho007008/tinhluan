import { beforeAll, afterAll, it, expect } from "vitest";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { pool } from "../lib/db";
import { loadSample } from "../lib/internal-review/samples";
import { freezeBeta } from "../lib/beta/document";
import {
  prepareBeta,
  issueBetaGrant,
  exchangeBeta,
  betaReading,
  startBeta,
  saveFeedback,
} from "../lib/beta/store";
import { betaEnabled } from "../lib/beta/schema";
import { reviewAuthorized } from "../lib/internal-review/auth";
import { authorize } from "../lib/security";
const ids: string[] = [];
let report: NonNullable<Awaited<ReturnType<typeof loadSample>>>["report"];
const prior = process.env.BETA_ENABLED;
beforeAll(async () => {
  await pool.query(await readFile("db/002_beta.sql", "utf8"));
  report = (await loadSample("engine-combo"))!.report;
});
afterAll(async () => {
  await pool.query("DELETE FROM beta_reports WHERE id=ANY($1::uuid[])", [ids]);
  process.env.BETA_ENABLED = prior;
  await pool.end();
});
async function setup(release = true, source = report) {
  const id = await prepareBeta(source, {
    cohort: "test-" + randomUUID(),
    demo: true,
    expires: new Date(Date.now() + 86400000).toISOString(),
    deleteAfter: new Date(Date.now() + 172800000).toISOString(),
  });
  ids.push(id);
  const grant = await issueBetaGrant(id);
  if (release)
    await pool.query("UPDATE beta_reports SET released_at=now() WHERE id=$1", [
      id,
    ]);
  return { id, grant };
}
function answers(
  a: { id: string; grant: { alias: string } },
  sectionId = "report",
) {
  return {
    id: randomUUID(),
    reportId: a.id,
    readerAlias: a.grant.alias,
    sectionId,
    understanding: 3,
    tags: ["Khó hiểu"],
    basisFound: "yes",
    useful: "DEMO phản hồi kỹ thuật",
    unclear: "",
    concern: "",
    missing: "",
  };
}
it("default off and unreleased editions cannot exchange tokens", async () => {
  delete process.env.BETA_ENABLED;
  expect(betaEnabled()).toBe(false);
  const { grant } = await setup(false);
  await expect(exchangeBeta(grant.token)).rejects.toThrow("BETA_DISABLED");
  process.env.BETA_ENABLED = "true";
  await expect(exchangeBeta(grant.token)).rejects.toThrow("UNAUTHORIZED");
});
it("one-use exchange binds one edition; beta identity cannot authorize orders/internal", async () => {
  process.env.BETA_ENABLED = "true";
  const a = await setup(),
    b = await setup();
  const { session } = await exchangeBeta(a.grant.token);
  await expect(exchangeBeta(a.grant.token)).rejects.toThrow("UNAUTHORIZED");
  expect((await betaReading(session)).report_id).toBe(a.id);
  expect((await betaReading(session)).report_id).not.toBe(b.id);
  expect(reviewAuthorized(session)).toBe(false);
  await expect(authorize(session, randomUUID())).rejects.toThrow(
    "UNAUTHORIZED",
  );
  process.env.BETA_ENABLED = "false";
  await expect(betaReading(session)).rejects.toThrow("BETA_DISABLED");
  process.env.BETA_ENABLED = "true";
});
it.each(["grant-expiry", "report-expiry", "revoke-grant", "withdraw-report"])(
  "%s invalidates existing sessions and feedback",
  async (mode) => {
    const a = await setup(),
      { session } = await exchangeBeta(a.grant.token);
    await startBeta(session, a.id, a.grant.alias);
    if (mode === "grant-expiry")
      await pool.query(
        "UPDATE beta_grants SET expires_at=now()-interval '1 second' WHERE id=$1",
        [a.grant.id],
      );
    if (mode === "report-expiry")
      await pool.query(
        "UPDATE beta_reports SET expires_at=now()-interval '1 second' WHERE id=$1",
        [a.id],
      );
    if (mode === "revoke-grant")
      await pool.query("UPDATE beta_grants SET revoked_at=now() WHERE id=$1", [
        a.grant.id,
      ]);
    if (mode === "withdraw-report")
      await pool.query("UPDATE beta_reports SET revoked_at=now() WHERE id=$1", [
        a.id,
      ]);
    await expect(betaReading(session)).rejects.toThrow("UNAUTHORIZED");
    await expect(saveFeedback(session, answers(a))).rejects.toThrow(
      "UNAUTHORIZED",
    );
  },
);
it("feedback is append-only, versioned by server, and idempotent under concurrency", async () => {
  const a = await setup(),
    { session } = await exchangeBeta(a.grant.token);
  await expect(saveFeedback(session, answers(a))).rejects.toThrow(
    "NOT_STARTED",
  );
  await startBeta(session, a.id, a.grant.alias);
  const doc = (await betaReading(session)).document,
    section = doc.sections.find((s) => s.claimId)!;
  const input = answers(a, section.id);
  await Promise.all([
    saveFeedback(session, input),
    saveFeedback(session, input),
  ]);
  const rows = (
    await pool.query("SELECT * FROM beta_feedback WHERE grant_id=$1", [
      a.grant.id,
    ])
  ).rows;
  expect(rows).toHaveLength(1);
  expect(rows[0].claim_id).toBe(section.claimId);
  expect(rows[0].versions).toEqual(doc.versions);
  await expect(
    saveFeedback(session, { ...input, understanding: 5 }),
  ).rejects.toThrow("IDEMPOTENCY_CONFLICT");
  await expect(
    saveFeedback(session, { ...answers(a), versions: { rules: "forged" } }),
  ).rejects.toThrow();
  await expect(
    saveFeedback(session, answers(a, "unknown-claim")),
  ).rejects.toThrow("INVALID_SECTION");
  await expect(
    pool.query("UPDATE beta_feedback SET answers='{}' WHERE id=$1", [input.id]),
  ).rejects.toThrow("BETA_FEEDBACK_APPEND_ONLY");
  await saveFeedback(session, answers(a));
  expect((await betaReading(session)).completed_at).not.toBeNull();
});
it("a claim from another edition is rejected and another grant cannot replay feedback IDs", async () => {
  const a = await setup(),
    b = await setup(true, (await loadSample("vn-0"))!.report),
    sa = await exchangeBeta(a.grant.token),
    sb = await exchangeBeta(b.grant.token);
  await startBeta(sa.session, a.id, a.grant.alias);
  await startBeta(sb.session, b.id, b.grant.alias);
  const input = answers(a);
  await saveFeedback(sa.session, input);
  await expect(
    saveFeedback(sb.session, {
      ...input,
      reportId: b.id,
      readerAlias: b.grant.alias,
    }),
  ).rejects.toThrow("IDEMPOTENCY_CONFLICT");
  await expect(
    saveFeedback(
      sb.session,
      answers(
        b,
        (await betaReading(sa.session)).document.sections.find(
          (s) => s.claimId,
        )!.id,
      ),
    ),
  ).rejects.toThrow("INVALID_SECTION");
});
it("frozen editions never rerender or overwrite source report; privacy projection excludes technical trace", async () => {
  const original = JSON.stringify(report),
    doc = freezeBeta(report, true);
  expect(JSON.stringify(report)).toBe(original);
  expect(JSON.stringify(doc)).not.toMatch(
    /evidencePaths|ruleSetHash|normalized|token|isBodyPalace/,
  );
  const a = await setup(),
    { session } = await exchangeBeta(a.grant.token);
  await expect(
    pool.query("UPDATE beta_reports SET document='{}' WHERE id=$1", [a.id]),
  ).rejects.toThrow("BETA_EDITION_IMMUTABLE");
  const frozen = (await betaReading(session)).document;
  const changed = structuredClone(report);
  changed.snapshot.chart.palaces.find((p) => p.name === "Mệnh")!.majorStars =
    [];
  freezeBeta(changed, true);
  expect((await betaReading(session)).document).toEqual(frozen);
});
it("missing facts are disclosed before starting and no unsupported combination is smuggled in", async () => {
  const missing = (await loadSample("syn-missing-major"))!.report;
  expect(freezeBeta(missing, true).warnings.join(" ")).toContain(
    "Thiếu dữ liệu chính tinh",
  );
  expect(
    freezeBeta(report, true).sections.some((s) =>
      s.text.includes("Cổ thư đánh giá thuận"),
    ),
  ).toBe(false);
});
it("spam limit caps repeat new submissions, while retry of accepted request remains valid", async () => {
  const a = await setup(),
    { session } = await exchangeBeta(a.grant.token);
  await startBeta(session, a.id, a.grant.alias);
  const first = answers(a);
  await saveFeedback(session, first);
  for (let n = 0; n < 11; n++) await saveFeedback(session, answers(a));
  await expect(saveFeedback(session, answers(a))).rejects.toThrow("RATE_LIMIT");
  await expect(saveFeedback(session, first)).resolves.toBeUndefined();
});
it("operator CLI writes invitation only to a private new file; prepare does not release or invite", async () => {
  const { execFileSync } = await import("node:child_process");
  const { mkdtemp, stat, readFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const dir = await mkdtemp(join(tmpdir(), "tuvi-beta-test-"));
  const cli = (...args: string[]) =>
    execFileSync(
      process.execPath,
      ["--import", "tsx", "scripts/beta.ts", ...args],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          BETA_ENABLED: "false",
          APP_ORIGIN: "http://localhost:3000",
        },
      },
    );
  try {
    const output = cli(
      "prepare",
      "--sample",
      "vn-4",
      "--cohort",
      "demo-cli-" + randomUUID(),
      "--expires",
      new Date(Date.now() + 3600000).toISOString(),
      "--delete-after",
      new Date(Date.now() + 7200000).toISOString(),
    );
    const id = output.match(/[a-f0-9]{8}-[a-f0-9-]{27}/)![0];
    ids.push(id);
    const out = join(dir, "invite.json");
    const grantOutput = cli("grant", "--id", id, "--out", out);
    expect((await stat(out)).mode & 0o777).toBe(0o600);
    const url = JSON.parse(await readFile(out, "utf8")).url as string;
    expect(new URL(url).pathname).toBe("/beta");
    expect(grantOutput.includes(new URL(url).hash.slice(1))).toBe(false);
    const grant = (
      await pool.query("SELECT * FROM beta_grants WHERE report_id=$1", [id])
    ).rows[0];
    expect(grant.invited_at).toBeNull();
    expect(
      (
        await pool.query("SELECT released_at FROM beta_reports WHERE id=$1", [
          id,
        ])
      ).rows[0].released_at,
    ).toBeNull();
    cli("revoke", "--id", grant.id);
    expect(
      (
        await pool.query("SELECT revoked_at FROM beta_grants WHERE id=$1", [
          grant.id,
        ])
      ).rows[0].revoked_at,
    ).not.toBeNull();
    cli("delete", "--id", id);
    expect(
      (await pool.query("SELECT id FROM beta_grants WHERE report_id=$1", [id]))
        .rowCount,
    ).toBe(0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
it("stale tabs cannot attach responses to another report or another reader sharing the same edition", async () => {
  const a = await setup(),
    b = await setup();
  const sa = await exchangeBeta(a.grant.token),
    sb = await exchangeBeta(b.grant.token);
  await expect(startBeta(sb.session, a.id, a.grant.alias)).rejects.toThrow(
    "BETA_CONTEXT_CHANGED",
  );
  await startBeta(sa.session, a.id, a.grant.alias);
  await startBeta(sb.session, b.id, b.grant.alias);
  await expect(saveFeedback(sb.session, answers(a))).rejects.toThrow(
    "BETA_CONTEXT_CHANGED",
  );
  const grant2 = await issueBetaGrant(a.id),
    s2 = await exchangeBeta(grant2.token);
  await startBeta(s2.session, a.id, grant2.alias);
  await expect(saveFeedback(s2.session, answers(a))).rejects.toThrow(
    "BETA_CONTEXT_CHANGED",
  );
  expect(
    (
      await pool.query(
        "SELECT count(*)::int n FROM beta_feedback WHERE report_id=ANY($1::uuid[])",
        [[a.id, b.id]],
      )
    ).rows[0].n,
  ).toBe(0);
});
