// Download and archive LINZ-authored historical publications with an original-source audit.
// Items that cannot be verified remain source-linked rather than misrepresented as hosted.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {linzHistoricalReports} from '../src/lib/linz-historical-reports-20261018.mjs';
import {mirroredLinzReportSlugs} from '../src/lib/linz-historical-reports-mirrored.mjs';

const maxBytes=24*1024*1024;
const pdfDir='public/assets/publications/pdfs';
const coverDir='public/assets/publications/thumbnails';
const acquired=[],skipped=[];
await fs.mkdir(pdfDir,{recursive:true});
await fs.mkdir(coverDir,{recursive:true});

const existing=new Set();
for(const name of await fs.readdir(pdfDir)){
 if(!name.endsWith('.pdf'))continue;
 const buf=await fs.readFile(pdfDir+'/'+name);
 existing.add(createHash('sha256').update(buf).digest('hex'));
}

for(const p of linzHistoricalReports){
 if(mirroredLinzReportSlugs.includes(p.slug))continue;
 const pdfFile=pdfDir+'/'+p.fileName,coverFile=coverDir+'/'+p.slug+'.jpg';
 try{
  const host=new URL(p.sourceUrl).hostname;
  if(host!=='linz.govt.nz'&&host!=='www.linz.govt.nz')throw Error('Not an official LINZ PDF address');
  const response=await fetch(p.sourceUrl,{headers:{'User-Agent':'NZGISHistoryArchive/1.0 (research preservation)','Accept':'application/pdf,*/*'},signal:AbortSignal.timeout(45000)});
  if(!response.ok)throw Error('Publisher returned HTTP '+response.status);
  if(Number(response.headers.get('content-length')||0)>maxBytes)throw Error('Original exceeds static host file limit');
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length<1800||bytes.length>maxBytes||bytes.subarray(0,5).toString('ascii')!=='%PDF-')throw Error('Not a valid or appropriately sized PDF');
  const sha256=createHash('sha256').update(bytes).digest('hex');
  if(existing.has(sha256))throw Error('Identical PDF is already archived');
  await fs.writeFile(pdfFile,bytes,{flag:'wx'});
  const details=spawnSync('pdfinfo',[pdfFile],{encoding:'utf8',timeout:45000,maxBuffer:1000000});
  if(details.status!==0||!/Pages:\s*\d+/.test(details.stdout||''))throw Error('PDF structure check failed');
  const parsed=spawnSync('pdftotext',['-f','1','-l','8',pdfFile,'-'],{encoding:'utf8',timeout:45000,maxBuffer:4000000});
  if(parsed.status!==0)throw Error('PDF text check failed');
  const front=(parsed.stdout||'').toLowerCase();
  if(/all rights reserved|may not be reproduced|must not be reproduced|no part of this (?:report|publication|document|work) may be reproduced|unauthorised reproduction|proprietary and confidential/.test(front))throw Error('Document-specific reproduction restriction; retain publisher URL');
  const render=spawnSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','960','-jpeg','-jpegopt','quality=82',pdfFile,coverDir+'/'+p.slug],{encoding:'utf8',timeout:90000,maxBuffer:3000000});
  if(render.status!==0)throw Error('Unable to render original document front page');
  const jpeg=await fs.readFile(coverFile);
  if(jpeg.length<1000||jpeg.subarray(0,3).toString('hex')!=='ffd8ff')throw Error('Invalid cover JPEG');
  existing.add(sha256);
  const count=Number((details.stdout.match(/^Pages:\s*(\d+)/m)||[])[1]||0);
  acquired.push({slug:p.slug,publisherUrl:p.sourceUrl,published:p.year,pages:count,size:bytes.length,sha256,thumbnailBytes:jpeg.length,attribution:'Toitū Te Whenua Land Information New Zealand',licenceReference:'https://www.linz.govt.nz/copyright'});
  console.log('HOSTED '+p.slug+' '+bytes.length+' bytes');
 }catch(error){
  await fs.rm(pdfFile,{force:true});await fs.rm(coverFile,{force:true});
  skipped.push({slug:p.slug,publisherUrl:p.sourceUrl,reason:String(error)});
  console.warn('SOURCE LINK '+p.slug+' '+String(error));
 }
}
const mirrored=[...new Set([...mirroredLinzReportSlugs,...acquired.map(p=>p.slug)])].sort();
await fs.writeFile('src/lib/linz-historical-reports-mirrored.mjs','// LINZ originals confirmed downloaded, inspected and archived by the source acquisition workflow.\nexport const mirroredLinzReportSlugs = '+JSON.stringify(mirrored,null,2)+';\n');
await fs.mkdir('docs/verification',{recursive:true});
await fs.writeFile('docs/verification/linz-historical-reports-20261018.json',JSON.stringify({
 checkedOn:'2026-10-18',historicalCutoff:'2025-12-31',source:'Official LINZ original PDFs',licenceReference:'https://www.linz.govt.nz/copyright',
 acquired,skipped
},null,2)+'\n');
console.log('Archive complete: '+acquired.length+' acquired, '+skipped.length+' source linked');
