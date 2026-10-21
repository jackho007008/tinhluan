"use client";
import { useState, useEffect, type ReactNode } from "react";
export default function InternalForm({
  action,
  children,
}: {
  action: string;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <form
      action={action}
      method="post"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        const body = new URLSearchParams();
        new FormData(event.currentTarget).forEach((v, k) =>
          body.set(k, String(v)),
        );
        try {
          const res = await fetch(action, { method: "POST", body });
          if (!res.ok)
            throw Error(
              res.status === 403
                ? "Địa chỉ truy cập không được cấu hình cho đăng nhập nội bộ. Hãy mở địa chỉ được chủ dự án cho phép."
                : res.status === 429
                  ? "Thử lại sau 10 phút."
                  : res.status === 503
                    ? "Dịch vụ đăng nhập tạm thời không khả dụng. Vui lòng thử lại sau khi máy chủ được khôi phục."
                  : "Không thể xác thực. Vui lòng thử lại.",
            );
          window.location.assign(
            new URL(res.url).pathname + new URL(res.url).search,
          );
        } catch (e) {
          setError(e instanceof TypeError ? "Không thể kết nối. Vui lòng thử lại." : e instanceof Error ? e.message : "Không thể kết nối.");
          setBusy(false);
        }
      }}
    >
      <fieldset
        disabled={busy || !ready}
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        {children}
      </fieldset>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
