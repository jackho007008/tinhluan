/** One-page A4 PDF containing the exact rendered sheet raster, with 8mm margins.
 * No font substitution or second layout/calculation path. JPEG bytes come from
 * the same 2400x3520 canvas used by the PNG export. */
export function sheetPdf(jpeg:Uint8Array,width=2400,height=3520):Uint8Array {
 const enc=new TextEncoder(),chunks:Uint8Array[]=[],offsets=[0];let length=0;
 const add=(v:string|Uint8Array)=>{const b=typeof v==='string'?enc.encode(v):v;chunks.push(b);length+=b.length;};
 const obj=(n:number,body:string)=>{offsets[n]=length;add(`${n} 0 obj\n${body}\nendobj\n`);};
 add('%PDF-1.4\n');
 obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
 obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
 obj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
 offsets[4]=length;add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);add(jpeg);add('\nendstream\nendobj\n');
 const scale=Math.min((595.28-45.36)/width,(841.89-45.36)/height),w=width*scale,h=height*scale;
 const stream=`q ${w} 0 0 ${h} ${(595.28-w)/2} ${(841.89-h)/2} cm /Im0 Do Q\n`;
 obj(5,`<< /Length ${enc.encode(stream).length} >>\nstream\n${stream}endstream`);
 const xref=length;add('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)add(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);
 add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
 const out=new Uint8Array(length);let cursor=0;for(const chunk of chunks){out.set(chunk,cursor);cursor+=chunk.length;}return out;
}
