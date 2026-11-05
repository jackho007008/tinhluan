import { cookies } from 'next/headers';
import TrialHome from '@/components/TrialHome';
import { customerSession } from '@/lib/customer-auth/accounts';
import { CUSTOMER_COOKIE } from '@/lib/customer-auth/config';
import { recoveryEnabled } from '@/lib/trial/recovery';
import './trial-home.css';
import CustomerShell from '@/components/CustomerShell';
import {trialEnabled} from '@/lib/trial/http';
import Experience from "@/components/Experience";
import { packages } from "@/lib/config";
export const dynamic = "force-dynamic";
export default async function Page() {
  if (trialEnabled()) {
    const session = await customerSession((await cookies()).get(CUSTOMER_COOKIE)?.value);
    return <CustomerShell publicTrial home><TrialHome accountSignedIn={!!session} emailRecovery={recoveryEnabled()}/></CustomerShell>;
  }

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
