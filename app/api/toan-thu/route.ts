import {NextRequest} from 'next/server';
import {getPublished,listPublished} from '@/lib/encyclopedia/model';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 const headers={'Cache-Control':'no-store'};
 try{const slug=req.nextUrl.searchParams.get('slug');const data=slug?await getPublished(slug):await listPublished(req.nextUrl.searchParams.get('q')||'',req.nextUrl.searchParams.get('category')||'');return Response.json(data??{error:'NOT_FOUND'},{status:data?200:404,headers});}
 catch{return Response.json({error:'UNAVAILABLE'},{status:503,headers});}
}
