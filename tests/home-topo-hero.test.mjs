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

test('approved homepage is static and provides direct chapter and timeline access',()=>{
 const page=readFileSync('src/pages/index.astro','utf8');
 assert.match(page,/class="landing-primary" href="\/read\/"/);
 assert.match(page,/href="\/timeline\/"/);
 assert.doesNotMatch(page,/setInterval|data-story-play|data-hero-motion|href="\/history\/"/);
 assert.match(page,/object-fit:cover/);
 assert.match(page,/@media\(max-width:650px\)/);
});
