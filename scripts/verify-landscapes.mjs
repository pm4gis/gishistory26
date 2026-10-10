import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {join, resolve, sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const required = ['id','placement','rightsStatus','verifiedBy','verifiedOn','sourceLayerUrl','licensor','licenceUrl','attribution','altText','evidenceUrl','sourceImageSha256'];
const variants = ['card','feature','hero'];
const safeUrl = u => typeof u === 'string' && /^https:\/\/[^\s]+$/i.test(u);
const validPath = p => typeof p === 'string' && p.startsWith('/landscapes/') && !p.includes('..') && !p.includes('\\');
export function inspectLandscapeRegistry(registry, publicDir) {
  const errors = [], seen = new Set(), paths = new Set();
  if (registry.version !== 1 || !Array.isArray(registry.images)) return ['Expected version 1 and an images array'];
  for (const image of registry.images) {
    for (const field of required) if (typeof image[field] !== 'string' || !image[field].trim()) errors.push((image.id || 'unnamed') + ': missing ' + field);
    if (image.rightsStatus !== 'approved') errors.push(image.id + ': only explicitly approved images belong in the public registry');
    if (!safeUrl(image.sourceLayerUrl) || !safeUrl(image.licenceUrl) || !safeUrl(image.evidenceUrl)) errors.push(image.id + ': missing verifiable HTTPS provenance/licence');
    if (!/^[a-z0-9][a-z0-9-]*$/.test(image.id) || !/^[a-f0-9]{64}$/.test(image.sourceImageSha256 || '')) errors.push((image.id || 'unnamed') + ': invalid source ID or original checksum');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(image.verifiedOn || '')) errors.push(image.id + ': invalid verification date');
    if (seen.has(image.placement)) errors.push(image.id + ': duplicate placement ' + image.placement);
    seen.add(image.placement);
    if (!image.variants || !variants.every(k => image.variants[k])) { errors.push(image.id + ': card/feature/hero variants required'); continue; }
    for (const variant of variants) {
      const v = image.variants[variant];
      if (!validPath(v.path) || !Number.isInteger(v.width) || v.width < 1 || !Number.isInteger(v.height) || v.height < 1 || !/^[a-f0-9]{64}$/.test(v.sha256 || '')) {
        errors.push(image.id + ': invalid ' + variant + ' metadata'); continue;
      }
      paths.add(v.path);
      const path = resolve(publicDir, '.' + v.path);
      if (!path.startsWith(resolve(publicDir) + sep) || !existsSync(path)) { errors.push(image.id + ': missing ' + v.path); continue; }
      const bytes = readFileSync(path);
      const hash = createHash('sha256').update(bytes).digest('hex');
      if (hash !== v.sha256) errors.push(image.id + ': checksum mismatch ' + v.path);
      if (v.bytes !== bytes.length) errors.push(image.id + ': byte mismatch ' + v.path);
      if (bytes.toString('ascii',0,4) !== 'RIFF' || bytes.toString('ascii',8,12) !== 'WEBP') errors.push(image.id + ': not a WebP ' + v.path);
    }
  }
  const dir = join(publicDir,'landscapes');
  const scan = p => {if (!existsSync(p)) return;for (const entry of readdirSync(p,{withFileTypes:true})) {const full=join(p,entry.name); if(entry.isDirectory()) scan(full); else if(entry.isFile() && !paths.has('/'+full.slice(publicDir.length+1).split(sep).join('/'))) errors.push('Unregistered publicly served landscape: ' + full);}};
  scan(dir);
  return errors;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = resolve(import.meta.dirname,'..');
  const registry = JSON.parse(readFileSync(join(root,'src/data/landscape-images.json'),'utf8'));
  const errors = inspectLandscapeRegistry(registry,join(root,'public'));
  if(errors.length) { for (const message of errors) console.error(message); process.exitCode=1; }
  else console.log('Landscape publication gate passed: '+registry.images.length+' approved placements');
}
