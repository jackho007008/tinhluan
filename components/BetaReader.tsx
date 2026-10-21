"use client";
import { useEffect, useState, useRef } from "react";
import type { BetaDocument } from "@/lib/beta/document";
import { feedbackTags } from "@/lib/beta/schema";
type Reading = {
  reportId: string;
  alias: string;
  expires: string;
  deleteAfter: string;
  started: boolean;
  completed: boolean;
  document: BetaDocument;
};
export default function BetaReader() {
  const initialized = useRef(false);
  const [reading, setReading] = useState<Reading | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [target, setTarget] = useState("report"),
    [saved, setSaved] = useState(false),
    [requestId, setRequestId] = useState("");
  async function load() {
    const r = await fetch("/api/beta/reading", { cache: "no-store" });
    const data = await r.json();
    if (!r.ok) throw Error(data.error);
    setReading(data);
  }
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const token = location.hash.slice(1);
    history.replaceState(null, "", "/beta");
    setRequestId(crypto.randomUUID());
    void (async () => {
      try {
        if (token) {
          const r = await fetch("/api/beta/exchange", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
          if (!r.ok)
            throw Error(
              "Liên kết không còn dùng được. Nếu đã mở trên trình duyệt này, hãy chọn Tải lại bản đọc; nếu không, liên hệ người phụ trách.",
            );
        }
        await load();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không thể tải bản đọc.");
      }
    })();
  }, []);
  async function start() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/beta/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consent: true,
          reportId: reading?.reportId,
          readerAlias: reading?.alias,
        }),
      });
      if (!r.ok)
        throw Error("Không thể bắt đầu. Quyền truy cập có thể đã hết hạn.");
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="reading-shell beta-reader">
      <h1>Bản đọc thử miễn phí — nội dung dự thảo</h1>
      <p>
        Đây là kiểm tra cách đọc và chất lượng nội dung, không phải đo độ chính
        xác dự đoán. Không có thanh toán.
      </p>
      {error && <p role="alert">{error}</p>}
      {!reading && (
        <button
          className="secondary"
          onClick={() => {
            setError("");
            void load().catch((e) => setError(e.message));
          }}
        >
          Tải lại bản đọc
        </button>
      )}
      {reading && (
        <>
          <p>
            Mã người thử: {reading.alias}.{" "}
            {reading.document.demo
              ? "DỮ LIỆU GIẢ LẬP — không phải thông tin của người thử."
              : "Bản được người phụ trách chọn; chỉ sử dụng dữ liệu khi đã có sự đồng ý phù hợp."}
          </p>
          <div className="alert">
            <h2>Phạm vi trước khi đọc</h2>
            <ul>
              {reading.document.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
          <details open={!reading.started}>
            <summary>Dữ liệu được lưu và mục đích</summary>
            <p>
              Lưu mã giả danh, bản nội dung đã chốt, lá số và thông tin sinh có
              trong bản nguồn (ngày, giờ, nơi sinh, giới tính theo quy tắc),
              phiên bản, thời điểm bắt đầu/hoàn thành và các câu trả lời để tìm
              chỗ khó hiểu hoặc thiếu căn cứ. Không cần tên thật, email hoặc số
              điện thoại. Không nhập thông tin cá nhân của bạn hay người khác
              vào phản hồi.
            </p>
            <p>
              Quyền đọc hết hạn:{" "}
              {new Date(reading.expires).toLocaleString("vi-VN")}. Ngày dự kiến
              dọn dữ liệu:{" "}
              {new Date(reading.deleteAfter).toLocaleDateString("vi-VN")}; người
              phụ trách vận hành việc xóa, không tự động cam kết xóa bản sao
              lưu. Có thể dừng tham gia và yêu cầu thu hồi/xóa qua người đã mời
              bạn.
            </p>
            <p>
              Liên kết nguồn bên ngoài chỉ mở khi bạn chọn; website nguồn có
              chính sách riêng. Không gửi mã truy cập cho người khác.
            </p>
          </details>
          {!reading.started ? (
            <button className="primary" disabled={busy} onClick={start}>
              Tôi hiểu phạm vi và đồng ý bắt đầu
            </button>
          ) : (
            <>
              <p>
                {reading.document.title}. Nội dung dự thảo chưa được duyệt
                chuyên môn; đây là template từ các quy tắc hiện có, không dùng
                AI.
              </p>
              {reading.document.sections.map((section) => (
                <article
                  className="card report-group"
                  key={section.id}
                  id={section.id}
                >
                  <h2>{section.title}</h2>
                  <p style={{ whiteSpace: "pre-line" }}>{section.text}</p>
                  <details>
                    <summary>Xem căn cứ</summary>
                    <p>{section.basis.factor}</p>
                    <p>{section.basis.conditions}</p>
                    {section.basis.sources.map((source, i) => (
                      <p key={i}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {source.title}
                        </a>{" "}
                        — {source.location}
                      </p>
                    ))}
                    <p>{section.basis.limits}</p>
                  </details>
                  <button
                    className="secondary"
                    onClick={() => {
                      setTarget(section.id);
                      setSaved(false);
                      setRequestId(crypto.randomUUID());
                      document
                        .getElementById("beta-feedback")
                        ?.scrollIntoView();
                    }}
                  >
                    Đánh dấu đoạn: {section.title}
                  </button>
                </article>
              ))}
              <section className="card" id="beta-feedback">
                <h2>Phản hồi ngắn</h2>
                <p>
                  Không đánh giá “lá số đúng đến mức nào”. Hãy chỉ ra nội dung
                  cụ thể để chúng tôi sửa. Phản hồi mới được lưu riêng, không
                  sửa câu trả lời trước.
                </p>
                <form
                  onChange={() => {
                    setSaved(false);
                    setRequestId(crypto.randomUUID());
                  }}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (busy) return;
                    const form = new FormData(e.currentTarget);
                    setBusy(true);
                    setError("");
                    setSaved(false);
                    try {
                      const r = await fetch("/api/beta/feedback", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id: requestId,
                          sectionId: target,
                          reportId: reading.reportId,
                          readerAlias: reading.alias,
                          understanding: Number(form.get("understanding")),
                          tags: form.getAll("tags"),
                          basisFound: form.get("basisFound"),
                          useful: form.get("useful"),
                          unclear: form.get("unclear"),
                          concern: form.get("concern"),
                          missing: form.get("missing"),
                        }),
                      });
                      const data = await r.json();
                      if (!r.ok) throw Error(data.error);
                      setSaved(true);
                      await load();
                    } catch (e) {
                      setError((e as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <fieldset
                    disabled={busy}
                    style={{ border: 0, padding: 0, minWidth: 0 }}
                  >
                    <label>
                      Phản hồi cho
                      <select
                        aria-label="Phản hồi cho"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                      >
                        <option value="report">
                          Toàn báo cáo (hoàn thành đọc thử)
                        </option>
                        {reading.document.sections.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Bạn hiểu nội dung ở mức nào?
                      <select name="understanding" required defaultValue="">
                        <option value="" disabled>
                          Chọn mức hiểu
                        </option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                            {n === 1
                              ? " — chưa hiểu"
                              : n === 5
                                ? " — hiểu rõ"
                                : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                    <fieldset>
                      <legend>Đánh dấu đoạn hoặc báo cáo</legend>
                      {feedbackTags.map((tag) => (
                        <label
                          key={tag}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            margin: 0,
                            fontSize: 16,
                            gap: 12,
                            minHeight: 44,
                          }}
                        >
                          <input
                            type="checkbox"
                            name="tags"
                            value={tag}
                            style={{ width: 20, height: 20 }}
                          />
                          {tag}
                        </label>
                      ))}
                    </fieldset>
                    <label>
                      Bạn có tìm được căn cứ không?
                      <select name="basisFound" defaultValue="not-tried">
                        <option value="not-tried">Chưa thử</option>
                        <option value="yes">Có</option>
                        <option value="no">Không</option>
                      </select>
                    </label>
                    {(
                      [
                        ["useful", "Đoạn nào hữu ích nhất, vì sao?"],
                        [
                          "unclear",
                          "Đoạn nào chung chung, khó hiểu hoặc mâu thuẫn?",
                        ],
                        [
                          "concern",
                          "Có câu nào khẳng định chắc chắn hoặc khiến bạn lo lắng?",
                        ],
                        [
                          "missing",
                          "Bạn mong đợi điều gì nhưng bản đọc chưa trả lời?",
                        ],
                      ] as const
                    ).map(([name, label]) => (
                      <label key={name}>
                        {label} (tùy chọn)
                        <textarea name={name} maxLength={1500} rows={3} />
                      </label>
                    ))}
                    <button className="primary" type="submit" disabled={saved}>
                      {busy ? "Đang gửi…" : saved ? "Đã lưu" : "Gửi phản hồi"}
                    </button>
                  </fieldset>
                </form>
                {saved && (
                  <p role="status">Đã lưu phản hồi vào đúng bản bạn vừa đọc.</p>
                )}
                {reading.completed && (
                  <p>
                    Đã ghi nhận phản hồi toàn báo cáo. Bạn vẫn có thể đánh dấu
                    thêm đoạn trong thời hạn truy cập.
                  </p>
                )}
              </section>
            </>
          )}
          <button
            className="secondary"
            onClick={async () => {
              await fetch("/api/beta/logout", { method: "POST" });
              setReading(null);
              setError(
                "Đã đóng phiên đọc trên trình duyệt này. Muốn quay lại, cần người phụ trách cấp liên kết mới.",
              );
            }}
          >
            Đóng phiên đọc
          </button>
        </>
      )}
    </main>
  );
}
