import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=path=>readFileSync(path,'utf8');
const image=source('src/components/SubjectImage.astro');
const home=source('src/pages/index.astro');
const themes=source('src/pages/themes/index.astro');
const theme=source('src/pages/themes/[slug].astro');
const datasets=source('src/pages/datasets/index.astro');
const browse=source('src/components/Browse.svelte');
const browsePage=source('src/pages/browse/index.astro');
const reader=source('src/components/Reader.svelte');
const record=source('src/pages/[...path].astro');

test('catalogue images open the corresponding content',()=>{
 assert.match(image,/destination\?:string/);
 assert.match(image,/const tileUrl=destination\|\|url/);
 assert.match(image,/href=\{tileUrl\}/);
 assert.match(home,/href=\{maps.url\}/);
 assert.match(home,/href=\{computers.url\}/);
 assert.match(home,/href=\{'\/themes\/'\+t.slug\+'\/'\}/);
 assert.match(themes,/variant="card" showCaption=\{false\} destination=\{"\/themes\/"\+t.slug\+"\/"\}/);
 assert.match(theme,/variant="card" showCaption=\{false\} destination=\{r.url\}/);
 assert.match(datasets,/href=\{r.url\} aria-label=\{'Read about '\+r.name\}/);
});

test('subject and theme listings retain linked decorative fallbacks',()=>{
 for(const listing of [themes,theme]){
  assert.match(listing,/class="tile-media-link[^"]*" href=\{/);
  assert.match(listing,/<DecorativeLandscape/);
 }
 assert.doesNotMatch(datasets,/DecorativeLandscape|dataset-media-fallback|decorFor/);
 assert.match(datasets,/class="dataset-card-media"/);
 assert.match(datasets,/href=\{r\.url\} aria-label=\{'Read about '\+r\.name\}/);
 assert.match(browse,/class:decorative=\{!r.featuredImage\}/);
 assert.match(browse,/<a href=\{r.url\} aria-label=\{"Read "\+r.name\}>/);
 assert.doesNotMatch(browse,/href=\{r.featuredImage.sourceUrl\}/);
 assert.match(browsePage,/fallbackImage:decorUrl\(decorFor\(i\),"card"\)/);
});

test('within content pages original image source links remain intact',()=>{
 assert.match(record,/variant="feature"/);
 assert.match(reader,/href=\{'\/images\/'\+image\(b\).slug\+'\/'\}/);
 assert.match(image,/const url='\/images\/'/);
 assert.match(image,/href=\{url\}>Image source, credit and licence/);
});
