import {NextRequest} from 'next/server';
import {AdminAccessError,requireAdmin,parseQuery,adminReports,adminOrders,adminTransactions,adminOrder} from '@/lib/admin/operations';
import {dateBounds,adminData} from '@/lib/admin/extended';
import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 const headers={'Cache-Control':'private, no-store','Vary':'Cookie'};
 try{
  const session=req.cookies.get(CUSTOMER_COOKIE)?.value;await requireAdmin(session);
  let q;try{q=parseQuery(req.nextUrl.searchParams);dateBounds(q);}catch{return Response.json({error:'INVALID_QUERY'},{status:400,headers});}
  const data=await adminData(session,q);
  return Response.json(data??{error:'NOT_FOUND'},{status:data?200:404,headers});
 }catch(e){return Response.json({error:e instanceof AdminAccessError?'ADMIN_REQUIRED':'ADMIN_DATA_UNAVAILABLE'},{status:e instanceof AdminAccessError?403:503,headers});}
}
