import { majorStatus } from "../chart-customer-info";
import { sheetPalaces } from "../chart-sheet";
import { entryProvenance } from "../chart-provenance";
import type { ChartSnapshot } from "../tuvi-engine";
import type { FrozenReading } from "../internal-review/dynamic-reading";
import { executeRules, type Claim } from "../interpretation-rules/execute";
import { tanBienRules } from "../interpretation-rules/profile-rules";
import { decadalLayer } from "../tuvi-engine/decadal";
import { periodDisplay } from "../chart-presentation";

export const EXPLORATION_VERSION = "1.3.0";
// Subject binding is intentionally narrower than evidence: an opposing palace in
// a condition is evidence, not permission to interpret that palace independently.
export function subjectOf(claim: Pick<Claim, "factIds">): string | null {
  const subjects = new Set(
    claim.factIds.flatMap((id) =>
      id.startsWith("fact.life-")
        ? ["Mệnh"]
        : id.startsWith("fact.career-")
          ? ["Quan Lộc"]
          : (id.startsWith("fact.wealth-") || id === "fact.finance-npl-thien-khong")
            ? ["Tài Bạch"]
            : id.startsWith("fact.spouse-") ? ["Phu Thê"] : id.startsWith("fact.children-") ? ["Tử Nữ"] : id.startsWith("fact.parents-") ? ["Phụ Mẫu"] : id.startsWith("fact.siblings-") ? ["Huynh Đệ"] : id.startsWith("fact.no-") ? ["Nô Bộc"] : id.startsWith("fact.dien-") ? ["Điền Trạch"] : id.startsWith("fact.phuc-") ? ["Phúc Đức"] : id.startsWith("fact.di-") ? ["Thiên Di"] : [],
    ),
  );
  return subjects.size === 1 ? [...subjects][0] : null;
}
export function exploration(snapshot: ChartSnapshot, frozen?: FrozenReading) {
  if (frozen && frozen.reading.snapshotId !== snapshot.resultId)
    throw Error("SNAPSHOT_MISMATCH");
  const publicRun = frozen
    ? null
    : executeRules(snapshot, tanBienRules(snapshot), "customer");
  const paragraphs = frozen
    ? frozen.reading.sections.flatMap((s) =>
        s.paragraphs.map((p) => ({
          id: p.claim.id,
          title: frozen.reading.readerPresentation ? p.evidence.map(e=>e.title).join("; ") : null,
          topic: frozen.reading.readerPresentation?.separateStarGlosses && s.id === "action" && !frozen.reading.localAdjustments?.length ? "Ý nghĩa riêng từng sao — chưa tổng hợp với tổ hợp" : s.title,
          subject: subjectOf(p.claim),
          text: p.display.text,
          localAdjustment: frozen.reading.localAdjustments?.find(a=>a.baseClaimId===p.claim.id) || null,
          claim: p.claim,
          evidence: p.evidence,
          notes: p.nearbyNotes.map((n) => n.text),
          layers: frozen.layers[p.claim.id] || [],
        })),
      )
    : publicRun!.approvedClaims.map((claim) => ({
        id: claim.id,
        title: null,
        topic: claim.topic === "career" ? "Công việc" : "Tổng quan",
        subject: subjectOf(claim),
        text: claim.text,
        localAdjustment: null,
        claim,
        evidence: [],
        notes: [],
        layers: [],
      }));
  const birthYear = snapshot.chart.lunar?.lunarYear;
  const sheet = sheetPalaces(
    snapshot,
    snapshot.chart.tanBien ? "tanbien" : "engine",
    true,
    false,
    true,
    false,
  );
  const palaces = (snapshot.chart.palaces || []).map((p, index) => ({
    index,
    position: sheet[index].position,
    name: p.name,
    branch: p.earthlyBranch,
    stem: p.heavenlyStem,
    majorNotice:
      frozen?.verified === false && !p.majorStars?.length
        ? "Chưa xác nhận danh sách chính tinh đầy đủ."
        : majorStatus(snapshot, p),
    major: Array.isArray(p.majorStars) ? p.majorStars.map((s) => s.name) : null,
    facts: [
      ...sheet[index].entries.map((e, j) => ({
        key: String(j),
        label:
          entryProvenance(snapshot, e).layer === "extended"
            ? "Lớp bổ sung"
            : "Bản mệnh",
        value: e.label,
      })),
      ...periodDisplay(p),
    ],
    entries: sheet[index].entries.map((e) => ({
      ...e,
      provenance: entryProvenance(snapshot, e),
    })),

    claims: paragraphs.filter((c) => c.subject === p.name).map((c) => c.id),
    relatedClaims: p.name === "Huynh Đệ" && frozen?.reading.sections.some(s=>s.id === "siblings") ? paragraphs.filter(c=>c.claim.factIds.some(id=>id.startsWith("fact.no-tl-"))).map(c=>c.id) : [],
  }));
  const decades = (snapshot.chart.palaces || [])
    .flatMap((p, index) => {
      const range = p.decadal?.range;
      if (
        !Array.isArray(range) ||
        range.length !== 2 ||
        !range.every(Number.isInteger) ||
        range[1] - range[0] !== 9
      )
        return [];
      const years = Number.isInteger(birthYear)
        ? [birthYear + range[0] - 1, birthYear + range[1] - 1]
        : null;
      // Reuse the same pure engine helper against the saved natal data. No snapshot
      // is recalculated or rewritten. This is a separately versioned derived view.
      const layer: ReturnType<typeof decadalLayer> =
        snapshot.profile.id === "tanbien-vn-trial-v2"
          ? decadalLayer(snapshot.chart, years?.[0], snapshot.normalized.gender)
          : {
              version: "unsupported",
              status: "unavailable",
              stars: [],
              issues: ["Chưa hỗ trợ bộ sao đại vận cho profile của hồ sơ này."],
              source: "Khoảng tuổi nguyên từ snapshot.",
            };

      return [
        {
          index,
          palace: p.name,
          branch: p.earthlyBranch,
          range,
          years,
          layer,
          current:
            !!snapshot.normalized.viewYear &&
            !!years &&
            snapshot.normalized.viewYear >= years[0] &&
            snapshot.normalized.viewYear <= years[1],
        },
      ];
    })
    .sort((a, b) => a.range[0] - b.range[0]);
  const tb = snapshot.chart.tanBien;
  return {
    version: EXPLORATION_VERSION,
    snapshotId: snapshot.resultId,
    name: snapshot.normalized.name || "Hồ sơ không ghi họ tên",
    birth: snapshot.normalized,
    internal: !!frozen,
    overviewPresentation: frozen?.reading.overviewPresentation || null,
    tatAch: frozen?.reading.tatAch || null,
    readingVersion: frozen?.reading.templateVersion || publicRun!.schemaVersion,
    readerPresentation: frozen?.reading.readerPresentation || null,
    introduction: frozen?.reading.readerPresentation ? frozen.reading.introduction.text : null,
    lifeMajorNotice: frozen?.reading.readerPresentation ? frozen.reading.lifeMajorNotice : null,
    scopeRules: frozen?.reading.readerPresentation ? frozen.reading.execution.rules : [],
    lifeOverview: frozen?.reading.lifeOverview || null,
    palaceReview: frozen?.reading.palaceReview || null,
    careerAssessment: frozen?.reading.careerAssessment || null,
    financeAssessment: frozen?.reading.financeAssessment || null,
    paragraphs,
    palaces,
    decades,
    topics: frozen
      ? frozen.reading.sections.filter(s=>!["structure","action","learning"].includes(s.id)||s.claims.length).map((s) => s.title)
      : ["Công việc", "Tài chính"],
    annual:
      tb && "viewing" in tb && tb.viewing?.year === snapshot.normalized.viewYear
        ? tb.viewing
        : null,
    coverage: palaces.map((p) => ({
      palace: p.name,
      supportedRules: (frozen?.reading.execution.rules || [])
        .filter((r) => subjectOf({ factIds: r.requiredFacts }) === p.name)
        .map((r) => ({
          id: r.id,
          version: r.version,
          status: r.status,
          sources: r.sourceReferences,
          missingConditions: r.presentation?.unknownConditions || r.limitations,
        })),
      ruleIds: paragraphs
        .filter((c) => p.claims.includes(c.id))
        .flatMap((c) => c.claim.rules.map((r) => r.id + "@" + r.version)),
      status:
        p.major === null
          ? "missing-data"
          : p.claims.length
            ? "claims"
            : "facts-only",
    })),
    gaps: [
      "Chưa có rule luận đại vận, lưu năm hoặc nhật vận trong bộ kết nối này. Không dùng lời luận bản mệnh làm dự báo vận.",
      "Các cung ngoài phạm vi rule chỉ hiển thị dữ kiện. Nhận định đa cung chưa có ánh xạ chủ thể được giữ ở Tổng quan.",
    ],
    traces: frozen?.reading.execution.traces || publicRun!.traces,
  };
}
export type Exploration = ReturnType<typeof exploration>;
export function fullText(m: Exploration) {
  return [
    m.name,
    `Snapshot: ${m.snapshotId}`,
    `Bài đọc: ${m.readingVersion}; khám phá ${m.version}`,
    m.internal
      ? "DỰ THẢO NỘI BỘ — chưa duyệt chuyên môn"
      : "Nội dung qua cổng duyệt khách hàng",
    ...(m.lifeOverview ? ["Tổng quan Mệnh–Thân",...m.lifeOverview.facts.map(f=>f.text),m.lifeOverview.scope,m.lifeOverview.bodyNote,...m.lifeOverview.gaps.map(g=>g.text),m.lifeOverview.bodySource] : []),
    ...m.paragraphs.flatMap((p) => [
      "\n" + p.topic,
      p.text,
      ...p.notes,
      ...p.claim.rules.flatMap((r) => [
        `${r.id}@${r.version}`,
        ...r.limitations,
        ...r.sourceReferences.map(
          (s) => `${s.title} — ${s.location} (${s.url})`,
        ),
      ]),
      `Dữ kiện: ${p.claim.evidencePaths.join(", ")}`,
      `Điều kiện: ${p.claim.reasons.join("; ")}`,
    ]),
    ...(m.careerAssessment
      ? [
          "\nĐiều kiện Công việc đã xét",
          m.careerAssessment.summary,
          ...m.careerAssessment.rows.flatMap((r) => [
            r.title + " — " + r.state,
            r.text,
            r.source,
            "Căn cứ: " + r.paths.join(", "),
            "Claim: " + r.claimIds.join(", "),
          ]),
        ]
      : []),
    ...(m.financeAssessment ? ["\nĐiều kiện Tài chính", m.financeAssessment.mainNote, ...m.financeAssessment.rows.flatMap(r => [r.title, r.text, r.source]), ...m.financeAssessment.related.map(r => r.text)] : []),
    ...m.palaces.flatMap((p) => [
      "\n" + p.name + " tại " + p.branch,
      p.majorNotice || p.major?.join(", ") || "Chưa đủ dữ liệu chính tinh.",
      ...p.facts.map((f) => `${f.label}: ${f.value}`),
      p.claims.length
        ? "Nhận định: " + p.claims.join(", ")
        : "Chưa có luận giải cho trường hợp này.",
    ]),
    ...m.decades.flatMap((d) => [
      `\nĐại vận ${d.range.join("–")} tuổi: ${d.palace}; ${d.years?.join("–") || "chưa rõ năm"}`,
      `Chiều: ${d.layer.direction || "chưa đủ dữ liệu"}`,
      d.layer.stars.map((s) => `ĐV. ${s.name} tại ${s.branch}`).join("; "),
      d.layer.source,
      ...d.layer.issues,
      "Chưa có rule luận đại vận.",
    ]),
    ...(m.annual
      ? [
          `\nNăm xem ${m.annual.year} — ${m.annual.canChi}; ${m.annual.age} tuổi mụ; tiểu hạn tại ${m.annual.annual}`,
          m.annual.stars.map((s) => `${s.name} tại ${s.branch}`).join("; "),
          "Sao lưu năm: Tân Biên tr.268–269; chưa có rule luận năm.",
        ]
      : []),
    ...m.gaps,
  ].join("\n");
}
