import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {openLicensedGisPeriodicals,openLicensedPeriodicalChapterLinks} from '../src/lib/open-licensed-gis-periodicals-20261019.mjs';
import {magazinePdfPublications} from '../src/lib/magazine-pdf-publications-20261018.mjs';
import {publicationReadingOrder} from '../src/lib/publication-reading-order.mjs';
import {regionalGisChapterPublications} from '../src/lib/regional-gis-chapter-publications.mjs';

test('original OSGeo journal candidates have dated licences, unique URLs and chapter links',()=>{
 assert.equal(new Set(openLicensedGisPeriodicals.map(p=>p.slug)).size,openLicensedGisPeriodicals.length);
 assert.equal(new Set(openLicensedGisPeriodicals.map(p=>p.sourceUrl)).size,openLicensedGisPeriodicals.length);
 for(const p of openLicensedGisPeriodicals){
  assert.ok(Number(p.year)<=2025);
  assert.match(p.license,/(?:BY-ND|Attribution-NoDerivatives)/);
  assert.ok(openLicensedPeriodicalChapterLinks[p.slug]?.length);
 }
});

test('only acquired unmodified licensed journal originals have onsite PDF readers',()=>{
 for(const candidate of openLicensedGisPeriodicals){
  const p=magazinePdfPublications.find(x=>x.slug===candidate.slug);
  const url='/publications/pdf/'+candidate.slug+'/';
  if(!p){
   assert.ok(!publicationReadingOrder.some(x=>x.url===url),'Unarchived journal must not appear in PDF library');
   continue;
  }
  assert.equal(p.hostedLocally,true);
  assert.equal(p.year,candidate.year);
  assert.equal(p.sourceUrl,candidate.sourceUrl);
  const bytes=fs.readFileSync('public/assets/publications/pdfs/'+p.fileName);
  assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),p.sha256);
  const cover=fs.readFileSync('public/assets/publications/thumbnails/'+p.slug+'.jpg');
  assert.equal(cover.subarray(0,3).toString('hex'),'ffd8ff');
  assert.ok(publicationReadingOrder.some(x=>x.url===url));
  assert.ok(openLicensedPeriodicalChapterLinks[p.slug].some(slug=>regionalGisChapterPublications(slug).some(x=>x.url===url)));
 }
});
