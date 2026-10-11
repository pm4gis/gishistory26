/**
 * Acquire a verified public Commons file set and prepare publishable WebPs.
 * Originals remain in the (downloadable) research-artifact archive only.
 * Run from repo root on Node 22; requires curl and sharp.
 */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
const run=promisify(execFile);
const manifest=JSON.parse(await readFile('docs/media/maori-gis-media-wave4-manifest.json','utf8'));
const archive='docs/media/acquired-wave4';
const digest=b=>createHash('sha256').update(b).digest('hex');
for(const d of [archive+'/originals','public/assets/historical/web','public/assets/historical/card','src/content/images'])await mkdir(d,{recursive:true});
const result={batch:manifest.id,runAt:new Date().toISOString(),releasedToProduction:false,originalsStoredOnlyInArtifact:true,ready:[],failed:[]};
for(const item of manifest.items){
 try{
  if(item.noPersonProfile!==true)throw Error('Person protection missing');
  const original=archive+'/originals/'+item.id+'.jpg';
  await run('curl',['--fail','--location','--retry','3','--retry-all-errors','--max-time','150','--silent','--show-error','--user-agent','NZGISHistoryResearch/1.0 (documentary image licensing)', '--output',original,item.originalUrl],{timeout:180000,maxBuffer:16000});
  const bytes=await readFile(original);
  if(bytes.length<10000||bytes.length>30*1024*1024)throw Error('Invalid original size '+bytes.length);
  const meta=await sharp(bytes,{limitInputPixels:250000000}).metadata();
  if(meta.format!=='jpeg'||meta.width!==item.originalWidth||meta.height!==item.originalHeight)throw Error('Original MIME/dimension mismatch '+meta.format+' '+meta.width+'x'+meta.height);
  const full=await sharp(bytes).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:79,effort:5}).toBuffer();
  const thumb=await sharp(bytes).rotate().resize({width:720,withoutEnlargement:true}).webp({quality:74,effort:5}).toBuffer();
  const f='public/assets/historical/web/'+item.id+'.webp',t='public/assets/historical/card/'+item.id+'.webp';
  await writeFile(f,full);await writeFile(t,thumb);
  const webHash=digest(full),thumbHash=digest(thumb),origHash=digest(bytes);
  const record={
   id:'image:'+item.id,slug:item.id,title:item.title,
   assetPath:'/assets/historical/web/'+item.id+'.webp',thumbnailPath:'/assets/historical/card/'+item.id+'.webp',
   sourceUrl:item.sourcePage,sourceName:'Wikimedia Commons',credit:item.credit,
   licence:item.licence,licenceUrl:item.licenceUrl,licenceEvidenceUrl:item.sourcePage,
   altText:item.caption,caption:item.caption,context:item.caption,themeIds:item.id==='ngai-tahu-takiwa-map-2010'?['maori-gis']:[],
   dateDisplay:item.dateDisplay,originalSha256:origHash,webSha256:webHash,thumbnailSha256:thumbHash,
   originalWidth:meta.width,originalHeight:meta.height,sourceOriginalUrl:item.originalUrl,
   sourceFileTitle:'File:'+decodeURIComponent(item.sourcePage.split('/').at(-1)).replaceAll('_',' '),
   derivativesNote:'Original unchanged JPEG archived in the Wave 4 research package; the website uses uncropped WebP display and card derivatives. Original and crop licensing per Commons file page; no cropping performed.'
  };
  if(item.subject&&item.subject!=='maori-gis')record.relatedRecords=[{name:item.subject.replaceAll('-',' '),url:'/entities/'+item.subject+'/',role:'Image subject or related institution; see context for limitations'}];
  await writeFile('src/content/images/'+item.id+'.json',JSON.stringify(record,null,2)+'\n');
  result.ready.push({id:item.id,original:{bytes:bytes.length,sha256:origHash,width:meta.width,height:meta.height},web:{bytes:full.length,sha256:webHash},card:{bytes:thumb.length,sha256:thumbHash},source:item.sourcePage});
  console.log('READY '+item.id+' '+bytes.length+'B to '+full.length+'B '+thumb.length+'B');
 }catch(e){result.failed.push({id:item.id,message:String(e)});console.error('FAILED '+item.id+': '+e)}
}
await writeFile(archive+'/report.json',JSON.stringify(result,null,2)+'\n');
console.log('WAVE4 '+result.ready.length+'/'+manifest.items.length+' ready');
if(result.failed.length)process.exitCode=1;
