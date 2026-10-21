import CustomerShell from '@/components/CustomerShell';
import {trialEnabled} from '@/lib/trial/http';
import Experience from "@/components/Experience";
import { packages } from "@/lib/config";
export const dynamic = "force-dynamic";
export default function Page() {
  if(trialEnabled())return <CustomerShell publicTrial><main><section className="card"><h1>Lập lá số và đọc bản mệnh</h1><p>Nhập thông tin sinh, lập lá số và đọc báo cáo cơ bản hoặc chi tiết của bạn.</p><a className="button" href="/lap-la-so">Lập lá số miễn phí</a><p className="hint">Không cần tài khoản. Bản đọc tham khảo theo các phương pháp đang được hỗ trợ; chưa phải kết luận tổng hợp toàn lá số.</p></section></main></CustomerShell>;

  return (
    <Experience
      offers={packages}
      currentYear={Number(new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()))}
      demoEnabled={
        process.env.NODE_ENV !== "production" &&
        process.env.DEMO_ENABLED === "true"
      }
    />
  );
}
