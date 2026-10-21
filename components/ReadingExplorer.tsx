"use client";
import {TatAchReading} from "./TatAchReading";
import PalaceReviewEvidence from "./PalaceReviewEvidence";
import ReadingScope from "./ReadingScope";
import LifeOverview from "./LifeOverview";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ChartSnapshot } from "@/lib/tuvi-engine";
import type { Exploration } from "@/lib/exploration/model";

type Paragraph = Exploration["paragraphs"][number];
function ClaimCard({
  p,
  snapshotId,
  internal,
}: {
  p: Paragraph;
  snapshotId: string;
  internal: boolean;
}) {
  return (
    <article className="card" data-exploration-claim={p.id}>
      {p.title && <h5>{p.title}</h5>}
      <p className="caption">
        {p.claim.rules.every(
          (r) => r.presentation?.contentType !== "combination",
        )
          ? "Chú giải nền theo tài liệu — chưa kết luận về người đọc"
          : "Nhận định theo điều kiện cục bộ — chưa tổng hợp toàn cung"}
      </p>
      <p>{p.text}</p>
      {(p.localAdjustment ? ["Nét nóng nảy đã được xét cùng Thiên Tướng trong đoạn liền sau. Các nét khác, hội chiếu và Tuần/Triệt chưa được phối hợp thành kết luận chung."] : [
        ...new Set(
          p.claim.rules.flatMap((r) =>
            r.presentation?.readerLimit
              ? [r.presentation.readerLimit]
              : r.limitations,
          ),
        ),
      ]).map((n) => (
        <p className="notice" key={n}>
          {n}
        </p>
      ))}
      {!!p.claim.unresolvedWith.length && (
        <p>Đang có nhận định khác chiều; chưa tổng hợp thành kết luận chung.</p>
      )}
      <details>
        <summary>Xem căn cứ</summary>
        {[
          ...new Set([
            ...p.notes,
            ...p.claim.rules.flatMap((r) => r.limitations),
          ]),
        ].map((n) => (
          <p key={n}>{n}</p>
        ))}
        {p.evidence
          .flatMap((e) => e.facts)
          .map((f, i) => (
            <p key={i}>{f.text}</p>
          ))}
        {p.claim.rules.map((r) => (
          <div key={r.id}>
            <p>{r.presentation?.title?.replace(/^R\d+\s*[·:—-]\s*/, "") || "Điều kiện nhận định"}</p>
            <ul>
              {(r.presentation?.sourceConditions || []).map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {r.sourceReferences.map((s) => (
              <p key={s.id}>
                <a href={s.url}>{s.title}</a> — {s.location}
              </p>
            ))}
          </div>
        ))}
        {internal && (
          <details>
            <summary>Chi tiết kỹ thuật</summary>
            <p>Snapshot: {snapshotId}</p>
            <pre>
              {JSON.stringify(
                {
                  rules: p.claim.rules.map((r) => ({
                    id: r.id,
                    version: r.version,
                    conditions: r.conditions,
                  })),
                  paths: p.claim.evidencePaths,
                  reasons: p.claim.reasons,
                },
                null,
                2,
              )}
            </pre>
          </details>
        )}
      </details>
    </article>
  );
}
function CareerChecks({ model }: { model: Exploration }) {
  const audit = model.careerAssessment;
  if (!model.internal || !audit) return null; // Historical reads do not acquire a new assessment.
  const labels = {
    checked: "Đã xét",
    "not-applicable": "Không áp dụng",
    unresolved: "Chưa xác định",
  };
  const causes = {
    "missing-data": "Thiếu dữ liệu hồ sơ",
    "undefined-relation": "Chưa đặc tả quan hệ",
    "missing-interpretation": "Chưa có quy tắc diễn giải phối hợp",
    "source-conflict": "Nguồn có mâu thuẫn",
  };
  return (
    <section className="career-checks" aria-label="Điều kiện Công việc đã xét">
      {audit.readerFacts?.slice(0, 2).map((text, i) => <p key={i}>{text}</p>)}
      {!!audit.readerFacts?.slice(2).length && (
        <details><summary>Các yếu tố liên quan</summary>
          {audit.readerFacts.slice(2).map((text, i) => <p key={i}>{text}</p>)}
        </details>
      )}
      <details>
        <summary>Xem căn cứ điều kiện Công việc</summary>
        <p>{audit.summary}</p>
        {audit.rows.map((row) => (
          <article className="card" key={row.id} data-career-condition={row.id}>
            <h5>
              {row.title} · {labels[row.state]}
            </h5>
            {row.cause && <p className="caption">{causes[row.cause]}</p>}
            <p>{row.text}</p>
            <details>
              <summary>Xem căn cứ điều kiện</summary>
              <p>{row.source}</p>
              <p>
                Chỉ dữ kiện bản mệnh. Kết quả kiểm tra được lưu cùng phiên bản
                bài đọc.
              </p>
              <details>
                <summary>Chi tiết kỹ thuật</summary>
                <pre>
                  {JSON.stringify(
                    {
                      paths: row.paths,
                      claimIds: row.claimIds,
                      version: audit.version,
                    },
                    null,
                    2,
                  )}
                </pre>
              </details>
            </details>
          </article>
        ))}
        {audit.observations?.map((o, i) => (
          <p key={i}>
            {o.name} tại {o.palace} {o.branch}: {o.light}. {o.nature} Nguồn
            trạng thái: {o.source || "Chưa có ô trạng thái được xác định"}; định
            nghĩa: Vân Đằng Thái Thứ Lang, Tử Vi Đẩu Số Tân Biên, trang in/PDF
            33 §2.4–2.11.
          </p>
        ))}
      </details>
      {!!audit.research?.length && (
        <details data-career-research>
          <summary>Đối chiếu phương pháp — nội bộ, chưa áp dụng</summary>
          {audit.research.map((r) => (
            <article key={r.id}>
              <h5>{r.id}</h5>
              <p>{r.text}</p>
              <p>
                Đầu vào:{" "}
                {r.included.join("; ") ||
                  "Chưa ghi nhận sao trong phạm vi này; xem tình trạng đầy đủ của danh sách."}
              </p>
              <p>
                Thêm so với phạm vi trước:{" "}
                {r.added.join("; ") || "Không thêm sao đã ghi nhận."}
              </p>
            </article>
          ))}
          <p>
            D1: phạm vi; D2: bộ chọn sáng/mờ; D3: nhiều sát tinh; D4: hai nhóm
            chính tinh; D5: án ngữ; D6: phụ tá/Tứ Hóa. Không phương án nào được
            chọn mặc định. Các nhánh ứng viên chỉ có trong hồ sơ nghiên cứu,
            không ghi vào claim.
          </p>
        </details>
      )}
    </section>
  );
}
function FinanceChecks({model}: {model: Exploration}) {
  const audit=model.financeAssessment;
  if(!model.internal || !audit) return null;
  return <section aria-label="Điều kiện Tài chính đã xét">
    <p>{audit.mainNote}</p>
    <details><summary>Xem căn cứ và các yếu tố liên quan</summary>
      {audit.rows.map((r,i)=><article key={i}><h5>{r.title} · {{checked:"Đã xét", "not-applicable":"Không áp dụng", unresolved:"Chưa xác định"}[r.state]}</h5><p>{r.text}</p><p className="caption">{r.source}</p><details><summary>Chi tiết kỹ thuật</summary><pre>{JSON.stringify({paths:r.paths,claimIds:audit.claimIds,version:audit.version},null,2)}</pre></details></article>)}
      <details><summary>Dữ kiện các cung cần đối chiếu — chưa phải luận tổng hợp</summary>{audit.related.map((r,i)=><p key={i}>{r.text}</p>)}</details>
    </details>
  </section>;
}
export default function ReadingExplorer({
  snapshot,
  readingId,
  initial,
  selection,
}: {
  snapshot: ChartSnapshot;
  readingId?: string;
  initial?: Exploration;
  selection?: { index: number; nonce: number } | null;
}) {
  const embedded = (snapshot as ChartSnapshot & { exploration?: Exploration })
    .exploration;
  const seed =
    initial?.snapshotId === snapshot.resultId
      ? initial
      : embedded?.snapshotId === snapshot.resultId
        ? embedded
        : undefined;
  const [model, setModel] = useState(seed),
    [error, setError] = useState(""),
    [tab, setTab] = useState("overview"),
    [palace, setPalace] = useState(
      Math.max(
        0,
        snapshot.chart.palaces.findIndex((p) => p.name === "Mệnh"),
      ),
    ),
    [decade, setDecade] = useState<number | null>(null);
  const detail = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const abort = new AbortController();
    setModel(seed);
    setError("");
    setPalace(
      Math.max(
        0,
        snapshot.chart.palaces.findIndex((p) => p.name === "Mệnh"),
      ),
    );
    setDecade(null);
    if (!seed && readingId)
      fetch("/api/exploration?id=" + encodeURIComponent(readingId), {
        signal: abort.signal,
      })
        .then(async (r) => {
          const data = await r.json();
          if (!r.ok) throw Error(data.error);
          if (data.snapshotId !== snapshot.resultId)
            throw Error("Bản đọc không khớp lá số.");
          return data;
        })
        .then((data) => {
          if (!abort.signal.aborted) setModel(data);
        })
        .catch((e) => {
          if (!abort.signal.aborted) setError(e.message);
        });
    else if (!seed)
      setError(
        "Bản này chưa có dữ liệu bài đọc được kiểm tra. Hãy lập kết quả mới; không dùng nội dung mẫu.",
      );
    return () => abort.abort();
  }, [snapshot.resultId, readingId, seed]);
  useEffect(() => {
    if (selection) {
      setTab("palaces");
      setPalace(selection.index);
      requestAnimationFrame(() => {
        detail.current?.focus();
        detail.current?.scrollIntoView({ block: "start" });
      });
    }
  }, [selection]);
  function focusDetail(scroll = false) {
    requestAnimationFrame(() => {
      detail.current?.focus({ preventScroll: !scroll });
      if (scroll) detail.current?.scrollIntoView({ block: "start" });
    });
  }
  if (error)
    return (
      <section className="card" role="alert">
        {error}
      </section>
    );
  if (!model) return <p role="status">Đang mở bài đọc của hồ sơ…</p>;
  const p = model.palaces[palace],
    d = model.decades.find((x) => x.index === decade);
  const topics = [...new Set(model.topics)];
  return (
    <section className="explorer" data-explorer-snapshot={model.snapshotId}>
      <h2>Khám phá lá số · {model.name}</h2>
      {readingId && (
        <p>
          <a href={"/api/exploration?id=" + readingId + "&format=text"}>
            Tải toàn văn và nguồn
          </a>
          {" · "}
          <a href={"/api/exploration?id=" + readingId + "&format=sources"}>
            Ánh xạ dữ kiện / nguồn (JSON)
          </a>
        </p>
      )}
      <p>
        {model.internal
          ? "Preview nội bộ — nhận định dự thảo, chưa được duyệt chuyên môn."
          : "Chỉ hiển thị diễn giải đã qua cổng duyệt."}{" "}
        Nội dung trong phạm vi đã hỗ trợ.
      </p>
      <nav aria-label="Phần đọc lá số" className="explorer-nav">
        {[
          ["overview", "Tổng quan"],
          ["palaces", "12 cung"],
          ["decades", "Đại vận"],
          ["year", "Năm xem"],
        ].map(([id, label]) => (
          <button
            key={id}
            aria-pressed={tab === id}
            onClick={() => {
              setTab(id);
              focusDetail();
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      {tab === "palaces" && (
        <div className="palace-picker" aria-label="Chọn cung">
          {[...model.palaces]
            .sort(
              (a, b) =>
                ((a.index -
                  model.palaces.findIndex((p) => p.name === "Mệnh") +
                  12) %
                  12) -
                ((b.index -
                  model.palaces.findIndex((p) => p.name === "Mệnh") +
                  12) %
                  12),
            )
            .map((x) => (
              <button
                key={x.index}
                style={
                  x.position
                    ? ({
                        "--palace-col": x.position[0] + 1,
                        "--palace-row": x.position[1] + 1,
                      } as CSSProperties)
                    : undefined
                }
                aria-pressed={palace === x.index}
                onClick={() => {
                  setPalace(x.index);
                  focusDetail(true);
                }}
              >
                <strong>{x.name}</strong>
                <span>
                  {x.claims.length ? "Có luận giải" : "Chỉ có dữ kiện"}
                </span>
                <span>
                  {x.stem} {x.branch}
                </span>
              </button>
            ))}
        </div>
      )}
      {tab === "decades" && (
        <>
          <p>
            Tuổi mụ, khoảng tuổi bao gồm cả hai đầu; khoảng năm là năm âm lịch.
            Giai đoạn đang chọn độc lập với năm xem.
          </p>
          <div className="decade-picker">
            {model.decades.map((x) => (
              <button
                key={x.index}
                aria-pressed={decade === x.index}
                onClick={() => {
                  setDecade(x.index);
                  focusDetail(true);
                }}
              >
                <strong>
                  {x.range.join("–")} tuổi · {x.palace}
                </strong>
                <span>
                  {x.years?.join("–") || "Chưa đủ dữ liệu năm"}
                  {x.current ? " · Năm xem nằm ở đây" : ""}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
      <div
        tabIndex={-1}
        ref={detail}
        className="explorer-detail"
        aria-live="polite"
      >
        {(tab === "overview" || topics.includes(tab)) && (
          <>
            <h3>
              {tab === "overview" ? model.readerPresentation?.title || "Tổng quan trong phạm vi hiện có" : tab}
            </h3>
            {!model.paragraphs.some(
              (p) => tab === "overview" || p.topic === tab,
            ) && (
              <p>
                Chưa có luận giải {model.internal ? "khớp" : "được duyệt"} cho
                trường hợp này. Có thể khám phá dữ kiện ở 12 cung và Đại vận.
              </p>
            )}
            {model.introduction && <p className="notice">{model.introduction}</p>}
            {model.lifeMajorNotice && <p>{model.lifeMajorNotice}.</p>}
            {model.readerPresentation && <ReadingScope scope={model.readerPresentation.scope} absentTopics={model.readerPresentation.absentTopics} rules={model.scopeRules} />}
            {model.lifeOverview && <LifeOverview value={model.lifeOverview} />}
{model.internal && model.palaceReview && <PalaceReviewEvidence value={model.palaceReview} />}
            <nav aria-label="Chủ đề trong Tổng quan" className="explorer-nav">
              {topics.map((t, i) => (
                <a key={t} href={"#reading-topic-" + i}>
                  {t}
                </a>
              ))}
            </nav>
            {topics.map((t, i) => {
              const ps = model.paragraphs.filter((p) => p.topic === t);
              const binding = model.overviewPresentation?.topics.find(x=>x.title===t);
              const subject = binding ? (binding.subjects.length===1?binding.subjects[0]:null) :
                ps[0]?.subject ||
                (t === "Công việc"
                  ? "Quan Lộc"
                  : t === "Tài chính"
                    ? "Tài Bạch"
                    : "Mệnh");
              const fact = model.palaces.find((p) => p.name === subject);
              const modifiers = fact?.entries.filter((e) =>
                /Hỏa Tinh|Linh Tinh|Kình Dương|Đà La|Địa Không|Địa Kiếp|Tuần|Triệt/.test(
                  e.label,
                ),
              );
              return (
                <section key={t} id={"reading-topic-" + i}>
                  <h4>{t}</h4>
                  {binding ? <div className="caption" data-topic-facts={binding.id}>{binding.kind==='multi-palace' && <p>Các cung liên quan: {binding.subjects.join(" – ")}. Dữ kiện được tách theo từng cung.</p>}{binding.facts.map((f,j)=><p key={j}>{f.text}</p>)}{binding.unknownSubject&&<p>Chưa xác định được cung của chủ đề này; không lấy dữ kiện cung khác thay thế.</p>}</div> : <p className="caption">
                    Dữ kiện: {fact?.name} tại {fact?.branch}.{" "}
                    {fact?.majorNotice ||
                      (fact?.major
                        ? "Chính tinh: " + fact.major.join(", ")
                        : "Chưa đủ dữ liệu chính tinh.")}
                  </p>}
                  {!!modifiers?.length && (model.readerPresentation ? <details><summary>{binding?"Một số dữ kiện liên quan":"Các yếu tố liên quan — chưa tổng hợp"}</summary>{binding&&<p>{model.overviewPresentation?.factorNotice}</p>}<p>Dữ kiện đi cùng: {modifiers.map(e=>e.label).join(", ")}.</p></details> : <p>Dữ kiện đi cùng: {modifiers.map(e=>e.label).join(", ")}.</p>)}
                  {binding && binding.subjects.map(name=><button key={name} onClick={()=>{setPalace(model.palaces.findIndex(p=>p.name===name));setTab('palaces');focusDetail(true);}}>Xem đầy đủ dữ kiện {name}</button>)}
                  {['Mệnh','Tài Bạch'].includes(subject||'') && model.paragraphs.some(q=>['Phúc Đức','Thiên Di'].includes(q.subject||'')) && <details><summary>Xem căn cứ — phần đọc các cung liên quan</summary><p>Mỗi phần có điều kiện riêng; chưa hợp nhất lời luận liên cung.</p>{['Phúc Đức','Thiên Di'].filter(n=>model.paragraphs.some(q=>q.subject===n)).map(n=><button key={n} onClick={()=>{setPalace(model.palaces.findIndex(q=>q.name===n));setTab('palaces');focusDetail(true);}}>Đọc {n}</button>)}</details>}
                  {['Quan Lộc','Tài Bạch'].includes(subject||'') && model.paragraphs.some(q=>q.subject===(subject==='Quan Lộc'?'Nô Bộc':'Điền Trạch')) && <details><summary>Xem căn cứ — phần đọc liên quan</summary><p>Liên kết tới lời đọc riêng, không hợp nhất thành kết luận về nghề nghiệp hoặc tài sản.</p><button onClick={()=>{setPalace(model.palaces.findIndex(q=>q.name===(subject==='Quan Lộc'?'Nô Bộc':'Điền Trạch')));setTab('palaces');focusDetail(true);}}>Đọc {subject==='Quan Lộc'?'Nô Bộc':'Điền Trạch'}</button></details>}
                  {ps.length ? (
                    ps.map((p) => (
                      <ClaimCard
                        key={p.id}
                        p={p}
                        snapshotId={model.snapshotId}
                        internal={model.internal}
                      />
                    ))
                  ) : (
                    <p>Chưa có luận giải cho trường hợp này.</p>
                  )}
                  {t === "Công việc" && <CareerChecks model={model} />}
                  {t === "Tài chính" && <FinanceChecks model={model} />}
                </section>
              );
            })}
          </>
        )}
        {tab === "palaces" &&
          (p ? (
            <>
              <h3>
                {p.name} · {p.stem} {p.branch}
              </h3>
              {p.name === "Tật Ách" && model.tatAch ? <TatAchReading data={model.tatAch} internal={model.internal}/> : <>
              <p className="caption">Dữ kiện tính toán đã lưu</p>
              <p>
                {p.majorNotice ||
                  (p.major?.length
                    ? "Chính tinh: " + p.major.join(", ")
                    : "Chưa đủ dữ liệu chính tinh.")}
              </p>
              <dl>
                {p.facts.map((f, i) => (
                  <div key={i}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
              {['Nô Bộc','Điền Trạch','Phụ Mẫu','Huynh Đệ','Phu Thê','Tử Nữ'].includes(p.name) && model.readerPresentation && <ReadingScope scope={model.readerPresentation.scope.filter(g=>g.topic===p.name)} absentTopics={[]} rules={model.scopeRules} />}
              {!!p.relatedClaims.length && <details><summary>Xem căn cứ — nhận định liên cung Mệnh–Bào–Nô đã có</summary><p>Đây là cùng nhận định đã lưu tại Nô Bộc, không phải lời riêng hoặc claim mới của Huynh Đệ.</p>{p.relatedClaims.map(id=>{const related=model.paragraphs.find(q=>q.id===id)!;return <ClaimCard key={id} p={related} snapshotId={model.snapshotId} internal={model.internal}/>;})}</details>}
              {p.claims.length ? (
                p.claims
                  .map((id) => model.paragraphs.find((c) => c.id === id))
                  .filter((c): c is Paragraph => !!c)
                  .map((c) => (
                    <ClaimCard
                      key={c.id}
                      p={c}
                      snapshotId={model.snapshotId}
                      internal={model.internal}
                    />
                  ))
              ) : (
                <p>Chưa có luận giải cho trường hợp này.</p>
              )}
              </>}
            </>
          ) : (
            <p>Thiếu dữ liệu cung.</p>
          ))}
        {tab === "palaces" && p?.name === "Quan Lộc" && (
          <CareerChecks model={model} />
        )}
        {tab === "palaces" && p?.name === "Tài Bạch" && <FinanceChecks model={model} />}
        {tab === "decades" &&
          (d ? (
            <>
              <h3>
                Đang chọn: {d.range.join("–")} tuổi — {d.palace}
              </h3>
              <p>
                {d.years?.join("–")} · {d.layer.stem} {d.branch} · chiều{" "}
                {d.layer.direction || "chưa xác định"}
                {d.current ? " · thuộc năm xem hiện tại" : ""}
              </p>
              <p>
                Dữ kiện đại vận; chưa có rule luận giải đại vận. Không sử dụng
                nhận định bản mệnh làm dự báo.
              </p>
              <ul>
                {d.layer.stars.map((s) => (
                  <li key={s.id}>
                    ĐV. {s.name} — {s.branch}
                    {s.target ? " (hóa " + s.target.name + ")" : ""}
                  </li>
                ))}
              </ul>
              {d.layer.issues.map((i) => (
                <p key={i} role="status">
                  {i}
                </p>
              ))}
              <details>
                <summary>Nguồn và phương pháp đại vận</summary>
                <p>{d.layer.source}</p>
                <p>
                  Khoảng tuổi lấy từ snapshot. Bộ sao là dữ kiện dẫn xuất riêng
                  bằng quy ước {d.layer.version}; không thay đổi bản mệnh hay
                  bản đọc đã lưu.
                </p>
              </details>
            </>
          ) : (
            <p>
              Chọn một giai đoạn để đọc dữ kiện.
              {!model.decades.length ? " Chưa đủ dữ liệu đại vận." : ""}
            </p>
          ))}
        {tab === "year" && (
          <>
            <h3>Năm xem {model.annual?.year || "chưa chọn"}</h3>
            <p>
              Lưu niên là bộ sao theo năm; tiểu hạn là vị trí cung theo tuổi.
              Chưa có rule diễn giải năm hoặc nhật vận.
            </p>
            {model.annual && (
              <>
                <p>
                  {model.annual.canChi} · Tuổi mụ: {model.annual.age} · Tiểu hạn
                  tại {model.annual.annual}
                </p>
                <ul>
                  {model.annual.stars.map((s, i) => (
                    <li key={i}>
                      L. {s.name.replace(/^Lưu\s+/, "")} — {s.branch}
                    </li>
                  ))}
                </ul>
                <details>
                  <summary>Căn cứ dữ kiện năm</summary>
                  <p>
                    Tân Biên tr.268–269: bộ sao lưu năm. Tiểu hạn và lưu đại hạn
                    theo năm được giữ riêng; không đồng nhất với khoảng đại vận
                    10 năm.
                  </p>
                  <pre>{JSON.stringify(model.annual, null, 2)}</pre>
                </details>
              </>
            )}
          </>
        )}
      </div>
      <details>
        <summary>Nguồn, phiên bản và phạm vi</summary>
        <p>
          Snapshot {model.snapshotId} · bài đọc {model.readingVersion} · trình
          khám phá {model.version}
        </p>
        {model.gaps.map((g) => (
          <p key={g}>{g}</p>
        ))}
        <p>
          Gợi ý tự đối chiếu: xem các dữ kiện và giới hạn cạnh từng nhận định
          trước khi liên hệ với trải nghiệm cá nhân.
        </p>
      </details>
      {model.internal && (
        <details>
          <summary>Độ phủ nội bộ — không phải điểm vận mệnh</summary>
          <ul>
            {model.coverage.map((c) => (
              <li key={c.palace}>
                {c.palace}:{" "}
                {c.status === "claims"
                  ? c.ruleIds.join(", ")
                  : c.status === "missing-data"
                    ? "Thiếu dữ liệu"
                    : "Chỉ dữ kiện; chưa có nhận định khớp"}
              </li>
            ))}
          </ul>
          <p>Đại vận, lưu năm, nhật vận: chưa có rule diễn giải.</p>
        </details>
      )}
    </section>
  );
}
