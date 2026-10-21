"use client";
import { sheetPdf } from "@/lib/chart-pdf";
import {
  customerInfo,
  majorStatus,
  CUSTOMER_INFO_VERSION,
} from "@/lib/chart-customer-info";
import { sheetColumns, referenceSide } from "@/lib/chart-columns";
import { entryProvenance, sheetDisplayName } from "@/lib/chart-provenance";
import type { ChartLayers } from "./ChartPeriods";
import { useEffect, useRef, useState } from "react";
import type { ChartSnapshot } from "@/lib/tuvi-engine";
import type { ChartContext } from "@/lib/chart-presentation";
import { chartColor, COLOR_LEGEND } from "@/lib/chart-colors";
import {
  sheetPalaces,
  sheetVoids,
  sheetRays,
  SHEET_WIDTH,
  SHEET_HEIGHT,
  SHEET_VERSION,
} from "@/lib/chart-sheet";
function wrap(text: string, limit: number) {
  const lines: string[] = [];
  for (const word of text
    .split(" ")
    .flatMap((word) =>
      word.length > limit
        ? word.match(new RegExp(`.{1,${limit}}`, "gu")) || []
        : [word],
    )) {
    const last = lines.length - 1;
    if (last >= 0 && lines[last].length + word.length + 1 <= limit)
      lines[last] += " " + word;
    else lines.push(word);
  }
  return lines;
}
function Text({
  text,
  x,
  y,
  size = 18,
  bold = false,
  anchor = "start",
  limit = 24,
  ...props
}: {
  text: string;
  x: number;
  y: number;
  size?: number;
  bold?: boolean;
  anchor?: "start" | "middle" | "end";
  limit?: number;
  [k: string]: unknown;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={bold ? 700 : 400}
      textAnchor={anchor}
      {...props}
    >
      {wrap(text, limit).map((s, i) => (
        <tspan key={i} x={x} dy={i ? size * 1.2 : 0}>
          {s}
        </tspan>
      ))}
    </text>
  );
}
export default function ChartSheet({
  snapshot,
  layers = { annual: false, decadal: false, decadePosition: false },
  context,
  full,
  zoom,
  onSelect,
  readingId,
  birthTimeLabel,
  compactControls = false,
  onToggleZoom,
}: {
  snapshot: ChartSnapshot;
  layers?: ChartLayers;
  readingId?: string;
  birthTimeLabel?: string;
  compactControls?: boolean;
  onToggleZoom?: () => void;
  context: ChartContext;
  full: boolean;
  zoom: boolean;
  onSelect: (index: number) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    host = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const { annual, decadal, decadePosition, annualPosition = annual } = layers;
  const [extended, setExtended] = useState(false);

  const active = hovered || focused;
  const rays = active ? sheetRays(snapshot, active) : [];
  const [width, setWidth] = useState(900),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (!host.current) return;
    const ro = new ResizeObserver((e) => setWidth(e[0].contentRect.width));
    ro.observe(host.current);
    return () => ro.disconnect();
  }, []);
  const a = snapshot.chart,
    tb = a.tanBien,
    n = snapshot.normalized,
    viewing = tb && "viewing" in tb ? tb.viewing : undefined;
  const decade = tb && "decadal" in tb ? tb.decadal : undefined;
  const palaces = sheetPalaces(
      snapshot,
      context,
      full,
      annual,
      extended,
      decadal,
      annualPosition,
    ),
    voids = full ? sheetVoids(snapshot) : [];
  const scale = zoom ? 1 : Math.min(1, Math.max(1, width) / SHEET_WIDTH);
  const exportState = useRef("");
  exportState.current = JSON.stringify([
    snapshot.resultId,
    layers,
    full,
    extended,
  ]);
  useEffect(
    () => () => {
      exportState.current = "unmounted";
    },
    [],
  );
  async function serialize() {
    const expected = exportState.current;
    await document.fonts.ready;
    if (!ref.current) throw Error("Chưa có phiếu");
    for (const text of ref.current.querySelectorAll("[data-star-name]")) {
      if (Number(text.getAttribute("font-size")) < 14)
        throw Error("DENSE_SHEET");
    }
    const clone = ref.current.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", String(SHEET_WIDTH));
    clone.setAttribute("height", String(SHEET_HEIGHT));
    clone.querySelectorAll("[role=button]").forEach((e) => {
      e.removeAttribute("role");
      e.removeAttribute("tabindex");
    });
    // Embed the supplied asset so SVG-to-canvas and print do not depend on external loads.
    for (const image of clone.querySelectorAll("image[data-drum]")) {
      const response = await fetch("/images/trongdong.webp");
      if (!response.ok) throw Error("BACKGROUND_LOAD_FAILED");
      const blob = await response.blob();
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      const loaded = new Image();
      loaded.src = data;
      await loaded.decode();
      image.setAttribute("href", data);
    }
    // Hover/focus guides are transient UI, not part of the exported chart.
    clone.querySelectorAll("[data-projection-rays]").forEach((e) => e.remove());
    if (expected !== exportState.current)
      throw Error("VIEW_CHANGED_DURING_EXPORT");
    return new XMLSerializer().serializeToString(clone);
  }
  async function download(format: "png" | "pdf" = "png") {
    setBusy(true);
    setError("");
    let url = "";
    const expected = exportState.current;
    try {
      url = URL.createObjectURL(
        new Blob([await serialize()], { type: "image/svg+xml;charset=utf-8" }),
      );
      const img = new Image();
      img.src = url;
      await img.decode();
      if (expected !== exportState.current)
        throw Error("VIEW_CHANGED_DURING_EXPORT");
      const canvas = document.createElement("canvas");
      canvas.width = 2400;
      canvas.height = 3520;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw Error("Không tạo được ảnh");
      ctx.drawImage(img, 0, 0, 2400, 3520);
      const raster = await new Promise<Blob>((res, rej) =>
        canvas.toBlob(
          (b) => (b ? res(b) : rej(Error("Không xuất được ảnh"))),
          format === "pdf" ? "image/jpeg" : "image/png",
          0.98,
        ),
      );
      const blob =
        format === "pdf"
          ? new Blob(
              [
                sheetPdf(new Uint8Array(await raster.arrayBuffer()))
                  .buffer as ArrayBuffer,
              ],
              { type: "application/pdf" },
            )
          : raster;
      if (expected !== exportState.current)
        throw Error("VIEW_CHANGED_DURING_EXPORT");
      const file = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = file;
      link.download = `la-so-${snapshot.resultId.slice(0, 12)}-${full ? "day-du" : "rut-gon"}${full && (annual || annualPosition || decadal || decadePosition) ? `-nam-${viewing?.year}` : ""}${full && decadal ? `-dv-${decade?.range?.join("-")}` : ""}.${format}`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(file), 1000);
    } catch {
      setError(
        "Chưa xuất được phiếu: kiểm tra mật độ chữ của phiếu hoặc thử lại.",
      );
    } finally {
      if (url) URL.revokeObjectURL(url);
      setBusy(false);
    }
  }
  async function print() {
    setBusy(true);
    setError("");
    const expected = exportState.current;
    try {
      const svg = await serialize();
      const frame = document.createElement("iframe");
      frame.title = "Phiếu in A4";
      frame.style.cssText =
        "position:fixed;width:1px;height:1px;left:-9999px;border:0";
      document.body.append(frame);
      const doc = frame.contentDocument!;
      doc.open();
      doc.write(
        `<!doctype html><html lang="vi"><head><title>Phiếu lá số</title><style>@page{size:A4 portrait;margin:8mm}html,body{margin:0;padding:0}svg{display:block;width:190mm;height:auto;max-height:280mm;margin:auto}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>${svg}</body></html>`,
      );
      doc.close();
      await doc.fonts.ready;
      if (expected !== exportState.current) {
        frame.remove();
        throw Error("VIEW_CHANGED_DURING_EXPORT");
      }
      frame.contentWindow!.focus();
      frame.contentWindow!.addEventListener(
        "afterprint",
        () => frame.remove(),
        { once: true },
      );
      frame.contentWindow!.print();
    } catch {
      setError(
        "Chưa mở được bản in: kiểm tra mật độ chữ của phiếu hoặc thử lại.",
      );
    } finally {
      setBusy(false);
    }
  }
  let infoY = 590;
  const info = [
    ...customerInfo(snapshot).map(row=>birthTimeLabel && row.label==='Giờ sinh' ? {...row,value:birthTimeLabel,secondary:undefined}:row),
    ...(full && decadal && decade?.range
      ? [
          {
            label: "Đại vận",
            value: `${decade.range.join("–")} tuổi — ${decade.palace}`,
            secondary: `${decade.stem} ${decade.branch}`,
          },
        ]
      : []),
  ].map((row) => {
    const y = infoY;
    const lines = wrap(row.value, 21).length;
    infoY +=
      Math.max(1, lines) * 23 +
      (row.secondary ? wrap(row.secondary, 33).length * 19 : 0) +
      13;
    return { ...row, y, secondaryY: y + lines * 23 };
  });
  return (
    <div className="sheet-block">
      <div className={`sheet-actions${compactControls ? " sheet-actions-compact" : ""}`} >
        {onToggleZoom && <button type="button" aria-pressed={zoom} onClick={onToggleZoom}>{zoom?"Thu gọn":"Phóng to"}</button>}
        <button aria-label="Tải PNG 2400px" onClick={() => download("png")} disabled={busy}>
          {compactControls?"Tải PNG":"Tải PNG 2400px"}
        </button>
        <button aria-label="Tải PDF A4" onClick={() => download("pdf")} disabled={busy}>
          {compactControls?"Tải PDF":"Tải PDF A4"}
        </button>
        {!compactControls && <><button onClick={print} disabled={busy}>
          In / lưu PDF A4
        </button>
        <span>
          {busy ? "Đang chuẩn bị phiếu…" : "Bản xuất chỉ gồm phiếu đang xem."}
        </span></>}
        {compactControls && busy && <span role="status">Đang chuẩn bị lá số…</span>}
      </div>
      {tb && (
        <>
          <label className="caption">
            <input
              type="checkbox"
              checked={extended}
              onChange={(e) => setExtended(e.target.checked)}
            />{" "}
            Hiện lớp bổ sung iztro (ngoài danh mục Tân Biên đã đặc tả)
          </label>
          
        </>
      )}
      <details className="caption">
        <summary>Phạm vi lớp năm xem và màu sắc</summary>
        <p>
          Sao lưu năm: 9 sao theo can chi năm xem (Tân Biên tr.268–269), không
          an từ cung tiểu hạn. Dấu tiểu hạn/tháng đi kèm là dữ liệu thời hạn
          riêng. Đại vận: khoảng tuổi đã lưu theo Tân Biên tr.20–21 §10.1; 10
          sao và Tứ Hóa theo can chi cung gốc, quy ước bổ sung iztro 2.6.1
          (getHoroscopeStar/decadalList), không phải toàn bộ phép Tân Biên. Lưu
          đại hạn từng năm §10.2 là phép khác; không dùng vị trí đó để an bộ sao
          đại vận. Không hỗ trợ các vòng đại vận khác. Tứ Hóa gắn với đường dẫn
          sao bản mệnh được hóa; không sửa hóa bản mệnh.
        </p>
        <p>
          <a
            href="https://iztro.com/learn/horoscope"
            target="_blank"
            rel="noreferrer"
          >
            Nguồn bổ sung: iztro — phân biệt đại vận, tiểu hạn và lưu niên
          </a>
          . Phiên bản bộ sao: {decade?.version || "chưa có trong hồ sơ"}. Các
          mâu thuẫn ví dụ lưu đại hạn tr.21–22 không được dùng làm đầu vào bộ
          sao đại vận này.
        </p>
        <p>
          Hai cột theo ảnh Kim Thoa: nhóm trái/phải theo mẫu, không phải kết
          luận tốt/xấu tuyệt đối. Sao chưa đối chiếu nằm cuối cột trái; thông
          tin nguồn nằm ở mục Nguồn sao, độc lập với cách chia cột và màu. Chính
          tinh giữ phía trên. Sao lưu giữ nhãn riêng.
        </p>
        <p>
          Màu chữ tham khảo AItuvi, điều chỉnh sắc độ để dễ đọc; chỉ là quy ước
          trình bày, chưa phải bảng ngũ hành Tân Biên đã xác minh. Tên chưa đối
          chiếu màu giữ trung tính. Không ảnh hưởng phép an hoặc bài đọc.
        </p>
      </details>
      <p className="caption" data-ray-description aria-live="polite">
        {rays.length === 3
          ? `Từ ${snapshot.chart.palaces.find((p) => p.earthlyBranch === active)?.name} (${active}): ${rays.map((r) => `${r.relation} ${r.label}`).join("; ")}.`
          : "Rê chuột hoặc dùng Tab tới một cung để xem hai đường tam hợp và một đường đối cung."}{" "}
        Kéo ngang để đọc đủ phiếu trên màn hình nhỏ. Đây là đường đối chiếu vị
        trí, không phải kết luận luận giải.
      </p>
      {error && <p role="alert">{error}</p>}
      <div ref={host} className="sheet-viewport">
        <div
          style={{ width: SHEET_WIDTH * scale, height: SHEET_HEIGHT * scale }}
        >
          <svg
            ref={ref}
            data-chart-sheet
            data-sheet-version={SHEET_VERSION}
            data-snapshot={snapshot.resultId}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${SHEET_WIDTH} ${SHEET_HEIGHT}`}
            width={SHEET_WIDTH * scale}
            height={SHEET_HEIGHT * scale}
            fontFamily="Arial, sans-serif"
            fill="#282624"
          >
            <rect width="1200" height="1760" fill="#fffdf5" />
            {
              <image
                data-drum
                href="/images/trongdong.webp"
                x="0"
                y="220"
                width="1200"
                height="1200"
                opacity="0.20"
                pointerEvents="none"
              />
            }
            <g data-projection-rays pointerEvents="none" aria-hidden="true">
              {rays.map((r) => (
                <line
                  key={r.branch}
                  x1={r.from.x}
                  y1={r.from.y}
                  x2={r.to.x}
                  y2={r.to.y}
                  stroke={r.relation === "đối cung" ? "#B4232D" : "#615344"}
                  strokeWidth="1.5"
                  opacity="0.55"
                  data-ray-target={r.branch}
                  data-ray-relation={r.relation}
                />
              ))}
            </g>
            {palaces.map((c) => {
              if (!c.position) return null;
              const [col, row] = c.position,
                x = col * 300,
                y = row * 410;
              const halves = sheetColumns(c.entries);
              return (
                <g
                  key={c.index}
                  role="button"
                  tabIndex={0}
                  aria-label={`Cung ${c.p.name} tại ${c.p.earthlyBranch}`}
                  data-palace-index={c.index}
                  onMouseEnter={() => setHovered(c.p.earthlyBranch)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setFocused(c.p.earthlyBranch)}
                  onBlur={() => setFocused(null)}
                  onClick={() => onSelect(c.index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(c.index);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={x}
                    y={y}
                    width="300"
                    height="410"
                    fill="transparent"
                    stroke="#cfc7bf"
                  />
                  <Text
                    text={`${c.p.heavenlyStem} ${c.p.earthlyBranch}`}
                    x={x + 12}
                    y={y + 36}
                    size={15}
                  />
                  <Text
                    text={String(c.p.decadal?.range?.[0] ?? "—")}
                    x={x + 288}
                    y={y + 36}
                    size={17}
                    anchor="end"
                    bold
                  />
                  <Text
                    text={c.p.name.toLocaleUpperCase("vi")}
                    x={x + 150}
                    y={y + 62}
                    size={20}
                    anchor="middle"
                    bold
                    fill="#B4232D"
                  />
                  {c.p.isBodyPalace && (
                    <g>
                      <rect
                        x={x + 230}
                        y={y + 46}
                        width="54"
                        height="22"
                        rx="2"
                        fill="#B4232D"
                      />
                      <Text
                        text="Thân"
                        x={x + 257}
                        y={y + 62}
                        size={15}
                        anchor="middle"
                        fill="white"
                        bold
                      />
                    </g>
                  )}
                  {c.majors.map((s, j) => (
                    <Text
                      key={s.paths[0]}
                      text={s.label}
                      x={x + 150}
                      y={y + 98 + j * 26}
                      size={22}
                      anchor="middle"
                      bold
                      data-sheet-paths={s.paths.join("|")}
                      data-star-name={s.name}
                      fill={chartColor(sheetDisplayName(snapshot, s.name))}
                    />
                  ))}
                  {halves.map((entries, column) => {
                    const count = entries.reduce(
                      (n, s) => n + wrap(s.label, 17).length,
                      0,
                    );
                    const start = c.majors.length > 1 ? 151 : 128;
                    const size = Math.min(
                      16,
                      (350 - start) / Math.max(1, count) / 1.05,
                    );
                    let cursor = y + start;
                    return entries.map((s) => {
                      const lines = wrap(s.label, 17);
                      const yy = cursor;
                      cursor += lines.length * size * 1.05;
                      return (
                        <Text
                          key={s.paths[0]}
                          text={s.label}
                          x={x + 12 + column * 145}
                          y={yy}
                          size={size}
                          limit={17}
                          data-sheet-paths={s.paths.join("|")}
                          data-star-name={s.name}
                          data-mutagen-for={s.parent}
                          data-source-layer={entryProvenance(snapshot, s).layer}
                          data-scope={
                            s.kind === "decadal"
                              ? "decadal"
                              : s.kind === "moving"
                                ? "year"
                                : "origin"
                          }
                          data-column={column === 0 ? "left" : "right"}
                          data-column-classification={referenceSide(s.name)}
                          fill={chartColor(sheetDisplayName(snapshot, s.name))}
                        />
                      );
                    });
                  })}
                  {c.missing.map((s, j) => (
                    <Text
                      key={s}
                      text={s}
                      x={x + 12}
                      y={y + 330 + j * 17}
                      size={13}
                    />
                  ))}
                  <Text
                    text={c.foot}
                    x={x + 150}
                    y={y + 378}
                    size={17}
                    anchor="middle"
                    bold
                    fill={chartColor(c.foot)}
                    data-sheet-paths={
                      full ? `chart.palaces.${c.index}.changsheng12` : undefined
                    }
                  />
                  {c.months && (
                    <Text
                      text={c.months}
                      x={x + 288}
                      y={y + 396}
                      size={13}
                      anchor="end"
                    />
                  )}
                  {c.annual && (
                    <Text
                      text="Tiểu hạn năm xem"
                      x={x + 12}
                      y={y + 396}
                      size={12}
                    />
                  )}
                  {full &&
                    decadePosition &&
                    decade?.branch === c.p.earthlyBranch && (
                      <Text
                        text="Cung đại vận"
                        x={x + 12}
                        y={y + 358}
                        size={13}
                        fill="#B4232D"
                        bold
                        data-sheet-paths="chart.tanBien.decadal.branch"
                      />
                    )}
                </g>
              );
            })}
            <rect
              x="300"
              y="410"
              width="600"
              height="820"
              fill="transparent"
              stroke="#cfc7bf"
            />
            <Text
              text="TỬ VI ĐẨU SỐ"
              x={600}
              y={476}
              size={18}
              anchor="middle"
              fill="#B4232D"
              bold
            />
            <Text
              text="LÁ SỐ TỬ VI"
              x={600}
              y={531}
              size={38}
              anchor="middle"
              fill="#B4232D"
              bold
            />
            <line x1="430" x2="770" y1="557" y2="557" stroke="#B4232D" />
            {info.map(({ label, value, secondary, y, secondaryY }) => (
              <g key={label} data-customer-info={label}>
                <Text text={label} x={336} y={y} size={17} />
                <Text text={value} x={520} y={y} size={18} bold limit={21} />
                {secondary && (
                  <Text
                    text={secondary}
                    x={520}
                    y={secondaryY}
                    size={15}
                    limit={33}
                  />
                )}
              </g>
            ))}
            <Text text="TINHLUAN.COM" x={600} y={1190} size={24} anchor="middle" bold fill="#8b211b"/>
            {voids.map((v) => (
              <g
                key={v.branches.join("-")}
                data-void-pair={v.branches.join("|")}
                data-sheet-paths={v.paths.join("|")}
              >
                <title>{`${v.label}: ${v.branches.join(" - ")}`}</title>
                <rect
                  x={v.x - 64}
                  y={v.y - 12}
                  width="128"
                  height="24"
                  fill="#202020"
                />
                <Text
                  text={v.label}
                  x={v.x}
                  y={v.y + 6}
                  size={17}
                  anchor="middle"
                  fill="white"
                  bold
                />
              </g>
            ))}
            <Text
              text="M: Miếu · V: Vượng · Đ: Đắc · B: Bình hòa · H: Hãm · L: Lợi · Bt: Bất"
              x={600}
              y={1666}
              size={18}
              anchor="middle"
              limit={100}
            />
            <Text
              text="Không có ký hiệu trạng thái không đồng nghĩa bình hòa."
              x={600}
              y={1692}
              size={15}
              anchor="middle"
              limit={120}
            />
            <g
              data-color-legend
              aria-label="Chú thích màu tham khảo: Kim, Mộc, Thủy, Hỏa, Thổ"
            >
              <Text text="Màu tham khảo:" x={294} y={1720} size={15} />
              {COLOR_LEGEND.map(([label, color], index) => (
                <g key={label}>
                  <rect
                    x={430 + index * 98}
                    y={1705}
                    width={18}
                    height={18}
                    fill={color}
                  />
                  <Text text={label} x={454 + index * 98} y={1720} size={16} />
                </g>
              ))}
            </g>
            <Text
              text={`${full && (annual || decadal) ? "L.: Sao lưu năm · ĐV.: Sao lưu đại vận | " : ""}${full ? "Bản mệnh" : "Rút gọn: chính tinh"}${extended ? " · gồm lớp bổ sung" : ""}${full && viewing && (annual || annualPosition || decadal || decadePosition) ? ` · Năm ${viewing.year}` : ""}`}
              x={600}
              y={1744}
              size={12}
              anchor="middle"
              limit={150}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
