import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import sharp from 'sharp';
import {homeTopoMaps} from '../src/lib/home-topo-maps.mjs';

// Publicly readable Drive originals are retrieved only at build time.
// Never put a Google Drive file URL into the published HTML or browser script.
const folder=join('public','assets','home-topo');
await mkdir(folder,{recursive:true});

async function existingValid(path){
 try{
  const m=await sharp(await readFile(path)).metadata();
  return m.format==='webp'&&m.width===1400&&m.height===788;
 }catch{return false;}
}
async function fetchThumbnail(map){
 const url=new URL('https://drive.google.com/thumbnail');
 url.searchParams.set('id',map.driveId);
 url.searchParams.set('sz','w2400');
 let last;
 for(let attempt=1;attempt<=3;attempt++){
  try{
   const res=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(25000),headers:{Accept:'image/avif,image/webp,image/jpeg,image/png,image/*;q=0.8'}});
   if(!res.ok)throw new Error('HTTP '+res.status);
   const bytes=Buffer.from(await res.arrayBuffer());
   if(bytes.length<5000||bytes.length>20*1024*1024)throw new Error('unexpected download size '+bytes.length);
   const meta=await sharp(bytes,{failOn:'error',limitInputPixels:100000000}).metadata();
   if(!meta.width||!meta.height||meta.width<800||meta.height<800)throw new Error('source thumbnail is too small');
   return bytes;
  }catch(error){
   last=error;
   if(attempt<3)await new Promise(done=>setTimeout(done,attempt*1200));
  }
 }
 throw new Error('Cannot retrieve '+map.sourceTitle+' from public Google Drive thumbnail: '+String(last?.message||last));
}
async function processMap(map){
 const file=join(folder,map.id+'.webp');
 if(await existingValid(file))return 'cached';
 const source=await fetchThumbnail(map);
 const meta=await sharp(source).rotate().metadata();
 // Remove the printed sheet border and marginal legend. The central map is
 // then cropped to the fixed 16:9 title-media area without distortion.
 const inset=map.sourceTitle.endsWith('.png')?0.12:0.085;
 const left=Math.floor(meta.width*inset);
 const top=Math.floor(meta.height*inset);
 const width=Math.max(1,meta.width-2*left);
 const height=Math.max(1,meta.height-2*top);
 let output;
 for(const quality of [82,74,67,60]){
  output=await sharp(source,{failOn:'error',limitInputPixels:100000000})
   .rotate().extract({left,top,width,height})
   .resize(1400,788,{fit:'cover',position:'centre'})
   .webp({quality,effort:5}).toBuffer();
  if(output.length<=330*1024)break;
 }
 if(!output||output.length>450*1024)throw new Error('Hero crop too large: '+map.sourceTitle);
 const check=await sharp(output).metadata();
 if(check.format!=='webp'||check.width!==1400||check.height!==788)throw new Error('Invalid crop: '+map.sourceTitle);
 await writeFile(file,output);
 return Math.ceil(output.length/1024)+' KiB';
}
const successes=[];
for(let i=0;i<homeTopoMaps.length;i+=3){
 const batch=homeTopoMaps.slice(i,i+3);
 const settled=await Promise.allSettled(batch.map(processMap));
 settled.forEach((result,j)=>{
  if(result.status==='rejected')throw result.reason;
  successes.push([batch[j].id,result.value]);
 });
}
if(successes.length!==20)throw new Error('Expected 20 topographic hero crops');
console.log('Generated/verified '+successes.length+' Google Drive topographic hero crops: '+successes.map(x=>x.join(' ')).join(', '));
