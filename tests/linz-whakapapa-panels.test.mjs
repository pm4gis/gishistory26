import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { placeChapterImages } from '../src/lib/chapter-media.mjs';
import { isTimelineEventInPeriod } from '../src/lib/timeline-cutoff.mjs';

const root = path.resolve('.');
const panels = [
  ['20261016_134012.jpg', '1900-1929', 'what-the-computer-inherited', 1, 'ch01-s03-p03'],
  ['20261016_133941.jpg', '1930-1959', 'what-the-computer-inherited', 1, 'ch01-s04-p02'],
  ['20261016_133949.jpg', '1960-1979', 'drawing-maps-by-machine', 3, 'ch03-s01-p04'],
  ['20261016_133955.jpg', '1980-1989', 'the-cadastre-becomes-data', 13, 'ch13-s03-p05'],
  ['20261016_134000.jpg', '1990-1999', 'rebuilding-the-coordinate-framework', 19, 'ch19-s03-p01'],
];
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const allJson = (relative) => fs.readdirSync(path.join(root, relative)).filter((name) => name.endsWith('.json'))
  .map((name) => readJson(path.join(relative, name)));
const imageRecords = allJson('src/content/images');
const records = allJson('src/content/records');
const articles = allJson('src/content/articles');
const passages = allJson('src/content/passages');
const events = allJson('src/content/events');

 test('five original panel files, byte checksums and upright derivatives are preserved', async () => {
  const names = [];
  for (const [filename, period, articleSlug, chapterNumber, anchor] of panels) {
    const slug = `linz-our-whakapapa-${period}`;
    const image = imageRecords.find((entry) => entry.slug === slug);
    assert.ok(image, `missing image record: ${slug}`);
    assert.equal(image.sourceFileTitle, filename);
    names.push(image.sourceFileTitle);

    const original = fs.readFileSync(path.join(root, 'public', image.originalAssetPath.slice(1)));
    assert.equal(sha256(original), image.originalSha256, `${slug} original hash`);
    const originalMeta = await sharp(original).metadata();
    assert.equal(originalMeta.width, 4000, `${slug} raw width`);
    assert.equal(originalMeta.height, 1638, `${slug} raw height`);
    assert.equal(originalMeta.orientation, 6, `${slug} source EXIF orientation`);

    const web = fs.readFileSync(path.join(root, 'public', image.assetPath.slice(1)));
    const webMeta = await sharp(web).metadata();
    assert.equal(sha256(web), image.webSha256, `${slug} display hash`);
    assert.equal(webMeta.format, 'webp');
    assert.equal(webMeta.width, image.displayWidth);
    assert.equal(webMeta.height, image.displayHeight);
    assert.equal(webMeta.width, 1638);
    assert.equal(webMeta.height, 4000);

    const card = fs.readFileSync(path.join(root, 'public', image.thumbnailPath.slice(1)));
    const cardMeta = await sharp(card).metadata();
    assert.equal(sha256(card), image.thumbnailSha256, `${slug} card hash`);
    assert.equal(cardMeta.format, 'webp');
    assert.equal(cardMeta.width, image.thumbnailWidth);
    assert.equal(cardMeta.height, image.thumbnailHeight);
    assert.ok(Math.abs((webMeta.width / webMeta.height) - (cardMeta.width / cardMeta.height)) < 0.002,
      `${slug} card keeps the full upright panel aspect ratio`);

    assert.equal(image.articleSlug, articleSlug);
    assert.equal(image.chapterNumber, chapterNumber);
    assert.equal(image.dateDisplay, `Historical panel period: ${period.replace('-', '–')}; photograph taken: 16 October 2026`);
    assert.match(image.credit, /Duane Wilkins, 16 October 2026/);
    assert.match(image.licence, /CC BY 4\.0/);
    assert.match(image.licence, /not been individually confirmed/);
    assert.ok(image.caption.includes('16 October 2026'));
    assert.ok(image.context.includes('not the date of the historical events'));
    assert.ok(image.relatedRecords.length > 0);
    assert.ok(image.relatedRecords.some((related) => related.url === '/entities/department-of-lands-and-survey/' ||
      related.url === '/entities/department-of-survey-and-land-information-dosli/' ||
      related.url === '/entities/land-information-new-zealand-linz/'), `${slug} links a historical organisation`);

    const article = articles.find((entry) => entry.slug === articleSlug);
    const panelLink = image.relatedRecords.find((related) => related.url === article.url);
    assert.ok(panelLink, `${slug} links to its chapter`);
    const panelPassages = passages.filter((entry) => entry.articleId === article.id);
    const placed = Object.values(placeChapterImages(article, panelPassages, [image])).flat();
    assert.equal(placed.length, 0, `${slug} stays in the image archive until a panel-specific passage placement is approved`);
    assert.ok(passages.some((entry) => entry.blocks?.some((block) => block.id === anchor && block.type === 'paragraph')),
      `${slug} chapter relationship points to existing context`);
  }
  assert.deepEqual(names.sort(), panels.map(([filename]) => filename).sort());
  assert.equal(new Set(names).size, 5, 'source filenames are unique');
  assert.equal(imageRecords.filter((entry) => entry.slug.startsWith('linz-our-whakapapa-')).length, 5);
});

test('image and organisation links resolve; no person, event or relationship is duplicated', () => {
  const routes = new Set([
    ...records.map((record) => record.url),
    ...articles.map((article) => article.url),
    ...imageRecords.map((image) => `/images/${image.slug}/`),
  ]);
  for (const [, period] of panels) {
    const image = imageRecords.find((entry) => entry.slug === `linz-our-whakapapa-${period}`);
    for (const related of image.relatedRecords) assert.ok(routes.has(related.url), `${related.name} route exists`);
  }

  for (const [slug, route] of [
    ['department-of-lands-and-survey', '/images/linz-our-whakapapa-1900-1929/'],
    ['department-of-lands-and-survey', '/images/linz-our-whakapapa-1930-1959/'],
    ['department-of-lands-and-survey', '/images/linz-our-whakapapa-1960-1979/'],
    ['department-of-survey-and-land-information-dosli', '/images/linz-our-whakapapa-1980-1989/'],
    ['department-of-survey-and-land-information-dosli', '/images/linz-our-whakapapa-1990-1999/'],
    ['land-information-new-zealand-linz', '/images/linz-our-whakapapa-1990-1999/'],
  ]) {
    const org = records.find((record) => record.slug === slug);
    assert.ok(org.contextLinks?.some((link) => link.url === route), `${slug} links ${route}`);
  }

  assert.equal(records.filter((record) => record.slug === 'chris-kinzett').length, 1);
  assert.equal(records.filter((record) => record.slug === 'bill-robertson').length, 1);
  assert.equal(events.filter((event) => event.id === '1977-nzms260').length, 1);
  assert.equal(events.filter((event) => event.id === '1977-mappak').length, 1);
  assert.equal(events.filter((event) => event.id === '1979-lands-survey-computer-mapping-unit').length, 1);
  assert.ok(events.every(isTimelineEventInPeriod), 'the 31 December 2025 timeline cut-off remains intact');
});

test('the two panel date conflicts remain explicit and no new historical-first claim is published', () => {
  const metricPanel = imageRecords.find((entry) => entry.slug === 'linz-our-whakapapa-1960-1979');
  const gpsPanel = imageRecords.find((entry) => entry.slug === 'linz-our-whakapapa-1980-1989');
  assert.match(metricPanel.context, /panel says the first NZMS 260 sheet was published in 1978/);
  assert.match(metricPanel.context, /Te Ara identifies T12 Thames as published in 1977/);
  assert.match(gpsPanel.context, /March 1989/);
  assert.match(gpsPanel.context, /Te Ara gives 1986/);
  assert.ok(!events.some((event) => event.year === 1989 && /first.*GPS|GPS.*first/i.test(event.label || '')));
  assert.ok(!events.some((event) => event.year === 2026), 'the photo capture date is not a historical event');
});
