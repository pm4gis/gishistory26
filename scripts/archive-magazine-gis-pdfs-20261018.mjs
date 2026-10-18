// Acquire independently verified public-sector originals in GitHub Actions.
// Records enter the public catalogue only after PDF and cover validation.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {magazinePdfCandidates} from '../src/lib/magazine-pdf-candidates-20261018.mjs';
import {magazinePdfPublications} from '../src/lib/magazine-pdf-publications-20261018.mjs';

const pdfDir='public/assets/publications/pdfs';
const thumbDir='public/assets/publications/thumbnails';
await fs.mkdir(pdfDir,{recursive:true});
await fs.mkdir(thumbDir,{recursive:true});
const published=[...magazinePdfPublications],unavailable=[];
for(const p of magazinePdfCandidates){
 const pdf=pdfDir+'/'+p.fileName, image=thumbDir+'/'+p.slug+'.jpg';
 if(published.some(item=>item.slug===p.slug)){
  const prior=published.find(item=>item.slug===p.slug);
  const bytes=await fs.readFile(pdf);
  const cover=await fs.readFile(image);
  if(bytes.subarray(0,5).toString()!=='%PDF-'||createHash('sha256').update(bytes).digest('hex')!==prior.sha256||cover.subarray(0,3).toString('hex')!=='ffd8ff') throw Error('Previously archived original changed: '+p.slug);
  console.log('PRESERVED '+p.slug);
  continue;
 }
 try{
  const host=new URL(p.sourceUrl).hostname;
  if(!['www.doc.govt.nz','www.linz.govt.nz','knowledgeauckland.org.nz','www.knowledgeauckland.org.nz'].includes(host))throw Error('Unexpected source host '+host);
  const response=await fetch(p.sourceUrl,{headers:{'User-Agent':'NZGISHistoryHistoricalArchive/1.0','Accept':'application/pdf,*/*'},signal:AbortSignal.timeout(65000)});
  if(!response.ok)throw Error('HTTP '+response.status);
  if(Number(response.headers.get('content-length')||0)>24*1024*1024)throw Error('File too large for static host');
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length<2000||bytes.length>=24*1024*1024||bytes.subarray(0,5).toString('ascii')!=='%PDF-')throw Error('Invalid or oversized PDF');
  await fs.writeFile(pdf,bytes);
  const info=spawnSync('pdfinfo',[pdf],{encoding:'utf8',timeout:45000,maxBuffer:1_000_000});
  if(info.status!==0)throw Error('Invalid PDF structure');
  const pages=Number((info.stdout.match(/^Pages:\s*(\d+)/m)||[])[1]);
  if(!pages)throw Error('Unverified PDF page count');
  const extracted=spawnSync('pdftotext',['-f','1','-l',String(Math.min(pages,35)),pdf,'-'],{encoding:'utf8',timeout:45000,maxBuffer:7_000_000});
  if(extracted.status!==0)throw Error('Unable to inspect source text');
  const txt=extracted.stdout.toLowerCase();
  if(!p.checkTerms.every(word=>txt.includes(word)))throw Error('Unexpected source content; review required');
  if(/all rights reserved|permission to use (?:any|all) of its contents must be obtained|no part of this (?:report|publication|work) may be reproduced|must not be reproduced/i.test(txt.slice(0,7000)))throw Error('Source-specific reproduction restriction');
  const jpg=spawnSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','960','-jpeg','-jpegopt','quality=82',pdf,thumbDir+'/'+p.slug],{encoding:'utf8',timeout:60000,maxBuffer:1_000_000});
  if(jpg.status!==0)throw Error('Could not render publication cover');
  const cover=await fs.readFile(image);
  if(cover.length<1000||cover.subarray(0,3).toString('hex')!=='ffd8ff')throw Error('Invalid JPEG');
  const sha256=createHash('sha256').update(bytes).digest('hex');
  published.push({...p,pages,bytes:bytes.length,sha256,checkTerms:undefined,generatedCover:false,hostedLocally:true});
  console.log('ARCHIVED '+p.slug+' '+pages+' pages '+bytes.length+' bytes '+sha256);
 }catch(e){
  await fs.rm(pdf,{force:true});await fs.rm(image,{force:true});
  unavailable.push({slug:p.slug,sourceUrl:p.sourceUrl,reason:String(e)});
  console.warn('NOT ARCHIVED '+p.slug+': '+String(e));
 }
}
const lines = published.map(({checkTerms,...p})=>p);
await fs.writeFile('src/lib/magazine-pdf-publications-20261018.mjs','// Actual PDF originals validated and hosted on this site.\nexport const magazinePdfPublications = '+JSON.stringify(lines,null,2)+';\n');
await fs.mkdir('docs/verification',{recursive:true});
await fs.writeFile('docs/verification/magazine-pdf-archive-20261018.json',JSON.stringify({checkedOn:'2026-10-18',published:published.map(p=>({slug:p.slug,sourceUrl:p.sourceUrl,year:p.year,pages:p.pages,bytes:p.bytes,sha256:p.sha256})),unavailable},null,2)+'\n');
if(published.length===0)console.warn('No original files could be acquired; inspect archive report before retrying.');
