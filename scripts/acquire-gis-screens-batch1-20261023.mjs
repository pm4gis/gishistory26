/**
 * Acquire evidence-matched computer-era GIS screenshots (first NZ-focused tranche).
 * No placeholder files: only original bytes successfully fetched from publishers
 * become historical image records. Source attribution accompanies every image.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const FILE='docs/media/gis-software-screens-batch1-20261023.json';
const RESULT='docs/media/gis-software-screens-batch1-results.json';
const UA='NZGISHistory/1.0 (historical visual research, https://history.pm4gis.nz)';
const spec=JSON.parse(await fs.readFile(FILE,'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const imagePaths=['public/assets/historical/original','public/assets/historical/web','public/assets/historical/card'];
await Promise.all(imagePaths.map(p=>fs.mkdir(p,{recursive:true})));
const saved=await fs.readdir('src/content/images');
const known=new Set(saved.filter(p=>p.endsWith('.json')).map(p=>p.slice(0,-5)));
const result={batch:spec.batch,attempted:spec.items.length,success:0,alreadyPresent:0,failed:0,items:[],retrievedAt:new Date().toISOString()};
const formats={jpeg:'jpg',png:'png',webp:'webp',gif:'gif',tiff:'tif'};
async function download(url){
 let last;
 for(let attempt=0;attempt<3;attempt++){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),26000);
  try{
   const response=await fetch(url,{signal:controller.signal,headers:{'User-Agent':UA,'Accept':'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.9,*/*;q=0.4'}});
   if(!response.ok)throw new Error('HTTP '+response.status+' from '+new URL(url).hostname);
   const length=Number(response.headers.get('content-length')||0);
   if(length>12*1024*1024)throw new Error('Source exceeds 12 MiB');
   const bytes=Buffer.from(await response.arrayBuffer());
   if(bytes.length<3500||bytes.length>12*1024*1024)throw new Error('Source invalid or exceeds size limit: '+bytes.length);
   const meta=await sharp(bytes,{limitInputPixels:250000000}).metadata();
   if(!formats[meta.format])throw new Error('Unsupported image format: '+meta.format);
   if((meta.width||0)<420||(meta.height||0)<260)throw new Error('Too small to serve as an illustrative GIS screen');
   return {bytes,meta,sourceFinalUrl:response.url};
  }catch(error){last=error;if(attempt<2)await new Promise(resolve=>setTimeout(resolve,900*(attempt+1)));}finally{clearTimeout(timer)}
 }
 throw last;
}
for(const item of spec.items){
 if(known.has(item.slug)){result.alreadyPresent++;result.items.push({slug:item.slug,status:'already-present'});continue;}
 try{
  if(!/^https:\/\//.test(item.sourceOriginalUrl)||!/^https:\/\//.test(item.sourceUrl))throw new Error('Only HTTPS source originals and verified publisher pages are allowed');
  if(/202[6-9]/.test(item.dateDisplay))throw new Error('Date not inside pre-2026 historical cutoff');
  if(!item.afterParagraphId||!item.articleSlug)throw new Error('Unlinked image: missing reviewed exact paragraph placement');
  const {bytes,meta,sourceFinalUrl}=await download(item.sourceOriginalUrl);
  const ext=formats[meta.format],slug=item.slug;
  const full=path.join(imagePaths[0],slug+'.'+ext);
  const web=path.join(imagePaths[1],slug+'.webp');
  const card=path.join(imagePaths[2],slug+'.webp');
  const display=await sharp(bytes).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:84,effort:5}).toBuffer();
  const thumbnail=await sharp(bytes).rotate().resize({width:700,withoutEnlargement:true}).webp({quality:78,effort:5}).toBuffer();
  const metadata={
   id:'image:'+slug,slug,title:item.title,gisScreenBatch:spec.batch,
   assetPath:'/assets/historical/web/'+slug+'.webp',
   originalAssetPath:'/assets/historical/original/'+slug+'.'+ext,
   thumbnailPath:'/assets/historical/card/'+slug+'.webp',
   sourceUrl:item.sourceUrl,sourceName:item.sourceName,credit:item.credit,licence:item.licence,
   licenceUrl:item.licenceUrl,licenceEvidenceUrl:item.licenceUrl,
   sourceOriginalUrl:item.sourceOriginalUrl,sourceFileTitle:new URL(item.sourceOriginalUrl).pathname.split('/').pop(),
   altText:item.altText,caption:item.caption,context:item.context,themeIds:[],
   articleSlug:item.articleSlug,chapterNumber:item.chapterNumber,afterParagraphId:item.afterParagraphId,
   dateDisplay:item.dateDisplay,
   sourceEvidence:item.sourceEvidence,
   originalSha256:sha(bytes),webSha256:sha(display),thumbnailSha256:sha(thumbnail),
   originalWidth:meta.width,originalHeight:meta.height,
   derivativesNote:'Publisher original preserved unchanged locally; WebP reading and card versions resized without cropping. Captured software date and case-study context remain qualified.'
  };
  // Stage and publish only complete originals and metadata; do not fabricate missing sources.
  await fs.writeFile(full,bytes);await fs.writeFile(web,display);await fs.writeFile(card,thumbnail);
  await fs.writeFile('src/content/images/'+slug+'.json',JSON.stringify(metadata,null,2)+'\n');
  known.add(slug);result.success++;
  result.items.push({slug,status:'archived',sourceFinalUrl,originalBytes:bytes.length,
   originalSize:[meta.width,meta.height],sourceSha256:metadata.originalSha256,chapter:item.chapterNumber,afterParagraphId:item.afterParagraphId});
 }catch(error){
  result.failed++;result.items.push({slug:item.slug,status:'held',reason:String(error.message||error)});
  console.warn('HELD GIS screenshot '+item.slug+': '+String(error.message||error));
 }
}
await fs.writeFile(RESULT,JSON.stringify(result,null,2)+'\n');
console.log('GIS screen acquisition: '+result.success+' new, '+result.alreadyPresent+' already present, '+result.failed+' held; '+result.attempted+' candidates.');
if(result.success===0&&result.alreadyPresent===0)throw Error('No authentic GIS screens acquired; do not publish empty promises.');
