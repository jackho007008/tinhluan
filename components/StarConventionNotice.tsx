import type { ChartSnapshot } from "@/lib/tuvi-engine";
import { disputedStars } from "@/lib/chart-presentation";
export default function StarConventionNotice({
  snapshot,
}: {
  snapshot: ChartSnapshot;
}) {
  if (snapshot.chart.tanBien)
    return (
      <details className="notice" data-star-convention>
        <summary>Phạm vi Linh Tinh / Thiên Quý trong profile mới</summary>
        <p>
          Hỏa/Linh đã tính theo §8.6.3 Tân Biên. Thiên Quý giữ iztro như quy ước
          bổ sung chưa chốt; không chạy các rule phối hợp Toàn Thư trên profile
          này.
        </p>
      </details>
    );
  const stars = disputedStars(snapshot);
  if (!stars.length) return null;
  return (
    <details className="notice" data-star-convention>
      <summary>Phạm vi đối chiếu Linh Tinh / Thiên Quý</summary>
      <p>
        {stars.join("; ")} theo snapshot. Phép an hai sao đang được đối chiếu
        với Tân Biên; không dùng ghi chú này để thay vị trí hoặc kết luận tác
        động.
      </p>
      <p>
        Linh Tinh có thể ảnh hưởng điều kiện nhóm Tử Vi–phụ tá của catalog Toàn
        Thư qua nhóm sao tại Mệnh; kết quả đó cần giữ trạng thái thử nghiệm
        trong lúc chốt quy ước. Thiên Quý chưa là điều kiện nhận định trong
        catalog hiện tại. Các rule Tân Biên hiện không dùng hai sao làm điều
        kiện.
      </p>
    </details>
  );
}
