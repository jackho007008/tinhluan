import { cookies } from "next/headers";
import { reviewAuthorized } from "@/lib/internal-review/auth";
import { pool } from "@/lib/db";
import { betaEnabled } from "@/lib/beta/schema";
import type { BetaDocument } from "@/lib/beta/document";
export const dynamic = "force-dynamic";
export default async function BetaReview() {
  if (!reviewAuthorized((await cookies()).get("tuvi_internal")?.value))
    return (
      <main className="reading-shell">
        <h1>Cần quyền kiểm tra nội bộ</h1>
        <a href="/internal">Đăng nhập nội bộ</a>
      </main>
    );
  let reports, feedback;
  try {
    reports = (
      await pool.query(
        "SELECT r.id,r.cohort,r.demo,r.document,r.released_at,r.revoked_at,r.expires_at,r.delete_after,count(g.id)::int prepared,count(g.invited_at)::int invited,count(g.started_at)::int started,count(g.completed_at)::int completed FROM beta_reports r LEFT JOIN beta_grants g ON g.report_id=r.id GROUP BY r.id ORDER BY r.created_at DESC",
      )
    ).rows;
    feedback = (
      await pool.query(
        "SELECT f.id,f.section_id,f.claim_id,f.versions,f.answers,f.created_at,g.alias,r.cohort,r.demo,r.id report_id FROM beta_feedback f JOIN beta_grants g ON g.id=f.grant_id JOIN beta_reports r ON r.id=f.report_id ORDER BY f.created_at DESC LIMIT 500",
      )
    ).rows;
  } catch {
    return (
      <main className="reading-shell">
        <h1>Đọc thử beta</h1>
        <p>
          Chưa tải được dữ liệu. Kiểm tra database và migration beta; không coi
          đây là số phản hồi bằng 0.
        </p>
      </main>
    );
  }
  const groups = new Map<string, number>();
  for (const f of feedback)
    for (const tag of f.answers.tags) {
      const key = `${f.demo ? "DEMO" : "Đọc thử"} · ${f.report_id} · ${f.section_id} · ${tag}`;
      groups.set(key, (groups.get(key) || 0) + 1);
    }
  return (
    <main className="reading-shell">
      <h1>Phản hồi đọc thử miễn phí</h1>
      <a href="/internal">Về nội bộ</a>
      <p>
        Beta đang {betaEnabled() ? "BẬT trong tiến trình này" : "TẮT"}. Các bản
        chuẩn bị không tự được phát hành.
      </p>
      <p>
        “Đã mời” do người phụ trách ghi nhận sau khi thực sự gửi lời mời. “Bắt
        đầu” là người thử đồng ý bắt đầu; “hoàn thành” là có phản hồi toàn báo
        cáo. Các nhóm DEMO không đại diện người thật. Bảng phản hồi hiển thị tối
        đa 500 bản mới nhất; số đánh dấu bên dưới chỉ tính các bản đang hiển
        thị, không phải số người độc lập.
      </p>
      {!reports.length && (
        <p>Chưa chuẩn bị bản đọc hoặc mời người nào qua chức năng này.</p>
      )}
      {reports.map((r) => (
        <article className="card evidence" key={r.id}>
          <h2>
            {r.demo ? "DEMO — " : ""}
            {r.cohort}
          </h2>
          <p>Mã bản: {r.id}</p>
          <p>
            Quyền đã chuẩn bị: {r.prepared}; đã mời: {r.invited}; bắt đầu:{" "}
            {r.started}; hoàn thành: {r.completed}.
          </p>
          <p>
            {r.revoked_at
              ? "Đã thu hồi"
              : r.released_at
                ? "Đã chọn phát hành (còn phụ thuộc cờ toàn cục)"
                : "Chưa chọn phát hành"}
            . Hết hạn {new Date(r.expires_at).toLocaleDateString("vi-VN")}; dự
            kiến dọn {new Date(r.delete_after).toLocaleDateString("vi-VN")}.
          </p>
          <details>
            <summary>Xem chính bản nội dung đã chốt</summary>
            {(r.document as BetaDocument).warnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
            {(r.document as BetaDocument).sections.map((s) => (
              <section key={s.id}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <p>{s.id}</p>
              </section>
            ))}
            <p>{JSON.stringify(r.document.versions)}</p>
          </details>
        </article>
      ))}
      <h2>Đoạn cần xem lại</h2>
      {groups.size ? (
        <ul>
          {[...groups]
            .sort((a, b) => b[1] - a[1])
            .map(([key, count]) => (
              <li className="evidence" key={key}>
                {key}: {count} lượt
              </li>
            ))}
        </ul>
      ) : (
        <p>Chưa có đánh dấu; không tạo số liệu giả.</p>
      )}
      <h2>Phản hồi nguyên văn</h2>
      {feedback.map((f) => (
        <article className="card evidence" key={f.id}>
          <h3>
            {f.demo ? "DEMO · " : ""}
            {f.alias}
          </h3>
          <p>
            {f.cohort} · {f.report_id} · {f.section_id} ·{" "}
            {new Date(f.created_at).toLocaleString("vi-VN")}
          </p>
          <p>
            Mức hiểu: {f.answers.understanding}/5. Tìm căn cứ:{" "}
            {f.answers.basisFound}. {f.answers.tags.join(", ")}
          </p>
          {["useful", "unclear", "concern", "missing"].map((k) => (
            <p key={k}>
              {
                (
                  {
                    useful: "Hữu ích",
                    unclear: "Khó hiểu/chung chung",
                    concern: "Lo lắng/khẳng định",
                    missing: "Còn thiếu",
                  } as Record<string, string>
                )[k]
              }
              : {f.answers[k] || "(không trả lời)"}
            </p>
          ))}
          <details>
            <summary>Phiên bản và mã đoạn</summary>
            <p>{f.claim_id || "Phản hồi cho phần dữ kiện hoặc toàn báo cáo"}</p>
            <p>{JSON.stringify(f.versions)}</p>
          </details>
        </article>
      ))}
      <p>
        Ưu tiên đọc từng phản hồi, xác định đoạn và phiên bản trước khi sửa. Số
        lượt đánh dấu không đo độ đúng của Tử vi, thị trường hoặc tỷ lệ mua
        hàng.
      </p>
    </main>
  );
}
