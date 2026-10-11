/** Editorially curate the wave-6 imports and recover distinct historical New Zealand originals. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const base='docs/media/',instructions=JSON.parse(await fs.readFile(base+'documentary-wave6-curation-20261011.json','utf8'));
if(instructions.imageCutoff!=='2025-12-31')throw Error('Historical cutoff changed');
const existing=JSON.parse(await fs.readFile(base+'documentary-image-wave6-result-20261011.json','utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),key=s=>crypto.createHash('sha1').update(s).digest('hex').slice(0,16);
const strip=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const licenses=new Map([['Public domain','https://creativecommons.org/publicdomain/mark/1.0/'],['CC0','https://creativecommons.org/publicdomain/zero/1.0/'],['CC BY 2.0','https://creativecommons.org/licenses/by/2.0/'],['CC BY 3.0','https://creativecommons.org/licenses/by/3.0/'],['CC BY 4.0','https://creativecommons.org/licenses/by/4.0/'],['CC BY-SA 2.0','https://creativecommons.org/licenses/by-sa/2.0/'],['CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/'],['CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/']]);
const agent='NZGISHistory/1.0 (historical GIS history, https://history.pm4gis.nz)';
const report={checkedAt:new Date().toISOString(),originalDownloads:existing.success,cullReasons:[],recovered:0,held:0,items:[]};
const years=Array.from(instructions.add, x=>x.date);
for(const date of years){const m=String(date).match(/\b(19\d\d|20\d\d)\b/);if(m&&Number(m[1])>2025)throw Error('Post-cutoff candidate date');}
const articles=await Promise.all((await fs.readdir('src/content/articles')).filter(f=>f.endsWith('.json')).map(async f=>JSON.parse(await fs.readFile('src/content/articles/'+f,'utf8'))));
const current=await Promise.all((await fs.readdir('src/content/images')).filter(f=>f.endsWith('.json')).map(async f=>JSON.parse(await fs.readFile('src/content/images/'+f,'utf8'))));
const bySlug=new Map(current.map(x=>[x.slug,x]));
const hashes=new Set(current.map(x=>x.originalSha256).filter(Boolean));
const known=new Set(current.map(x=>x.sourceFileTitle).filter(Boolean).map(x=>x.toLowerCase()));
for(const [slug,reason] of instructions.remove){if(!/^doc-/.test(slug))throw Error('Only newly archived wave-6 images may be culled: '+slug);
 const i=bySlug.get(slug);if(!i)throw Error('Reviewed image not found: '+slug);
 for(const p of [i.originalAssetPath,i.assetPath,i.thumbnailPath]){if(!p?.startsWith('/assets/historical/'))throw Error('Unexpected image path');await fs.unlink('public'+p)}
 await fs.unlink('src/content/images/'+slug+'.json');
 report.cullReasons.push({slug,title:i.title,reason});
 bySlug.delete(slug);hashes.delete(i.originalSha256);known.delete(String(i.sourceFileTitle||'').toLowerCase());
 console.log('EXCLUDED',slug,reason);
}
async function get(url,bytes=false){let err;for(let n=0;n<3;n++){
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),40000);
 try{const response=await fetch(url,{signal:ctrl.signal,headers:{'User-Agent':agent,'Accept':bytes?'image/jpeg,image/png,*/*':'application/json'}});
 if(!response.ok)throw Error('HTTP '+response.status);
 if(bytes){const buf=Buffer.from(await response.arrayBuffer());if(buf.length>15000000||!buf.length)throw Error('Source larger than 15MB');return {buf,url:response.url}}
 return await response.json();
 }catch(e){err=e;await new Promise(resolve=>setTimeout(resolve,600*(n+1)))}finally{clearTimeout(timer)}
 }throw err;
}
for(const i of instructions.add){const log={title:i.title,articleSlug:i.articleSlug,status:'held'};
 try{
 if(known.has(i.title.toLowerCase())){log.status='already-present';continue;}
 const u=new URL('https://commons.wikimedia.org/w/api.php');for(const [k,v] of Object.entries({action:'query',prop:'imageinfo',titles:i.title,iiprop:'url|extmetadata|size|mime',format:'json',formatversion:'2'}))u.searchParams.set(k,v);
 const d=await get(u.toString()),meta=d.query?.pages?.[0]?.imageinfo?.[0];if(!meta)throw Error('Commons original not found');
 const licence=strip(meta.extmetadata?.LicenseShortName?.value);if(!licenses.has(licence))throw Error('Unverified licence '+licence);
 if(!meta.url?.startsWith('https://upload.wikimedia.org/wikipedia/commons/'))throw Error('Not the verified Commons original host');
 if(!['image/jpeg','image/png'].includes(meta.mime)||meta.width<500||meta.height<380||meta.size>15000000)throw Error('File too large/small or invalid format');
 const {buf,url}=await get(meta.url,true),digest=hash(buf);if(hashes.has(digest))throw Error('Exact source duplicate');
 const m=await sharp(buf,{limitInputPixels:300000000}).metadata();if(!['jpeg','png'].includes(m.format))throw Error('Unrecognised image encoding');
 const web=await sharp(buf,{limitInputPixels:300000000}).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:82,effort:4}).toBuffer();
 const thumb=await sharp(buf,{limitInputPixels:300000000}).rotate().resize({width:720,withoutEnlargement:true}).webp({quality:75,effort:4}).toBuffer();
 const slug='wave6-curated-'+key(i.title),original='/assets/historical/original/'+slug+(m.format==='jpeg'?'.jpg':'.png'),webPath='/assets/historical/web/'+slug+'.webp',thumbPath='/assets/historical/card/'+slug+'.webp';
 const article=articles.find(a=>a.slug===i.articleSlug);if(!article)throw Error('Unknown chapter '+i.articleSlug);
 const source='https://commons.wikimedia.org/wiki/'+encodeURIComponent(i.title.replaceAll(' ','_')).replaceAll('%3A',':');
 const creator=strip(meta.extmetadata?.Artist?.value).replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig,'[contact omitted]').slice(0,160)||'Creator recorded on linked original source';
 for(const p of [original,webPath,thumbPath])await fs.mkdir(path.dirname('public'+p),{recursive:true});
 await Promise.all([fs.writeFile('public'+original,buf),fs.writeFile('public'+webPath,web),fs.writeFile('public'+thumbPath,thumb)]);
 const rec={id:'image:'+slug,slug,title:i.title.replace(/^File:/,'').replace(/\.(?:png|jpe?g)$/i,'').replaceAll('_',' '),assetPath:webPath,sourceUrl:source,sourceName:'Wikimedia Commons, original archival file',credit:creator+'; Wikimedia Commons original source record',licence,licenceUrl:licenses.get(licence),licenceEvidenceUrl:source,altText:i.caption,caption:i.caption,themeIds:[],articleSlug:article.slug,chapterNumber:article.readingOrder,dateDisplay:i.date,context:'A named and source-verified historic New Zealand map, aerial photo, Landsat observation or USGS earthquake map. Presented as period material; no claim that it depicts an original New Zealand GIS workstation or implementation.',originalAssetPath:original,thumbnailPath:thumbPath,originalSha256:digest,webSha256:hash(web),thumbnailSha256:hash(thumb),originalWidth:m.width,originalHeight:m.height,sourceFileTitle:i.title,sourceOriginalUrl:url,headerCandidate:false,derivativesNote:'Original Wikimedia-hosted upload archived unchanged; separate uncropped WebP derivatives retained.'};
 await fs.writeFile('src/content/images/'+slug+'.json',JSON.stringify(rec,null,2)+'\n');
 report.recovered++;Object.assign(log,{status:'archived',slug,source,date:i.date,sha256:digest});known.add(i.title.toLowerCase());hashes.add(digest);
 }catch(e){report.held++;log.reason=String(e.message||e)}
 finally{report.items.push(log);console.log(i.title,log.status,log.reason||'');await fs.writeFile(base+'documentary-wave6-curation-result-20261011.json',JSON.stringify(report,null,2)+'\n')}
}
report.publishedWave6=existing.success-report.cullReasons.length+report.recovered;
report.otherVerifiedBatches=16;report.netNew=report.publishedWave6+report.otherVerifiedBatches;
report.target=100;report.shortfall=Math.max(0,report.target-report.netNew);
report.completedAt=new Date().toISOString();await fs.writeFile(base+'documentary-wave6-curation-result-20261011.json',JSON.stringify(report,null,2)+'\n');
console.log('Editorially retained wave 6:',report.publishedWave6,' plus 16 external verified:',report.netNew,'net new. Shortfall',report.shortfall);
if(report.netNew<100)process.exitCode=1;
