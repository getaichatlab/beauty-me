import sharp from 'sharp';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,sep,join} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const inputRoot=join(root,'media-inbox');
const entries=JSON.parse(readFileSync(join(inputRoot,'selection.json'),'utf8'));
mkdirSync(join(root,'public/media'),{recursive:true});
const output=[];
for(const entry of entries){
  if(!/^[a-z0-9-]+$/.test(entry.id))throw new Error('Invalid media ID');
  const input=resolve(inputRoot,entry.file);
  if(!input.startsWith(inputRoot+sep))throw new Error('Media file must stay in media-inbox');
  const image=sharp(input).rotate();
  const main=join(root,`public/media/${entry.id}.webp`);
  await image.clone().resize({width:1440,withoutEnlargement:true}).webp({quality:84,effort:5}).toFile(main);
  await image.clone().resize({width:480}).webp({quality:78,effort:5}).toFile(join(root,`public/media/${entry.id}-480.webp`));
  await image.clone().resize({width:960,withoutEnlargement:true}).webp({quality:78,effort:5}).toFile(join(root,`public/media/${entry.id}-960.webp`));
  const {width,height}=await sharp(main).metadata();
  const {file,...content}=entry;
  output.push({...content,src:`/media/${entry.id}.webp`,width,height});
}
writeFileSync(join(root,'src/data/media.ts'),`export type MediaCategory = 'hair' | 'nails' | 'skin' | 'brows' | 'makeup' | 'massage' | 'interior';\nexport type MediaItem = {id:string;src:string;sourceUrl:string;viaProfile?:string;category:MediaCategory;title:{uz:string;ru:string};alt:{uz:string;ru:string};width:number;height:number;focus?:string;};\n// Curated from the salon profile. Rebuild with node scripts/build-media.mjs.\nexport const media:MediaItem[] = ${JSON.stringify(output,null,2)};\n`);
console.log(`Optimized ${output.length} Instagram images with source attribution.`);
