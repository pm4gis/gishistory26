import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

const folder='public/assets/historical';
const slugs=['linz-2013-terrain-natural-colour-preview','linz-2013-north-island-natural-colour-bathymetry'];
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
for(const place of ['web','card'])await fs.mkdir(folder+'/'+place,{recursive:true});
for(const slug of slugs){
 const recordPath='src/content/images/'+slug+'.json';
 const image=JSON.parse(await fs.readFile(recordPath,'utf8'));
 const inputPath='public'+image.originalAssetPath;
 const source=await fs.readFile(inputPath);
 const blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+source.length+'\0'),source])).digest('hex');
 if(blob!==image.sourceGitBlobSha)throw Error('LINZ original changed '+slug+' '+blob);
 const data=await sharp(source).metadata();
 if(!data.width||!data.height||data.width>20000||data.height>20000)throw Error('Invalid image dimensions '+slug);
 const originalSha256=sha(source);
 const web=await sharp(source).rotate().resize({width:1400,withoutEnlargement:true}).webp({quality:88,effort:4}).toBuffer();
 const card=await sharp(source).rotate().resize({width:720,height:405,fit:'contain',background:'#1B2934'}).webp({quality:87,effort:4}).toBuffer();
 const display='/assets/historical/web/'+slug+'.webp';
 const thumbnail='/assets/historical/card/'+slug+'.webp';
 await fs.writeFile('public'+display,web);
 await fs.writeFile('public'+thumbnail,card);
 Object.assign(image,{assetPath:display,thumbnailPath:thumbnail,originalWidth:data.width,originalHeight:data.height,originalSha256,webSha256:sha(web)});
 await fs.writeFile(recordPath,JSON.stringify(image,null,2)+'\n');
 console.log(JSON.stringify({slug,blob,originalSha256,webSha256:image.webSha256,width:data.width,height:data.height}));
}

/* These two existing biographies were explicitly edited for this source-checked
 * release. Update only their preservation-manifest digests; never recompute
 * unrelated entries or soften preservation validation. */
const manifestPath='content/preservation-manifest.json';
const baseline=JSON.parse(await fs.readFile(manifestPath,'utf8'));
for(const p of ['src/content/records/geographx.json','src/content/records/roger-smith.json']){
 if(typeof baseline[p]!=='string')throw Error('Missing protected source '+p);
 baseline[p]=sha(await fs.readFile(p));
 console.log('Reviewed biography preservation checksum '+p+' '+baseline[p]);
}
await fs.writeFile(manifestPath,JSON.stringify(baseline,null,2)+'\n');
