import {readFileSync, mkdirSync, copyFileSync, writeFileSync, existsSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {createHash} from 'node:crypto';
import {inspectLandscapeRegistry} from './verify-landscapes.mjs';

// Usage: node scripts/install-landscapes.mjs <processing-manifest.json> <approved-selections.json> [--apply]
// No images are published without an explicit approved selection and verified source record.
const [sourceFile, selectionsFile, flag] = process.argv.slice(2);
if (!sourceFile || !selectionsFile) throw Error('Supply the complete processed image manifest and the reviewed approval file');
if (flag && flag !== '--apply') throw Error('Only --apply is supported');
const sourcePath = resolve(sourceFile);
const source = JSON.parse(readFileSync(sourcePath,'utf8'));
const selections = JSON.parse(readFileSync(resolve(selectionsFile),'utf8'));
if (!Array.isArray(source.images) || !Array.isArray(selections.images)) throw Error('Source and approvals need image arrays');
const required = ['sourceId','placement','licensor','licenceUrl','sourceLayerUrl','attribution','altText','verifiedBy','verifiedOn','evidenceUrl'];
const https = v => typeof v === 'string' && /^https:\/\/[^\s]+$/.test(v);
const seen = new Set(), staged = [], images = [];
for (const approval of selections.images) {
  const id = approval.sourceId;
  if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(id)) throw Error('Unsafe source ID');
  if (approval.rightsStatus !== 'approved' || required.some(k => !approval[k] || typeof approval[k] !== 'string')) throw Error(id+': missing signed-off permission or attribution evidence');
  if (!https(approval.evidenceUrl) || !https(approval.licenceUrl) || !https(approval.sourceLayerUrl)) throw Error(id+': verified HTTPS evidence links required');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(approval.verifiedOn)) throw Error(id+': review date must be YYYY-MM-DD');
  if (seen.has(approval.placement)) throw Error('Duplicate placement '+approval.placement);
  seen.add(approval.placement);
  const original = source.images.find(image => image.id === id);
  if (!original) throw Error('Unknown source image: '+id);
  const variants = {};
  for (const role of ['card','feature','hero']) {
    const item = original.variants?.[role];
    if (!item?.path?.startsWith('assets/') || item.path.includes('..')) throw Error('Invalid source derivative: '+id+' '+role);
    const from = resolve(dirname(sourcePath),item.path);
    if (!from.startsWith(dirname(sourcePath)+'/') || !existsSync(from)) throw Error('Missing derivative '+from);
    const bytes = readFileSync(from);
    if (createHash('sha256').update(bytes).digest('hex') !== item.sha256 || bytes.length !== item.bytes) throw Error('Derivative failed hash/byte verification: '+from);
    const dest = '/landscapes/'+id+'-'+role+'.webp';
    variants[role] = {path:dest,width:item.width,height:item.height,sha256:item.sha256,bytes:item.bytes};
    staged.push({from,dest});
  }
  images.push({
    id, placement:approval.placement, rightsStatus:'approved',
    licensor:approval.licensor, licenceUrl:approval.licenceUrl, sourceLayerUrl:approval.sourceLayerUrl,
    attribution:approval.attribution, altText:approval.altText, verifiedBy:approval.verifiedBy, verifiedOn:approval.verifiedOn,
    evidenceUrl:approval.evidenceUrl, sourceImageSha256:original.original_sha256, variants
  });
}
const root = resolve(import.meta.dirname,'..');
const publicDir = join(root,'public');
const target = join(root,'src/data/landscape-images.json');
const proposed = {version:1,sourcePackage:'NZ_GIS_History_Landscape_Web_Assets_2026-10-10.zip',images};
console.log('Verified '+images.length+' placements and '+staged.length+' derivatives. '+(flag==='--apply'?'Applying':'Dry run only'));
if (flag === '--apply') {
  if (existsSync(join(publicDir,'landscapes')) && readFileSync(target,'utf8').includes('"images": [') && JSON.parse(readFileSync(target,'utf8')).images.length) {
    throw Error('Existing approved publication: reconcile before replacing images');
  }
  for (const {from,dest} of staged) {
    const output = join(publicDir,'.'+dest);
    mkdirSync(dirname(output),{recursive:true});
    copyFileSync(from,output);
  }
  const errors = inspectLandscapeRegistry(proposed,publicDir);
  if (errors.length) throw Error('Publication gate failed: '+errors.join('; '));
  writeFileSync(target,JSON.stringify(proposed,null,2)+'\n');
  console.log('Assets copied and approved registry updated. Run npm test and npm run build before commit.');
}
