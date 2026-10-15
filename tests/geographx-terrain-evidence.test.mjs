import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {datasetCardSelections} from '../src/lib/dataset-card-media.mjs';
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const base='src/content/';
test('original open-licensed LINZ terrain artwork matches the archived Git source exactly',()=>{
 const set=[
  ['linz-2013-terrain-natural-colour-preview','41aa94ac467595e657233eec07ae1dec517b9f0a','png'],
  ['linz-2013-north-island-natural-colour-bathymetry','725bf1b3c7e69a83e22eaecb98c902d8eeae1cf3','jpeg']
 ];
 const registry=readFileSync('docs/media/chapter-image-alignment-wave2-20261011.csv','utf8');
 for(const [slug,sha,ext] of set){
  const image=read(base+'images/'+slug+'.json');
  const path='public/assets/historical/original/'+slug+'.'+ext;
  assert.ok(existsSync(path),'missing original '+path);
  const bytes=readFileSync(path);
  const hash=createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
  assert.equal(hash,sha,slug+' no longer matches original LINZ bytes');
  assert.equal(image.sourceGitBlobSha,sha);
  assert.equal(image.licence,'Creative Commons Attribution 3.0 New Zealand');
  assert.equal(image.licenceUrl,'https://creativecommons.org/licenses/by/3.0/nz/');
  assert.match(image.sourceUrl,/github\.com\/linz\/linz_basemaps\/blob\/master/);
  assert.ok(registry.includes('"'+slug+'"'),slug+' missing image-use decision');
 }
});
test('Geographx 4m commercial basemap, 8m DEM and DOC 10m service remain distinct',()=>{
 const get=slug=>read(base+'records/'+slug+'.json');
 const four=get('geographx-natural-colour-basemaps');
 const eight=get('nz-8m-dem-geographx-2012');
 const doc=get('geographx-10m-terrain-imagery');
 const linz=get('linz-nz-terrain-natural-colour-2013');
 assert.match(four.name,/4 m/);
 assert.match(four.story.join(' '),/116 tiles/);
 assert.match(four.story.join(' '),/420 GB/);
 assert.match(four.story.join(' '),/Manifold/);
 assert.match(eight.story.join(' '),/not for detailed terrain analysis/);
 assert.match(doc.story.join(' '),/not automatically authorised for republication/);
 assert.match(linz.story.join(' '),/TileMill/);
 assert.match(linz.story.join(' '),/Creative Commons Attribution 3.0 New Zealand/);
 assert.equal(linz.sources[0].url,'https://github.com/linz/linz_basemaps');
 assert.equal(datasetCardSelections['geographx-natural-colour-basemaps'].imageSlug,'linz-2013-north-island-natural-colour-bathymetry');
 assert.equal(datasetCardSelections['nz-8m-dem-geographx-2012'].imageSlug,'linz-2013-terrain-natural-colour-preview');
 for(const item of [four,eight,doc,linz]){
  assert.equal(item.paragraphSources.length,item.story.length);
  assert.ok(item.sources.every(x=>x.url?.startsWith('https://')));
 }
});
test('new chapter text has 2012 source references and exact updated preservation hashes',()=>{
 const manifest=read('content/preservation-manifest.json');
 for(const [file,id] of [
  ['chapter-12-p012.json','research-geographx-maps-2012-ch12-01'],
  ['chapter-39-p003.json','research-geographx-terrain-2012-ch39-01']
 ]){
  const path=base+'passages/'+file;
  const p=read(path),b=p.blocks.find(b=>b.id===id);
  assert.ok(b,'missing Geographx paragraph in '+file);
  assert.equal(b.markdown,b.text);
  assert.ok(b.text.length>260&&b.sources.some(s=>/mcw2012_sec4_ch13/.test(s.url)));
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),manifest[path]);
 }
 assert.ok(existsSync('docs/research/geographx-terrain-evidence-20261015.md'));
});
