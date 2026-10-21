import { randomBytes, randomUUID } from "node:crypto";
import { pool, transaction } from "../db";
import { hash } from "../security";
import { requireBeta, feedbackSchema, type FeedbackInput } from "./schema";
import { freezeBeta, type BetaDocument } from "./document";
import type { ReportData } from "../reports";
import type { PoolClient } from "pg";
const secret = () => randomBytes(32).toString("base64url");
export async function prepareBeta(
  report: ReportData,
  options: {
    cohort: string;
    demo: boolean;
    expires: string;
    deleteAfter: string;
  },
) {
  if (
    !/^[a-z0-9-]{1,60}$/.test(options.cohort) ||
    !Number.isFinite(Date.parse(options.expires)) ||
    !Number.isFinite(Date.parse(options.deleteAfter)) ||
    Date.parse(options.expires) <= Date.now() ||
    Date.parse(options.deleteAfter) < Date.parse(options.expires)
  )
    throw Error("INVALID_BETA_POLICY");
  const document = freezeBeta(report, options.demo),
    id = randomUUID();
  await pool.query(
    "INSERT INTO beta_reports(id,cohort,demo,document,snapshot,versions,expires_at,delete_after) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
    [
      id,
      options.cohort,
      options.demo,
      document,
      report.snapshot,
      document.versions,
      options.expires,
      options.deleteAfter,
    ],
  );
  return id;
}
export async function issueBetaGrant(reportId: string) {
  return transaction(async (c) => {
    const r = (
      await c.query(
        "SELECT * FROM beta_reports WHERE id=$1 AND revoked_at IS NULL AND expires_at>now() FOR UPDATE",
        [reportId],
      )
    ).rows[0];
    if (!r) throw Error("UNAVAILABLE");
    await c.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
      "beta-cohort:" + r.cohort,
    ]);
    const count = (
      await c.query(
        "SELECT count(*)::int n FROM beta_grants g JOIN beta_reports r ON r.id=g.report_id WHERE r.cohort=$1",
        [r.cohort],
      )
    ).rows[0].n;
    if (count >= 10) throw Error("COHORT_LIMIT");
    const id = randomUUID(),
      token = secret(),
      alias = "P-" + randomBytes(6).toString("hex");
    await c.query(
      "INSERT INTO beta_grants(id,report_id,alias,token_hash,expires_at) VALUES($1,$2,$3,$4,$5)",
      [id, reportId, alias, hash(token), r.expires_at],
    );
    return { id, alias, token };
  });
}
// A beta session never resolves an order or an internal-review identity.
const eligible =
  "r.released_at IS NOT NULL AND r.revoked_at IS NULL AND g.revoked_at IS NULL AND r.expires_at>now() AND r.delete_after>now() AND g.expires_at>now()";
async function access(
  c: PoolClient,
  session: string | undefined,
  lock = false,
) {
  requireBeta();
  if (!session || !/^[A-Za-z0-9_-]{43}$/.test(session))
    throw Error("UNAUTHORIZED");
  const r = (
    await c.query(
      `SELECT g.id grant_id,g.alias,g.started_at,g.completed_at,r.id report_id,r.document,r.versions,r.demo,r.expires_at,r.delete_after FROM beta_grants g JOIN beta_reports r ON r.id=g.report_id WHERE g.session_hash=$1 AND ${eligible} ${lock ? "FOR UPDATE OF g,r" : ""}`,
      [hash(session)],
    )
  ).rows[0];
  if (!r) throw Error("UNAUTHORIZED");
  return r as {
    grant_id: string;
    alias: string;
    started_at: Date | null;
    completed_at: Date | null;
    report_id: string;
    document: BetaDocument;
    versions: BetaDocument["versions"];
    demo: boolean;
    expires_at: Date;
    delete_after: Date;
  };
}
export async function exchangeBeta(token: string) {
  requireBeta();
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw Error("UNAUTHORIZED");
  return transaction(async (c) => {
    const g = (
      await c.query(
        `SELECT g.id,r.expires_at FROM beta_grants g JOIN beta_reports r ON r.id=g.report_id WHERE g.token_hash=$1 AND ${eligible} FOR UPDATE OF g,r`,
        [hash(token)],
      )
    ).rows[0];
    if (!g) throw Error("UNAUTHORIZED");
    const session = secret();
    await c.query(
      "UPDATE beta_grants SET token_hash=NULL,session_hash=$2 WHERE id=$1",
      [g.id, hash(session)],
    );
    return { session, expires: g.expires_at as Date };
  });
}
export async function betaReading(session: string | undefined) {
  return transaction((c) => access(c, session));
}
export async function startBeta(
  session: string | undefined,
  reportId: string,
  readerAlias: string,
) {
  return transaction(async (c) => {
    const g = await access(c, session, true);
    if (g.report_id !== reportId || g.alias !== readerAlias)
      throw Error("BETA_CONTEXT_CHANGED");
    await c.query(
      "UPDATE beta_grants SET started_at=COALESCE(started_at,now()) WHERE id=$1",
      [g.grant_id],
    );
  });
}
export async function saveFeedback(session: string | undefined, raw: unknown) {
  const input = feedbackSchema.parse(raw);
  return transaction(async (c) => {
    const g = await access(c, session, true);
    if (g.report_id !== input.reportId || g.alias !== input.readerAlias)
      throw Error("BETA_CONTEXT_CHANGED");
    if (!g.started_at) throw Error("NOT_STARTED");
    const section = g.document.sections.find((s) => s.id === input.sectionId);
    if (input.sectionId !== "report" && !section)
      throw Error("INVALID_SECTION");
    const existing = (
      await c.query("SELECT grant_id,answers FROM beta_feedback WHERE id=$1", [
        input.id,
      ])
    ).rows[0];
    if (existing) {
      if (
        existing.grant_id !== g.grant_id ||
        JSON.stringify(existing.answers) !==
          JSON.stringify(JSON.parse(JSON.stringify(input)))
      ) {
        // PostgreSQL JSONB reorders keys: compare canonical values rather than serialization order.
        const equal =
          existing.grant_id === g.grant_id &&
          Object.keys(input).every(
            (k) =>
              JSON.stringify(existing.answers[k]) ===
              JSON.stringify(input[k as keyof FeedbackInput]),
          );
        if (!equal) throw Error("IDEMPOTENCY_CONFLICT");
      }
      return;
    }
    const count = (
      await c.query(
        "SELECT count(*)::int total,count(*) FILTER(WHERE created_at>now()-interval '10 minutes')::int recent FROM beta_feedback WHERE grant_id=$1",
        [g.grant_id],
      )
    ).rows[0];
    if (count.total >= 50 || count.recent >= 12) throw Error("RATE_LIMIT");
    await c.query(
      "INSERT INTO beta_feedback(id,grant_id,report_id,section_id,claim_id,versions,answers) VALUES($1,$2,$3,$4,$5,$6,$7)",
      [
        input.id,
        g.grant_id,
        g.report_id,
        input.sectionId,
        section?.claimId || null,
        g.versions,
        input,
      ],
    );
    if (input.sectionId === "report")
      await c.query(
        "UPDATE beta_grants SET completed_at=COALESCE(completed_at,now()) WHERE id=$1",
        [g.grant_id],
      );
  });
}
export async function closeBeta(session: string | undefined) {
  requireBeta();
  if (!session) return;
  await pool.query(
    "UPDATE beta_grants SET session_hash=NULL WHERE session_hash=$1",
    [hash(session)],
  );
}
