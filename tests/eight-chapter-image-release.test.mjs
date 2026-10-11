import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {placeChapterImages} from '../src/lib/chapter-media.mjs';
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const entries=dir=>fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>read(dir+'/'+f));
const articles=entries('src/content/articles'), passages=entries('src/content/passages'), images=entries('src/content/images');
const target=['mapping-land-as-data','universities-build-a-field','an-industry-and-community-form','becoming-a-gis-professional','the-first-web-maps','enterprise-gis','automating-the-gis-work','gis-at-the-end-of-2025'];
test('eight-chapter programme is limited to verified published historic media',()=>{
  for(const slug of target)assert.ok(articles.some(a=>a.slug===slug),'Unknown chapter '+slug);
  for(const image of images){
    if(!image.articleSlug||!target.includes(image.articleSlug))continue;
    assert.ok(image.assetPath&&image.credit&&image.sourceUrl&&image.licence,'Missing image evidence '+image.slug);
  }
});
test('contextual pictures without passage evidence do not interrupt the chapter',()=>{
 const formerlyReused={
  'mapping-land-as-data':'nz-geology-lange-2012',
  'universities-build-a-field':'auckland-university-clocktower-2004',
  'an-industry-and-community-form':'intergraph-clix-workstation',
  'becoming-a-gis-professional':'tripp-station-theodolite-surveyors',
  'enterprise-gis':'linz-wfs-attribute-service-2023',
  'automating-the-gis-work':'linz-arcmap-property-relationships-2016',
  'gis-at-the-end-of-2025':'ecoregions-qgis-2025'
 };
 for(const [slug,imageSlug] of Object.entries(formerlyReused)){
   const story=articles.find(a=>a.slug===slug);
   const sections=passages.filter(p=>p.articleId===story.id).sort((a,b)=>a.order-b.order);
   const layout=placeChapterImages(story,sections,images);
   const original=images.find(i=>i.slug===imageSlug);
   assert.ok(original,'Source file retained in archive: '+imageSlug);
   assert.ok(fs.existsSync('public'+original.assetPath));
   assert.ok(!Object.values(layout).flat().some(i=>i.slug===imageSlug),
     'A broad contextual reuse must not be placed as evidence for '+slug);
 }
});
test('source candidates are held until downloaded, checked and dated by 2025',()=>{
  const queue=read('docs/media/eight-chapter-acquisition-20261011.json');
  assert.equal(queue.subjectCutoff,'2025-12-31');
  assert.deepEqual(queue.items.map(x=>x.chapter),[30]);
  assert.equal(queue.held.length,1);
  assert.equal(queue.held[0].chapter,43);
  assert.match(queue.held[0].reason,/reuse rights|licence/i);
  for(const c of queue.items){
    assert.ok(c.afterParagraphId&&c.sourceUrl&&c.licenceEvidenceUrl);
    const story=articles.find(a=>a.slug===c.articleSlug);
    assert.ok(story&&passages.some(p=>p.articleId===story.id&&p.blocks?.some(b=>b.id===c.afterParagraphId)),c.slug);
  }
});
