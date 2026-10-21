import {it,expect} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ArticleBody,{articleBlocks} from '../components/encyclopedia/ArticleBody';
const content={title:'Bảng định nghĩa',slug:'bang-dinh-nghia',category:'Kiến thức nền' as const,description:'Fixture hiển thị, không phải bài chuyên môn.',body:'',references:'Nguồn fixture'};
const render=(body:string,preview=false)=>renderToStaticMarkup(createElement(ArticleBody,{content:{...content,body},preview}));
it('renders every cell in a four-column table without requiring blank lines around it',()=>{
 const body='## Bốn khái niệm\nĐoạn dẫn.\n| Khái niệm | Ý nghĩa | Căn cứ | Không thay |\n| --- | :--- | :---: | ---: |\n| Bản Mệnh | Nạp âm | Can chi | Cung |\n| Cục | Phân loại | Can và cung | Mệnh |\nĐoạn tiếp.\n### Giới hạn\nGiữ riêng.';
 const blocks=articleBlocks(body),table=blocks.find(b=>b.kind==='table');
 expect(table?.kind).toBe('table');if(table?.kind!=='table')throw Error('table missing');
 expect(table.header).toEqual(['Khái niệm','Ý nghĩa','Căn cứ','Không thay']);expect(table.rows).toEqual([['Bản Mệnh','Nạp âm','Can chi','Cung'],['Cục','Phân loại','Can và cung','Mệnh']]);
 const html=render(body);expect(html.match(/scope="col"/g)).toHaveLength(4);expect(html.match(/<td /g)).toHaveLength(8);expect(html).toContain('tabindex="0"');expect(html).toContain('<h3');expect(html).toContain('Đoạn tiếp.');
});
it('preserves literal escaped pipes, empty cells and alignment without executing cell content',()=>{
 const body='Tên | Nội dung\n--- | ---:\nA \\| B | <img src=x onerror=alert(1)>\n| | [bấm](javascript:alert(2)) |';
 const table=articleBlocks(body)[0];expect(table.kind).toBe('table');if(table.kind!=='table')throw Error('table missing');expect(table.rows[0][0]).toBe('A | B');expect(table.rows[1][0]).toBe('');
 const html=render(body);expect(html).toContain('&lt;img');expect(html).not.toContain('<img');expect(html).not.toContain('href="javascript:');expect(html).toContain('text-align:right');
});
it('keeps malformed tables and ordinary pipe text visible without losing excess cells',()=>{
 for(const body of ['A | B\n--- | ---\n1 | 2 | KHÔNG ĐƯỢC MẤT','A | B\n--- | nope\n1 | 2','Đoạn | có dấu phân cách.']){expect(render(body)).not.toContain('<table>');expect(articleBlocks(body).map(b=>b.text).join('\n')).toBe(body);}
});
it('supports ordered and unordered lists, headings and paragraphs with the same safe text policy',()=>{
 const html=render('## Danh sách\n- Điều kiện\n- <script>alert(1)</script>\n\n3. Ngoại lệ\n4. Giới hạn\n\nĐoạn cuối.');
 expect(html).toContain('<ul');expect(html).toContain('<ol class="ency-list" start="3"');expect(html.match(/<li>/g)).toHaveLength(4);expect(html).toContain('&lt;script&gt;');expect(html).not.toContain('<script>');expect(html).toContain('Đoạn cuối.');
});
it('preview and public keep identical article markup except the draft notice',()=>{
 const body='## Bảng\n\n| A | B |\n| --- | --- |\n| Điều kiện | Ngoại lệ |\n\n- Ý còn lại';
 expect(render(body,true).replace('<p class="ency-notice">Xem trước bản nháp · Chưa phải bài công khai</p>','')).toBe(render(body));
});

it('links only exact, unique published titles in related lists, keeps text and suffixes intact',()=>{
 const targets=[{title:'Bài công khai',slug:'bai-cong-khai'},{title:'Tên trùng',slug:'mot'},{title:'Tên trùng',slug:'hai'},{title:'URL xấu',slug:'../internal'}];
 const body='## Nội dung\n- Bài công khai\n\n## Bài liên quan\n- Bài công khai — giải thích thêm.\n- Bài nháp.\n- Bài ẩn.\n- Tên trùng\n- URL xấu\n- [admin](/internal/admin)\n- [ngoài](https://example.com)\n- Bài công khai giả\n\n## Kết\n- Bài công khai';
 const html=renderToStaticMarkup(createElement(ArticleBody,{content:{...content,body},publishedArticles:targets}));
 expect(html.match(/href="\/toan-thu\//g)).toHaveLength(1);
 expect(html).toContain('<a href="/toan-thu/bai-cong-khai">Bài công khai</a> — giải thích thêm.');
 expect(html).toContain('<li>Bài nháp.</li>');expect(html).toContain('<li>Bài ẩn.</li>');
 expect(html).not.toContain('href="/internal');expect(html).not.toContain('href="https:');
 expect(html).toContain('<li>Tên trùng</li>');expect(html).toContain('<li>URL xấu</li>');
 const preview=renderToStaticMarkup(createElement(ArticleBody,{content:{...content,body},publishedArticles:targets,preview:true}));
 expect(preview.replace('<p class="ency-notice">Xem trước bản nháp · Chưa phải bài công khai</p>','')).toBe(html);
});
it('two-column tables fit while four-column tables retain their own scroll hint',()=>{
 expect(render('A | B\n--- | ---\n1 | 2')).toContain('data-columns="2"');
 expect(render('A | B\n--- | ---\n1 | 2')).not.toContain('ency-table-hint');
 expect(render('A | B | C | D\n--- | --- | --- | ---\n1 | 2 | 3 | 4')).toContain('data-columns="4"');
 expect(render('A | B | C | D\n--- | --- | --- | ---\n1 | 2 | 3 | 4')).toContain('ency-table-hint');
});
