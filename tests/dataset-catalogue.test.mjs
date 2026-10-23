import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {datasetCardImageMap,datasetCardSelections} from '../src/lib/dataset-card-media.mjs';
import {datasetSourceCatalogue,datasetSourceAgencies} from '../src/lib/dataset-source-catalogue.mjs';
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
  'gns-digital-qmap','geographx-natural-colour-basemaps','geographx-10m-terrain-imagery'];
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
 assert.equal(Object.values(maps).filter(Boolean).length,datasets.length,'every historical dataset needs a curated image');
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
 assert.match(catalogue,/data-dataset-source-catalogue/);
 assert.match(catalogue,/loading="lazy"/);
});
test('the public catalogue has 100 traceable records and uniform source previews',()=>{
 assert.equal(datasets.length,55,'preserve all 55 documented dataset histories');
 assert.equal(datasetSourceCatalogue.length,45,'add 45 official data-source listings');
 assert.equal(datasets.length+datasetSourceCatalogue.length,100,'derive the visible total from records');
 assert.equal(new Set(datasetSourceCatalogue.map(x=>x.id)).size,datasetSourceCatalogue.length);
 assert.equal(new Set(datasetSourceCatalogue.map(x=>x.url)).size,datasetSourceCatalogue.length);
 const byAgency=Object.fromEntries(datasetSourceAgencies.map(a=>[a.id,datasetSourceCatalogue.filter(x=>x.agency===a.id).length]));
 assert.deepEqual(byAgency,{linz:15,mfe:15,'stats-nz':7,mpi:2,mbie:2,tpk:1,niwa:3});
 const tpk=datasetSourceCatalogue.find(x=>x.id==='tpk-climate-hazards-hapori-maori');
 assert.match(tpk.imageUrl,/MediaImages-16387-A/,'TPK uses the official climate-app launch image');
 assert.match(tpk.imageSourceUrl,/new-web-app-enhances-climate-resilience/,'TPK image credit links to its official story');
 assert.match(tpk.imageAlt,/regional risk map is visible/,'TPK image is described as the specific app, not a generic climate image');
 const mpiDeepwater=datasetSourceCatalogue.find(x=>x.id==='mpi-deepwater-restrictions');
 assert.match(mpiDeepwater.imageUrl,/23535ed3d52a4096b3e3ccee0d694a26\/info\/thumbnail/,'MPI thumbnail uses the canonical source item ID');
 const mpiShellfish=datasetSourceCatalogue.find(x=>x.id==='mpi-shellfish-growing-areas');
 assert.match(mpiShellfish.imageUrl,/e781d10f912846cca6f8b8db53fbb229\/info\/thumbnail/,'MPI thumbnail uses the canonical source item ID');
 const nzffd=datasetSourceCatalogue.find(x=>x.id==='niwa-nzffd');
 assert.equal(nzffd.url,'https://nzffdms.niwa.co.nz/','NIWA links to the live NZFFD download portal');
 assert.match(nzffd.imageUrl,/Alpine%20galaxias\.jpeg/,'NIWA uses the dataset’s specific species distribution map');
 assert.match(nzffd.imageSourceUrl,/niwa-atlas-nz-freshwater-fishes\/alpine-galaxias/);
 assert.doesNotMatch(datasetSourceCatalogue.map(x=>x.id).join(' '),/niwa-fbis/,'the retired FBIS portal is retained only in the historical records');
 for(const item of datasetSourceCatalogue){
  assert.ok(/^https:\/\//.test(item.url),'not an HTTPS source link: '+item.id);
  assert.ok(/^https:\/\//.test(item.imageUrl),'not an official image: '+item.id);
  assert.ok(/^https:\/\//.test(item.imageSourceUrl),'missing image source: '+item.id);
  if(item.imageUrl.includes('tiles-cdn.koordinates.com'))
   assert.match(item.imageUrl,/thumbnail\/layer=\d+\.\d+,style=auto\//,'Koordinates thumbnail path must retain its documented separators: '+item.id);
  assert.ok(item.imageAlt?.length>35,'missing descriptive image text: '+item.id);
  assert.ok(item.imageCredit?.length>15,'missing image credit: '+item.id);
  assert.ok(item.description?.length>45,'missing dataset description: '+item.id);
  assert.ok(['Dataset','Map service','Interactive map','Data portal'].includes(item.kind),'unlabelled source type: '+item.id);
  assert.doesNotMatch(item.imageUrl,/placeholder|unsplash|lorem/i,'generic preview: '+item.id);
 }
 assert.match(catalogue,/href=\{source\.url\}/,'cards must open the agency source');
 assert.match(catalogue,/dataset-source-search/);
 assert.match(catalogue,/dataset-agency-filter/);
 assert.match(catalogue,/aria-live="polite"/);
 const styles=readFileSync('src/styles/site.css','utf8');
 assert.match(styles,/\.dataset-card-media>a\{display:block;aspect-ratio:16\/9/);
 assert.match(styles,/\.dataset-card-media img\{display:block;width:100%;height:100%;object-fit:cover/);
 assert.match(styles,/\.dataset-source-card\[hidden\].*display:none!important/);
});
test('both discovery menus link to the complete dataset catalogue',()=>{
 assert.equal((layout.match(/href="\/datasets\/"/g)||[]).length,2);
 assert.doesNotMatch(layout,/<details class="nav-dropdown"/);
 assert.match(homeImageMap,/forestry-finds-gis/);
});
