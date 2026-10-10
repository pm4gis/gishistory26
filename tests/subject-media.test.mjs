import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {subjectMedia,pickThemeImage,pickThemeImages,pickRecordImage} from '../src/lib/subject-media.mjs';
import {timelineMedia} from '../src/lib/timeline-media.mjs';

const dir=path.resolve('src/content/images');
const images=readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(readFileSync(path.join(dir,f),'utf8')));
const themes=['cadastre','imagery','local-government','open-practice','profession','technology-stack','women-in-gis'];

test('each published subject image has a stable source and rights record',()=>{
 const values=[...Object.values(subjectMedia.themes),...Object.values(subjectMedia.records)];
 assert.ok(values.length>=15,'expected several themes and non-person entries');
 for(const entry of values){
  assert.ok(entry.relation.length>40);
  const image=images.find(i=>i.slug===entry.slug);
  assert.ok(image,'image record is missing: '+entry.slug);
  assert.ok(image.thumbnailPath&&image.assetPath,'responsive images missing: '+entry.slug);
  assert.ok(image.sourceUrl.startsWith('https://'),'source missing: '+entry.slug);
  assert.ok(image.licenceUrl.startsWith('https://'),'licence missing: '+entry.slug);
  assert.ok(image.credit&&image.altText,'credit/alt missing: '+entry.slug);
 }
});
test('all seven themes have either a contextual image or an explicit visual gap',()=>{
 for(const slug of themes){
  const picture=pickThemeImage(slug,images);
  assert.ok(picture||slug==='women-in-gis','theme needs a reliable image: '+slug);
 }
});
test('new story images are surfaced under their curated themes and agency',()=>{
 const cadastre=pickThemeImages('cadastre',images);
 const imagery=pickThemeImages('imagery',images);
 const localGovernment=pickThemeImages('local-government',images);
 assert.ok(cadastre.some(image=>image.slug==='silverpeak-survey-district-1956'));
 assert.ok(imagery.some(image=>image.slug==='wiri-north-quarry-1982'));
 assert.ok(localGovernment.some(image=>image.slug==='north-island-counties-districts-1981'));
 const department=pickRecordImage({kind:'Agency',slug:'department-of-lands-and-survey'},images);
 assert.equal(department?.image.slug,'north-island-counties-districts-1981');
 assert.match(department?.relation||'',/administrative map, not a GIS screen/);
});
test('no new profile imagery is generated for any person',()=>{
 for(const slug of ['auckland-council','gns-science','aerial-surveys','person-profile']){
  assert.equal(pickRecordImage({kind:'Person',slug},images),null);
 }
 assert.equal(pickRecordImage({kind:'Story',slug:'auckland-council'},images),null);
 assert.equal(pickRecordImage({kind:'Council',slug:'other-council'},images),null,'no unrelated default photos');
 assert.ok(pickRecordImage({kind:'Council',slug:'auckland-council'},images));
});
test('existing illustrated timeline events keep their source-backed image associations',()=>{
 const covered=Object.entries(timelineMedia).filter(([,entry])=>images.some(i=>i.slug===entry.slug));
 assert.ok(covered.length>=20,'timeline illustrations unexpectedly missing');
 for(const [id,entry] of covered){
  assert.ok(entry.relation.length>20,'event '+id+' needs an explicit relationship');
 }
});
