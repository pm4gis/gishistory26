import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { isTimelineEventInPeriod } from '../src/lib/timeline-cutoff.mjs';

const root = path.resolve('.');
const officialUrl = 'https://www.linz.govt.nz/about-us/our-organisation/our-whakapapa';
const panelPeriods = ['1900-1929', '1930-1959', '1960-1979', '1980-1989', '1990-1999'];
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const filesBelow = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const fullPath = path.join(directory, entry.name);
  return entry.isDirectory() ? filesBelow(fullPath) : [fullPath];
});
const visit = (value, callback) => {
  if (Array.isArray(value)) return value.forEach((item) => visit(item, callback));
  if (value && typeof value === 'object') {
    callback(value);
    Object.values(value).forEach((item) => visit(item, callback));
  }
};

test('Our Whakapapa panels remain cited sources, not published site images', () => {
  const imageRecords = filesBelow(path.join(root, 'src/content/images')).filter((file) => /linz-our-whakapapa-/.test(file));
  assert.deepEqual(imageRecords, []);

  const historicalAssets = filesBelow(path.join(root, 'public/assets/historical'));
  assert.equal(historicalAssets.some((file) => /linz-our-whakapapa-|20261016_13\d+\.jpg/.test(file)), false);

  const contentFiles = filesBelow(path.join(root, 'src/content')).filter((file) => file.endsWith('.json'));
  const content = contentFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(content, /\/images\/linz-our-whakapapa-/);

  const citations = [];
  for (const file of contentFiles) visit(readJson(path.relative(root, file)), (value) => {
    if (typeof value.label === 'string' && value.label.includes('Our Whakapapa exhibition panel')) citations.push(value);
  });
  assert.ok(citations.length > 0, 'historical claims retain panel citations');
  assert.ok(citations.every((citation) => citation.url === officialUrl), 'panel citations link to the official exhibition page');
  assert.ok(citations.some((citation) => citation.label.includes('1960–1979')));
  assert.ok(citations.some((citation) => citation.label.includes('1980–1989')));
});

test('panel-derived historical claims retain their cross-checks and timeline limits', () => {
  const chapter3 = readJson('src/content/passages/chapter-3-p001.json');
  const unitPassage = chapter3.blocks.find((block) => block.id === 'ch03-s01-p04');
  assert.match(unitPassage.text, /Computer Mapping Unit established in 1979/);
  assert.match(unitPassage.text, /does not show that the unit and MAPPAK were the same system/);
  assert.ok(unitPassage.sources.some((source) => source.url === officialUrl));

  const chapter13 = readJson('src/content/passages/chapter-13-p003.json');
  const districtPassage = chapter13.blocks.find((block) => block.id === 'ch13-s03-p05');
  assert.match(districtPassage.text, /each of the twelve district offices/);
  assert.match(districtPassage.text, /March 1989/);
  assert.ok(districtPassage.sources.some((source) => source.url === officialUrl));
  assert.ok(districtPassage.sources.some((source) => source.label.includes('Te Ara')));

  const chapter3Article = readJson('src/content/articles/drawing-maps-by-machine.json');
  assert.match(chapter3Article.sourceNotes.find((note) => note.id === 'ch03-note-05').text, /panel gives the first NZMS 260 sheet as 1978/);
  assert.match(chapter3Article.sourceNotes.find((note) => note.id === 'ch03-note-05').text, /T12 Thames, as published in 1977/);

  const events = filesBelow(path.join(root, 'src/content/events')).filter((file) => file.endsWith('.json'))
    .map((file) => readJson(path.relative(root, file)));
  assert.equal(events.filter((event) => event.id === '1979-lands-survey-computer-mapping-unit').length, 1);
  assert.ok(events.every(isTimelineEventInPeriod), 'the 31 December 2025 timeline cutoff remains intact');
  assert.ok(!events.some((event) => event.year === 1989 && /first.*GPS|GPS.*first/i.test(event.label || '')));
});
