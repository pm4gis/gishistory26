import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {canonicalHref, conciseDescription, recordSchema, chapterSchema, themeSchema, imageSchema, pageSchema, safeJsonLd} from '../src/lib/seo.mjs';

const load = path => JSON.parse(readFileSync(path, 'utf8'));
const person = load('src/content/records/jan-pierce.json');
const agency = load('src/content/records/land-information-new-zealand-linz.json');
const dataset = load('src/content/records/nzlri.json');
const chapter = load('src/content/articles/landonline.json');

test('every entity has a stable, canonical URL and accurate type', () => {
  const p = recordSchema(person, [{title:'A published chapter passage',url:'/stories/landonline/#passage'}]);
  const a = recordSchema(agency);
  const d = recordSchema(dataset);
  assert.equal(p['@type'], 'Person');
  assert.equal(a['@type'], 'Organization');
  assert.equal(d['@type'], 'Dataset');
  assert.equal(p.url, 'https://history.pm4gis.nz/people/jan-pierce/');
  assert.equal(p['@id'], p.url + '#subject');
  assert.ok(p.subjectOf.some(s => s.url.includes('linz.govt.nz')));
  assert.ok(p.subjectOf.some(s => s.url.includes('/stories/landonline/')));
  assert.ok(!p.alternateName?.includes(p.name));
  assert.ok(d.description.includes('Land Resource Inventory'));
  assert.throws(() => canonicalHref('https://other.example/'));
});

test('chapter metadata separates editorial dates from the historical chronology', () => {
  const s = chapterSchema(chapter, [{title:'From register to transaction system',slug:'from-register-to-transaction-system'}], [agency]);
  assert.equal(s['@type'], 'Chapter');
  assert.equal(s.dateModified, chapter.updatedAt);
  assert.equal(s.hasPart[0].url, 'https://history.pm4gis.nz/stories/landonline/#from-register-to-transaction-system');
  assert.equal(s.about[0]['@id'], recordSchema(agency)['@id']);
  assert.equal(s.isPartOf['@type'], 'Book');
});

test('theme and images use existing titles, links and attribution without invented terms', () => {
  const t = themeSchema({title:'Women in GIS',slug:'women-in-gis',description:'People and their work'}, [{title:'Passage',url:'/stories/landonline/#example'}]);
  assert.equal(t.itemListElement[0].url, 'https://history.pm4gis.nz/stories/landonline/#example');
  const img = imageSchema({slug:'sample',title:'A map',caption:'Source map',assetPath:'/assets/sample.webp',credit:'Archive',licenceUrl:'https://example.com/licence'});
  assert.equal(img.creditText, 'Archive');
  assert.equal(img.contentUrl, 'https://history.pm4gis.nz/assets/sample.webp');
  assert.ok(!('dateCreated' in img));
});

test('JSON-LD is safely embedded and linked to its webpage', () => {
  const main = recordSchema(person);
  const json = safeJsonLd(pageSchema({url:main.url,title:'Jan Pierce · NZ GIS History',description:'<script>alert(1)</script>',entities:main}));
  assert.ok(!json.includes('<script>'));
  const graph = JSON.parse(json);
  assert.equal(graph['@graph'][1].mainEntity['@id'], main['@id']);
  assert.equal(graph['@graph'][0]['@type'], 'WebSite');
  assert.equal(conciseDescription('many words '.repeat(50)).length <= 160, true);
});
