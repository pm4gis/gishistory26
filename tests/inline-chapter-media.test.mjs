import test from 'node:test';
import assert from 'node:assert/strict';
import {placeChapterImages} from '../src/lib/chapter-media.mjs';

const article = {slug:'landonline'};
const passages = Array.from({length:8},(_,i)=>({
  id:'p'+i,slug:'passage-'+i,blocks:[{type:'paragraph',text:'Accepted prose '+i}]
}));
const image = (slug, extra={}) => ({
  id:'image:'+slug,slug,articleSlug:'landonline',assetPath:'/assets/historical/web/'+slug+'.webp',
  caption:'Documentary image '+slug,...extra
});

test('chapter images are distributed through reading sections, never as heading or end gallery',()=>{
  const imgs=[image('a'),image('b'),image('c')];
  const placed=placeChapterImages(article,passages,imgs);
  assert.deepEqual(Object.keys(placed),['p2','p4','p6']);
  assert.deepEqual(Object.values(placed).flat().map(i=>i.slug),['a','b','c']);
  assert.equal(placed.p0,undefined);
  assert.equal(placed.p7,undefined);
});

test('only explicit chapter relationships qualify, with no duplicated block figure',()=>{
  const withFigure=structuredClone(passages);
  withFigure[1].blocks.push({type:'figure',imageId:'image:a'});
  const imgs=[image('a'),image('b'),image('c',{articleSlug:'other'}),image('b')];
  const placed=placeChapterImages(article,withFigure,imgs);
  assert.deepEqual(Object.values(placed).flat().map(i=>i.slug),['b']);
  assert.equal(withFigure[1].blocks[1].imageId,'image:a');
});

test('curated passage identifiers override automatic distribution',()=>{
  const placed=placeChapterImages(article,passages,[image('a',{passageSlug:'passage-3'})]);
  assert.equal(placed.p3[0].slug,'a');
  assert.deepEqual(placeChapterImages(article,[],[image('a')]),{__proto__:null});
});

test('image placement does not alter historical paragraphs or source metadata',()=>{
  const before=JSON.stringify({article,passages});
  const imgs=[image('c'),image('a',{headerCandidate:true})];
  const imageBefore=JSON.stringify(imgs);
  placeChapterImages(article,passages,imgs);
  assert.equal(JSON.stringify({article,passages}),before);
  assert.equal(JSON.stringify(imgs),imageBefore);
});


test('all nine archived figures have real source images and exact accepted paragraph anchors',async()=>{
  const {default:fs}=await import('node:fs');
  const {curatedImageParagraphs}=await import('../src/lib/chapter-media.mjs');
  const root='src/content';
  const catalog=fs.readdirSync(root+'/images').map(name=>
    JSON.parse(fs.readFileSync(root+'/images/'+name,'utf8')));
  const sections=fs.readdirSync(root+'/passages').map(name=>
    JSON.parse(fs.readFileSync(root+'/passages/'+name,'utf8')));
  const articles=fs.readdirSync(root+'/articles').map(name=>
    JSON.parse(fs.readFileSync(root+'/articles/'+name,'utf8')));
  assert.equal(Object.keys(curatedImageParagraphs).length,9);
  for(const [slug,blockId] of Object.entries(curatedImageParagraphs)){
    const image=catalog.find(x=>x.slug===slug);
    assert.ok(image,'Missing sourced image '+slug);
    const section=sections.find(p=>p.blocks?.some(b=>b.id===blockId&&b.type==='paragraph'));
    assert.ok(section,'Missing original paragraph '+blockId);
    const story=articles.find(a=>a.id===section.articleId);
    assert.equal(image.articleSlug,story?.slug,slug+' chapter');
    const assigned=placeChapterImages(story,sections.filter(p=>p.articleId===story.id)
      .sort((a,b)=>a.order-b.order),catalog);
    assert.equal(assigned[section.id]?.find(p=>p.slug===slug)?.inlineAfterBlockId,blockId,slug+' inline anchor');
    for(const asset of [image.assetPath,image.thumbnailPath,image.originalAssetPath]){
      assert.ok(fs.existsSync('public'+asset),'Missing local asset '+asset);
    }
    assert.ok(image.credit&&image.sourceUrl&&image.licence&&image.licenceUrl,slug+' rights');
  }
});
