import type {
  CustomerReport as Reading,
  ReadingTopic,
} from "@/lib/reading/customer";
export function TopicFacts({ topic }: { topic: ReadingTopic }) {
  return (
    <>
      <h3>Dữ kiện nổi bật</h3>
      <p>{topic.positions.join(" ")}</p>
      <h3>Chính tinh</h3>
      <p>
        {topic.stars.length
          ? topic.stars.map((s) => s.name).join(" · ")
          : topic.majorStarsStatus === "empty"
            ? "Danh sách chính tinh đã lưu là rỗng."
            : "Thiếu dữ liệu danh sách chính tinh; chưa thể xác định."}
      </p>
      {topic.stars.length > 0 && (
        <>
          <h3>Trạng thái sao</h3>
          <div className="data-list">
            {topic.stars.map((s) => (
              <div key={s.name}>
                <span>{s.name}</span>
                <b>{s.state || "Không ghi nhận trong dữ liệu"}</b>
              </div>
            ))}
          </div>
          <h3>Tứ hóa</h3>
          <div className="data-list">
            {topic.stars.map((s) => (
              <div key={s.name}>
                <span>{s.name}</span>
                <b>{s.transformation || "Không ghi nhận trong dữ liệu"}</b>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
export default function CustomerReport({ report }: { report: Reading }) {
  return (
    <section className="report" data-testid="customer-report">
      <div className="section-heading">
        <div>
          <span className="eyebrow">KẾT QUẢ ĐÃ LƯU</span>
          <h2>{report.title}</h2>
        </div>
        <span className="badge">DỮ KIỆN LÁ SỐ</span>
      </div>
      <div className="alert reading-status">
        <p>{report.notice}</p>
      </div>
      {report.topics.map((topic) => (
        <article
          className="card report-group"
          data-testid={`topic-${topic.id}`}
          key={topic.id}
        >
          <h2>{topic.title}</h2>
          <p>{topic.summary}</p>
          <TopicFacts topic={topic} />
          {topic.claims.length > 0 && (
            <>
              <h3>Nhận định</h3>
              {topic.claims.map((c, i) => (
                <p key={i}>{c}</p>
              ))}
            </>
          )}
          <details>
            <summary>Xem căn cứ</summary>
            <div className="evidence">
              <h3>Yếu tố trên lá số</h3>
              <p>{topic.basis}</p>
              <h3>Nguồn phương pháp</h3>
              <p>
                <a href={report.method.url} target="_blank" rel="noreferrer">
                  {report.method.label}
                </a>
              </p>
              <p>{report.method.calendar}</p>
              <h3>Điều kiện đọc</h3>
              <p>{topic.conditions}</p>
              <h3>Giới hạn</h3>
              <p>{topic.limits}</p>
              <p>
                “Không ghi nhận trong dữ liệu” có nghĩa chưa có thông tin để
                trình bày, không phải khẳng định yếu tố đó không tồn tại.
              </p>
            </div>
          </details>
        </article>
      ))}
      <aside className="card">
        <h2>Chưa có trong báo cáo này</h2>
        <p>{report.unsupported.join(" · ")}.</p>
      </aside>
    </section>
  );
}
