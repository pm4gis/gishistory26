/** Acquire and validate the wave 6 archival originals and licensed contextual exports. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const queue=JSON.parse(await fs.readFile('docs/media/curated-sources-timeline-wave6.json','utf8'));
const report={checkedAt:new Date().toISOString(),success:0,failed:0,items:[]};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const ROOT='https://raw.githubusercontent.com/pm4gis/gishistory26/main/';
async function response(url,accept='*/*'){
 const res=await fetch(url,{signal:AbortSignal.timeout(180000),headers:{'User-Agent':'NZGISHistory/1.0 (documentary archive; https://history.pm4gis.nz)','Accept':accept}});
 if(!res.ok)throw Error('HTTP '+res.status+' from '+new URL(url).host);
 return res;
}
async function json(url){return (await response(url,'application/json')).json();}
async function textBody(url){return (await response(url,'text/html,application/json,*/*')).text();}
async function rights(item){
 if(item.sourceType==='nlb'){
  const record=item.catalogueUrl||'';
  const viewer=item.sourceOriginalUrl||'';
  const manifestUrl=item.manifestUrl||'';
  const allowed=['Sourced from LINZ. Crown Copyright reserved.','Sourced from University of Auckland. Crown Copyright reserved.'];
  if(!/^https:\/\/natlib\.govt\.nz\/records\/\d+$/.test(record))throw Error('National Library record URL is not a direct catalogue record');
  if(!/^https:\/\/ndhadeliver\.natlib\.govt\.nz\/delivery\/DeliveryManagerServlet\?dps_pid=IE\d+$/.test(viewer))throw Error('National Library viewer URL is not an approved record landing URL');
  const pid=viewer.match(/dps_pid=(IE\d+)/)?.[1];
  if(!pid||manifestUrl!==`https://ndhadeliver.natlib.govt.nz/delivery/iiif/presentation/3/${pid}/manifest`)throw Error('National Library manifest does not match the record item ID');
  if(!allowed.includes(item.requiredAttribution)||item.credit!==item.requiredAttribution||item.licenceEvidenceUrl!==manifestUrl)throw Error('Image-specific National Library credit or manifest evidence does not match the curated record');
  const manifest=await json(manifestUrl);
  const statement=Object.values(manifest.requiredStatement?.value||{}).flat().join(' ').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  if(!statement.includes(item.requiredAttribution))throw Error('National Library manifest attribution does not match the image-specific credit');
  if(!/may be used, copied and re-distributed free of charge in any format or media/i.test(statement))throw Error('National Library manifest does not provide a verified free-copying statement for this item');
  let canvases=manifest.items||[];
  if(!canvases.length)throw Error('National Library IIIF manifest contains no image canvases');
  const tokens=(item.expectedCanvasTokens||[]).map(x=>x.toLowerCase());
  if(tokens.length){
   canvases=canvases.filter(canvas=>tokens.every(token=>Object.values(canvas.label||{}).flat().join(' ').toLowerCase().includes(token)));
  }else if(canvases.length>1){
   const year=String(item.dateDisplay||'').match(/\b(?:19|20)\d{2}\b/)?.[0];
   if(year)canvases=canvases.filter(canvas=>Object.values(canvas.label||{}).flat().join(' ').includes(year));
  }
  if(canvases.length!==1)throw Error('Could not uniquely identify the correct National Library edition/canvas; candidates: '+(manifest.items||[]).map(c=>Object.values(c.label||{}).flat().join(' ')).join(' | '));
  const canvas=canvases[0];
  const label=Object.values(canvas.label||{}).flat().join(' ').trim();
  let body=canvas.items?.[0]?.items?.[0]?.body;
  if(Array.isArray(body))body=body.find(candidate=>candidate?.type==='Image'&&candidate.id);
  if(!body?.id||!body.id.startsWith('https://ndhadeliver.natlib.govt.nz:443/iiif/3/'))throw Error('National Library canvas does not expose its official full-resolution image service');
  if(!body.id.includes('/full/max/0/default.jpg'))throw Error('National Library canvas image URL is not the full-resolution JPEG service response');
  if(!canvas.width||!canvas.height||!label)throw Error('National Library canvas is missing dimensions or a source label');
  const sourceFileTitle=label+' (600 ppi National Library canvas; full-resolution JPEG delivered by IIIF)';
  return {licence:item.licence,licenceEvidenceUrl:manifestUrl,originalUrl:body.id,sourceFileTitle,sourceCanvasLabel:label,sourceCanvasWidth:canvas.width,sourceCanvasHeight:canvas.height,rightsStatement:statement};
 }
 if(item.sourceType==='commons'){
  const u=new URL('https://commons.wikimedia.org/w/api.php');
  for(const [k,v] of Object.entries({action:'query',titles:item.commonsTitle,prop:'imageinfo',iiprop:'url|extmetadata|size',format:'json',formatversion:'2'}))u.searchParams.set(k,v);
  const data=await json(u);
  const info=data.query?.pages?.[0]?.imageinfo?.[0];
  if(!info)throw Error('Wikimedia Commons image metadata missing');
  const live=info.extmetadata?.LicenseShortName?.value;
  if(live!==item.licence)throw Error('Commons licence mismatch: expected '+item.licence+', received '+live);
  if(!info.url?.startsWith('https://upload.wikimedia.org/wikipedia/commons/'))throw Error('Commons original URL is not on Wikimedia upload storage');
  return {licence:live,licenceEvidenceUrl:item.licenceEvidenceUrl,originalUrl:info.url,sourceFileTitle:info.canonicaltitle||item.commonsTitle};
 }
 if(item.sourceType==='arcgis-doc'){
  const [terms,meta]=await Promise.all([textBody(item.licenceEvidenceUrl),json(item.serviceMetadataUrl)]);
  if(!terms.includes('Creative Commons Attribution 3.0 New Zealand License'))throw Error('DOC geospatial-data licence statement was not verified');
  if(!String(meta.copyrightText||'').includes('Department of Conservation'))throw Error('DOC map-service source attribution is missing');
  const layer=meta.layers?.find(x=>x.id===item.arcgisParameters.layerId);
  if(!layer||layer.name!==item.arcgisParameters.expectedLayerName)throw Error('Expected DOC layer is unavailable');
  return {licence:item.licence,licenceEvidenceUrl:item.licenceEvidenceUrl,originalUrl:item.sourceOriginalUrl,sourceFileTitle:'ArcGIS export: '+layer.name};
 }
 if(item.sourceType==='arcgis-upperhutt'){
  const [itemMeta,service]=await Promise.all([json(item.rightsItemMetadataUrl),json(item.serviceMetadataUrl)]);
  const licenseText=String(itemMeta.licenseInfo||itemMeta.termsOfUse||itemMeta.accessInformation||'');
  if(!/Creative Commons Attribution 4\.0/i.test(licenseText))throw Error('Upper Hutt feature service item does not confirm CC BY 4.0');
  if(!String(service.copyrightText||'').includes('LINZ')||!String(service.copyrightText||'').includes('UHCC'))throw Error('Upper Hutt map service attribution is incomplete');
  const layer=service.layers?.find(x=>x.id===item.arcgisParameters.layerId);
  if(!layer||layer.name!==item.arcgisParameters.expectedLayerName)throw Error('Expected Upper Hutt parcel layer is unavailable');
  return {licence:item.licence,licenceEvidenceUrl:item.licenceEvidenceUrl,originalUrl:item.sourceOriginalUrl,sourceFileTitle:'ArcGIS export: '+layer.name};
 }
 throw Error('Unsupported source type '+item.sourceType);
}
async function retrieve(url){
 let last;
 for(let attempt=0;attempt<3;attempt++){
  try{
   const res=await response(url,'image/jpeg,image/png,image/svg+xml,image/tiff,application/octet-stream,*/*');
   const data=Buffer.from(await res.arrayBuffer());
   if(!data.length||data.length>94*1024*1024)throw Error('Original file is empty or exceeds the 94 MiB GitHub blob safety limit');
   return {data,finalUrl:res.url,mediaType:res.headers.get('content-type')||''};
  }catch(e){last=e;if(attempt<2)await new Promise(r=>setTimeout(r,1200*(attempt+1)));}
 }
 throw last;
}
function extension(format){
 return ({jpeg:'jpg',jpg:'jpg',png:'png',tiff:'tif',tif:'tif',svg:'svg'})[format]||null;
}
for(const item of queue.items){
 const out={slug:item.slug,source:item.sourceUrl};
 try{
  if(!item.slug||!/^[-a-z0-9]+$/.test(item.slug))throw Error('Invalid image slug');
  const verified=await rights(item);
  const {data,finalUrl,mediaType}=await retrieve(verified.originalUrl);
  let meta;
  try{meta=await sharp(data,{limitInputPixels:500000000}).metadata();}
  catch(error){const signature=data.subarray(0,20).toString('hex');const preview=data.subarray(0,160).toString('utf8').replace(/[^\x20-\x7e]/g,' ').trim();throw Error('Image decoder rejected source response ('+mediaType+', '+data.length+' bytes, signature '+signature+', preview '+preview+'): '+String(error.message||error));}
  const ext=extension(meta.format);
  if(!ext||!meta.width||!meta.height||meta.width<250||meta.height<200)throw Error('Unsupported or too-small original image: '+meta.format+' '+meta.width+'x'+meta.height);
  const originalRelative='docs/media/originals/wave6/'+item.slug+'.'+ext;
  const web='/assets/historical/web/'+item.slug+'.webp';
  const card='/assets/historical/card/'+item.slug+'.webp';
  const recordPath='src/content/images/'+item.slug+'.json';
  try{await fs.access(recordPath);throw Error('Refusing to overwrite existing image record');}catch(e){if(e.code!=='ENOENT')throw e;}
  const webImage=await sharp(data,{limitInputPixels:500000000}).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:82,effort:5}).toBuffer();
  const cardImage=await sharp(data,{limitInputPixels:500000000}).rotate().resize({width:720,withoutEnlargement:true}).webp({quality:76,effort:5}).toBuffer();
  await fs.mkdir(path.dirname(originalRelative),{recursive:true});
  for(const asset of [web,card])await fs.mkdir(path.dirname('public'+asset),{recursive:true});
  await fs.writeFile(originalRelative,data);
  await fs.writeFile('public'+web,webImage);
  await fs.writeFile('public'+card,cardImage);
  const archiveOriginalUrl=ROOT+originalRelative;
  const record={
   id:item.id,slug:item.slug,title:item.title,assetPath:web,sourceUrl:item.sourceUrl,sourceName:item.sourceName,
   credit:item.credit,licence:item.licence,licenceUrl:item.licenceUrl,licenceEvidenceUrl:verified.licenceEvidenceUrl,
   altText:item.altText,caption:item.caption,themeIds:[],articleSlug:item.articleSlug,chapterNumber:item.chapter,
   dateDisplay:item.dateDisplay,context:item.context,archiveOriginalPath:originalRelative,archiveOriginalUrl,
   thumbnailPath:card,originalSha256:sha(data),webSha256:sha(webImage),originalWidth:meta.width,originalHeight:meta.height,
   sourceFileTitle:verified.sourceFileTitle||item.sourceFileTitle||item.commonsTitle||decodeURIComponent(new URL(finalUrl).pathname.split('/').at(-1)),
   sourceCanvasLabel:verified.sourceCanvasLabel,sourceCanvasDimensions:verified.sourceCanvasWidth&&verified.sourceCanvasHeight?[verified.sourceCanvasWidth,verified.sourceCanvasHeight]:undefined,
   rightsStatement:verified.rightsStatement,
   sourceOriginalUrl:finalUrl,sourceMediaType:mediaType,headerCandidate:false,relatedRecords:item.relatedRecords||[],sourceType:item.sourceType,
   derivativesNote:'The exact source image response acquired from the publisher is preserved unchanged in docs/media/originals/wave6 and linked from this page. The site serves uncropped WebP derivatives resized without enlargement to 1600 px and 720 px. The historical content of a source image has not been retouched.'
  };
  await fs.writeFile(recordPath,JSON.stringify(record,null,2)+'\n');
  Object.assign(out,{status:'acquired',originalRelative,sourceOriginalUrl:finalUrl,bytes:data.length,dimensions:[meta.width,meta.height],sha256:sha(data),licence:verified.licence});
  report.success++;
 }catch(e){out.status='failed';out.error=String(e.message||e);report.failed++;}
 report.items.push(out);console.log(item.slug,out.status,out.error||out.bytes);
}
await fs.mkdir('docs/media',{recursive:true});
await fs.writeFile('docs/media/timeline-download-run-wave6.json',JSON.stringify(report,null,2)+'\n');
console.log('Wave 6: acquired '+report.success+' of '+queue.items.length+' source originals; failed '+report.failed+'.');
if(report.failed)process.exitCode=1;
