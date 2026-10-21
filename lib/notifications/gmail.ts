import nodemailer from 'nodemailer';
import {z} from 'zod';
import type {EmailProvider} from './index';

/** QA-only Gmail transport. Recipient pinning is mandatory, never a bulk sender. */
export function gmailQaConfig(){
 const user=(process.env.GMAIL_SMTP_USER||'').trim().toLowerCase();
 const pass=(process.env.GMAIL_SMTP_APP_PASSWORD||'').replace(/\s/g,'');
 const recipient=(process.env.GMAIL_SMTP_TEST_TO||'').trim().toLowerCase();
 let origin:URL;try{origin=new URL(process.env.RECOVERY_ORIGIN||'');}catch{throw Error('GMAIL_CONFIG_INVALID');}
 if(process.env.EMAIL_PROVIDER!=='gmail-smtp'||process.env.GMAIL_SMTP_ENABLED!=='true'||
  !z.string().email().safeParse(user).success||!user.endsWith('@gmail.com')||
  !/^[a-zA-Z0-9]{16}$/.test(pass)||!z.string().email().safeParse(recipient).success||
  origin.protocol!=='https:'||origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash||
  ['localhost','127.0.0.1','[::1]'].includes(origin.hostname))throw Error('GMAIL_CONFIG_INVALID');
 return {user,pass,recipient,origin:origin.origin};
}
export const gmailEmail:EmailProvider={async send(m){
 const config=gmailQaConfig();
 if(m.to.trim().toLowerCase()!==config.recipient)throw Error('GMAIL_RECIPIENT_NOT_ALLOWED');
 let link:URL;try{link=new URL(m.link);}catch{throw Error('GMAIL_LINK_INVALID');}
 if(link.origin!==config.origin||link.pathname!=='/recover'||link.username||link.password||
  !['','?reading=1'].includes(link.search)||!/^#[A-Za-z0-9_-]{43}$/.test(link.hash)||
  !z.string().uuid().safeParse(m.id).success)throw Error('GMAIL_LINK_INVALID');
 const transport=nodemailer.createTransport({
  host:'smtp.gmail.com',port:587,secure:false,requireTLS:true,ignoreTLS:false,
  auth:{user:config.user,pass:config.pass},
  tls:{rejectUnauthorized:true,minVersion:'TLSv1.2',servername:'smtp.gmail.com'},
  logger:false,debug:false,disableFileAccess:true,disableUrlAccess:true,
  connectionTimeout:15000,greetingTimeout:15000,socketTimeout:30000,
 });
 try{
  const result=await transport.sendMail({
   from:{name:'Tinh Luận',address:config.user},to:config.recipient,
   envelope:{from:config.user,to:[config.recipient]},
   messageId:`<${m.id}@gmail.com>`,subject:'Tinh Luận — Mở lại bản đọc của bạn',
   text:'Mở liên kết dưới đây rồi bấm Tiếp tục để xác minh email hoặc mở lại bản đọc đã lưu.\n\n'+m.link+
    '\n\nLiên kết dùng một lần, có hiệu lực tối đa 15 phút và không vượt hạn quyền đọc. Nếu bạn không yêu cầu thư này, hãy bỏ qua.',
  });
  if(!result.accepted.some(a=>typeof a==='string'&&a.toLowerCase()===config.recipient)||result.rejected.length)throw Error('SMTP_NOT_ACCEPTED');
 }catch{
  // Never propagate SMTP responses: they may include credentials, addresses or payload.
  throw Error('GMAIL_SMTP_FAILED');
 }finally{transport.close();}
}};
