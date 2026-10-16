import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('docs/media/linz-aims-qgis-2024-20261016.json','utf8'));
test('LINZ QGIS AIMS originals are source-verified BSD, dated in pre-2025 source, and archive-only',()=>{
 assert.equal(manifest.images.length,3);
 const ledger=readFileSync('docs/media/documentary-archive-ledger-20261016.md','utf8');
 const licence=readFileSync('public'+manifest.licenceLocal,'utf8');
 assert.ok(licence.includes('Copyright (c) 2015, Land Information New Zealand'));
 assert.ok(licence.includes('Redistributions in binary form must reproduce'));
 const csv=readFileSync('docs/media/chapter-image-alignment-wave2-20261011.csv','utf8');
 const chapter=readFileSync('src/lib/chapter-media.mjs','utf8');
 const subjects=readFileSync('src/lib/subject-media.mjs','utf8');
 for(const item of manifest.images){
  assert.ok(ledger.includes(item.slug));
  assert.ok(csv.includes('"'+item.slug+'",'));
  const path='src/content/images/'+item.slug+'.json';
  assert.ok(existsSync(path),'missing image '+item.slug);
  const m=JSON.parse(readFileSync(path,'utf8'));
  assert.equal(m.archiveOnly,true);
  assert.equal(m.articleSlug,undefined);
  assert.equal(m.imageCaptureDate,'Not established');
  assert.equal(m.licence,'BSD 3-Clause');
  assert.equal(m.licenceDocumentPath,manifest.licenceLocal);
  assert.equal(m.sourceSnapshotCommit,manifest.commit);
  assert.equal(m.sourceGitBlobSha,item.gitBlobSha);
  assert.match(m.originalSha256,/^[a-f0-9]{64}$/);
  assert.ok(!chapter.includes("'"+item.slug+"'")&&!subjects.includes("'"+item.slug+"'"));
  for(const key of ['originalAssetPath','assetPath','thumbnailPath'])assert.ok(existsSync('public'+m[key]),m[key]);
 }
});
