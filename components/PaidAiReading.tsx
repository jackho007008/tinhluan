"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { PaidView } from "@/lib/ai/paid-store";
import { paidLabel } from "@/lib/ai/paid-contract";
import ReadingDisclosure from "./ReadingDisclosure";
const Context = createContext<{
  view: PaidView | null;
  retry: (palace: string) => void;
}>({ view: null, retry: () => {} });
export function PaidAiProvider({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const [view, setView] = useState<PaidView | null>(null),
    [error, setError] = useState(""),
    [clock, setClock] = useState(Date.now());
  useEffect(() => {
    let live = true;
    const tick = async () => {
      try {
        const r = await fetch(
          "/api/trial/readings/" + encodeURIComponent(id) + "/ai-paid",
          { cache: "no-store" },
        );
        if (!r.ok) throw Error();
        const v = await r.json();
        if (live) {
          setView(v);
          setError("");
        }
      } catch {
        if (live)
          setError(
            "Chưa cập nhật được kết nối. Tác vụ và quyền đã mua vẫn được giữ; hãy tải lại trạng thái khi có mạng.",
          );
      }
    };
    void tick();
    const timer = setInterval(() => {
      setClock(Date.now());
      void tick();
    }, 4000);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [id]);
  const retry = async (palace: string) => {
    try {
      const r = await fetch(
        "/api/trial/readings/" + encodeURIComponent(id) + "/ai-paid",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ palace }),
        },
      );
      if (!r.ok) throw Error();
      setView(await r.json());
      setError("");
    } catch {
      setError(
        "Chưa thể thử lại. Quyền và bài đã hoàn thành vẫn được giữ; vui lòng liên hệ hỗ trợ nếu trạng thái chưa thay đổi.",
      );
    }
  };
  const overdue =
    !!view?.startedAt && clock - new Date(view.startedAt).getTime() > 300000;
  return (
    <Context.Provider value={{ view, retry }}>
      <div id="paid-ai-status">
        {error && !view && (
          <section className="card paid-ai-progress" role="status">
            {error}
          </section>
        )}
        {view?.eligible && (
          <section
            className="card paid-ai-progress"
            aria-label="Tiến trình AI 11 cung"
          >
            <p className="result-eyebrow">Thanh toán thành công</p>
            {view.simulation && (
              <p>
                <strong>QA · Mô phỏng AI, không gọi API thật</strong>
              </p>
            )}
            <h2 role="status" aria-live="polite">
              {view.state === "completed"
                ? "Đã hoàn thành luận giải 11 cung"
                : "Đang chuẩn bị bài luận AI của bạn"}
            </h2>
            <p>
              Đã hoàn thành <strong>{view.completed}/11 cung</strong>
            </p>
            <progress
              max={11}
              value={view.completed}
              aria-label={`${view.completed} trên 11 cung hoàn thành`}
            />
            {view.state !== "completed" && (
              <>
                <p>
                  Thời gian dự kiến: <strong>Khoảng 5 phút</strong>. Đây chỉ là
                  ước tính.
                </p>
                {(overdue || view.overEstimate) && (
                  <p>
                    Hệ thống đang tiếp tục xử lý. Một số bài cần thêm thời gian;
                    bạn có thể quay lại sau.
                  </p>
                )}
                <p>
                  Bạn có thể đóng trình duyệt hoặc rời trang. Tác vụ vẫn tiếp
                  tục; mở lại từ thư viện lá số để xem kết quả đã lưu.
                </p>
              </>
            )}
            {view.state === "attention" && (
              <p role="status">
                Một số cung cần thử lại hoặc đối soát. Quyền đã mua và các bài
                hoàn thành vẫn được giữ. Không cần thanh toán lại.
              </p>
            )}
            <p>
              <a href="#cung-0">Đọc cung Mệnh miễn phí</a> ·{" "}
              <a href="/la-so-cua-toi">Thư viện lá số</a>
            </p>
            {error && <p role="status">{error}</p>}
          </section>
        )}
      </div>
      {children}
    </Context.Provider>
  );
}
export function PaidPalaceReading({ palace }: { palace: string }) {
  const { view, retry } = useContext(Context),
    p = view?.eligible
      ? view.palaces.find((p) => p.palace === palace)
      : undefined;
  if (view === null)
    return (
      <div data-ai-state="loading">
        <p>Đang kiểm tra trạng thái bài luận…</p>
      </div>
    );
  if (!p)
    return (
      <div data-ai-state="not-entitled">
        <p>Luận AI · Chưa có quyền</p>
      </div>
    );
  return (
    <section
      className="paid-palace-reading"
      data-paid-state={p.state}
      aria-label={"Luận AI " + paidLabel(palace)}
    >
      <p className="result-eyebrow">
        Luận AI ·{" "}
        {p.state === "completed"
          ? "Hoàn thành"
          : p.state === "running" || p.state === "reconciling"
            ? "Đang tạo"
            : p.state === "error"
              ? "Lỗi"
              : p.state === "uncertain"
                ? "Cần kiểm tra"
                : "Đang chờ xử lý"}
      </p>
      {p.result ? (
        <>
          <p>
            {p.result.provider === "test-mock"
              ? "BẢN MÔ PHỎNG KIỂM THỬ · KHÔNG PHẢI LUẬN GIẢI API THẬT"
              : "Nội dung AI diễn giải · tham khảo"}
          </p>
          {p.result.content.sections.map((s) => (
            <article key={s.kind}>
              <h3>{s.title}</h3>
              {s.content.split(/\n\n+/).map((t, i) => (
                <p key={i}>{t}</p>
              ))}
              <ReadingDisclosure>
                <summary>Xem căn cứ</summary>
                {s.factIds.map((id) => (
                  <p key={id}>
                    {p.result!.facts.find((f) => f.id === id)?.text}
                  </p>
                ))}
                {s.knowledgeIds.map((id) => {
                  const k = p.result!.knowledge.find((k) => k.id === id);
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
                  {s.basis === "ai-synthesis"
                    ? "Có phần tổng hợp do AI suy luận; không phải dữ kiện đã được chứng minh về đời sống."
                    : "Đọc cùng điều kiện và giới hạn của nguồn."}
                </p>
              </ReadingDisclosure>
            </article>
          ))}
          {p.result.content.limitations.map((t, i) => (
            <p className="result-muted" key={i}>
              {t}
            </p>
          ))}
        </>
      ) : (
        <p>
          {p.state === "uncertain"
            ? "Phần này đang chờ kiểm tra. Quyền đã mua và các bài hoàn thành vẫn được giữ; vui lòng liên hệ hỗ trợ. Bạn không cần thanh toán lại."
            : p.state === "error"
              ? "Chưa hoàn thành bài cung này. Các cung khác và quyền đã mua vẫn được giữ."
              : "Bạn có thể đọc cung Mệnh trong lúc chờ hoặc quay lại từ thư viện lá số."}
        </p>
      )}
      {p.canRetry && (
        <button type="button" onClick={() => retry(palace)}>
          Thử lại cung {paidLabel(palace)}
        </button>
      )}
    </section>
  );
}
