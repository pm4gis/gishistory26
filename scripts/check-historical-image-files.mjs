import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const dir='src/content/images';
const errors=[];const report=[];
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const files=(await fs.readdir(dir)).filter(f=>f.endsWith('.json')).sort();
for(const file of files){
 const item=JSON.parse(await fs.readFile(path.join(dir,file),'utf8'));
 if(!item.originalAssetPath)continue; // Preserved legacy images have no recorded original yet.
 const base=String(item.id||file);
 for(const [label,relative] of [['original',item.originalAssetPath],['display',item.assetPath],['card',item.thumbnailPath]]){
  if(!relative||!/^\/assets\/historical\/(original|web|card)\/[a-z0-9_.-]+$/i.test(relative)){errors.push(base+' invalid '+label+' path '+relative);continue;}
  try{
   const buffer=await fs.readFile(path.join('public',relative.slice(1)));
   if(!buffer.length)errors.push(base+' empty '+label);
   const checksum=sha(buffer);
   if(label==='original'&&item.originalSha256!==checksum)errors.push(base+' original checksum mismatch');
   if(label==='display'&&item.webSha256!==checksum)errors.push(base+' display checksum mismatch');
   if(label==='original'){
    const meta=await sharp(buffer,{limitInputPixels:250000000}).metadata();
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
console.log('Checked '+report.length+' original historical images against local binaries and metadata.');
if(errors.length){for(const e of errors)console.error(e);process.exitCode=1;}
else console.log('Historical image originals, web variants, thumbnails, metadata and checksums passed.');
