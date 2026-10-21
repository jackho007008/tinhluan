// Only server-selected published titles/slugs may become links. No author URL
// is interpreted; unrecognized/ambiguous titles remain ordinary React text.
export type PublishedArticleLink={title:string;slug:string};
export function relatedArticleLink(text:string,targets:PublishedArticleLink[]){
 const matches=targets.filter(t=>t.slug.length<=100&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t.slug)&&t.title.length>0&&
  (text===t.title||text===t.title+'.'||text.startsWith(t.title+' — ')));
 if(matches.length!==1)return null;
 const target=matches[0];
 return {title:target.title,href:'/toan-thu/'+target.slug,suffix:text.slice(target.title.length)};
}
