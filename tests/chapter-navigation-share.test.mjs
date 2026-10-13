import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chapterNavImage,chapterNavImageMap} from '../src/lib/chapter-nav-media.mjs';

const read=path=>readFileSync(path,'utf8');
test('chapter navigation only accepts an image with reviewed placement or an embedded figure',()=>{
 const article={id:'article:chapter-1',slug:'what-the-computer-inherited'};
 const passage={id:'passage:chapter-1-test',articleId:article.id,blocks:[{id:'ch01-p-242c96db76e3',type:'paragraph',text:'Test paragraph.'}]};
 const approved={id:'image:approved-map',slug:'doc-historic-map-6c572e829a93c5f5',articleSlug:article.slug,
  assetPath:'/assets/historical/web/christchurch-black-map.webp',thumbnailPath:'/assets/historical/card/christchurch-black-map.webp',
  altText:'Historic survey map',title:'Historic survey map',headerCandidate:true};
 const unreviewed={...approved,id:'image:archive-only',slug:'doc-historic-map-unknown',headerCandidate:false};
 assert.equal(chapterNavImage(article,[passage],[unreviewed]),null,'archive-only documents must be excluded');
 assert.equal(chapterNavImage(article,[passage],[unreviewed,approved])?.slug,approved.slug);
 assert.equal(chapterNavImage({id:'article:no-image',slug:'none'},[passage],[approved]),null);
 assert.equal(chapterNavImageMap([article],[passage],[approved])[article.slug]?.slug,approved.slug);
});
test('chapter listing and previous-next reader links use images with alt text',()=>{
 const home=read('src/pages/index.astro');
 const catalogue=read('src/pages/read/index.astro');
 const reader=read('src/components/Reader.svelte');
 const stories=read('src/pages/stories/[slug].astro');
 assert.match(home,/chapterNavImageMap/);
 assert.match(home,/chapter-card-media/);
 assert.match(catalogue,/chapterNavImageMap/);
 assert.match(catalogue,/chapter-catalogue-card/);
 assert.match(reader,/chapterNavImages\[previous.slug\].altText/);
 assert.match(reader,/chapterNavImages\[next.slug\].altText/);
 assert.match(stories,/chapterNavImages=\{chapterNavImages\}/);
 assert.match(read('src/styles/site.css'),/\.chapter-image-slot img\{width:100%;height:100%;object-fit:contain/);
});
test('seven documentary timeline additions include source references and valid chapter links',()=>{
 const names=[
 '1962-aerial-photo-coverage','1962-soil-survey-method',
 '1964-luc-catchment-survey-teams','1968-soils-of-new-zealand-bulletin',
 '1974-west-coast-primary-triangulation','1975-nzms1-first-edition-complete',
 '1976-stratford-land-inventory-soil-maps'
 ];
 for(const name of names){
  const event=JSON.parse(read('src/content/events/'+name+'.json'));
  assert.equal(event.id,name);
  assert.ok(event.year>=1962&&event.year<=1976);
  assert.ok(event.sources?.length>=1,name+' lacks sources');
  assert.ok(event.url?.startsWith('/stories/'),name+' lacks story link');
  assert.ok(event.passageIds?.length,name+' lacks passage ID');
 }
});
test('social share card uses only actual local documentary maps with traceable sources',()=>{
 const layout=read('src/layouts/Layout.astro');
 const generator=read('scripts/generate-social-image.mjs');
 const check=read('scripts/check-build.mjs');
 const expected=[
  'ongaonga-linz-topo50-2020',
  'gisborne-east-coast-luc-map-1967',
  'rotoiti-bathymetry-2021',
  'retrolens-c515a148bd788efa'
 ];
 for(const id of expected){
  const record=JSON.parse(read('src/content/images/'+id+'.json'));
  assert.ok(record.sourceUrl?.startsWith('https://'),id+' missing documentary source');
  assert.ok(record.credit?.length>8,id+' missing credit');
  assert.ok(record.assetPath?.startsWith('/assets/historical/web/'),id+' missing stored map asset');
  assert.ok(generator.includes(id+'.json'),id+' not included in share card');
  assert.ok(generator.includes(record.assetPath),id+' stored asset not used');
 }
 assert.match(generator,/sharp\(source\)/);
 assert.match(generator,/fit:'contain'/);
 assert.doesNotMatch(generator,/path d="M.*map|fabricate|fake map/);
 assert.match(generator,/A history of/);
 assert.match(generator,/#111A29/);
 assert.match(layout,/property="og:image" content="https:\/\/history\.pm4gis\.nz\/assets\/social\/nzgis-verified-maps-20261013\.png"/);
 assert.match(layout,/name="twitter:card" content="summary_large_image"/);
 assert.match(layout,/property="og:image:width" content="1200"/);
 assert.match(layout,/property="og:image:height" content="630"/);
 assert.match(check,/nzgis-verified-maps-20261013\.png/);
 assert.match(read('package.json'),/node scripts\/generate-social-image\.mjs/);
});
