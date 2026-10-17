import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {publicationReadingOrder,publicationReadingContext} from '../src/lib/publication-reading-order.mjs';

test('PDF reading pages show the document ahead of supporting information',()=>{
 const shared=readFileSync('src/components/PublicationReader.astro','utf8');
 const archive=readFileSync('src/pages/publications/[slug].astro','utf8');
 const reference=readFileSync('src/pages/publications/pdf/[slug].astro','utf8');
 assert.ok(shared.includes('publication-reader-frame'));
 assert.ok(shared.includes('width:100%;max-width:none'));
 assert.ok(shared.includes('height:calc(100dvh - 153px)'));
 assert.ok(shared.indexOf('publication-reader-frame')<shared.indexOf('publication-reader-details'));
 assert.ok(shared.includes('Read PDF full screen'));
 assert.ok(archive.includes('<PublicationReader')&&reference.includes('<PublicationReader'));
 for(const content of [archive,reference]){
  assert.ok(content.indexOf('<PublicationReader') < content.indexOf('About this publication'));
  assert.ok(!content.includes('Download original'));
  assert.ok(!content.includes('download>'));
 }
 assert.ok(!shared.includes('download>')&&!shared.includes('Download original'));
});

test('Previous and Next links stay on the website across all 75 PDF publications',()=>{
 assert.equal(publicationReadingOrder.length,75);
 assert.equal(new Set(publicationReadingOrder.map(x=>x.url)).size,75);
 assert.ok(publicationReadingOrder.every(x=>x.url.startsWith('/publications/')));
 assert.ok(publicationReadingOrder.every(x=>Number(x.year)<=2025));
 for(let i=0;i<publicationReadingOrder.length;i++){
  const item=publicationReadingOrder[i];
  const context=publicationReadingContext(item.url);
  assert.equal(context.position,i+1);
  assert.equal(context.total,75);
  assert.equal(context.previous?.url,publicationReadingOrder[i-1]?.url);
  assert.equal(context.next?.url,publicationReadingOrder[i+1]?.url);
 }
 assert.deepEqual(publicationReadingOrder.map(x=>x.year),[...publicationReadingOrder.map(x=>x.year)].sort());
 assert.ok(publicationReadingOrder.some(x=>x.kind==='archive'));
 assert.ok(publicationReadingOrder.some(x=>x.kind==='research'));
});

test('library is a single chronological grid with a left filter sidebar',()=>{
 const page=readFileSync('src/pages/publications/index.astro','utf8');
 assert.ok(page.includes('publication-library-layout'));
 assert.ok(page.includes('publication-sidebar'));
 assert.ok(page.includes('publicationReadingOrder.map'));
 assert.ok(page.includes('publication-filter-options'));
 assert.ok(page.includes('data-filter-kind="decade"'));
 assert.ok(page.includes('data-filter-kind="theme"'));
 assert.ok(page.includes('data-filter-kind="creator"'));
 assert.ok(!page.includes('type="search"'));
 assert.ok(!page.includes('Reuse:'));
 const styles=readFileSync('src/styles/site.css','utf8');
 assert.ok(styles.includes('.wrap{max-width:none'));
 assert.ok(styles.includes('.reading-shell{width:100%;max-width:none'));
 const chapter=readFileSync('src/components/Reader.svelte','utf8');
 assert.ok(chapter.includes('sidebar={true}'));
 assert.ok(chapter.indexOf('sidebar={true}')<chapter.indexOf('Related entries</h3>'));
 assert.ok(chapter.includes('<details class="passage-tools">'));
});
