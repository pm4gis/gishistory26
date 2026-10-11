import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {chapterDocuments} from '../src/lib/chapter-documents.mjs';
test('original source downloads retain byte identity and exact paragraph associations',()=>{
 assert.equal(chapterDocuments.length,2);
 const passages=fs.readdirSync('src/content/passages').map(f=>JSON.parse(fs.readFileSync('src/content/passages/'+f)));
 for(const document of chapterDocuments){
  const bytes=document.archiveParts ? Buffer.concat(document.archiveParts.map(part=>fs.readFileSync(part))) : fs.readFileSync('public'+document.assetPath);
  assert.equal(bytes.length,document.bytes);
  assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),document.sha256);
  const paragraph=passages.flatMap(p=>p.blocks||[]).find(b=>b.id===document.afterParagraphId);
  assert.ok(paragraph);
  assert.match(paragraph.text,document.slug.startsWith('ladeda')?/Williams/:/compact code/);
  assert.match(document.rights,/Crown copyright/);
 }
});
