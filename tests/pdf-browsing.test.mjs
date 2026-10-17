import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {contributedPrimarySources} from '../src/lib/contributed-primary-sources.mjs';
import {onlinePdfPublications} from '../src/lib/online-pdf-publications.mjs';
import {publicationSequence,publicationNavigation} from '../src/lib/pdf-browsing.mjs';

test('publication browsing links the catalogue entries through internal pages',()=>{
 const expected=contributedPrimarySources.filter(item=>item.format==='PDF').length+onlinePdfPublications.length;
 assert.equal(publicationSequence.length,expected);
 assert.equal(new Set(publicationSequence.map(item=>item.key)).size,expected);
 assert.ok(publicationSequence.every(item=>item.url.startsWith('/publications/')));
 const first=publicationNavigation(publicationSequence[0].key);
 const last=publicationNavigation(publicationSequence.at(-1).key);
 assert.equal(first.previous,null);
 assert.equal(last.next,null);
 assert.equal(first.next.key,publicationSequence[1].key);
 assert.equal(last.previous.key,publicationSequence.at(-2).key);
 assert.equal(publicationNavigation('missing:publication'),null);
});

test('publication pages embed documents and have no direct download buttons',()=>{
 const library=fs.readFileSync('src/pages/publications/index.astro','utf8');
 const archive=fs.readFileSync('src/pages/publications/[slug].astro','utf8');
 const research=fs.readFileSync('src/pages/publications/research/[slug].astro','utf8');
 const sitemap=fs.readFileSync('src/pages/sitemap.xml.ts','utf8');
 assert.ok(library.includes("href={'/publications/research/'+p.slug+'/'}"));
 assert.ok(!library.includes('Download hosted PDF'));
 assert.ok(!library.includes('Open source copy'));
 assert.ok(!library.includes('href={p.pdfPath}'));
 assert.ok(!library.includes('download='));
 assert.ok(archive.includes('<object data={item.viewerPath}'));
 assert.ok(archive.includes('navigation.next'));
 assert.ok(!archive.includes('Download original'));
 assert.ok(!archive.includes('download>'));
 assert.ok(research.includes('<object data={item.pdfPath}'));
 assert.ok(research.includes('navigation.next'));
 assert.ok(sitemap.includes('onlinePdfPublications.forEach'));
});
