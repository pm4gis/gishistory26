import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const read = path => readFileSync(path,'utf8');
const overview = read('src/pages/history/index.astro');
const home = read('src/pages/index.astro');
const about = read('src/pages/about/index.astro');
const layout = read('src/layouts/Layout.astro');
const sitemap = read('src/pages/sitemap.xml.ts');
const llms = read('public/llms.txt');

test('short history is a server-rendered, indexable standalone page', () => {
 assert.match(overview,/<Layout title="A Short History of GIS in New Zealand/);
 assert.match(overview,/<h1>\{heading\}<\/h1>/);
 assert.match(overview, /data-pagefind-body/);
 assert.match(overview, /structuredData=\{structuredData\}/);
 assert.match(overview, /'@type': 'Article'/);
 assert.match(overview, /31 December 2025/);
 assert.doesNotMatch(overview, /2026|google\.com\/goto|noindex/);
});

test('entry points and discovery resources link directly to the overview', () => {
 assert.match(home, /href="\/history\/"/);
 assert.match(about, /href="\/history\/"/);
 assert.match(layout, /href="\/history\/"/);
 assert.match(sitemap, /'\/history\/'/);
 assert.match(llms, /https:\/\/history\.pm4gis\.nz\/history\//);
});

test('overview references accepted pages and primary institutions', () => {
 const slugs = [...overview.matchAll(/href="\/stories\/([a-z0-9-]+)\/"/g)].map(match=>match[1]);
 assert.ok(slugs.length >= 7);
 for(const slug of slugs) {
  assert.ok(existsSync('src/content/articles/'+slug+'.json'), 'Unknown chapter '+slug);
  const article=JSON.parse(read('src/content/articles/'+slug+'.json'));
  assert.equal(article.status,'published','Not published '+slug);
 }
 assert.ok(existsSync('src/content/themes/maori-gis.json'));
 assert.match(overview, /https:\/\/www\.linz\.govt\.nz\/guidance\//);
 assert.match(overview, /https:\/\/ngaitahu\.iwi\.nz\/te-runanga-o-ngai-tahu\//);
});
