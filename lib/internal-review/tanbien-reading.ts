import {VTTL_CAREER_FIRE} from '../interpretation-rules/vttl-root-batch';
import {VTTL_CAREER_CO_AM} from '../interpretation-rules/vttl-career-co-am';
import {TRUNGCHAU_RULE_IDS,SPEECH484} from '../interpretation-rules/trungchau-natal';
import {M05,M07} from '../interpretation-rules/life-literary';
import { overviewPresentation } from './overview-presentation';
import {LIEM_TUONG,KHOA_KIEP,NPL_LOCAL_METHOD} from '../interpretation-rules/npl-local-adjustments';
import { p1ReaderText } from "./p1-reader-text";
import {nplTwoV2Rules as nplTwoRules,nplFoundationRules} from '../interpretation-rules/npl-foundation';
import {nplBodyRules} from '../interpretation-rules/npl-body';
import {lifeBodyRules} from '../interpretation-rules/life-body-method';
import {tatAchReading,type TatAchReading} from "./tat-ach";
import { palaceReview, type PalaceReview } from "./palace-review";
import { emptyLifeRule, emptyLifeTrineRules } from "../interpretation-rules/tanbien-empty-life";
import {readerScope} from "./reader-presentation";
import {lifeOverview} from "./life-overview";
import {lifeContentRules,lifeExpansionRules,lifeHamBranches} from "../interpretation-rules/tanbien-life-content";
import { financeConditions } from "./finance-conditions";
import { careerConditions } from "./career-conditions";
import { tanBienRules } from "../interpretation-rules/profile-rules";
import { careerMajorRuleIds } from "../interpretation-rules/tanbien";
import { careerSourceGate } from "../interpretation-rules/derived";
import { readPath } from "../interpretation-rules/schema";
import {
  editorialText,
  readerIntroduction,
  readerGlossary,
} from "./tanbien-editorial";
import type { ChartSnapshot } from "../tuvi-engine";
import { executeRules } from "../interpretation-rules/execute";
import { catalog } from "../interpretation-rules/catalog";
import {
  nearbyNotes,
  palaceLocation,
  palaceStars,
  bodyLocation,
  readingContext,
  ruleEvidence,
  type ReadingEvidence,
} from "./tanbien-presentation";
export const TANBIEN_TEMPLATE_VERSION = "1.52.0";
const sections = [
  {id:"life-elements",title:"Quan hệ ngũ hành theo phương pháp Nguyễn Phát Lộc",rules:[...nplFoundationRules,...nplTwoRules].map(r=>r.id)},
  {id:"life-body",title:"Vai trò Mệnh–Thân",rules:[...lifeBodyRules,...nplBodyRules].map(r=>r.id)},
  {id:"structure",title:"Cấu trúc Mệnh theo nhánh nguồn",rules:[...lifeContentRules.map(r=>r.id),...lifeExpansionRules.filter(r=>r.presentation?.contentType!=="element-gloss").map(r=>r.id),emptyLifeRule.id,...emptyLifeTrineRules.map(r=>r.id)]},
  {
    id: "action",
    title: "Cách hành động và cân nhắc",
    rules: [
      ...lifeExpansionRules.filter(r=>r.presentation?.contentType==="element-gloss").map(r=>r.id),
      "tanbien.r01",
      "tanbien.r03",
      "tanbien.r08",
      "npl.life-polarity-aligned", "npl.life-polarity-opposed",
      "tanbien.r09",
      "tanbien.r10", LIEM_TUONG, M07,
      "tanbien.r11",
      "tanbien.r12",
      "tanbien.r13",
      "tanbien.r14",
      "tanbien.r15",
      "tanbien.r16",
      "tanbien.r17",
      "tanbien.r18",
      "tanbien.r19",
      "tanbien.r20",

    ],
  },
  {
    id: "learning",
    title: "Học hỏi, sự chủ động",
    rules: ["tanbien.r02", "tanbien.r04", "tanbien.r21", KHOA_KIEP, M05, SPEECH484],
  },
  {
    id: "work",
    title: "Công việc",
    rules: catalog
      .filter(
        (r) =>
          (r.id === VTTL_CAREER_FIRE || r.id === VTTL_CAREER_CO_AM || r.id.startsWith("tanbien.") || TRUNGCHAU_RULE_IDS.includes(r.id)) &&
          r.presentation?.readingTheme === "work",
      )
      .map((r) => r.id),
  },
  {
    id: "finance",
    title: "Tài chính",
    rules: catalog
      .filter(
        (r) =>
          (r.id.startsWith("tanbien.") || TRUNGCHAU_RULE_IDS.includes(r.id)) &&
          r.presentation?.readingTheme === "finance",
      )
      .map((r) => r.id),
  },
  ...([ ["phuc", "Phúc Đức"], ["di", "Thiên Di"], ["no", "Nô Bộc"], ["dien", "Điền Trạch"], ["parents", "Phụ Mẫu"], ["siblings", "Huynh Đệ"], ["spouse", "Phu Thê"], ["children", "Tử Nữ"] ] as const).map(([id,title])=>({id,title,rules:catalog.filter(r=>r.presentation?.readingTheme===id).map(r=>r.id)})),
] as const;
// Internal-only deterministic composition. Every interpretation comes verbatim from a matched claim.
// Exact duplicates already merge in executeRules; distinct base/combination meanings are retained once.
export function buildTanBienReading(
  snapshot: ChartSnapshot,
  options: { unverifiedStarLists?: boolean } = {},
) {
  // New dynamic reads fail closed without a server receipt. Historical default is unchanged.
  if (options.unverifiedStarLists) {
    snapshot = structuredClone(snapshot);
    for (const palace of snapshot.chart.palaces) {
      delete (palace as Partial<typeof palace>).majorStars;
      delete (palace as Partial<typeof palace>).minorStars;
      delete (palace as Partial<typeof palace>).adjectiveStars;
    }
  }
  const execution = executeRules(
    snapshot,
    tanBienRules(snapshot),
    "internal-draft",
    options,
  );
  const used = new Set<string>();
  const scope = execution.previewClaims.length
    ? "supported"
    : execution.traces.some((t) => t.status === "missing-facts")
      ? "unknown"
      : "empty";
  const background: ReadingEvidence[] = [
    palaceLocation(snapshot, "Mệnh"),
    palaceStars(snapshot, "Mệnh"),
    bodyLocation(snapshot),
  ];
  const visibleSections = sections.map((section) => ({
    ...section,
    claims: section.rules.flatMap((id) =>
      execution.previewClaims.filter((c) => {
        if (!c.rules.some((r) => r.id === id) || used.has(c.id)) return false;
        used.add(c.id);
        return true;
      }),
    ),
  }));
  const enriched = visibleSections.map((section) => ({
    ...section,
    title:
      section.id === "learning"
        ? (() => {
            const themes = new Set(
              section.claims.flatMap((c) =>
                c.rules.map((r) => r.presentation?.readingTheme),
              ),
            );
            return themes.has("learning") && themes.has("initiative")
              ? "Học hỏi, sự chủ động"
              : themes.has("learning")
                ? "Học hỏi"
                : themes.has("initiative")
                  ? "Sự chủ động"
                  : "Học hỏi / sự chủ động";
          })()
        : section.id === "action" && section.claims.every(c=>c.rules.every(r=>r.presentation?.contentType === "element-gloss"))
          ? "Các yếu tố tại cung Mệnh" : section.title,
    context: section.claims.length && section.id !== "life-body" && section.id !== "life-elements"
      ? readingContext(snapshot, section.id)
      : null,
    paragraphs: section.claims.map((claim) => ({
      claim,
      secondary:
        section.id === "work" &&
        claim.rules.some((r) => r.id === "tanbien.r36") &&
        section.claims.some((c) =>
          c.rules.some((r) =>
            ["tanbien.r05", "tanbien.r31", "tanbien.r37"].includes(r.id),
          ),
        ),
      display: {
        ...editorialText(claim, snapshot),
        contextLink: null as string | null,
      },
      nearbyNotes: claim.rules.flatMap((r) => nearbyNotes(snapshot, r.id)),
      evidence: claim.rules.map((r) => ruleEvidence(snapshot, r)),
    })),
  }));
  for (const section of enriched)
    for (const p of section.paragraphs)
      p.display.text = p1ReaderText(p.claim.rules.map(r => r.id), p.display.text);
  // Pair by matched claims, never by person/result ID. Raw claims stay immutable.
  const localParagraphs = enriched.flatMap(s=>s.paragraphs);
  const baseLiem = localParagraphs.find(p=>p.claim.rules.some(r=>r.id==='tanbien.r10'));
  const modifierLiem = localParagraphs.find(p=>p.claim.rules.some(r=>r.id===LIEM_TUONG));
  const localAdjustments = baseLiem && modifierLiem ? [{version:NPL_LOCAL_METHOD,kind:'facet-adjustment' as const,baseClaimId:baseLiem.claim.id,adjustmentClaimId:modifierLiem.claim.id,facet:'nóng nảy',direction:'tiết chế',retainedFacets:['thẳng thắn','can đảm','nghiêm nghị'],compatibility:'Tân Biên PDF34,60–62 và Hàm Số PDF89 cùng nét nóng của Liêm tại Mệnh; Hàm Số90,132 tiết chế đúng nét đó. Phối hợp nguồn của sản phẩm, không hợp nhất các phương diện khác.'}] : [];
  if(baseLiem && modifierLiem)baseLiem.display.text='Theo Tân Biên, Liêm Trinh tại Mệnh ở miếu, vượng hoặc đắc được mô tả qua nét thẳng thắn, can đảm và nghiêm nghị. Riêng nét nóng nảy trong lời nền cần đọc cùng sự tiết chế của Thiên Tướng ở đoạn liền sau; đây không phải đánh giá tính cách thực tế của người đọc.';
  if(baseLiem && modifierLiem)baseLiem.display.changes.push('Nét nóng đọc cùng điều chỉnh NPL liền sau; giữ các nét khác và claim gốc. Quan hệ được lưu tại localAdjustments, không phải phép xóa claim.');
  // Keep the full note in evidence; the main article only needs its reading limit.
  for (const section of enriched)
    for (const p of section.paragraphs)
      if (p.claim.rules.some((r) => r.id === "tanbien.r20"))
        p.nearbyNotes = p.nearbyNotes.map((n) =>
          n.text.includes("không tự hòa giải")
            ? {
                ...n,
                text: "Nhận định này chưa đủ để đánh giá cách giao tiếp của người đọc.",
              }
            : n,
        );
  // Same direct-context note is printed once per section; each claim's evidence retains it.
  for (const section of enriched) {
    const seen = new Set<string>();
    for (const paragraph of section.paragraphs)
      paragraph.nearbyNotes = paragraph.nearbyNotes.filter((note) => {
        if (seen.has(note.text)) return false;
        seen.add(note.text);
        return true;
      });
  }
  // Presentation dedup only: omit exact background facts from optional context, retain raw facts in execution.
  const backgroundTexts = new Set(background.map((f) => f.text));
  for (const section of enriched)
    if (section.context)
      section.context.items = section.context.items.filter(
        (i) => !backgroundTexts.has(i.text),
      );
  // Two sections can share the same Mệnh context. Show it once, retaining both section links.
  const contexts: {
    ids: string[];
    titles: string[];
    data: NonNullable<(typeof enriched)[number]["context"]>;
  }[] = [];
  for (const section of enriched)
    if (section.context) {
      const existing = contexts.find(
        (c) => JSON.stringify(c.data) === JSON.stringify(section.context),
      );
      if (existing) {
        existing.ids.push(section.id);
        existing.titles.push(section.title);
      } else
        contexts.push({
          ids: [section.id],
          titles: [section.title],
          data: section.context,
        });
    }
  if (enriched.some((s) => s.id === "work" && s.claims.length))
    background.push(
      palaceLocation(snapshot, "Quan Lộc"),
      palaceStars(snapshot, "Quan Lộc"),
    );
  if (enriched.some((s) => s.id === "finance" && s.claims.length))
    background.push(
      palaceLocation(snapshot, "Tài Bạch"),
      palaceStars(snapshot, "Tài Bạch"),
    );
  const unassessed = [
    ...new Map(
      enriched
        .flatMap((s) => s.paragraphs.flatMap((p) => p.nearbyNotes))
        .filter((n) => n.kind === "snapshot")
        .map((n) => [n.text, n]),
    ).values(),
  ];
  const relevantNames = new Set([
    "Tuần Không",
    "Triệt Lộ",
    "Hỏa Tinh",
    "Linh Tinh",
    "Kình Dương",
    "Đà La",
  ]);
  for (const item of contexts.flatMap((c) => c.data.items)) {
    if (unassessed.length >= 3) break;
    if (
      item.kind === "snapshot" &&
      item.paths.some((p) =>
        relevantNames.has(String(readPath(snapshot, p))),
      ) &&
      !unassessed.some(
        (n) =>
          n.paths.some((p) => item.paths.includes(p)) || n.text === item.text,
      )
    )
      unassessed.push(item);
  }
  for (const section of enriched)
    for (const p of section.paragraphs)
      p.nearbyNotes = p.nearbyNotes.filter((n) => n.kind !== "snapshot");
  const hasLifeMajorReading = execution.previewClaims.some((c) =>
    c.rules.some(
      (r) =>
        r.id !== "tanbien.r04" &&
        (r.conditions.some((x) => ["fact.life-stars","fact.life-complete-major-count"].includes(x.fact)) || lifeHamBranches.some(s=>r.id==="tanbien.life-batch-"+s.id)),
    ),
  );
  const lifeStars = snapshot.chart.palaces.find(p=>p.name === "Mệnh")?.majorStars;
  const lifeMajorNotice = hasLifeMajorReading ? null
    : !Array.isArray(lifeStars) ? "Chưa có danh sách chính tinh Mệnh đầy đủ để xác định phạm vi diễn giải"
    : lifeStars.length === 0 ? "Chưa có diễn giải cho trường hợp Mệnh không có chính tinh này"
    : ["Tử Vi", "Phá Quân"].every(name=>lifeStars.some(s=>s.name===name))
      ? "Chưa có diễn giải cho tổ hợp Tử Vi–Phá Quân tại Mệnh trong phạm vi hiện hỗ trợ"
      : "Chưa có diễn giải cho các chính tinh tại Mệnh trong phạm vi hiện hỗ trợ";
  for (const section of enriched)
    for (const p of section.paragraphs)
      Object.assign(p.display, {
        contextLink: section.context
          ? `context-${contexts.find((c) => c.ids.includes(section.id))!.ids[0]}`
          : null,
      });
  return {
    overviewPresentation: overviewPresentation(snapshot, enriched, !options.unverifiedStarLists) as ReturnType<typeof overviewPresentation> | undefined,
    tatAch: tatAchReading(snapshot,!options.unverifiedStarLists) as TatAchReading | undefined,
    palaceReview: palaceReview(snapshot, execution.previewClaims, !options.unverifiedStarLists) as PalaceReview | undefined,
    readerPresentation: {
      version: "reader-editorial-1.0.0",
      title: "Bản đọc lá số theo Tân Biên",
      scope: readerScope(execution, snapshot),
      absentTopics: [...new Set(enriched.filter(s=>!s.claims.length && ["learning","work","finance"].includes(s.id)).map(s=>s.id==="learning"?"Học hỏi":s.id==="work"?"Công việc":"Tài chính"))],
      separateStarGlosses: execution.previewClaims.some(c=>c.rules.some(r=>r.id.startsWith("tanbien.life-nhat-nguyet-"))),
    },
    lifeOverview: lifeOverview(snapshot,enriched.filter(s=>s.claims.length).map(s=>s.title),!options.unverifiedStarLists,execution.previewClaims.some(c=>c.rules.some(r=>[emptyLifeRule.id,...emptyLifeTrineRules.map(r=>r.id)].includes(r.id))), [...new Set(enriched.filter(s=>!["work","finance"].includes(s.id)).flatMap(s=>s.claims.flatMap(c=>c.rules.map(r=>(r.presentation?.title || r.id).replace(/^R\d+\s*[·:—]\s*/,"")))))] ),
    financeNotice: "Những đoạn dưới đây là chú giải cục bộ theo tài liệu, chưa tổng hợp toàn bộ Tài Bạch và các cung liên quan. Không xác nhận tài sản, thu nhập hay thời điểm phát tài thực tế." as string | undefined,
    financeFacts: [palaceLocation(snapshot,"Tài Bạch"),palaceStars(snapshot,"Tài Bạch")] as ReadingEvidence[] | undefined,
    financeAssessment: financeConditions(snapshot, enriched.find(s => s.id === "finance")!.claims, !options.unverifiedStarLists),
    careerAssessment: careerConditions(
      snapshot,
      enriched.find((s) => s.id === "work")!.claims,
      !options.unverifiedStarLists,
    ),
    workNotice: "Những đoạn dưới đây là liên hệ cục bộ theo sách, chưa tổng hợp toàn bộ Quan Lộc và không xác nhận nghề nghiệp hay thành công thực tế. Văn chức/võ chức là cách phân loại công việc dân sự/quân sự trong ngữ cảnh lịch sử, không tự quy đổi thành chức danh hiện đại." as string | undefined,
    workFacts: [
      palaceLocation(snapshot, "Quan Lộc"),
      palaceStars(snapshot, "Quan Lộc"),
    ],
    workStatusNote:
      execution.traces.some(
        (t) => careerMajorRuleIds.has(t.ruleId) && t.status === "missing-facts",
      ) && !careerSourceGate(snapshot).available
        ? careerSourceGate(snapshot).reason
        : null,
    lifeMajorNotice,
    contextPolicy:
      "Đây là những dữ kiện được chọn để đối chiếu, không phải danh sách đầy đủ.",
    contextLinkText: "Xem dữ kiện liên quan và phạm vi đối chiếu",
    introduction: { kind: "editorial" as const, text: readerIntroduction },
    glossary: readerGlossary,
    openingFacts: background.slice(0, 3),
    unassessed,
    snapshotId: snapshot.resultId,
    templateVersion: TANBIEN_TEMPLATE_VERSION,
    execution,
    localAdjustments,
    facts: execution.derivedFacts.filter((f) =>
      [
        "fact.life-location",
        "fact.life-stars",
        "fact.body-location",
        "fact.career-location",
        "fact.career-stars",
        "fact.wealth-stars",
      ].includes(f.id),
    ),
    scope,
    contexts,
    scopeMessage:
      scope === "empty"
        ? "Chưa có nhận định khớp trong bộ Tân Biên đang triển khai. Điều này không phải kết luận về người đọc; các rule không áp dụng được giữ riêng ở trang chi tiết thực thi."
        : scope === "unknown"
          ? "Chưa có dữ liệu xác định đủ các điều kiện cần thiết; xem từng phần thiếu bên dưới."
          : null,
    background,
    sections: enriched,
    unsupported: enriched.filter((s) => !s.claims.length).map((s) => s.title),
    unknown: execution.traces.filter(
      (t) => !["matched", "condition-false", "exception"].includes(t.status),
    ),
  };
}
