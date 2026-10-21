import {TatAchReading} from "./TatAchReading";
import PalaceReviewEvidence from "./PalaceReviewEvidence";
import ReadingScope from "./ReadingScope";
import LifeOverview from "./LifeOverview";
import type { FrozenReading } from "@/lib/internal-review/dynamic-reading";
import Chart from "./Chart";
import StarConventionNotice from "./StarConventionNotice";
import EditorialHashNavigation from "./EditorialHashNavigation";
import type { ChartSnapshot } from "@/lib/tuvi-engine";
import { buildTanBienReading } from "@/lib/internal-review/tanbien-reading";
import {
  evidenceLayers,
  missingText,
  PRESENTATION_VERSION,
  ruleTitles,
  sourceTablesForRule,
  type ReadingEvidence,
} from "@/lib/internal-review/tanbien-presentation";
import { RULESET_VERSION } from "@/lib/interpretation-rules/catalog";
function EvidenceList({ items }: { items: ReadingEvidence[] }) {
  return (
    <ul>
      {items.map((f, i) => (
        <li key={i}>
          {f.kind === "geometry"
            ? "Quan hệ vị trí: "
            : f.kind === "source"
              ? "Đối chiếu bảng nguồn: "
              : ""}
          {f.text}
        </li>
      ))}
    </ul>
  );
}
export default function TanBienReading({
  snapshot,
  frozen,
  readingId,
  hideChart = false,
}: {
  snapshot: ChartSnapshot;
  frozen?: FrozenReading;
  readingId?: string;
  hideChart?: boolean;
}) {
  const reading = frozen?.reading || buildTanBienReading(snapshot);
  const presentationVersion =
    frozen?.presentationVersion || PRESENTATION_VERSION;
  const catalogVersion = frozen?.catalogVersion || RULESET_VERSION;
  const modern = reading.readerPresentation;
  const Related = modern ? "details" : "section";
  return (
    <section data-testid="rule-reading" data-snapshot={snapshot.resultId}>
      <h1>{modern?.title || "Tổng quan — bài từ rule"}</h1>
      <StarConventionNotice snapshot={snapshot} />
      {!hideChart &&
        (frozen?.verified === false ? (
          <p>
            Chưa xác minh độ đầy đủ danh sách sao; không hiển thị danh sách rỗng
            như kết luận không có sao.
          </p>
        ) : (
          <details
            id="reading-chart"
            className="card"
            open={!!snapshot.normalized.viewYear}
            data-chart-preview
          >
            <summary>Mở lá số — trạng thái theo Tân Biên</summary>
            <Chart
              snapshot={snapshot}
              context="tanbien"
              readingId={readingId}
            />
          </details>
        ))}
      <p className="notice" data-editorial-introduction>
        {reading.introduction.text}
      </p>
      {reading.lifeOverview && <LifeOverview value={reading.lifeOverview} />}
{reading.palaceReview && <PalaceReviewEvidence value={reading.palaceReview} />}
      {!reading.lifeOverview && <p data-opening-facts>
        {reading.openingFacts.map((f) => f.text).join(" ")}
      </p>}
      <details data-glossary>
        <summary>Giải thích ngắn các thuật ngữ</summary>
        <dl>
          {reading.glossary.map((g) => (
            <div key={g.term}>
              <dt>
                <strong>{g.term}</strong>
              </dt>
              <dd>{g.text}</dd>
            </div>
          ))}
        </dl>
      </details>
      {reading.lifeMajorNotice && (
        <p data-life-major-notice>{reading.lifeMajorNotice}.</p>
      )}
      <EditorialHashNavigation />
      {reading.scopeMessage && <p role="status">{reading.scopeMessage}</p>}
      <details className="card">
        <summary>Dữ kiện trên lá số đang đọc</summary>
        <EvidenceList items={reading.background} />
        <details data-technical>
          <summary>Chi tiết kỹ thuật — dữ kiện nền</summary>
          <p>
            Snapshot: {snapshot.resultId}; profile {snapshot.profile.id}; engine{" "}
            {snapshot.versions.engine}; template {reading.templateVersion};
            formatter {presentationVersion}; catalog {catalogVersion}.
          </p>
          <pre>{JSON.stringify(reading.background, null, 2)}</pre>
        </details>
      </details>
      {reading.workStatusNote && (
        <p className="notice" data-work-status>
          {reading.workStatusNote}
        </p>
      )}
      {reading.sections
        .filter((s) => s.claims.length || (s.id === "work" && reading.workNotice) || (s.id === "finance" && reading.financeNotice))
        .map((section) => (
          <section key={section.id} id={"reading-palace-"+section.id} data-section={section.id}>
            <h2>{modern?.separateStarGlosses && section.id === "action" && !reading.localAdjustments?.length ? "Ý nghĩa riêng từng sao — chưa tổng hợp với tổ hợp" : section.title}</h2>
            {['phuc','di'].includes(section.id) && <p className="notice">Các chú giải sau nói về đúng cung của hồ sơ. Chưa tổng hợp toàn cung hoặc liên cung; không dùng lời về tuổi thọ, bệnh tật, phẩm hạnh hay hoàn cảnh người thân làm kết luận thực tế.</p>}
            {['finance','structure'].includes(section.id) && reading.sections.some(s=>['phuc','di'].includes(s.id)&&s.claims.length>0) && <details><summary>Xem căn cứ — phần đọc các cung liên quan</summary><p>Các phần đọc dưới đây có căn cứ riêng; chưa có phép hợp nhất thành kết luận về Mệnh hoặc Tài chính.</p>{reading.sections.filter(s=>['phuc','di'].includes(s.id)&&s.claims.length>0).map(s=><p key={s.id}><a href={'#reading-palace-'+s.id}>{s.title}</a></p>)}</details>}
            {['work','finance'].includes(section.id) && reading.sections.some(s=>s.id===(section.id==='work'?'no':'dien')&&s.claims.length>0) && <details><summary>Xem căn cứ — phần đọc liên quan</summary><p>Phần đọc có điều kiện riêng; liên kết không tạo kết luận tổng hợp.</p><a href={'#reading-palace-'+(section.id==='work'?'no':'dien')}>Đọc {section.id==='work'?'Nô Bộc':'Điền Trạch'}</a></details>}
            {['no','dien'].includes(section.id) && <p className="notice">Chú giải truyền thống của đúng cung, chưa tổng hợp toàn cung. Không xác nhận hành vi người cụ thể hoặc tài sản thực tế.</p>}
            {section.id === "work" && reading.workFacts && (
              <p data-work-facts>
                {reading.workFacts.map((f) => f.text).join(" ")}
              </p>
            )}
            {section.id === "work" && reading.workNotice && <p data-work-notice>{reading.workNotice}</p>}
            {section.id === "work" && reading.workNotice && !section.paragraphs.length && (
              <p data-work-empty>Chưa có lời luận Công việc phù hợp với cấu trúc này trong phạm vi hiện hỗ trợ. Các dữ kiện trên vẫn được giữ để đối chiếu.</p>
            )}
            {section.id === "finance" && reading.financeNotice && <><p data-finance-facts>{reading.financeFacts?.map(f=>f.text).join(" ")}</p><p>{reading.financeNotice}</p>{!section.paragraphs.length && <p>Chưa có lời luận Tài Bạch phù hợp trong phạm vi hiện hỗ trợ.</p>}</>}
            {section.paragraphs.map(
              ({ claim, display, evidence, nearbyNotes, secondary }) => {
                const Content = secondary ? "details" : "div";
                return (
                  <article
                    className="card"
                    key={claim.id}
                    data-claim={claim.id}
                  >
                    <Content data-editorial-group>
                      {secondary && (
                        <summary>
                          Căn cứ bổ sung cùng chủ đề tổ chức — Lộc Tồn
                        </summary>
                      )}
                      {modern && <h3>{evidence.map(e=>e.title).join("; ")}</h3>}
                      <p className="badge">
                        {evidence[0]?.contentLabel}{modern ? "" : " · dự thảo"}
                      </p>
                      <p data-interpretation>{display.text}</p>
                      {nearbyNotes.map((note, i) => (
                        <p className="notice" data-scope-note key={i}>
                          {note.text}
                        </p>
                      ))}
                      {display.contextLink && (
                        <p>
                          <a href={`#${display.contextLink}`}>
                            {reading.contextLinkText}
                          </a>
                        </p>
                      )}
                      <details data-evidence>
                        <summary>
                          {modern ? "Xem căn cứ" : `Xem căn cứ — ${evidence.map((e) => e.title).join("; ")}`}
                        </summary>
                        {!modern && <p>
                          Nội dung dự thảo · diễn giải theo nguồn, chưa được phê
                          duyệt chuyên môn.
                        </p>}
                        {display.changes.length > 0 && (
                          <details>
                            <summary>Ghi chú biên tập</summary>
                            <p>Nguyên văn nhận định đã khớp: {claim.text}</p>
                            {display.changes.map((c) => (
                              <p key={c}>{c}</p>
                            ))}
                          </details>
                        )}
                        {evidence.map((e, i) => {
                          const layer =
                            frozen?.layers[claim.id]?.[i] ||
                            evidenceLayers(e, nearbyNotes, claim.rules[i].id);
                          return (
                            <div key={i}>
                              <h3>Dữ kiện trên lá số</h3>
                              <EvidenceList items={layer.snapshot} />
                              <h3>
                                Điều kiện và nội dung trong tài liệu nguồn
                              </h3>
                              <EvidenceList items={layer.sourceFacts} />
                              <ul>
                                {layer.sourceConditions.map((c) => (
                                  <li key={c}>{c}</li>
                                ))}
                              </ul>
                              {layer.sources.map((s) => (
                                <p key={s.id}>
                                  {s.title} — {s.location}
                                  {s.url?.startsWith("/internal/editorial/npl-local#") && <> · <a href={s.url}>Mở ảnh trang nguồn</a></>}
                                  <br />
                                  {s.rightsNote}
                                </p>
                              ))}
                              <h3>Phạm vi triển khai và giới hạn biên soạn</h3>
                              <ul>
                                {layer.projectScope.map((c) => (
                                  <li key={c}>{c}</li>
                                ))}
                              </ul>
                              <EvidenceList items={layer.contextNotes} />
                              <ul>
                                {layer.limits.map((l) => (
                                  <li key={l}>{l}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                        <details data-technical>
                          <summary>
                            Chi tiết kỹ thuật — nhận định và trace
                          </summary>
                          <p>
                            Snapshot: {reading.snapshotId} · claim: {claim.id};
                            template {reading.templateVersion}; formatter{" "}
                            {presentationVersion}; catalog {catalogVersion}.
                            Bảng nguồn bên dưới chỉ gồm các bảng được điều kiện
                            của rule sử dụng; danh sách rỗng nghĩa là rule không
                            dùng bảng trạng thái.
                          </p>
                          {claim.rules.map((rule) => (
                            <div key={rule.id}>
                              <p>
                                {rule.id}@{rule.version} · draft · matched
                              </p>
                              <pre>
                                {JSON.stringify(
                                  {
                                    presentation: rule.presentation,
                                    originalClaim: claim.text,
                                    displayBindings: display.bindings,
                                    completeEvidence: evidence,
                                    nearbyNotes,
                                    sourceTables: frozen
                                      ? frozen.tables[rule.id]
                                      : sourceTablesForRule(rule),
                                    conditions: rule.conditions,
                                    facts:
                                      reading.execution.derivedFacts.filter(
                                        (f) =>
                                          rule.requiredFacts.includes(f.id),
                                      ),
                                    trace: reading.execution.traces.find(
                                      (t) => t.ruleId === rule.id,
                                    ),
                                    sources: rule.sourceReferences,
                                  },
                                  null,
                                  2,
                                )}
                              </pre>
                            </div>
                          ))}
                        </details>
                      </details>
                    </Content>
                  </article>
                );
              },
            )}
          </section>
        ))}
      {reading.tatAch && <TatAchReading data={reading.tatAch}/>}
      <Related className="card">
        {modern ? <summary>{reading.overviewPresentation ? "Một số dữ kiện được chọn để đối chiếu" : "Các yếu tố liên quan — chưa tổng hợp"}</summary> : <h2>Những yếu tố cần xét thêm</h2>}
        <p>{reading.contextPolicy}</p>
        {reading.overviewPresentation && <p>{reading.overviewPresentation.factorNotice}</p>}
        <div data-unassessed>
          <EvidenceList items={reading.unassessed} />
        </div>
        {reading.contexts.map((s) => (
          <details
            key={s.ids[0]}
            id={`context-${s.ids[0]}`}
            data-context={s.ids[0]}
          >
            <summary>Ngữ cảnh — {s.titles.join("; ")}</summary>
            <p>
              Dữ kiện được ghi trong lá số; các dòng “Quan hệ vị trí” là phép
              tính hình học riêng, không phải diễn giải tốt/xấu.
            </p>
            <EvidenceList items={s.data.items} />
            <p>
              <strong>Ảnh hưởng chưa được tổng hợp:</strong> {s.data.unresolved}
            </p>
            <details data-technical>
              <summary>Chi tiết kỹ thuật — căn cứ ngữ cảnh</summary>
              <p>
                Snapshot: {reading.snapshotId}; formatter {presentationVersion}.
                Khoảng cách địa chi theo vòng 12 cung: 0 cùng cung, 4/8 tam hợp,
                6 đối cung; chỉ tính khi đủ 12 địa chi khác nhau. Không suy giáp
                cung hay án ngữ.
              </p>
              <pre>{JSON.stringify(s.data.items, null, 2)}</pre>
            </details>
          </details>
        ))}
        {!modern && reading.unsupported.length > 0 && (
          <p data-testid="unsupported">
            Chưa có nội dung được hỗ trợ cho: {reading.unsupported.join("; ")}.
            Phần thiếu này không phải đặc điểm của người đọc.
          </p>
        )}
        {!modern && reading.unknown.map((t) => (
          <div key={t.ruleId}>
            <p>
              {ruleTitles[t.ruleId] || "Một nhận định"}:{" "}
              {t.status === "missing-facts"
                ? missingText(t.details).join(" ")
                : "Chưa đủ căn cứ trong phạm vi đang hỗ trợ."}
            </p>
            <details data-technical>
              <summary>Chi tiết kỹ thuật — điều kiện chưa xác định</summary>
              <pre>{JSON.stringify(t, null, 2)}</pre>
            </details>
          </div>
        ))}
        {reading.sections.some((s) =>
          s.claims.some((c) => c.rules.some((r) => r.id === "tanbien.r02")),
        ) && (
          <p>
            Cách đọc Vũ–Văn Khúc đang theo Tân Biên. Hồ sơ ghi cách nhìn khác ở
            mục Vương Đình Chi trên Cổ Học; chưa hòa giải hai nguồn. Xem căn cứ
            của đoạn học hỏi.
          </p>
        )}
      </Related>
      {modern && <ReadingScope scope={modern.scope} absentTopics={modern.absentTopics} rules={reading.execution.rules} />}
    </section>
  );
}
