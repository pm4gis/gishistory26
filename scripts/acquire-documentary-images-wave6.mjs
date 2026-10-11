/**
 * Additional authentic documentary imagery for NZ GIS History, 11 October 2026.
 * Uses Wikimedia Commons' live licensing metadata and retrieves unchanged originals.
 * Historical photos/maps are contextual, never asserted to depict a GIS installation.
 * Reject unlicensed media, unverified satellite dates, large/duplicate files and errors.
 * No historic prose, existing images, or existing protected files are altered.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const TARGET = 100, MAX_ORIGINAL = 15 * 1024 * 1024;
const REPORT = 'docs/media/documentary-image-wave6-result-20261011.json';
const USER_AGENT = 'NZGISHistory/1.0 (historical image source attribution; https://history.pm4gis.nz)';
const categories = [
  {category:'Old maps of New Zealand',kind:'historic-map',limit:35,articles:['what-the-computer-inherited','from-map-sheets-to-spatial-data','drawing-maps-by-machine','topography-goes-digital']},
  {category:'Old maps of cities in New Zealand',kind:'historic-map',limit:8,articles:['councils-build-corporate-gis','what-the-computer-inherited']},
  {category:'Crown Grant',kind:'cadastre',limit:12,articles:['the-cadastre-becomes-data','landonline','roads-addresses-and-property']},
  {category:'Old geological maps of New Zealand',kind:'geology',limit:11,articles:['mapping-land-as-data','science-goes-spatial','turning-the-landscape-into-numbers']},
  {category:'Old maps of the history of New Zealand',kind:'historic-map',limit:7,articles:['what-the-computer-inherited','coordinates-enter-the-computer']},
  {category:'Aerial photographs of New Zealand',kind:'aerial',limit:18,articles:['imagery-becomes-infrastructure','turning-the-landscape-into-numbers','mapping-from-a-drone']},
  {category:'Landsat images of New Zealand',kind:'landsat',limit:11,articles:['earth-observation-becomes-routine','conservation-and-environment']},
  {category:'Satellite pictures of New Zealand',kind:'satellite',limit:10,articles:['earth-observation-becomes-routine','from-flat-maps-to-3d']},
  {category:'Geological maps of New Zealand',kind:'geology',limit:11,articles:['science-goes-spatial','mapping-land-as-data']},
  {category:'Maps of earthquakes in New Zealand',kind:'hazard',limit:12,articles:['safety-policing-and-emergency-gis','science-goes-spatial']}
];
const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));
const hash = buf => crypto.createHash('sha256').update(buf).digest('hex');
const key = text => crypto.createHash('sha1').update(text).digest('hex').slice(0,16);
const fileUrl = t => 'https://commons.wikimedia.org/wiki/'+encodeURIComponent(t.replaceAll(' ','_')).replaceAll('%3A',':');
const clean = text => String(text||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const licenceMap = new Map([
 ['Public domain','https://creativecommons.org/publicdomain/mark/1.0/'],
 ['CC0','https://creativecommons.org/publicdomain/zero/1.0/'],
 ['CC BY 2.0','https://creativecommons.org/licenses/by/2.0/'],
 ['CC BY 3.0','https://creativecommons.org/licenses/by/3.0/'],
 ['CC BY 4.0','https://creativecommons.org/licenses/by/4.0/'],
 ['CC BY-SA 2.0','https://creativecommons.org/licenses/by-sa/2.0/'],
 ['CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/'],
 ['CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/']
]);
const report={startedAt:new Date().toISOString(),target:TARGET,success:0,failed:0,held:0,skipped:0,byCategory:{},sourceTypes:{'Wikimedia Commons':0,USGS:0},items:[],warnings:[]};
const articles=(await Promise.all((await fs.readdir('src/content/articles')).filter(n=>n.endsWith('.json')).map(async n=>JSON.parse(await fs.readFile('src/content/articles/'+n,'utf8')))));
const existing=(await Promise.all((await fs.readdir('src/content/images')).filter(n=>n.endsWith('.json')).map(async n=>JSON.parse(await fs.readFile('src/content/images/'+n,'utf8')))));
const knownTitles=new Set(existing.map(x=>x.sourceFileTitle).filter(Boolean).map(x=>x.toLowerCase()));
const knownPages=new Set(existing.map(x=>x.sourceUrl).filter(Boolean));
const knownHashes=new Set(existing.map(x=>x.originalSha256).filter(Boolean));
const knownSlugs=new Set(existing.map(x=>x.slug));
async function saveReport(){await fs.writeFile(REPORT,JSON.stringify(report,null,2)+'\n');}
async function get(url, as='json', timeout=35000){
 let last;for(let attempt=0;attempt<3;attempt++){const c=new AbortController(),t=setTimeout(()=>c.abort(),timeout);
 try{const r=await fetch(url,{signal:c.signal,headers:{'User-Agent':USER_AGENT,'Accept':as==='json'?'application/json':'image/jpeg,image/png,*/*'}});if(!r.ok)throw Error('HTTP '+r.status+' '+new URL(url).hostname);
 if(as==='json')return await r.json();
 const len=Number(r.headers.get('content-length')||0);if(len>MAX_ORIGINAL)throw Error('source file larger than 15MiB');
 const b=Buffer.from(await r.arrayBuffer());if(!b.length||b.length>MAX_ORIGINAL)throw Error('source exceeds size limit');return{data:b,url:r.url};
 }catch(e){last=e;if(attempt<2)await sleep(700*(attempt+1));}finally{clearTimeout(t)}}
 throw last;
}
async function commonsMembers(cat){
 const u=new URL('https://commons.wikimedia.org/w/api.php');for(const [k,v] of Object.entries({action:'query',list:'categorymembers',cmtitle:'Category:'+cat,cmtype:'file',cmlimit:'500',format:'json',formatversion:'2'}))u.searchParams.set(k,v);
 const out=[];let cont;do{if(cont)u.searchParams.set('cmcontinue',cont);const r=await get(u.toString());out.push(...(r.query?.categorymembers||[]).map(x=>x.title));cont=r.continue?.cmcontinue;if(out.length>1000)break;}while(cont);return [...new Set(out)];
}
function subjectDate(t,kind,info){
 const str=t.replace(/^File:/,'');if(/20(?:26|27|28|29)/.test(str))return null;
 const years=[...str.matchAll(/(?<!\d)(1[6-9]\d\d|20[012]\d)(?!\d)/g)].map(m=>Number(m[1])).filter(y=>y>=1600&&y<=2025);
 if(kind==='historic-map'||kind==='cadastre'||kind==='geology'){
   const year=years.find(y=>y<=2025);return year?String(year):'Historical map, exact date not established';
 }
 const original=clean(info?.extmetadata?.DateTimeOriginal?.value||info?.extmetadata?.DateTime?.value||'');
 const os=[...original.matchAll(/(?<!\d)(19\d\d|20[012]\d)(?!\d)/g)].map(m=>Number(m[1])).filter(y=>y<=2025);
 const first=years[0]||os[0];return first?String(first):null;
}
function suitable(t,kind){
 if(!/\.(?:png|jpe?g)$/i.test(t))return false;
 if(/2026|2027|2028|2029|montage|collage|screenshot of wikipedia|logo|flag|poster|book cover/i.test(t))return false;
 if(kind==='historic-map')return /map|chart|survey|geograph|islands|plan|new zealand|port nicholson|auckland|welllington|wellington|tasm|mercury bay|nelson|island/i.test(t);
 if(kind==='cadastre')return /crown grant map/i.test(t);
 if(kind==='geology')return /map|geolog|chatham|zealandia|fault|hydrogeolog|terrane/i.test(t);
 if(kind==='aerial')return /aerial|airphoto|survey|orthophot|194\d|195\d|196\d|197\d|198\d|199\d|200\d|201\d|202[0-5]/i.test(t);
 if(kind==='landsat')return /landsat|new zealand|ruapehu|taranaki|tongariro|kaikoura|puff|whakaari|satellite|peninsula|dunedin/i.test(t);
 if(kind==='satellite')return /new zealand|zeeland|aerial|satellite|strait|envisat|island|dem|coast|cook|mount|sea|glacier/i.test(t);
 return true;
}
async function detail(t){
 const u=new URL('https://commons.wikimedia.org/w/api.php');for(const [k,v] of Object.entries({action:'query',prop:'imageinfo',titles:t,iiprop:'url|extmetadata|size|mime',format:'json',formatversion:'2'}))u.searchParams.set(k,v);return (await get(u.toString())).query?.pages?.[0]?.imageinfo?.[0];
}
function caption(t,cat,year){
 const name=t.replace(/^File:/,'').replace(/\.(jpg|jpeg|png)$/i,'').replace(/[_]+/g,' ');
 const y=year==='Historical map, exact date not established'?' (date unconfirmed)': ' ('+year+')';
 if(cat.kind==='cadastre')return 'Crown grant cadastral map: '+name+y+'. An original paper land-record source, reproduced here for historical context rather than as a GIS screen.';
 if(cat.kind==='aerial')return 'Historical aerial photograph: '+name+y+'. Photographic source material subsequently used in digital image archives and GIS.';
 if(cat.kind==='landsat'||cat.kind==='satellite')return 'Satellite observation: '+name+y+'. This is remotely sensed imagery, not a photograph of GIS software.';
 if(cat.kind==='hazard')return 'New Zealand hazard-mapping document: '+name+y+'. Its period and purpose should be read from the original source record.';
 if(cat.kind==='geology')return 'Geological mapping: '+name+y+'. The mapped subject belongs to the spatial evidence that later GIS systems could combine.';
 return 'Historical New Zealand map: '+name+y+'. This predates the digital GIS systems described in the chapter.';
}
function articleFor(cat,n){const slug=cat.articles[n%cat.articles.length];return articles.find(a=>a.slug===slug);}
async function archive({t,info,cat,categoryIndex}){
 const rights=clean(info.extmetadata?.LicenseShortName?.value);
 if(!licenceMap.has(rights))throw Error('licence not on approved list: '+rights);
 if(!info.url?.startsWith('https://upload.wikimedia.org/wikipedia/commons/'))throw Error('not a Wikimedia original');
 if(!['image/jpeg','image/png'].includes(info.mime))throw Error('unsupported MIME '+info.mime);
 if(info.size>MAX_ORIGINAL)throw Error('too large to archive');
 if(info.width<500||info.height<380)throw Error('insufficient source resolution');
 const date=subjectDate(t,cat.kind,info);if(!date)throw Error('satellite/aerial date not verifiably before 2026');
 const u=fileUrl(t);if(knownPages.has(u)||knownTitles.has(t.toLowerCase()))throw Error('already archived');
 const slug='doc-'+cat.kind+'-'+key(t),id='image:'+slug;if(knownSlugs.has(slug))throw Error('slug already exists');
 const original=await get(info.url,'binary',55000);
 const sourceHash=hash(original.data);if(knownHashes.has(sourceHash))throw Error('duplicate source checksum');
 const meta=await sharp(original.data,{limitInputPixels:280000000}).metadata();if(!['jpeg','png'].includes(meta.format))throw Error('not a supported image after decoding');
 const web=await sharp(original.data,{limitInputPixels:280000000}).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:81,effort:4}).toBuffer();
 const card=await sharp(original.data,{limitInputPixels:280000000}).rotate().resize({width:720,withoutEnlargement:true}).webp({quality:75,effort:4}).toBuffer();
 const ext=meta.format==='jpeg'?'jpg':'png',originalPath='/assets/historical/original/'+slug+'.'+ext,webPath='/assets/historical/web/'+slug+'.webp',cardPath='/assets/historical/card/'+slug+'.webp';
 const title=t.replace(/^File:/,'').replace(/\.(?:png|jpe?g)$/i,'').replaceAll('_',' ');const article=articleFor(cat,categoryIndex);if(!article)throw Error('missing chapter article');
 const artist=clean(info.extmetadata?.Artist?.value);const creator=(artist&&!/@/.test(artist)?artist.slice(0,175):'Creator not established in Commons metadata');
 const name=cat.kind==='aerial'?'Historical aerial photograph':cat.kind==='cadastre'?'Crown grant map':cat.kind==='landsat'?'Landsat satellite image':cat.kind==='satellite'?'Satellite observation':'Historical map';
 const record={id,slug,title:name+': '+title,assetPath:webPath,sourceUrl:u,sourceName:'Wikimedia Commons',credit:creator+'; Wikimedia Commons (original uploader/source record)',licence:rights,licenceUrl:licenceMap.get(rights),licenceEvidenceUrl:u,altText:title,caption:caption(t,cat,date),themeIds:[],articleSlug:article.slug,chapterNumber:article.readingOrder,dateDisplay:date,context:'Documentary original from Wikimedia Commons '+cat.category+' category. Source and date require interpretation in the cited original record; this image is historical or geographical context and is not evidence of a particular New Zealand GIS installation.',originalAssetPath:originalPath,thumbnailPath:cardPath,originalSha256:sourceHash,webSha256:hash(web),thumbnailSha256:hash(card),originalWidth:meta.width,originalHeight:meta.height,sourceFileTitle:t,sourceOriginalUrl:original.url,headerCandidate:false,derivativesNote:'Unaltered source original retained locally, plus uncropped 1600px and 720px WebP renditions.'};
 for(const p of [originalPath,webPath,cardPath])await fs.mkdir(path.dirname('public'+p),{recursive:true});
 await Promise.all([fs.writeFile('public'+originalPath,original.data),fs.writeFile('public'+webPath,web),fs.writeFile('public'+cardPath,card)]);
 await fs.writeFile('src/content/images/'+slug+'.json',JSON.stringify(record,null,2)+'\n');
 knownSlugs.add(slug);knownTitles.add(t.toLowerCase());knownPages.add(u);knownHashes.add(sourceHash);
 report.success++;report.sourceTypes['Wikimedia Commons']++;
 report.items.push({slug,title,category:cat.category,chapter:article.readingOrder,articleSlug:article.slug,date,licence:rights,source:u,original:originalPath,web:webPath,sha256:sourceHash,bytes:original.data.length,status:'archived'});
 console.log('ARCHIVED',report.success,slug,article.slug);await saveReport();
}
for(const cat of categories){
 if(report.success>=TARGET)break;let files=[];
 try{files=await commonsMembers(cat.category);}catch(e){report.warnings.push(cat.category+': category lookup '+e.message);continue;}
 let candidates=files.filter(t=>suitable(t,cat.kind)&&!knownTitles.has(t.toLowerCase())&&!knownPages.has(fileUrl(t)));
 // Deterministic interleaving rather than selecting only early alphabetic items.
 const stride=Math.max(1,Math.floor(candidates.length/Math.max(cat.limit*3,1)));candidates=candidates.filter((_,i)=>i%stride===0);
 let n=0;
 for(const t of candidates){if(n>=cat.limit||report.success>=TARGET)break;
   try{const info=await detail(t);if(!info)throw Error('missing Commons file info');
      await archive({t,info,cat,categoryIndex:n});n++;
   }catch(e){const reason=String(e?.message||e);report.held++;if(report.items.length<220)report.items.push({source:fileUrl(t),category:cat.category,status:'held',reason});}
   await sleep(330);
 }
 report.byCategory[cat.category]=n;await saveReport();
}
report.completedAt=new Date().toISOString();report.shortfall=Math.max(0,TARGET-report.success);await saveReport();
console.log('New documentary images archived:',report.success,'/',TARGET,'held:',report.held,'by category:',JSON.stringify(report.byCategory));
