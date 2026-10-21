"use client";
import { useEffect, useState } from "react";
import {
  Compass,
  ShieldCheck,
  BookOpen,
  Check,
  Heart,
  Briefcase,
  Home,
  Activity,
  Orbit,
  Mail,
  Copy,
  Download,
  ChevronLeft,
  LockKeyhole,
  RotateCcw,
} from "lucide-react";
import { brand, groups, money, packages } from "@/lib/config";
import { birthSchema, profileRanges, type BirthInput } from "@/lib/calendar";
import type { ChartSnapshot } from "@/lib/tuvi-engine";
import type { CustomerReport as ReportData } from "@/lib/reading/customer";
import Chart from "./Chart";

import CustomerReport from "./CustomerReport";
type OrderView = {
  order: {
    id: string;
    code: string;
    amount: number;
    package: (typeof packages)[number];
    scope: { groups: string[]; year: number | null };
    expiresAt: string;
    paymentStatus: string;
    reportStatus: string;
    emailStatus: string;
  };
  payment: { qr: string; recipient: string; memo: string } | null;
  report?: ReportData;
  chartSnapshot?: ChartSnapshot;
};
const icons = [Compass, Heart, Briefcase, Orbit, Home, Activity];
const initial: Omit<BirthInput, "consent"> & { consent: boolean } = {
  name: "",
  date: "",
  hour: null,
  minute: null,
  unknownTime: false,
  place: "Chưa có thông tin nơi sinh",
  gender: "female",
  calendar: "solar",
  profile: "tanbien-vn-trial-v2",
  timezone: "Asia/Ho_Chi_Minh",
  consent: false,
};
async function api(path: string, body?: unknown) {
  const r = await fetch("/api/" + path, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Không thể kết nối");
  return data;
}
export default function Experience({
  offers,
  demoEnabled,
  currentYear,
}: {
  offers: typeof packages;
  demoEnabled: boolean;
  currentYear: number;
}) {
  const [birth, setBirth] = useState<typeof initial>(() => ({
    ...initial,
    viewYear: currentYear,
  }));
  const [fields, setFields] = useState<Record<string, string[] | undefined>>(
    {},
  );
  const [confirmed, setConfirmed] = useState(false);
  const [snapshot, setSnapshot] = useState<ChartSnapshot | null>(null);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [chosen, setChosen] = useState("complete");
  const [topic, setTopic] = useState<string>(groups[0]);
  const [year, setYear] = useState(currentYear);
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderView | null>(null);
  const [recover, setRecover] = useState(false);
  function update(k: string, v: unknown) {
    setBirth((b) => ({
      ...b,
      [k]: v,
      ...(k === "profile"
        ? { viewYear: v === "tanbien-vn-trial-v2" ? currentYear : undefined }
        : {}),
    }));
    setConfirmed(false);
    setSnapshot(null);
    setFields((f) => ({ ...f, [k]: undefined }));
    setError("");
  }
  useEffect(() => {
    const id = localStorage.getItem("tuvi-order");
    if (id) {
      setOrderId(id);
      setStep(3);
    }
  }, []);
  useEffect(() => {
    if (!orderId) return;
    let active = true;
    const poll = async () => {
      try {
        const data = await api("order?id=" + orderId);
        if (active) {
          setOrder(data);
          setError("");
        }
      } catch (e) {
        if (active) setError((e as Error).message);
      }
    };
    void poll();
    const timer = setInterval(poll, 4000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [orderId]);
  async function act(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function review() {
    const parsed = birthSchema.safeParse(birth);
    if (!parsed.success) {
      setFields(parsed.error.flatten().fieldErrors);
      return;
    }
    setFields({});
    setConfirmed(true);
  }
  async function generate() {
    await act(async () => {
      const data = await api("chart", birth);
      setSnapshot(data);
      setStep(1);
      setConfirmed(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  async function createOrder() {
    await act(async () => {
      const data = await api("orders", {
        birth,
        packageId: chosen,
        topic,
        year,
        email,
        confirmed: true,
      });
      setOrderId(data.id);
      localStorage.setItem("tuvi-order", data.id);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  const fieldError = (key: string) =>
    fields[key]?.map((t) => (
      <span key={t} className="field-error" role="alert">
        {t}
      </span>
    ));
  return (
    <>
      <header>
        <a className="logo" href="/" aria-label="Tinh Luận trang chủ"><img className="tinhluan-logo" src="/images/tinhluan.png" alt="Tinh Luận — tinhluan.com" width="2043" height="770"/></a>
        <nav>
          <a href="#phuong-phap">Phương pháp</a>
          <button className="text-button" onClick={() => setRecover(!recover)}>
            <Mail size={17} />
            Tìm báo cáo
          </button>
        </nav>
      </header>
      <div className="demo-banner">
        <span className="badge">BẢN THỬ NGHIỆM</span>
        <span>Trải nghiệm miễn phí. Không chuyển tiền thật.</span>
      </div>
      <main>
        {recover && (
          <section className="card recovery">
            <h2>Truy cập lại báo cáo</h2>
            <p>
              Nhập email đã đặt đơn. Liên kết có thời hạn và chỉ sử dụng một
              lần.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void act(async () => {
                  await api("recover", { email });
                  setNotice(
                    "Nếu email có báo cáo còn quyền truy cập, hệ thống sẽ tạo email truy cập. Demo lưu email tại .local/mail, chưa gửi ra Internet.",
                  );
                });
              }}
            >
              <label>
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </label>
              <button className="primary" disabled={busy}>
                Gửi liên kết truy cập
              </button>
            </form>
          </section>
        )}
        <div className="intro">
          <div>
            <span className="eyebrow">
              TỬ VI ĐẨU SỐ • GÓC NHÌN TRUYỀN THỐNG
            </span>
            <h1>
              {step === 0 ? (
                <>
                  Bắt đầu từ <em>lá số của bạn.</em>
                </>
              ) : step === 1 ? (
                <>
                  Một lá số. <em>Nhiều góc nhìn.</em>
                </>
              ) : step === 2 ? (
                <>
                  Chọn điều bạn <em>muốn hiểu thêm.</em>
                </>
              ) : order?.report ? (
                <>
                  Báo cáo <em>của bạn.</em>
                </>
              ) : (
                <>
                  Từng bước, <em>rõ ràng.</em>
                </>
              )}
            </h1>
            <p>{brand.tagline}</p>
          </div>
          <span className="intro-icon" aria-hidden="true">
            <Compass size={92} strokeWidth={0.7} />
          </span>
        </div>
        <ol className="steps" aria-label="Tiến trình">
          {[
            "Thông tin",
            "Lá số miễn phí",
            "Chọn gói",
            "Thanh toán & kết quả",
          ].map((s, i) => (
            <li
              key={s}
              className={step === i ? "active" : step > i ? "done" : ""}
              aria-current={step === i ? "step" : undefined}
            >
              <span>{step > i ? <Check size={15} /> : i + 1}</span>
              <b>{s}</b>
            </li>
          ))}
        </ol>
        {error && (
          <div role="alert" className="alert error">
            {error}
            <button
              className="text-button"
              onClick={() =>
                orderId
                  ? void act(async () =>
                      setOrder(await api("order?id=" + orderId)),
                    )
                  : setError("")
              }
            >
              Thử lại
            </button>
          </div>
        )}
        {notice && (
          <div role="status" className="alert success">
            {notice}
          </div>
        )}
        {step === 0 && (
          <div className="form-layout">
            <section className="card form-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">01 / THÔNG TIN SINH</span>
                  <h2>Để lập lá số của bạn</h2>
                </div>
                <span className="pill">Miễn phí</span>
              </div>
              <p className="muted">
                Điền theo thông tin bạn biết. Giờ sinh chưa rõ sẽ không được tự
                suy đoán.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  review();
                }}
                noValidate
              >
                <div className="field-grid">
                  <label>
                    Năm xem (tùy chọn)
                    <input
                      type="number"
                      min={1976}
                      max={2050}
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
                    <small>Để trống nếu chỉ xem bản mệnh.</small>
                  </label>
                  <label className="full">
                    Họ tên (tùy chọn)
                    <input
                      autoComplete="name"
                      maxLength={80}
                      value={birth.name || ""}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </label>
                  <label className="full">
                    Ngày sinh
                    <div className="calendar-choice">
                      <span>Dương lịch</span>
                      <span aria-disabled="true">Âm lịch · chưa hỗ trợ</span>
                    </div>
                    <input
                      aria-invalid={!!fields.date}
                      type="date"
                      min={profileRanges[birth.profile].min}
                      max={profileRanges[birth.profile].max}
                      value={birth.date}
                      onChange={(e) => update("date", e.target.value)}
                    />
                    {fieldError("date")}
                  </label>
                  <label>
                    Giờ sinh
                    <select
                      aria-label="Giờ sinh"
                      aria-invalid={!!fields.hour}
                      disabled={birth.unknownTime}
                      value={birth.hour ?? ""}
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
                          {String(i).padStart(2, "0")} giờ
                        </option>
                      ))}
                    </select>
                    {fieldError("hour")}
                  </label>
                  <label>
                    Phút sinh
                    <select
                      aria-label="Phút sinh"
                      disabled={birth.unknownTime}
                      value={birth.minute ?? ""}
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
                          {String(i).padStart(2, "0")} phút
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="check-row full">
                    <input
                      type="checkbox"
                      checked={birth.unknownTime}
                      onChange={(e) => update("unknownTime", e.target.checked)}
                    />
                    Tôi chưa rõ giờ sinh
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
                  <label className="full">
                    Múi giờ
                    <select value={birth.timezone} onChange={() => {}}>
                      <option>Asia/Ho_Chi_Minh</option>
                    </select>
                    <span className="caption">
                      Chỉ tiếp nhận giờ dân sự UTC+7. Nơi sinh chưa được dùng để
                      hiệu chỉnh lịch sử múi giờ hoặc giờ mặt trời.
                    </span>
                  </label>
                  <label className="full">
                    Hệ lịch tính lá số
                    <select
                      aria-label="Hệ lịch tính lá số"
                      value={birth.profile}
                      onChange={(e) => update("profile", e.target.value)}
                    >
                      <option value="tanbien-vn-trial-v2">
                        Tân Biên v2 — bản thử
                      </option>
                      <option value="tanbien-vn-trial-v1">
                        Tân Biên — bản thử, có quy ước bổ sung (1976–2050)
                      </option>
                      <option value="vn-utc7-midnight-v1">
                        {profileRanges["vn-utc7-midnight-v1"].label} —{" "}
                        {profileRanges["vn-utc7-midnight-v1"].years}
                      </option>
                      <option value="cn-reference">
                        {profileRanges["cn-reference"].label} —{" "}
                        {profileRanges["cn-reference"].years}
                      </option>
                    </select>
                  </label>
                  <div className="soft-note full">
                    <ShieldCheck size={21} />
                    <p>
                      Lịch UTC+7 đổi ngày lúc 00:00, tháng nhuận lặp số tháng.
                      Trường hợp sát ranh giới thiên văn sẽ bị chặn nếu cần kiểm
                      tra. An sao chưa được chuyên gia độc lập xác nhận.
                    </p>
                  </div>
                  <label className="check-row full">
                    <input
                      type="checkbox"
                      checked={birth.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                    />
                    Tôi hiểu giới hạn hệ lịch và đồng ý xử lý thông tin sinh để
                    lập lá số.
                  </label>
                  {fieldError("consent")}
                </div>
                {!confirmed ? (
                  <button className="primary wide" type="submit">
                    Kiểm tra thông tin
                  </button>
                ) : (
                  <div className="confirmation">
                    <h3>Xác nhận thông tin đã chuẩn hóa</h3>
                    <p>
                      {birth.date} ·{" "}
                      {birth.unknownTime
                        ? "Chưa rõ giờ sinh"
                        : `${String(birth.hour).padStart(2, "0")}:${String(birth.minute).padStart(2, "0")}`}{" "}
                      · {birth.gender === "male" ? "Nam" : "Nữ"}
                      <br />
                      {birth.place} · Asia/Ho_Chi_Minh
                      <br />
                      {birth.profile === "cn-reference"
                        ? "Lịch Trung Quốc tham chiếu"
                        : "Lịch Việt Nam UTC+7 · ngày đổi lúc 00:00"}
                    </p>
                    <button
                      type="button"
                      className="primary wide"
                      disabled={busy}
                      onClick={() => void generate()}
                    >
                      {busy
                        ? "Đang tính lá số…"
                        : "Xác nhận & lập lá số miễn phí"}
                    </button>
                  </div>
                )}
                <p className="privacy">
                  <LockKeyhole size={14} />
                  Thông tin sinh không xuất hiện trong đường dẫn công khai.
                </p>
              </form>
            </section>
            <aside>
              <section className="editorial">
                <span className="eyebrow">MỘT CÁCH TIẾP CẬN MINH BẠCH</span>
                <h2>
                  Hiểu những gì
                  <br />
                  lá số <em>thực sự nói.</em>
                </h2>
                <div className="orbit-art" aria-hidden="true">
                  <div />
                  <div />
                  <Compass size={100} strokeWidth={0.8} />
                  <span>THIÊN · ĐỊA · NHÂN</span>
                </div>
                <p>
                  Tử vi là một hệ thống diễn giải truyền thống. Tính toán đúng
                  theo quy ước không đồng nghĩa dự đoán chính xác cuộc đời.
                </p>
              </section>
              <div className="principles">
                <div>
                  <span>01</span>
                  <p>
                    <b>Dữ kiện có thể đối chiếu</b>
                    <small>Lá số giữ lại hệ lịch và phiên bản tính toán.</small>
                  </p>
                </div>
                <div>
                  <span>02</span>
                  <p>
                    <b>Diễn giải có giới hạn</b>
                    <small>Không bổ sung nhận định chưa được duyệt.</small>
                  </p>
                </div>
                <div>
                  <span>03</span>
                  <p>
                    <b>Bạn giữ quyền lựa chọn</b>
                    <small>
                      Không hứa đổi vận. Không dùng nỗi sợ để bán hàng.
                    </small>
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
        {step === 1 && snapshot && (
          <>
            <div className="alert">
              <BookOpen size={20} />
              <span>Bản thử nghiệm — một số quy ước đang được đối chiếu.</span>
            </div>
            <div className="summary-strip">
              <div>
                <small>Ngày sinh dương lịch</small>
                <b>{snapshot.normalized.date}</b>
              </div>
              <div>
                <small>Giờ sinh đã khai báo</small>
                <b>{snapshot.chart.timeRange}</b>
              </div>
              <div>
                <small>
                  {snapshot.profile.id === "cn-reference"
                    ? "Âm lịch Trung Quốc tham chiếu"
                    : "Âm lịch UTC+7"}
                </small>
                <b>
                  {snapshot.chart.lunar.lunarDay}/
                  {snapshot.chart.lunar.lunarMonth}/
                  {snapshot.chart.lunar.lunarYear}
                  {snapshot.chart.lunar.isLeap ? " (nhuận)" : ""}
                </b>
              </div>
              <button className="text-button" onClick={() => setStep(0)}>
                <ChevronLeft size={16} />
                Sửa thông tin
              </button>
            </div>
            <Chart snapshot={snapshot} />
            <button className="primary" onClick={() => setStep(2)}>
              Xem các gói luận giải
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <button className="text-button" onClick={() => setStep(1)}>
              <ChevronLeft size={16} />
              Về lá số miễn phí
            </button>
            <div className="alert">
              Giá DEMO chưa được duyệt để thu thật. Các gói hiện chỉ thử luồng
              mua và báo cáo dữ kiện, không bao gồm luận giải chuyên môn hoặc
              điểm số.
            </div>
            <div className="offers">
              {offers.map((p) => (
                <button
                  key={p.id}
                  className={`offer ${chosen === p.id ? "chosen" : ""}`}
                  onClick={() => setChosen(p.id)}
                  aria-pressed={chosen === p.id}
                >
                  <span className="eyebrow">
                    {p.id === "topic"
                      ? "MỘT GÓC NHÌN"
                      : p.id === "complete"
                        ? "SÁU GÓC NHÌN"
                        : "THEO PHẠM VI NĂM"}
                  </span>
                  <h2>{p.name}</h2>
                  <strong className="price">{money(p.price)}</strong>
                  <span className="caption">Giá minh họa · không thu tiền</span>
                  <ul>
                    <li>
                      <Check size={16} />
                      {p.groups === 1
                        ? "Một nhóm bạn chọn"
                        : "Sáu nhóm nội dung"}
                    </li>
                    <li>
                      <Check size={16} />
                      {p.accessDays} ngày truy cập
                    </li>
                    <li>
                      <Check size={16} />
                      Dữ kiện và căn cứ engine
                    </li>
                    <li>
                      <Check size={16} />
                      Đọc trên web, liên kết qua email
                    </li>
                  </ul>
                  <p>
                    {p.id === "year"
                      ? "Lưu một năm đã chọn; luận vận năm chưa khả dụng."
                      : p.scope}
                  </p>
                  <span className="choice-label">
                    {chosen === p.id ? "Đã chọn" : "Chọn gói demo"}
                  </span>
                </button>
              ))}
            </div>
            <section className="card checkout">
              <h2>Nhận kết quả của bạn</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void createOrder();
                }}
              >
                <div className="field-grid">
                  {chosen === "topic" && (
                    <label>
                      Chủ đề
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      >
                        {groups.map((g) => (
                          <option key={g}>{g}</option>
                        ))}
                      </select>
                    </label>
                  )}
                  {chosen === "year" && (
                    <label>
                      Năm trong phạm vi đơn
                      <input
                        type="number"
                        min="1900"
                        max="2099"
                        required
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                      />
                    </label>
                  )}
                  <label className="full">
                    Email nhận kết quả
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="ban@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                </div>
                <p className="caption">
                  Chưa có thời gian xử lý cam kết. Demo ghi email vào hộp thư
                  cục bộ; không gửi email thật. Biểu đồ điểm chưa khả dụng và
                  không được tính vào nội dung cung cấp.
                </p>
                <button
                  className="primary wide"
                  disabled={busy || !demoEnabled}
                >
                  {busy
                    ? "Đang tạo đơn…"
                    : demoEnabled
                      ? "Tiếp tục thanh toán QR demo"
                      : "Chưa mở bán"}
                </button>
              </form>
            </section>
          </>
        )}
        {step === 3 && !order && (
          <div className="empty">
            <p>
              {error
                ? "Không thể truy cập đơn trên thiết bị này. Dùng “Tìm báo cáo” để xác thực lại."
                : "Đang tải đơn đã lưu…"}
            </p>
            <button
              className="text-button"
              onClick={() => {
                localStorage.removeItem("tuvi-order");
                setOrderId("");
                setStep(0);
                setError("");
              }}
            >
              Về trang nhập thông tin
            </button>
          </div>
        )}
        {step === 3 && order && (
          <>
            <section className="card payment-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">ĐƠN DEMO · {order.order.code}</span>
                  <h2>{order.order.package.name}</h2>
                </div>
                <strong className="price">{money(order.order.amount)}</strong>
              </div>
              {order.order.paymentStatus === "pending" ? (
                <div className="payment-grid">
                  <div className="qr-area">
                    {order.payment && (
                      <img
                        width="240"
                        height="240"
                        src={order.payment.qr}
                        alt="QR mô phỏng cho đơn hàng, không dùng để chuyển tiền"
                      />
                    )}
                    <span className="badge">
                      QR MÔ PHỎNG · KHÔNG CHUYỂN TIỀN
                    </span>
                    {order.payment && (
                      <a
                        className="text-button"
                        href={order.payment.qr}
                        download={`${order.order.code}.png`}
                      >
                        <Download size={17} />
                        Lưu QR demo
                      </a>
                    )}
                  </div>
                  <div>
                    <span className="status">Đang chờ thanh toán</span>
                    <p>{order.payment?.recipient}</p>
                    <dl>
                      <dt>Nội dung</dt>
                      <dd>
                        {order.order.code}
                        <button
                          className="icon-button"
                          aria-label="Sao chép nội dung chuyển khoản"
                          onClick={() =>
                            void act(async () => {
                              await navigator.clipboard.writeText(
                                order.order.code,
                              );
                              setNotice("Đã sao chép nội dung.");
                            })
                          }
                        >
                          <Copy size={17} />
                        </button>
                      </dd>
                      <dt>Hạn thanh toán</dt>
                      <dd>
                        {new Date(order.order.expiresAt).toLocaleString(
                          "vi-VN",
                          { timeZone: "Asia/Ho_Chi_Minh" },
                        )}{" "}
                        (UTC+7)
                      </dd>
                    </dl>
                    <p className="caption">
                      QR không phải bằng chứng nhận tiền. Chưa hỗ trợ mở ứng
                      dụng ngân hàng trên cùng điện thoại trong bản demo.
                    </p>
                    <button
                      className="primary wide"
                      disabled={
                        busy ||
                        !demoEnabled ||
                        new Date(order.order.expiresAt).getTime() < Date.now()
                      }
                      onClick={() =>
                        void act(async () => {
                          const r = await api("mock-pay", { id: orderId });
                          if (
                            r.status !== "accepted" &&
                            r.status !== "duplicate"
                          )
                            throw new Error(
                              "Giao dịch cần đối soát: " + r.status,
                            );
                          setOrder(await api("order?id=" + orderId));
                        })
                      }
                    >
                      {new Date(order.order.expiresAt).getTime() < Date.now()
                        ? "Đơn đã hết hạn"
                        : busy
                          ? "Đang xác minh…"
                          : "Mô phỏng webhook đã nhận tiền"}
                    </button>
                    <small>
                      Chỉ có trong development. Không phát sinh giao dịch ngân
                      hàng.
                    </small>
                  </div>
                </div>
              ) : (
                <>
                  <div className="alert success">
                    <Check size={20} />
                    Đã ghi nhận thanh toán mô phỏng. Không cần trả tiền lại.
                  </div>
                  <div className="progress-list">
                    {[
                      ["Thanh toán", order.order.paymentStatus === "paid"],
                      ["Tạo báo cáo", order.order.reportStatus === "ready"],
                      ["Email cục bộ", order.order.emailStatus === "local"],
                    ].map(([name, done]) => (
                      <div key={String(name)}>
                        <span className={done ? "complete-dot" : "pending-dot"}>
                          {done ? <Check size={16} /> : <span>·</span>}
                        </span>
                        <b>{name}</b>
                        <span>
                          {done
                            ? "Hoàn tất"
                            : name === "Tạo báo cáo" &&
                                order.order.reportStatus === "failed"
                              ? "Tạo báo cáo chưa thành công"
                              : name === "Tạo báo cáo" &&
                                  order.order.reportStatus === "retry"
                                ? "Đang chờ thử lại tự động"
                                : name === "Email cục bộ" &&
                                    order.order.emailStatus === "failed"
                                  ? "Lưu email chưa thành công"
                                  : "Đang chờ xử lý"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="caption">
                    Trạng thái lấy từ server. Bạn có thể đóng trang và quay lại.
                    Email demo được lưu tại .local/mail; chưa gửi đến hộp thư
                    thật.
                  </p>
                  {order.order.reportStatus === "failed" && (
                    <button
                      className="secondary"
                      disabled={busy}
                      onClick={() =>
                        void act(async () => {
                          await api("retry", { id: orderId });
                          setNotice("Đã đưa báo cáo vào hàng đợi lại.");
                        })
                      }
                    >
                      Thử tạo lại báo cáo
                    </button>
                  )}
                  {["local", "failed"].includes(order.order.emailStatus) && (
                    <button
                      className="text-button"
                      disabled={busy}
                      onClick={() =>
                        void act(async () => {
                          await api("resend", { id: orderId });
                          setNotice(
                            "Đã yêu cầu tạo lại email. Tối đa 3 lần / 10 phút.",
                          );
                        })
                      }
                    >
                      <Mail size={16} />
                      Gửi lại liên kết
                    </button>
                  )}
                </>
              )}
            </section>
            {order.chartSnapshot && (
              <details className="card">
                <summary>Mở lá số đã lưu cùng báo cáo</summary>
                <Chart snapshot={order.chartSnapshot} />
                <button
                  onClick={() => {
                    setBirth({
                      ...order.chartSnapshot!.normalized,
                      profile: "tanbien-vn-trial-v2",
                    });
                    setStep(0);
                    setSnapshot(null);
                  }}
                >
                  Tạo lá số mới từ cùng thông tin — giữ báo cáo cũ
                </button>
              </details>
            )}
            {order.report && <CustomerReport report={order.report} />}
            <button
              className="text-button"
              onClick={() => {
                localStorage.removeItem("tuvi-order");
                setOrderId("");
                setOrder(null);
                setStep(0);
              }}
            >
              <RotateCcw size={16} />
              Lập một lá số khác
            </button>
          </>
        )}
        <section className="method" id="phuong-phap">
          <div>
            <span className="eyebrow">VÌ SAO CÓ THỂ ĐỐI CHIẾU?</span>
            <h2>Mỗi kết quả đều có nguồn gốc.</h2>
            <p>
              Engine tính toán. Quy tắc tạo nhận định. Template diễn đạt. AI
              không an sao, tính vận hoặc cho điểm.
            </p>
          </div>
          <div>
            <details>
              <summary>Quy ước và giới hạn hiện tại</summary>
              <p>
                Phương pháp lịch UTC+7 dùng Astronomy Engine 2.1.19 tính sóc và
                trung khí, hỗ trợ ngày dương 1976–2050 (loại trường hợp sát ranh
                giới chưa xác minh). Đổi ngày 00:00, năm đổi mùng 1 Tết, tháng
                nhuận lặp số tháng khi an sao. Giờ 23:00 thuộc chi Tý của ngày
                đang khai báo. Chưa hiệu chỉnh giờ mặt trời.
              </p>
              <p>
                iztro 2.6.1 an sao qua cầu nối lịch riêng; chuyển lịch Trung
                Quốc bị chặn khi dùng lịch UTC+7. Phương pháp Trung Quốc cũ vẫn
                riêng biệt, không tự thay thế khi gặp lỗi. Đối chiếu nguồn lịch
                không đồng nghĩa chuyên gia xác nhận lá số.
              </p>
              <a
                href="https://docs.iztro.com/quick-start"
                target="_blank"
                rel="noreferrer"
              >
                Tài liệu iztro
              </a>
            </details>
            <details>
              <summary>Bảo mật và lưu giữ dữ liệu</summary>
              <p>
                Đơn lưu nguyên thông tin đã xác nhận. Sửa lá số mới không thay
                đổi đơn cũ. Quyền truy cập theo gói; liên kết email dùng một lần
                trong 15 phút. Không đưa ngày sinh vào URL.
              </p>
              <p>
                Bản demo lưu dữ liệu cục bộ để kiểm thử. Chủ vận hành có lệnh
                xóa đơn và dọn dữ liệu sau 90 ngày; cần thiết lập lịch dọn tự
                động và chính sách được duyệt trước khi mở bán.
              </p>
            </details>
            <details>
              <summary>Điều gì chưa được kiểm chứng?</summary>
              <p>
                Test phần mềm kiểm tra hành vi mã nguồn, không chứng minh năng
                lực dự đoán. Chưa có ca xác nhận bởi chuyên gia độc lập, bộ luận
                giải được duyệt hoặc phương pháp điểm được duyệt. Chưa thu tiền
                thật.
              </p>
            </details>
          </div>
        </section>
      </main>
      <footer>
        <a className="logo" href="/">
          <img className="tinhluan-logo" src="/images/tinhluan.png" alt="Tinh Luận — tinhluan.com" width="2043" height="770"/>
        </a>
        <p>{brand.tagline}</p>
        <span>Tham khảo truyền thống · Tôn trọng lựa chọn cá nhân</span>
      </footer>
    </>
  );
}
