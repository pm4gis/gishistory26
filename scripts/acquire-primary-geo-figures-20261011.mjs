/** Acquire source-identified, reuse-eligible New Zealand geospatial documentary images. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const queue=JSON.parse(await fs.readFile('docs/media/four-chapter-primary-figures-20261011.json','utf8'));
if(queue.subjectCutoff!=='2025-12-31')throw Error('Source period constraint changed');
const report={checkedAt:new Date().toISOString(),success:0,failed:0,held:0,items:[]};
const sha=buf=>crypto.createHash('sha256').update(buf).digest('hex');
async function retrieve(url){
 let last;
 for(let i=0;i<3;i++){
  try{
   const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),55000);
   try{
    const res=await fetch(url,{signal:ctrl.signal,headers:{'User-Agent':'NZGISHistory/1.0 (noncommercial documentary publishing; https://history.pm4gis.nz)','Accept':'image/jpeg,image/png,text/html,application/json,*/*'}});
    if(!res.ok)throw Error('HTTP '+res.status+' from '+new URL(url).host);
    const buf=Buffer.from(await res.arrayBuffer());if(!buf.length||buf.length>30*1024*1024)throw Error('Empty or exceeds 30 MiB');
    return{data:buf,finalUrl:res.url,mediaType:res.headers.get('content-type')};
   }finally{clearTimeout(timer)}
  }catch(e){last=e;await new Promise(r=>setTimeout(r,1000*(i+1)));}
 }
 throw last;
}
async function rights(item){
 if(item.sourceType==='mdpi') {
  if(item.licence!=='CC BY 4.0')throw Error('Unexpected publication licence');
  if(!/^https:\/\/www\.mdpi\.com\/207[23]-\d{4}\/\d+\/\d+\/\d+$/.test(item.sourceUrl))throw Error('Unapproved MDPI article page');
  if(!/^https:\/\/(www\.mdpi\.com|mdpi-res\.com)\/.+\/article_deploy\/html\/images\/[a-z0-9-]+-g00[1478]\.png$/.test(item.sourceOriginalUrl))throw Error('Unapproved figure original');
  const page=await fetch(item.sourceUrl,{signal:AbortSignal.timeout(25000),headers:{'User-Agent':'NZGISHistory/1.0 (https://history.pm4gis.nz)','Accept':'text/html'}});
  const html=await page.text();
  if(!page.ok || !html.includes('creativecommons.org/licenses/by/4.0') || !html.includes(item.doi))throw Error('Primary publisher CC BY 4.0 or DOI unavailable, HTTP '+page.status);
  return {licence:'CC BY 4.0',licenceEvidence:item.sourceUrl,originalUrl:item.sourceOriginalUrl};
 }
 if(item.sourceType==='linz'){
  if(!item.sourceOriginalUrl?.startsWith('https://www.linz.govt.nz/sites/default/files/'))throw Error('LINZ source not an approved first-party original');
  if(!item.sourceUrl?.startsWith('https://www.linz.govt.nz/'))throw Error('Missing first-party government documentation');
  const response=await fetch('https://www.linz.govt.nz/copyright',{signal:AbortSignal.timeout(22000),headers:{'User-Agent':'NZGISHistory/1.0 (https://history.pm4gis.nz)'}});
  const text=await response.text();
  if(!response.ok||!text.includes('Creative Commons Attribution 4.0 International'))throw Error('LINZ publication licence statement unavailable');
  return{licence:'CC BY 4.0',licenceEvidence:'https://www.linz.govt.nz/copyright'};
 }
 if(item.sourceType==='qgis') {
  if(!item.sourceUrl?.startsWith('https://docs.qgis.org/3.10/en/') || !item.sourceOriginalUrl?.startsWith('https://docs.qgis.org/3.10/en/_images/')) throw Error('Not the cited historical QGIS 3.10 documentation');
  const response=await fetch('https://static.qgis.org/en/site/about/index.html',{signal:AbortSignal.timeout(22000)});
  const page=await response.text();
  if(!response.ok||!page.includes('Creative Commons Attribution-ShareAlike 3.0')) throw Error('QGIS CC BY-SA reuse statement cannot be verified');
  return {licence:'CC BY-SA 3.0',licenceEvidence:'https://static.qgis.org/en/site/about/index.html',originalUrl:item.sourceOriginalUrl};
 }
 if(item.sourceType==='commons'){
  const u=new URL('https://commons.wikimedia.org/w/api.php');
  for(const [k,v] of Object.entries({action:'query',titles:item.commonsTitle,prop:'imageinfo',iiprop:'url|extmetadata|size',format:'json',formatversion:'2'}))u.searchParams.set(k,v);
  const response=await fetch(u,{signal:AbortSignal.timeout(22000),headers:{'User-Agent':'NZGISHistory/1.0 (https://history.pm4gis.nz)','Accept':'application/json'}});
  if(!response.ok)throw Error('Commons metadata HTTP '+response.status);
  const data=await response.json();const info=data.query?.pages?.[0]?.imageinfo?.[0];
  if(!info)throw Error('Commons image metadata absent');
  const live=info.extmetadata?.LicenseShortName?.value;
  if(live!==item.licence)throw Error('Commons licence mismatch ('+live+')');
  if(!info.url?.startsWith('https://upload.wikimedia.org/wikipedia/commons/'))throw Error('Not a Commons original');
  return{licence:live,licenceEvidence:item.sourceUrl,originalUrl:info.url};
 }
 throw Error('Unsupported image source type');
}
for(const item of queue.items){
 const res={slug:item.slug,sourcePage:item.sourceUrl,sourceOriginalUrl:item.sourceOriginalUrl||item.commonsTitle};
 try{
  if(!item.slug||!/^[-a-z0-9]+$/.test(item.slug))throw Error('Invalid slug');
  if(![7,43,44].includes(item.chapter))throw Error('Non-target chapter');
  if(!item.afterParagraphId)throw Error('Missing exact paragraph anchor');
  const licence=await rights(item);
  const priorPath='src/content/images/'+item.slug+'.json';
  const priorText=await fs.readFile(priorPath,'utf8').catch(e=>{if(e.code==='ENOENT')return null;throw e;});
  if(priorText){
    const prior=JSON.parse(priorText);
    if(prior.slug!==item.slug||prior.articleSlug!==item.articleSlug||prior.licence!==licence.licence||prior.sourceUrl!==item.sourceUrl)throw Error('Existing record differs from reviewed source');
    for(const [asset,expected] of [[prior.originalAssetPath,prior.originalSha256],[prior.assetPath,prior.webSha256],[prior.thumbnailPath,prior.thumbnailSha256]]){
      const bin=await fs.readFile('public'+asset);
      if(sha(bin)!==expected)throw Error('Existing original or derivative checksum mismatch: '+asset);
    }
    Object.assign(res,{status:'verified-existing',original:prior.originalAssetPath,web:prior.assetPath,thumb:prior.thumbnailPath,sha256:prior.originalSha256,licenceVerified:licence.licence});
    report.success++;report.items.push(res);console.log(item.slug,res.status);continue;
  }
  const url=licence.originalUrl||item.sourceOriginalUrl;
  const {data,finalUrl}=await retrieve(url);
  const type=await sharp(data,{limitInputPixels:250000000}).metadata();
  if(!['jpeg','png'].includes(type.format)||type.width<300||type.height<250)throw Error('Invalid/too small source image '+type.format+' '+type.width+'x'+type.height);
  const ext=type.format==='jpeg'?'jpg':'png';
  const original='/assets/historical/original/'+item.slug+'.'+ext;
  const web='/assets/historical/web/'+item.slug+'.webp';
  const thumb='/assets/historical/card/'+item.slug+'.webp';
  const recordPath='src/content/images/'+item.slug+'.json';
  try{await fs.access(recordPath);throw Error('Image record already exists; refusal to overwrite');}catch(e){if(e.code!=='ENOENT')throw e;}
  const webImage=await sharp(data,{limitInputPixels:250000000}).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:82,effort:5}).toBuffer();
  const thumbImage=await sharp(data,{limitInputPixels:250000000}).rotate().resize({width:720,withoutEnlargement:true}).webp({quality:76,effort:5}).toBuffer();
  for(const x of [original,web,thumb])await fs.mkdir(path.dirname('public'+x),{recursive:true});
  await fs.writeFile('public'+original,data);await fs.writeFile('public'+web,webImage);await fs.writeFile('public'+thumb,thumbImage);
  const record={
   id:item.id,slug:item.slug,title:item.title,assetPath:web,sourceUrl:item.sourceUrl,sourceName:item.sourceName,
   credit:item.credit,licence:item.licence,licenceUrl:item.licenceUrl,licenceEvidenceUrl:item.licenceEvidenceUrl,
   altText:item.altText,caption:item.caption,themeIds:[],articleSlug:item.articleSlug,chapterNumber:item.chapter,
   dateDisplay:item.dateDisplay,context:item.context,afterParagraphId:item.afterParagraphId,originalAssetPath:original,thumbnailPath:thumb,
   originalSha256:sha(data),webSha256:sha(webImage),thumbnailSha256:sha(thumbImage),originalWidth:type.width,originalHeight:type.height,
   sourceFileTitle:item.commonsTitle||decodeURIComponent(new URL(url).pathname.split('/').at(-1)),
   sourceOriginalUrl:finalUrl,sourceFigure:item.sourceFigure,sourceDoi:item.doi,headerCandidate:!!item.headerCandidate,
   relatedRecords:item.relatedRecords||[],
   derivativesNote:'Local original stored unchanged; WebP display width up to 1600 pixels and thumbnail width up to 720 pixels, resized without cropping.'
  };
  await fs.writeFile(recordPath,JSON.stringify(record,null,2)+'\n');
  Object.assign(res,{status:'downloaded',original,web,thumb,sha256:sha(data),originalBytes:data.length,dimensions:[type.width,type.height],licenceVerified:licence.licence,finalSourceOriginalUrl:finalUrl});
  report.success++;
 }catch(e){res.status='failed';res.error=String(e.message||e);report.failed++;}
 report.items.push(res);console.log(item.slug,res.status,res.error||res.originalBytes);
}
await fs.writeFile('docs/media/four-chapter-originals-run-20261011.json',JSON.stringify(report,null,2)+'\n');
console.log('Downloaded '+report.success+' of '+queue.items.length+'; errors '+report.failed);
if(report.failed)process.exitCode=1;
