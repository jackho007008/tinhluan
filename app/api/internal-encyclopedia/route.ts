import {NextRequest} from 'next/server';
import {EncyclopediaError,getDraft,listDrafts,mutateArticle} from '@/lib/encyclopedia/model';
import {adminIdentity} from '@/lib/admin/auth';
import {CUSTOMER_COOKIE} from '@/lib/customer-auth/config';
import {internalRequestOrigin} from '@/lib/internal-review/origin';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store','Vary':'Cookie'};
function failure(e:unknown){return Response.json({error:e instanceof EncyclopediaError?e.code:'STORAGE_UNAVAILABLE'},{status:e instanceof EncyclopediaError?e.status:503,headers});}
export async function GET(req:NextRequest){try{const session=req.cookies.get(CUSTOMER_COOKIE)?.value;const id=req.nextUrl.searchParams.get('id');const data=id?await getDraft(session,id):await listDrafts(session);return Response.json(data??{error:'NOT_FOUND'},{status:data?200:404,headers});}catch(e){return failure(e);}}
export async function POST(req:NextRequest){
 try{
  const session=req.cookies.get(CUSTOMER_COOKIE)?.value;
  if(!await adminIdentity(session))throw new EncyclopediaError(403,'ADMIN_REQUIRED');
  if(!internalRequestOrigin(req.headers.get('origin')))throw new EncyclopediaError(403,'INVALID_ORIGIN');
  if(!req.headers.get('content-type')?.startsWith('application/json'))throw new EncyclopediaError(415,'JSON_REQUIRED');
  // Bound bytes while streaming, before allocating or parsing the complete body.
  const reader=req.body?.getReader();if(!reader)throw new EncyclopediaError(400,'INVALID_CONTENT');
  const chunks:Uint8Array[]=[];let total=0;
  while(true){const r=await reader.read();if(r.done)break;total+=r.value.length;if(total>200000){await reader.cancel();throw new EncyclopediaError(413,'CONTENT_TOO_LARGE');}chunks.push(r.value);}
  let raw:unknown;try{raw=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new EncyclopediaError(400,'INVALID_CONTENT');}
  return Response.json(await mutateArticle(session,raw),{headers});
 }catch(e){return failure(e);}
}
