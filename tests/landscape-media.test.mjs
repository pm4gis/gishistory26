import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {inspectLandscapeRegistry} from '../scripts/verify-landscapes.mjs';

test('empty image registry preserves the current text-first website', async () => {
  const root = mkdtempSync(join(tmpdir(),'nz-landscape-'));
  try { assert.deepEqual(await inspectLandscapeRegistry({version:1,images:[]},root), []); }
  finally { rmSync(root,{recursive:true,force:true}); }
});
test('unverified imagery and incorrect hashes cannot enter a build', async () => {
  const root = mkdtempSync(join(tmpdir(),'nz-landscape-'));
  try {
    const path=join(root,'landscapes'); mkdirSync(path);
    const bytes=await sharp({create:{width:64,height:36,channels:3,background:'#668877'}}).webp().toBuffer();
    writeFileSync(join(path,'one.webp'),bytes);
    const v={path:'/landscapes/one.webp',width:64,height:36,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};
    const image={id:'one',placement:'home-hero',rightsStatus:'pending',verifiedBy:'reviewer',verifiedOn:'2026-10-10',sourceLayerUrl:'https://data.linz.govt.nz/layer/example',licensor:'Council',evidenceUrl:'https://data.linz.govt.nz/layer/example',sourceImageSha256:'0'.repeat(64),licenceUrl:'https://creativecommons.org/licenses/by/4.0/',attribution:'Imagery: Council',altText:'Aerial landscape',variants:{card:v,feature:v,hero:v}};
    assert.ok((await inspectLandscapeRegistry({version:1,images:[image]},root)).some(x=>x.includes('only explicitly approved')));
    image.rightsStatus='approved';
    assert.deepEqual(await inspectLandscapeRegistry({version:1,images:[image]},root),[]);
    image.variants.hero={...v,sha256:'f'.repeat(64)};
    assert.ok(inspectLandscapeRegistry({version:1,images:[image]},root).some(x=>x.includes('checksum mismatch')));
  } finally {rmSync(root,{recursive:true,force:true});}
});
