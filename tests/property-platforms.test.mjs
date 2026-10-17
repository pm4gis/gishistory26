import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => JSON.parse(fs.readFileSync(path,'utf8'));

test('Homes.co.nz and OneRoof have sourced organisation records linked to LINZ',()=>{
 const homes=read('src/content/records/homes-co-nz.json');
 const oneroof=read('src/content/records/oneroof.json');
 const relations=fs.readdirSync('src/content/relationships').filter(name=>name.endsWith('.json'))
  .map(name=>read('src/content/relationships/'+name));
 const homesLink=relations.find(edge=>edge.id==='relationship:homes-co-nz-linz-data-service');
 const oneroofLink=relations.find(edge=>edge.id==='relationship:oneroof-linz-property-title-data');
 assert.equal(homes.kind,'Organisation');
 assert.equal(homes.website,'https://homes.co.nz/');
 assert.equal(oneroof.kind,'Organisation');
 assert.equal(oneroof.website,'https://www.oneroof.co.nz/');
 assert.ok(homes.story.join(' ').includes('local councils'));
 assert.ok(homes.story.join(' ').includes('property-boundary'));
 assert.ok(oneroof.story.join(' ').includes('title'));
 assert.ok(homesLink&&oneroofLink);
 assert.ok(homesLink.sources.some(source=>source.url==='https://data.govt.nz/catalogue-guide/showcase/homes-co-nz'));
 assert.ok(oneroofLink.sources.some(source=>source.url==='https://www.oneroof.co.nz/disclaimer'));
 assert.ok(fs.readFileSync('src/pages/[...path].astro','utf8').includes('Official website'));
});
