// Archive the authentic January 2007 LINZ Geospatial Strategy only after validating its original PDF.
// The source is a preserved copy of the LINZ publication, held by the McGuinness Institute.
// Reuse basis: LINZ's published CC BY 4.0 copyright policy for LINZ-produced material.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const item={
 slug:'nz-geospatial-strategy-original-2007',
 fileName:'nz-geospatial-strategy-original-2007.pdf',
 title:'Understanding Our Geographic Information Landscape: A New Zealand Geospatial Strategy',
 creator:'Land Information New Zealand',
 year:'2007',date:'January 2007',kind:'Original New Zealand geospatial policy and strategy',
 topic:'The 2007 government strategy for geospatial data governance, fundamental datasets, access and interoperability',
 summary:'Original national strategy documenting New Zealand geospatial information systems and cross-agency practice. Contemporary examples describe GIS at New Zealand Police, Fire Service, Landcare Research and Ministry of Fisheries, as well as early spatial data infrastructure and data-sharing policy.',
 sourceName:'Land Information New Zealand (original publisher); McGuinness Institute (preserved copy)',
 sourceUrl:'https://www.mcguinnessinstitute.org/wp-content/uploads/2021/04/37.-Understanding-Our-Geographic-Information-Landscpae-A-New-Zealand-Geospatial-Strategy-2007.pdf',
 sourceLabel:'Preserved original January 2007 LINZ strategy PDF',
 license:'Creative Commons Attribution 4.0 International (CC BY 4.0) for LINZ-produced material, under LINZ copyright policy',
 licenseUrl:'https://www.linz.govt.nz/copyright',
 attribution:'Land Information New Zealand (2007), Understanding Our Geographic Information Landscape: A New Zealand Geospatial Strategy. Original Crown publication. Source: Toitū Te Whenua Land Information New Zealand, CC BY 4.0. Preserved PDF supplied by the McGuinness Institute.',
 provenance:'Original publication January 2007; contemporaneous LINZ-produced strategy originally distributed at geospatial.govt.nz. Archival copy at McGuinness Institute. Current LINZ copyright policy: https://www.linz.govt.nz/copyright. Validate original PDF bytes, full text and cover before catalogue admission.',
 themeIds:['profession','open-practice'],
 keywords:['2007','GIS','New Zealand Geospatial Strategy','LINZ','New Zealand Police','Fire Service','Landcare Research','Ministry of Fisheries','SDI','interoperability'],
 isNewAddition:true,generatedCover:false,hostedLocally:true
};
const pdfDir='public/assets/publications/pdfs',coverDir='public/assets/publications/thumbnails';
const catalogue='src/lib/online-pdf-publications.mjs';
const modulePath='src/lib/verified-nz-geospatial-strategy-2007.mjs';
const testsPath='tests/online-pdf-publications.test.mjs';
const dest=path.join(pdfDir,item.fileName),cover=path.join(coverDir,item.slug+'.jpg');
const source=await fs.readFile(catalogue,'utf8');
if(source.includes(item.slug)||source.includes('verifiedNzGeospatialStrategy2007')){
 const stat=await fs.stat(dest).catch(()=>null);
 if(stat?.size>20000){console.log('2007 strategy already archived, skipping duplicate.');process.exit(0);}
 throw Error('2007 strategy catalogue entry exists without validated original');
}
for(const name of await fs.readdir('src/lib')){
 if(!name.endsWith('.mjs')||name==='verified-nz-geospatial-strategy-2007.mjs')continue;
 const body=await fs.readFile(path.join('src/lib',name),'utf8');
 if(body.includes('Understanding Our Geographic Information Landscape: A New Zealand Geospatial Strategy')||body.includes('nz-geospatial-strategy-original-2007.pdf')){
  throw Error('Possible existing strategy catalogue record: '+name);
 }
}
function run(exe,args){
 const result=spawnSync(exe,args,{encoding:'utf8',timeout:150000,maxBuffer:24*1024*1024});
 if(result.status!==0)throw Error(exe+' failed: '+String(result.stderr||result.error).slice(0,500));
 return result.stdout;
}
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'nzgis-strategy-'));
try{
 const tempPdf=path.join(temp,'strategy.pdf'),coverBase=path.join(temp,'first-page');
 run('curl',['--fail','--location','--show-error','--silent','--retry','2','--connect-timeout','25','--max-time','120','--proto','=https','--output',tempPdf,item.sourceUrl]);
 const bytes=await fs.readFile(tempPdf);
 if(bytes.length<50000||bytes.length>20*1024*1024||bytes.subarray(0,5).toString()!=='%PDF-')throw Error('Invalid original PDF signature or size');
 const info=run('pdfinfo',[tempPdf]);
 const pages=Number((info.match(/^Pages:\s*(\d+)/m)||[])[1]);
 if(pages!==30)throw Error('Unexpected original page count: '+pages);
 const pdfText=run('pdftotext',['-layout',tempPdf,'-']);
 const lower=pdfText.toLowerCase();
 for(const term of ['geospatial strategy','january 2007','landcare research','new zealand police','fire service','interoperability','ministry of fisheries']){
  if(!lower.includes(term))throw Error('Expected original GIS text missing: '+term);
 }
 run('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','960','-jpeg','-jpegopt','quality=82',tempPdf,coverBase]);
 const jpeg=await fs.readFile(coverBase+'.jpg');
 if(jpeg.length<2000||jpeg.subarray(0,3).toString('hex')!=='ffd8ff')throw Error('Invalid original first-page cover');
 const sha256=createHash('sha256').update(bytes).digest('hex');
 const record={...item,pages,bytes:bytes.length,sha256};
 const marker="import {magazinePdfPublications} from './magazine-pdf-publications-20261018.mjs';";
 const end="verifiedNzGis20261030.map(hosted));";
 if(!source.includes(marker)||!source.includes(end))throw Error('Catalogue structure changed');
 const updated=source.replace(marker,marker+"\nimport {verifiedNzGeospatialStrategy2007} from './verified-nz-geospatial-strategy-2007.mjs';")
   .replace(end,"verifiedNzGis20261030.map(hosted),verifiedNzGeospatialStrategy2007.map(hosted));");
 const tests=await fs.readFile(testsPath,'utf8');
 // PR #151 already added one independently validated 2001 Treasury original.
 if(!tests.includes('68+linzHistoricalReports.length')||!tests.includes('41+mirroredPdfSlugs.length')||!tests.includes('assert.equal(additions.length,34)'))throw Error('Publication tests changed; reconcile counts manually');
 const revisedTests=tests.replace('68+linzHistoricalReports.length','69+linzHistoricalReports.length')
   .replace('41+mirroredPdfSlugs.length','42+mirroredPdfSlugs.length')
   .replace('assert.equal(additions.length,34)','assert.equal(additions.length,35)');
 await fs.mkdir(pdfDir,{recursive:true});await fs.mkdir(coverDir,{recursive:true});
 await fs.copyFile(tempPdf,dest);await fs.copyFile(coverBase+'.jpg',cover);
 await fs.writeFile(modulePath,'// Original LINZ 2007 PDF admitted after signature, page-count, content and first-page checks.\nexport const verifiedNzGeospatialStrategy2007 = '+JSON.stringify([record],null,2)+';\n');
 await fs.writeFile(catalogue,updated);await fs.writeFile(testsPath,revisedTests);
 console.log(JSON.stringify({status:'validated and staged for owner review',slug:item.slug,pages,bytes:bytes.length,sha256,cover},null,2));
}finally{await fs.rm(temp,{recursive:true,force:true});}