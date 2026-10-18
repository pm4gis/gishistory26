// Acquire 1978–1999 LINZ originals; retain DOC originals as publisher-hosted
// because their reports contain document-specific permission statements.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {pre2000PdfPublications} from '../src/lib/pre2000-pdf-publications-20261018.mjs';
import {mirroredPre2000PdfSlugs} from '../src/lib/pre2000-pdfs-mirrored.mjs';

const pdfDir='public/assets/publications/pdfs';
const thumbDir='public/assets/publications/thumbnails';
const maxBytes=24*1024*1024;
await fs.mkdir(pdfDir,{recursive:true});await fs.mkdir(thumbDir,{recursive:true});
const acquired=[],sourceLinked=[],existing=new Set();
for(const path of (await fs.readdir(pdfDir)).filter(x=>x.endsWith('.pdf'))){
  const bytes=await fs.readFile(pdfDir+'/'+path);
  existing.add(createHash('sha256').update(bytes).digest('hex'));
}
for(const p of pre2000PdfPublications){
  if(mirroredPre2000PdfSlugs.includes(p.slug))continue;
  const hostname=new URL(p.sourceUrl).hostname;
  if(hostname!=='www.linz.govt.nz'&&hostname!=='linz.govt.nz'){
    sourceLinked.push({slug:p.slug,sourceUrl:p.sourceUrl,reason:'Publisher PDF retained: document-specific DOC permissions require separate authorisation'});
    continue;
  }
  const path=pdfDir+'/'+p.fileName;
  const cover=thumbDir+'/'+p.slug+'.jpg';
  try{
    const response=await fetch(p.sourceUrl,{headers:{'User-Agent':'NZGISHistoryHistoricalArchive/1.0','Accept':'application/pdf,*/*'},signal:AbortSignal.timeout(55000)});
    if(!response.ok)throw Error('Source HTTP '+response.status);
    if(Number(response.headers.get('content-length')||0)>maxBytes)throw Error('File exceeds static hosting limit');
    const bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length<1800||bytes.length>maxBytes||bytes.subarray(0,5).toString('ascii')!=='%PDF-')throw Error('Source is not a valid appropriately sized PDF');
    const sha256=createHash('sha256').update(bytes).digest('hex');
    if(existing.has(sha256))throw Error('Original duplicates an existing archived PDF');
    await fs.writeFile(path,bytes,{flag:'wx'});
    const info=spawnSync('pdfinfo',[path],{encoding:'utf8',timeout:55000,maxBuffer:1000000});
    if(info.status!==0||!/Pages:\s*\d+/.test(info.stdout||''))throw Error('Invalid PDF structure');
    const parsed=spawnSync('pdftotext',['-f','1','-l','8',path,'-'],{encoding:'utf8',timeout:60000,maxBuffer:5000000});
    if(parsed.status!==0)throw Error('PDF text inspection failed');
    const front=(parsed.stdout||'').toLowerCase();
    if(/all rights reserved|must not be reproduced|may not be reproduced|no part of this (?:report|publication|document|work) may be reproduced|proprietary and confidential|permission to use any of its contents must be obtained/.test(front))throw Error('Explicit source-specific reproduction restriction');
    const keywords=p.slug==='first-order-triangulation-1978'?['triangulation']:p.slug==='cadastre-reforms-1999'?['cadastre','landonline']:p.slug==='nzgd49-wgs84-transformation-1997'?['transformation','geodetic']:['geodetic','datum','spatial','cadastre','survey','seabed','antarctica'];
    if(!keywords.some(term=>front.includes(term)))throw Error('Source content does not match the expected historical publication');
    const render=spawnSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','960','-jpeg','-jpegopt','quality=82',path,thumbDir+'/'+p.slug],{encoding:'utf8',timeout:90000,maxBuffer:1000000});
    if(render.status!==0)throw Error('First-page image could not be rendered');
    const jpeg=await fs.readFile(cover);
    if(jpeg.length<1000||jpeg.subarray(0,3).toString('hex')!=='ffd8ff')throw Error('First-page JPEG is not valid');
    const pages=Number((info.stdout.match(/^Pages:\s*(\d+)/m)||[])[1]);
    acquired.push({slug:p.slug,publicationYear:p.year,sourceUrl:p.sourceUrl,pages,size:bytes.length,sha256,thumbnailBytes:jpeg.length,attribution:p.creator});
    existing.add(sha256);
    console.log('ARCHIVED '+p.slug+' ('+bytes.length+' bytes, '+pages+' pages)');
  }catch(error){
    await fs.rm(path,{force:true});await fs.rm(cover,{force:true});
    sourceLinked.push({slug:p.slug,sourceUrl:p.sourceUrl,reason:String(error)});
    console.warn('SOURCE LINK '+p.slug+': '+String(error));
  }
}
const mirrored=[...new Set([...mirroredPre2000PdfSlugs,...acquired.map(p=>p.slug)])].sort();
await fs.writeFile('src/lib/pre2000-pdfs-mirrored.mjs','// Original pre-2000 LINZ PDFs verified and archived by the acquisition workflow.\nexport const mirroredPre2000PdfSlugs = '+JSON.stringify(mirrored,null,2)+';\n');
await fs.mkdir('docs/verification',{recursive:true});
await fs.writeFile('docs/verification/pre2000-pdf-acquisition-20261018.json',JSON.stringify({
  checkedOn:'2026-10-18',publicationCutoff:'2025-12-31',
  documentarySources:'Official LINZ and Department of Conservation historical PDF addresses',
  rehostingBasis:'LINZ website CC BY 4.0 default terms, subject to document-specific restrictions',
  licenceReference:'https://www.linz.govt.nz/copyright',
  acquired,sourceLinked
},null,2)+'\n');
if(acquired.length+sourceLinked.length+mirroredPre2000PdfSlugs.length!==pre2000PdfPublications.length)throw Error('Not all records were accounted for');
console.log('RESULT '+acquired.length+' original PDFs archived, '+sourceLinked.length+' publication URLs retained');
