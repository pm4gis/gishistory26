import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {homeTopoMaps} from '../src/lib/home-topo-maps.mjs';

test('homepage hero uses documented historical imagery',()=>{
 assert.equal(homeTopoMaps.length,2);
 assert.deepEqual(homeTopoMaps.map(image=>image.id),[
  'christchurch-response-orthophoto-2011',
  'nasa-landsat4-tasman-1990'
 ]);
 assert.equal(new Set(homeTopoMaps.map(image=>image.src)).size,2);
 for(const image of homeTopoMaps){
  assert.match(image.src,/^\/assets\/historical\/web\/[a-z0-9-]+\.webp$/);
  assert.ok(image.title&&image.alt);
 }
});

test('homepage contains an unobtrusive slide loop and the curated story selection',()=>{
 const page=readFileSync('src/pages/index.astro','utf8');
 assert.match(page,/hero--topo/);
 assert.match(page,/setInterval\(advance,9000\)/);
 assert.match(page,/Math\.random\(\)\*maps\.length/);
 assert.match(page,/prefers-reduced-motion|\.topo-slide/);
 assert.match(page,/nzgis-last-highlights/);
 assert.doesNotMatch(page,/A different selection appears each time you visit/);
});

test('documentary hero stays cropped, responsive, and reduces animation when requested',()=>{
 const stylesheet=readFileSync('src/styles/site.css','utf8');
 assert.match(stylesheet,/\.hero--topo \.topo-slide\{[^}]*object-fit:cover/);
 assert.match(stylesheet,/@media\(max-width:850px\)/);
 assert.match(stylesheet,/@media\(prefers-reduced-motion:reduce\)/);
});
