import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
// Force the real production/unconfigured path; native processing must stay lazy.
const code=(await build({entryPoints:['src/pages/api/[...action].ts'],bundle:true,platform:'node',format:'cjs',write:false,packages:'external',define:{'import.meta.env.DEV':'false','import.meta.env':'{}','process.env':'{}'},plugins:[{name:'unavailable-native-image-module',setup(build){build.onResolve({filter:/^sharp$/},()=>({path:'sharp',namespace:'unavailable-native'}));build.onLoad({filter:/.*/,namespace:'unavailable-native'},()=>({contents:"throw new Error('Native image processing unavailable in this fixture'); export default null;",loader:'js'}));}}]})).outputFiles[0].text;
const module={exports:{}};
new Function('require','module','exports',code)(require,module,module.exports);
const {ALL}=module.exports;
const context=path=>({params:{action:path},request:new Request('https://example.test/api/'+path+'/'),url:new URL('https://example.test/api/'+path+'/'),cookies:{get(){return undefined;}}});
test('Unconfigured production session is readable without native image processing; admin remains protected',async()=>{
  const session=await ALL(context('auth/session'));
  assert.equal(session.status,200);assert.deepEqual(await session.json(),{user:null,mode:'unconfigured'});
  assert.equal(session.headers.get('cache-control'),'no-store');
  const content=await ALL(context('admin/content'));
  assert.equal(content.status,503);assert.match((await content.json()).error,/Supabase/);
});
