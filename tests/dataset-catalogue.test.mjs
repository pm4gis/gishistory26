import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {datasetCardImageMap,datasetCardSelections} from '../src/lib/dataset-card-media.mjs';
const collect=name=>readdirSync('src/content/'+name)
 .filter(file=>file.endsWith('.json'))
 .map(file=>JSON.parse(readFileSync('src/content/'+name+'/'+file,'utf8')));
const datasets=collect('records').filter(r=>r.kind==='Dataset');
const images=collect('images');
const relationships=collect('relationships');
const layout=readFileSync('src/layouts/Layout.astro','utf8');
const catalogue=readFileSync('src/pages/datasets/index.astro','utf8');
const homeImageMap=readFileSync('src/lib/home-chapter-thumbnails.mjs','utf8');

test('popular nationwide datasets are individually sourced and not duplicates',()=>{
 const added=['nz-primary-parcels','nz-property-titles','nz-property-boundaries',
  'nz-building-outlines','nz-building-outlines-all-sources','nz-8m-dem-geographx-2012',
  'lucas-land-use-map','nz-addresses-2025','niwa-river-environment-classification',
  'gns-digital-qmap','geographx-natural-colour-basemaps'];
 assert.equal(new Set(datasets.map(x=>x.slug)).size,datasets.length);
 for(const slug of added){
  const d=datasets.find(x=>x.slug===slug);
  assert.ok(d,'missing new nationwide dataset '+slug);
  assert.equal(d.id,'dataset:'+slug);
  assert.equal(d.url,'/datasets/'+slug+'/');
  assert.ok(d.description?.length>55,'missing description '+slug);
  assert.ok(d.story?.length>=2,'missing history '+slug);
  assert.ok(d.sources?.every(x=>/^https:\/\//.test(x.url)),'missing authoritative source '+slug);
  assert.ok(d.paragraphSources?.length===d.story.length,'missing paragraph evidence '+slug);
  assert.ok(relationships.some(r=>r.a===d.id||r.b===d.id),'orphan dataset '+slug);
 }
 for(const slug of ['nzlri','national-luc-2021','lcdb'])
  assert.equal(datasets.filter(x=>x.slug===slug).length,1,'existing authoritative dataset duplicated');
 assert.match(datasets.find(x=>x.slug==='lucas-land-use-map').description,/separate from NZLRI/);
 assert.match(datasets.find(x=>x.slug==='nz-8m-dem-geographx-2012').story.join(' '),/not for detailed terrain analysis/);
});
test('image-led cards use archived, attributed media and never mislabel illustrations',()=>{
 const imagesBySlug=new Map(images.map(x=>[x.slug,x]));
 const maps=datasetCardImageMap(datasets,images);
 assert.ok(Object.values(maps).filter(Boolean).length>=20,'insufficient sourced dataset thumbnails');
 for(const [slug,selection] of Object.entries(datasetCardSelections)){
  assert.ok(datasets.some(x=>x.slug===slug),'media mapping has no dataset '+slug);
  const img=imagesBySlug.get(selection.imageSlug);
  assert.ok(img,'image record missing '+selection.imageSlug);
  assert.ok(img.sourceUrl&&img.credit&&img.licence&&img.altText);
  assert.ok(existsSync('public'+(img.thumbnailPath||img.assetPath)),'local media missing '+selection.imageSlug);
  assert.ok(selection.note.length>35,'source context missing '+slug);
 }
 assert.match(catalogue,/datasetCardImageMap\(records,d.images\)/);
 assert.match(catalogue,/image\.sourceNote/);
 assert.match(catalogue,/Image source and credit/);
 assert.match(catalogue,/dataset-shortcuts/);
 assert.match(catalogue,/loading="lazy"/);
});
test('both menu disclosures are populated from source collections',()=>{
 assert.match(layout,/getCollection\('records'\)/);
 assert.match(layout,/entry\.data\.kind==='Dataset'/);
 assert.equal((layout.match(/menuDatasets\.map\(/g)||[]).length,2);
 assert.equal((layout.match(/class="nav-dropdown nav-dropdown--datasets"/g)||[]).length,2);
 assert.match(layout,/for\(const menu of navMenus\)/);
 assert.match(layout,/navMenus\.forEach\(other/);
 assert.match(homeImageMap,/forestry-finds-gis/);
});
