"use client";
import { useEffect, useRef, useState } from "react";
import type { ChartSnapshot } from "@/lib/tuvi-engine";
import { birthForYear, currentVietnameseYear } from "@/lib/chart-year";
export type ChartLayers = {
  annual: boolean;
  annualPosition?: boolean;
  decadal: boolean;
  decadePosition: boolean;
};
export const natalLayers = (): ChartLayers => ({
  annual: false,
  annualPosition: false,
  decadal: false,
  decadePosition: false,
});
export function useChartPeriods(initial: ChartSnapshot, readingId?: string, defaultCurrentYear = true) {
  const [snapshot, setSnapshot] = useState(initial),
    [layers, setLayers] = useState(natalLayers),
    [year, setYear] = useState(String(initial.normalized.viewYear ?? "")),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [savedId, setSavedId] = useState(readingId);
  const sequence = useRef(0),
    controller = useRef<AbortController | null>(null);
  useEffect(() => {
    sequence.current++;
    controller.current?.abort();
    setSnapshot(initial);
    setYear(String(initial.normalized.viewYear ?? ""));
    setLayers(natalLayers());
    setBusy(false);
    setError("");
    setSavedId(readingId);
    if(defaultCurrentYear && !initial.normalized.viewYear && initial.profile.id === 'tanbien-vn-trial-v2'){
      const current=String(currentVietnameseYear());
      setYear(current);
      void apply(current, initial, false);
    }
  }, [initial.resultId, readingId, defaultCurrentYear]);
  useEffect(() => () => controller.current?.abort(), []);
  const dirty = year !== String(snapshot.normalized.viewYear ?? "");
  function changeYear(value: string) {
    sequence.current++;
    controller.current?.abort();
    setBusy(false);
    setError("");
    setYear(value);
  }
  async function apply(requestedYear=year, source=snapshot, persist=true) {
    const birth = birthForYear(source.normalized, requestedYear);
    const persistReading = !!readingId && persist;
    if (!birth) {
      setError(
        "Chọn năm hợp lệ từ năm sinh đến 2050 (phạm vi lịch 1976–2050).",
      );
      return;
    }
    const request = ++sequence.current;
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        persistReading ? "/api/internal-readings" : "/api/chart",
        {
          method: "POST",
          signal: abort.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            persistReading
              ? {
                  id: crypto.randomUUID(),
                  parentId: savedId || readingId,
                  birth,
                }
              : birth,
          ),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw Error(
          typeof data.error === "string"
            ? data.error
            : "Chưa tính được năm xem.",
        );
      if (request !== sequence.current) return;
      const next = persistReading ? data.snapshot : data;
      if (!next?.resultId || next.normalized.viewYear !== Number(requestedYear))
        throw Error("Kết quả không khớp năm yêu cầu.");
      setSnapshot(next);
      if(persistReading) setSavedId(data.id);
      setBusy(false);
    } catch (e) {
      if (request !== sequence.current) return;
      setError(e instanceof Error ? e.message : "Chưa tính được năm xem.");
      setBusy(false);
    }
  }
  return {
    snapshot,
    layers,
    setLayers,
    year,
    changeYear,
    busy,
    error,
    apply,
    savedId,
    ready: !busy && !dirty && !error,
  };
}
export default function ChartPeriods({
  state,
}: {
  state: ReturnType<typeof useChartPeriods>;
}) {
  const {
    snapshot,
    layers,
    setLayers,
    year,
    changeYear,
    busy,
    error,
    apply,
    ready,
    savedId,
  } = state;
  const tb = snapshot.chart.tanBien,
    viewing = tb && "viewing" in tb ? tb.viewing : undefined,
    decade = tb && "decadal" in tb ? tb.decadal : undefined;
  if (snapshot.profile.id !== "tanbien-vn-trial-v2") return null;
  return (
    <div className="chart-period-controls" aria-busy={busy}>
      <form
        className="sheet-year"
        onSubmit={(e) => {
          e.preventDefault();
          void apply();
        }}
      >
        <label>
          <span title="Năm âm lịch đang xem">Năm xem</span>{" "}
          <input
            aria-label="Năm xem của lá số"
            type="number"
            min={Math.max(1976, snapshot.chart.lunar.lunarYear)}
            max="2050"
            value={year}
            onChange={(e) => changeYear(e.target.value)}
          />
        </label>{" "}
        <button aria-label="Cập nhật năm xem" disabled={busy}>
          {busy ? "Đang tính…" : "Xem năm"}
        </button>
      </form>
      <div className="sheet-actions chart-layer-options">
        <label><input type="checkbox" checked={layers.annualPosition ?? layers.annual} disabled={!ready || !viewing?.annual} onChange={e => setLayers({...layers, annualPosition:e.target.checked})}/> Tiểu vận (vị trí)</label>
        <label>
          <input
            type="checkbox"
            checked={layers.annual}
            disabled={!ready || !viewing}
            onChange={(e) => setLayers({ ...layers, annual: e.target.checked })}
          />{" "}
          Sao lưu năm
        </label>
        <label>
          <input
            type="checkbox"
            checked={layers.decadal}
            disabled={!ready || !decade?.stars.length}
            onChange={(e) =>
              setLayers({ ...layers, decadal: e.target.checked })
            }
          />{" "}
          Sao lưu đại vận
        </label>
        <label>
          <input
            type="checkbox"
            checked={layers.decadePosition}
            disabled={!ready || !decade?.palace}
            onChange={(e) =>
              setLayers({ ...layers, decadePosition: e.target.checked })
            }
          />{" "}
          Cung đại vận
        </label>
      </div>
      {!ready && (
        <p role="status">
          {busy
            ? "Đang tính năm mới; tạm ẩn phiếu và khóa xuất."
            : "Năm xem chưa được áp dụng; bấm Cập nhật năm xem để hiển thị và xuất đúng kết quả."}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      {ready && !decade && (
        <p className="caption">
          Hồ sơ lịch sử chưa lưu bộ sao đại vận. Cập nhật năm xem để tạo kết quả
          phiên bản mới; giữ nguyên hồ sơ cũ.
        </p>
      )}
      {ready &&
        decade?.issues.map((message) => (
          <p className="caption" key={message}>
            {message}
          </p>
        ))}
      {ready && layers.decadal && decade?.range && (
        <details className="chart-decade-note"><summary>Đại vận đang xem</summary><p>
          Đại vận: {decade.range.join("–")} tuổi — cung {decade.palace} ·{" "}
          {decade.stem} {decade.branch}. Quy ước bổ sung: 10 sao và Tứ Hóa;
          không gồm vòng sao đại vận khác.
        </p></details>
      )}
      {savedId && (
        <a href={`/internal/readings?id=${savedId}`}>
          Mở hồ sơ đã lưu (mặc định bản mệnh)
        </a>
      )}
    </div>
  );
}
