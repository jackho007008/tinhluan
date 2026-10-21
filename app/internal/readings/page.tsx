import CustomerShell from '@/components/CustomerShell';
import CustomerReport from '@/components/CustomerReading';
import ContinuousReport from "@/components/ContinuousReport";
import { chartIntegrity } from '@/lib/tuvi-engine/chart-integrity';
import { exploration } from "@/lib/exploration/model";
import { readFile } from "node:fs/promises";
import Chart from "@/components/Chart";
import { chartInventory } from "@/lib/internal-review/chart-inventory";
import type { ChartSnapshot } from "@/lib/tuvi-engine";
import { cookies } from "next/headers";
import { reviewAuthorized } from "@/lib/internal-review/auth";
import { getReading, listReadings } from "@/lib/internal-review/reading-store";
import TanBienReading from "@/components/TanBienReading";
import InternalBirthForm from "@/components/InternalBirthForm";
export const dynamic = "force-dynamic";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; audit?: string; recreate?: string; mode?: string; print?: string; evidence?: string; experience?: string }>;
}) {
  if (!reviewAuthorized((await cookies()).get("tuvi_internal")?.value))
    return (
      <main className="reading-shell">
        <h1>Cần quyền kiểm tra nội bộ</h1>
        <a href="/internal">Đăng nhập nội bộ</a>
      </main>
    );
  const { id, audit, recreate, mode, print, evidence, experience } = await searchParams;
  if (audit) {
    if (audit !== "chart-comparison")
      return (
        <main className="reading-shell">
          <p>Không tìm thấy hồ sơ kiểm toán.</p>
        </main>
      );
    try {
      const { snapshot } = JSON.parse(
        await readFile(".local/chart-comparison-1992-08-07/audit.json", "utf8"),
      ) as { snapshot: ChartSnapshot };
      return (
        <main className="reading-shell">
          <a href="/internal/readings">← Hồ sơ nội bộ</a>
          <h1>Lá số hồ sơ kiểm toán riêng</h1>
          <p>
            Đọc đúng snapshot đã lưu; không tính lại, không tạo bài đọc hoặc
            thay phép an.
          </p>
          <Chart snapshot={snapshot} context="tanbien" />
          <details className="card">
            <summary>
              Tạo bản mới theo Tân Biên từ cùng thông tin (giữ bản cũ)
            </summary>
            <InternalBirthForm
              initial={snapshot.normalized}
              parentId="audit-chart-comparison"
            />
          </details>
          <details className="card">
            <summary>Kiểm kê 12 cung — trước khi mở chế độ đầy đủ</summary>
            {chartInventory(snapshot).map((r) => (
              <section key={r.palace}>
                <h2>{r.palace}</h2>
                <dl>
                  <dt>Trong snapshot</dt>
                  <dd>{r.stored}</dd>
                  <dt>Khung trước đây</dt>
                  <dd>{r.previousFrame}</dd>
                  <dt>Chi tiết trước đây</dt>
                  <dd>{r.previousDetails}</dd>
                  <dt>Chưa có dữ liệu</dt>
                  <dd>{r.missing}</dd>
                </dl>
              </section>
            ))}
          </details>
        </main>
      );
    } catch {
      return (
        <main className="reading-shell">
          <p role="alert">
            Không đọc được snapshot kiểm toán tại môi trường này. Không fallback
            DEMO.
          </p>
        </main>
      );
    }
  }

  if (recreate) {
    const previous = await getReading(recreate);
    return (
      <main className="reading-shell">
        <a href="/internal/readings">Hồ sơ nội bộ</a>
        {previous ? (
          <>
            <h1>Tạo phiên bản mới — không ghi đè hồ sơ cũ</h1>
            <InternalBirthForm
              initial={previous.snapshot.normalized}
              parentId={previous.id}
            />
          </>
        ) : (
          <p role="alert">Không tìm thấy hồ sơ nguồn.</p>
        )}
      </main>
    );
  }
  let record, rows;
  try {
    record = id ? await getReading(id) : null;
    rows = id ? [] : await listReadings();
  } catch {
    return (
      <main className="reading-shell">
        <p role="alert">Không đọc được hồ sơ. Không dùng dữ liệu thay thế.</p>
        <a href="/internal/readings">Thử lại</a>
      </main>
    );
  }
  if (record?.frozen.customerReport && mode !== 'internal') {
    const modern = experience === '1' && print !== '1' && record.frozen.customerReport.version === '1.47.0';
    const reading = <CustomerReport report={record.frozen.customerReport} snapshot={record.snapshot} id={record.id} basic={mode==='basic'} print={print==='1'} evidence={evidence==='1'} experience={modern} birthTimeLabel={record.inputReceipt?.timeLabel}/>;
    return modern ? <CustomerShell>{reading}</CustomerShell> : reading;
  }
  return (
    <main className="reading-shell" style={{ overflowWrap: "anywhere" }}>
      <a href="/internal">← Kiểm tra nội bộ</a>
      <p>
        <a href="/internal/readings">Nhập mới / hồ sơ đã lưu</a>
      </p>
      {id ? (
        record ? (
          <>
            <h2>Hồ sơ sinh đang đọc</h2>
            {!chartIntegrity(record.snapshot.chart).valid && <aside role="alert" data-integrity-warning>
              Lỗi toàn vẹn dữ liệu: danh sách sao hoặc chứng nhận không nhất quán. Nội dung lịch sử bên dưới được giữ nguyên; không tạo lời luận mới từ bản này. Hãy tạo bản tính mới từ đầu vào đã xác minh để đối chiếu.
              <details><summary>Chi tiết lỗi dữ liệu</summary><pre>{chartIntegrity(record.snapshot.chart).issues.join("\n")}</pre></details>
            </aside>}
            <p>
              Đang đọc bản đã lưu ngày{" "}
              {new Date(record.createdAt).toLocaleDateString("vi-VN")}; kết quả
              tính toán được giữ theo phiên bản của hồ sơ.
            </p>
            <p>
              {record.snapshot.profile.id} · {record.snapshot.versions.engine}
            </p>
            <a href={"/internal/readings?recreate=" + record.id}>
              Tạo bản mới từ cùng thông tin để đối chiếu
            </a>
            {record.sourceRecord && <details><summary>Nguồn bản tính lại</summary><p>{record.sourceRecord.file} · {record.sourceRecord.resultId}</p><p>{record.sourceRecord.reason}</p></details>}
            {record.parentId && (
              <p>
                <a
                  href={
                    record.parentId === "audit-chart-comparison"
                      ? "/internal/readings?audit=chart-comparison"
                      : "/internal/readings?id=" + record.parentId
                  }
                >
                  Mở hồ sơ nguồn (không đổi)
                </a>
              </p>
            )}
            <p data-birth-summary>
              {record.snapshot.normalized.date} ·{" "}
              {String(record.snapshot.normalized.hour).padStart(2, "0")}:
              {String(record.snapshot.normalized.minute).padStart(2, "0")} ·{" "}
              {record.snapshot.normalized.gender === "male" ? "Nam" : "Nữ"} ·{" "}
              {record.snapshot.normalized.place} ·{" "}
              {record.snapshot.normalized.timezone}
            </p>
            <p>
              {record.snapshot.profile.system} ·{" "}
              {record.snapshot.profile.calendar}
            </p>
            <p>
              Bản đọc thử nội bộ theo phạm vi rule hiện có, chưa phải Tổng quan
              hoàn chỉnh. Lưu {record.createdAt}; phiên bản{" "}
              {record.frozen.dynamicVersion}, template{" "}
              {record.frozen.reading.templateVersion}.
            </p>
            <p>
              {chartIntegrity(record.snapshot.chart).valid && record.frozen.verified
                ? "Danh sách sao được lưu nguyên từ lần tính engine này, đầy đủ theo hợp đồng adapter; không phải xác nhận chuyên môn."
                : "Chưa có bằng chứng độ đầy đủ danh sách sao. Không suy ra sao vắng mặt."}
            </p>
            {record.frozen.continuousReport && <p><a href="#natal-start">Đọc toàn bộ báo cáo 12 cung</a></p>}
            <Chart
              snapshot={record.snapshot}
              readingId={record.id}
              exploration={chartIntegrity(record.snapshot.chart).valid ? exploration(record.snapshot, record.frozen) : undefined}
            />
            {record.frozen.continuousReport && <ContinuousReport report={record.frozen.continuousReport}/>}
            <details>
              <summary>
                Bài đọc gốc đã lưu — không đổi theo năm đang chọn
              </summary>
              <TanBienReading
                snapshot={record.snapshot}
                frozen={record.frozen}
                readingId={record.id}
                hideChart
              />
            </details>
          </>
        ) : (
          <p role="alert">
            Không tìm thấy hồ sơ được yêu cầu. Không fallback sang DEMO.
          </p>
        )
      ) : (
        <>
          <h1>Tạo bản đọc Tân Biên nội bộ</h1>
          <InternalBirthForm />
          <p>
            <a href="?audit=chart-comparison">Mở lá số hồ sơ kiểm toán riêng</a>
          </p>
          <h2>Hồ sơ nội bộ đã lưu</h2>
          {!rows.length && <p>Chưa có hồ sơ.</p>}
          <ul>
            {rows.map((r) => (
              <li key={r.id}>
                <a href={"?id=" + r.id}>
                  {r.createdAt} · {r.snapshot.normalized.date} ·{" "}
                  {r.snapshot.normalized.hour}:
                  {String(r.snapshot.normalized.minute).padStart(2, "0")}
                </a>
                {r.frozen.customerReport?.version === "1.47.0" && <> · <a href={"?id=" + r.id + "&mode=basic&experience=1"}>Mở giao diện mới</a></>}
              </li>
            ))}
          </ul>
          <p>
            Hồ sơ được giữ tại vùng lưu riêng của máy chủ để mở lại. Chủ dự án
            có thể xóa tệp theo hướng dẫn vận hành; chưa có lịch xóa tự động cho
            khu vực này.
          </p>
        </>
      )}
    </main>
  );
}
