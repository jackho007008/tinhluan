"use client";
import { useState } from "react";
import type { ChartSnapshot } from "@/lib/tuvi-engine";
import { birthForYear } from "@/lib/chart-year";

export default function ReadingYear({
  snapshot,
  parentId,
  offerAnnual = false,
}: {
  snapshot: ChartSnapshot;
  parentId: string;
  offerAnnual?: boolean;
}) {
  const [year, setYear] = useState(
    String(
      snapshot.normalized.viewYear ??
        Math.min(
          2050,
          Math.max(
            new Date().getFullYear(),
            Number(snapshot.normalized.date.slice(0, 4)),
          ),
        ),
    ),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (snapshot.profile.id !== "tanbien-vn-trial-v2") return null;
  async function create() {
    if (busy) return;
    setError("");
    const birth = birthForYear(snapshot.normalized, year);
    if (!birth) {
      setError("Nhập năm từ năm sinh đến 2050, trong phạm vi 1976–2050.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/internal-readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: crypto.randomUUID(), parentId, birth }),
      });
      const data = await response.json();
      if (!response.ok || !data.id)
        throw Error(data.error || "Chưa tạo được bản năm xem.");
      window.location.assign(
        "/internal/readings?id=" +
          encodeURIComponent(data.id) +
          "#reading-chart",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chưa tạo được bản năm xem.");
      setBusy(false);
    }
  }
  return (
    <form
      className="sheet-year"
      aria-busy={busy}
      onSubmit={(e) => {
        e.preventDefault();
        void create();
      }}
    >
      <label>
        Năm xem (năm âm){" "}
        <input
          type="number"
          min={Math.max(1976, Number(snapshot.normalized.date.slice(0, 4)))}
          max={2050}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          disabled={busy}
        />
      </label>{" "}
      <button disabled={busy}>
        {busy ? "Đang lập bản mới…" : "Mở lá số năm này"}
      </button>
      <p className="caption">
        {offerAnnual
          ? "Chọn năm rồi bấm mở lá số để lưu dữ liệu năm xem. Các lớp sao lưu mặc định tắt. "
          : ""}
        Tạo bản mới từ cùng thông tin sinh, giữ nguyên hồ sơ này. Năm mới không
        kế thừa lựa chọn ngày/giờ xem cũ.
      </p>
      {busy && (
        <p role="status">Đang lập lớp lưu năm {year} và mở lá số mới…</p>
      )}
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
