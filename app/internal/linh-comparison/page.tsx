import { linhIsolation } from "@/lib/internal-review/linh-isolation";
import entrySample from "@/lib/internal-review/engine-samples/linh-trial.json";
import { cookies } from "next/headers";
import { readFile } from "node:fs/promises";
import { reviewAuthorized } from "@/lib/internal-review/auth";
import { compareLinh } from "@/lib/internal-review/linh-trial";
import type { ChartSnapshot } from "@/lib/tuvi-engine";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sample?: string }>;
}) {
  if (!reviewAuthorized((await cookies()).get("tuvi_internal")?.value))
    return (
      <main className="reading-shell">
        <h1>Cần quyền kiểm tra nội bộ</h1>
        <a href="/internal">Đăng nhập nội bộ</a>
      </main>
    );
  const params = await searchParams;
  const pack = JSON.parse(
    await readFile("exports/tanbien-review-1.9.0/readings.json", "utf8"),
  ) as { rows: { id: string; kind: string; snapshot: ChartSnapshot }[] };
  pack.rows.push(entrySample as unknown as (typeof pack.rows)[number]);
  pack.rows.push(...linhIsolation(pack.rows));
  const selected = params.sample || "vn-tiantong";
  let row = pack.rows.find((r) => r.id === selected);
  if (selected === "audit-1992") {
    try {
      const a = JSON.parse(
        await readFile(".local/chart-comparison-1992-08-07/audit.json", "utf8"),
      );
      row = {
        id: "audit-1992",
        kind: "hồ sơ kiểm toán riêng",
        snapshot: a.snapshot,
      };
    } catch {
      row = undefined;
    }
  }
  const result = row ? compareLinh(row.snapshot) : null;
  return (
    <main className="reading-shell">
      <a href="/internal">← Kiểm tra nội bộ</a>
      <h1>Đối chiếu phép an Linh Tinh</h1>
      <p className="notice">
        Thử nghiệm độ nhạy trên bản sao; không phải profile Tân Biên hoàn chỉnh
        hoặc kết quả Toàn Thư đã hợp lệ. Không thay snapshot gốc.
      </p>
      <form>
        <label>
          Mẫu đối chiếu
          <select name="sample" defaultValue={selected}>
            {pack.rows.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} · {r.kind === "synthetic" ? "fixture kỹ thuật" : r.kind}
              </option>
            ))}
            <option value="audit-1992">Hồ sơ kiểm toán riêng 1992</option>
          </select>
        </label>
        <button className="primary">Đối chiếu Linh</button>
      </form>
      {!row || !result ? (
        <p>Không tìm thấy dữ liệu tại môi trường này; không fallback.</p>
      ) : (
        <section
          key={row.snapshot.resultId}
          data-linh-result
          style={{ overflowWrap: "anywhere", minWidth: 0 }}
          data-sample={row.id}
        >
          <h2>{row.id}</h2>
          <p>
            {row.kind === "synthetic"
              ? "Fixture kỹ thuật — không phải lá số hợp lệ do engine sinh"
              : row.kind}
            ; profile {row.snapshot.profile.id}; engine{" "}
            {row.snapshot.versions.engine}. Mã dữ liệu đang xét:{" "}
            {row.snapshot.resultId}
          </p>
          <p>
            {result.formula.formula.source}; phiên bản{" "}
            {result.formula.formula.version}; draft, chưa duyệt chuyên môn.
          </p>
          {result.status === "unknown" ? (
            <p>Chưa xác định: {result.reasons.join("; ")}</p>
          ) : (
            <>
              <p data-position-change>
                Linh cũ: {result.old.branch} ({result.old.palace}) → phương án:{" "}
                {result.proposed.branch} ({result.proposed.palace});{" "}
                {result.lifeMovement}.
              </p>
              <p>{result.limitation}</p>
              <p>
                Thay đổi facts, trạng thái rule và nội dung/ID claim là ba kết
                quả riêng. Trace có thể đổi trong khi trạng thái rule giữ
                nguyên.
              </p>
              <h3>Fact thay đổi</h3>
              <ul>
                {result.factChanges.map((f) => (
                  <li key={f.id}>
                    {f.id}: {JSON.stringify(f.before?.value)} →{" "}
                    {JSON.stringify(f.after?.value)}
                  </li>
                ))}
              </ul>
              <h3>Đối chiếu trạng thái rule</h3>
              {result.dependentRules.length ? (
                <ul>
                  {result.dependentRules.map((r) => (
                    <li key={r.ruleId}>
                      {r.ruleId}: {r.before.status} → {r.after.status}
                      <details>
                        <summary>Lý do trước/sau — {r.ruleId}</summary>
                        <pre>
                          {JSON.stringify(
                            {
                              before: r.before.details,
                              after: r.after.details,
                            },
                            null,
                            2,
                          )}
                        </pre>
                      </details>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có thay đổi trace rule.</p>
              )}
              <h3>Claim thay đổi — chỉ chẩn đoán</h3>
              {[...result.claimsRemoved, ...result.claimsAdded].length ? (
                <>
                  <p>Loại khỏi phương án:</p>
                  {result.claimsRemoved.map((c) => (
                    <p key={c.id}>
                      {c.id}: {c.text}
                    </p>
                  ))}
                  <p>Thêm vào phương án:</p>
                  {result.claimsAdded.map((c) => (
                    <p key={c.id}>
                      {c.id}: {c.text}
                    </p>
                  ))}
                </>
              ) : (
                <p>Không thay đổi claim.</p>
              )}
            </>
          )}
          {result.formula.status === "computed" && (
            <details data-linh-trace>
              <summary>Bảng đếm từng bước theo công thức</summary>
              <p>
                Khởi {result.formula.start};{" "}
                {result.formula.direction === 1 ? "thuận" : "nghịch"}; giờ Tý là
                bước 0.
              </p>
              <ol>
                {result.formula.trace.map((t) => (
                  <li key={t.step}>
                    Bước {t.step} · giờ {t.hour} → {t.branch}
                  </li>
                ))}
              </ol>
            </details>
          )}
          <details>
            <summary>Chi tiết kỹ thuật và dữ liệu dẫn xuất</summary>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </details>
        </section>
      )}
    </main>
  );
}
