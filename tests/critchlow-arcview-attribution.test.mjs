import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>JSON.parse(readFileSync(path,'utf8'));
const chapter=read('src/content/articles/government-goes-spatial.json');
const passage=read('src/content/passages/chapter-24-p002.json');
const researchers=['src/content/records/suzi-kerr.json','src/content/records/jason-timmins.json'].map(read);

test('Treasury chapter distinguishes Critchlow census data from Esri software distribution',()=>{
 assert.equal(chapter.id,'article:chapter-24');
 assert.equal(passage.id,'passage:chapter-24-c1d6a6cda1');
 assert.equal(passage.slug,'treasury-maps-the-economy-c1d6a6cda1');
 assert.ok(passage.recordIds.includes('entity:critchlow'));
 const prose=passage.blocks.map(b=>b.text).join(' ');
 assert.match(prose,/Critchlow Associates supplied Census96 data/);
 assert.match(prose,/paper says Critchlow Associates supplied both Census96 data and ArcView software/);
 assert.match(prose,/does not establish Critchlow as an ArcView reseller/);
 assert.match(prose,/Eagle Technology as Esri's New Zealand distributor/);
 assert.doesNotMatch(prose,/Treasury received both software and prepared Census96 information from Critchlow/);
 for(const block of passage.blocks)assert.equal(block.text,block.markdown);
});

test('Both researcher biographies retain the qualified source attribution',()=>{
 for(const researcher of researchers){
  const prose=researcher.story.join(' ');
  assert.match(prose,/Critchlow Associates supplied Census96 data/);
  assert.match(prose,/paper also refers to ArcView software/);
  assert.match(prose,/does not establish that Critchlow was an ArcView distributor/);
  assert.doesNotMatch(prose,/Critchlow Associates supplied Census96 data and ArcView software/);
  assert.ok(researcher.sources.some(s=>s.url==='/stories/government-goes-spatial/'));
 }
});

test('Chapter documentation distinguishes a historical quotation from reseller evidence',()=>{
 const source=chapter.sourceNotes.find(n=>n.id==='ch24-note-01')?.text||'';
 assert.match(source,/Treasury Working Paper 00\/11/);
 assert.match(source,/twp00-11\.pdf/);
 assert.match(source,/statsnz\.contentdm\.oclc\.org/);
 assert.match(source,/eagle\.co\.nz\/our-history/);
 assert.match(source,/not an independent finding that Critchlow distributed ArcView/);
});
