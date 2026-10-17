import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {publications,archivedChapterPublications} from '../src/lib/publications.mjs';
import {chapterDocuments} from '../src/lib/chapter-documents.mjs';
import {contributedPrimarySources} from '../src/lib/contributed-primary-sources.mjs';

test('shared catalogue preserves original registers, files and routes',()=>{
 assert.equal(publications.length,12);
 assert.equal(new Set(publications.map(p=>p.slug)).size,12);
 for(const original of contributedPrimarySources){
  const entry=publications.find(p=>p.slug===original.slug);
  for(const [key,value] of Object.entries(original))assert.deepEqual(entry[key],value);
 }
 assert.equal(archivedChapterPublications.length,4);
 for(const original of chapterDocuments){
  const entry=publications.find(p=>p.slug===original.slug);
  assert.equal(entry.assetPath,original.assetPath);
  assert.equal(entry.viewerPath,original.assetPath);
  assert.equal(entry.bytes,original.bytes);
  assert.equal(entry.sha256,original.sha256);
  assert.equal(entry.pages,original.pdfPages);
  assert.equal(entry.chapterUrl,'/stories/'+original.articleSlug+'/#'+original.afterParagraphId);
  assert.equal(entry.legacyDocumentUrl,'/documents/'+original.slug+'/');
  const bytes=original.archiveParts?Buffer.concat(original.archiveParts.map(p=>fs.readFileSync(p))):fs.readFileSync('public'+original.assetPath);
  assert.equal(bytes.length,entry.bytes);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256);
  assert.ok(fs.statSync('public'+entry.coverPath).size>0);
  assert.ok(fs.statSync('public'+entry.thumbnailPath).size>0);
 }
});
test('Hocken retrieval and file creation never become a historical publication date',()=>{
 const guide=publications.find(p=>p.slug==='hocken-maps-and-plans-guide');
 assert.equal(guide.startDate,null);
 assert.equal(guide.precision,'unknown');
 assert.equal(guide.eventId,null);
 assert.equal(guide.historicalTimelineEligible,false);
 assert.match(guide.date,/not established/);
 assert.equal(guide.archivedDate,'2026-10-11');
});
