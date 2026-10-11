import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {placeChapterImages} from '../src/lib/chapter-media.mjs';

const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const all=d=>fs.readdirSync(d).filter(f=>f.endsWith('.json')).map(f=>read(d+'/'+f));
const m=read('docs/media/four-chapter-primary-figures-20261011.json');
const articles=all('src/content/articles'),passages=all('src/content/passages'),images=all('src/content/images');

test('2025 cutoff, provenance, unaltered figure content, and unresolved early web map',()=>{
 assert.equal(m.subjectDateCutoff,'2025-12-31');
 assert.deepEqual(m.items.map(x=>x.chapter),[7,43,44]);
 assert.equal(m.held.length,1);
 assert.equal(m.held[0].chapter,30);
 for(const x of m.items){
  assert.ok(x.licence==='CC BY 4.0'&&x.doi.startsWith('10.3390/'));
  assert.ok(x.credit&&x.caption&&x.sourceOriginalUrl&&x.sourceFigure);
  assert.ok(x.dateDisplay.includes('2022')||x.dateDisplay.includes('2025'));
  assert.ok(!x.context.includes('2026'));
  const article=articles.find(a=>a.slug===x.articleSlug);
  assert.ok(article,'Unknown chapter '+x.chapter);
  assert.ok(passages.some(p=>p.articleId===article.id&&p.blocks?.some(b=>b.id===x.afterParagraphId)),x.afterParagraphId);
  const image=images.find(a=>a.slug===x.slug);
  assert.ok(image,'Acquisition incomplete '+x.slug);
  assert.equal(image.sourceDoi,x.doi);
  assert.equal(image.afterParagraphId,x.afterParagraphId);
  assert.equal(image.sourceOriginalUrl.startsWith('https://'),true);
  for(const f of [image.assetPath,image.thumbnailPath,image.originalAssetPath])assert.ok(fs.existsSync('public'+f),'Missing '+f);
  const layout=placeChapterImages(article,passages.filter(p=>p.articleId===article.id),images);
  assert.ok(Object.values(layout).flat().some(i=>i.slug===x.slug&&i.inlineAfterBlockId===x.afterParagraphId));
 }
});
test('unresolved 1996-2003 source is not misrepresented',()=>{
 const image=images.find(x=>x.slug==='nz-libraries-wikidata-osm-2019');
 assert.equal(image.dateDisplay,'19 February 2019');
 assert.ok(m.held[0].reason.includes('1996'));
});
