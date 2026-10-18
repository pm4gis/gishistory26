import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chapterDocuments} from '../src/lib/chapter-documents.mjs';
import {contributedPrimarySources} from '../src/lib/contributed-primary-sources.mjs';
import {onlinePdfPublications} from '../src/lib/online-pdf-publications.mjs';
import {pdfReadingUrl,pdfReadingLabel} from '../src/lib/pdf-reading-links.mjs';

const read = path => readFileSync(path,'utf8');

test('chapter and original-document links open an on-site reader rather than forcing downloads',()=>{
 const chapter=read('src/components/Reader.svelte');
 const detail=read('src/pages/documents/[slug].astro');
 assert.ok(chapter.includes("'/documents/'+document.slug+'/'"));
 assert.ok(chapter.includes('Read original PDF'));
 assert.ok(!chapter.includes(' download>')&&!chapter.includes('Download original PDF'));
 assert.ok(detail.includes('<PublicationReader'));
 assert.ok(detail.includes('pdfPath={document.assetPath}'));
 assert.ok(!detail.includes(' download>')&&!detail.includes('Download original PDF'));
 assert.ok(!read('src/pages/sources/documents/[slug].astro').includes('Read and download'));
 assert.ok(read('src/components/Sources.astro').includes('pdfReadingUrl(s.url)'));
 assert.ok(chapter.includes('pdfReadingUrl(s.url)'));
 assert.ok(chapter.includes('pdfReadingUrl(link.url)'));
});

test('all registered PDF assets and external originals link to their on-site reading pages',()=>{
 for(const doc of chapterDocuments){
  const path='/documents/'+doc.slug+'/';
  assert.equal(pdfReadingUrl(doc.assetPath),path);
  if(doc.sourceUrl?.toLowerCase().includes('.pdf'))assert.equal(pdfReadingUrl(doc.sourceUrl),path);
 }
 for(const item of contributedPrimarySources){
  assert.equal(pdfReadingUrl(item.viewerPath),item.publicationUrl);
 }
 for(const item of onlinePdfPublications.filter(p=>p.hostedLocally)){
  const path='/publications/pdf/'+item.slug+'/';
  assert.equal(pdfReadingUrl(item.pdfPath),path);
  if(item.externalPdfUrl)assert.equal(pdfReadingUrl(item.externalPdfUrl),path);
 }
 assert.equal(pdfReadingUrl('https://example.org/document-not-in-archive.pdf'),null);
 assert.equal(pdfReadingLabel('Download PDF',chapterDocuments[0].assetPath),'View PDF');
});

test('hosted PDF responses request inline presentation',()=>{
 const headers=read('public/_headers');
 assert.match(headers,/\/assets\/historical\/documents\/\*[\s\S]*?Content-Disposition: inline/);
 assert.match(headers,/\/assets\/publications\/pdfs\/\*[\s\S]*?Content-Disposition: inline/);
 const component=read('src/components/PublicationReader.astro');
 assert.ok(component.includes('type="application/pdf"'));
 assert.ok(component.includes('publication-reader-frame'));
 assert.ok(component.includes('position!=null&&total!=null'));
});
