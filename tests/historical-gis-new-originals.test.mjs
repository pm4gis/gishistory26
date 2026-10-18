import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {historicalGisNewCandidates,historicalGisNewChapterLinks} from '../src/lib/historical-gis-new-candidates-20261018.mjs';
import {magazinePdfPublications} from '../src/lib/magazine-pdf-publications-20261018.mjs';
import {publicationReadingOrder} from '../src/lib/publication-reading-order.mjs';
import {regionalGisChapterPublications} from '../src/lib/regional-gis-chapter-publications.mjs';

test('historical PDF candidates are unique and retain the pre-2026 cutoff',()=>{
 const keys=new Set(),urls=new Set();
 for(const candidate of historicalGisNewCandidates){
  assert.ok(!keys.has(candidate.slug),'Duplicate original slug '+candidate.slug);
  assert.ok(!urls.has(candidate.sourceUrl),'Duplicate source binary '+candidate.slug);
  assert.ok(Number(candidate.year)<=2025&&Number(candidate.year)>=1900);
  assert.ok(historicalGisNewChapterLinks[candidate.slug]?.length>0,candidate.slug+' missing chapter context');
  keys.add(candidate.slug);urls.add(candidate.sourceUrl);
 }
});

test('at least fifteen additional originals are stored, accurately described and readable on site',()=>{
 const originals=magazinePdfPublications.filter(x=>historicalGisNewChapterLinks[x.slug]);
 assert.ok(originals.length>=15,'Expected 15 verified original PDFs, found '+originals.length);
 for(const original of originals){
  const expected=historicalGisNewCandidates.find(x=>x.slug===original.slug);
  assert.ok(expected,'Missing candidate '+original.slug);
  for(const k of ['title','creator','year','date','kind']){
   assert.equal(original[k],expected[k],original.slug+' mismatched '+k);
  }
  const binary=fs.readFileSync('public/assets/publications/pdfs/'+original.fileName);
  assert.equal(binary.subarray(0,5).toString(),'%PDF-');
  assert.equal(crypto.createHash('sha256').update(binary).digest('hex'),original.sha256);
  const thumb=fs.readFileSync('public/assets/publications/thumbnails/'+original.slug+'.jpg');
  assert.equal(thumb.subarray(0,3).toString('hex'),'ffd8ff');
  const reader='/publications/pdf/'+original.slug+'/';
  assert.ok(publicationReadingOrder.some(x=>x.url===reader));
  assert.ok(historicalGisNewChapterLinks[original.slug].some(chapter=>regionalGisChapterPublications(chapter).some(p=>p.url===reader)),'Missing chapter reader link '+original.slug);
 }
});

test('corrected DOC bibliographic years and parts stay accurate',()=>{
 const bySlug=Object.fromEntries(magazinePdfPublications.map(p=>[p.slug,p]));
 assert.equal(bySlug['doc-galaxiid-trout-arcgis-2012'].year,'2013');
 assert.equal(bySlug['doc-freshwater-eel-arcview-2003'].year,'2004');
 assert.match(bySlug['doc-sfc279-freshwater-2007'].title,/Mudfish.*Part 3/);
 assert.match(bySlug['doc-southland-forest-fragmentation-2006'].title,/Part 1/);
});
