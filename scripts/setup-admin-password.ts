/** Local operator setup: binds a new password to exactly one existing active admin; never grants roles. */
import {mkdir,writeFile} from 'node:fs/promises';
import {randomBytes,scryptSync} from 'node:crypto';
import path from 'node:path';
import {pool} from '../lib/db';
const dir=path.resolve(process.argv[2]||'.local/admin-password');
try{
 const rows=(await pool.query("SELECT DISTINCT user_id FROM admin_roles WHERE role='admin' AND revoked_at IS NULL")).rows;
 if(rows.length!==1)throw Error('Setup requires exactly one active admin. Configure explicit identity before proceeding.');
 const password=randomBytes(24).toString('base64url'),salt=randomBytes(16).toString('hex');
 const hash=scryptSync(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024}).toString('hex');
 await mkdir(dir,{recursive:true,mode:0o700});
 await writeFile(path.join(dir,'credential.json'),JSON.stringify({userId:rows[0].user_id,username:'admin',salt,hash}),{mode:0o600,flag:'wx'});
 await writeFile(path.join(dir,'LOGIN.txt'),'Username: admin\nPassword: '+password+'\n',{mode:0o600,flag:'wx'});
 console.log('Configured existing admin. Login details saved locally:',path.join(dir,'LOGIN.txt'));
}finally{await pool.end();}
