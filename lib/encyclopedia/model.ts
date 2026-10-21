import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import {pool,transaction} from '@/lib/db';
import {requireAdmin,AdminAccessError} from '@/lib/admin/auth';
import {articleSchema,type ArticleContent} from './schema';
export {categories} from './schema';
export type {ArticleContent} from './schema';
export type Article={id:string;draft:ArticleContent;revision:number;published_version:number|null;published_slug:string|null;visible:boolean;created_at:string;updated_at:string};
export type Published={id:string;version:number;content:ArticleContent;published_at:string};
export class EncyclopediaError extends Error {constructor(public status:number,public code:string){super(code);}}
async function authorize(session:string|undefined){try{return await requireAdmin(session);}catch(e){if(e instanceof AdminAccessError)throw new EncyclopediaError(403,'ADMIN_REQUIRED');throw e;}}
export const normalizeSearch=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase();
export async function listDrafts(session:string|undefined){await authorize(session);return (await pool.query<Article>('SELECT * FROM encyclopedia_articles ORDER BY updated_at DESC,id')).rows;}
export async function getDraft(session:string|undefined,id:string){await authorize(session);if(!z.string().uuid().safeParse(id).success)throw new EncyclopediaError(400,'INVALID_ID');return (await pool.query<Article>('SELECT * FROM encyclopedia_articles WHERE id=$1',[id])).rows[0]??null;}
export async function mutateArticle(session:string|undefined,raw:unknown){
 const actor=await authorize(session);
 const input=z.discriminatedUnion('action',[
  z.object({action:z.literal('create'),content:articleSchema}).strict(),
  z.object({action:z.literal('save'),id:z.string().uuid(),revision:z.number().int().positive(),content:articleSchema}).strict(),
  z.object({action:z.enum(['publish','hide']),id:z.string().uuid(),revision:z.number().int().positive()}).strict()
 ]).safeParse(raw);
 if(!input.success)throw new EncyclopediaError(400,'INVALID_CONTENT');
 const d=input.data;
 try{return await transaction(async c=>{
  // Audit and mutation commit together; no draft text or source contents in log.
  const audited=async(a:Article)=>{await c.query("INSERT INTO admin_audit(id,actor_user_id,actor_kind,action,target_id,revision) VALUES($1,$2,'admin',$3,$4,$5)",[randomUUID(),actor.userId,'article.'+d.action,a.id,a.revision]);return a;};
  if(d.action==='create')return audited((await c.query<Article>('INSERT INTO encyclopedia_articles(id,draft) VALUES($1,$2) RETURNING *',[randomUUID(),d.content])).rows[0]);
  const a=(await c.query<Article>('SELECT * FROM encyclopedia_articles WHERE id=$1 FOR UPDATE',[d.id])).rows[0];
  if(!a)throw new EncyclopediaError(404,'NOT_FOUND');
  if(a.revision!==d.revision)throw new EncyclopediaError(409,'STALE_REVISION');
  if(d.action==='save')return audited((await c.query<Article>('UPDATE encyclopedia_articles SET draft=$2,revision=revision+1,updated_at=now() WHERE id=$1 RETURNING *',[a.id,d.content])).rows[0]);
  if(d.action==='hide')return audited((await c.query<Article>('UPDATE encyclopedia_articles SET visible=false,revision=revision+1,updated_at=now() WHERE id=$1 RETURNING *',[a.id])).rows[0]);
  const content=articleSchema.parse(a.draft);
  const version=(a.published_version??0)+1;
  await c.query('INSERT INTO encyclopedia_versions(article_id,version,draft_revision,content) VALUES($1,$2,$3,$4)',[a.id,version,a.revision,content]);
  return audited((await c.query<Article>('UPDATE encyclopedia_articles SET published_version=$2,published_slug=$3,visible=true,revision=revision+1,updated_at=now() WHERE id=$1 RETURNING *',[a.id,version,content.slug])).rows[0]);
 });}catch(e){if((e as {code?:string}).code==='23505')throw new EncyclopediaError(409,'SLUG_IN_USE');throw e;}
}
export async function listPublished(q='',category=''){
 const rows=(await pool.query<Published>('SELECT a.id,v.version,v.content,v.published_at FROM encyclopedia_articles a JOIN encyclopedia_versions v ON v.article_id=a.id AND v.version=a.published_version WHERE a.visible=true ORDER BY v.published_at DESC,a.id')).rows;
 const needle=normalizeSearch(q.slice(0,120).trim());
 return rows.filter(r=>(!category||r.content.category===category)&&normalizeSearch(r.content.title+' '+r.content.description+' '+r.content.body).includes(needle));
}
export async function getPublished(slug:string){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||slug.length>100)return null;
 return (await pool.query<Published>('SELECT a.id,v.version,v.content,v.published_at FROM encyclopedia_articles a JOIN encyclopedia_versions v ON v.article_id=a.id AND v.version=a.published_version WHERE a.visible=true AND a.published_slug=$1',[slug])).rows[0]??null;
}

// Reuse the public-version filter; never send draft titles/slugs to readers.
export async function publishedArticleLinks(){return (await listPublished()).map(r=>({title:r.content.title,slug:r.content.slug}));}
