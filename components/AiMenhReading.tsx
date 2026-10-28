"use client";
import { useEffect, useState } from "react";
import type { AiView } from "@/lib/ai/contract";
import ReadingDisclosure from "./ReadingDisclosure";
/** Historical Astra artifacts remain readable. New free Mệnh uses V1 on the server. */
export default function AiMenhReading({ readingId }: { readingId: string }) {
  const [view, setView] = useState<AiView | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/trial/readings/" + encodeURIComponent(readingId) + "/ai-menh", {
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((state) => {
        if (live) setView(state);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [readingId]);
  if (view?.state !== "completed" || !view.result) return null;
  const state = view.state,
    result = view.result;
  return (
    <ReadingDisclosure
      className="ai-menh-reading"
      data-ai-state="completed"
      aria-label="Bài AI Mệnh đã lưu"
    >
      <summary>Bài AI Mệnh đã lưu · phiên bản trước</summary>
      {state === "completed" && result && (
        <div className="ai-menh-result">
          <p className="result-eyebrow">
            {result.provider === "test-mock"
              ? "BẢN MÔ PHỎNG KIỂM THỬ · KHÔNG PHẢI API THẬT"
              : "LUẬN GIẢI DO AI TẠO · THAM KHẢO"}
          </p>
          {result.content.sections.map((s) => (
            <article key={s.kind} data-ai-section={s.kind}>
              <h3>{s.title}</h3>
              {s.content.split(/\n\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <ReadingDisclosure>
                <summary>Căn cứ và phần suy luận</summary>
                <p>
                  {s.basis === "ai-synthesis"
                    ? "Phần này có nhận định tổng hợp do AI suy luận, không phải dữ kiện engine."
                    : s.basis === "source-interpretation"
                      ? "Diễn giải dựa trên quan điểm tài liệu được cung cấp."
                      : "Phần này chủ yếu trình bày dữ kiện và mối liên hệ đã ghi nhận."}
                </p>
                {s.factIds.map((id) => {
                  const f = result.facts.find((x) => x.id === id);
                  return f ? (
                    <p key={id}>
                      {f.text
                        .replaceAll("majorStars", "chính tinh")
                        .replaceAll("minorStars", "phụ tinh")
                        .replaceAll("adjectiveStars", "các sao khác")}
                    </p>
                  ) : null;
                })}
                {s.knowledgeIds.map((id) => {
                  const k = result.knowledge.find((x) => x.id === id);
                  return k ? (
                    <div key={id}>
                      <h4>{k.title}</h4>
                      {k.references.map((r, i) => (
                        <p key={i}>
                          {r.title} · {r.location}
                        </p>
                      ))}
                      <p>
                        Điều kiện:{" "}
                        {k.conditions
                          .filter(
                            (t) =>
                              !t.startsWith("Điều kiện máy") &&
                              !t.startsWith("Ngoại lệ máy"),
                          )
                          .join(" ")}
                      </p>
                      <p>Giới hạn: {k.limits.join(" ")}</p>
                    </div>
                  ) : null;
                })}
              </ReadingDisclosure>
            </article>
          ))}
          <ReadingDisclosure>
            <summary>Giới hạn và phiên bản bài AI</summary>
            {result.content.limitations.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              Model: {result.model} · Prompt: {result.promptVersion} · Bản luận:{" "}
              {result.edition}
            </p>
            <p>
              AI phân tích từ dữ kiện đã lưu và tri thức được cung cấp. Bài
              không xác nhận tính cách hoặc hoàn cảnh thực tế.
            </p>
          </ReadingDisclosure>
        </div>
      )}
    </ReadingDisclosure>
  );
}
