import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {reviewedImagePassages,placeChapterImages} from '../src/lib/chapter-media.mjs';
const readDir=dir=>fs.readdirSync(dir).filter(x=>x.endsWith('.json'))
  .map(x=>JSON.parse(fs.readFileSync(dir+'/'+x,'utf8')));
const images=readDir('src/content/images');
const articles=readDir('src/content/articles');
const passages=readDir('src/content/passages');
const wave=JSON.parse(fs.readFileSync('docs/media/documentary-image-wave6-result-20261011.json','utf8'));
const curated=JSON.parse(fs.readFileSync('docs/media/documentary-wave6-curation-result-20261011.json','utf8'));
const retrolens=JSON.parse(fs.readFileSync('docs/media/retrolens-primary-frames-run-20261011.json','utf8'));
const nasa=JSON.parse(fs.readFileSync('docs/media/nasa-nz-satellite-wave-run-20261011.json','utf8'));
const removed=new Set(curated.cullReasons.map(x=>x.slug));
const newSlugs=[
 ...wave.items.filter(x=>x.status==='archived'&&!removed.has(x.slug)).map(x=>x.slug),
 ...curated.items.filter(x=>x.status==='archived').map(x=>x.slug),
 ...retrolens.items.filter(x=>x.status==='archived').map(x=>x.slug),
 ...nasa.items.filter(x=>x.status==='archived').map(x=>x.slug)
];
const idSet=new Set(newSlugs);
test('the 106 originals are preserved with licensed source records',()=>{
 assert.equal(newSlugs.length,106);
 assert.equal(idSet.size,106,'no duplicated originals in register');
 for(const slug of newSlugs){
  const image=images.find(x=>x.slug===slug);
  assert.ok(image,'Missing archived image: '+slug);
  assert.ok(image.sourceUrl&&image.licence&&image.credit&&image.originalSha256);
  assert.ok(fs.existsSync('public'+image.originalAssetPath),slug+' original missing');
  assert.ok(fs.existsSync('public'+image.assetPath),slug+' display missing');
 }
});
test('reviewed images have direct documentary relationships to an actual named paragraph',()=>{
 assert.ok(Object.keys(reviewedImagePassages).length>=8);
 for(const [slug,match] of Object.entries(reviewedImagePassages)){
  assert.ok(images.some(image=>image.slug===slug),'Review refers to a missing registered image: '+slug);
  const article=articles.find(x=>x.slug===match.articleSlug);
  assert.ok(article,slug+' missing story');
  const matched=passages.find(x=>x.articleId===article.id&&
    x.blocks?.some(b=>b.type==='paragraph'&&b.id===match.afterParagraphId));
  assert.ok(matched,slug+' missing verified paragraph '+match.afterParagraphId);
  assert.ok(match.caption.length>75&&match.evidence.length>40);
  const layout=placeChapterImages(article,passages.filter(p=>p.articleId===article.id),images);
  const picture=layout[matched.id]?.find(x=>x.slug===slug);
  assert.ok(picture,slug+' not displayed at its reviewed paragraph');
  assert.equal(picture.inlineAfterBlockId,match.afterParagraphId);
 }
});
test('unreviewed downloads remain in image archive, never scattered across chapter sections',()=>{
 const placed=[];
 for(const article of articles){
  const chosen=placeChapterImages(article,passages.filter(p=>p.articleId===article.id),images);
  for(const [pid,items] of Object.entries(chosen)){
   for(const image of items){
    assert.ok(image.inlineAfterBlockId,'Image has no paragraph anchor: '+image.slug);
    placed.push({slug:image.slug,pid,articleSlug:article.slug});
   }
  }
 }
 const fromWave=placed.filter(x=>idSet.has(x.slug));
 const reviewedNew=Object.keys(reviewedImagePassages).filter(slug=>idSet.has(slug));
 assert.equal(fromWave.length,reviewedNew.length);
 assert.deepEqual(new Set(fromWave.map(x=>x.slug)),new Set(reviewedNew));
 assert.ok(newSlugs.length>fromWave.length,'archive-only material must stay accessible without forced insertion');
 for(const {slug} of fromWave)assert.equal(placed.filter(x=>x.slug===slug).length,1);
});
