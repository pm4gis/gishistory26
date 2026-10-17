import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
import {chapterDocuments} from '../src/lib/chapter-documents.mjs';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const report=[];
for(const document of chapterDocuments){
 const original='public'+document.assetPath;
 const bytes=fs.readFileSync(original);
 if(bytes.length!==document.bytes||sha(bytes)!==document.sha256)throw Error('Changed original: '+document.slug);
 const info=execFileSync('pdfinfo',[original],{encoding:'utf8'});
 const pages=Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);
 if(pages!==document.pdfPages)throw Error('Page count mismatch: '+document.slug);
 const prefix='public/assets/historical/publications/'+document.slug;
 fs.mkdirSync(path.dirname(prefix),{recursive:true});
 const cover=prefix+'-cover.png',card=prefix+'-card.webp';
 execFileSync('pdftoppm',['-f','1','-singlefile','-scale-to','2000','-png',original,prefix+'-cover']);
 await sharp(cover).resize({width:720,height:960,fit:'inside',withoutEnlargement:true}).webp({quality:90}).toFile(card);
 const meta=await sharp(cover).metadata();
 report.push({slug:document.slug,originalAssetPath:document.assetPath,originalSha256:document.sha256,pages,coverPath:cover.slice(6),thumbnailPath:card.slice(6),coverSha256:sha(fs.readFileSync(cover)),thumbnailSha256:sha(fs.readFileSync(card)),width:meta.width,height:meta.height,method:'Original first page rendered uncropped with Poppler at up to 2000 pixels; WebP card derived at up to 720×960 pixels.'});
}
fs.mkdirSync('docs/verification',{recursive:true});
fs.writeFileSync('docs/verification/archived-publication-covers-20261017.json',JSON.stringify(report,null,2)+'\n');
console.log('Verified four unchanged originals and rendered four cover/card pairs.');
