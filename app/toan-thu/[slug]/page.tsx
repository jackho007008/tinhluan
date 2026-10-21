import {notFound} from 'next/navigation';
import CustomerShell from '@/components/CustomerShell';
import ArticleBody from '@/components/encyclopedia/ArticleBody';
import {getPublished,publishedArticleLinks} from '@/lib/encyclopedia/model';
import '../style.css';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=await getPublished(slug);if(!article)notFound();return <CustomerShell publicTrial><main className="ency-shell"><a href="/toan-thu">← Toàn thư</a><ArticleBody content={article.content} publishedArticles={await publishedArticleLinks()}/><p className="ency-version">Bản {article.version} · Xuất bản {new Date(article.published_at).toLocaleDateString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}</p><a href="/toan-thu">← Trở về tra cứu</a></main></CustomerShell>;}
