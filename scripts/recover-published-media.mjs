import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const origin='https://history.pm4gis.nz';
const response=await fetch(origin+'/data.json?v=20261005-network-release',{signal:AbortSignal.timeout(45000)});
if(!response.ok)throw Error('Published export unavailable: '+response.status);
const raw=await response.json();
if(!Array.isArray(raw.records)||!raw.headerImages)throw Error('Unexpected publication export');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const files=n=>fs.readdirSync('src/content/'+n).filter(f=>f.endsWith('.json')).map(f=>({file:'src/content/'+n+'/'+f,data:read('src/content/'+n+'/'+f)}));
const published=new Map();
const valid=s=>typeof s==='string'&&/^\/assets\/[a-zA-Z0-9_./-]+\.(jpg|jpeg|png|webp)$/i.test(s)&&!s.includes('..');
const findAssets=value=>{if(typeof value==='string'){let s=value;if(s.startsWith(origin+'/assets/'))s=s.slice(origin.length);if(valid(s)&&!published.has(s))published.set(s,{asset:s,credit:'Retained from the existing publication'})}else if(Array.isArray(value))value.forEach(findAssets);else if(value&&typeof value==='object')Object.values(value).forEach(findAssets)};
for(const v of Object.values(raw.headerImages))if(valid(v.file))published.set(v.file,{asset:v.file,title:v.title,credit:v.author||v.license,licence:v.license,licenceUrl:v.licenseUrl});
const publicRecords=files('records');const recordIds=new Set(publicRecords.map(x=>x.data.id));
for(const r of raw.records){if(!recordIds.has(r.id))continue;findAssets(r.sections?.flatMap(s=>s.blocks?.filter(b=>b.type==='figure')||[]));findAssets(r.photoGallery)}
for(const n of ['articles','passages','records','images'])for(const {data} of files(n))findAssets(data);
const result=[];const entries=[...published.values()];let index=0;
async function recover(item){
 const local='public'+item.asset;let bytes;
 try{
  if(fs.existsSync(local))bytes=fs.readFileSync(local);
  else{
   let r=await fetch(origin+item.asset,{signal:AbortSignal.timeout(45000)});
   if(r.status>=500||r.status===429){await new Promise(resolve=>setTimeout(resolve,1000));r=await fetch(origin+item.asset,{signal:AbortSignal.timeout(45000)})}
   if(!r.ok)throw Error('HTTP '+r.status);
   bytes=Buffer.from(await r.arrayBuffer());
  }
  if(bytes.length>25*1024*1024)throw Error('Published asset exceeds hosting limit');
  const meta=await sharp(bytes).metadata();
  if(!meta.width||!meta.height)throw Error('Invalid image dimensions');
  fs.mkdirSync(path.dirname(local),{recursive:true});if(!fs.existsSync(local))fs.writeFileSync(local,bytes);
  result.push({...item,sourceUrl:origin+item.asset,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,width:meta.width,height:meta.height,status:'recovered-published-derivative',transformation:'none'});
 }catch(e){result.push({...item,sourceUrl:origin+item.asset,status:'unresolved',error:e.message})}
}
await Promise.all(Array.from({length:4},async()=>{while(index<entries.length){const i=index++;await recover(entries[i])}}));
result.sort((a,b)=>a.asset.localeCompare(b.asset));const available=new Map(result.filter(r=>r.status!=='unresolved').map(r=>[r.asset,r]));
const images=files('images');const byAsset=new Map(images.map(x=>[x.data.assetPath,x.data]));const restored=[];const unresolvedAssociations=[];
for(const {file,data:p} of files('passages')){
 const rawId=p.articleId.replace('article:chapter-','chapter:');
 const source=raw.records.find(r=>r.id===rawId)?.sections?.find(s=>s.id===p.legacyAnchor);
 let changed=false;
 for(const b of p.blocks||[]){
  if(b.type!=='figure'||b.imageId)continue;
  const matching=source?.blocks?.filter(x=>x.type==='figure'&&x.caption===b.caption&&x.alt===b.alt)||[];
  if(matching.length!==1||!available.has(matching[0].asset)){unresolvedAssociations.push({passageId:p.id,caption:b.caption});continue}
  const asset=matching[0].asset;
  if(!/LINZ/.test(b.alt||'')||!/CC4\.0/.test(b.credit||'')){unresolvedAssociations.push({passageId:p.id,caption:b.caption,reason:'Licence needs reconciliation'});continue}
  let image=byAsset.get(asset);
  if(!image){
   const slug='published-'+path.basename(asset).replace(/\.[^.]+$/,'');
   image={id:'image:'+slug,slug,title:b.alt.replace(/^LINZ imagery:\s*/,''),assetPath:asset,sourceUrl:origin+asset,sourceName:'Existing NZ GIS History publication',credit:b.credit,licence:'Creative Commons Attribution 4.0 International',licenceUrl:'https://creativecommons.org/licenses/by/4.0/',altText:b.alt,caption:b.caption};
   fs.writeFileSync('src/content/images/'+slug+'.json',JSON.stringify(image,null,2)+'\n');byAsset.set(asset,image);
  }
  b.imageId=image.id;changed=true;restored.push({passageId:p.id,asset,imageId:image.id});
 }
 if(changed)fs.writeFileSync(file,JSON.stringify(p,null,2)+'\n');
}
for(const {file,data:r} of publicRecords){
 const original=raw.records.find(x=>x.id===r.id)?.photoGallery;let changed=false;
 for(const item of r.photoGallery?.items||[]){
  if(item.assetPath)continue;
  const matches=original?.items?.filter(i=>i.caption===item.caption&&i.alt===item.alt)||[];
  if(matches.length!==1)continue;
  const candidates=[];const scan=v=>{if(typeof v==='string'){const s=v.startsWith(origin+'/assets/')?v.slice(origin.length):v;if(valid(s)&&available.has(s))candidates.push(s)}else if(Array.isArray(v))v.forEach(scan);else if(v&&typeof v==='object')Object.values(v).forEach(scan)};scan(matches[0]);
  if(new Set(candidates).size!==1)continue;
  item.assetPath=candidates[0];item.width=available.get(item.assetPath).width;item.height=available.get(item.assetPath).height;changed=true;restored.push({recordId:r.id,asset:item.assetPath});
 }
 if(changed)fs.writeFileSync(file,JSON.stringify(r,null,2)+'\n');
}
const manifest=read('content/preservation-manifest.json');
for(const n of ['articles','passages','records','events','relationships','themes','images'])for(const {file} of files(n))manifest[file]=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
fs.writeFileSync('content/preservation-manifest.json',JSON.stringify(manifest,null,2)+'\n');
fs.mkdirSync('docs/media',{recursive:true});
const report={retrievedAt:new Date().toISOString(),scope:'Existing published assets only; no pending historical research imported',items:result,restoredAssociations:restored,unresolvedAssociations,counts:{paths:result.length,recovered:available.size,unresolved:result.length-available.size,restoredAssociations:restored.length}};
fs.writeFileSync('docs/media/recovery.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.counts));
if(report.counts.unresolved||unresolvedAssociations.length)throw Error('Media recovery incomplete; report retained, candidate not committed');
