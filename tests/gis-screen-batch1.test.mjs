import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const manifest=JSON.parse(fs.readFileSync('docs/media/gis-software-screens-batch1-20261023.json','utf8'));
const articles=fs.readdirSync('src/content/articles').filter(x=>x.endsWith('.json')).map(x=>JSON.parse(fs.readFileSync('src/content/articles/'+x,'utf8')));
const passages=fs.readdirSync('src/content/passages').filter(x=>x.endsWith('.json')).map(x=>JSON.parse(fs.readFileSync('src/content/passages/'+x,'utf8')));
const images=new Set(fs.readdirSync('src/content/images').filter(x=>x.endsWith('.json')).map(x=>x.slice(0,-5)));

test('new GIS screens are publisher-grounded computer-era interfaces, not paper maps',()=>{
 assert.equal(manifest.items.length,7);
 assert.equal(new Set(manifest.items.map(i=>i.slug)).size,7);
 assert.equal(new Set(manifest.items.map(i=>i.sourceOriginalUrl)).size,7);
 for(const i of manifest.items){
  assert.match(i.slug,/^[a-z0-9-]+$/);
  assert.match(i.sourceOriginalUrl,/^https:\/\//);
  assert.match(i.sourceUrl,/^https:\/\//);
  assert.ok(['gis-screen','web-gis'].includes(i.kind));
  assert.ok(i.credit&&i.caption&&i.altText&&i.sourceEvidence&&i.dateDisplay);
  assert.doesNotMatch(i.dateDisplay,/20(?:26|27|28|29)/);
  assert.doesNotMatch(i.title,/1798|1840|1860|antique paper map/i);
  const article=articles.find(a=>a.slug===i.articleSlug&&a.status==='published');
  assert.ok(article,i.slug+' references a missing published chapter');
  assert.equal(article.readingOrder,i.chapterNumber);
  const passage=passages.find(p=>p.articleId===article.id&&(p.blocks||[]).some(b=>b.id===i.afterParagraphId&&b.type==='paragraph'));
  assert.ok(passage,i.slug+' has no valid historical paragraph association');
 }
});

test('acquired images match the original review catalogue and image metadata contracts',()=>{
 for(const i of manifest.items){
  if(!images.has(i.slug))continue; // Source acquisition workflow may not have finished on initial branch push.
  const record=JSON.parse(fs.readFileSync('src/content/images/'+i.slug+'.json','utf8'));
  assert.equal(record.id,'image:'+i.slug);
  assert.equal(record.gisScreenBatch,manifest.batch);
  assert.equal(record.sourceUrl,i.sourceUrl);
  assert.equal(record.sourceOriginalUrl,i.sourceOriginalUrl);
  assert.equal(record.afterParagraphId,i.afterParagraphId);
  assert.equal(record.articleSlug,i.articleSlug);
  assert.ok(record.originalSha256&&record.webSha256&&record.thumbnailSha256);
  assert.ok(record.originalAssetPath.startsWith('/assets/historical/original/'));
  assert.ok(record.assetPath.startsWith('/assets/historical/web/'));
  assert.ok(record.thumbnailPath.startsWith('/assets/historical/card/'));
 }
});
