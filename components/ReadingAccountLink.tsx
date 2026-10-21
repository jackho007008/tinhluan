'use client';
export default function ReadingAccountLink({url,children}:{url:string;children:React.ReactNode}){
 return <a href={'/la-so-cua-toi?returnTo='+encodeURIComponent(url)} onClick={e=>{
  // Carry a structural reading anchor through OAuth; no birth information or credentials in this URL.
  e.currentTarget.href='/la-so-cua-toi?returnTo='+encodeURIComponent(url+window.location.hash);
 }}>{children}</a>;
}
