import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {chapterNavImageMap} from '../src/lib/chapter-nav-media.mjs';
import {chapterCardImageMap, homepageChapterImageMap, homepageFullBleedImageSlugs, homepageMapDetailChapterSlugs} from '../src/lib/home-chapter-thumbnails.mjs';

const collection = name => readdirSync('src/content/' + name).filter(file => file.endsWith('.json'))
  .map(file => JSON.parse(readFileSync('src/content/' + name + '/' + file, 'utf8')));
const chapters = collection('articles').filter(article => article.status === 'published' && article.slug !== 'preface');
const passages = collection('passages');
const images = collection('images');
const home = readFileSync('src/pages/index.astro', 'utf8');
const catalogue = readFileSync('src/pages/read/index.astro', 'utf8');
const css = readFileSync('src/styles/site.css', 'utf8');

test('both public chapter indexes use one authoritative thumbnail selector', () => {
  for (const page of [home, catalogue]) {
    assert.match(page, /chapterCardImageMap\(chapters,d.passages,d.images\)/);
    assert.match(page, /\.thumbnailPath\|\|[^}]*\.assetPath/);
    assert.match(page, /alt=\{/);
    assert.match(page, /homepageFullBleedImageSlugs\.has/);
    assert.match(page, /homepageMapDetailChapterSlugs\.has\(a.slug\)/);
  }
  assert.doesNotMatch(catalogue, /chapterNavImageMap/);
});

test('every chapter has the same verified image and image source on both pages', () => {
  assert.equal(chapters.length, 44);
  const canonical = chapterCardImageMap(chapters, passages, images);
  const legacy = homepageChapterImageMap(chapters, passages, images);
  assert.deepEqual(Object.keys(canonical).sort(), Object.keys(legacy).sort());
  for (const chapter of chapters) {
    const image = canonical[chapter.slug];
    assert.ok(image?.slug, chapter.slug + ' missing selected image');
    assert.ok(image.assetPath && image.altText && image.credit && image.sourceUrl, chapter.slug + ' missing documentary details');
    assert.equal(image.slug, legacy[chapter.slug]?.slug, chapter.slug + ' image selector diverged');
    assert.equal(image.thumbnailPath || image.assetPath, legacy[chapter.slug]?.thumbnailPath || legacy[chapter.slug]?.assetPath);
    assert.equal(image.altText, legacy[chapter.slug]?.altText);
    assert.ok(existsSync('public' + (image.thumbnailPath || image.assetPath)), chapter.slug + ' thumbnail file missing');
  }
  const old = chapterNavImageMap(chapters, passages, images);
  const mismatches = chapters.filter(chapter => old[chapter.slug]?.slug !== canonical[chapter.slug]?.slug);
  assert.equal(mismatches.length, 26, 'the 24 previously blank catalogue cards and two different choices must now share the approved selection');
});

test('both indexes apply the same reviewed photo and map crops', () => {
  assert.match(catalogue, /id=\{'chapter-'\+a.readingOrder\}/);
  assert.match(catalogue, /chapter-card-media--photo/);
  assert.match(catalogue, /chapter-card-media--detail/);
  assert.ok(home.includes('chapter-card-media--photo'));
  assert.ok(home.includes('chapter-card-media--detail'));
  assert.ok(homepageFullBleedImageSlugs.size > 8);
  assert.ok(homepageMapDetailChapterSlugs.size > 8);
  assert.match(css, /:is\(#chapters,\.chapter-catalogue\) \.chapter-card-media--photo img/);
  assert.match(css, /:is\(#chapters,\.chapter-catalogue\) \.chapter-card-media--detail img/);
  assert.match(css, /:is\(#chapters,\.chapter-catalogue\) #chapter-9 \.chapter-card-media--detail img/);
});
