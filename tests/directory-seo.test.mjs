import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {directoryLetter,directoryGroups} from '../src/lib/directory-index.mjs';
import {isListedRecord} from '../src/lib/record-listing.mjs';

const records=readdirSync('src/content/records')
  .filter(p=>p.endsWith('.json'))
  .map(p=>JSON.parse(readFileSync('src/content/records/'+p,'utf8')));

test('Alphabetical index handles Māori macrons and numerically named entries',()=>{
 assert.equal(directoryLetter('Ōpōtiki'), 'O');
 assert.equal(directoryLetter('Ngā Poutama'), 'N');
 assert.equal(directoryLetter('3D mapping'), '0-9');
});
test('The directory covers precisely those records intended for public listing',()=>{
 const groups=directoryGroups(records);
 const listed=records.filter(isListedRecord);
 const flattened=groups.flatMap(g=>g.entries);
 assert.equal(flattened.length,listed.length);
 assert.ok(groups.length>=20);
 assert.deepEqual(new Set(flattened.map(e=>e.url)),new Set(listed.map(r=>r.url)));
 assert.ok(!flattened.some(e=>records.find(r=>r.url===e.url)?.listingStatus==='reference-only'));
});
test('Reference-only entries are deliberately excluded from the public sitemap and noindexed in record pages',()=>{
 const sitemap=readFileSync('src/pages/sitemap.xml.ts','utf8');
 const detail=readFileSync('src/pages/[...path].astro','utf8');
 assert.match(sitemap,/d\.records\.filter\(isListedRecord\)/);
 assert.match(detail,/noindex=\{r\.listingStatus==='reference-only'\}/);
 assert.ok(records.some(r=>r.listingStatus==='reference-only'));
});
test('Directory has static HTML links and an entry from browse',()=>{
 const index=readFileSync('src/pages/directory/index.astro','utf8');
 const letter=readFileSync('src/pages/directory/[letter].astro','utf8');
 const browse=readFileSync('src/pages/browse/index.astro','utf8');
 assert.match(browse,/href="\/directory\/"/);
 assert.match(index,/href=\{'\/directory\/'\+group\.slug\+'\/'\}/);
 assert.match(letter,/href=\{entry\.url\}/);
});
