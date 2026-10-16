import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
const names=['linz-geodetic-marks-layer-2015','linz-motorways-layer-2015','linz-parcel-wireframe-layer-2015'];
test('2015 LINZ basemap previews are source-checked archive entries without story placement',()=>{
 const mediaSource=readFileSync('src/lib/chapter-media.mjs','utf8');
 const subjectSource=readFileSync('src/lib/subject-media.mjs','utf8');
 const storyData=readdirSync('src/content/passages').filter(f=>f.endsWith('.json')).map(f=>readFileSync('src/content/passages/'+f,'utf8')).join('\n');
 for(const slug of names){
  const file='src/content/images/'+slug+'.json';
  assert.ok(existsSync(file),'missing archive record '+slug);
  const m=JSON.parse(readFileSync(file,'utf8'));
  assert.equal(m.slug,slug);
  assert.equal(m.archiveOnly,true);
  assert.equal(m.articleSlug,undefined);
  assert.match(m.dateDisplay,/2015/);
  assert.match(m.imageCaptureDate,/Not established/);
  assert.match(m.sourceSnapshotCommit,/^[a-f0-9]{40}$/);
  assert.match(m.sourceGitBlobSha,/^[a-f0-9]{40}$/);
  assert.match(m.originalSha256,/^[a-f0-9]{64}$/);
  assert.ok(m.licenceEvidenceUrl.includes('/README.md#licensing'));
  for(const k of ['originalAssetPath','assetPath','thumbnailPath'])assert.ok(existsSync('public'+m[k]),m[k]);
  assert.ok(!mediaSource.includes("'"+slug+"'"),'premature chapter placement');
  assert.ok(!subjectSource.includes("'"+slug+"'"),'premature catalogue placement');
  assert.ok(!storyData.includes('image:'+slug),'premature story figure placement');
 }
});
