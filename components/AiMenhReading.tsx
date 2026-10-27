"use client";
import { useEffect, useState } from "react";
import type { AiView } from "@/lib/ai/contract";
import ReadingDisclosure from "./ReadingDisclosure";
const labels = {
  "not-created": "Chưa tạo",
  generating: "Đang tạo",
  completed: "Hoàn thành",
  error: "Lỗi",
};
export default function AiMenhReading({ readingId }: { readingId: string }) {
  const [view, setView] = useState<AiView | null>(null),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [revision, setRevision] = useState(0);
  const url =
    "/api/trial/readings/" + encodeURIComponent(readingId) + "/ai-menh";
  useEffect(() => {
    let live = true,
      timer: ReturnType<typeof setTimeout> | undefined;
    const read = async () => {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw Error();
        const state = (await response.json()) as AiView;
        if (!live) return;
        setView(state);
        setMessage("");
        if (
          state.queued ||
          state.state === "generating" ||
          state.state === "error"
        )
          timer = setTimeout(read, state.state === "error" ? 10000 : 2500);
      } catch {
        if (live)
          setMessage(
            "Chưa đọc được trạng thái AI. Bạn có thể tải lại trang; nội dung đã lưu vẫn được giữ.",
          );
      }
    };
    read();
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [url, revision]);
  async function request() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retry: view?.state === "error" }),
      });
      if (!response.ok) {
        const data = await response.json();
        setMessage(data.error || "Chưa gửi được yêu cầu.");
        return;
      }
      const state = (await response.json()) as AiView;
      setView(state);
      if (state.queued || state.state === "generating")
        setRevision((r) => r + 1);
    } catch {
      setMessage(
        "Chưa gửi được yêu cầu; hãy tải lại trạng thái trước khi thử tiếp.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (view && (!view.enabled || !view.eligible) && view.state !== "completed")
    return (
      <div className="ai-reading-status">
        <span>Luận AI · Chưa tạo</span>
        <p>
          Bản lưu này chưa được bật AI Mệnh. Nội dung và quyền cũ được giữ
          nguyên.
        </p>
      </div>
    );
  const state = view?.state || "not-created",
    result = view?.result;
  return (
    <section
      className="ai-menh-reading"
      data-ai-state={state}
      aria-label="Luận AI cung Mệnh"
    >
      <div className="ai-reading-status" role="status">
        <span>Luận AI · {labels[state]}</span>
        {!view && !message ? (
          <p>Đang đọc trạng thái đã lưu…</p>
        ) : view?.queued ? (
          <p>Yêu cầu đã được lưu, đang chờ tạo bài.</p>
        ) : state === "generating" ? (
          <p>
            Đang phân tích cung Mệnh. Bạn có thể mở lại báo cáo để xem kết quả
            đã lưu.
          </p>
        ) : state === "not-created" ? (
          <p>Chưa có bài AI Mệnh trong phiên bản này.</p>
        ) : state === "error" ? (
          <p>
            {view?.errorCode === "AI_NOT_CONFIGURED"
              ? "Chưa cấu hình API/model cho tính năng AI. Chưa có bài AI thật được tạo."
              : view?.errorCode === "AI_OUTCOME_UNCERTAIN" ||
                  view?.errorCode === "AI_INTERRUPTED"
                ? "Lần xử lý trước chưa xác định được kết quả. Hệ thống giữ trạng thái để kiểm tra, không tự gọi lại gây tính phí trùng."
                : "Chưa tạo được bài AI Mệnh. Báo cáo và nội dung đã lưu vẫn được giữ nguyên."}
          </p>
        ) : null}
        {message && <p role="alert">{message}</p>}
        {view?.canRetry && !view.queued && (
          <button
            type="button"
            className="button quiet"
            onClick={request}
            disabled={busy}
          >
            {busy
              ? "Đang gửi yêu cầu…"
              : state === "error"
                ? "Thử lại an toàn"
                : "Yêu cầu tạo luận Mệnh"}
          </button>
        )}
      </div>
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
    </section>
  );
}
