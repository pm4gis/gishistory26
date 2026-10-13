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
 const meta=await sharp(source).metadata();
 // Pick a land-rich map window rather than the page centre, which often contains
 // a printed legend or a large area of open water. Analyse only genuine pixels.
 const {data,info}=await sharp(source).resize({width:320}).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const isSheet=map.sourceTitle.toLowerCase().endsWith('.tif');
 const cropWidth=Math.floor(info.width*(isSheet?0.43:0.69));
 const cropHeight=Math.min(info.height,Math.floor(cropWidth*788/1400));
 const beginX=Math.floor(info.width*(isSheet?0.31:0.075));
 const endX=Math.max(beginX,Math.floor(info.width*(isSheet?0.98:0.93))-cropWidth);
 const beginY=Math.floor(info.height*(isSheet?0.045:0.07));
 const endY=Math.max(beginY,Math.floor(info.height*(isSheet?0.76:0.93))-cropHeight);
 const stride=info.width+1;
 const integral=new Float64Array((info.width+1)*(info.height+1));
 for(let y=1;y<=info.height;y++){
  let running=0;
  for(let x=1;x<=info.width;x++){
   const p=((y-1)*info.width+x-1)*info.channels;
   // Beige and green land have more red than blue; blue water and white
   // margins score near zero. This selects detail without altering any map.
   const terrain=Math.max(0,Math.min(2,(data[p]-data[p+2]-4)/40));
   running+=terrain;
   integral[y*stride+x]=integral[(y-1)*stride+x]+running;
  }
 }
 const area=(x,y)=>integral[(y+cropHeight)*stride+x+cropWidth]
  -integral[y*stride+x+cropWidth]-integral[(y+cropHeight)*stride+x]+integral[y*stride+x];
 let best={x:beginX,y:beginY,score:-Infinity};
 const stepX=Math.max(3,Math.round(cropWidth/14));
 const stepY=Math.max(3,Math.round(cropHeight/12));
 for(let x=beginX;x<=endX;x+=stepX)for(let y=beginY;y<=endY;y+=stepY){
  const density=area(x,y)/(cropWidth*cropHeight);
  const centred=0.012*Math.abs(x-(beginX+endX)/2)/info.width;
  const score=density-centred;
  if(score>best.score)best={x,y,score};
 }
 const left=Math.round(best.x*meta.width/info.width);
 const top=Math.round(best.y*meta.height/info.height);
 const width=Math.min(meta.width-left,Math.round(cropWidth*meta.width/info.width));
 const height=Math.min(meta.height-top,Math.round(cropHeight*meta.height/info.height));
 let output;
 for(const quality of [82,74,67,60]){
  output=await sharp(source,{failOn:'error',limitInputPixels:100000000})
   .extract({left,top,width,height})
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
