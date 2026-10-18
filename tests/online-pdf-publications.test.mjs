import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {onlinePdfPublications} from '../src/lib/online-pdf-publications.mjs';

const pdfDirectory='public/assets/publications/pdfs';
const maxAssetBytes=25*1024*1024;
const assetPath=sitePath=>path.join('public',sitePath.replace(/^\/+/,''));

test('PDF records have source details, reuse terms and valid local assets',()=>{
 assert.ok(onlinePdfPublications.length>=210,'The catalogue should contain hundreds of references');
 const hostedRecords=onlinePdfPublications.filter(p=>p.hostedLocally);
 const sourceLinkedRecords=onlinePdfPublications.filter(p=>!p.hostedLocally);
 assert.ok(hostedRecords.length>=45);
 assert.ok(sourceLinkedRecords.length>=150);
 assert.equal(new Set(onlinePdfPublications.map(p=>p.slug)).size,onlinePdfPublications.length);
 assert.equal(new Set(onlinePdfPublications.map(p=>p.fileName)).size,onlinePdfPublications.length);
 assert.equal(new Set(onlinePdfPublications.map(p=>p.pdfPath)).size,onlinePdfPublications.length);

 for(const p of onlinePdfPublications){
  assert.ok(Number.isInteger(Number(p.year))&&Number(p.year)<2025,`${p.title} must be dated before 2025`);
  assert.ok(p.date&&p.title&&p.creator&&p.summary,p.slug);
  assert.ok(p.sourceName,p.slug+' source name');
  assert.ok(p.sourceUrl||p.provenance,p.slug+' source record or contributor provenance');
  assert.ok(p.license&&p.attribution,p.slug+' reuse terms and attribution');

  const thumbnailFile=assetPath(p.thumbnailPath);
  assert.ok(fs.existsSync(thumbnailFile),p.slug+' thumbnail must exist');
  const thumbnail=fs.readFileSync(thumbnailFile);
  if(p.thumbnailPath.endsWith('.jpg')){
   assert.ok(thumbnail.length>1000,p.slug+' thumbnail size');
   assert.deepEqual([...thumbnail.subarray(0,3)],[0xff,0xd8,0xff],p.slug+' JPEG signature');
  }else{
   assert.ok(p.thumbnailPath.endsWith('.svg'),p.slug+' must use a JPEG or SVG thumbnail');
   assert.match(thumbnail.toString('utf8'),/<svg\b/,p.slug+' SVG signature');
  }

  if(p.hostedLocally){
   assert.ok(p.pdfPath===`/assets/publications/pdfs/${p.fileName}`,p.slug+' local PDF path');
   assert.ok(p.thumbnailPath===`/assets/publications/thumbnails/${p.slug}.jpg`,p.slug+' local thumbnail path');
   const localPdf=path.join(pdfDirectory,p.fileName);
   assert.ok(fs.statSync(localPdf).size<maxAssetBytes,p.slug+' must fit the static host asset limit');
   const pdfFd=fs.openSync(localPdf,'r');
   const header=Buffer.alloc(5);
   fs.readSync(pdfFd,header,0,5,0);
   fs.closeSync(pdfFd);
   assert.equal(header.toString(),'%PDF-',p.slug+' PDF signature');
  }else{
   assert.ok(p.externalPdfUrl?.startsWith('https://'),p.slug+' must link to the publisher or repository copy');
   assert.equal(p.pdfPath,p.externalPdfUrl,p.slug+' source copy path');
   assert.ok(!fs.existsSync(path.join(pdfDirectory,p.fileName)),p.slug+' restricted source copy must not be mirrored');
  }
 }

});

test('the catalogue keeps its pre-2025 cutoff and includes verified early sources',()=>{
 const additions=onlinePdfPublications.filter(p=>p.isNewAddition);
 const historic=onlinePdfPublications.filter(p=>Number(p.year)<=2009);
 assert.ok(additions.length>=200);
 assert.ok(additions.every(p=>Number(p.year)<2025));
 assert.ok(historic.length>=25,'The catalogue should include a substantial early-dated selection');
 assert.ok(onlinePdfPublications.every(p=>!Number(p.year)||Number(p.year)<2025));
 assert.ok(onlinePdfPublications.some(p=>p.slug==='landsat-investigation-programme-report-1-1976'&&p.year==='1976'));
 assert.ok(onlinePdfPublications.some(p=>p.slug==='landsat-investigation-programme-report-3-1976'&&p.date.includes('September 1976')));
 assert.ok(onlinePdfPublications.some(p=>p.slug==='landsat-snowpack-new-zealand-antarctica-1980'));
 assert.ok(onlinePdfPublications.some(p=>p.slug==='sir-b-science-investigations-plan-1984'));
 assert.ok(onlinePdfPublications.some(p=>p.slug==='doc-gis-conservation-1990'&&!p.hostedLocally));
 assert.ok(onlinePdfPublications.some(p=>p.slug==='treasury-economic-geography-spatial-statistics-2000'));
 assert.ok(onlinePdfPublications.some(p=>p.slug==='treasury-internal-mobility-gis-2001'));

 const downsampled=onlinePdfPublications.filter(p=>p.hostedCopyNote);
 assert.ok(downsampled.length>=3);
 assert.ok(downsampled.every(p=>p.hostedLocally&&p.hostedCopyNote.includes('original PDF')));

 const page=fs.readFileSync('src/pages/publications/index.astro','utf8');
 assert.ok(page.includes('Research and reference PDFs'));
 assert.ok(page.includes('publications/research/'));
 assert.ok(page.includes('View publication'));
 assert.ok(!page.includes('Download hosted PDF'));
 assert.ok(!page.includes('Open source copy'));
 assert.ok(!page.includes('download='));
});
