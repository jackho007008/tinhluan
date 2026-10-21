// Operator-only local CLI. Never sends mail or prints tokens/URLs.
import { readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { randomBytes } from "node:crypto";
import { pool } from "../lib/db";
import { hash } from "../lib/security";
import { prepareBeta, issueBetaGrant } from "../lib/beta/store";
import { loadSample } from "../lib/internal-review/samples";
const { positionals, values: v } = parseArgs({
  allowPositionals: true,
  options: {
    sample: { type: "string" },
    order: { type: "string" },
    cohort: { type: "string" },
    expires: { type: "string" },
    "delete-after": { type: "string" },
    id: { type: "string" },
    out: { type: "string" },
    "source-consent": { type: "boolean" },
    "confirm-release": { type: "boolean" },
  },
});
const required = (key: keyof typeof v) => {
  const value = v[key];
  if (typeof value !== "string" || !value) throw Error("MISSING_OPTION");
  return value;
};
const id = () => {
  const x = required("id");
  if (!/^[a-f0-9-]{36}$/.test(x)) throw Error("INVALID_ID");
  return x;
};
async function saveLink(token: string) {
  const out = required("out");
  const origin = new URL(process.env.APP_ORIGIN || "http://localhost:3000");
  if (
    origin.protocol !== "https:" &&
    !["localhost", "127.0.0.1"].includes(origin.hostname)
  )
    throw Error("HTTPS_REQUIRED");
  await writeFile(
    out,
    JSON.stringify({ url: new URL("/beta", origin).href + "#" + token }),
    { mode: 0o600, flag: "wx" },
  );
}
try {
  switch (positionals[0]) {
    case "migrate":
      await pool.query(
        await readFile(new URL("../db/002_beta.sql", import.meta.url), "utf8"),
      );
      console.log("Beta schema ready; no release enabled.");
      break;
    case "prepare": {
      if (!!v.sample === !!v.order) throw Error("CHOOSE_ONE_SOURCE");
      let report;
      if (v.sample) {
        const sample = await loadSample(v.sample);
        if (!sample || sample.sample.kind !== "engine")
          throw Error("ENGINE_SAMPLE_REQUIRED");
        report = sample.report;
      } else {
        if (!v["source-consent"]) throw Error("SOURCE_CONSENT_REQUIRED");
        report = (
          await pool.query("SELECT data FROM reports WHERE order_id=$1", [
            v.order,
          ])
        ).rows[0]?.data;
        if (!report) throw Error("REPORT_NOT_FOUND");
      }
      const reportId = await prepareBeta(report, {
        cohort: required("cohort"),
        demo: !!v.sample,
        expires: required("expires"),
        deleteAfter: required("delete-after"),
      });
      console.log("Prepared beta report " + reportId + "; not released.");
      break;
    }
    case "grant": {
      required("out");
      const g = await issueBetaGrant(id());
      try {
        await saveLink(g.token);
      } catch {
        await pool.query(
          "UPDATE beta_grants SET revoked_at=now(),token_hash=NULL,session_hash=NULL WHERE id=$1",
          [g.id],
        );
        throw Error("LINK_FILE_NOT_WRITTEN_GRANT_REVOKED");
      }
      console.log(
        "Prepared grant " + g.id + " (" + g.alias + "); invitation NOT sent.",
      );
      break;
    }
    case "release":
      if (!v["confirm-release"]) throw Error("OWNER_RELEASE_DECISION_REQUIRED");
      await pool.query(
        "UPDATE beta_reports SET released_at=now() WHERE id=$1 AND revoked_at IS NULL AND expires_at>now()",
        [id()],
      );
      console.log(
        "Edition selected for release; global BETA_ENABLED gate still applies.",
      );
      break;
    case "invited":
      await pool.query(
        "UPDATE beta_grants SET invited_at=COALESCE(invited_at,now()) WHERE id=$1",
        [id()],
      );
      console.log(
        "Operator-recorded invitation; no message sent by this command.",
      );
      break;
    case "revoke":
      await pool.query(
        "UPDATE beta_grants SET revoked_at=now(),token_hash=NULL,session_hash=NULL WHERE id=$1",
        [id()],
      );
      console.log("Grant revoked.");
      break;
    case "withdraw":
      await pool.query("UPDATE beta_reports SET revoked_at=now() WHERE id=$1", [
        id(),
      ]);
      console.log("Edition withdrawn; all linked grants denied.");
      break;
    case "reissue": {
      required("out");
      const token = randomBytes(32).toString("base64url");
      const r = await pool.query(
        "UPDATE beta_grants g SET token_hash=$2,session_hash=NULL FROM beta_reports r WHERE g.id=$1 AND r.id=g.report_id AND g.revoked_at IS NULL AND r.revoked_at IS NULL AND g.expires_at>now() AND r.expires_at>now() RETURNING g.id",
        [id(), hash(token)],
      );
      if (!r.rowCount) throw Error("GRANT_UNAVAILABLE");
      try {
        await saveLink(token);
      } catch {
        await pool.query("UPDATE beta_grants SET token_hash=NULL WHERE id=$1", [
          id(),
        ]);
        throw Error("LINK_FILE_NOT_WRITTEN");
      }
      console.log(
        "New single-use link saved privately; old session invalidated.",
      );
      break;
    }
    case "delete":
      await pool.query("DELETE FROM beta_reports WHERE id=$1", [id()]);
      console.log(
        "Beta edition, grants and feedback deleted; original customer report unchanged.",
      );
      break;
    case "delete-participant":
      await pool.query("DELETE FROM beta_grants WHERE id=$1", [id()]);
      console.log(
        "Participant grant and feedback deleted. Shared edition retained.",
      );
      break;
    case "purge": {
      const r = await pool.query(
        "DELETE FROM beta_reports WHERE delete_after<=now()",
      );
      console.log("Deleted expired beta editions: " + r.rowCount);
      break;
    }
    default:
      console.log(
        "Commands: migrate, prepare, grant, release, invited, revoke, withdraw, reissue, delete, delete-participant, purge. See docs/BETA-READING.md.",
      );
  }
} catch {
  console.error(
    "Beta operation failed; check command options, database and private output path. No credentials printed.",
  );
  process.exitCode = 1;
} finally {
  await pool.end();
}
