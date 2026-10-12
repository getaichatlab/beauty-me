import {cpSync,mkdirSync,readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
const fixture=join(root,'test-results','rebrand-check');
mkdirSync(fixture,{recursive:true});
for(const name of ['src','astro.config.mjs','tsconfig.json','package.json'])cpSync(join(root,name),join(fixture,name),{recursive:true});
mkdirSync(join(fixture,'public'),{recursive:true});
for(const name of ['favicon.svg','robots.txt','_headers','_redirects'])cpSync(join(root,'public',name),join(fixture,'public',name));
const configFile=join(fixture,'src/config/brand.ts');
let config=readFileSync(configFile,'utf8').replaceAll('Beauty Me','Satin Studio').replaceAll('beautyme_uz','satin_demo').replaceAll('+998 98 125 68 86','+998 90 000 00 00').replaceAll('+998981256886','+998900000000').replaceAll('202536941352','000000000000').replace("monogram: 'b'","monogram: 's'").replace("monogramSuffix: 'me'","monogramSuffix: 'studio'");
writeFileSync(configFile,config);
// Rebranding requires new business media. Exercise the empty-media fallback.
writeFileSync(join(fixture,'src/data/media.ts'),`export type MediaCategory='hair'|'nails'|'skin'|'brows'|'makeup'|'massage'|'interior';\nexport type MediaItem={id:string;src:string;sourceUrl:string;category:MediaCategory;title:{uz:string;ru:string};alt:{uz:string;ru:string};width:number;height:number;focus?:string;};\nexport const media:MediaItem[]=[];\n`);
const result=spawnSync(process.execPath,[join(root,'node_modules/astro/astro.js'),'build'],{cwd:fixture,env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'},encoding:'utf8'});
if(result.status!==0)throw new Error(result.stderr+result.stdout);
let count=0;
function check(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const file=join(dir,entry.name);if(entry.isDirectory())check(file);else if(file.endsWith('.html')){const html=readFileSync(file,'utf8');assert.ok(!/Beauty Me|BEAUTY ME|beautyme_uz|998981256886|98 125 68 86/.test(html),`Old branding in ${file}`);if(!html.includes('http-equiv="refresh"'))assert.ok(html.includes('Satin Studio'),file);count++;}}}
check(join(fixture,'dist'));
console.log(`Rebrand verified on ${count} pages in an isolated fixture. Original project unchanged.`);
