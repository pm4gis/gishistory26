/**
 * Download a reviewed, named set of historical documentary images to this repository.
 * This script never takes an arbitrary third-party URL: only Commons file titles in
 * docs/media/curated-commons-queue-wave2.json are accepted, and publishable=false
 * entries are excluded. The images themselves are locally stored, never hotlinked.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root=process.cwd();
const queue=JSON.parse(await fs.readFile('docs/media/curated-commons-queue-wave2.json','utf8'));
const report={checkedAt:new Date().toISOString(),items:[],success:0,failed:0,held:0};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function retrieve(url,tries=3){
 let last;
 for(let n=0;n<tries;n++){
  try{
   const ctrl=new AbortController();
   const timeout=setTimeout(()=>ctrl.abort(),60000);
   let r;
   try{r=await fetch(url,{signal:ctrl.signal,headers:{'User-Agent':'NZGISHistory/1.0 (historical documentary image research; https://history.pm4gis.nz)','Accept':'image/jpeg,image/png,application/json,*/*'}})}
   finally{clearTimeout(timeout)}
   if(!r.ok)throw new Error('HTTP '+r.status+' '+new URL(url).host);
   const data=Buffer.from(await r.arrayBuffer());
   if(!data.length || data.length>32*1024*1024)throw new Error('Source empty or over 32 MiB');
   return data;
  }catch(e){last=e;await pause(1200*(n+1));}
 }
 throw last;
}

async function verifyCommonsLicence(item){
 const url=new URL('https://commons.wikimedia.org/w/api.php');
 for(const [k,v] of Object.entries({action:'query',titles:item.commonsTitle,prop:'imageinfo',iiprop:'extmetadata|size',format:'json',formatversion:'2'}))url.searchParams.set(k,v);
 const r=await fetch(url,{headers:{'User-Agent':'NZGISHistoryImageResearch/1.0 (https://history.pm4gis.nz/about/)','Accept':'application/json'},signal:AbortSignal.timeout(20000)});
 if(!r.ok)throw Error('Metadata HTTP '+r.status);
 const d=await r.json();const p=d.query?.pages?.[0];const info=p?.imageinfo?.[0];if(!info)throw Error('Commons file not found');
 const raw=info.extmetadata?.LicenseShortName?.value||'';
 const normal=x=>String(x).toLowerCase().replace(/[^a-z0-9]/g,'');
 const itemLicence=normal(item.licence);
 const liveLicence=normal(raw);
 const publicDomain=liveLicence.includes('publicdomain')||liveLicence==='cc0'||liveLicence==='pd';
 const matches=liveLicence===itemLicence||liveLicence.includes(itemLicence)||itemLicence.includes(liveLicence)|| (publicDomain&&(itemLicence.includes('publicdomain')||itemLicence==='cc0'));
 if(!matches)throw Error('Licence mismatch: expected '+item.licence+', Commons says '+raw);
 return {license:raw,bytes:info.size};
}

function commonsOriginal(title){
 if(!title.startsWith('File:'))throw new Error('Not a Commons file title');
 const name=title.slice(5).replaceAll(' ','_').normalize('NFC');
 if(!/^[\p{L}\p{N}_(),.\-]+\.(jpe?g|png)$/iu.test(name))throw new Error('Unsupported Commons filename');
 const h=crypto.createHash('md5').update(name).digest('hex');
 return 'https://upload.wikimedia.org/wikipedia/commons/'+h[0]+'/'+h.slice(0,2)+'/'+encodeURIComponent(name);
}
async function run(item){
 const outcome={slug:item.slug,source:item.sourceUrl};
 if(!item.publishable){outcome.status='held';outcome.reason='Source-specific rights review';report.held++;return outcome;}
 try{
  const verifiedLicence=await verifyCommonsLicence(item);
  const ext=/\.png$/i.test(item.commonsTitle)?'png':'jpg';
  const original='/assets/historical/original/'+item.slug+'.'+ext;
  const web='/assets/historical/web/'+item.slug+'.webp';
  const card='/assets/historical/card/'+item.slug+'.webp';
  const originalFile=path.join(root,'public',original);
  const webFile=path.join(root,'public',web);
  const cardFile=path.join(root,'public',card);
  const recordFile=path.join(root,'src/content/images',item.slug+'.json');
  let data;
  try{data=await fs.readFile(originalFile)}catch{data=await retrieve(commonsOriginal(item.commonsTitle));}
  if(ext==='jpg'&&!(data[0]===0xff && data[1]===0xd8 && data[2]===0xff))throw new Error('JPEG signature missing');
  if(ext==='png'&&!(data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))))throw new Error('PNG signature missing');
  const meta=await sharp(data,{limitInputPixels:250000000}).metadata();
  if(meta.width<300||meta.height<250)throw new Error('Source smaller than 300 by 250 pixels');
  if(!['jpeg','png'].includes(meta.format))throw new Error('Unexpected source format: '+meta.format);
  const webData=await sharp(data,{limitInputPixels:250000000}).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:82,effort:5}).toBuffer();
  const cardData=await sharp(data,{limitInputPixels:250000000}).rotate().resize({width:720,withoutEnlargement:true}).webp({quality:76,effort:5}).toBuffer();
  await Promise.all([path.dirname(originalFile),path.dirname(webFile),path.dirname(cardFile),path.dirname(recordFile)].map(d=>fs.mkdir(d,{recursive:true})));
  await fs.writeFile(originalFile,data);
  await fs.writeFile(webFile,webData);
  await fs.writeFile(cardFile,cardData);
  const record={
   id:item.id,slug:item.slug,title:item.title,assetPath:web,sourceUrl:item.sourceUrl,
   sourceName:item.sourceName,credit:item.credit,licence:item.licence,
   licenceUrl:item.licenceUrl,altText:item.altText,caption:item.caption,
   themeIds:[],articleSlug:item.articleSlug,chapterNumber:item.chapter,
   dateDisplay:item.dateDisplay,context:item.context,originalAssetPath:original,
   thumbnailPath:card,originalSha256:sha(data),webSha256:sha(webData),
   originalWidth:meta.width,originalHeight:meta.height,sourceFileTitle:item.commonsTitle,
   headerCandidate:!!item.headerCandidate
  };
  await fs.writeFile(recordFile,JSON.stringify(record,null,2)+'\n');
  outcome.verifiedLicence=verifiedLicence.license;outcome.status='downloaded';outcome.original=original;outcome.web=web;outcome.thumbnail=card;
  outcome.sha256=sha(data);outcome.bytes=data.length;outcome.dimensions=[meta.width,meta.height];
  outcome.sourceUrl=item.sourceUrl;outcome.licence=item.licence;outcome.credit=item.credit;
  report.success++;
 }catch(err){outcome.status='failed';outcome.reason=String(err.message||err);report.failed++;}
 return outcome;
}
for(const item of queue.items){report.items.push(await run(item));console.log(item.slug+': '+report.items.at(-1).status+(report.items.at(-1).reason?' ('+report.items.at(-1).reason+')':''));}
await fs.writeFile('docs/media/chapter-download-run-wave2.json',JSON.stringify(report,null,2)+'\n');
console.log('Completed '+report.success+' downloads, '+report.failed+' failures, '+report.held+' held.');
if(!report.success)process.exitCode=1;
