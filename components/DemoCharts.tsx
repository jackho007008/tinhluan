"use client";
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ReferenceLine,
} from "recharts";
import { fixtureScores } from "@/lib/scoring";
import dailyFixture from "@/lib/scoring/daily-fixture.json";
const names = [
  "Mệnh",
  "Phụ Mẫu",
  "Phúc Đức",
  "Điền Trạch",
  "Quan Lộc",
  "Nô Bộc",
  "Thiên Di",
  "Tật Ách",
  "Tài Bạch",
  "Tử Tức",
  "Phu Thê",
  "Huynh Đệ",
];
export default function DemoCharts() {
  const [tab, setTab] = useState(0);
  const data = fixtureScores.map((value, i) => ({
    label:
      tab === 0
        ? `${4 + i * 10}–${13 + i * 10}`
        : tab === 1
          ? String(2021 + i)
          : names[i],
    value,
  }));
  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <span className="eyebrow">KHÁM PHÁ CÁCH HIỂN THỊ</span>
          <h2>Biểu đồ dễ đọc, căn cứ rõ ràng</h2>
        </div>
        <span className="badge">Dữ liệu minh họa</span>
      </div>
      <p>
        Đây là mẫu giao diện cố định, không tính từ ngày sinh của bạn. Chưa có
        phương pháp điểm được duyệt; các biểu đồ này không nằm trong gói bán.
      </p>
      <div className="tabs">
        {["Đại vận", "Tiểu vận", "12 cung", "Nhật vận"].map((n, i) => (
          <button aria-pressed={tab === i} key={n} onClick={() => setTab(i)}>
            {n}
          </button>
        ))}
      </div>
      <h3>
        {
          [
            "Đại vận · ví dụ giai đoạn tuổi mụ",
            "Tiểu vận · ví dụ theo năm",
            "Chỉ số luận giải 12 cung",
            "Nhật vận · dữ liệu minh họa",
          ][tab]
        }
      </h3>
      {tab === 3 ? (
        <>
          <label>
            Tháng minh họa
            <select aria-label="Tháng minh họa" defaultValue="2026-10">
              <option value="2026-10">Tháng 10/2026 · mẫu cố định</option>
            </select>
          </label>
          <p className="caption">
            Tính nhật vận thật chưa hỗ trợ. Cột dưới là chỉ số UI cố định; ngày
            âm chỉ đối chiếu lịch Trung Quốc, không phải căn cứ cho điểm.
          </p>
          <div className="demo-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyFixture}>
                <CartesianGrid vertical={false} stroke="#eee" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} width={30} />
                <Tooltip
                  trigger="click"
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="evidence">
                        <b>Dữ liệu minh họa</b>
                        <p>Dương lịch: {payload[0].payload.solar}</p>
                        <p>Âm lịch: {payload[0].payload.lunar}</p>
                        <p>
                          Chỉ số: {payload[0].value}/100 · không phải xác suất
                        </p>
                        <small>{payload[0].payload.evidence}</small>
                      </div>
                    ) : null
                  }
                />
                <Bar dataKey="value" fill="#B4232D" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <details>
            <summary>Bảng nhật vận minh họa</summary>
            <div className="data-list">
              {dailyFixture.map((d) => (
                <div key={d.label}>
                  <span>
                    {d.solar}
                    <small style={{ display: "block" }}>Âm: {d.lunar}</small>
                  </span>
                  <b>
                    {d.value} / 100
                    <br />
                    UI fixture v1
                  </b>
                </div>
              ))}
            </div>
          </details>
        </>
      ) : (
        <>
          <div className="demo-chart">
            <ResponsiveContainer width="100%" height="100%">
              {tab === 2 ? (
                <RadarChart data={data} outerRadius="62%">
                  <PolarGrid />
                  <PolarAngleAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <Radar
                    dataKey="value"
                    name="Chỉ số minh họa"
                    stroke="#B4232D"
                    fill="#B4232D"
                    fillOpacity={0.16}
                  />
                  <Tooltip trigger="click" />
                </RadarChart>
              ) : tab === 1 ? (
                <LineChart data={data}>
                  <CartesianGrid vertical={false} stroke="#eee" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} width={30} />
                  <Tooltip trigger="click" />
                  <ReferenceLine
                    x="2026"
                    stroke="#941C25"
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="linear"
                    dataKey="value"
                    name="Chỉ số minh họa"
                    stroke="#B4232D"
                    strokeWidth={3}
                  />
                </LineChart>
              ) : (
                <BarChart data={data}>
                  <CartesianGrid vertical={false} stroke="#eee" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} width={30} />
                  <Tooltip trigger="click" />
                  <Bar
                    dataKey="value"
                    name="Chỉ số minh họa"
                    fill="#B4232D"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <p className="caption">
            Chạm điểm/cột để xem. Thang 0–100 minh họa, không phải xác suất hoặc
            phép đo năng lực. Không có căn cứ chuyên môn cho các giá trị mẫu.
          </p>
          <details>
            <summary>Bảng dữ liệu minh họa, hỗ trợ bàn phím</summary>
            <div className="data-list">
              {data.map((d) => (
                <div key={d.label}>
                  <span>{d.label}</span>
                  <b>{d.value} / 100 · minh họa</b>
                </div>
              ))}
            </div>
          </details>
        </>
      )}
    </section>
  );
}
