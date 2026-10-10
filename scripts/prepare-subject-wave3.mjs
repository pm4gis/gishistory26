/**
 * Build an offline publication-ready media batch, not public website assets.
 * Requires Node 22, curl and the repository's pinned Sharp dependency.
 * Download originals only from individually verified Wikimedia Commons file URLs.
 * Run with: node scripts/prepare-subject-wave3.mjs
 */
import {mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
import sharp from 'sharp';

const run=promisify(execFile);
const base='docs/media/staging/wave3';
const manifest=JSON.parse(await readFile(path.join(base,'source-manifest.json'),'utf8'));
const output=path.join(base,'acquired');
for(const directory of ['original','web','card','records'])await mkdir(path.join(output,directory),{recursive:true});
const sha256=buffer=>createHash('sha256').update(buffer).digest('hex');
const report={batch:manifest.batch,reviewDate:manifest.created,runAt:new Date().toISOString(),publish:false,peopleProfilesUpdated:0,ready:[],failed:[],bytes:{original:0,web:0,card:0}};
const userAgent='NZGISHistory-Research/1.0 (historical media licensing review; Wikimedia Commons source retrieval)';
for(const entry of manifest.images){
 const suffix=path.extname(entry.filename).toLowerCase();
 const original=path.join(output,'original',entry.id+suffix);
 const web=path.join(output,'web',entry.id+'.webp');
 const card=path.join(output,'card',entry.id+'.webp');
 const urls=[entry.sourceUrl,'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(entry.filename)];
 let downloaded=false;const attempts=[];
 for(const url of urls){
  try {
   await run('curl',['--fail','--location','--silent','--show-error','--retry','3','--retry-delay','2','--retry-all-errors','--max-time','150','--user-agent',userAgent,'--output',original,url],{timeout:180000,maxBuffer:100000});
   const source=await readFile(original);
   if(source.length<4000||source.length>40*1024*1024)throw Error('Unexpected binary size '+source.length);
   const metadata=await sharp(source).metadata();
   if(metadata.width!==entry.expectedWidth||metadata.height!==entry.expectedHeight)throw Error('Dimension discrepancy: '+metadata.width+'x'+metadata.height+' expected '+entry.expectedWidth+'x'+entry.expectedHeight);
   if(metadata.format!=='jpeg')throw Error('Not an original JPEG: '+metadata.format);
   const webBytes=await sharp(source).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:80,effort:5}).toBuffer();
   const cardBytes=await sharp(source).rotate().resize({width:720,withoutEnlargement:true}).webp({quality:74,effort:5}).toBuffer();
   await writeFile(web,webBytes);await writeFile(card,cardBytes);
   const wd=await sharp(webBytes).metadata(),cd=await sharp(cardBytes).metadata();
   const record={
    id:'image:'+entry.id,slug:entry.id,title:entry.title,assetPath:'/assets/historical/web/'+entry.id+'.webp',
    sourceUrl:entry.sourcePage,sourceName:'Wikimedia Commons',credit:entry.creator,
    licence:entry.licence,licenceUrl:entry.licenceUrl,licenceEvidenceUrl:entry.sourcePage,
    altText:entry.description,caption:entry.description,dateDisplay:entry.captured,
    context:entry.association.relationship,themeIds:[],
    originalAssetPath:'/assets/historical/original/'+entry.id+suffix,thumbnailPath:'/assets/historical/card/'+entry.id+'.webp',
    originalSha256:sha256(source),webSha256:sha256(webBytes),originalWidth:metadata.width,originalHeight:metadata.height,
    sourceFileTitle:'File:'+entry.filename.replaceAll('_',' '),
    sourceOriginalUrl:entry.sourceUrl,derivativesNote:'Original preserved unchanged; WebP display and thumbnail resized without cropping or upscaling, with retained source and licence links.'
   };
   await writeFile(path.join(output,'records',entry.id+'.json'),JSON.stringify(record,null,2)+'\n');
   report.ready.push({id:entry.id,association:entry.association,original:{name:path.basename(original),bytes:source.length,sha256:record.originalSha256,width:metadata.width,height:metadata.height},web:{name:path.basename(web),bytes:webBytes.length,sha256:record.webSha256,width:wd.width,height:wd.height},card:{name:path.basename(card),bytes:cardBytes.length,sha256:sha256(cardBytes),width:cd.width,height:cd.height},source:entry.sourcePage,licence:entry.licence,proposedRecord:'records/'+entry.id+'.json'});
   report.bytes.original+=source.length;report.bytes.web+=webBytes.length;report.bytes.card+=cardBytes.length;
   console.log('READY '+entry.id+' '+source.length+' source bytes '+webBytes.length+' WebP bytes');
   downloaded=true;break;
  }catch(e){attempts.push({url,message:String(e).slice(0,450)});console.log('RETRY '+entry.id+' '+String(e).slice(0,150));}
 }
 if(!downloaded)report.failed.push({id:entry.id,source:entry.sourcePage,attempts});
}
await writeFile(path.join(output,'acquisition-report.json'),JSON.stringify(report,null,2)+'\n');
await writeFile(path.join(output,'PUBLISH-GATE.md'),[
 '# NZ GIS History subject-media wave 3 — publication gate',
 '',
 'This is a **held research batch**, not published site media. Do not merge images or image-record JSON into the live collections merely because the binary acquisition succeeds.',
 '',
 'For each accepted record, copy the unchanged original into public/assets/historical/original/, the optimised files into public/assets/historical/web/ and public/assets/historical/card/, and the JSON into src/content/images/. Check collision/duplication against the latest live revision first.',
 '',
 'Only assign the image to the stated council, organisation or properly researched event. Gabrielle imagery and Auckland City Council predecessor photo remain conditional until the exact accepted record/event exists.',
 '',
 'Retain photographer/agency credit, exact capture date, Wikimedia Commons source page, licence URL, and required Copernicus Sentinel attribution. Crops were not performed. CC BY-SA adaptations may require matching licence conditions.',
 '',
 'Never assign any of these images to Person records, biographies, avatars or person cards.',
 '',
 'Test pixel decoding, content integrity, responsive rendering, light/dark modes, accessibility, source links, production build, and preserved records before publication.',
 '',
 'Acquired: '+report.ready.length+' / '+manifest.images.length+'; failed: '+report.failed.length+'. See acquisition-report.json for hashes and failures.'
].join('\n')+'\n');
console.log('BATCH RESULT '+report.ready.length+'/'+manifest.images.length+' READY, '+report.failed.length+' unavailable');
if(report.ready.length===0)process.exitCode=2;
