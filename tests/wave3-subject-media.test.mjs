import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {subjectMedia,pickRecordImage} from '../src/lib/subject-media.mjs';
import {timelineMedia} from '../src/lib/timeline-media.mjs';
const root=path.resolve('.');
const expected=new Map([
 ['arc-pitt-street-2007','a3dbc8a6b88ad4145e5d0ba6cbfef0cb1ca3048fc53b454d838313af240dc374'],
 ['upper-hutt-civic-centre-2005','f4ab4d3cbd2a0a3418cf43b038092e41f57dc820721aead5200435bf6d4fe7a8'],
 ['lower-hutt-civic-centre-2021','4200c4cb27333c6d3d001993a78b274ff444baadb3a5e2cdc3c9396ff445e44d'],
 ['christchurch-civic-offices-2019','042cb30ddf8711d74c92a7634fbc6dd8765ba0650617d6c18592b051d29d3725'],
 ['christchurch-orion-quake-2011','26db6a731961ca7dc521709bbb0426a196449204ccfd80923bc275c4f05b24af']
]);
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const picture=id=>JSON.parse(fs.readFileSync(path.join(root,'src/content/images',id+'.json'),'utf8'));
test('all published wave3 derivatives are real local WebP and match SHA256',()=>{
 for(const [id,originalSha] of expected){
  const m=picture(id);
  assert.equal(m.originalSha256,originalSha,id+' original provenance');
  assert.equal(m.originalAssetPath,undefined,id+' original not claimed to be public; it is held in research ZIP');
  for(const [type,filename,hash] of [['web',m.assetPath,m.webSha256],['card',m.thumbnailPath,m.thumbnailSha256]]){
   assert.ok(filename.startsWith('/assets/historical/'+type+'/'),filename);
   const b=fs.readFileSync(path.join(root,'public',filename.slice(1)));
   assert.equal(b.subarray(0,4).toString(),'RIFF',id+' '+type);
   assert.equal(b.subarray(8,12).toString(),'WEBP',id+' '+type);
   assert.equal(digest(b),hash,id+' '+type+' checksum');
   assert.ok(b.length>10000&&b.length<700000,id+' '+type+' size');
  }
  for(const key of ['credit','sourceUrl','licence','licenceUrl','licenceEvidenceUrl','dateDisplay','altText','caption','context'])assert.ok(m[key],id+' '+key);
 }
});
test('no duplicated Cyclone Gabrielle source binary or historical record',()=>{
 assert.equal(fs.existsSync(path.join(root,'src/content/images/gabrielle-napier-sentinel-2023.json')),false);
 assert.equal(fs.existsSync(path.join(root,'public/assets/historical/web/gabrielle-napier-sentinel-2023.webp')),false);
 const existing=picture('gabrielle-sentinel-flooding-napier-2023');
 assert.equal(existing.originalSha256,'026936cc5c2c050fe69d61fee4426d2b26c772f437e61fb8e57cfba77e2433b8');
 assert.equal(timelineMedia['2023-nzta-gabrielle'].slug,existing.slug);
});
test('earthquake event presents new contemporary image and preserves old documentary map',()=>{
 const t=timelineMedia['2011-christchurch-earthquake'];
 assert.equal(t.slug,'christchurch-orion-quake-2011');
 assert.ok(t.additionalSlugs.includes('christchurch-quake-shaking-2011'));
 assert.ok(t.relation.includes('22 February 2011'));
});
test('council images are assigned precisely and no Person can acquire them',()=>{
 const assignments={
 'auckland-regional-council':'arc-pitt-street-2007',
 'upper-hutt-city-council':'upper-hutt-civic-centre-2005',
 'hutt-city-council':'lower-hutt-civic-centre-2021',
 'christchurch-city-council':'christchurch-civic-offices-2019'
 };
 const images=[...expected.keys()].map(picture);
 for(const [slug,imageId] of Object.entries(assignments)){
  assert.equal(subjectMedia.records[slug].slug,imageId);
  assert.equal(pickRecordImage({kind:'Council',slug},images).image.slug,imageId);
  assert.equal(pickRecordImage({kind:'Person',slug},images),null);
 }
 assert.equal(subjectMedia.records['auckland-council'].slug,'auckland-osm-colour-2018');
 assert.equal(subjectMedia.records['auckland-city-council'],undefined);
});
