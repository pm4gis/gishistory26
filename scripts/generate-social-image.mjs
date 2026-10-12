import sharp from 'sharp';
import {mkdir,readFile} from 'node:fs/promises';
const source='public/assets/social/nzgis-slate.svg';
const target='public/assets/social/nzgis-slate.png';
const svg=await readFile(source);
await mkdir('public/assets/social',{recursive:true});
const info=await sharp(svg,{density:144})
 .resize(1200,630,{fit:'fill'})
 .png({compressionLevel:9,palette:false})
 .toFile(target);
if(info.width!==1200||info.height!==630)throw new Error('Unexpected social PNG dimensions');
console.log('Social preview generated:',target,info.width+'x'+info.height,info.size+' bytes');
