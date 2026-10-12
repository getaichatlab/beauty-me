import fs from 'node:fs/promises';
import {PresentationFile,FileBlob} from '@oai/artifact-tool';
const deck=await PresentationFile.importPptx(await FileBlob.load('../output/Beauty-Me-Taklif-250-Sayqallangan.pptx'));
if(deck.slides.items.length!==6)throw new Error('Wrong slide count');
await fs.mkdir('offer-final-renders',{recursive:true});
for(const [i,slide]of deck.slides.items.entries()){
 const blob=await deck.export({slide,format:'png',scale:1.5});await fs.writeFile('offer-final-renders/slide-'+(i+1)+'.png',new Uint8Array(await blob.arrayBuffer()));
}
console.log('Final PPTX reimported; all 6 slides rendered.');
