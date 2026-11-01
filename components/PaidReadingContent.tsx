import ReadingDisclosure from "./ReadingDisclosure";
import { readPaidContent } from "@/lib/ai/paid-result";
import type { PaidResult } from "@/lib/ai/paid-reading-v2";
function Basis({
  result,
  part,
}: {
  result: PaidResult;
  part: { factIds: string[]; knowledgeIds: string[]; basis: string };
}) {
  return (
    <ReadingDisclosure>
      <summary>Xem căn cứ</summary>
      {part.factIds.map((id) => (
        <p key={id}>{result.facts.find((f) => f.id === id)?.text}</p>
      ))}
      {part.knowledgeIds.map((id) => {
        const k = result.knowledge.find((k) => k.id === id);
        return k ? (
          <div key={id}>
            <p>{k.text}</p>
            {k.references.map((r, i) => (
              <p key={i}>
                {r.title} · {r.location}
              </p>
            ))}
            {k.conditions.map((t, i) => (
              <p key={"c" + i}>{t}</p>
            ))}
            {k.limits.map((t, i) => (
              <p key={"l" + i}>{t}</p>
            ))}
          </div>
        ) : null;
      })}
      <p>
        {part.basis === "ai-synthesis"
          ? "Có phần tổng hợp do AI suy luận; không phải dữ kiện đã được chứng minh về đời sống."
          : "Đọc cùng điều kiện và giới hạn của nguồn."}
      </p>
    </ReadingDisclosure>
  );
}
export default function PaidReadingContent({ result }: { result: PaidResult }) {
  const reading = readPaidContent(result);
  if (!reading)
    return (
      <p role="status">
        Chưa đọc được phiên bản nội dung này. Bài đã lưu và quyền đã mua vẫn
        được giữ; vui lòng liên hệ hỗ trợ.
      </p>
    );
  return (
    <>
      <p>
        {result.provider === "test-mock"
          ? "BẢN MÔ PHỎNG KIỂM THỬ · KHÔNG PHẢI LUẬN GIẢI API THẬT"
          : "Nội dung AI diễn giải · tham khảo"}
      </p>
      {reading.version === 1 ? (
        reading.content.sections.map((s) => (
          <article key={s.kind}>
            <h3>{s.title}</h3>
            {s.content.split(/\n\n+/).map((t, i) => (
              <p key={i}>{t}</p>
            ))}
            <Basis result={result} part={s} />
          </article>
        ))
      ) : (
        <>
          <p className="result-eyebrow">
            {reading.content.coverage === "focused"
              ? "Bài phân tích"
              : reading.content.coverage === "limited"
                ? "Phân tích có giới hạn"
                : "Chưa đủ căn cứ cho bài phân tích"}
          </p>
          <p role="status">{reading.content.coverageNote}</p>
          {reading.content.sections.map((s) => (
            <article
              key={s.id}
              data-reading-section={s.id}
              data-reading-role={s.role}
            >
              <h3>{s.title}</h3>
              {s.paragraphs.map((p, i) => (
                <div key={i}>
                  <p>{p.text}</p>
                  <Basis result={result} part={p} />
                </div>
              ))}
            </article>
          ))}
        </>
      )}
      {reading.content.limitations.map((t, i) => (
        <p className="result-muted" key={i}>
          {t}
        </p>
      ))}
    </>
  );
}
