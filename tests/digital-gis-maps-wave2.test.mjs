import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {placeChapterImages} from '../src/lib/chapter-media.mjs';

const data=JSON.parse(fs.readFileSync('docs/media/gis-digital-screens-maps-wave2-20261023.json','utf8'));
const contents=dir=>fs.readdirSync('src/content/'+dir).filter(x=>x.endsWith('.json')).map(x=>JSON.parse(fs.readFileSync('src/content/'+dir+'/'+x,'utf8')));
const articles=contents('articles'),passages=contents('passages'),images=contents('images');
test('twenty-five candidate maps and GIS screens have distinct documented originals',()=>{
 assert.equal(data.items.length,25);
 const unique=new Set(data.items.map(i=>i.sourceOriginalUrl));
 assert.equal(unique.size,data.items.length);
 for(const item of data.items){
  assert.match(item.sourceOriginalUrl,/^https:\/\//);
  assert.ok(item.sourceUrl&&item.credit&&item.altText&&item.caption&&item.sourceEvidence);
  assert.ok(!/2026|2027|2028|2029/.test(item.dateDisplay),item.slug+' has a post-cutoff subject date');
  assert.ok(['gis-screen','gis-map'].includes(item.kind));
  const article=articles.find(a=>a.slug===item.articleSlug&&a.readingOrder===item.chapterNumber);
  assert.ok(article,item.slug+' chapter is missing');
  assert.ok(passages.some(p=>p.articleId===article.id&&p.blocks?.some(b=>b.type==='paragraph'&&b.id===item.afterParagraphId)),item.slug+' has no checked paragraph');
 }
});
test('acquired original screenshots are source-matched and shown once, not on chapter navigation cards',()=>{
 for(const item of data.items){
  const image=images.find(i=>i.slug===item.slug);
  if(!image)continue;
  assert.equal(image.gisScreenBatch,data.batch);
  assert.equal(image.sourceOriginalUrl,item.sourceOriginalUrl);
  assert.equal(image.articleSlug,item.articleSlug);
  assert.equal(image.afterParagraphId,item.afterParagraphId);
  assert.ok(fs.existsSync('public'+image.assetPath));
  assert.ok(fs.existsSync('public'+image.originalAssetPath));
  const article=articles.find(a=>a.slug===item.articleSlug);
  const relevant=passages.filter(p=>p.articleId===article.id);
  assert.equal(Object.values(placeChapterImages(article,relevant,images)).flat().filter(i=>i.slug===item.slug).length,1,item.slug+' not exactly once in chapter');
 }
});
