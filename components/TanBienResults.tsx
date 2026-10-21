import { executeRules } from "@/lib/interpretation-rules/execute";
import { catalog, RULESET_VERSION } from "@/lib/interpretation-rules/catalog";
import { tanBienTable } from "@/lib/interpretation-rules/tanbien-source";
import type { ChartSnapshot } from "@/lib/tuvi-engine";
export default function TanBienResults({
  snapshot,
}: {
  snapshot: ChartSnapshot;
}) {
  const rules = catalog.filter((r) => r.id.startsWith("tanbien."));
  const execution = executeRules(snapshot, rules, "internal-draft");
  return (
    <section>
      <h1>{rules.length} rule Tân Biên — thực thi nội bộ</h1>
      <p>
        Chạy evaluator hiện có trên dữ liệu cấu trúc. Đây không phải cách sinh
        toàn bộ bài biên soạn cố định. Tất cả rule là draft, chưa được chuyên
        gia duyệt; matched chỉ nói điều kiện cục bộ khớp.
      </p>
      <p>
        Catalog {RULESET_VERSION}; profile {snapshot.profile.id}; engine{" "}
        {snapshot.versions.engine}. Không sửa snapshot.
      </p>
      {rules.map((rule) => {
        const trace = execution.traces.find((t) => t.ruleId === rule.id)!;
        const status =
          trace.status === "matched"
            ? "matched"
            : ["condition-false", "exception"].includes(trace.status)
              ? "not-matched"
              : "unknown";
        const claim = execution.previewClaims.find((c) =>
          c.rules.some((r) => r.id === rule.id),
        );
        return (
          <article className="card evidence" key={rule.id} data-rule={rule.id}>
            <h2>{rule.presentation?.title}</h2>
            <p>
              <strong data-testid="rule-status">{status}</strong> · draft ·{" "}
              {rule.id}@{rule.version}
            </p>
            {claim && <p>{claim.text}</p>}
            {status === "unknown" && (
              <p>
                Chưa đủ dữ kiện để xuất nhận định; không suy nhận định ngược
                lại.
              </p>
            )}
            <h3>Dữ kiện thực tế</h3>
            <ul>
              {rule.requiredFacts.map((id) => {
                const f = execution.derivedFacts.find((f) => f.id === id);
                return (
                  <li key={id}>
                    <strong>{id}</strong>:{" "}
                    {f ? JSON.stringify(f.value) : "Thiếu / chưa xác định"}
                    {f && (
                      <>
                        <br />
                        {f.text}
                        <br />
                        <small>{f.evidencePaths.join("; ")}</small>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
            {["tanbien.r01", "tanbien.r02"].includes(rule.id) && (
              <>
                <p>
                  Nhãn engine tại Mệnh:{" "}
                  {JSON.stringify(
                    snapshot.chart.palaces
                      .find((p) => p.name === "Mệnh")
                      ?.majorStars?.map((s) => ({
                        name: s.name,
                        brightness: s.brightness ?? "không có",
                      })),
                  )}
                </p>
                <p>
                  Bảng nguồn: {tanBienTable.id}@{tanBienTable.version};{" "}
                  {JSON.stringify(tanBienTable.states)}.{" "}
                  {tanBienTable.verification}
                </p>
              </>
            )}
            <details>
              <summary>Xem điều kiện, trace và căn cứ</summary>
              <h3>Điều kiện bắt buộc</h3>
              <pre>{JSON.stringify(rule.conditions, null, 2)}</pre>
              <p>Trace: {trace.status}</p>
              <ul>
                {trace.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
              <h3>Nguồn</h3>
              {rule.sourceReferences.map((s) => (
                <p key={s.id}>
                  <a href={s.url}>{s.title}</a> — {s.location}
                  <br />
                  {s.rightsNote}
                </p>
              ))}
              <h3>Giới hạn / khác biệt</h3>
              <ul>
                {rule.limitations.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              {claim && <p>Claim ID: {claim.id}</p>}
            </details>
          </article>
        );
      })}
    </section>
  );
}
