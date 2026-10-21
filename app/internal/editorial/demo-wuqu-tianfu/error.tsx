"use client";
export default function ReadingError({ reset }: { reset: () => void }) {
  return (
    <main className="reading-shell">
      <h1>Chưa tải được bản đọc</h1>
      <p role="alert">
        Có lỗi khi tải bản đọc đang chọn. Đây không phải kết quả “không có rule
        khớp”.
      </p>
      <button className="primary" onClick={() => reset()}>
        Thử tải lại bản đọc
      </button>
      <p>
        <a href="/internal">Quay về kiểm tra nội bộ</a>
      </p>
    </main>
  );
}
