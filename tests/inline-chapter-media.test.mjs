import test from 'node:test';
import assert from 'node:assert/strict';
import {placeChapterImages} from '../src/lib/chapter-media.mjs';

const article = {slug:'landonline'};
const passages = Array.from({length:8},(_,i)=>({
  id:'p'+i,slug:'passage-'+i,blocks:[{type:'paragraph',id:'p'+i+'-first',text:'Accepted prose '+i}]
}));
const image = (slug, extra={}) => ({
  id:'image:'+slug,slug,articleSlug:'landonline',assetPath:'/assets/historical/web/'+slug+'.webp',
  caption:'Documentary image '+slug,...extra
});

test('images without reviewed paragraph anchors are NOT automatically placed',()=>{
  const placed=placeChapterImages(article,passages,[image('a'),image('b'),image('c')]);
  assert.deepEqual(Object.keys(placed),[]);
});

test('an explicit paragraph anchor works and block figures never duplicate',()=>{
  const withFigure=structuredClone(passages);
  withFigure[1].blocks.push({type:'figure',imageId:'image:a'});
  const imgs=[
    image('a',{afterParagraphId:'p1-first'}),
    image('b',{afterParagraphId:'p4-first'}),
    image('c',{afterParagraphId:'p2-first',articleSlug:'other'}),
    image('d',{afterParagraphId:'a-paragraph-that-does-not-exist'})
  ];
  const placed=placeChapterImages(article,withFigure,imgs);
  assert.deepEqual(Object.values(placed).flat().map(i=>i.slug),['b']);
  assert.equal(placed.p4[0].inlineAfterBlockId,'p4-first');
  assert.equal(withFigure[1].blocks[1].imageId,'image:a');
});

test('an expressly identified legacy passage uses its first paragraph, not random placement',()=>{
  const placed=placeChapterImages(article,passages,[image('a',{passageSlug:'passage-3'})]);
  assert.equal(placed.p3[0].slug,'a');
  assert.equal(placed.p3[0].inlineAfterBlockId,'p3-first');
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
