import {it,expect,vi,beforeEach,afterEach} from 'vitest';
const mock=vi.hoisted(()=>({send:vi.fn(),close:vi.fn(),create:vi.fn()}));
vi.mock('nodemailer',()=>({default:{createTransport:mock.create}}));
import {gmailEmail} from '../lib/notifications/gmail';
import {sendEmail} from '../lib/notifications';
const m={id:'bd17f87f-e690-4e3f-9fa4-ed7393683ae9',to:'receiver@example.test',link:'https://qa.example.test/recover?reading=1#'+'x'.repeat(43)};
beforeEach(()=>{vi.clearAllMocks();for(const [k,v] of Object.entries({EMAIL_PROVIDER:'gmail-smtp',GMAIL_SMTP_ENABLED:'true',GMAIL_SMTP_USER:'sender@gmail.com',GMAIL_SMTP_APP_PASSWORD:'abcd efgh ijkl mnop',GMAIL_SMTP_TEST_TO:m.to,RECOVERY_ORIGIN:'https://qa.example.test'}))vi.stubEnv(k,v);mock.create.mockReturnValue({sendMail:mock.send,close:mock.close});mock.send.mockResolvedValue({accepted:[m.to],rejected:[]});});
afterEach(()=>vi.unstubAllEnvs());
it('uses mandatory STARTTLS587, certificate verification, fixed sender and private payload through existing dispatch',async()=>{
 await sendEmail(m);const config=mock.create.mock.calls[0][0];expect(config).toMatchObject({host:'smtp.gmail.com',port:587,secure:false,requireTLS:true,ignoreTLS:false,logger:false,debug:false,tls:{rejectUnauthorized:true,minVersion:'TLSv1.2',servername:'smtp.gmail.com'}});
 expect(config.auth).toEqual({user:'sender@gmail.com',pass:'abcdefghijklmnop'});
 const mail=mock.send.mock.calls[0][0];expect(mail.from).toEqual({name:'Tinh Luận',address:'sender@gmail.com'});expect(mail.envelope).toEqual({from:'sender@gmail.com',to:[m.to]});expect(mail.text).toContain(m.link);expect(mail.html).toBeUndefined();expect(mock.close).toHaveBeenCalledOnce();
});
it('fails closed for disabled/missing config and non-HTTPS or credential-bearing origins',async()=>{
 for(const [key,value] of [['GMAIL_SMTP_ENABLED','false'],['GMAIL_SMTP_USER','not-an-email'],['GMAIL_SMTP_APP_PASSWORD',''],['GMAIL_SMTP_TEST_TO',''],['RECOVERY_ORIGIN','http://qa.example.test'],['RECOVERY_ORIGIN','https://u:p@qa.example.test']]){
  const prior=process.env[key];vi.stubEnv(key,value);await expect(gmailEmail.send(m)).rejects.toThrow('GMAIL_CONFIG_INVALID');vi.stubEnv(key,prior);
 }expect(mock.create).not.toHaveBeenCalled();
});
it('never sends to another recipient or exposes a token to another host/path',async()=>{
 await expect(gmailEmail.send({...m,to:'other@example.test'})).rejects.toThrow('GMAIL_RECIPIENT_NOT_ALLOWED');
 for(const link of [m.link.replace('qa.example.test','evil.test'),m.link.replace('/recover','/other'),m.link+'&extra',m.link.replace('?reading=1','?token=private')])await expect(gmailEmail.send({...m,link})).rejects.toThrow('GMAIL_LINK_INVALID');
 expect(mock.create).not.toHaveBeenCalled();
});
it('sanitizes provider errors and permits retry; SMTP acceptance is not inbox delivery',async()=>{
 mock.send.mockRejectedValueOnce(Error('535 sensitive credential '+m.link));await expect(sendEmail(m)).rejects.toThrow(/^GMAIL_SMTP_FAILED$/);expect(mock.close).toHaveBeenCalledOnce();
 await expect(sendEmail(m)).resolves.toBeUndefined();expect(mock.send).toHaveBeenCalledTimes(2);
 mock.send.mockResolvedValueOnce({accepted:[],rejected:[m.to]});await expect(sendEmail(m)).rejects.toThrow(/^GMAIL_SMTP_FAILED$/);
});
