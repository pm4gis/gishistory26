import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {contributedPrimarySources} from '../src/lib/contributed-primary-sources.mjs';
import {onlinePdfPublications} from '../src/lib/online-pdf-publications.mjs';
import {nzGeospatialPdfAdditions} from '../src/lib/nz-geospatial-pdf-additions.mjs';
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
 assert.ok(archive.includes('data={item.viewerPath} type="application/pdf"'));
 assert.ok(archive.includes('navigation.next'));
 assert.ok(!archive.includes('Download original'));
 assert.ok(!archive.includes('download>'));
 assert.ok(research.includes('data={item.pdfPath} type="application/pdf"'));
 assert.ok(research.includes('navigation.next'));
 assert.ok(sitemap.includes('onlinePdfPublications.forEach'));
});


test('expanded New Zealand geospatial catalogue contains verified pre-2025 PDF sources',()=>{
 assert.ok(onlinePdfPublications.length>=200,'The online catalogue should contain hundreds of references');
 assert.ok(nzGeospatialPdfAdditions.length>=160,'The new NZ source batch should be substantial');
 assert.equal(new Set(nzGeospatialPdfAdditions.map(item=>item.slug)).size,nzGeospatialPdfAdditions.length);
 assert.ok(nzGeospatialPdfAdditions.every(item=>Number(item.year)<2025&&item.isPdf&&item.externalPdfUrl&&item.sourceUrl));
 assert.ok(onlinePdfPublications.every(item=>Number(item.year)<2025),'The catalogue should only show publications before 2025');
});

test('publication readers prioritize a viewport-sized PDF and compact page heading',()=>{
 const layout=fs.readFileSync('src/layouts/Layout.astro','utf8');
 const archive=fs.readFileSync('src/pages/publications/[slug].astro','utf8');
 const research=fs.readFileSync('src/pages/publications/research/[slug].astro','utf8');
 assert.ok(layout.includes("topbar--reader"));
 assert.ok(archive.indexOf('<object id="read-document"')<archive.indexOf('<section class="reader-details">'));
 assert.ok(research.indexOf('<object id="read-document"')<research.indexOf('<section class="reader-details">'));
 assert.ok(archive.includes('height:calc(100dvh - 215px)'));
 assert.ok(research.includes('height:calc(100dvh - 215px)'));
 assert.ok(archive.includes('min-height:620px'));
 assert.ok(research.includes('min-height:620px'));
 assert.equal((archive.match(/class="publication-reader-nav"/g)||[]).length,1);
 assert.equal((research.match(/class="publication-reader-nav"/g)||[]).length,1);
});
