import {randomBytes,timingSafeEqual} from 'node:crypto';
import {OAuth2Client} from 'google-auth-library';
import {pool,rateLimit} from '../db';
import {googleConfig,safeReturn} from './config';
import {tokenHash} from './accounts';
const random=()=>randomBytes(32).toString('base64url');
export async function beginGoogle(returnTo:unknown){
 const cfg=googleConfig();if(!cfg)throw Error('GOOGLE_NOT_CONFIGURED');
 await rateLimit('customer:google:global',60);
 const state=random(),nonce=random(),verifier=random();
 await pool.query('DELETE FROM customer_oauth_flows WHERE expires_at<now()');
 await pool.query("INSERT INTO customer_oauth_flows(state_hash,nonce,verifier,return_to,expires_at) VALUES($1,$2,$3,$4,now()+interval '10 minutes')",[tokenHash(state),nonce,verifier,safeReturn(returnTo)]);
 const client=new OAuth2Client(cfg.id,cfg.secret,cfg.callback);
 const url=client.generateAuthUrl({scope:['openid','email','profile'],state,nonce,code_challenge:Buffer.from(tokenHash(verifier),'hex').toString('base64url'),code_challenge_method:'S256' as import('google-auth-library').CodeChallengeMethod,prompt:'select_account'});
 return {state,url};
}
export async function finishGoogle(query:URLSearchParams,cookie:string|undefined){
 const cfg=googleConfig();if(!cfg)throw Error('GOOGLE_NOT_CONFIGURED');
 const state=query.get('state');
 if(!state||!cookie||!/^[A-Za-z0-9_-]{43}$/.test(state)||!/^[A-Za-z0-9_-]{43}$/.test(cookie)||!timingSafeEqual(Buffer.from(state),Buffer.from(cookie)))throw Error('GOOGLE_FLOW_INVALID');
 // Consuming state even on cancellation prevents replay. Never log query/code/provider errors.
 const flow=(await pool.query('DELETE FROM customer_oauth_flows WHERE state_hash=$1 AND expires_at>now() RETURNING *',[tokenHash(state)])).rows[0];
 if(!flow)throw Error('GOOGLE_FLOW_INVALID');
 if(query.has('error'))return {cancelled:true as const,returnTo:safeReturn(flow.return_to)};
 const code=query.get('code');if(!code||code.length>4096)throw Error('GOOGLE_FLOW_INVALID');
 const client=new OAuth2Client(cfg.id,cfg.secret,cfg.callback);
 const {tokens}=await client.getToken({code,codeVerifier:flow.verifier,redirect_uri:cfg.callback});
 if(!tokens.id_token)throw Error('GOOGLE_IDENTITY_INVALID');
 // Library verifies Google signature, issuer, audience and expiry. Nonce binds this browser flow.
 const payload=(await client.verifyIdToken({idToken:tokens.id_token,audience:cfg.id})).getPayload();
 if(!payload?.sub||(payload as typeof payload & {nonce?:string}).nonce!==flow.nonce)throw Error('GOOGLE_IDENTITY_INVALID');
 return {cancelled:false as const,returnTo:safeReturn(flow.return_to),identity:{subject:payload.sub,email:payload.email_verified?payload.email:undefined,name:payload.name}};
}
