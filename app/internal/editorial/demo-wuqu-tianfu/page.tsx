import { archivedReading } from "@/lib/internal-review/archived-reading";
import SampleNavigation from "@/components/SampleNavigation";
import current from "@/lib/internal-review/editorial/demo-wuqu-tianfu-v1.1.json";
import EditorialHashNavigation from "@/components/EditorialHashNavigation";
import TanBienReading from "@/components/TanBienReading";
import TanBienResults from "@/components/TanBienResults";
import exported from "@/exports/demo-wuqu-tianfu-review.json";
import type { ChartSnapshot } from "@/lib/tuvi-engine";
import { loadSample, samples } from "@/lib/internal-review/samples";
import { cookies } from "next/headers";
import { reviewAuthorized } from "@/lib/internal-review/auth";
import previous from "@/lib/internal-review/editorial/demo-wuqu-tianfu.json";
export const dynamic = "force-dynamic";
type Block = {
  kind: string;
  text?: string;
  rows?: string[][];
  items?: string[];
  links?: { label: string; url: string }[];
};
function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) =>
        b.kind === "table" ? (
          <div className="editorial-records" key={i}>
            {b.rows?.slice(1).map((row, j) => (
              <dl className="editorial-record" key={j}>
                {row.map((value, k) => (
                  <div key={k}>
                    <dt>{b.rows?.[0][k]}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ))}
          </div>
        ) : b.kind === "list" ? (
          <ul key={i}>
            {b.items?.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ) : b.kind === "h3" ? (
          <h3 key={i}>{b.text}</h3>
        ) : (
          <div key={i}>
            <p>{b.text}</p>
            {b.links?.map((l) => (
              <a
                className="editorial-source"
                href={l.url}
                key={l.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Mở nguồn: {l.label} ↗
              </a>
            ))}
          </div>
        ),
      )}
    </>
  );
}
export default async function EditorialPreview({
  searchParams,
}: {
  searchParams: Promise<{ v?: string; view?: string; sample?: string; readingVersion?: string }>;
}) {
  const params = await searchParams;
  const data = params.v === "1.0" ? previous : current;
  if (!reviewAuthorized((await cookies()).get("tuvi_internal")?.value))
    return (
      <main className="reading-shell">
        <h1>Cần quyền kiểm tra nội bộ</h1>
        <p>Bản biên soạn này chỉ dành cho chủ dự án kiểm tra.</p>
        <a href="/internal">Đăng nhập nội bộ</a>
      </main>
    );
  if (params.view === "rules" || params.view === "reading") {
    const archive = params.readingVersion ? await archivedReading(params.readingVersion, params.sample || "") : null;
    if(params.readingVersion && (!archive || params.view !== "reading")) return <main>Không tìm thấy bản đọc lịch sử đã chọn; không tính lại hoặc thay bằng bản hiện hành.</main>;
    const selected = params.sample ? await loadSample(params.sample) : null;
    return (
      <main className="reading-shell editorial-preview">
        <a href="/internal/editorial/demo-wuqu-tianfu">
          ← Bài biên soạn cố định 1.1
        </a>
        <nav aria-label="Chế độ đọc">
          <a
            href={`?view=reading&sample=${encodeURIComponent(params.sample || "")}${archive ? `&readingVersion=${params.readingVersion}` : ""}`}
          >
            {archive ? `Bản đã lưu ${params.readingVersion}` : "Bài từ rule"}
          </a>{" "}
          ·{" "}
          <a
            href={`?view=rules&sample=${encodeURIComponent(params.sample || "")}`}
          >
            {archive ? "Thực thi catalog hiện hành (không phải bản lịch sử)" : "Chi tiết thực thi"}
          </a>
        </nav>
        <SampleNavigation currentLabel={selected?.sample.name || "DEMO Vũ–Phủ"}>
          <input type="hidden" name="view" value={params.view} />
          {archive && <input type="hidden" name="readingVersion" value={params.readingVersion} />}
          <label>
            Snapshot kiểm tra
            <select name="sample" defaultValue={params.sample || ""}>
              <option value="">DEMO Vũ–Phủ — snapshot đã lưu</option>
              {samples.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="primary">
            Đối chiếu rule
          </button>
        </SampleNavigation>
        {params.sample && !selected ? (
          <p>Không tìm thấy mẫu; không fallback sang DEMO.</p>
        ) : (
          <>
            <p>
              {selected
                ? `${selected.sample.kind === "synthetic" ? "Fixture kỹ thuật, không phải lá số hợp lệ" : "Engine tính từ đầu vào giả lập"}: ${selected.sample.name}`
                : "Dùng bản xuất từ snapshot DEMO đã lưu, không tính lại lá số."}
            </p>
            {archive && <p>Bản đọc lịch sử {params.readingVersion} — nội dung và điều kiện đã lưu, không chạy catalog hiện hành.</p>}
            {params.view === "reading" ? (
              <TanBienReading
                frozen={archive?.frozen}
                snapshot={
                  archive?.snapshot || selected?.report.snapshot ||
                  (exported.snapshot as unknown as ChartSnapshot)
                }
              />
            ) : (
              <TanBienResults
                snapshot={
                  selected?.report.snapshot ||
                  (exported.snapshot as unknown as ChartSnapshot)
                }
              />
            )}
          </>
        )}
      </main>
    );
  }
  return (
    <main className="reading-shell editorial-preview">
      <nav aria-label="Phiên bản và đối chiếu">
        <a href="?v=1.0">Bản 1.0 đã lưu</a> · <a href="?v=1.1">Bản đọc 1.1</a> ·{" "}
        <a href="?view=reading">Bài từ rule</a> ·{" "}
        <a href="?view=rules">Chi tiết thực thi</a>
      </nav>
      <a className="editorial-back" href="/internal">
        ← Trở lại kiểm tra nội bộ
      </a>
      <header>
        <span className="badge">Bản nháp nội bộ — chưa kiểm duyệt</span>
        <h1>Tổng quan Vũ Khúc–Thiên Phủ</h1>
        <p className="editorial-lead">
          Bản biên soạn riêng cho DEMO · phiên bản{" "}
          {params.v === "1.0" ? "1.0" : "1.1"}
        </p>
      </header>
      <aside className="alert">
        <p>
          Bản đọc dự thảo theo phương pháp truyền thống, biên soạn riêng cho
          DEMO dùng dữ liệu giả lập. Chưa được chuyên gia duyệt; không phải kết
          luận khoa học hay dự đoán chắc chắn.
        </p>
      </aside>
      <details className="evidence">
        <summary>Phiên bản và dữ liệu dùng cho bản này</summary>
        <dl className="editorial-record">
          <dt>Phạm vi</dt>
          <dd>
            Bài cố định không được sinh toàn bộ bằng evaluator. Mức kiểm tra
            nguồn là thông tin trong tài liệu chủ dự án; chưa đọc lại các PDF
            gốc trong lượt này.
          </dd>
          <dt>Phiên bản biên soạn</dt>
          <dd>{data.version}</dd>
          <dt>Edition DEMO gốc</dt>
          <dd>{data.editionId}</dd>
          <dt>Result ID của snapshot gốc</dt>
          <dd>{data.snapshotResultId}</dd>
          <dt>SHA256 snapshot</dt>
          <dd>{data.snapshotSha256}</dd>
          <dt>Tài liệu</dt>
          <dd>{data.sourceFile}</dd>
        </dl>
        <p>
          Giữ nguyên snapshot, edition và bản đọc cũ. Không chạy
          engine/evaluator khi mở trang. Các mã F/R/E là mã tham chiếu trong tài
          liệu, không phải ID rule đang được thực thi.
        </p>
      </details>
      <nav className="editorial-toc" aria-label="Mục lục Tổng quan">
        {data.articles.map((a, i) => (
          <a key={a.title} href={`#reading-${i}`}>
            {a.title}
          </a>
        ))}
      </nav>
      {data.articles.map((article, i) => (
        <section
          className="card editorial-article"
          id={`reading-${i}`}
          key={article.title}
        >
          <h2>{article.title}</h2>
          {article.paragraphs.map((p) => {
            const records = data.records.filter((r) =>
              r.codes.some((c) => p.references.includes(c)),
            );
            const sourceIds = new Set(
              records.flatMap(
                (r) =>
                  r.cells.join(" ").match(/\b(?:S[123]|W[12]|D1)\b/g) || [],
              ),
            );
            const sources = data.sources.filter(
              (s) =>
                s.text &&
                [...sourceIds].some((id) => s.text!.startsWith(id + ".")),
            );
            return (
              <div className="editorial-paragraph" id={p.id} key={p.id}>
                {"selfReflection" in p && Boolean(p.selfReflection) && (
                  <span className="badge">Gợi ý tự đối chiếu</span>
                )}
                <p>{p.text}</p>
                <details className="evidence">
                  <summary>
                    Xem căn cứ{" "}
                    <span className="sr-only">
                      cho đoạn {p.id.replace("paragraph-", "")}
                    </span>
                  </summary>
                  {"editorialNotes" in p &&
                    (p.editorialNotes as string[]).map((note, i) => (
                      <p key={i}>
                        <strong>Ghi chú biên tập:</strong> {note}
                      </p>
                    ))}
                  <p className="muted">
                    {p.references.length
                      ? `Tham chiếu tài liệu: ${p.references.join(", ")}`
                      : "Giới hạn chung do người biên soạn trình bày; không phải nhận định từ rule."}
                  </p>
                  {records.map((r, j) => (
                    <dl className="editorial-record" key={j}>
                      <dt>{r.cells[0]}</dt>
                      <dd>{r.cells[1]}</dd>
                      <dt>Nguồn / nội dung sử dụng</dt>
                      <dd>{r.cells[2]}</dd>
                      <dt>Điều kiện và giới hạn</dt>
                      <dd>{r.cells[3]}</dd>
                    </dl>
                  ))}
                  {p.references.some((c) => c.startsWith("E")) && (
                    <p>
                      <strong>Gợi mở biên tập:</strong> câu hỏi tự quan sát
                      không phải dự đoán hoặc quy tắc lấy từ sách.
                    </p>
                  )}
                  {p.references.some((c) => ["R02", "K01"].includes(c)) && (
                    <p>
                      <strong>Khác chiều:</strong> tài liệu ghi S1 tr.67 và W1
                      có cách đánh giá khác về sao Văn đi cùng Vũ Khúc. Bản này
                      chọn S1; không hòa giải thành một kết luận chung.
                    </p>
                  )}
                  {p.references.some((c) =>
                    ["H01", "R03", "R06", "R07", "F06"].includes(c),
                  ) && (
                    <p>
                      <strong>Chưa xác định:</strong> vị trí Tuần/Triệt trong dữ
                      liệu chưa đặc tả đầy đủ phạm vi án ngữ; không dùng để kết
                      luận thuận/nghịch.
                    </p>
                  )}
                  {sources.length > 0 && (
                    <details>
                      <summary>
                        Nguồn và mức kiểm tra được tài liệu ghi nhận
                      </summary>
                      <Blocks blocks={sources} />
                    </details>
                  )}
                  <p>
                    <a href="#source-differences">
                      Sai khác và điều kiện chưa giải quyết
                    </a>{" "}
                    ·{" "}
                    <a href="#editorial-boundaries">
                      Ranh giới sử dụng bản thảo
                    </a>
                  </p>
                </details>
              </div>
            );
          })}
        </section>
      ))}
      <p className="editorial-closing">{data.intro.at(-1)?.text}</p>
      <section className="card">
        <h2>Hồ sơ mở rộng</h2>
        <details className="evidence">
          <summary>Hồ sơ điều kiện đầy đủ — phần 3</summary>
          <Blocks blocks={data.dossiers} />
        </details>
        <details className="evidence" id="source-differences">
          <summary>Sai khác và phần chưa thể thành rule — phần 4</summary>
          <Blocks blocks={data.differences} />
        </details>
        <details className="evidence" id="editorial-boundaries">
          <summary>Ranh giới sử dụng bản thảo — phần 5</summary>
          <p>
            Đây là nội dung tài liệu để người kiểm tra đọc; không phải cấu hình
            hay quy tắc tự động đang chạy.
          </p>
          <Blocks blocks={data.boundaries} />
        </details>
        <details className="evidence" id="source-list">
          <summary>Danh mục nguồn — phần 6</summary>
          <Blocks blocks={data.sources} />
          <p>Nguyễn Phát Lộc — Tử Vi Tổng Hợp, bản PDF 442 trang do chủ dự án cung cấp. SHA-256: 82f242d44a1173c7c9963b88adde529f57c20bbbb3b6267159e86f3204378a37. Phương pháp Tuần–Triệt tại Điền/Quan: PDF và trang in 75, 91, 96, 219–220, 260–261, 306; bản phương pháp direct-void-palaces-1.0.0. Không dùng lời Việt Viêm Tử đang được phản biện làm kết luận của Nguyễn Phát Lộc. Câu “bớt sáng, có thể trở thành tốt” ở 219 được giữ là bất nhất; nhánh triển khai dựa trên 306, không sửa nguyên văn. Không phát hành mốc tuổi hoặc dự báo biến cố từ đoạn 260.</p>
        </details>
      </section>
      <EditorialHashNavigation />
    </main>
  );
}
