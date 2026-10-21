import {beforeAll,afterAll,it,expect,vi} from 'vitest';
import {NextRequest} from 'next/server';
import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
import {pool} from '../lib/db';
import {testAdmin} from './helpers/admin';
import {issueReviewSession} from '../lib/internal-review/auth';
import {mutateArticle,getDraft,listPublished,getPublished,listDrafts,publishedArticleLinks} from '../lib/encyclopedia/model';
import {GET,POST} from '../app/api/internal-encyclopedia/route';
import {GET as PUBLIC} from '../app/api/toan-thu/route';
import {sameArticle} from '../lib/encyclopedia/schema';
import ArticleBody from '../components/encyclopedia/ArticleBody';
let session:string;
const content={title:'Cung Mệnh — kiểm thử',slug:'cung-menh-test',category:'Cung' as const,description:'Dữ liệu fixture kỹ thuật, không phải bài được duyệt.',body:'## Ý nghĩa\n\nGiữ điều kiện, không khẳng định cá nhân.\n\n## Giới hạn\n\nKhông tổng hợp toàn lá số.',references:'Nguồn fixture kiểm thử; không có phê duyệt.'};
beforeAll(async()=>{vi.stubEnv('INTERNAL_REVIEW_KEY','encyclopedia-test-secret-'.repeat(3));vi.stubEnv('APP_ORIGIN','http://localhost:3000');session=(await testAdmin()).token;});
afterAll(async()=>{vi.unstubAllEnvs();await pool.end();});
it('draft -> publish -> draft edit keeps public bytes -> republish versions -> hide retains history',async()=>{
 let a=await mutateArticle(session,{action:'create',content});
 expect(await getPublished(content.slug)).toBeNull();expect((await listPublished()).some(x=>x.id===a.id)).toBe(false);
 a=await mutateArticle(session,{action:'publish',id:a.id,revision:a.revision});const first=await getPublished(content.slug);expect(first?.content).toEqual(content);expect(first?.version).toBe(1);
 const changed={...content,slug:'cung-menh-test-moi',body:content.body+'\n\nChỉ hiện sau xuất bản.'};
 a=await mutateArticle(session,{action:'save',id:a.id,revision:a.revision,content:changed});
 expect(await getPublished(content.slug)).toEqual(first);expect(await getPublished(changed.slug)).toBeNull();
 expect((await getDraft(session,a.id))?.draft).toEqual(changed);
 a=await mutateArticle(session,{action:'publish',id:a.id,revision:a.revision});expect(await getPublished(content.slug)).toBeNull();expect((await getPublished(changed.slug))?.content).toEqual(changed);
 const versions=await pool.query('SELECT content FROM encyclopedia_versions WHERE article_id=$1 ORDER BY version',[a.id]);expect(versions.rows.map(r=>r.content)).toEqual([content,changed]);
 a=await mutateArticle(session,{action:'hide',id:a.id,revision:a.revision});expect(await getPublished(changed.slug)).toBeNull();expect((await listPublished()).some(x=>x.id===a.id)).toBe(false);expect((await getDraft(session,a.id))?.published_version).toBe(2);
 const r=await PUBLIC(new NextRequest('http://localhost/api/toan-thu?slug='+changed.slug));expect(r.status).toBe(404);expect(r.headers.get('cache-control')).toBe('no-store');
});
it('accentless search, category filter and public responses contain only the published version',async()=>{
 let a=await mutateArticle(session,{action:'create',content:{...content,slug:'search-cung-menh'}});a=await mutateArticle(session,{action:'publish',id:a.id,revision:a.revision});
 expect((await listPublished('cung menh','Cung')).some(r=>r.id===a.id)).toBe(true);expect(await listPublished('cung menh','Chính tinh')).toEqual([]);
 await mutateArticle(session,{action:'save',id:a.id,revision:a.revision,content:{...content,slug:'search-cung-menh',body:'SECRET DRAFT NỘI DUNG CHƯA XUẤT BẢN'}});
 const r=await PUBLIC(new NextRequest('http://localhost/api/toan-thu?q=cung%20menh'));const text=await r.text();expect(text).not.toContain('SECRET');expect(text).not.toContain('draft');
});
it('rejects unauthenticated/guest/expired reads and writes, checks Origin and validates bounded input',async()=>{
 for(const cookie of ['', 'tinhluan_trial=guest','tuvi_internal=forged','tuvi_internal='+issueReviewSession(Date.now()-7200000)]){
  expect((await GET(new NextRequest('http://localhost/api/internal-encyclopedia',{headers:{cookie}}))).status).toBe(403);
  expect((await POST(new NextRequest('http://localhost/api/internal-encyclopedia',{method:'POST',headers:{cookie},body:'{}'}))).status).toBe(403);
 }
 await expect(listDrafts(undefined)).rejects.toThrow('ADMIN_REQUIRED');
 const request=(body:string,origin='http://localhost:3000')=>new NextRequest('http://localhost:3000/api/internal-encyclopedia',{method:'POST',headers:{cookie:'tinhluan_customer='+session,origin,'Content-Type':'application/json'},body});
 expect((await POST(request('{}','https://attacker.invalid'))).status).toBe(403);
 expect((await POST(request('x'.repeat(200001)))).status).toBe(413);
 expect((await POST(request('{invalid'))).status).toBe(400);
 expect((await POST(request(JSON.stringify({action:'create',content:{...content,slug:'../../.env'}})))).status).toBe(400);
 expect((await POST(request(JSON.stringify({action:'create',content:{...content,slug:'valid-route'}})))).status).toBe(200);
});
it('concurrent/replayed publication does not duplicate versions; slug collision rolls back',async()=>{
 const a=await mutateArticle(session,{action:'create',content:{...content,slug:'unique-public'}});
 const p={action:'publish',id:a.id,revision:a.revision};const results=await Promise.allSettled([mutateArticle(session,p),mutateArticle(session,p)]);
 expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);expect(results.filter(r=>r.status==='rejected')).toHaveLength(1);
 expect((await pool.query('SELECT * FROM encyclopedia_versions WHERE article_id=$1',[a.id])).rows).toHaveLength(1);
 const other=await mutateArticle(session,{action:'create',content:{...content,slug:'unique-public'}});
 await expect(mutateArticle(session,{action:'publish',id:other.id,revision:other.revision})).rejects.toThrow('SLUG_IN_USE');
 expect((await pool.query('SELECT * FROM encyclopedia_versions WHERE article_id=$1',[other.id])).rows).toHaveLength(0);
 await expect(mutateArticle(session,{action:'save',id:a.id,revision:a.revision,content})).rejects.toThrow('STALE_REVISION');
});
it('renders author text safely, keeps headings/TOC and references without executable HTML or links',()=>{
 const html=renderToStaticMarkup(createElement(ArticleBody,{content:{...content,body:'## An toàn\n\n<script>alert(1)</script>\n\n<img src=x onerror=alert(2)>\n\n[click](javascript:alert(3))',references:'<iframe src="https://evil.invalid">'}}));
 expect(html).not.toContain('<script>');expect(html).not.toContain('<img');expect(html).not.toContain('<iframe');expect(html).not.toContain('href="javascript:');expect(html).toContain('&lt;script&gt;');expect(html).toContain('href="#section-0"');expect(html).toContain('id="references"');
});

it('compares draft fields independently of JSONB key order',()=>{expect(sameArticle(content,Object.fromEntries(Object.entries(content).reverse()) as typeof content)).toBe(true);expect(sameArticle(content,{...content,body:content.body+' edited'})).toBe(false);});

it('plain-text article still has a usable TOC and source destination',()=>{const html=renderToStaticMarkup(createElement(ArticleBody,{content:{...content,body:'Bài văn bản ngắn không có tiêu đề phụ.'}}));expect(html).toContain('href="#article-content"');expect(html).toContain('id="article-content"');expect(html).toContain('href="#references"');});

it('related links use the public version only and disappear on hide, without revealing draft targets',async()=>{
 let target=await mutateArticle(session,{action:'create',content:{...content,title:'Bài đích công khai',slug:'related-target'}});
 const draft=await mutateArticle(session,{action:'create',content:{...content,title:'Bài đích nháp',slug:'related-draft'}});
 const source={...content,body:'## Bài liên quan\n- Bài đích công khai.\n- Bài đích nháp.'};
 const html=async()=>renderToStaticMarkup(createElement(ArticleBody,{content:source,publishedArticles:await publishedArticleLinks()}));
 expect(await html()).not.toContain('href="/toan-thu/related-');
 target=await mutateArticle(session,{action:'publish',id:target.id,revision:target.revision});
 expect(await html()).toContain('href="/toan-thu/related-target"');
 expect((await getPublished('related-target'))?.content.title).toBe('Bài đích công khai');
 target=await mutateArticle(session,{action:'save',id:target.id,revision:target.revision,content:{...target.draft,title:'SECRET DRAFT TITLE',slug:'secret-draft-slug'}});
 expect(await html()).toContain('href="/toan-thu/related-target"');
 expect(JSON.stringify(await publishedArticleLinks())).not.toContain('SECRET');
 expect(await getPublished(draft.draft.slug)).toBeNull();
 expect((await PUBLIC(new NextRequest('http://localhost/api/toan-thu?slug=related-draft'))).status).toBe(404);
 target=await mutateArticle(session,{action:'hide',id:target.id,revision:target.revision});
 expect(await html()).not.toContain('href="/toan-thu/related-target"');
 expect((await PUBLIC(new NextRequest('http://localhost/api/toan-thu?slug=related-target'))).status).toBe(404);
});
