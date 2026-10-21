import {cookies} from 'next/headers';
import {reviewAuthorized} from '@/lib/internal-review/auth';
import CustomerShell from '@/components/CustomerShell';
import ReferenceBirthForm from '@/components/ReferenceBirthForm';
export const dynamic='force-dynamic';
export default async function Page(){
 if(!reviewAuthorized((await cookies()).get('tuvi_internal')?.value))return <main className="reading-shell"><h1>Cần quyền nội bộ</h1><a href="/internal">Đăng nhập nội bộ</a></main>;
 return <CustomerShell input><main><ReferenceBirthForm/></main></CustomerShell>;
}
