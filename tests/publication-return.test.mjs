import test from 'node:test';
import assert from 'node:assert/strict';
import {publicationReturnPath} from '../src/lib/publication-return.mjs';
test('return paths retain encoded catalogue filters and stable publication anchors',()=>{
 for(const filter of ['decade','theme','creator']){
  const query=new URLSearchParams({filter,value:'Māori & GIS / 1990'});
  const path='/publications/?'+query+'#publication-research-nz-map-grid-1973';
  assert.equal(publicationReturnPath(path),path);
 }
 assert.equal(publicationReturnPath('/publications/'),'/publications/');
 assert.equal(publicationReturnPath('/publications/?filter=unknown&value=x'),'/publications/');
 assert.equal(publicationReturnPath('/publications/?filter=decade&value=1990&unexpected=x'),'/publications/?filter=decade&value=1990');
});
test('return links reject external, unrelated and malformed destinations',()=>{
 for(const path of [null,'','https://example.com/publications/','//example.com/publications/','/publications/../search/','/publications/not-a-library/','/publications/#other','/publications/#publication-research-%22onclick','/publications/'+ 'x'.repeat(3000)])assert.equal(publicationReturnPath(path),null,path);
});
