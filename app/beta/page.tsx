import { betaEnabled } from "@/lib/beta/schema";
import BetaReader from "@/components/BetaReader";
export const dynamic = "force-dynamic";
export default function BetaPage() {
  if (!betaEnabled())
    return (
      <main className="reading-shell">
        <h1>Đợt đọc thử chưa được mở</h1>
        <p>
          Chủ dự án chưa phát hành chế độ đọc thử. Trang này không cung cấp nội
          dung dự thảo.
        </p>
      </main>
    );
  return <BetaReader />;
}
