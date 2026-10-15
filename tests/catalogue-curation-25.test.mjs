import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {subjectMedia,pickRecordImage} from '../src/lib/subject-media.mjs';
import {datasetCardSelections,datasetCardImageMap} from '../src/lib/dataset-card-media.mjs';

const readJson=path=>JSON.parse(readFileSync(path,'utf8'));
const readCollection=type=>readdirSync('src/content/'+type)
 .filter(name=>name.endsWith('.json'))
 .map(name=>readJson('src/content/'+type+'/'+name));
const release=readJson('docs/media/catalogue-curation-25-20261015.json');
const followUpPath='docs/media/direct-gis-image-followup-20261015.json';
const followUp=existsSync(followUpPath)?readJson(followUpPath):{replacements:[]};
const replacementByRecord=new Map(followUp.replacements.map(x=>[x.recordSlug,x.imageSlug]));
const currentSlug=entry=>replacementByRecord.get(entry.recordSlug)||entry.imageSlug;

const records=readCollection('records');
const images=readCollection('images');
const byRecord=new Map(records.map(x=>[x.slug,x]));
const byImage=new Map(images.map(x=>[x.slug,x]));

test('25 curated catalogue replacements are distinct pre-existing records with referenced archive images',()=>{
 assert.equal(release.selections.length,25);
 assert.equal(new Set(release.selections.map(x=>x.recordSlug)).size,25);
 assert.equal(release.selections.filter(x=>x.kind==='Dataset').length,10);
 assert.equal(release.selections.filter(x=>x.kind!=='Dataset').length,15);
 for(const entry of release.selections){
  const r=byRecord.get(entry.recordSlug);
  assert.ok(r,'missing record '+entry.recordSlug);
  assert.equal(r.kind,entry.kind,entry.recordSlug+' record kind changed');
  assert.ok(r.url?.endsWith('/'+r.slug+'/'),'unexpected entry route '+r.slug);
  const image=byImage.get(currentSlug(entry));
  assert.ok(image,'missing historical image '+entry.imageSlug);
  assert.ok(image.sourceUrl?.startsWith('https://'),entry.imageSlug+' source URL absent');
  assert.ok(image.credit?.length>5,entry.imageSlug+' credit missing');
  assert.ok(image.licence?.length>2,entry.imageSlug+' licence missing');
  assert.ok(image.altText?.length>10,entry.imageSlug+' accessible description missing');
  assert.ok(existsSync('public'+(image.thumbnailPath||image.assetPath)),entry.imageSlug+' thumbnail missing');
  assert.ok(existsSync('public'+image.assetPath),entry.imageSlug+' full image missing');
  const selected=pickRecordImage(r,images);
  assert.ok(selected,entry.recordSlug+' remains decorative');
  assert.equal(selected.image.slug,currentSlug(entry),entry.recordSlug+' wrong image');
  assert.ok(selected.relation?.length>=75,entry.recordSlug+' insufficient source context');
  if(entry.kind==='Dataset'){
   assert.equal(datasetCardSelections[r.slug]?.imageSlug,entry.imageSlug,'dataset cards and records disagree');
   assert.ok(datasetCardSelections[r.slug].note.length>=65);
  }else{
   assert.equal(subjectMedia.records[r.slug]?.slug,currentSlug(entry));
   assert.ok(subjectMedia.records[r.slug].relation.length>=75);
  }
 }
});

test('dataset catalogue and related entries use the same imagery with source credit links',()=>{
 const datasetRecords=records.filter(r=>r.kind==='Dataset');
 const visual=datasetCardImageMap(datasetRecords,images);
 for(const entry of release.selections.filter(x=>x.kind==='Dataset')){
  assert.equal(visual[entry.recordSlug]?.slug,entry.imageSlug);
  assert.equal(visual[entry.recordSlug]?.sourceNote,datasetCardSelections[entry.recordSlug].note);
 }
 const datasetPage=readFileSync('src/pages/datasets/index.astro','utf8');
 const browsePage=readFileSync('src/pages/browse/index.astro','utf8');
 const browseComponent=readFileSync('src/components/Browse.svelte','utf8');
 const subject=readFileSync('src/components/SubjectImage.astro','utf8');
 assert.match(datasetPage,/href=\{r\.url\} aria-label=\{'Read about '\+r\.name\}/);
 assert.match(datasetPage,/Image source and credit/);
 assert.match(browsePage,/pickRecordImage\(r,d\.images\)/);
 assert.match(browseComponent,/<a href=\{r\.url\} aria-label=\{"Read "\+r\.name\}>/);
 assert.match(subject,/const tileUrl=destination\|\|url/);
 assert.match(subject,/href=\{url\}>Image source, credit and licence/);
});

test('contextual imagery explicitly distinguishes examples from documented original outputs',()=>{
 const original=release.selections.filter(x=>x.relationship==='source product');
 const contextual=release.selections.filter(x=>x.relationship!=='source product');
 assert.ok(original.length>=4,'too few direct historical source products');
 assert.ok(contextual.length>=10,'contextual relationship register lost distinctions');
 for(const entry of contextual){
  const r=byRecord.get(entry.recordSlug);
  const note=pickRecordImage(r,images).relation;
  assert.ok(/not |predate|before |after |older|original|rather than|historic|earlier|illustrat|related|later|independent/i.test(note),
   entry.recordSlug+' contextual relationship is not qualified');
 }
});
