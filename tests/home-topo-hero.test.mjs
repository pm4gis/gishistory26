import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {homeTopoMaps} from '../src/lib/home-topo-maps.mjs';

test('homepage hero has twenty identifiable, distinct Google Drive map originals',()=>{
 assert.equal(homeTopoMaps.length,20);
 assert.equal(new Set(homeTopoMaps.map(m=>m.driveId)).size,20);
 assert.equal(new Set(homeTopoMaps.map(m=>m.src)).size,20);
 for(const map of homeTopoMaps){
  assert.match(map.driveId,/^[A-Za-z0-9_-]+$/);
  assert.match(map.src,/^\/assets\/home-topo\/topo-\d{2}\.webp$/);
  assert.ok(/\.tif$|\.png$/i.test(map.sourceTitle));
  assert.ok(map.title&&map.alt);
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
 assert.doesNotMatch(page,/nasa-landsat4-tasman-1990/);
});

test('topographic hero stays cropped, responsive, and reduces animation when requested',()=>{
 const stylesheet=readFileSync('src/styles/site.css','utf8');
 assert.match(stylesheet,/\.hero--topo \.topo-slide\{[^}]*object-fit:cover/);
 assert.match(stylesheet,/@media\(max-width:850px\)/);
 assert.match(stylesheet,/@media\(prefers-reduced-motion:reduce\)/);
});
