import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const slugs=['linz-qgis-data-importer-settings-2018','linz-qgis-data-importer-demo-2021'];
test('pre-2025 LINZ plugin screens have original BSD rights and archive-only decisions',()=>{
 const licence=readFileSync('public/assets/historical/licences/linz-data-importer-bsd-3-clause.txt','utf8');
 assert.match(licence,/Copyright 2018-2021 Toitū Te Whenua/);
 assert.match(licence,/Redistributions in binary form must reproduce/);
 const csv=readFileSync('docs/media/chapter-image-alignment-wave2-20261011.csv','utf8');
 const chapter=readFileSync('src/lib/chapter-media.mjs','utf8');
 const subjects=readFileSync('src/lib/subject-media.mjs','utf8');
 for(const slug of slugs){
  const file='src/content/images/'+slug+'.json';
  assert.ok(existsSync(file));
  const i=JSON.parse(readFileSync(file,'utf8'));
  assert.equal(i.archiveOnly,true);
  assert.equal(i.articleSlug,undefined);
  assert.equal(i.licence,'BSD 3-Clause');
  assert.equal(i.imageCaptureDate,'Not established');
  assert.match(i.sourceGitBlobSha,/^[a-f0-9]{40}$/);
  assert.match(i.originalSha256,/^[a-f0-9]{64}$/);
  assert.ok(csv.includes('"'+slug+'",'));
  assert.ok(!chapter.includes("'"+slug+"'")&&!subjects.includes("'"+slug+"'"));
  for(const key of ['originalAssetPath','thumbnailPath','assetPath','licenceDocumentPath'])assert.ok(existsSync('public'+i[key]),key);
 }
});
