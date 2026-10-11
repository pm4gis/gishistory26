import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pickThemeImage,pickRecordImage,subjectMedia} from '../src/lib/subject-media.mjs';
const cwd=process.cwd();
const load=(dir,id)=>JSON.parse(fs.readFileSync(path.join(cwd,'src/content',dir,id+'.json'),'utf8'));
const theme=load('themes','maori-gis');
const fileIdMap=new Map();
for(const c of ['records','events','passages'])for(const f of fs.readdirSync(path.join(cwd,'src/content',c)).filter(f=>f.endsWith('.json'))){const x=load(c,f.slice(0,-5));fileIdMap.set(x.id,x);}
const ids=a=>new Set(a);
test('Māori GIS is a populated independent theme with cited narrative and connected sources',()=>{
 assert.equal(theme.id,'maori-gis');
 assert.ok(theme.sections.length>=5);
 assert.ok(theme.sections.every(s=>s.paragraphs.length&&s.sources?.some(x=>/^https:/.test(x.url))));
 assert.ok(theme.recordIds.length>=10);
 assert.ok(theme.eventIds.length>=10);
 assert.ok(theme.passageIds.length>=9);
 for(const [kind,values] of [['record',theme.recordIds],['event',theme.eventIds],['passage',theme.passageIds]]){
  assert.equal(ids(values).size,values.length,kind+' duplicate theme membership');
  for(const id of values)assert.ok(fileIdMap.has(id),kind+' missing '+id);
 }
 for(const stop of theme.stops){
  const item=fileIdMap.get(stop.passageId);
  assert.ok(item,'stop missing '+stop.passageId);
  assert.equal(stop.url.split('#').at(-1),item.slug,'stop uses real anchor');
 }
});
test('Māori GIS image and six institutional images are licensed locally and no person receives an image',()=>{
 const manifest=JSON.parse(fs.readFileSync('docs/media/maori-gis-media-wave4-manifest.json','utf8'));
 const imgs=manifest.items;
 assert.equal(imgs.length,8);
 for(const x of imgs){
  assert.ok(x.sourcePage.includes('commons.wikimedia.org/wiki/File:'),x.id);
  assert.ok(x.licenceUrl.startsWith('https://'),x.id);
  assert.ok(x.credit&&x.dateDisplay&&x.caption&&x.noPersonProfile);
  const record=load('images',x.id);
  assert.equal(record.slug,x.id);
  for(const [kind,uri,expected] of [['web',record.assetPath,record.webSha256],['card',record.thumbnailPath,record.thumbnailSha256]]){
   const b=fs.readFileSync(path.join('public',uri.slice(1)));
   assert.equal(b.subarray(0,4).toString(),'RIFF');
   assert.equal(b.subarray(8,12).toString(),'WEBP');
   assert.equal(crypto.createHash('sha256').update(b).digest('hex'),expected);
  }
 }
 const imageData=imgs.map(x=>load('images',x.id));
 assert.equal(pickThemeImage('maori-gis',imageData)?.image.slug,'ngai-tahu-takiwa-map-2010');
 for(const slug of ['maori-land-court','te-runanga-o-ngai-tahu-ngai-tahu-archive','niwa','university-of-otago','university-of-auckland','victoria-university-of-wellington']){
  assert.ok(pickRecordImage({kind:'Organisation',slug},imageData),slug);
  assert.equal(pickRecordImage({kind:'Person',slug},imageData),null);
 }
 assert.equal(subjectMedia.records['te-kahui-manu-hokai-maori-gis-association'],undefined,'no unrelated publicity portraits');
});
