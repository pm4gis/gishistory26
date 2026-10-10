import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const dir='src/content/images';
const errors=[];
const report=[];
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const files=(await fs.readdir(dir)).filter(name=>name.endsWith('.json')).sort();
for(const file of files){
 const item=JSON.parse(await fs.readFile(path.join(dir,file),'utf8'));
 const base=String(item.id||file);
 const original=item.originalAssetPath||item.archiveOriginalPath;
 if(!original)continue; // Legacy image records without an acquired source binary remain unchanged.
 for(const label of ['original','display','card']){
  const relative=label==='original'?original:label==='display'?item.assetPath:item.thumbnailPath;
  if(!relative){errors.push(base+' missing '+label+' path');continue;}
  let localPath;
  if(label==='original'&&item.archiveOriginalPath){
   if(!/^docs\/media\/originals\/[a-z0-9_.-]+\/[a-z0-9_.-]+$/i.test(relative)){errors.push(base+' invalid archived original path '+relative);continue;}
   localPath=relative;
   const expected='https://raw.githubusercontent.com/pm4gis/gishistory26/main/'+relative;
   if(item.archiveOriginalUrl!==expected)errors.push(base+' archived original link does not match its repository path');
  }else{
   const allowed=label==='original'?/^\/assets\/historical\/original\/[a-z0-9_.-]+$/i:label==='display'?/^\/assets\/historical\/web\/[a-z0-9_.-]+$/i:/^\/assets\/historical\/card\/[a-z0-9_.-]+$/i;
   if(!allowed.test(relative)){errors.push(base+' invalid '+label+' path '+relative);continue;}
   localPath=path.join('public',relative.slice(1));
  }
  try{
   const buffer=await fs.readFile(localPath);
   if(!buffer.length)errors.push(base+' empty '+label);
   const checksum=sha(buffer);
   if(label==='original'&&item.originalSha256!==checksum)errors.push(base+' original checksum mismatch');
   if(label==='display'&&item.webSha256!==checksum)errors.push(base+' display checksum mismatch');
   if(label==='original'){
    const meta=await sharp(buffer,{limitInputPixels:500000000}).metadata();
    if(meta.width!==item.originalWidth||meta.height!==item.originalHeight)errors.push(base+' original dimensions mismatch');
    report.push({id:item.id,file:relative,bytes:buffer.length,width:meta.width,height:meta.height,sha256:checksum});
   }
  }catch(e){errors.push(base+' missing or invalid '+label+': '+String(e.message||e))}
 }
 for(const required of ['sourceUrl','licence','licenceUrl','credit','caption','context','articleSlug','dateDisplay']){
  if(!item[required]||typeof item[required]!=='string')errors.push(base+' missing '+required);
 }
 if(!item.altText||!item.altText.trim())errors.push(base+' missing alt text');
}
console.log('Checked '+report.length+' acquired source originals against local binaries and image-page metadata.');
if(errors.length){for(const error of errors)console.error(error);process.exitCode=1;}
else console.log('Archived/display/card files, source attribution, reuse terms, accessibility text, dimensions and checksums passed.');
