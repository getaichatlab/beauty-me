import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import {loadEnv} from 'vite';
import {fileURLToPath} from 'node:url';
let development=false,dynamic=false;
const managedRoutes={name:'beauty-me-managed-routes',hooks:{
 'astro:config:setup':({command,config})=>{development=command==='dev';const mode=config.vite.mode||process.env.NODE_ENV||(development?'development':'production');dynamic=loadEnv(mode,fileURLToPath(config.root),'PUBLIC_CONTENT_MODE').PUBLIC_CONTENT_MODE==='dynamic';},
 'astro:route:setup':({route})=>{if(route.component.replaceAll('\\','/').endsWith('/[lang]/[...path].astro'))route.prerender=!development&&!dynamic;},
}};
export default defineConfig({ output: 'static', adapter:netlify({devFeatures:false,excludeFiles:['.local-admin/**','LOCAL_ADMIN_ACCESS.md','.env*']}), integrations:[react(),managedRoutes], trailingSlash: 'always', devToolbar: { enabled: false } });
