// Acquire an explicitly CC BY 4.0-licensed original, validate it and prepare
// the existing Publications reader without changing its layout or existing entries.
// A failed download or validation exits non-zero before any catalogue change.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const item = {
  slug: 'treasury-internal-mobility-gis-2001',
  fileName: 'treasury-internal-mobility-gis-2001.pdf',
  title: 'Internal Mobility in New Zealand',
  creator: 'Suzi Kerr, Dave Maré, William Power and Jason Timmins',
  year: '2001',
  date: '1 December 2001',
  kind: 'Treasury Working Paper 01/04',
  topic: 'GIS-defined census meshblock neighbourhoods and spatial analysis of New Zealand internal migration',
  summary: 'A contemporary spatial-statistics study using GIS to define 20 km neighbourhoods around Statistics New Zealand area units from meshblock geography. Section 3.1.2 describes the GIS method; Figures 1–4 show the spatial variables and national migration patterns.',
  sourceName: 'The Treasury New Zealand',
  sourceUrl: 'https://www.treasury.govt.nz/sites/default/files/2007-10/twp01-04.pdf',
  sourceLabel: 'Original Treasury working paper PDF',
  license: 'Creative Commons Attribution 4.0 International (CC BY 4.0), as stated on the Treasury publication record',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  attribution: 'Suzi Kerr, Dave Maré, William Power and Jason Timmins (2001), Internal Mobility in New Zealand, Treasury Working Paper 01/04. Source: The Treasury New Zealand.',
  provenance: 'Original publication dated 1 December 2001; explicit item-level CC BY 4.0: https://www.treasury.govt.nz/publications/wp/internal-mobility-new-zealand-wp-01-04. Original PDF verified before local archiving.',
  themeIds: ['profession', 'open-practice'],
  keywords: ['GIS', 'meshblocks', 'Statistics New Zealand', 'spatial statistics', 'migration', 'Treasury', '2001'],
  isNewAddition: true,
  generatedCover: false,
  hostedLocally: true
};
const pdfDir='public/assets/publications/pdfs';
const coverDir='public/assets/publications/thumbnails';
const catalog='src/lib/online-pdf-publications.mjs';
const modulePath='src/lib/verified-nz-gis-publications-20261030.mjs';
const destination=path.join(pdfDir,item.fileName);
const cover=path.join(coverDir,item.slug+'.jpg');
const source=await fs.readFile(catalog,'utf8');
if(source.includes(item.slug) || source.includes('verifiedNzGis20261030')){
  const existing=await fs.stat(destination).catch(()=>null);
  if(existing?.size>2000){console.log('Previously acquired; no duplicate added.');process.exit(0);}
  throw Error('Catalogue already refers to source but original PDF is missing');
}
const checkDirs=['src/lib'];
for(const dir of checkDirs){
  for(const name of await fs.readdir(dir)){
    if(!name.endsWith('.mjs') || name==='verified-nz-gis-publications-20261030.mjs')continue;
    const text=await fs.readFile(path.join(dir,name),'utf8');
    if(text.includes('twp01-04.pdf') || text.includes('Internal Mobility in New Zealand')){
      throw Error('Potential duplicate in '+name+'; review before acquisition');
    }
  }
}
function run(exe,args,opts={}){
  const result=spawnSync(exe,args,{encoding:'utf8',timeout:100000,maxBuffer:15*1024*1024,...opts});
  if(result.status!==0)throw Error(exe+' failed: '+String(result.stderr||result.error).slice(0,400));
  return result.stdout;
}
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'nzgis-original-'));
try{
  const tempPdf=path.join(temp,'original.pdf');
  const tempCoverBase=path.join(temp,'cover');
  run('curl',['--fail','--location','--show-error','--silent','--retry','2','--connect-timeout','20','--max-time','90','--proto','=https','--output',tempPdf,item.sourceUrl]);
  const bytes=await fs.readFile(tempPdf);
  if(bytes.length<20000||bytes.length>20*1024*1024||bytes.subarray(0,5).toString()!=='%PDF-')throw Error('Original PDF signature or size invalid');
  const info=run('pdfinfo',[tempPdf]);
  const pages=Number((info.match(/^Pages:\s*(\d+)/m)||[])[1]);
  if(pages!==26)throw Error('Expected 26 pages; found '+pages);
  const text=run('pdftotext',['-layout',tempPdf,'-']);
  for(const term of ['Internal Mobility','GIS Variables','meshblocks','01/04']){
    if(!text.toLowerCase().includes(term.toLowerCase()))throw Error('Expected original text absent: '+term);
  }
  if(!/20\s?km/i.test(text))throw Error('20 km GIS neighbourhood method absent');
  run('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','960','-jpeg','-jpegopt','quality=82',tempPdf,tempCoverBase]);
  const jpg=await fs.readFile(tempCoverBase+'.jpg');
  if(jpg.length<2000||jpg.subarray(0,3).toString('hex')!=='ffd8ff')throw Error('First-page cover failed');
  const sha256=createHash('sha256').update(bytes).digest('hex');
  const entry={...item,pages,bytes:bytes.length,sha256};
  const newModule='// Original PDF admitted only after signature, page count, text, rendering and checksum verification.\nexport const verifiedNzGis20261030 = '+JSON.stringify([entry],null,2)+';\n';
  const marker="import {magazinePdfPublications} from './magazine-pdf-publications-20261018.mjs';";
  const tail='magazinePdfPublications.map(hosted));';
  if(!source.includes(marker)||!source.includes(tail))throw Error('Publications catalogue structure changed; manual review required');
  const updated=source.replace(marker,marker+"\nimport {verifiedNzGis20261030} from './verified-nz-gis-publications-20261030.mjs';")
    .replace(tail,'magazinePdfPublications.map(hosted),verifiedNzGis20261030.map(hosted));');
  await fs.mkdir(pdfDir,{recursive:true});await fs.mkdir(coverDir,{recursive:true});
  await fs.copyFile(tempPdf,destination);
  await fs.copyFile(tempCoverBase+'.jpg',cover);
  await fs.writeFile(modulePath,newModule);
  await fs.writeFile(catalog,updated);
  console.log(JSON.stringify({status:'validated and prepared',slug:item.slug,pages,bytes:bytes.length,sha256,cover},null,2));
} finally {
  await fs.rm(temp,{recursive:true,force:true});
}
