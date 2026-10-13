import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {rawDataset} from '../src/lib/raw.mjs';
import {isListedRecord,orphanPersonIds} from '../src/lib/record-listing.mjs';
import {placeChapterImages} from '../src/lib/chapter-media.mjs';
const d=rawDataset();
test('directory-only references retain routes while leaving the researched catalogue',()=>{
 const refs=d.records.filter(r=>r.listingStatus==='reference-only');
 assert.equal(refs.length,32);
 for(const r of refs){assert.equal(isListedRecord(r),false);assert.ok(r.url.startsWith('/entities/'));assert.ok(r.sources.length);}
 assert.equal(d.records.find(r=>r.id==='entity:ministry-for-primary-industries').kind,'Agency');
 assert.equal(d.records.find(r=>r.id==='entity:grow-gis-nz').kind,'Channel');
 assert.ok(isListedRecord(d.records.find(r=>r.id==='entity:waikato-district-council')));
});
test('no person is an orphan, including all 45 source-backed additions',()=>{
 assert.deepEqual(orphanPersonIds(d),[]);
 const additions=JSON.parse(fs.readFileSync('docs/research/people-expansion-20261013.json'));
 assert.equal(additions.length,45);
 for(const a of additions){
  const r=d.records.find(r=>r.id===a.id);
  assert.ok(r?.sources.length,a.id);
  assert.ok(d.relationships.some(e=>(e.a===a.id||e.b===a.id)&&e.sources?.length&&e.basis?.length),a.id);
 }
});
test('a broken endpoint or self-loop cannot disguise an orphan',()=>{
 const records=[{id:'person:a',kind:'Person'},{id:'entity:b',kind:'Organisation'}];
 assert.deepEqual(orphanPersonIds({records,relationships:[{a:'person:a',b:'missing'}]}),['person:a']);
 assert.deepEqual(orphanPersonIds({records,relationships:[{a:'person:a',b:'person:a'}]}),['person:a']);
 assert.deepEqual(orphanPersonIds({records,relationships:[{a:'person:a',b:'entity:b'}]}),[]);
 assert.deepEqual(orphanPersonIds({records,events:[{id:'event:a',recordIds:['person:a']}]}),[]);
});
test('Munro Morad resolves to the one Munir Morad profile and Waikato connection',()=>{
 const matching=d.records.filter(r=>[r.name,...r.aliases||[]].includes('Munro Morad'));
 assert.equal(matching.length,1);
 assert.equal(matching[0].id,'person:munir-morad');
 assert.ok(d.relationships.some(e=>e.a===matching[0].id&&e.b==='entity:university-of-waikato'&&e.sources.length));
});
test('DOC images belong beside exact Great Walks and field-capture paragraphs',()=>{
 for(const [slug,imageSlug] of [['google-changes-the-audience','doc-google-trekker-heaphy-2015'],['google-changes-the-audience','doc-google-trekker-routeburn-team-2015'],['mapping-leaves-the-office','doc-google-trekker-milford-mist-2015']]){
  const a=d.articles.find(a=>a.slug===slug);
  const p=d.passages.filter(p=>p.articleId===a.id);
  const placed=Object.values(placeChapterImages(a,p,d.images)).flat();
  assert.ok(placed.some(i=>i.slug===imageSlug),imageSlug);
 }
});
