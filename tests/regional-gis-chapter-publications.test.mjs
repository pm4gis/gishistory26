import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {magazinePdfPublications} from '../src/lib/magazine-pdf-publications-20261018.mjs';
import {regionalGisPdfCandidates} from '../src/lib/regional-gis-pdf-candidates-20261018.mjs';
import {regionalGisChapterPublications,regionalGisChapterMap} from '../src/lib/regional-gis-chapter-publications.mjs';

test('Regional source matches are unique and at or before the 2025 historical cutoff',()=>{
 const names=new Set();
 for(const c of regionalGisPdfCandidates){
  assert.ok(!names.has(c.slug),c.slug+' repeated');names.add(c.slug);
  assert.ok(Number(c.year)<=2025);
  assert.ok(regionalGisChapterMap[c.slug]?.length>0,c.slug+' requires chapter context');
  assert.ok(c.sourceUrl?.startsWith('https://')&&c.fileName.endsWith('.pdf'));
 }
 const original=readFileSync('src/components/Reader.svelte','utf8');
 assert.ok(original.includes('regionalGisChapterPublications(article.slug)'));
 assert.ok(original.includes('<a href={publication.url}>'));
});
test('Only archived original PDFs are linked from chapters',()=>{
 for(const c of regionalGisPdfCandidates){
  for(const articleSlug of regionalGisChapterMap[c.slug]||[]){
   const matches=regionalGisChapterPublications(articleSlug).filter(p=>p.slug===c.slug);
   const archived=magazinePdfPublications.some(p=>p.slug===c.slug&&p.hostedLocally);
   assert.equal(matches.length,archived?1:0,'Incorrect reference for '+c.slug);
   for(const item of matches)assert.equal(item.url,'/publications/pdf/'+c.slug+'/');
  }
 }
});
