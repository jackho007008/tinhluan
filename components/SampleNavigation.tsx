"use client";
import { useState, useEffect, type ReactNode } from "react";
export default function SampleNavigation({
  children,
  currentLabel,
}: {
  children: ReactNode;
  currentLabel: string;
}) {
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <form
      method="get"
      onSubmit={(event) => {
        if (!navigator.onLine) {
          event.preventDefault();
          setMessage(
            `Chưa có kết nối mạng. Bài bên dưới vẫn là ${currentLabel}. Kết nối lại rồi bấm Đối chiếu rule để thử lại.`,
          );
        }
      }}
    >
      <fieldset
        disabled={!ready}
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        {children}
      </fieldset>
      {message && <p role="alert">{message}</p>}
    </form>
  );
}
