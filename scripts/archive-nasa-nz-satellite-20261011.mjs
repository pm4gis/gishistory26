/** Preserve named pre-2026 NASA/USGS observations of New Zealand with source metadata. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const q=JSON.parse(await fs.readFile('docs/media/nasa-nz-satellite-wave-20261011.json','utf8'));
if(q.cutoff!=='2025-12-31')throw Error('Observation period changed');
const report={startedAt:new Date().toISOString(),success:0,held:0,items:[]};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const articles=await Promise.all((await fs.readdir('src/content/articles')).filter(n=>n.endsWith('.json')).map(async n=>JSON.parse(await fs.readFile('src/content/articles/'+n))));
for(const x of q.items){const r={slug:x.slug,status:'held'};
 try{
  if(x.date>'2025-12-31')throw Error('Post-2025 acquisition');
  if(!x.url?.startsWith(x.provider==='NASA'?'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/':'https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/'))throw Error('Unverified primary source host');
  if(!x.source?.startsWith(x.provider==='NASA'?'https://science.nasa.gov/earth/earth-observatory/':'https://www.usgs.gov/media/images/'))throw Error('Unverified research source');
  const file='src/content/images/'+x.slug+'.json';if(await fs.stat(file).then(()=>true).catch(()=>false))throw Error('Already archived');
  const c=new AbortController(),timer=setTimeout(()=>c.abort(),60000);let res;try{res=await fetch(x.url,{signal:c.signal,headers:{'User-Agent':'NZGISHistory/1.0 (https://history.pm4gis.nz)'}});}finally{clearTimeout(timer)}
  if(!res.ok)throw Error('Original image HTTP '+res.status);
  const original=Buffer.from(await res.arrayBuffer());if(original.length>18e6)throw Error('Source too large');
  const m=await sharp(original,{limitInputPixels:280000000}).metadata();if(!['png','jpeg'].includes(m.format)||m.width<600||m.height<500)throw Error('Not a suitable original photo');
  const web=await sharp(original).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:84}).toBuffer();
  const thumb=await sharp(original).rotate().resize({width:720,withoutEnlargement:true}).webp({quality:77}).toBuffer();
  const article=articles.find(a=>a.slug===x.articleSlug);if(!article)throw Error('Unknown chapter');
  const originalPath='/assets/historical/original/'+x.slug+(m.format==='jpeg'?'.jpg':'.png'),webPath='/assets/historical/web/'+x.slug+'.webp',thumbPath='/assets/historical/card/'+x.slug+'.webp';
  for(const s of [originalPath,webPath,thumbPath])await fs.mkdir(path.dirname('public'+s),{recursive:true});
  await Promise.all([fs.writeFile('public'+originalPath,original),fs.writeFile('public'+webPath,web),fs.writeFile('public'+thumbPath,thumb)]);
  const licenceUrl=x.provider==='NASA'?'https://www.nasa.gov/nasa-brand-center/images-and-media/':'https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits';
  const data={id:'image:'+x.slug,slug:x.slug,title:x.title,assetPath:webPath,sourceUrl:x.source,sourceName:x.provider==='NASA'?'NASA Earth Observatory':'U.S. Geological Survey',credit:x.credit,licence:x.provider==='NASA'?'NASA media usage guidelines; US government public domain':'Public domain (USGS)',licenceUrl,licenceEvidenceUrl:licenceUrl,altText:x.title+' captured by '+x.instrument,caption:x.caption,themeIds:[],articleSlug:article.slug,chapterNumber:article.readingOrder,dateDisplay:x.date,context:'Primary dated Earth observation and satellite data product. The actual source image is preserved locally for this historical comparison.',originalAssetPath:originalPath,thumbnailPath:thumbPath,originalSha256:sha(original),webSha256:sha(web),thumbnailSha256:sha(thumb),originalWidth:m.width,originalHeight:m.height,sourceFileTitle:x.title,sourceOriginalUrl:res.url,headerCandidate:false,derivativesNote:'Original NASA/USGS download bytes retained; uncropped web and card WebP copies generated.'};
  await fs.writeFile(file,JSON.stringify(data,null,2)+'\n');report.success++;Object.assign(r,{status:'archived',originalBytes:original.length,sha256:sha(original),webPath});
 }catch(e){report.held++;r.reason=String(e.message||e)}finally{report.items.push(r);console.log(r.slug,r.status,r.reason||'');await fs.writeFile('docs/media/nasa-nz-satellite-wave-run-20261011.json',JSON.stringify(report,null,2)+'\n')}
}
console.log('NASA/USGS downloaded '+report.success+', held '+report.held);
