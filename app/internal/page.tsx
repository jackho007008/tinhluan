import StarConventionNotice from "@/components/StarConventionNotice";
import InternalCoverage from "@/components/InternalCoverage";
import InternalForm from "@/components/InternalForm";
import { cookies } from "next/headers";
import { reviewAuthorized } from "@/lib/internal-review/auth";
import { pool } from "@/lib/db";
import { internalPreview } from "@/lib/internal-review/preview";
import type { ReportData } from "@/lib/reports";
import { TopicFacts } from "@/components/CustomerReport";
import { z } from "zod";
import {
  samples,
  loadSample,
  SAMPLE_VERSION,
} from "@/lib/internal-review/samples";
export const dynamic = "force-dynamic";
export default async function Internal({
  searchParams,
}: {
  searchParams: Promise<{
    denied?: string;
    report?: string;
    sample?: string;
    view?: string;
    filter?: string;
  }>;
}) {
  const params = await searchParams;
  const denied = params.denied;
  const allowed = reviewAuthorized(
    (await cookies()).get("tuvi_internal")?.value,
  );
  if (!allowed)
    return (
      <main className="reading-shell">
        <article className="card">
          <span className="eyebrow">KHU VỰC KIỂM TRA</span>
          <h1>Đăng nhập nội bộ</h1>
          <p>
            Quyền kiểm tra riêng với quyền đọc đơn hàng. Phiên làm việc có hiệu
            lực một giờ.
          </p>
          {denied && (
            <p role="alert">Khóa không hợp lệ hoặc chưa được cấu hình.</p>
          )}
          <InternalForm action="/api/internal-login">
            <label>
              Khóa truy cập nội bộ
              <input
                type="password"
                name="key"
                required
                autoComplete="current-password"
                maxLength={256}
              />
            </label>
            <button className="primary" type="submit">
              Mở bản kiểm tra
            </button>
          </InternalForm>
          <p>Khóa được cấu hình riêng trên máy chủ; không có khóa mặc định.</p>
        </article>
      </main>
    );
  if (params.view === "coverage")
    return <InternalCoverage filter={params.filter || "all"} />;
  const sampleResult = params.sample ? await loadSample(params.sample) : null;
  const options = params.sample
    ? { rows: [] }
    : await pool.query(
        "SELECT r.order_id,o.code,r.created_at FROM reports r JOIN orders o ON o.id=r.order_id ORDER BY r.created_at DESC LIMIT 100",
      );
  const id =
    params.report ||
    process.env.INTERNAL_REVIEW_ORDER_ID ||
    options.rows[0]?.order_id;
  const valid = z.string().uuid().safeParse(id);
  const result =
    !params.sample && valid.success
      ? await pool.query("SELECT data FROM reports WHERE order_id=$1", [
          valid.data,
        ])
      : { rows: [] };
  const selector = (
    <>
      <p><a href="/internal/admin">Quản trị vận hành · Báo cáo, đơn hàng và giao dịch</a></p>
      <p>
        <a href="/internal/readings">
          Nhập thông tin sinh và đọc Tân Biên nội bộ
        </a>
      </p>
      <p>
        <a href="/internal?view=coverage">
          Đo độ phủ nội dung và xem các bản Tổng quan mẫu
        </a>
      </p>
      <form method="get" action="/internal" className="card">
        <label>
          Chọn mẫu kiểm thử
          <select name="sample" defaultValue={params.sample || samples[0].id}>
            {(["engine", "synthetic"] as const).map((kind) => (
              <optgroup
                key={kind}
                label={
                  kind === "engine"
                    ? "Engine từ thông tin sinh giả lập"
                    : "Fixture kỹ thuật — không phải lá số hợp lệ"
                }
              >
                {samples
                  .filter((s) => s.kind === kind)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
        <button className="primary" type="submit">
          Xem mẫu kiểm thử
        </button>
        <p>
          Mẫu riêng, không tạo đơn hoặc giao dịch. Không xác nhận độ đúng chuyên
          môn của engine.
        </p>
        <a href="/internal">Trở lại báo cáo đã lưu</a>
      </form>
      {!params.sample && (
        <form method="get" action="/internal" className="card">
          <label>
            Chọn báo cáo đã lưu
            <select name="report" defaultValue={id || ""} required>
              {options.rows.map((o) => (
                <option value={o.order_id} key={o.order_id}>
                  {o.code} ·{" "}
                  {new Date(o.created_at).toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}
                </option>
              ))}
            </select>
          </label>
          <button className="primary" type="submit">
            Xem lá số này
          </button>
          <p>
            Danh sách 100 báo cáo gần nhất. Chỉ đọc; không sửa đơn hoặc báo cáo
            đã giao.
          </p>
        </form>
      )}
    </>
  );
  if (!sampleResult && !result.rows.length)
    return (
      <main className="reading-shell">
        <h1>
          {params.sample
            ? "Không tìm thấy mẫu kiểm thử"
            : "Không tìm thấy báo cáo đã chọn"}
        </h1>
        {selector}
      </main>
    );
  const report = sampleResult?.report || (result.rows[0].data as ReportData),
    preview = internalPreview(report);
  return (
    <main className="reading-shell">
      <header className="section-heading">
        <div>
          <span className="badge">{preview.label}</span>
          <h1>Đọc thử Tổng quan & Sự nghiệp</h1>
        </div>
        <InternalForm action="/api/internal-logout">
          <button className="outline" type="submit">
            Đăng xuất
          </button>
        </InternalForm>
      </header>
      {selector}
      <p>
        <a href="/internal/linh-comparison">
          Đối chiếu phép an Linh Tinh — thử nghiệm riêng
        </a>
      </p>
      <StarConventionNotice snapshot={report.snapshot} />
      <p>
        <a href="/internal/editorial/demo-wuqu-tianfu">
          Bản biên soạn riêng DEMO Vũ Khúc–Thiên Phủ · 1.0
        </a>
      </p>
      <section className="card" data-testid="current-chart">
        <h2>Lá số đang kiểm tra</h2>
        <p>
          {sampleResult
            ? `Mẫu ${SAMPLE_VERSION}: ${sampleResult.sample.name}`
            : "Mã đơn:"}{" "}
          {!sampleResult &&
            (options.rows.find((o) => o.order_id === id)?.code ||
              "Báo cáo được chọn")}
        </p>
        <p>
          Profile: {report.snapshot.profile.id} · Engine:{" "}
          {report.snapshot.versions.engine}
        </p>
        <p>
          Phiên bản nội dung: {preview.contentVersion} · Preview:{" "}
          {preview.version}
        </p>
        <p>Kết quả: {report.snapshot.resultId}</p>
        {sampleResult && (
          <>
            <p>
              {sampleResult.sample.kind === "synthetic"
                ? "Fixture kỹ thuật tổng hợp — vị trí đã được sửa có chủ đích, không phải lá số hợp lệ."
                : "Lá số do engine tính từ đầu vào giả lập công khai; chỉ kiểm thử tích hợp, không phải xác nhận độc lập."}
            </p>
            <details>
              <summary>Đầu vào và kỳ vọng có chủ đích</summary>
              <pre>
                {JSON.stringify(
                  {
                    input: sampleResult.sample.input,
                    expected: sampleResult.sample.expected,
                  },
                  null,
                  2,
                )}
              </pre>
            </details>
          </>
        )}
      </section>
      <div className="alert">
        <p>{preview.limitations}</p>
      </div>
      <nav className="reading-nav">
        <a href="/internal/beta">Phản hồi beta</a>
        <a href="#preview-overview">Tổng quan</a>
        <a href="#preview-career">Sự nghiệp</a>
        <a href="#claim-map">Bảng căn cứ</a>
        <a href="#execution">Lần thực thi</a>
        <a href="#technical">Kiểm tra kỹ thuật</a>
      </nav>
      {preview.topics.map((t) => (
        <article
          className="card report-group"
          id={`preview-${t.id}`}
          key={t.id}
        >
          <span className="eyebrow">BẢN NHÁP ĐỌC THỬ</span>
          <h2>{t.title}</h2>
          <p>{t.summary}</p>
          <TopicFacts topic={t} />
          {t.readingGuide && <p>{t.readingGuide}</p>}
          <h3>Diễn giải được hỗ trợ</h3>
          {t.mainNotes.length ? (
            t.mainNotes.map((n) => (
              <section data-rule={n.id} key={n.claimId}>
                <h3>{n.title}</h3>
                <p>{n.text}</p>
              </section>
            ))
          ) : (
            <p>Chưa có chú giải khớp đủ dữ kiện cho chủ đề này.</p>
          )}
          {t.glossaryNotes.length > 0 && (
            <section>
              <h3>Hiểu tên gọi trên lá số</h3>
              <p>
                Phần này giải thích cách cổ thư gọi sao, chưa phải nhận định
                riêng về người có sao ấy tại Mệnh.
              </p>
              {t.glossaryNotes.map((n) => (
                <section data-rule={n.id} key={n.claimId}>
                  <h4>{n.title}</h4>
                  <p>{n.text}</p>
                </section>
              ))}
            </section>
          )}
          {t.detailNotes.length > 0 && (
            <details>
              <summary>Chú giải yếu tố riêng</summary>
              <p>
                Đã đưa phần chú giải đơn vào đây để tránh lặp với nhận định phối
                hợp; căn cứ và trace vẫn giữ đầy đủ.
              </p>
              {t.detailNotes.map((n) => (
                <section data-rule={n.id} key={n.claimId}>
                  <h3>{n.title}</h3>
                  <p>{n.text}</p>
                </section>
              ))}
            </details>
          )}
          {t.unexplainedStars.length > 0 && (
            <p>
              Chưa có diễn giải riêng tại Mệnh cho:{" "}
              {t.unexplainedStars.join(", ")}. Dữ kiện vẫn được giữ trong phần
              lá số.
            </p>
          )}
          <h3>Yếu tố bổ sung và khác chiều</h3>
          {t.supportingFacts.map((f) => (
            <p key={f.id}>{f.text}</p>
          ))}
          {t.adjustments.length ? (
            t.adjustments.map((c) => <p key={c.id}>{c.text}</p>)
          ) : (
            <p>Chưa có quy tắc bổ sung khớp đủ dữ kiện trong lần chạy này.</p>
          )}
          <h3>Phần chưa đủ căn cứ để tổng hợp</h3>
          {t.scopeGaps.map((gap) => (
            <p key={gap}>{gap}</p>
          ))}
          <p>{t.synthesis}</p>
          <details>
            <summary>Xem căn cứ</summary>
            {[...t.notes.map((n) => n.claim), ...t.adjustments].map((c) => (
              <div className="evidence" key={c.id}>
                <p>Claim: {c.id}</p>
                <p>
                  Dữ kiện:{" "}
                  {c.factIds
                    .map(
                      (id) =>
                        preview.execution.derivedFacts.find((f) => f.id === id)
                          ?.text,
                    )
                    .join(" · ")}
                </p>
                {c.rules.map((r) => (
                  <section key={r.id}>
                    <h3>{r.presentation?.title || r.id}</h3>
                    <p>
                      Rule: {r.id} @ {r.version} · {r.status}
                    </p>
                    <p>
                      Phạm vi ý nghĩa:{" "}
                      {r.presentation?.sourceScope || r.limitations[0]}
                    </p>
                    {r.sourceReferences.map((src) => (
                      <p key={src.id}>
                        <a href={src.url} target="_blank" rel="noreferrer">
                          {src.title}
                        </a>{" "}
                        · {src.location}
                      </p>
                    ))}
                    <p>
                      Điều kiện:{" "}
                      {r.presentation?.applicability || c.reasons.join("; ")}
                    </p>
                    <p>
                      Ngoại lệ đã đặc tả:{" "}
                      {r.exceptions.length
                        ? JSON.stringify(r.exceptions)
                        : "Chưa có; không có nghĩa là không tồn tại ngoại lệ."}
                    </p>
                    <p>
                      Giới hạn:{" "}
                      {[
                        ...new Set([
                          ...r.limitations,
                          ...(r.presentation?.unknownConditions || []),
                        ]),
                      ].join(" ")}
                    </p>
                  </section>
                ))}
                <p>Căn cứ cụ thể: {c.evidencePaths.join(" · ")}</p>
                <p>Vì sao khớp: {c.reasons.join("; ")}</p>
                {c.unresolvedWith.length > 0 && (
                  <p>
                    Khác chiều chưa giải quyết: {c.unresolvedWith.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </details>
        </article>
      ))}
      <section className="card" id="claim-map">
        <h2>Từng nhận định và phần còn thiếu</h2>
        <div className="reading-table">
          <table>
            <caption>
              Chỉ nhận định evaluator cho phép đọc nội bộ trong lần này
            </caption>
            <thead>
              <tr>
                {[
                  "Rule / claim",
                  "Nhận định",
                  "Dữ kiện",
                  "Nguồn",
                  "Điều kiện / phần thiếu",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.notes.map((n) => (
                <tr key={n.claimId}>
                  <td>
                    {n.id} @ {n.version}
                    <br />
                    {n.claimId}
                  </td>
                  <td>{n.text}</td>
                  <td>{n.factor}</td>
                  <td>
                    {n.sources.map((s) => (
                      <p key={s.id}>
                        <a href={s.url}>{s.title}</a> · {s.location}
                      </p>
                    ))}
                  </td>
                  <td>
                    {n.condition}
                    <br />
                    {n.missing}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card" id="execution">
        <h2>Lần thực thi hiện tại</h2>
        <p>
          Khớp điều kiện chưa đồng nghĩa được phép phát hành. Draft chỉ xuất ở
          preview nội bộ.
        </p>
        <div className="reading-table">
          <table>
            <thead>
              <tr>
                <th>Rule / phiên bản</th>
                <th>Kết quả</th>
                <th>Lý do</th>
              </tr>
            </thead>
            <tbody>
              {preview.execution.traces.map((t, i) => (
                <tr key={i}>
                  <td>
                    {t.ruleId} @ {t.version}
                  </td>
                  <td>{t.status}</td>
                  <td>
                    {t.details.join(" · ") ||
                      "Đã đánh giá theo chính sách của lần chạy"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card" id="technical">
        <h2>Kiểm tra kỹ thuật</h2>
        <p>
          Preview đọc lại dữ kiện bằng catalog hiện tại; báo cáo đã giao bên
          dưới giữ nguyên phiên bản cũ.
        </p>
        <details>
          <summary>
            Snapshot, rule ID, phiên bản, evidence paths và trace đã lưu
          </summary>
          <pre>{JSON.stringify(report, null, 2)}</pre>
        </details>
        <details>
          <summary>Catalog thực sự chạy và kết quả lần này</summary>
          <pre>{JSON.stringify(preview.execution, null, 2)}</pre>
        </details>
      </section>
    </main>
  );
}
