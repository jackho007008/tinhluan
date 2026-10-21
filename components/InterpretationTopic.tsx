import type { InterpretationReport } from "@/lib/reports/interpretation";
export default function InterpretationTopic({
  topic,
}: {
  topic: InterpretationReport["topics"][number];
}) {
  return (
    <article className="card report-group" data-testid={`topic-${topic.id}`}>
      <h2>{topic.title}</h2>
      <h3>Tóm tắt</h3>
      <p>{topic.summary}</p>
      <h3>Dữ kiện từ lá số</h3>
      {topic.facts.length ? (
        topic.facts.map((f) => <p key={f.id}>{f.text}</p>)
      ) : (
        <p>Chưa đủ dữ kiện để trình bày.</p>
      )}
      <h3>Giải thích thuật ngữ</h3>
      <p>{topic.glossary}</p>
      <h3>Nhận định được phép</h3>
      {topic.claims.length ? (
        topic.claims.map((c) => (
          <div key={c.id}>
            <p>{c.text}</p>
            {c.unresolvedWith.length > 0 && (
              <p>
                Có nhận định khác chiều chưa được giải quyết; cần đọc cùng các
                căn cứ bên dưới.
              </p>
            )}
          </div>
        ))
      ) : (
        <p>
          Chưa có nhận định chuyên môn được duyệt. Không dùng AI bổ sung nội
          dung thiếu.
        </p>
      )}
      <h3>Điều kiện và giới hạn</h3>
      {topic.limits.map((l) => (
        <p key={l}>{l}</p>
      ))}
      <details style={{ overflowWrap: "anywhere" }}>
        <summary>Xem căn cứ</summary>
        {topic.facts.map((f) => {
          const rule = topic.ruleReferences.find(
            (r) => r.id === f.derivationId,
          );
          return (
            <div className="evidence" key={f.id}>
              <b>
                {f.derivationId} · v{f.version}
              </b>
              <p>{f.text}</p>
              <p>{f.evidencePaths.join(" · ")}</p>
              <p>
                Vì sao có dữ kiện: tìm duy nhất cung theo tên hoặc cờ Thân và
                chép trường tương ứng trong snapshot. {f.limitation}
              </p>
              {rule?.sourceReferences.map((s) => (
                <p key={s.id}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.title}
                  </a>{" "}
                  · {s.location}
                </p>
              ))}
              <p>
                Đặc tả quy tắc: {rule?.status || "chưa có"}. Đây là dữ kiện kỹ
                thuật, không phải nhận định chuyên môn được duyệt.
              </p>
            </div>
          );
        })}
        {topic.claims.map((c) => (
          <div className="evidence" key={c.id}>
            <b>{c.rules.map((r) => `${r.id} · v${r.version}`).join(", ")}</b>
            <p>{c.evidencePaths.join(" · ")}</p>
            <p>Điều kiện khớp: {c.reasons.join(" · ")}</p>
            <p>
              Ngoại lệ:{" "}
              {c.rules
                .flatMap((r) => r.exceptions)
                .map((e) => JSON.stringify(e))
                .join(" · ") ||
                "Không có ngoại lệ trong phiên bản quy tắc này."}
            </p>
            {c.rules
              .flatMap((r) => r.sourceReferences)
              .map((s, i) => (
                <p key={`${s.id}-${i}`}>
                  <a href={s.url}>{s.title}</a> · {s.location}
                </p>
              ))}
            {c.rules
              .flatMap((r) => r.limitations)
              .map((limit, i) => (
                <p key={i}>Giới hạn: {limit}</p>
              ))}
            {c.rules.map((r) => (
              <p key={r.id}>
                Hồ sơ duyệt: {r.review?.reviewer} · {r.review?.reviewedOn} ·{" "}
                {r.review?.scope}
              </p>
            ))}
            {c.unresolvedWith.length > 0 && (
              <p>Nhận định khác chiều: {c.unresolvedWith.join(", ")}</p>
            )}
          </div>
        ))}
        {!topic.claims.length && (
          <p>Chưa có nhận định kèm hồ sơ duyệt chuyên môn cho chủ đề này.</p>
        )}
        {topic.traces.map((t, i) => (
          <p key={`${t.ruleId}-${i}`}>
            {t.ruleId} · v{t.version}: {t.status} {t.details.join(" · ")}
          </p>
        ))}
      </details>
    </article>
  );
}
