import {z} from 'zod';
export const categories=['Chính tinh','Cung','Kiến thức nền'] as const;
export const articleSchema=z.object({
 title:z.string().trim().min(3).max(150),
 slug:z.string().trim().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
 category:z.enum(categories),description:z.string().trim().min(10).max(500),
 body:z.string().trim().min(20).max(40000),references:z.string().trim().min(5).max(6000)
}).strict();
export type ArticleContent=z.infer<typeof articleSchema>;

export const sameArticle=(a:ArticleContent,b:ArticleContent)=>Object.keys(articleSchema.shape).every(k=>a[k as keyof ArticleContent]===b[k as keyof ArticleContent]);
