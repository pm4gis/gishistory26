// Archive LINZ-authored historical PDFs that were previously only source-linked.
// Never mirror a third-party publication merely because it is downloadable.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {geodeticPdfPublications} from '../src/lib/geodetic-pdf-publications.mjs';
import {mirroredPdfSlugs} from '../src/lib/geodetic-pdfs-mirrored.mjs';

const candidates=[
 'gis-careers-brochure-2021',
 'linz-annual-report-2010-11',
 'spatial-information-economy-2009'
];
const maxBytes=24*1024*1024;
const pdfDir='public/assets/publications/pdfs';
const coverDir='public/assets/publications/thumbnails';
await fs.mkdir(pdfDir,{recursive:true});
await fs.mkdir(coverDir,{recursive:true});
const acquired=[],skipped=[];
for(const slug of candidates){
 if(mirroredPdfSlugs.includes(slug))continue;
 const p=geodeticPdfPublications.find(x=>x.slug===slug);
 if(!p)throw Error('Missing research catalogue record '+slug);
 if(!new URL(p.sourceUrl).hostname.endsWith('linz.govt.nz'))throw Error('Source is not official LINZ: '+slug);
 const pdf=pdfDir+'/'+p.fileName,thumbnail=coverDir+'/'+p.slug+'.jpg';
 try{
  const response=await fetch(p.sourceUrl,{headers:{'User-Agent':'NZGISHistoryPublicationArchive/1.0','Accept':'application/pdf,*/*'},signal:AbortSignal.timeout(60000)});
  if(!response.ok)throw Error('HTTP '+response.status);
  if(Number(response.headers.get('content-length')||0)>maxBytes)throw Error('Larger than host limit');
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length<1800||bytes.length>maxBytes||bytes.subarray(0,5).toString('ascii')!=='%PDF-')throw Error('Invalid PDF or oversize');
  await fs.writeFile(pdf,bytes,{flag:'wx'});
  const text=spawnSync('pdftotext',['-f','1','-l','6',pdf,'-'],{encoding:'utf8',timeout:60000,maxBuffer:4_000_000});
  if(text.status!==0)throw Error('PDF text inspect failed');
  const front=(text.stdout||'').toLowerCase();
  if(/(must not be reproduced|may not be reproduced|no part of this (report|publication|work) may be reproduced|all rights reserved|unauthorised reproduction)/.test(front))
   throw Error('Document has explicit reproduction restriction');
  // The commissioned ACIL Tasman economic study is not assumed to be Crown-authored.
  if(slug==='spatial-information-economy-2009'&&/(copyright\s*©?\s*acil|copyright\s*acil|©\s*acil|proprietary to acil)/.test(front))
   throw Error('Commissioned third-party document lacks clear reproduction permission');
  const render=spawnSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','960','-jpeg','-jpegopt','quality=82',pdf,coverDir+'/'+slug],{timeout:90000,encoding:'utf8',maxBuffer:2_000_000});
  if(render.status!==0)throw Error('PDF first page cannot render: '+String(render.stderr).slice(0,250));
  const image=await fs.readFile(thumbnail);
  if(image.length<1000||image.subarray(0,3).toString('hex')!=='ffd8ff')throw Error('Invalid thumbnail');
  acquired.push({slug,sourceUrl:p.sourceUrl,size:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),thumbnailBytes:image.length,attribution:'Toitū Te Whenua Land Information New Zealand; original source as listed',copyrightReference:'https://www.linz.govt.nz/copyright'});
  console.log('MIRRORED '+slug+' '+bytes.length+' bytes sha256='+acquired.at(-1).sha256);
 }catch(error){
  await fs.rm(pdf,{force:true});await fs.rm(thumbnail,{force:true});
  skipped.push({slug,sourceUrl:p.sourceUrl,reason:String(error)});
  console.warn('SOURCE-LINKED '+slug+' '+String(error));
 }
}
const slugs=[...new Set([...mirroredPdfSlugs,...acquired.map(p=>p.slug)])].sort();
await fs.writeFile('src/lib/geodetic-pdfs-mirrored.mjs','// Verified unchanged LINZ PDFs and their first-page thumbnails.\nexport const mirroredPdfSlugs = '+JSON.stringify(slugs,null,2)+';\n');
await fs.mkdir('docs/verification',{recursive:true});
await fs.writeFile('docs/verification/remaining-pdfs-acquisition-20261018.json',JSON.stringify({verifiedOn:'2026-10-18',publicationCutoff:'2025-12-31',candidates,acquired,skipped},null,2)+'\n');
console.log('RESULT '+acquired.length+' added; '+skipped.length+' remain source-linked');
