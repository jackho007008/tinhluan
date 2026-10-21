"use client";
import ReadingDisclosure from "./ReadingDisclosure";
import { useState } from "react";
import { birthSchema, profileRanges } from "@/lib/calendar";
export default function InternalBirthForm({
  initial,
  parentId,
  customer = false,
}: {
  initial?: Record<string, unknown>;
  parentId?: string;
  customer?: boolean;
}) {
  const [birth, setBirth] = useState({
    name: "",
    date: "",
    viewYear: initial ? undefined : Number(new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date())) as number | undefined,
    viewDate: undefined as string | undefined,
    viewHourIndex: undefined as number | undefined,
    hour: null as number | null,
    minute: null as number | null,
    unknownTime: false,
    place: "",
    gender: "female",
    calendar: "solar",
    timezone: "Asia/Ho_Chi_Minh",
    ...initial,
    profile: "tanbien-vn-trial-v2",
    consent: false,
  });
  const [fields, setFields] = useState<Record<string, string[] | undefined>>(
      {},
    ),
    [confirmed, setConfirmed] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [requestId, setRequestId] = useState("");
  function update(key: string, value: unknown) {
    setBirth((b) => ({
      ...b,
      [key]: value,
      ...(key === "profile" && value !== "tanbien-vn-trial-v2"
        ? { viewYear: undefined, viewDate: undefined, viewHourIndex: undefined }
        : {}),
    }));
    setConfirmed(false);
    setRequestId("");
    setError("");
    setFields({});
  }
  function review() {
    const r = birthSchema.safeParse(birth);
    if (!r.success) {
      setFields(r.error.flatten().fieldErrors);
      return;
    }
    setBirth({
      ...r.data,
      name: r.data.name || "",
      viewYear: r.data.viewYear,
      viewDate: r.data.viewDate,
      viewHourIndex: r.data.viewHourIndex,
    });
    setConfirmed(true);
    setRequestId(crypto.randomUUID());
  }
  async function create() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/internal-readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, birth, parentId }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw Error(
          "Máy chủ trả dữ liệu không hợp lệ. Thông tin đã nhập vẫn được giữ để thử lại.",
        );
      }
      if (!res.ok) throw Error(data.error || "Không thể lập bản đọc.");
      window.location.assign(
        "/internal/readings?id=" + encodeURIComponent(data.id) + (customer ? "&mode=basic&experience=1" : ""),
      );
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  const err = (k: string) =>
    fields[k]?.map((m) => (
      <span className="error" role="alert" key={m}>
        {m}
      </span>
    ));
  return (
    <section className="card form-card">
      {customer ? <div className="experience-form-title"><span aria-hidden="true">TỬ<br/>VI</span><div><h1>Lập lá số</h1><p>Thông tin sinh của bạn</p></div></div> : <h2>Nhập thông tin sinh</h2>}
      <p className={customer ? "experience-form-note" : undefined}>
        {customer ? "Không cần tên thật. Chỉ lưu trong môi trường nội bộ." : "Chỉ lưu trong hồ sơ nội bộ trên máy chủ này. Không tạo đơn, không gửi email. Không cần tên thật."}
      </p>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          review();
        }}
      >
        <fieldset disabled={busy} style={{ border: 0, padding: 0 }}>
          <div className="field-grid">
<label className="full">Họ tên (tùy chọn)<input autoComplete="name" maxLength={80} value={birth.name || ""} onChange={e=>update("name",e.target.value)}/></label>
            <label className="full">
              Ngày sinh dương lịch
              <input
                type="date"
                value={birth.date}
                min={
                  profileRanges[birth.profile as keyof typeof profileRanges].min
                }
                max={
                  profileRanges[birth.profile as keyof typeof profileRanges].max
                }
                onChange={(e) => update("date", e.target.value)}
              />
              {err("date")}
            </label>
            <label>
              Giờ sinh
              <select
                value={birth.hour ?? ""}
                disabled={birth.unknownTime}
                onChange={(e) =>
                  update(
                    "hour",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              >
                <option value="">Chọn giờ</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              {err("hour")}
            </label>
            <label>
              Phút sinh
              <select
                value={birth.minute ?? ""}
                disabled={birth.unknownTime}
                onChange={(e) =>
                  update(
                    "minute",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              >
                <option value="">Chọn phút</option>
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              {err("minute")}
            </label>
            <label className="check-label full">
              <input
                type="checkbox"
                checked={birth.unknownTime}
                onChange={(e) => update("unknownTime", e.target.checked)}
              />
              Tôi chưa rõ giờ sinh
            </label>
            <label>
              Nơi sinh
              <input
                value={birth.place}
                maxLength={120}
                onChange={(e) => update("place", e.target.value)}
              />
              {err("place")}
            </label>
            <label>
              Giới tính theo quy tắc
              <select
                value={birth.gender}
                onChange={(e) => update("gender", e.target.value)}
              >
                <option value="female">Nữ</option>
                <option value="male">Nam</option>
              </select>
            </label>
            <ReadingDisclosure className="full experience-options"><summary>Tùy chọn lịch và năm xem</summary><div className="field-grid">
            <label className="full">
              Hệ lịch tính lá số
              <select
                value={birth.profile}
                onChange={(e) => update("profile", e.target.value)}
              >
                {[
                  "tanbien-vn-trial-v2",
                  "tanbien-vn-trial-v1",
                  "vn-utc7-midnight-v1",
                  "cn-reference",
                ].map((p) => (
                  <option key={p} value={p}>
                    {profileRanges[p as keyof typeof profileRanges].label} —{" "}
                    {profileRanges[p as keyof typeof profileRanges].years}
                  </option>
                ))}
              </select>
            </label>
            {birth.profile === "tanbien-vn-trial-v2" && (
              <label className="full">
                Năm âm xem (tùy chọn)
                <input
                  type="number"
                  min="1976"
                  max="2050"
                  value={birth.viewYear ?? ""}
                  onChange={(e) =>
                    update(
                      "viewYear",
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                />
                <span className="caption">
                  Để trống: chỉ bản mệnh. Chọn năm: thêm vị trí hạn và 9 sao lưu
                  riêng, không thêm luận đoán.
                </span>
                {err("viewYear")}
              </label>
            )}
            {birth.profile === "tanbien-vn-trial-v2" &&
              birth.viewYear !== undefined && (
                <>
                  <label>
                    Ngày dương xem (tùy chọn)
                    <input
                      type="date"
                      value={birth.viewDate ?? ""}
                      onChange={(e) =>
                        update("viewDate", e.target.value || undefined)
                      }
                    />
                    {err("viewDate")}
                  </label>
                  <label>
                    Chi giờ xem (tùy chọn)
                    <select
                      value={birth.viewHourIndex ?? ""}
                      onChange={(e) =>
                        update(
                          "viewHourIndex",
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                    >
                      <option value="">Chưa chọn</option>
                      {[
                        "Tý",
                        "Sửu",
                        "Dần",
                        "Mão",
                        "Thìn",
                        "Tỵ",
                        "Ngọ",
                        "Mùi",
                        "Thân",
                        "Dậu",
                        "Tuất",
                        "Hợi",
                      ].map((b, i) => (
                        <option key={b} value={i}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {err("viewHourIndex")}
                  </label>
                </>
              )}
            </div></ReadingDisclosure>
            <p className="full">
              Giờ dân sự Asia/Ho_Chi_Minh (UTC+7). Không hiệu chỉnh nơi sinh
              sang giờ mặt trời; lịch âm đầu vào chưa hỗ trợ.
            </p>
            <label className="check-label full">
              <input
                type="checkbox"
                checked={birth.consent}
                onChange={(e) => update("consent", e.target.checked)}
              />
              Tôi hiểu đây là bản đọc thử truyền thống, chưa được duyệt chuyên
              môn.{err("consent")}
            </label>
          </div>
          <button className="primary" type="submit">
            Kiểm tra thông tin
          </button>
          {confirmed && (
            <section data-confirmation>
              <h3>Xác nhận thông tin</h3>
              <p>
                {birth.date} ·{" "}
                {birth.unknownTime
                  ? "Chưa rõ giờ"
                  : `${birth.hour}:${String(birth.minute).padStart(2, "0")}`}{" "}
                · {birth.gender === "male" ? "Nam" : "Nữ"} · {birth.place} ·{" "}
                {customer ? profileRanges[birth.profile as keyof typeof profileRanges].label : birth.profile}
              </p>
              <button
                className="primary"
                type="button"
                onClick={() => void create()}
              >
                {busy ? "Đang lập và lưu…" : "Xác nhận & mở bản đọc nội bộ"}
              </button>
            </section>
          )}
        </fieldset>
      </form>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
