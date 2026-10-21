"use client";
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import type { Palace } from "@/lib/tuvi-engine";
export default function Periods({ palaces }: { palaces: Palace[] }) {
  const data = palaces
    .map((p) => ({ name: p.name, range: p.decadal.range }))
    .sort((a, b) => a.range[0] - b.range[0]);
  const [selected, setSelected] = useState(0);
  return (
    <>
      <h3>Đại vận · giai đoạn tuổi mụ từ engine</h3>
      <p className="caption">
        Chiều cao biểu diễn khoảng tuổi, không phải điểm thuận lợi hoặc thách
        thức.
      </p>
      <label>
        Giai đoạn đang xem
        <select
          value={selected}
          onChange={(e) => setSelected(Number(e.target.value))}
        >
          {data.map((d, i) => (
            <option value={i} key={d.name}>
              {d.range.join("–")} tuổi mụ · {d.name}
            </option>
          ))}
        </select>
      </label>
      <div className="demo-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="#eee" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis width={30} />
            <Tooltip trigger="click" />
            <Bar name="Khoảng tuổi mụ" dataKey="range">
              {data.map((d, i) => (
                <Cell
                  key={d.name}
                  fill={i === selected ? "#B4232D" : "#dfb6ba"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p role="status">
        Đang xem: {data[selected].name} · {data[selected].range.join("–")} tuổi
        mụ.
      </p>
    </>
  );
}
