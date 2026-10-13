import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {chapterNavImageMap} from '../src/lib/chapter-nav-media.mjs';
import {curatedHomepageChapterImages,homepageChapterImageMap,reviewedHomepageOverrides,homepageFullBleedImageSlugs,homepageMapDetailChapterSlugs} from '../src/lib/home-chapter-thumbnails.mjs';

const raw=collection=>readdirSync('src/content/'+collection)
 .filter(name=>name.endsWith('.json'))
 .map(name=>JSON.parse(readFileSync('src/content/'+collection+'/'+name,'utf8')));
const articles=raw('articles').filter(a=>a.status==='published'&&a.slug!=='preface');
const passages=raw('passages');
const images=raw('images');

test('all 44 home chapter cards have authentic project images, with previously reviewed choices preserved',()=>{
 const reviewed=chapterNavImageMap(articles,passages,images);
 const covers=homepageChapterImageMap(articles,passages,images);
 const originalCount=Object.values(reviewed).filter(Boolean).length;
 assert.equal(articles.length,44);
 assert.equal(originalCount,20,'do not silently rewrite previously reviewed historical associations');
 assert.equal(Object.keys(curatedHomepageChapterImages).length,24);
 for(const article of articles){
  const card=covers[article.slug];
  assert.ok(card?.assetPath,'missing authentic chapter image: '+article.readingOrder+' '+article.title);
  assert.ok(card?.altText?.length>12,'missing accessible alternative text: '+article.slug);
  assert.ok(card?.sourceUrl,'missing image provenance: '+article.slug);
  assert.ok(card?.credit,'missing image credit: '+article.slug);
  if(reviewed[article.slug]&&!reviewedHomepageOverrides[article.slug])assert.equal(card.slug,reviewed[article.slug].slug,'existing passage-reviewed image changed: '+article.slug);
 }
 const distinctNew=new Set(Object.values(covers).filter(img=>img.homeCardContextual).map(img=>img.slug));
 assert.ok(distinctNew.size>=23,'contextual homepage images lack sufficient variety');
 assert.equal(Object.values(covers).filter(Boolean).length,44);
});

test('contextual image approval is specific to chapter and cannot silently become in-story evidence',()=>{
 const rawCard=homepageChapterImageMap(articles,passages,images);
 const approvedSlugs=new Set(articles.map(a=>a.slug));
 const recordSlugs=new Set(images.map(x=>x.slug));
 for(const [slug,choice] of Object.entries(curatedHomepageChapterImages)){
  assert.ok(approvedSlugs.has(slug),'unknown chapter '+slug);
  assert.ok(recordSlugs.has(choice.imageSlug),'unknown image '+choice.imageSlug);
  assert.ok(choice.reason?.length>65,'missing editorial suitability note for '+slug);
  assert.ok(['photo','map','interface'].includes(choice.kind),'unexpected image framing');
  assert.ok(rawCard[slug].homeCardContextual,'homepage fallback silently placed in chapter: '+slug);
 }
 assert.equal(rawCard['google-changes-the-audience'].slug,'doc-google-trekker-heaphy-2015');
 assert.match(curatedHomepageChapterImages['mapping-the-networks'].reason,/not an electricity/);
 assert.match(curatedHomepageChapterImages['safety-policing-and-emergency-gis'].reason,/distinct from police/);
});

test('homepage uses checked project image records and deliberately framed documentary thumbnail excerpts',()=>{
 const home=readFileSync('src/pages/index.astro','utf8');
 const css=readFileSync('src/styles/site.css','utf8');
 assert.match(home,/homepageChapterImageMap\(chapters,d.passages,d.images\)/);
 assert.match(home,/homeCardKind==='photo'/);
 assert.match(home,/homepageFullBleedImageSlugs\.has/);
 assert.match(home,/homepageMapDetailChapterSlugs\.has/);
 assert.match(home,/src=\{chapterNavImages\[a.slug\].thumbnailPath\|\|chapterNavImages\[a.slug\].assetPath\}/);
 assert.match(home,/alt=\{chapterNavImages\[a.slug\].altText\}/);
 assert.match(home,/loading="lazy"/);
 assert.match(css,/#chapters \.chapter-card-media--photo img\{object-fit:cover;object-position:center\}/);
 assert.match(css,/#chapters \.chapter-card-media--detail img\{object-fit:cover;/);
 assert.match(css,/#chapters #chapter-9 \.chapter-card-media--detail img\{object-position:33% 50%;transform:scale\(1\.25\);transform-origin:31% 50%\}/);
 assert.match(css,/\.chapter-card-media img,\.chapter-image-slot img\{width:100%;height:100%;object-fit:contain/);
 assert.doesNotMatch(home,/decorFor\(a\.readingOrder/);
});

test('two narrowly approved homepage overrides keep in-story documentary placement unchanged',()=>{
 const before=chapterNavImageMap(articles,passages,images);
 const after=homepageChapterImageMap(articles,passages,images);
 assert.deepEqual(Object.keys(reviewedHomepageOverrides).sort(),['earth-observation-becomes-routine','from-flat-maps-to-3d']);
 for(const [chapter,choice] of Object.entries(reviewedHomepageOverrides)){
  assert.ok(before[chapter],chapter+' must already have an in-story image');
  assert.notEqual(before[chapter].slug,choice.imageSlug,'homepage refinement must be a genuine selection change');
  assert.equal(after[chapter].slug,choice.imageSlug);
  assert.equal(after[chapter].homeCardReviewedOverride,true);
  assert.ok(choice.reason.length>100,chapter+' requires documented editorial grounds');
  assert.ok(after[chapter].sourceUrl&&after[chapter].credit&&after[chapter].altText);
  assert.notEqual(before[chapter].slug,after[chapter].slug);
 }
 const terrain=images.find(x=>x.slug==='ruapehu-3d-2002');
 assert.equal(terrain.articleSlug,'from-flat-maps-to-3d');
 assert.match(terrain.caption,/Shuttle Radar Topography Mission/);
 assert.equal(terrain.dateDisplay,'23 October 2002');
 const satellite=images.find(x=>x.slug==='nasa-landsat4-tasman-1990');
 assert.equal(satellite.articleSlug,'earth-observation-becomes-routine');
 assert.equal(satellite.dateDisplay,'1990-12-30');
 assert.ok(satellite.sourceUrl.includes('nasa.gov'));
});

test('thumbnail crop approvals are specific, verified, and affect only homepage presentation',()=>{
 const articleSlugs=new Set(articles.map(a=>a.slug));
 const imageSlugs=new Set(images.map(a=>a.slug));
 for(const slug of homepageMapDetailChapterSlugs)assert.ok(articleSlugs.has(slug),'unknown chapter crop approval: '+slug);
 for(const slug of homepageFullBleedImageSlugs)assert.ok(imageSlugs.has(slug),'unknown photo framing image: '+slug);
 const css=readFileSync('src/styles/site.css','utf8');
 const home=readFileSync('src/pages/index.astro','utf8');
 assert.match(css,/\.chapter-image-slot img\{width:100%;height:100%;object-fit:contain/);
 assert.match(css,/#chapters \.chapter-card-media--detail img\{object-fit:cover;/);
 assert.match(css,/#chapters \.chapter-card-media--photo img\{object-fit:cover;/);
 assert.doesNotMatch(readFileSync('src/pages/read/index.astro','utf8'),/homepageMapDetailChapterSlugs/);
 assert.doesNotMatch(readFileSync('src/components/Reader.svelte','utf8'),/homepageMapDetailChapterSlugs/);
 assert.ok(home.includes('chapter-card-media--detail'));
});
