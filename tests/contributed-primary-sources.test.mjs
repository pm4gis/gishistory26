import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {contributedPrimarySources} from '../src/lib/contributed-primary-sources.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
test('eight original publications retain checksums, chronology, source identities and linked narrative',()=>{
 assert.equal(contributedPrimarySources.length,8);
 assert.equal(new Set(contributedPrimarySources.map(p=>p.slug)).size,8);
 for(const p of contributedPrimarySources){
  const original=fs.readFileSync('public'+p.assetPath);
  assert.equal(original.length,p.bytes,p.slug);
  assert.equal(crypto.createHash('sha256').update(original).digest('hex'),p.sha256,p.slug);
  for(const asset of [p.thumbnailPath,p.coverPath,p.viewerPath])assert.ok(fs.statSync('public'+asset).size>0);
  assert.ok(p.rights&&p.provenance&&p.creator&&p.date);
  assert.ok(Number(p.startDate.slice(0,4))<=2025);
  const ev=read('src/content/events/source-'+p.slug+'.json');
  assert.equal(ev.url,'/sources/documents/'+p.slug+'/');
  assert.equal(ev.startDate,p.startDate);
  assert.ok(ev.passageIds.includes(p.passageId));
  const passage=read('src/content/passages/publication-'+p.slug+'.json');
  assert.ok(passage.blocks.filter(b=>b.type==='paragraph').length>=2);
  assert.ok(passage.blocks.every(b=>b.sources.some(s=>s.url===p.publicationUrl)));
  const chapter=read('src/content/articles/'+p.article+'.json');
  assert.ok(chapter.sourceNotes.some(n=>n.id==='source-'+p.slug));
 }
});
test('publication navigation, accessible viewer and preserved source routes are present',()=>{
 const layout=fs.readFileSync('src/layouts/Layout.astro','utf8');
 assert.equal((layout.match(/href="\/publications\/"/g)||[]).length,2);
 const detail=fs.readFileSync('src/pages/publications/[slug].astro','utf8');
 assert.ok(detail.includes('type="application/pdf"'));
 assert.ok(detail.includes('publication-reader-nav'));
 assert.ok(detail.includes('aria-label="Browse PDF publications"'));
 assert.ok(detail.includes('navigation.previous'));
 assert.ok(detail.includes('navigation.next'));
 assert.ok(!/<a[^>]+download(?:=|>)/i.test(detail));
 assert.ok(detail.includes('datePublished:item.startDate'));
 const old=fs.readFileSync('src/pages/sources/documents/[slug].astro','utf8');
 assert.ok(old.includes('item.publicationUrl'));
});
