/* Date-identified original Retrolens photographs available through rights-verified Commons pages. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const queue=JSON.parse(await fs.readFile('docs/media/retrolens-primary-frames-20261011.json','utf8'));
const result={checkedAt:new Date().toISOString(),requested:queue.items.length,added:0,skippedExisting:0,held:0,items:[]};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const slugFor=t=>'retrolens-'+crypto.createHash('sha1').update(t).digest('hex').slice(0,16);
const plain=t=>String(t||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const ua='NZGISHistory/1.0 (https://history.pm4gis.nz)';
async function fetchWithTimeout(url){const c=new AbortController(),timer=setTimeout(()=>c.abort(),45000);try{const r=await fetch(url,{signal:c.signal,headers:{'User-Agent':ua,'Accept':'image/jpeg,image/png,application/json,*/*'}});if(!r.ok)throw Error('HTTP '+r.status+' '+url);return r;}finally{clearTimeout(timer)}}
const articles=(await Promise.all((await fs.readdir('src/content/articles')).filter(n=>n.endsWith('.json')).map(async n=>JSON.parse(await fs.readFile('src/content/articles/'+n,'utf8')))));
const already=(await Promise.all((await fs.readdir('src/content/images')).filter(n=>n.endsWith('.json')).map(async n=>JSON.parse(await fs.readFile('src/content/images/'+n,'utf8')))));
const titles=new Set(already.map(a=>a.sourceFileTitle).filter(Boolean).map(x=>x.toLowerCase()));
const hashes=new Set(already.map(a=>a.originalSha256).filter(Boolean));
const licenceMap={'CC BY 3.0':'https://creativecommons.org/licenses/by/3.0/','CC BY-SA 3.0':'https://creativecommons.org/licenses/by-sa/3.0/','CC BY-SA 4.0':'https://creativecommons.org/licenses/by-sa/4.0/','CC BY 4.0':'https://creativecommons.org/licenses/by/4.0/'};
for(const i of queue.items){
 const stat={file:i.commonsTitle,date:i.date,status:'held'};
 try{
  if(titles.has(i.commonsTitle.toLowerCase())){stat.status='already-archived';result.skippedExisting++;continue}
  const u=new URL('https://commons.wikimedia.org/w/api.php');for(const [k,v] of Object.entries({action:'query',titles:i.commonsTitle,prop:'imageinfo',iiprop:'url|extmetadata|size|mime',format:'json',formatversion:'2'}))u.searchParams.set(k,v);
  const res=await fetchWithTimeout(u.toString()),obj=await res.json(),meta=obj.query?.pages?.[0]?.imageinfo?.[0];if(!meta)throw Error('Commons source image not found');
  const e=meta.extmetadata||{},licence=plain(e.LicenseShortName?.value),description=plain(e.ImageDescription?.value+' '+e.Credit?.value+' '+e.Artist?.value);
  if(!licenceMap[licence])throw Error('Source has ineligible Commons licence '+licence);
  if(!/retrolens|crown aerial film library|files\.interpret\.co\.nz\/Retrolens/i.test(description))throw Error('No explicit Retrolens attribution in Commons source');
  if(meta.size>15000000||meta.width<500||meta.height<380||!['image/jpeg','image/png'].includes(meta.mime))throw Error('Original unsuitable for archival copy');
  if(!meta.url.startsWith('https://upload.wikimedia.org/wikipedia/commons/'))throw Error('Commons storage URL differs');
  const r=await fetchWithTimeout(meta.url),original=Buffer.from(await r.arrayBuffer());if(original.length>15000000)throw Error('Over 15 MB');
  const h=hash(original);if(hashes.has(h)){stat.status='already-archived-by-hash';result.skippedExisting++;continue}
  const md=await sharp(original).metadata(),slug=slugFor(i.commonsTitle),article=articles.find(a=>a.slug===i.articleSlug);
  if(!article)throw Error('Unknown chapter');
  const a='/assets/historical/original/'+slug+'.jpg',b='/assets/historical/web/'+slug+'.webp',c='/assets/historical/card/'+slug+'.webp';
  const web=await sharp(original).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:82}).toBuffer();
  const thumb=await sharp(original).rotate().resize({width:720,withoutEnlargement:true}).webp({quality:77}).toBuffer();
  for(const n of [a,b,c])await fs.mkdir(path.dirname('public'+n),{recursive:true});
  await Promise.all([fs.writeFile('public'+a,original),fs.writeFile('public'+b,web),fs.writeFile('public'+c,thumb)]);
  const sourceUrl='https://commons.wikimedia.org/wiki/'+encodeURIComponent(i.commonsTitle.replaceAll(' ','_')).replaceAll('%3A',':');
  const author=plain(e.Artist?.value).slice(0,150)||'Originating photographer not established';
  const record={
   id:'image:'+slug,slug,title:'Retrolens historic aerial photograph: '+i.location+' ('+i.date+')',
   assetPath:b,sourceUrl,sourceName:'Retrolens / Crown Aerial Film Library, available through Wikimedia Commons',
   credit:author+'; Retrolens / LINZ and credited rights holders per the linked original file page',
   licence,licenceUrl:licenceMap[licence],licenceEvidenceUrl:sourceUrl,
   altText:'Historic black-and-white aerial image of '+i.location+' dating to '+i.date,
   caption:'Retrolens archival aerial view of '+i.location+', '+i.date+'. This image documents the earlier film-survey source material used in geospatial mapping and digital imagery archives.',
   themeIds:[],articleSlug:article.slug,chapterNumber:article.readingOrder,dateDisplay:i.date,
   context:'The scanned aerial photograph was sourced from Retrolens by its Commons contributor. The uploaded image may have been cropped or annotated; it is stored unchanged from that published Commons source and does not purport to be the untouched film negative.',
   originalAssetPath:a,thumbnailPath:c,originalSha256:h,webSha256:hash(web),thumbnailSha256:hash(thumb),originalWidth:md.width,originalHeight:md.height,sourceFileTitle:i.commonsTitle,sourceOriginalUrl:r.url,headerCandidate:false,
   derivativesNote:'The verified Commons upload is preserved unchanged, with separate uncropped WebP derivatives. The upload may differ from the original Crown negative.'};
  await fs.writeFile('src/content/images/'+slug+'.json',JSON.stringify(record,null,2)+'\n');
  result.added++;stat.status='archived';stat.slug=slug;stat.source=sourceUrl;stat.articleSlug=article.slug;stat.originalSha256=h;
 }catch(e){result.held++;stat.reason=String(e.message||e)}
 finally{result.items.push(stat);console.log(i.commonsTitle,stat.status,stat.reason||'');await fs.writeFile('docs/media/retrolens-primary-frames-run-20261011.json',JSON.stringify(result,null,2)+'\n')}
}
console.log('Retrolens archives:',result.added,'new,',result.skippedExisting,'previous,',result.held,'held');
