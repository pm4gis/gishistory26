// Acquire independently checkable NZ GIS primary source originals, then add only confirmed PDFs to the existing site catalogue.
import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {magazinePdfPublications} from '../src/lib/magazine-pdf-publications-20261018.mjs';
const candidates=[
  {
    "slug": "pyrocart-cass-basin-map-1996",
    "fileName": "pyrocart-cass-basin-map-1996.pdf",
    "title": "PYROCART fire-spread simulation map, Cass Basin",
    "creator": "George L. W. Perry",
    "year": "1996",
    "date": "1996",
    "kind": "Historical NZ GIS original research publication",
    "topic": "Original computer-generated ARC/INFO spatial fire simulation map for the Cass Basin.",
    "summary": "Original computer-generated ARC/INFO spatial fire simulation map for the Cass Basin.",
    "sourceName": "University of Canterbury",
    "sourceUrl": "https://ir.canterbury.ac.nz/bitstreams/68858560-1117-41b2-9caa-5de240787e34/download",
    "license": "Original research publication; source attribution retained.",
    "attribution": "George L. W. Perry (1996), PYROCART fire-spread simulation map, Cass Basin. University of Canterbury.",
    "themeIds": [
      "profession",
      "open-practice"
    ],
    "keywords": [
      "GIS",
      "New Zealand",
      "1996"
    ],
    "checkTerms": [
      "fire"
    ]
  },
  {
    "slug": "otago-gis-soil-reasoning-1996",
    "fileName": "otago-gis-soil-reasoning-1996.pdf",
    "title": "Incorporating a New Computational Reasoning Approach to Spatial Modelling",
    "creator": "Alec Holt",
    "year": "1996",
    "date": "1996",
    "kind": "Historical NZ GIS original research publication",
    "topic": "GIS and case-based reasoning for soil classification using Manaaki Whenua research.",
    "summary": "GIS and case-based reasoning for soil classification using Manaaki Whenua research.",
    "sourceName": "University of Otago",
    "sourceUrl": "https://isgb.otago.ac.nz/infosci/nigel.stanger/Discussion_Papers/raw/a23799f12c18ce1f432453814e2b36ed79122857/Papers/1996/96-25/dp1996-25c.pdf",
    "license": "Original research publication; source attribution retained.",
    "attribution": "Alec Holt (1996), Incorporating a New Computational Reasoning Approach to Spatial Modelling. University of Otago.",
    "themeIds": [
      "profession",
      "open-practice"
    ],
    "keywords": [
      "GIS",
      "New Zealand",
      "1996"
    ],
    "checkTerms": [
      "spatial"
    ]
  },
  {
    "slug": "otago-gis-expert-systems-1996",
    "fileName": "otago-gis-expert-systems-1996.pdf",
    "title": "GIS, Expert Systems and Interoperability",
    "creator": "Linda Lilburne, George Benwell and Roz Buick",
    "year": "1996",
    "date": "1996",
    "kind": "Historical NZ GIS original research publication",
    "topic": "Spatial Expert Shell combining GIS, expert systems and client/server design.",
    "summary": "Spatial Expert Shell combining GIS, expert systems and client/server design.",
    "sourceName": "University of Otago",
    "sourceUrl": "https://isgb.otago.ac.nz/infosci/nigel.stanger/Discussion_Papers/raw/a23799f12c18ce1f432453814e2b36ed79122857/Papers/1996/96-25/dp1996-25d.pdf",
    "license": "Original research publication; source attribution retained.",
    "attribution": "Linda Lilburne, George Benwell and Roz Buick (1996), GIS, Expert Systems and Interoperability. University of Otago.",
    "themeIds": [
      "profession",
      "open-practice"
    ],
    "keywords": [
      "GIS",
      "New Zealand",
      "1996"
    ],
    "checkTerms": [
      "gis"
    ]
  },
  {
    "slug": "otago-environmental-spatial-process-1996",
    "fileName": "otago-environmental-spatial-process-1996.pdf",
    "title": "Environmental Decisions with Spatial Process Modelling",
    "creator": "Samuel Mann",
    "year": "1996",
    "date": "1996",
    "kind": "Historical NZ GIS original research publication",
    "topic": "GIS, Idrisi and Visual Basic spatial process models for New Zealand environmental decisions.",
    "summary": "GIS, Idrisi and Visual Basic spatial process models for New Zealand environmental decisions.",
    "sourceName": "University of Otago",
    "sourceUrl": "https://isgb.otago.ac.nz/infosci/nigel.stanger/Discussion_Papers/raw/master/Papers/1996/96-25/dp1996-25e.pdf",
    "license": "Original research publication; source attribution retained.",
    "attribution": "Samuel Mann (1996), Environmental Decisions with Spatial Process Modelling. University of Otago.",
    "themeIds": [
      "profession",
      "open-practice"
    ],
    "keywords": [
      "GIS",
      "New Zealand",
      "1996"
    ],
    "checkTerms": [
      "spatial"
    ]
  },
  {
    "slug": "otago-gis-maturity-nz-councils-1996",
    "fileName": "otago-gis-maturity-nz-councils-1996.pdf",
    "title": "GIS Maturity and Integration",
    "creator": "Andrew J. Marr and George L. Benwell",
    "year": "1996",
    "date": "1996",
    "kind": "Historical NZ GIS original research publication",
    "topic": "Original research surveying GIS adoption in New Zealand local authorities between 1992 and 1995.",
    "summary": "Original research surveying GIS adoption in New Zealand local authorities between 1992 and 1995.",
    "sourceName": "University of Otago",
    "sourceUrl": "https://isgb.otago.ac.nz/infosci/nigel.stanger/Discussion_Papers/raw/7298a9eb6fc3167538973ebc435dec7fd3bdac0b/Papers/1996/96-25/dp1996-25f.pdf",
    "license": "Original research publication; source attribution retained.",
    "attribution": "Andrew J. Marr and George L. Benwell (1996), GIS Maturity and Integration. University of Otago.",
    "themeIds": [
      "profession",
      "open-practice"
    ],
    "keywords": [
      "GIS",
      "New Zealand",
      "1996"
    ],
    "checkTerms": [
      "gis"
    ]
  },
  {
    "slug": "otago-albatross-gis-1996",
    "fileName": "otago-albatross-gis-1996.pdf",
    "title": "Wildlife Population Analysis with GIS: Conservation Management of Royal Albatross",
    "creator": "Bruce McLennan, Martin Purvis and Christopher Robertson",
    "year": "1996",
    "date": "1996",
    "kind": "Historical NZ GIS original research publication",
    "topic": "GIS spatial analysis of royal albatross population management at Taiaroa Head.",
    "summary": "GIS spatial analysis of royal albatross population management at Taiaroa Head.",
    "sourceName": "University of Otago",
    "sourceUrl": "https://isgb.otago.ac.nz/infosci/nigel.stanger/Discussion_Papers/raw/f1daa34989fbf63d10bbe4f252b1e17686a6b24c/Papers/1996/96-25/dp1996-25g.pdf",
    "license": "Original research publication; source attribution retained.",
    "attribution": "Bruce McLennan, Martin Purvis and Christopher Robertson (1996), Wildlife Population Analysis with GIS: Conservation Management of Royal Albatross. University of Otago.",
    "themeIds": [
      "profession",
      "open-practice"
    ],
    "keywords": [
      "GIS",
      "New Zealand",
      "1996"
    ],
    "checkTerms": [
      "albatross"
    ]
  },
  {
    "slug": "nzlri-dem-slope-1997",
    "fileName": "nzlri-dem-slope-1997.pdf",
    "title": "An Evaluation of Digital Elevation Models for Upgrading New Zealand Land Resource Inventory Slope Data",
    "creator": "James R. F. Barringer and Linda Lilburne",
    "year": "1997",
    "date": "1997",
    "kind": "Historical NZ GIS original research publication",
    "topic": "Contemporary NZLRI GIS analysis comparing DEM-derived slope estimates with GPS and field observations.",
    "summary": "Contemporary NZLRI GIS analysis comparing DEM-derived slope estimates with GPS and field observations.",
    "sourceName": "GeoComputation 1997",
    "sourceUrl": "https://www.geog.leeds.ac.uk/groups/geocomp/1997/papers/barringer.pdf",
    "license": "Original research publication; source attribution retained.",
    "attribution": "James R. F. Barringer and Linda Lilburne (1997), An Evaluation of Digital Elevation Models for Upgrading New Zealand Land Resource Inventory Slope Data. GeoComputation 1997.",
    "themeIds": [
      "profession",
      "open-practice"
    ],
    "keywords": [
      "GIS",
      "New Zealand",
      "1997"
    ],
    "checkTerms": [
      "slope"
    ]
  },
  {
    "slug": "epiman-tb-spatial-gis-1997",
    "fileName": "epiman-tb-spatial-gis-1997.pdf",
    "title": "EpiMAN-TB: A Decision Support System Using Spatial Information for the Management of Tuberculosis in Cattle and Deer in New Zealand",
    "creator": "J. S. McKenzie, R. S. Morris, C. J. Tutty and D. U. Pfeiffer",
    "year": "1997",
    "date": "1997",
    "kind": "Historical NZ GIS original research publication",
    "topic": "Original GIS-based decision-support system for NZ livestock disease control with AgriBase farm geography.",
    "summary": "Original GIS-based decision-support system for NZ livestock disease control with AgriBase farm geography.",
    "sourceName": "GeoComputation 1997",
    "sourceUrl": "https://www.geog.leeds.ac.uk/groups/geocomp/1997/papers/mckenzie.pdf",
    "license": "Original research publication; source attribution retained.",
    "attribution": "J. S. McKenzie, R. S. Morris, C. J. Tutty and D. U. Pfeiffer (1997), EpiMAN-TB: A Decision Support System Using Spatial Information for the Management of Tuberculosis in Cattle and Deer in New Zealand. GeoComputation 1997.",
    "themeIds": [
      "profession",
      "open-practice"
    ],
    "keywords": [
      "GIS",
      "New Zealand",
      "1997"
    ],
    "checkTerms": [
      "spatial"
    ]
  },
  {
    "slug": "otago-interoperable-gis-1997",
    "fileName": "otago-interoperable-gis-1997.pdf",
    "title": "Interoperable GIS and Spatial Process Modelling",
    "creator": "Andrew Marr, Richard Pascoe and George Benwell",
    "year": "1997",
    "date": "1997",
    "kind": "Historical NZ GIS original research publication",
    "topic": "Otago SIRC research on interoperability, OpenGIS, FME and spatial process modelling.",
    "summary": "Otago SIRC research on interoperability, OpenGIS, FME and spatial process modelling.",
    "sourceName": "GeoComputation 1997",
    "sourceUrl": "https://www.geog.leeds.ac.uk/groups/geocomp/1997/papers/marr.pdf",
    "license": "Original research publication; source attribution retained.",
    "attribution": "Andrew Marr, Richard Pascoe and George Benwell (1997), Interoperable GIS and Spatial Process Modelling. GeoComputation 1997.",
    "themeIds": [
      "profession",
      "open-practice"
    ],
    "keywords": [
      "GIS",
      "New Zealand",
      "1997"
    ],
    "checkTerms": [
      "gis"
    ]
  }
];
const pdfDir='public/assets/publications/pdfs', covers='public/assets/publications/thumbnails';
await fs.mkdir(pdfDir,{recursive:true});await fs.mkdir(covers,{recursive:true});await fs.mkdir('docs/verification',{recursive:true});
const published=[...magazinePdfPublications], results=[];
for (const p of candidates){
 if(published.some(x=>x.slug===p.slug)){results.push({slug:p.slug,status:'previously archived'});continue;}
 const dest=pdfDir+'/'+p.fileName, jpg=covers+'/'+p.slug+'.jpg';
 try{
  let buf;
  try {
   const response=await fetch(p.sourceUrl,{headers:{'User-Agent':'Mozilla/5.0 (compatible; NZGISHistoryArchive/1.0)','Accept':'application/pdf,*/*'},signal:AbortSignal.timeout(22000)});
   if(!response.ok)throw Error('HTTP '+response.status);
   buf=Buffer.from(await response.arrayBuffer());
  } catch(fetchError) {
   const curl=spawnSync('curl',['--fail',...(new URL(p.sourceUrl).hostname==='www.geog.leeds.ac.uk'?['--insecure']:[]),'--location','--silent','--show-error','--retry','2','--max-time','35','--http1.1','-A','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36',p.sourceUrl],{timeout:50000,maxBuffer:26*1024*1024});
   if(curl.status!==0)throw Error('Fetch and curl unsuccessful: '+String(fetchError)+'; '+curl.stderr.toString().slice(0,200));
   buf=curl.stdout;
  }
  if(buf.length<2000||buf.length>=24*1024*1024||buf.subarray(0,5).toString()!=='%PDF-')throw Error('Invalid PDF signature or unacceptable size');
  await fs.writeFile(dest,buf);
  const info=spawnSync('pdfinfo',[dest],{encoding:'utf8',timeout:20000});
  if(info.status!==0)throw Error('pdfinfo failed');
  const pages=Number((info.stdout.match(/^Pages:\s*(\d+)/m)||[])[1]);
  if(!Number.isInteger(pages)||pages<1)throw Error('Invalid page count');
  const extracted=spawnSync('pdftotext',['-f','1','-l',String(Math.min(pages,50)),dest,'-'],{encoding:'utf8',timeout:25000,maxBuffer:12000000});
  if(extracted.status!==0)throw Error('pdftotext failed');
  const t=extracted.stdout.toLowerCase();
  if(!p.checkTerms.some(s=>t.includes(s.toLowerCase())))throw Error('GIS/content evidence not found');
  const convert=spawnSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','960','-jpeg','-jpegopt','quality=82',dest,covers+'/'+p.slug],{encoding:'utf8',timeout:30000});
  if(convert.status!==0)throw Error('Cover generation failed');
  const cover=await fs.readFile(jpg);if(cover.subarray(0,3).toString('hex')!=='ffd8ff')throw Error('Cover not JPEG');
  const sha256=createHash('sha256').update(buf).digest('hex');
  published.push({...p,checkTerms:undefined,pages,bytes:buf.length,sha256,hostedLocally:true,generatedCover:false});
  results.push({slug:p.slug,status:'archived',pages,bytes:buf.length,sha256,sourceUrl:p.sourceUrl});
 }catch(error){await fs.rm(dest,{force:true});await fs.rm(jpg,{force:true});results.push({slug:p.slug,status:'unavailable',reason:String(error),sourceUrl:p.sourceUrl});}
}
await fs.writeFile('src/lib/magazine-pdf-publications-20261018.mjs','// Validated original NZ GIS publication PDFs, hosted locally.\nexport const magazinePdfPublications = '+JSON.stringify(published,null,2)+';\n');
await fs.writeFile('docs/verification/early-nz-gis-originals-20261026.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2)+'\n');
console.log(JSON.stringify(results,null,2));
