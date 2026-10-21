"use client";
import { customerInfo, majorStatus } from "@/lib/chart-customer-info";
import { useState, useRef, useEffect } from "react";
import ChartSheet from "./ChartSheet";
import ReadingExplorer from "./ReadingExplorer";
import type { Exploration } from "@/lib/exploration/model";
import ChartPeriods, {
  useChartPeriods,
  type ChartLayers,
} from "./ChartPeriods";
import { LayoutGrid, List, ZoomIn } from "lucide-react";
import {
  starState,
  palaceDisplayData,
  periodDisplay,
  starScope,
  recordedLayers,
  type ChartContext,
} from "@/lib/chart-presentation";
import type { ChartSnapshot } from "@/lib/tuvi-engine";
// Dần→Sửu in upstream order; display the conventional 4x4 ring.
const positions = [
  [4, 1],
  [3, 1],
  [2, 1],
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 4],
  [3, 4],
  [4, 4],
  [4, 3],
  [4, 2],
];
export default function Chart({
  snapshot,
  context = "engine",
  readingId,
  exploration,
}: {
  snapshot: ChartSnapshot;
  context?: ChartContext;
  readingId?: string;
  exploration?: Exploration;
}) {
  const periods = useChartPeriods(snapshot, readingId);
  const [exploreSelection, setExploreSelection] = useState<{
    index: number;
    nonce: number;
  } | null>(null);
  context = snapshot.chart.tanBien ? "tanbien" : context;
  return (
    <>
      <ChartPeriods state={periods} />
      {periods.ready && (
        <>
          <ChartView
            key={periods.snapshot.resultId + context}
            snapshot={periods.snapshot}
            layers={periods.layers}
            onExplore={(index) =>
              setExploreSelection({ index, nonce: Date.now() })
            }
            context={context}
            readingId={periods.savedId}
          />
          <ReadingExplorer
            key={periods.snapshot.resultId}
            snapshot={periods.snapshot}
            readingId={periods.savedId}
            initial={exploration}
            selection={exploreSelection}
          />
        </>
      )}
    </>
  );
}
function ChartView({
  onExplore,
  layers,
  snapshot,
  context,
  readingId,
}: {
  onExplore?: (index: number) => void;
  layers: ChartLayers;
  snapshot: ChartSnapshot;
  context: ChartContext;
  readingId?: string;
}) {
  const [view, setView] = useState("grid");
  const [density, setDensity] = useState("full");
  const [selected, setSelected] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (selected !== null && !onExplore) {
      detailRef.current?.focus({ preventScroll: true });
      detailRef.current?.scrollIntoView({ block: "start" });
    }
  }, [selected]);
  const a = snapshot.chart;
  const tb = a.tanBien;
  const selectedPeriod =
    tb && "selectedPeriod" in tb ? tb.selectedPeriod : undefined;
  const viewing = tb && "viewing" in tb ? tb.viewing : undefined;
  return (
    <section
      className={`card chart-card ${density === "full" ? "chart-full" : ""}`}
      ref={containerRef}
      data-chart-snapshot={snapshot.resultId}
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">LÁ SỐ · BẢN THỬ</span>
          <h2>Mười hai cung, một tổng thể</h2>
        </div>
        <div className="segmented" aria-label="Cách xem lá số">
          {[
            ["grid", LayoutGrid, "Vừa màn hình"],
            ["zoom", ZoomIn, "Phóng to"],
            ["list", List, "Danh sách"],
          ].map(([v, Icon, label]) => {
            const I = Icon as typeof List;
            return (
              <button
                key={String(v)}
                aria-pressed={view === v}
                onClick={() => setView(String(v))}
              >
                <I size={16} />
                <span>{String(label)}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="caption">
        {snapshot.profile.id === "cn-reference"
          ? "Lịch Trung Quốc tham chiếu"
          : "Lịch UTC+7 · ngày đổi 00:00"}{" "}
        · Chạm một cung để xem dữ liệu đã lưu.
      </p>
      <div
        className="segmented chart-density"
        aria-label="Lớp dữ liệu hiển thị"
      >
        <button
          aria-pressed={density === "compact"}
          onClick={() => setDensity("compact")}
        >
          Rút gọn: chính tinh
        </button>
        <button
          aria-pressed={density === "full"}
          onClick={() => setDensity("full")}
        >
          Đầy đủ: dữ liệu đã lưu
        </button>
      </div>
      {density === "full" && (
        <p className="caption">
          Phiếu cố định; chọn “Phóng to” để kéo xem trong vùng riêng. Chọn “Danh
          sách” để đọc từng cung trên điện thoại. Tứ Hóa trên phiếu là dòng
          riêng; xem sao mang hóa trong chi tiết cung.{" "}
          {viewing
            ? `Sao lưu năm ${viewing.year} nằm ở lớp riêng, không phải bản mệnh.`
            : "Chưa chọn năm xem; không có lớp sao lưu."}
        </p>
      )}
      <p className="caption" data-state-context>
        {context === "tanbien"
          ? "Trạng thái theo Tân Biên — chỉ các mục đã có bảng nguồn đối chiếu; không thay dữ liệu engine."
          : "Trạng thái theo bảng iztro — không phải bảng điều kiện của rule Tân Biên."}
      </p>
      
      {tb && (
        <details className="evidence" data-engine-trace>
          <summary>Công thức và giới hạn profile thử</summary>
          <p>{tb.limitations.join(" ")}</p>
          <p>
            Phạm vi Tứ Hóa và sao: bản mệnh. Vòng Tướng trước, sao bổ sung và
            metadata ngoài sách giữ iztro theo quyết định đã công bố. Thiên Quý
            được tính theo §8.13 và đối chiếu lại bốn ví dụ phụ lục.
          </p>
          {tb.trace.map((t) => (
            <details key={t.id}>
              <summary>
                {t.id} · {t.status}
              </summary>
              <p>{t.source}</p>
              <p>{t.note}</p>
              <pre>
                {JSON.stringify({ input: t.input, result: t.result }, null, 2)}
              </pre>
            </details>
          ))}
        </details>
      )}
      {viewing && (
        <details className="evidence" data-view-year>
          <summary>
            Năm âm xem {viewing.year} · {viewing.canChi} · {viewing.age} tuổi mụ
          </summary>
          <p>{viewing.ageConvention}</p>
          <p>
            Tiểu hạn: {viewing.annual}. Lưu đại hạn:{" "}
            {viewing.decade ?? "Chưa đến tuổi khởi đại hạn"}. Lưu nguyệt cách 1,
            trang 23; sao lưu trang 268–269. Đây chỉ là vị trí, không phải dự
            đoán.
          </p>
          {selectedPeriod && (
            <p>
              Ngày xem {selectedPeriod.date}: {selectedPeriod.reason} Lưu
              nguyệt: {selectedPeriod.month ?? "Chưa xác định"}; nhật:{" "}
              {selectedPeriod.day ?? "Chưa xác định"}; thời:{" "}
              {selectedPeriod.hour ?? "Chưa xác định"}. {selectedPeriod.source}
            </p>
          )}
          <p>
            {viewing.months
              .map((m) => `Tháng ${m.month}: ${m.branch}`)
              .join(" · ")}
          </p>
        </details>
      )}
      {view !== "list" && (
        <ChartSheet
          layers={layers}
          readingId={readingId}
          snapshot={snapshot}
          context={context}
          full={density === "full"}
          zoom={view === "zoom"}
          onSelect={(i) => {
            setSelected(i);
            onExplore?.(i);
          }}
        />
      )}
      {view === "list" && (
        <div
          className={
            view === "list"
              ? "palace-list"
              : `chart-scroll ${view === "zoom" ? "zoom" : ""}`
          }
        >
          <div className={view === "list" ? "" : "astrolabe"}>
            {a.palaces.map((p, i) => (
              <button
                key={i}
                data-palace-index={i}
                className={`palace ${selected === i ? "selected" : ""}`}
                style={
                  view === "list"
                    ? undefined
                    : { gridColumn: positions[i][1], gridRow: positions[i][0] }
                }
                onClick={() => {
                  setSelected(selected === i ? null : i);
                  onExplore?.(i);
                }}
                aria-expanded={selected === i}
              >
                <span className="palace-meta">
                  {p.heavenlyStem} {p.earthlyBranch}
                  <span>{p.decadal?.range?.[0] ?? "—"}</span>
                </span>
                <strong>
                  {p.name}
                  {p.isBodyPalace ? " · Thân" : ""}
                </strong>
                {tb?.voidRanges
                  .filter((v) => v.branches.includes(p.earthlyBranch))
                  .map((v) => (
                    <span
                      className="void-range"
                      data-void-range={v.name}
                      key={v.name}
                    >
                      {v.name}: {v.branches.join("–")}
                    </span>
                  ))}
                {palaceDisplayData(p, i)
                  .filter((g) => density === "full" || g.key === "majorStars")
                  .map((g) => (
                    <span
                      key={g.key}
                      className={
                        g.key === "majorStars" ? "stars" : "chart-secondary"
                      }
                      data-star-group={g.key}
                    >
                      {density === "full" && (
                        <span className="chart-layer-title">{g.label}</span>
                      )}
                      {g.status === "missing" ? (
                        <span>Chưa có danh sách {g.label.toLowerCase()}</span>
                      ) : g.status === "empty" ? (
                        <span>
                          {g.key === "majorStars" &&
                          tb?.completeness.majorStars === "complete"
                            ? view === "list"
                              ? "Cung này không có chính tinh."
                              : ""
                            : `Danh sách ${g.label.toLowerCase()} được ghi rỗng`}
                        </span>
                      ) : (
                        g.stars.map(({ star: s, path, scope }) => {
                          const state = starState(
                            s,
                            p.earthlyBranch,
                            snapshot,
                            context,
                          );
                          const short = state.display.startsWith(
                            "Chưa có đối chiếu",
                          )
                            ? "Chưa đối chiếu"
                            : state.display.startsWith("Chưa ghi")
                              ? "Chưa ghi trạng thái"
                              : state.display;
                          return (
                            <span
                              key={path}
                              data-star-path={path}
                              data-star-name={s.name}
                            >
                              {s.name}
                              {(g.key === "majorStars" || s.brightness) &&
                                ` (${short === "Chưa đối chiếu" ? "?" : short})`}
                              {density === "full" && s.mutagen && (
                                <span
                                  className="chart-mutagen"
                                  data-mutagen-for={path}
                                >
                                  {" "}
                                  → Hóa {s.mutagen}
                                  {tb?.states[
                                    `Hóa ${s.mutagen}@${p.earthlyBranch}`
                                  ]?.value
                                    ? ` (${tb.states[`Hóa ${s.mutagen}@${p.earthlyBranch}`]?.value})`
                                    : ""}
                                </span>
                              )}
                              {density === "full" && scope !== "bản mệnh" && (
                                <span className="caption"> · {scope}</span>
                              )}
                            </span>
                          );
                        })
                      )}
                    </span>
                  ))}
                {density === "full" && viewing && layers.annual && (
                  <span className="chart-periods" data-moving-stars>
                    <span className="chart-layer-title">
                      Lớp lưu năm {viewing.year}
                    </span>
                    {viewing.stars
                      .filter((s) => s.branch === p.earthlyBranch)
                      .map((s) => (
                        <span key={s.name} data-moving-star={s.name}>
                          {`L. ${s.name.replace(/^Lưu /, "")}`}
                        </span>
                      ))}
                    {viewing.annual === p.earthlyBranch && (
                      <span>Tiểu hạn năm xem</span>
                    )}
                  </span>
                )}
                {density === "full" &&
                  layers.decadal &&
                  tb &&
                  "decadal" in tb &&
                  tb.decadal.stars
                    .filter((s) => s.branch === p.earthlyBranch)
                    .map((s) => (
                      <span key={s.id} data-moving-star={s.id}>
                        ĐV. {s.name}
                      </span>
                    ))}
                {layers.decadePosition &&
                  tb &&
                  "decadal" in tb &&
                  tb.decadal.branch === p.earthlyBranch && (
                    <span>Cung đại vận</span>
                  )}
                {(density === "full" || view === "list") && (
                  <span className="chart-periods" data-palace-periods>
                    <span className="chart-layer-title">
                      Vòng và hạn đã lưu
                    </span>
                    {density === "full" &&
                      recordedLayers(p).map((x) => (
                        <span key={x.key} data-layer={x.key}>
                          {x.label
                            .replace("Vòng ", "")
                            .replace(" (theo năm sinh)", "")}
                          : {x.value}
                          {tb?.states[`${x.value}@${p.earthlyBranch}`]?.value
                            ? ` (${tb.states[`${x.value}@${p.earthlyBranch}`]?.value})`
                            : ""}
                        </span>
                      ))}
                    {periodDisplay(p)
                      .filter((x) => x.key === "decadal")
                      .map((x) => (
                        <span key={x.key} data-layer={x.key}>
                          {x.label}: {x.value}
                          {tb?.states[`${x.value}@${p.earthlyBranch}`]?.value
                            ? ` (${tb.states[`${x.value}@${p.earthlyBranch}`]?.value})`
                            : ""}
                        </span>
                      ))}
                  </span>
                )}
              </button>
            ))}
            {view !== "list" && (
              <div className="chart-center">
                <div className="seal">紫微</div>
                <span className="eyebrow">TỬ VI ĐẨU SỐ</span>
                <h3>LÁ SỐ TỬ VI</h3>
                <dl className="customer-center-info">
                  {customerInfo(snapshot).map((r) => (
                    <div key={r.label}>
                      <dt>{r.label}</dt>
                      <dd>
                        <strong>{r.value}</strong>
                        {r.secondary && <small>{r.secondary}</small>}
                      </dd>
                    </div>
                  ))}
                </dl>
                <small>
                  Bản thử nghiệm — một số quy ước đang được đối chiếu.
                </small>
              </div>
            )}
          </div>
        </div>
      )}
      {selected !== null && (
        <div className="evidence" ref={detailRef} tabIndex={-1}>
          <button
            onClick={() => {
              const button =
                containerRef.current?.querySelector<HTMLButtonElement>(
                  `[data-palace-index="${selected}"]`,
                );
              setSelected(null);
              button?.focus();
            }}
          >
            Đóng chi tiết cung
          </button>
          <h3>Cung {a.palaces[selected].name}</h3>
          {tb && (
            <details>
              <summary>Trạng thái các lớp đã lưu tại cung này</summary>
              <p>
                Chỉ các vị trí đã có bảng nguồn; không suy các vị trí còn lại là
                hãm.
              </p>
              {Object.entries(tb.states)
                .filter(
                  ([key, value]) =>
                    key.endsWith("@" + a.palaces[selected].earthlyBranch) &&
                    value?.value,
                )
                .map(([key, value]) => (
                  <p key={key}>
                    {key.split("@")[0]}: {value!.value} · {value!.version} ·{" "}
                    {value!.source}
                  </p>
                ))}
            </details>
          )}
          {tb?.voidRanges
            .filter((v) =>
              v.branches.includes(a.palaces[selected].earthlyBranch),
            )
            .map((v) => (
              <p key={v.name}>
                {v.name} án ngữ cặp {v.branches.join("–")}. {v.source}
              </p>
            ))}
          {(["majorStars", "minorStars", "adjectiveStars"] as const).map(
            (group, i) => (
              <div key={group}>
                <h4>{["Chính tinh", "Phụ tinh", "Tạp diệu"][i]}</h4>
                {!Array.isArray(a.palaces[selected][group]) ? (
                  <p>Không có danh sách trong snapshot.</p>
                ) : a.palaces[selected][group].length === 0 ? (
                  <p>Danh sách được ghi nhận là rỗng.</p>
                ) : (
                  <ul>
                    {a.palaces[selected][group].map((s, j) => {
                      const state = starState(
                        s,
                        a.palaces[selected].earthlyBranch,
                        snapshot,
                        context,
                      );
                      return (
                        <li key={j}>
                          {s.name} · {state.display}
                          {s.mutagen
                            ? ` · Hóa ${s.mutagen} (${starScope(s)})`
                            : ""}
                          <details>
                            <summary>Nguồn trạng thái — {s.name}</summary>
                            <p>
                              Trạng thái theo Tân Biên: {state.sourceState}.{" "}
                              {state.source}; {state.version}.
                            </p>
                            <p>
                              Trạng thái gốc iztro đã lưu: {state.raw} (
                              {state.engineVersion}). Hai bảng quy ước khác
                              nhau; không dùng bảng này thay điều kiện bảng kia.
                            </p>
                            {state.raw === "Hạn" && (
                              <p>
                                Với iztro 2.6.1, nhãn dịch “Hạn” của mã xian
                                (陷) được trình bày là “Hãm”; dữ liệu gốc giữ
                                nguyên.
                              </p>
                            )}
                          </details>
                          {(s.name === "Linh Tinh" ||
                            s.name === "Thiên Quý") && (
                            <p className="notice">
                              {tb
                                ? s.name === "Linh Tinh"
                                  ? "Linh Tinh theo Tân Biên §8.6.3: chiều đếm theo âm dương/giới tính, không theo iztro. Công thức có trong hồ sơ profile."
                                  : "Thiên Quý theo §8.13: đếm nghịch từ Văn Khúc rồi quay lại một cung. Đã đọc lại ô cố định trong bốn ví dụ272–275; không dùng chi lưu niên làm địa chi cung."
                                : `Vị trí ${s.name} theo engine hiện hành; phép an đang được đối chiếu riêng với Tân Biên, chưa đổi hoặc coi là đã thống nhất phương pháp.`}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ),
          )}
          <h4>Các vòng và hạn đã lưu</h4>
          {recordedLayers(a.palaces[selected]).map((x) => (
            <p key={x.key}>
              {x.label}: {x.value}
              {tb?.states[`${x.value}@${a.palaces[selected].earthlyBranch}`]
                ?.value
                ? ` (${tb.states[`${x.value}@${a.palaces[selected].earthlyBranch}`]?.value})`
                : ""}
            </p>
          ))}
          {periodDisplay(a.palaces[selected]).map((x) => (
            <p key={x.key}>
              {x.label}: {x.value}
              {tb?.states[`${x.value}@${a.palaces[selected].earthlyBranch}`]
                ?.value
                ? ` (${tb.states[`${x.value}@${a.palaces[selected].earthlyBranch}`]?.value})`
                : ""}
            </p>
          ))}
          <p className="caption">
            {tb
              ? "Cặp Tuần/Triệt được tính trong profile mới và ghi ở cả hai cung; không phải hai sao riêng. "
              : ""}
            Các lớp này chưa được xác nhận chuyên môn.{" "}
            {viewing
              ? `Sao lưu năm ${viewing.year} ở lớp riêng trên khung.`
              : "Chưa chọn năm xem: không có lớp sao lưu."}{" "}
            {!tb &&
              "Nhãn Tuần/Triệt tại một cung không tự xác định phạm vi án ngữ hai cung."}
          </p>
          <p>
            Nguồn tính toán: {snapshot.profile.system},{" "}
            {snapshot.versions.engine}.{" "}
            {tb
              ? "Xem công thức và quy ước bổ sung ở thông tin chung."
              : "iztro 2.6.1, theo quy ước lịch đã chọn."}
          </p>
        </div>
      )}
    </section>
  );
}
