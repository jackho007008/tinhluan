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
import { readPaidContent } from "@/lib/ai/paid-result";
import PaidReadingContent from "./PaidReadingContent";
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
              {view.state === "content-limited"
                ? "Đã xử lý xong · Nội dung có giới hạn"
                : view.state === "attention" && view.processed === 11
                  ? "Đã xử lý xong · Một số nội dung cần kiểm tra"
                  : view.state === "completed"
                    ? "Đã hoàn thành luận giải 11 cung"
                    : "Đang chuẩn bị bài luận AI của bạn"}
            </h2>
            <p>
              {view.focused || view.limited || view.insufficient
                ? "Có bài phân tích"
                : "Đã hoàn thành"}{" "}
              <strong>{view.completed}/11 cung</strong>
            </p>
            <progress
              max={11}
              value={view.completed}
              aria-label={`${view.completed} trên 11 cung hoàn thành`}
            />
            {(view.focused > 0 ||
              view.limited > 0 ||
              view.insufficient > 0) && (
              <p>
                Đã xử lý {view.processed}/11 cung · {view.focused} bài phân tích
                · {view.limited} bài có giới hạn · {view.insufficient} cung chưa
                đủ căn cứ.
              </p>
            )}
            {view.state !== "completed" && view.processed !== 11 && (
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
  const content = p.result ? readPaidContent(p.result) : null;
  const coverage = content?.version === 2 ? content.content.coverage : null;
  return (
    <section
      className="paid-palace-reading"
      data-paid-state={p.state}
      aria-label={"Luận AI " + paidLabel(palace)}
    >
      <p className="result-eyebrow">
        Luận AI ·{" "}
        {p.state === "completed"
          ? coverage === "insufficient"
            ? "Đã xử lý · Chưa đủ căn cứ"
            : coverage === "limited"
              ? "Hoàn thành · Phân tích có giới hạn"
              : "Hoàn thành"
          : p.state === "running" || p.state === "reconciling"
            ? "Đang tạo"
            : p.state === "unsupported"
              ? "Cần kiểm tra phiên bản nội dung"
              : p.state === "error"
                ? "Lỗi"
                : p.state === "uncertain"
                  ? "Cần kiểm tra"
                  : "Đang chờ xử lý"}
      </p>
      {p.result ? (
        <PaidReadingContent result={p.result} />
      ) : (
        <p>
          {p.state === "unsupported"
            ? "Chưa đọc được phiên bản nội dung này. Bài đã lưu và quyền đã mua vẫn được giữ; vui lòng liên hệ hỗ trợ."
            : p.state === "uncertain"
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
