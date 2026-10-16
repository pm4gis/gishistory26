import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {contributedPrimarySources} from '../src/lib/contributed-primary-sources.mjs';

test('all eight uploaded pre-2025 primary sources have permanent source pages and timeline anchors',()=>{
 assert.equal(contributedPrimarySources.length,8);
 const slugs=new Set();
 for(const item of contributedPrimarySources){
  assert.ok(!slugs.has(item.slug),item.slug);
  slugs.add(item.slug);
  assert.ok(item.title&&item.creator&&item.date);
  assert.ok(item.pages>0&&item.bytes>0);
  assert.match(item.sha256,/^[a-f0-9]{64}$/);
  assert.ok(item.originalFilename===undefined,'Avoid inventing site-hosted original');
  assert.ok(item.findings?.length>=2,'Missing original-page findings: '+item.slug);
  assert.ok(item.findings.every(x=>x.page&&x.text));
  assert.ok(Number(item.startDate.slice(0,4))<=2024,'No post-2024 acquired historical publication');
  const event=JSON.parse(fs.readFileSync('src/content/events/source-'+item.slug+'.json','utf8'));
  assert.equal(event.url,'/sources/documents/'+item.slug+'/');
  assert.equal(event.year,Number(item.startDate.slice(0,4)));
  assert.equal(event.startDate,item.startDate);
  assert.ok(event.sources.some(x=>x.url===event.url));
  const chapter=JSON.parse(fs.readFileSync('src/content/articles/'+item.article+'.json','utf8'));
  assert.ok(chapter.sourceNotes.some(x=>x.id==='source-'+item.slug),'Missing narrative evidence note: '+item.article);
  if(item.sourceUrl)assert.ok(/^https:\/\//.test(item.sourceUrl));
  else assert.match(item.rights,/not|No|permission|licence|rights|unresolved|confirmation/i);
 }
 assert.ok(fs.existsSync('src/pages/sources/documents/index.astro'));
 assert.ok(fs.existsSync('src/pages/sources/documents/[slug].astro'));
 const sources=fs.readFileSync('src/pages/sources/collections.astro','utf8');
 assert.ok(sources.includes('/sources/documents/'));
});
test('unhosted original PDF and slide bytes must not be implied by public pages',()=>{
 const details=fs.readFileSync('src/pages/sources/documents/[slug].astro','utf8');
 assert.ok(details.includes('No verified public download URL'));
 assert.ok(details.includes('item.sourceUrl?'));
 assert.ok(!details.includes('download original PDF'));
});
