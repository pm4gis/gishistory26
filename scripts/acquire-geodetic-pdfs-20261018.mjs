// Acquire unmodified originals from LINZ where its website CC BY 4.0 terms apply.
// This script runs only in the repository's authorised GitHub Actions workflow.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {geodeticPdfPublications} from '../src/lib/geodetic-pdf-publications.mjs';
import {mirroredPdfSlugs} from '../src/lib/geodetic-pdfs-mirrored.mjs';

const allowed=new Set([
 'nz-map-grid-1973','geodetic-datum-proposal-1998','geodetic-operations-1995-98',
 'nzgd2000-realisation-2000','nzgd2000-implementation-2003','geodesy-national-report-2003-2006',
 'where-in-the-world-2007','nzgd2000-standard-2007','nzgd2000-projections-standard-2008',
 'geodetic-system-part1-2009','geodetic-system-part2-2009',
 'geodetic-system-part3-2010','geodetic-system-part4-2010',
 'nzgd2000-deformation-format-2013','nz-positioning-strategy-2014',
 'cadastre-2034-strategy-2014','linz-four-year-plan-2016','nzgo-status-oia-2024'
]);
const maxBytes=24*1024*1024;
const pdfDir='public/assets/publications/pdfs';
const coverDir='public/assets/publications/thumbnails';
await fs.mkdir(pdfDir,{recursive:true});
await fs.mkdir(coverDir,{recursive:true});
const acquired=[], skipped=[];
for(const p of geodeticPdfPublications){
 if(!allowed.has(p.slug) || mirroredPdfSlugs.includes(p.slug))continue;
 const pdfPath=pdfDir+'/'+p.fileName, coverPath=coverDir+'/'+p.slug+'.jpg';
 try{
  const reply=await fetch(p.sourceUrl,{headers:{'User-Agent':'Mozilla/5.0 (compatible; NZGISHistoryArchive/1.0)','Accept':'application/pdf,*/*'},signal:AbortSignal.timeout(45000)});
  if(!reply.ok)throw Error('HTTP '+reply.status);
  if(Number(reply.headers.get('content-length')||0)>maxBytes)throw Error('PDF too large for static hosting');
  const bytes=Buffer.from(await reply.arrayBuffer());
  if(bytes.length<1500||bytes.length>maxBytes||bytes.subarray(0,5).toString()!=='%PDF-')throw Error('Invalid or oversized PDF bytes');
  await fs.writeFile(pdfPath,bytes,{flag:'wx'});
  // Detect source-specific reproduction restrictions on cover pages.
  const text=spawnSync('pdftotext',['-f','1','-l','4',pdfPath,'-'],{encoding:'utf8',timeout:60000,maxBuffer:3_000_000});
  const front=(text.stdout||'').toLowerCase();
  if(/(may not be reproduced|must not be reproduced|no part of this (report|publication) may be reproduced|all rights reserved)/.test(front))
   throw Error('Source-specific reuse restriction identified; retain publisher link');
  const out=spawnSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','960','-jpeg','-jpegopt','quality=82',pdfPath,coverDir+'/'+p.slug],{encoding:'utf8',timeout:90000,maxBuffer:2_000_000});
  if(out.status!==0)throw Error('First-page render failed: '+(out.stderr||'').slice(0,250));
  const jpeg=await fs.readFile(coverPath);
  if(jpeg.length<1000||jpeg[0]!==0xff||jpeg[1]!==0xd8||jpeg[2]!==0xff)throw Error('Invalid JPEG derivative');
  const sha256=createHash('sha256').update(bytes).digest('hex');
  acquired.push({slug:p.slug,sourceUrl:p.sourceUrl,bytes:bytes.length,sha256,thumbnailPath:'/assets/publications/thumbnails/'+p.slug+'.jpg',licence:'LINZ CC BY 4.0 default website content terms',licenceEvidence:'https://www.linz.govt.nz/copyright'});
  console.log('Acquired '+p.slug+' '+bytes.length+' bytes '+sha256);
 }catch(e){
  await fs.rm(pdfPath,{force:true});await fs.rm(coverPath,{force:true});
  skipped.push({slug:p.slug,reason:String(e)});
  console.warn('Retaining publisher PDF for '+p.slug+': '+String(e));
 }
}
if(acquired.length===0)throw Error('No LINZ PDF originals could be acquired; source-linked catalogue remains available');
const ids=[...new Set([...mirroredPdfSlugs,...acquired.map(r=>r.slug)])].sort();
await fs.writeFile('src/lib/geodetic-pdfs-mirrored.mjs','// Verified unchanged LINZ PDFs and their documentary first-page thumbnails.\nexport const mirroredPdfSlugs = '+JSON.stringify(ids,null,2)+';\n');
await fs.mkdir('docs/verification',{recursive:true});
await fs.writeFile('docs/verification/geodetic-pdf-acquisition-20261018.json',JSON.stringify({publishedBefore:'2026-01-01',checkedAt:'2026-10-18',sources:'Official LINZ PDF URLs',licence:'https://www.linz.govt.nz/copyright',acquired,skipped},null,2)+'\n');
console.log('Acquired '+acquired.length+' LINZ originals; '+skipped.length+' remain source-linked');
