// Check external publication references and record whether they are actual PDFs.
// HEAD is only a diagnostic: final PDF signatures are verified on acquisition.
import fs from 'node:fs/promises';
import {onlinePdfPublications} from '../src/lib/online-pdf-publications.mjs';
const audit=[];
for(const p of onlinePdfPublications.filter(p=>!p.hostedLocally)){
 const record={slug:p.slug,claimedPdfUrl:p.pdfPath,sourceUrl:p.sourceUrl};
 try{
  const response=await fetch(p.pdfPath,{method:'HEAD',redirect:'follow',headers:{'User-Agent':'NZGISHistoryPublicationArchive/1.0'},signal:AbortSignal.timeout(20000)});
  Object.assign(record,{status:response.status,finalUrl:response.url,contentType:response.headers.get('content-type'),contentLength:response.headers.get('content-length'),xFrameOptions:response.headers.get('x-frame-options'),contentSecurityPolicy:response.headers.get('content-security-policy')?.slice(0,360)});
  record.appearsToBePdf=!!response.headers.get('content-type')?.toLowerCase().includes('pdf') || /\.pdf($|\?)/i.test(response.url);
  console.log('EXTERNAL '+p.slug+' HTTP '+response.status+' '+record.contentType+' frame='+record.xFrameOptions+' pdf='+record.appearsToBePdf);
 }catch(error){
  record.error=String(error);record.appearsToBePdf=false;
  console.log('EXTERNAL '+p.slug+' ERROR '+record.error);
 }
 audit.push(record);
}
await fs.mkdir('docs/verification',{recursive:true});
await fs.writeFile('docs/verification/external-pdf-http-audit-20261018.json',JSON.stringify({checkedOn:'2026-10-18',records:audit},null,2)+'\n');
console.log('AUDIT '+audit.length+' remaining publisher URLs checked');
