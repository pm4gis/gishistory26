import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=path=>readFileSync(path,'utf8');
const browse=src('src/components/Browse.svelte');
const record=src('src/pages/[...path].astro');
const timeline=src('src/components/Timeline.svelte');
const chapter=src('src/pages/read/index.astro');
const search=src('src/pages/search/index.astro');
test('visitors see people or organisation context before advanced filters',()=>{
 assert.match(browse,/browseSection==='people'\?'People'/);
 assert.match(browse,/browseSection==='organisations'\?'Organisations'/);
 assert.match(browse,/class="browse-simple-tools"/);
 assert.match(browse,/<details class="browse-advanced">/);
 assert.match(browse,/contextKinds/);
 assert.match(browse,/r.kind!=='Person'/);
});
test('record navigation only offers chapter return on an explicit verified origin',()=>{
 assert.match(record,/class="record-breadcrumb"/);
 assert.match(record,/new URLSearchParams\(location.search\).get\('from'\)/);
 assert.doesNotMatch(record,/\|\|p\?\.url/);
 assert.match(record,/a.hidden=false/);
});
test('timeline opens selected full decade and makes the event account discoverable',()=>{
 assert.match(timeline,/function decade\(y:number\)\{activeDecade=y;/);
 assert.match(timeline,/to=String\(Math.min\(y\+9,max\)\)/);
 assert.match(timeline,/Full \{activeDecade\}s/);
 assert.match(timeline,/bind:this=\{eventSummaryElement\}/);
 assert.match(timeline,/class="timeline-hit-area"/);
 assert.match(timeline,/grid-template-columns:1fr;overflow:visible/);
});
test('chapter reader has direct range jumps and sitewide search is clearly labelled',()=>{
 assert.match(chapter,/chapter-period-jumps/);
 for(const first of [1,9,17,25,33,41])assert.match(chapter,new RegExp('\\b'+first+'\\b'));
 assert.match(search,/Search the entire history/);
});
