import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chapterCollectionSources} from '../src/lib/chapter-collection-sources.mjs';
test('reviewed collection notes have unique exact paragraph matches across seven chapters',()=>{
 const passages=fs.readdirSync('src/content/passages').map(f=>JSON.parse(fs.readFileSync('src/content/passages/'+f)));
 const articles=fs.readdirSync('src/content/articles').map(f=>JSON.parse(fs.readFileSync('src/content/articles/'+f)));
 assert.equal(chapterCollectionSources.length,10);
 assert.equal(new Set(chapterCollectionSources.map(s=>s.articleSlug)).size,7);
 assert.equal(new Set(chapterCollectionSources.map(s=>s.id)).size,10);
 for(const source of chapterCollectionSources){
  const passage=passages.find(p=>(p.blocks||[]).some(b=>b.id===source.afterParagraphId));
  assert.ok(passage,source.id);
  assert.equal(articles.find(a=>a.id===passage.articleId).slug,source.articleSlug);
  assert.ok(source.links.every(link=>link.url.startsWith('https://')));
  assert.ok(source.limitations.length>50);
 }
 const hector=chapterCollectionSources.find(s=>s.id==='hector-map-provenance');
 assert.match(hector.text,/later copy/);assert.match(hector.text,/approximately four miles/);
 assert.match(chapterCollectionSources.find(s=>s.id==='nzlri-online-lineage').limitations,/not be presented as original/);
});
