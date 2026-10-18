// Acquire independently verified public-sector originals in GitHub Actions.
// Records enter the public catalogue only after PDF and cover validation.
// Run after the full candidate and chapter mapping set has been checked.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {magazinePdfCandidates} from '../src/lib/magazine-pdf-candidates-20261018.mjs';
import {magazinePdfPublications} from '../src/lib/magazine-pdf-publications-20261018.mjs';
import {regionalGisPdfCandidates} from '../src/lib/regional-gis-pdf-candidates-20261018.mjs';
import {historicalGisNewCandidates} from '../src/lib/historical-gis-new-candidates-20261018.mjs';
import {docScienceNewsletterCandidates} from '../src/lib/doc-science-newsletter-candidates-20261018.mjs';

const pdfDir='public/assets/publications/pdfs';
const thumbDir='public/assets/publications/thumbnails';
await fs.mkdir(pdfDir,{recursive:true});
await fs.mkdir(thumbDir,{recursive:true});
const published=[...magazinePdfPublications],unavailable=[];
const magazineEvidence=[];let newlyArchivedPeriodicals=0;
const maxNewPeriodicals=15;
const spatialMention=/(?:\bGIS\b|\bArcView\b|\bARC\s*\/\s*INFO\b|geograph(?:ical|ic) information systems?|\bBiosite\b|\bspatial (?:database|information|analysis|data|mapping)\b|\bremote sensing\b|\bmap(?:ping)? database\b|\bdigital mapping\b|\bcomputer(?:ised|ized)? mapping\b)/gi;
for(const p of [...magazinePdfCandidates,...regionalGisPdfCandidates,...historicalGisNewCandidates,...docScienceNewsletterCandidates]){
 const isPeriodical=docScienceNewsletterCandidates.some(issue=>issue.slug===p.slug);
 if(isPeriodical&&newlyArchivedPeriodicals>=maxNewPeriodicals){unavailable.push({slug:p.slug,sourceUrl:p.sourceUrl,reason:'Deferred: 15 original magazine PDFs already archived in this release'});continue;}
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
  if(!['www.doc.govt.nz','www.linz.govt.nz','knowledgeauckland.org.nz','www.knowledgeauckland.org.nz','environment.govt.nz','www.gw.govt.nz','gw.govt.nz','www.boprc.govt.nz'].includes(host))throw Error('Unexpected source host '+host);
  // MfE historical asset URLs repeatedly redirect back to themselves; avoid pointless retries
  // unless an operator explicitly requests another verification attempt.
  if(host==='environment.govt.nz' && process.env.RETRY_MFE_UNVERIFIED_URLS!=='1') throw Error('Official source URL redirects repeatedly; set RETRY_MFE_UNVERIFIED_URLS=1 to retry');
  let bytes;
  try{
   const response=await fetch(p.sourceUrl,{headers:{'User-Agent':'Mozilla/5.0 NZGISHistoryArchive/1.0','Accept':'application/pdf,*/*'},signal:AbortSignal.timeout(20000)});
   if(!response.ok)throw Error('HTTP '+response.status);
   if(Number(response.headers.get('content-length')||0)>24*1024*1024)throw Error('File too large for static host');
   bytes=Buffer.from(await response.arrayBuffer());
  }catch(primaryError){
   console.warn('Retrying '+p.slug+' with curl after '+String(primaryError));
   const transfer=spawnSync('curl',['--fail','--location','--silent','--show-error','--max-time','35','--retry','1','-A','Mozilla/5.0 (compatible; NZGISHistoryArchive/1.0)',p.sourceUrl],{timeout:55000,maxBuffer:25*1024*1024});
   if(transfer.status!==0)throw Error('PDF source unreachable via fetch and curl: '+(transfer.stderr?.toString()||String(primaryError)).slice(0,350));
   bytes=transfer.stdout;
  }
  if(bytes.length<2000||bytes.length>=24*1024*1024||bytes.subarray(0,5).toString('ascii')!=='%PDF-')throw Error('Invalid or oversized PDF');
  await fs.writeFile(pdf,bytes);
  const info=spawnSync('pdfinfo',[pdf],{encoding:'utf8',timeout:45000,maxBuffer:1_000_000});
  if(info.status!==0)throw Error('Invalid PDF structure');
  const pages=Number((info.stdout.match(/^Pages:\s*(\d+)/m)||[])[1]);
  if(!pages)throw Error('Unverified PDF page count');
  const extracted=spawnSync('pdftotext',['-f','1','-l',String(Math.min(pages,35)),pdf,'-'],{encoding:'utf8',timeout:45000,maxBuffer:7_000_000});
  if(extracted.status!==0)throw Error('Unable to inspect source text');
  const txt=extracted.stdout.toLowerCase();
  if(!p.checkTerms.every(word=>txt.includes(word.toLowerCase())))throw Error('Unexpected source content; review required');
  const spatialHits=isPeriodical?[...extracted.stdout.matchAll(spatialMention)]:[];
  if(isPeriodical&&spatialHits.length===0)throw Error('No unambiguous GIS/spatial information reference found in issue OCR text');
  if(!Number.isInteger(Number(p.year))||Number(p.year)>2025)throw Error('Publication outside accepted history cutoff');
  if(!/department of conservation|ministry for the environment|greater wellington regional council/i.test(p.sourceName)&&!/(creative commons|cc by|cc-by|attribution 4\.0)/i.test(txt.slice(0,16000)))throw Error('No document-level council republication licence identified');
  if(/all rights reserved|permission to use (?:any|all) of its contents must be obtained|no part of this (?:report|publication|work) may be reproduced|must not be reproduced|may not be reproduced or copied|copyright extends to all forms of copying|shall not be reproduced|reproduction prohibited/i.test(txt.slice(0,16000)))throw Error('Source-specific reproduction restriction');
  const jpg=spawnSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','960','-jpeg','-jpegopt','quality=82',pdf,thumbDir+'/'+p.slug],{encoding:'utf8',timeout:60000,maxBuffer:1_000_000});
  if(jpg.status!==0)throw Error('Could not render publication cover');
  const cover=await fs.readFile(image);
  if(cover.length<1000||cover.subarray(0,3).toString('hex')!=='ffd8ff')throw Error('Invalid JPEG');
  const sha256=createHash('sha256').update(bytes).digest('hex');
  published.push({...p,pages,bytes:bytes.length,sha256,checkTerms:undefined,generatedCover:false,hostedLocally:true});
  if(isPeriodical){const hit=spatialHits[0],start=Math.max(0,hit.index-190);magazineEvidence.push({slug:p.slug,issue:p.title,year:p.year,term:hit[0],context:extracted.stdout.slice(start,Math.min(extracted.stdout.length,hit.index+270)).replace(/\s+/g,' ').trim(),hitCount:spatialHits.length,pages,sha256,sourceUrl:p.sourceUrl});newlyArchivedPeriodicals++;}
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
await fs.writeFile('docs/verification/doc-science-newsletter-gis-evidence-20261018.json',JSON.stringify({checkedOn:'2026-10-18',maxNewPeriodicals,archivedCount:newlyArchivedPeriodicals,evidence:magazineEvidence,unavailable:unavailable.filter(x=>docScienceNewsletterCandidates.some(p=>p.slug===x.slug))},null,2)+'\n');
console.log('SCIENCE_PERIODICAL_BATCH '+newlyArchivedPeriodicals+' new original issues');
if(published.length===0)console.warn('No original files could be acquired; inspect archive report before retrying.');
