import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {magazinePdfPublications} from '../src/lib/magazine-pdf-publications-20261018.mjs';
import {docScienceNewsletterCandidates,docScienceNewsletterChapters} from '../src/lib/doc-science-newsletter-candidates-20261018.mjs';
import {docRareBitsCandidates,docRareBitsChapters} from '../src/lib/doc-rare-bits-candidates-20261018.mjs';
import {regionalGisChapterPublications} from '../src/lib/regional-gis-chapter-publications.mjs';
import {publicationReadingOrder} from '../src/lib/publication-reading-order.mjs';

const prior='doc-conservation-science-newsletter-28-29-1998';
const periodicals=magazinePdfPublications.filter(p=>(p.slug.startsWith('doc-conservation-science-newsletter-')&&p.slug!==prior)||p.slug.startsWith('doc-rare-bits-'));
const sourceCandidates=[...docScienceNewsletterCandidates,...docRareBitsCandidates];

test('between 15 and 30 verified original GIS magazine PDFs have genuine PDFs, covers and onsite reader links',()=>{
 assert.ok(periodicals.length>=15&&periodicals.length<=30,'Expected retained first tranche and source-backed second tranche');
 const slugs=new Set();
 for(const p of periodicals){
  assert.ok(!slugs.has(p.slug),'Duplicate periodical '+p.slug);
  slugs.add(p.slug);
  assert.ok(Number(p.year)>=1993&&Number(p.year)<=2005);
  const source=sourceCandidates.find(c=>c.slug===p.slug);
  assert.ok(source,'Issue absent from source index: '+p.slug);
  for(const k of ['title','year','date','sourceUrl'])assert.equal(p[k],source[k],p.slug+' '+k);
  const bytes=fs.readFileSync('public/assets/publications/pdfs/'+p.fileName);
  assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),p.sha256);
  assert.equal(bytes.length,p.bytes);
  const cover=fs.readFileSync('public/assets/publications/thumbnails/'+p.slug+'.jpg');
  assert.equal(cover.subarray(0,3).toString('hex'),'ffd8ff');
  const url='/publications/pdf/'+p.slug+'/';
  assert.ok(publicationReadingOrder.some(item=>item.url===url),'Missing onsite reader '+p.slug);
  const chapters=p.slug.startsWith('doc-rare-bits-')?docRareBitsChapters:docScienceNewsletterChapters;
  assert.ok(chapters.some(ch=>regionalGisChapterPublications(ch).some(x=>x.url===url)),'Missing chapter association '+p.slug);
 }
});

test('all original 1993-2005 periodical GIS evidence is retained without duplicate or invented snippets',()=>{
 const audit=JSON.parse(fs.readFileSync('docs/verification/doc-science-newsletter-gis-evidence-20261018.json','utf8'));
 assert.equal(audit.maxTotalPeriodicals,30,'Periodical cap applies across both releases');
 assert.ok(audit.archivedCount<=audit.maxTotalPeriodicals,'Combined archive exceeds its issue cap');
 assert.equal(audit.archivedCount,periodicals.length,'Archive audit must equal original magazine count');
 assert.equal(audit.evidence.length,periodicals.length,'Exactly one source-text excerpt for each original');
 assert.equal(new Set(audit.evidence.map(x=>x.slug)).size,periodicals.length);
 for(const hit of audit.evidence){
  const p=periodicals.find(p=>p.slug===hit.slug);
  assert.ok(p,'Evidence refers to an unhosted original: '+hit.slug);
  assert.equal(hit.sha256,p.sha256);
  assert.equal(hit.pages,p.pages);
  assert.equal(hit.sourceUrl,p.sourceUrl);
  assert.ok(hit.term&&hit.context&&hit.hitCount>=1,'GIS evidence missing for '+hit.slug);
  assert.ok(hit.context.toLowerCase().includes(hit.term.toLowerCase()),'Evidence excerpt omits its matched source term for '+hit.slug);
 }
 const old=JSON.parse(fs.readFileSync('docs/verification/doc-science-newsletter-first-pass-evidence-20261018.json','utf8'));
 assert.equal(old.evidence.length,8);
 for(const hit of old.evidence)assert.ok(audit.evidence.some(x=>x.slug===hit.slug),'Lost original first-pass source evidence '+hit.slug);
});

test('periodical selector does not link absent or nonhistorical issues',()=>{
 const ids=new Set(magazinePdfPublications.map(p=>p.slug));
 for(const c of sourceCandidates){
  assert.ok(Number(c.year)<=2025);
  const url='/publications/pdf/'+c.slug+'/';
  const linked=[...docScienceNewsletterChapters,...docRareBitsChapters].some(ch=>regionalGisChapterPublications(ch).some(x=>x.url===url));
  assert.equal(linked,ids.has(c.slug),'Incorrect reader link for '+c.slug);
 }
});
