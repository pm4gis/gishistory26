/**
 * Generic archive-only ingest of individually licensed documentary GIS images.
 * Usage: node scripts/acquire-documentary-gis-media.mjs docs/media/<vetted-manifest>.json
 * Only acquires immutable Git originals validated against repository Git blob SHA-1,
 * original byte lengths, a publisher licence and exact source metadata.
 * Do not infer screenshot capture dates from Git commit timestamps.
 */
import {createHash} from 'node:crypto';
import {readFile,writeFile,readdir,access,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
const name=process.argv[2];
if(!name||!/^docs\/media\/[a-z0-9_.-]+\.json$/i.test(name))throw Error('Supply a vetted docs/media JSON manifest path.');
const manifest=JSON.parse(await readFile(name,'utf8'));
const required=['batch','publisher','repository','commit','sourceDate','copyright','licence','licenceUrl','licenceLocal','licenceSourceFile','licenceGitBlobSha','licenceBytes'];
for(const field of required)if(!manifest[field])throw Error('Manifest missing '+field);
if(!/^[a-f0-9]{40}$/.test(manifest.commit))throw Error('Source commit must be immutable');
if(manifest.sourceDate>'2024-12-31')throw Error('Original source publication after 2024 is not in project scope');
if(!Array.isArray(manifest.images)||manifest.images.length<1)throw Error('Empty batch is prohibited');
const repoURL='https://raw.githubusercontent.com/'+manifest.repository+'/'+manifest.commit+'/';
const blobURL='https://github.com/'+manifest.repository+'/blob/'+manifest.commit+'/';
const digest=(kind,buffer)=>createHash(kind).update(buffer).digest('hex');
const gitHash=b=>digest('sha1',Buffer.concat([Buffer.from('blob '+b.length+'\0'),b]));
const fetchOriginal=async path=>{
 const res=await fetch(repoURL+path,{redirect:'error',headers:{'User-Agent':'NewZealandGISHistoryArchive/1.0'},signal:AbortSignal.timeout(30000)});
 if(!res.ok)throw Error('Cannot retrieve original source '+path+' HTTP '+res.status);
 return Buffer.from(await res.arrayBuffer());
};
const notice=await fetchOriginal(manifest.licenceSourceFile);
if(notice.length!==manifest.licenceBytes||gitHash(notice)!==manifest.licenceGitBlobSha)throw Error('Pinned publisher reuse licence has changed');
if(!notice.toString('utf8').includes(manifest.copyright))throw Error('Publisher copyright not verified in original licence');
if(!notice.toString('utf8').includes('Redistributions in binary form must reproduce'))throw Error('BSD notice and disclaimer absent');
if(manifest.licenceLocal!=='/assets/historical/licences/'+manifest.batch+'.txt')throw Error('Unexpected local licence path');
const localNotice='public'+manifest.licenceLocal;
try{const existing=await readFile(localNotice);if(!existing.equals(notice))throw Error('Publisher notice cannot be overwritten')}catch(e){
 if(e.code!=='ENOENT')throw e;
 await mkdir('public/assets/historical/licences',{recursive:true});
 await writeFile(localNotice,notice);
}
const old=await Promise.all((await readdir('src/content/images')).filter(f=>f.endsWith('.json')).map(async f=>JSON.parse(await readFile('src/content/images/'+f,'utf8'))));
const slugs=new Set(old.map(x=>x.slug)),digests=new Set(old.map(x=>x.originalSha256).filter(Boolean)),blobs=new Set(old.map(x=>x.sourceGitBlobSha).filter(Boolean));
const unique=new Set();
let csv=await readFile('docs/media/chapter-image-alignment-wave2-20261011.csv','utf8');
const quote=v=>'"'+String(v||'').replaceAll('"','""')+'"';
const log=[];
for(const item of manifest.images){
 for(const k of ['slug','sourceFile','gitBlobSha','bytes','format','title','dateDisplay','caption','altText','context'])if(item[k]===undefined||item[k]===null||item[k]==='')throw Error('Missing '+k+' for '+item.slug);
 if(unique.has(item.slug))throw Error('Duplicate manifest slug '+item.slug);
 unique.add(item.slug);
 if(!/^[a-z0-9-]+$/.test(item.slug)||!/^[a-f0-9]{40}$/.test(item.gitBlobSha)||!['png','jpeg','jpg','gif'].includes(item.format))throw Error('Unacceptable file specification '+item.slug);
 if(!item.dateDisplay.includes('date unknown')&&!item.dateDisplay.includes('date not established'))throw Error('Capture date uncertainty must be explicit '+item.slug);
 if(slugs.has(item.slug)){console.log('Already present, unchanged '+item.slug);continue}
 if(blobs.has(item.gitBlobSha))throw Error('Source original blob already published '+item.slug);
 const bytes=await fetchOriginal(item.sourceFile);
 if(bytes.length!==item.bytes||gitHash(bytes)!==item.gitBlobSha)throw Error('Immutable Git SHA or byte count changed '+item.slug);
 const sum=digest('sha256',bytes);
 if(digests.has(sum))throw Error('Duplicate original SHA-256 '+item.slug);
 const meta=await sharp(bytes,{page:0}).metadata();
 if(meta.format!==(item.format==='jpg'?'jpeg':item.format)||meta.width<100||meta.height<100)throw Error('Source is not valid expected image '+item.slug);
 const base='public/assets/historical/';
 const original=base+'original/'+item.slug+'.'+item.format;
 const display=base+'web/'+item.slug+'.webp';
 const card=base+'card/'+item.slug+'.webp';
 for(const f of [original,display,card])try{await access(f);throw Error('Refusing to overwrite image '+f)}catch(e){if(e.code!=='ENOENT')throw e}
 const web=await sharp(bytes,{page:0}).resize({width:1600,withoutEnlargement:true}).webp({quality:87}).toBuffer();
 const thumb=await sharp(bytes,{page:0}).resize({width:720,withoutEnlargement:true}).webp({quality:85}).toBuffer();
 for(const dir of ['original','web','card'])await mkdir(base+dir,{recursive:true});
 await Promise.all([writeFile(original,bytes),writeFile(display,web),writeFile(card,thumb)]);
 const record={
  id:'image:'+item.slug,slug:item.slug,title:item.title,
  assetPath:'/assets/historical/web/'+item.slug+'.webp',
  sourceUrl:blobURL+item.sourceFile,sourceName:manifest.publisher+' (source repository '+manifest.repository+')',
  credit:manifest.copyright+'. Original image from official source documentation, reused under '+manifest.licence+'.',
  licence:manifest.licence,licenceUrl:manifest.licenceUrl,licenceEvidenceUrl:manifest.licenceUrl,licenceDocumentPath:manifest.licenceLocal,
  altText:item.altText,caption:item.caption,dateDisplay:item.dateDisplay,imageCaptureDate:'Not established',
  sourcePublicationDate:'Available in a pinned repository snapshot on '+manifest.sourceDate,
  context:item.context,themeIds:[],archiveOnly:true,headerCandidate:false,
  originalAssetPath:'/assets/historical/original/'+item.slug+'.'+item.format,
  thumbnailPath:'/assets/historical/card/'+item.slug+'.webp',
  originalSha256:sum,webSha256:digest('sha256',web),thumbnailSha256:digest('sha256',thumb),
  originalWidth:meta.width,originalHeight:meta.height,sourceFileTitle:item.sourceFile,
  sourceOriginalUrl:repoURL+item.sourceFile,sourceGitBlobSha:item.gitBlobSha,sourceSnapshotCommit:manifest.commit,
  archiveUrl:blobURL+item.sourceFile,derivativesNote:'Unchanged original source binary preserved. Web and card previews are uncropped, reduced WebP versions and are not dated as capture-time screenshots.'
 };
 await writeFile('src/content/images/'+item.slug+'.json',JSON.stringify(record,null,2)+'\n');
 if(csv.includes('"'+item.slug+'",'))throw Error('Image was already in alignment register without asset record '+item.slug);
 const row=[item.slug,item.title,manifest.batch,'','archive-only-for-chapters',
 'Held: original documentary GIS interface not yet reviewed for specific story passage','','','',item.dateDisplay,record.sourceUrl,manifest.licence,manifest.licenceUrl,
 'Publisher source from immutable pre-2025 Git commit; licence and source file verified by hash. Actual capture date not established; no implied chapter association.'];
 csv=csv.trimEnd()+'\r\n'+row.map(quote).join(',')+'\r\n';
 log.push({slug:item.slug,originalBytes:bytes.length,sha256:sum,width:meta.width,height:meta.height,source:record.sourceUrl});
 slugs.add(item.slug);blobs.add(item.gitBlobSha);digests.add(sum);
}
await writeFile('docs/media/chapter-image-alignment-wave2-20261011.csv',csv);
const path='docs/media/documentary-archive-ledger-20261016.md';
let ledger=await readFile(path,'utf8');
const marker='<!-- INGEST '+manifest.batch+' -->';
if(!ledger.includes(marker))throw Error('Ledger must name explicit batch acquisition marker');
ledger=ledger.replace(marker,'Source originals acquired, hashes and licence verified by GitHub Actions:\n'+log.map(x=>'- '+x.slug+': '+x.originalBytes+' bytes; SHA-256 '+x.sha256).join('\n'));
await writeFile(path,ledger);
console.log(JSON.stringify({batch:manifest.batch,added:log.length,records:log},null,2));
