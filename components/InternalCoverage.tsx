import {
  collectCoverage,
  coverageFilters,
  filterRows,
} from "@/lib/internal-review/coverage";
export default async function InternalCoverage({ filter }: { filter: string }) {
  const data = await collectCoverage(),
    rows = filterRows(data.rows, filter);
  return (
    <main className="reading-shell">
      <h1>Độ phủ nội dung nội bộ</h1>
      <a href="/internal">Trở lại chọn mẫu / báo cáo</a>
      <div className="alert">
        <p>
          Chỉ số chất lượng phần mềm và nội dung dự thảo. Không phải điểm vận
          mệnh, độ chính xác dự đoán hoặc điều kiện mở bán. Bộ mẫu không đại
          diện khách hàng thực tế.
        </p>
      </div>
      <p>
        {data.version} · {data.sampleVersion} · {data.ruleVersion}. Đo lúc{" "}
        {data.generatedAt}. Chạy evaluator hiện tại, không đọc hoặc tạo đơn
        khách.
      </p>
      <section className="card">
        <h2>Cách đếm</h2>
        <p>
          Đếm rule khớp trước xử lý trùng/xung đột. Đếm claim hiển thị sau xử lý
          bằng ID duy nhất, gồm văn chính và chú giải mở rộng. Dữ kiện, tứ hóa
          chép lại, phần giới thiệu phương pháp và lời giải thích Mệnh rỗng
          không tính là chú giải đơn/phối hợp theo yếu tố. Đây cũng không phải
          nhận định cá nhân đã được kiểm chứng.
        </p>
        <p>
          Thân cư Quan Lộc đang có nhãn method-gloss nên được loại khỏi tử số
          này theo cách đếm bảo thủ. Thiên Đồng là rule cũ thiếu metadata, được
          ánh xạ rõ thành chú giải đơn; rule giới thiệu Quan Lộc được ánh xạ
          thành phương pháp.
        </p>
        <h3>Độ phủ danh mục mục tiêu</h3>
        <p>
          {data.catalog.filter((c) => c.rules.length).length}/
          {data.catalog.length} trường hợp có chú giải theo yếu tố hoặc Mệnh
          rỗng: 14 chính tinh tại Mệnh và 1 trường hợp rỗng. Phần rỗng chỉ giải
          thích phương pháp.{" "}
          {
            data.catalog.filter((c) =>
              c.rules.some((r) => r.status === "approved"),
            ).length
          }
          /{data.catalog.length} trường hợp có rule approved. Không dùng mẫu số
          này cho mọi tổ hợp.
        </p>
        <details>
          <summary>Danh mục và khoảng trống</summary>
          <ul>
            {data.catalog.map((c) => (
              <li key={c.name}>
                {c.name}:{" "}
                {c.rules.length
                  ? c.rules
                      .map((r) => `${r.id} @ ${r.version} (${r.status})`)
                      .join("; ")
                  : ["Phá Quân", "Thất Sát"].includes(c.name)
                    ? "Chỉ có chú giải thuật ngữ, chưa tính vào độ phủ này"
                    : "Chưa có nội dung"}
              </li>
            ))}
          </ul>
        </details>
        <h3>Độ phủ trên bộ mẫu</h3>
        {data.summary.map((g) => (
          <p key={g.kind + g.profile}>
            {g.kind} · {g.profile}: {g.numerator}/{g.denominator} mẫu có ít nhất
            một claim đơn/phối hợp hiển thị ở hai chủ đề; riêng Tổng quan{" "}
            {g.overviewNumerator}/{g.denominator}. Mẫu số là số mẫu trong đúng
            nhóm này, không phải số khách.
          </p>
        ))}
      </section>
      <form method="get" className="card">
        <input type="hidden" name="view" value="coverage" />
        <label>
          Lọc độ phủ
          <select name="filter" defaultValue={filter}>
            {Object.entries(coverageFilters).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <button className="primary">Lọc kết quả</button>
      </form>
      {filter === "uncovered" ? (
        <section className="card">
          <h2>Rule chưa khớp mẫu nào</h2>
          <p>
            “Chưa bao phủ” ở đây nghĩa là không có trace matched trong bộ{" "}
            {data.rows.length}
            mẫu; không có nghĩa chưa từng được test ở nơi khác.
          </p>
          {data.uncoveredRules.length ? (
            data.uncoveredRules.map((r) => (
              <p key={r.id}>
                {r.id} @ {r.version} · {r.kind}
              </p>
            ))
          ) : (
            <p>
              Tất cả rule đều có ít nhất một mẫu khớp. Điều này không chứng minh
              đủ ca âm/ngoại lệ.
            </p>
          )}
        </section>
      ) : (
        <section className="card">
          <h2>Kết quả từng mẫu ({rows.length})</h2>
          <div className="reading-table">
            <table>
              <thead>
                <tr>
                  {[
                    "Mẫu / loại",
                    "Phiên bản",
                    "Dữ kiện đủ / thiếu",
                    "Rule khớp: dữ kiện / đơn / phối hợp",
                    "Claim hiển thị",
                    "Chủ đề trống / chưa hỗ trợ",
                  ].map((t) => (
                    <th key={t}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} data-sample={r.id}>
                    <td>
                      <a href={`/internal?sample=${r.id}`}>{r.name}</a>
                      <p>{r.kind}</p>
                    </td>
                    <td>
                      {r.profile}
                      <br />
                      {r.engine}
                      <br />
                      {r.rules}
                    </td>
                    <td>
                      {r.factsAvailable.length} facts có sẵn; {r.missing.length}{" "}
                      rule thiếu căn cứ
                      <details>
                        <summary>Chi tiết dữ kiện</summary>
                        <p>{r.factsAvailable.join(", ")}</p>
                        {r.missing.map((m, i) => (
                          <p key={i}>
                            {m.ruleId}: {m.details.join(", ")}
                          </p>
                        ))}
                      </details>
                    </td>
                    <td>
                      {r.matchedFacts} / {r.matchedSingles} /{" "}
                      {r.matchedCombinations}
                      <p>{r.matchedMethod} phương pháp (loại khỏi độ phủ)</p>
                    </td>
                    <td>
                      {r.displayed} claim đơn/phối hợp duy nhất
                      <p>
                        {r.mainDisplayed} văn chính · {r.detailDisplayed} mở
                        rộng
                      </p>
                    </td>
                    <td>
                      {r.topics
                        .filter((t) => t.empty)
                        .map((t) => (
                          <p key={t.id}>
                            {t.id}: {t.reason}
                          </p>
                        ))}
                      <details>
                        <summary>Chưa hỗ trợ</summary>
                        {r.unsupported.map((x) => (
                          <p key={x}>{x}</p>
                        ))}
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <section className="card">
        <h2>Sáu bản Tổng quan đối chiếu</h2>
        <span className="badge">Bản nháp nội bộ — chưa kiểm duyệt</span>
        <p>{data.readings[0]?.limit}</p>
        <p>
          Đầu vào giả lập từ engine, không sửa vị trí. Các đoạn bên dưới lấy
          nguyên văn claim của preview, không viết thêm luận điểm.
        </p>
        {data.readings.map((r) => (
          <article key={r.id} data-reading={r.id}>
            <h3>
              <a href={`/internal?sample=${r.id}`}>{r.name}</a>
            </h3>
            <p>{r.summary}</p>
            {r.main.map((n) => (
              <p key={n.claimId} data-claim={n.claimId}>
                {n.text}
              </p>
            ))}
            {r.details.length > 0 && (
              <details>
                <summary>Chú giải đơn được giữ lại</summary>
                {r.details.map((n) => (
                  <p key={n.claimId}>{n.text}</p>
                ))}
              </details>
            )}
            {r.supportingFacts.map((f) => (
              <p key={f.id}>{f.text}</p>
            ))}
            {r.scopeGaps.map((gap) => (
              <p key={gap}>{gap}</p>
            ))}
            {r.unsupported.length > 0 && (
              <p>
                Chưa có nội dung cho: {r.unsupported.join(", ")}. Đây là khoảng
                trống nội dung, không phải đặc điểm của người đọc.
              </p>
            )}
            <details>
              <summary>Căn cứ của bản mẫu</summary>
              {[...r.main, ...r.details].map((n) => (
                <section className="evidence" key={n.claimId}>
                  <h4>{n.title}</h4>
                  <p>
                    {n.id} @ {n.version} · claim {n.claimId}
                  </p>
                  <p>{n.factor}</p>
                  <p>{n.condition}</p>
                  {n.sources.map((s) => (
                    <p key={s.id}>
                      <a href={s.url}>{s.title}</a> · {s.location}
                    </p>
                  ))}
                  <p>{n.missing}</p>
                </section>
              ))}
              <p>{r.synthesis}</p>
            </details>
          </article>
        ))}
      </section>
    </main>
  );
}
