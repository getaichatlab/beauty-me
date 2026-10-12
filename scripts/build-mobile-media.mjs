// Generate delivery variants from existing public photos without replacing originals.
import sharp from 'sharp';
import {readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const entries=JSON.parse(readFileSync(join(root,'media-inbox/selection.json'),'utf8'));
let saved=0;
for(const item of entries){
  if(!/^[a-z0-9-]+$/.test(item.id))throw Error('Invalid media ID');
  const image=sharp(join(root,'public/media',item.id+'.webp'));
  const info=await image.metadata();
  if(info.width<=480)continue;
  await image.resize({width:960,withoutEnlargement:true}).webp({quality:78,effort:5}).toFile(join(root,'public/media',item.id+'-960.webp'));
  saved++;
}
console.log('Created '+saved+' mobile photo variants; full-size images retained.');
