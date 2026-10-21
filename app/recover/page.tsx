"use client";
import ReadingRecovery from "@/components/ReadingRecovery";
import CustomerShell from "@/components/CustomerShell";
import { useEffect, useRef, useState } from "react";
export default function Recover() {
  const once = useRef(false);
  const [readingMode,setReadingMode]=useState(false);
  const [message, setMessage] = useState(
    "Nhấn xác thực để sử dụng liên kết một lần.",
  );
  const [token, setToken] = useState("");
  useEffect(() => {
    if(new URLSearchParams(location.search).get("reading")==="1"){setReadingMode(true);return;}
    setToken(location.hash.slice(1));
    history.replaceState(null, "", "/recover");
  }, []);
  async function exchange() {
    if (once.current) return;
    once.current = true;
    setMessage("Đang xác thực…");
    try {
      const r = await fetch("/api/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      localStorage.setItem("tuvi-order", d.id);
      location.replace("/");
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  if(readingMode)return <CustomerShell publicTrial><main><ReadingRecovery/></main></CustomerShell>;
  return (
    <main className="recovery-page card">
      <h1>Truy cập báo cáo</h1>
      <p role="status">{message}</p>
      {token && (
        <button
          className="primary"
          onClick={() => void exchange()}
          disabled={once.current}
        >
          Xác thực liên kết
        </button>
      )}
      <p>
        <a href="/">Về trang chủ để yêu cầu liên kết mới</a>
      </p>
    </main>
  );
}
