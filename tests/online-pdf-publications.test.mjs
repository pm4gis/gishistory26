import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {onlinePdfPublications} from '../src/lib/online-pdf-publications.mjs';
import {mirroredPdfSlugs} from '../src/lib/geodetic-pdfs-mirrored.mjs';

const pdfDirectory='public/assets/publications/pdfs';
const thumbnailDirectory='public/assets/publications/thumbnails';

test('hosted PDF records have local files, thumbnails, source details and reuse terms',()=>{
 assert.equal(onlinePdfPublications.length,67);
 const hostedRecords=onlinePdfPublications.filter(p=>p.hostedLocally);
 const sourceLinkedRecords=onlinePdfPublications.filter(p=>!p.hostedLocally);
 assert.equal(hostedRecords.length,40+mirroredPdfSlugs.length);
 assert.equal(sourceLinkedRecords.length,27-mirroredPdfSlugs.length);
 assert.equal(new Set(onlinePdfPublications.map(p=>p.slug)).size,onlinePdfPublications.length);
 assert.equal(new Set(onlinePdfPublications.map(p=>p.fileName)).size,onlinePdfPublications.length);
 assert.equal(new Set(onlinePdfPublications.map(p=>p.pdfPath)).size,onlinePdfPublications.length);
 assert.equal(new Set(onlinePdfPublications.map(p=>p.thumbnailPath)).size,onlinePdfPublications.length);

 for(const p of onlinePdfPublications){
  assert.ok(Number.isInteger(Number(p.year))&&Number(p.year)<=2025,`${p.title} must be dated 2025 or earlier`);
  assert.ok(p.date&&p.title&&p.creator&&p.summary,p.slug);
  assert.ok(p.sourceName,p.slug+' source name');
  assert.ok(p.sourceUrl||p.provenance,p.slug+' source record or contributor provenance');
  assert.ok(p.license&&p.attribution,p.slug+' reuse terms and attribution');
  assert.ok(p.thumbnailPath===`/assets/publications/thumbnails/${p.slug}.${p.generatedCover?'svg':'jpg'}`,p.slug+' thumbnail path');

  if(p.hostedLocally){
   assert.ok(p.pdfPath===`/assets/publications/pdfs/${p.fileName}`,p.slug+' local PDF path');
   const pdfPath=path.join(pdfDirectory,p.fileName);
   assert.ok(fs.statSync(pdfPath).size<25*1024*1024,p.slug+' must fit the static host asset limit');
   const pdfFd=fs.openSync(pdfPath,'r');
   const header=Buffer.alloc(5);
   fs.readSync(pdfFd,header,0,5,0);
   fs.closeSync(pdfFd);
   assert.equal(header.toString(),'%PDF-',p.slug+' PDF signature');
  }else{
   assert.ok(p.externalPdfUrl?.startsWith('https://'),p.slug+' must link to the publisher or repository copy');
   assert.equal(p.pdfPath,p.externalPdfUrl,p.slug+' source copy path');
   assert.ok(!fs.existsSync(path.join(pdfDirectory,p.fileName)),p.slug+' restricted source copy must not be mirrored');
  }

  if(p.generatedCover){
   assert.ok(p.is20261018Addition,'Only this release uses generated reference covers');
   assert.ok(p.thumbnailPath.endsWith('.svg'),'Generated reference covers use SVG');
  }else{
   const thumbnailPath=path.join(thumbnailDirectory,`${p.slug}.jpg`);
   const thumbnail=fs.readFileSync(thumbnailPath);
   assert.ok(thumbnail.length>1000,p.slug+' thumbnail size');
   assert.deepEqual([...thumbnail.subarray(0,3)],[0xff,0xd8,0xff],p.slug+' JPEG signature');
  }
 }

 const diskPdfs=fs.readdirSync(pdfDirectory).filter(file=>file.endsWith('.pdf')).sort();
 const listedPdfs=hostedRecords.map(p=>p.fileName).sort();
 assert.deepEqual(diskPdfs,listedPdfs,'Every PDF stored in the collection must have a publication record');
 const diskThumbnails=fs.readdirSync(thumbnailDirectory).filter(file=>file.endsWith('.jpg')).sort();
 const listedThumbnails=onlinePdfPublications.filter(p=>!p.generatedCover).map(p=>`${p.slug}.jpg`).sort();
 assert.deepEqual(diskThumbnails,listedThumbnails,'Every PDF must have one thumbnail, with no orphan thumbnails');
});

test('the additional Internet publications respect the 2025 publication cutoff',()=>{
 const additions=onlinePdfPublications.filter(p=>p.isNewAddition);
 assert.equal(additions.length,33);
 assert.ok(additions.length>=25&&additions.length<=50);
 assert.ok(additions.every(p=>Number(p.year)<=2025));
 assert.ok(onlinePdfPublications.filter(p=>!p.hostedLocally).every(p=>p.license&&p.attribution&&p.sourceUrl));
 assert.ok(onlinePdfPublications.some(p=>p.slug==='christchurch-lidar-report-2025'));
 assert.ok(onlinePdfPublications.some(p=>p.slug==='marlborough-pgf-lidar-2022'));
 const page=fs.readFileSync('src/pages/publications/index.astro','utf8');
 assert.ok(!page.includes('The linked PDFs remain with their publishers and repositories; check the source record for access and reuse terms. This selection contains material published by 31 December 2025'));
 assert.ok(page.includes('Research and reference PDFs'));
 assert.ok(page.includes('Read PDF'));
});


test('the October 2026 additional geodetic PDFs are historically dated, traceable and browsable',()=>{
 const entries=onlinePdfPublications.filter(p=>p.is20261018Addition);
 assert.equal(entries.length,22);
 assert.ok(entries.every(p=>Number(p.year)<=2025 && p.sourceUrl && (p.hostedLocally ? mirroredPdfSlugs.includes(p.slug) : p.pdfPath===p.sourceUrl)));
 assert.ok(mirroredPdfSlugs.every(slug=>entries.some(p=>p.slug===slug)));
 assert.ok(entries.some(p=>p.year==='1973'));
 assert.ok(entries.some(p=>p.themeIds.includes('maori-gis')));
 const endpoint=fs.readFileSync('src/pages/assets/publications/thumbnails/[slug].svg.ts','utf8');
 assert.ok(endpoint.includes('getStaticPaths'));
 assert.ok(endpoint.includes('geodeticPdfPublications'));
 const reader=fs.readFileSync('src/pages/publications/pdf/[slug].astro','utf8');
 assert.ok(reader.includes('<PublicationReader'));
 const readerComponent=fs.readFileSync('src/components/PublicationReader.astro','utf8');
 assert.ok(readerComponent.includes('Previous PDF')&&readerComponent.includes('Next PDF'));
 assert.ok(readerComponent.includes('publication-reader-frame'));
 const page=fs.readFileSync('src/pages/publications/index.astro','utf8');
 assert.ok(page.includes('/publications/pdf/'));
 assert.ok(!page.includes('Download hosted PDF'));
});
