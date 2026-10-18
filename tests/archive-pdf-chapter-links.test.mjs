import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {magazinePdfPublications} from '../src/lib/magazine-pdf-publications-20261018.mjs';
import {publicationReadingOrder} from '../src/lib/publication-reading-order.mjs';
const placement={
 'doc-conservation-science-newsletter-28-29-1998':'chapter-26-p003',
 'auckland-liquefaction-mapping-2021':'chapter-23-p017',
 'auckland-watercourse-methodology-2016':'chapter-34-p012',
 'nz-geospatial-industry-profile-survey-2023':'chapter-29-p011',
 'auckland-water-quality-data-explorer-2025':'chapter-35-p013'
};
test('five newly archived GIS PDFs are intact, indexed, and linked to relevant chapters',()=>{
 for(const [slug,passage] of Object.entries(placement)){
  const p=magazinePdfPublications.find(x=>x.slug===slug);
  assert.ok(p,slug+' must have an archive record');
  assert.ok(Number(p.year)<=2025);
  const data=fs.readFileSync('public/assets/publications/pdfs/'+p.fileName);
  assert.equal(data.subarray(0,5).toString(),'%PDF-');
  assert.equal(crypto.createHash('sha256').update(data).digest('hex'),p.sha256);
  const cover=fs.readFileSync('public/assets/publications/thumbnails/'+slug+'.jpg');
  assert.equal(cover.subarray(0,3).toString('hex'),'ffd8ff');
  const url='/publications/pdf/'+slug+'/';
  assert.ok(publicationReadingOrder.some(x=>x.url===url));
  const chapter=JSON.parse(fs.readFileSync('src/content/passages/'+passage+'.json','utf8'));
  assert.ok(chapter.blocks.some(block=>block.id==='archive-pdf-'+slug && block.sources?.some(source=>source.url===url)),slug+' must have a chapter citation');
 }
});
