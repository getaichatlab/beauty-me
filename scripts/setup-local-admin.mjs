import {randomBytes,scryptSync} from 'node:crypto';
import {mkdirSync,existsSync,writeFileSync} from 'node:fs';
mkdirSync('.local-admin',{recursive:true});
if(existsSync('.local-admin/credentials.json')){console.log('Local admin already configured. See LOCAL_ADMIN_ACCESS.md.');process.exit(0);}
const password=randomBytes(12).toString('base64url'),salt=randomBytes(16).toString('hex');
writeFileSync('.local-admin/credentials.json',JSON.stringify({email:'owner@beautyme.local',salt,hash:scryptSync(password,salt,64).toString('hex'),secret:randomBytes(48).toString('hex')}),{mode:0o600});
writeFileSync('LOCAL_ADMIN_ACCESS.md',`# Faqat lokal administrator\n\nManzil: http://localhost:4322/admin/\n\nEmail: owner@beautyme.local\n\nParol: ${password}\n\nBu hisob Netlify’da ishlamaydi. Fayl va .local-admin papkasini tarqatmang.\n`,{mode:0o600});
console.log('Local credentials generated. Open LOCAL_ADMIN_ACCESS.md; no credentials are printed.');
