import {defineMiddleware} from 'astro:middleware';
import {publicContent,actor,contentState,configured,localMode} from './admin/server';
export const onRequest=defineMiddleware(async(ctx,next)=>{
 if(/^\/(uz|ru)(\/|$)/.test(ctx.url.pathname)){
  try{
   if(ctx.url.searchParams.get('preview')==='draft'){ctx.locals.content=(await contentState(await actor(ctx as any))).draft;ctx.locals.preview=true;}
   else ctx.locals.content=await publicContent();
  }catch{return new Response('Sayt ma’lumotlari yuklanmadi. Keyinroq urinib ko‘ring.',{status:503,headers:{'Cache-Control':'no-store'}});}
 }
 const response=await next();
 if(ctx.url.pathname.startsWith('/admin')||ctx.url.pathname.startsWith('/api')||ctx.locals.preview)response.headers.set('Cache-Control','no-store');
 else if(configured()&&!localMode())response.headers.set('Cache-Control','public, max-age=0, s-maxage=30, stale-if-error=300');
 return response;
});
