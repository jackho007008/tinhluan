import { createHash } from "node:crypto";
import type { ChartSnapshot } from "../tuvi-engine";
import { deriveFacts, type DerivedFact, DERIVATION_VERSION } from "./derived";
import { ruleSchema, readPath, type Rule, type Condition } from "./schema";
export type Trace = {
  ruleId: string;
  version: string;
  status: string;
  details: string[];
};
export type Claim = {
  id: string;
  topic: Rule["topic"];
  text: string;
  rules: Rule[];
  factIds: string[];
  evidencePaths: string[];
  reasons: string[];
  unresolvedWith: string[];
};
const digest = (v: unknown) =>
  createHash("sha256").update(JSON.stringify(v)).digest("hex");
function matches(c: Condition, facts: Map<string, DerivedFact>) {
  const f = facts.get(c.fact);
  if (!f) return false;
  if (c.op === "exists") return true;
  if (c.op === "eq") return f.value === c.value;
  return Array.isArray(f.value) && f.value.some((v) => v === c.value);
}
export function executeRules(
  snapshot: ChartSnapshot,
  rawRules: unknown[],
  purpose: "customer" | "test" | "internal-draft" = "customer",
  options: { unverifiedStarLists?: boolean } = {},
) {
  const derivedFacts = deriveFacts(snapshot).filter(
      (f) =>
        !options.unverifiedStarLists ||
        !f.evidencePaths.some((p) =>
          /\.(majorStars|minorStars|adjectiveStars)(\.|$)/.test(p),
        ),
    ),
    byId = new Map(derivedFacts.map((f) => [f.id, f]));
  const traces: Trace[] = [],
    candidates: Claim[] = [];
  const parsed = rawRules.map((raw) => ruleSchema.safeParse(raw));
  const ids = parsed.filter((p) => p.success).map((p) => p.data!.id);
  for (const [index, p] of parsed.entries()) {
    if (!p.success) {
      traces.push({
        ruleId: `invalid-${index}`,
        version: "unknown",
        status: "invalid-schema",
        details: p.error.issues.map((i) => i.message),
      });
      continue;
    }
    const r = p.data;
    const reject = (status: string, details: string[] = []) =>
      traces.push({ ruleId: r.id, version: r.version, status, details });
    if (ids.filter((id) => id === r.id).length !== 1) {
      reject("duplicate-rule-id");
      continue;
    }
    if (r.origin === "synthetic" && purpose !== "test") {
      reject("synthetic-blocked");
      continue;
    }
    if (
      !r.requiredEngineProfile.includes(snapshot.profile.id as "cn-reference")
    ) {
      reject("wrong-profile");
      continue;
    }
    // AND: a known false condition rules out this claim; missing facts alone never do.
    const failed = r.conditions.filter(
      (c) => byId.has(c.fact) && !matches(c, byId),
    );
    if (failed.length) {
      reject(
        "condition-false",
        failed.map((c) =>
          JSON.stringify({
            ...c,
            actual: byId.get(c.fact)?.value,
            evidencePaths: byId.get(c.fact)?.evidencePaths,
          }),
        ),
      );
      continue;
    }
    const missing = r.requiredFacts.filter((id) => !byId.has(id));
    if (missing.length) {
      reject("missing-facts", missing);
      continue;
    }
    const paths = [
      ...new Set([
        ...r.evidencePaths,
        ...r.requiredFacts.flatMap((id) => byId.get(id)!.evidencePaths),
      ]),
    ];
    if (paths.some((path) => readPath(snapshot, path) === undefined)) {
      reject(
        "missing-evidence",
        paths.filter((path) => readPath(snapshot, path) === undefined),
      );
      continue;
    }
    const exceptions = r.exceptions.filter((c) => matches(c, byId));
    if (exceptions.length) {
      reject(
        "exception",
        exceptions.map((c) =>
          JSON.stringify({
            ...c,
            actual: byId.get(c.fact)?.value,
            evidencePaths: byId.get(c.fact)?.evidencePaths,
          }),
        ),
      );
      continue;
    }
    if (
      r.status === "retired" ||
      (purpose !== "internal-draft" && r.status !== "approved")
    ) {
      reject("not-approved", [
        r.status,
        "Điều kiện khớp nhưng chưa được phép xuất bản.",
      ]);
      continue;
    }
    if (
      purpose !== "internal-draft" &&
      r.sourceReferences.some((s) => s.rights !== "cleared")
    ) {
      reject("rights-pending");
      continue;
    }
    // A review record is mandatory; its authenticity remains a human governance requirement.
    const text = r.claimTemplate.replace(
      /\{\{([^{}]+)\}\}/g,
      (_, id: string) => {
        const v = byId.get(id)!.value;
        return Array.isArray(v) ? v.join(", ") : v;
      },
    );
    const reasons = r.conditions.map((c) =>
      JSON.stringify({
        ...c,
        actual: byId.get(c.fact)?.value,
        evidencePaths: byId.get(c.fact)?.evidencePaths,
      }),
    );
    candidates.push({
      id: digest([r.topic, text]),
      topic: r.topic,
      text,
      rules: [r],
      factIds: [...r.requiredFacts],
      evidencePaths: paths,
      reasons,
      unresolvedWith: [],
    });
    reject("matched", reasons);
  }
  // Exact duplicate text within topic only; preserve all rule provenance.
  const dedup = new Map<string, Claim>();
  for (const c of candidates) {
    const prev = dedup.get(c.id);
    if (prev) {
      prev.rules.push(...c.rules);
      prev.factIds = [...new Set([...prev.factIds, ...c.factIds])];
      prev.evidencePaths = [
        ...new Set([...prev.evidencePaths, ...c.evidencePaths]),
      ];
      prev.reasons.push(...c.reasons);
    } else dedup.set(c.id, structuredClone(c));
  }
  const claims = [...dedup.values()];
  const withheld = new Set<string>();
  for (let i = 0; i < claims.length; i++)
    for (let j = i + 1; j < claims.length; j++) {
      const a = claims[i],
        b = claims[j];
      const pairs = a.rules.flatMap((x) =>
        b.rules
          .filter(
            (y) =>
              x.conflictsWith.includes(y.id) ||
              y.conflictsWith.includes(x.id) ||
              (x.conflictGroup !== null && x.conflictGroup === y.conflictGroup),
          )
          .map((y) => [x, y]),
      );
      if (!pairs.length) continue;
      a.unresolvedWith.push(b.id);
      b.unresolvedWith.push(a.id);
      if (
        pairs.some((pair) =>
          pair.some((r) => r.conflictPolicy === "withhold-all"),
        )
      ) {
        withheld.add(a.id);
        withheld.add(b.id);
      }
    }
  // Withholding propagates through a conflict component: no dangling counterpart.
  let changed = true;
  while (changed) {
    changed = false;
    for (const c of claims)
      if (
        !withheld.has(c.id) &&
        c.unresolvedWith.some((id) => withheld.has(id))
      ) {
        withheld.add(c.id);
        changed = true;
      }
  }
  for (const c of claims)
    if (c.unresolvedWith.length)
      traces.push({
        ruleId: c.rules.map((r) => r.id).join(","),
        version: c.rules.map((r) => r.version).join(","),
        status: withheld.has(c.id) ? "conflict-withheld" : "conflict-retained",
        details: [...c.unresolvedWith],
      });
  const approvedClaims = claims
    .filter((c) => !withheld.has(c.id))
    .sort((a, b) => a.id.localeCompare(b.id));
  const rules = parsed.filter((p) => p.success).map((p) => p.data!);
  return {
    schemaVersion: "1.0.0",
    derivationVersion: DERIVATION_VERSION,
    publication: purpose === "test" ? "test-only" : purpose,
    derivedFacts,
    ruleMatches: candidates,
    approvedClaims: purpose === "internal-draft" ? [] : approvedClaims,
    previewClaims: purpose === "internal-draft" ? approvedClaims : [],
    traces,
    rules: structuredClone(rules),
    ruleSetHash: digest(rawRules),
    claimSetHash: digest(approvedClaims),
  };
}
export type RuleExecution = ReturnType<typeof executeRules>;
