import type { lifeOverview } from "@/lib/internal-review/life-overview";
export default function LifeOverview({
  value,
}: {
  value: ReturnType<typeof lifeOverview>;
}) {
  return (
    <section data-life-overview>
      <h3>Tổng quan Mệnh–Thân</h3>
      <p>{value.facts.map((f) => f.text).join(" ")}</p>
      <p>{value.scope}</p>
      <p>{value.bodyNote}</p>
      {value.gaps.map((g, i) => (
        <p key={i}>{g.text}</p>
      ))}
      <details>
        <summary>Xem căn cứ Mệnh–Thân</summary>
        <p>{value.bodySource}</p>
        {value.gaps.map((g, i) => (
          <p key={i}>
            {g.cause} {g.source}
          </p>
        ))}
        <details>
          <summary>Chi tiết kỹ thuật</summary>
          <pre>{JSON.stringify(value.facts, null, 2)}</pre>
        </details>
      </details>
    </section>
  );
}
