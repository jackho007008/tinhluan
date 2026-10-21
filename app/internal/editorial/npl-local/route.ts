import {NextRequest,NextResponse} from 'next/server';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {reviewAuthorized} from '@/lib/internal-review/auth';
const pages=['hs-090','hs-132','npl-074','hs-167'];
export async function GET(req:NextRequest){
 if(!reviewAuthorized(req.cookies.get('tuvi_internal')?.value))return new NextResponse('Phiên nội bộ không hợp lệ.',{status:401});
 const images=await Promise.all(pages.map(async key=>{const bytes=await readFile(path.join(process.cwd(),'docs/evidence/npl-local',key+'.png'));return `<section id="${key}"><h2>${key.startsWith('hs')?'Tử Vi Hàm Số':'Tử Vi Tổng Hợp'} — Nguyễn Phát Lộc — PDF ${Number(key.slice(-3))}</h2><img alt="Ảnh trang nguồn ${key}" src="data:image/png;base64,${bytes.toString('base64')}" style="max-width:100%;height:auto"></section>`;}));
 return new NextResponse('<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Căn cứ P2 — Nguyễn Phát Lộc</title><main style="max-width:900px;margin:auto;font-family:system-ui"><h1>Ảnh nguồn P2</h1><p>Đối chiếu văn bản, chưa phê duyệt chuyên môn. Chỉ các trang quyết định, không phải toàn sách.</p>'+images.join('')+'</main></html>',{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}
