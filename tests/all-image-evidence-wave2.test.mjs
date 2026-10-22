import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {placeChapterImages,reviewedImagePassages} from '../src/lib/chapter-media.mjs';
const all=dir=>fs.readdirSync(dir).filter(f=>f.endsWith('.json'))
 .map(f=>JSON.parse(fs.readFileSync(dir+'/'+f,'utf8')));
const images=all('src/content/images'),articles=all('src/content/articles'),passages=all('src/content/passages');
const added=['retrolens-3ec520daec5ae4a0','christchurch-response-orthophoto-2011',
 'geonet-kaikoura-felt-2016','gabrielle-sentinel-flooding-napier-2023',
 'landsat-christchurch-2001','nz-census-density-2023'];
test('all documentary images have an explicit chapter publication decision',()=>{
 assert.ok(images.length>=181);
 const file=fs.readFileSync('docs/media/chapter-image-alignment-wave2-20261011.csv','utf8').trim().split(/\r?\n/);
 const held=file.slice(1).filter(row=>/"(?:ladeda|nzlri)-review-held"/.test(row));
 const registered=file.slice(1).filter(row=>!held.includes(row));
 // This CSV is the signed-off 2026-10-11 baseline. Later GIS screenshots
 // have a separately reviewed source + exact passage manifest, not a retroactive
 // change to the original 201 image decisions.
 const gisBatch=JSON.parse(fs.readFileSync('docs/media/gis-software-screens-batch1-20261023.json','utf8'));
 const newReviewed=new Map(gisBatch.items.map(item=>[item.slug,item]));
 const earlier=images.filter(image=>!image.gisScreenBatch);
 const newlyAcquired=images.filter(image=>image.gisScreenBatch);
 assert.equal(registered.length,earlier.length,'one original decision per previously registered image required');
 const registry=new Set(registered.map(row=>row.match(/^"([^"]+)"/)?.[1]));
 assert.equal(registry.size,earlier.length,'all original records have one unique decision');
 for(const image of earlier)assert.ok(registry.has(image.slug),'Unreviewed legacy image: '+image.slug);
 for(const image of newlyAcquired){
  const decision=newReviewed.get(image.slug);
  assert.ok(decision,'New GIS image lacks a research inventory decision: '+image.slug);
  assert.equal(image.gisScreenBatch,gisBatch.batch);
  assert.equal(image.articleSlug,decision.articleSlug);
  assert.equal(image.afterParagraphId,decision.afterParagraphId);
  assert.ok(image.sourceUrl&&image.sourceOriginalUrl&&image.credit&&image.licence);
  const article=articles.find(a=>a.slug===decision.articleSlug);
  assert.ok(article,'Unknown chapter for '+image.slug);
  const relevant=passages.filter(p=>p.articleId===article.id);
  assert.ok(relevant.some(p=>p.blocks?.some(b=>b.type==='paragraph'&&b.id===decision.afterParagraphId)),'No documented paragraph '+image.slug);
  const placements=Object.values(placeChapterImages(article,relevant,images)).flat().filter(i=>i.slug===image.slug);
  assert.equal(placements.length,1,'New GIS screen must be placed exactly once: '+image.slug);
 }
 const review=JSON.parse(fs.readFileSync('docs/media/ladeda-handbook-review-20261011.json','utf8'));
 const acquisition=JSON.parse(fs.readFileSync('docs/media/luc-original-acquisition-20261011.json','utf8'));
 const candidates=[...review.plots,...acquisition.items.filter(item=>item.id.startsWith('held-nzlri-'))];
 assert.equal(held.length,candidates.length,'every held candidate has an alignment decision');
 for(const candidate of candidates){
  assert.equal(candidate.published,false);
  assert.ok(held.some(row=>row.startsWith('"'+candidate.id+'",')));
  assert.ok(!images.some(image=>image.slug===candidate.id),'Rights-held candidate published: '+candidate.id);
 }
 assert.ok(file.every(row=>!row.includes('undefined')),'bad image evidence fields');
});
test('six additions depict the named data, system, event or archival process of the actual paragraph',()=>{
 for(const slug of added){
  const match=reviewedImagePassages[slug];
  const image=images.find(i=>i.slug===slug);
  const article=articles.find(a=>a.slug===match.articleSlug);
  assert.ok(image?.sourceUrl&&image.licence&&image.licenceUrl&&image.credit);
  assert.ok(fs.existsSync('public'+image.assetPath),'unavailable display: '+slug);
  assert.ok(fs.existsSync('public'+image.originalAssetPath),'unavailable original: '+slug);
  const actual=passages.filter(p=>p.articleId===article.id);
  const para=actual.flatMap(p=>p.blocks||[]).find(b=>b.id===match.afterParagraphId);
  assert.equal(para?.type,'paragraph','Missing exact historic text '+slug);
  const positions=Object.values(placeChapterImages(article,actual,images)).flat()
   .filter(i=>i.slug===slug);
  assert.equal(positions.length,1,'Must appear only at supported passage '+slug);
  assert.equal(positions[0].inlineAfterBlockId,match.afterParagraphId);
  assert.ok(match.caption.length>95&&match.evidence.length>90);
 }
});
test('the 106 archived additions are neither deleted nor automatically distributed',()=>{
 const old=fs.readFileSync('docs/media/chapter-image-alignment-20261011.csv','utf8').trim().split(/\r?\n/);
 assert.equal(old.length,107);
 const allUsage=articles.flatMap(article=>Object.values(placeChapterImages(article,
  passages.filter(p=>p.articleId===article.id),images)).flat());
 const index=new Set(allUsage.map(i=>i.slug));
 let unplaced=0;
 for(const line of old.slice(1)){
  const slug=line.match(/^"([^"]+)"/)[1];
  assert.ok(images.some(i=>i.slug===slug),'Original acquisition lost '+slug);
  if(!index.has(slug))unplaced++;
 }
 assert.ok(unplaced>=90,'Scattered map regressions: '+unplaced+' of 106 still unmatched');
});
