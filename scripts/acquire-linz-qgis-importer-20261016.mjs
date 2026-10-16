import {createHash} from 'node:crypto';
import {readFile,writeFile,readdir,mkdir,access} from 'node:fs/promises';
import sharp from 'sharp';

const commit='fff9011d63a921360dc0bcc65d5015268a1c33e8';
const source='https://raw.githubusercontent.com/linz/linz-data-importer/'+commit+'/';
const github='https://github.com/linz/linz-data-importer/blob/'+commit+'/';
const licencePath='/assets/historical/licences/linz-data-importer-bsd-3-clause.txt';
const items=[
 {slug:'linz-qgis-data-importer-settings-2018',file:'images/settings_example.png',blob:'a4f9aff65a31f6f301d6dc1ec704c99f99cf3438',size:58309,ext:'png',
 title:'LINZ Data Importer QGIS plugin settings, 2018',
 date:'Published in LINZ source repository by 13 November 2018; image capture date not established',
 alt:'LINZ Data Importer QGIS plugin settings screen with tabs for WFS, WMS and WMTS and two government data-service domains.',
 caption:'Original LINZ Data Importer settings screenshot documented in November 2018, showing example domain names and placeholder API keys.',
 context:'A real QGIS Data Importer plugin interface showing how users configured New Zealand government spatial data connections. It does not depict the launch of LINZ Data Service or QGIS. The original capture date is not independently established.'},
 {slug:'linz-qgis-data-importer-demo-2021',file:'images/import_example.gif',blob:'4324002b1f5415be12c41443de7530d30cdc8bd3',size:1384073,ext:'gif',
 title:'LINZ Data Importer QGIS plugin demonstration, 2021',
 date:'GitHub source updated for QGIS 3.16 on 21 June 2021; recording date not stated',
 alt:'Frame from LINZ Data Importer animated QGIS plugin demonstration of finding and importing spatial data.',
 caption:'LINZ Data Importer demonstration updated for QGIS 3.16 in June 2021. The original animated GIF is preserved, with a still frame used for the archive preview.',
 context:'A real LINZ project demonstration of interoperable New Zealand spatial data connections in QGIS. The archived source documentation confirms the 2021 update, not the date when each frame was first captured.'}
];
const hash=(kind,bytes)=>createHash(kind).update(bytes).digest('hex');
const licence=await readFile('public'+licencePath,'utf8');
if(!licence.includes('Copyright 2018-2021 Toitū Te Whenua/Land Information New Zealand')||!licence.includes('Redistributions in binary form must reproduce'))throw Error('Original 2021 BSD licence missing or changed');
const old=await Promise.all((await readdir('src/content/images')).filter(p=>p.endsWith('.json')).map(async f=>JSON.parse(await readFile('src/content/images/'+f,'utf8'))));
const existingSlugs=new Set(old.map(x=>x.slug)),existingHashes=new Set(old.map(x=>x.originalSha256).filter(Boolean));
const decisions=[];
for(const item of items){
 if(existingSlugs.has(item.slug)){console.log('Existing image, skipping safely: '+item.slug);continue}
 const url=source+item.file;
 const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(30000),headers:{'User-Agent':'NZGISHistoryResearchArchive/1.0'}});
 if(!r.ok)throw Error('Source failed: '+url+' HTTP '+r.status);
 const bytes=Buffer.from(await r.arrayBuffer());
 if(bytes.length!==item.size)throw Error('Source file changed '+item.slug);
 const git=hash('sha1',Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes]));
 if(git!==item.blob)throw Error('Source Git SHA mismatch '+item.slug);
 const sha=hash('sha256',bytes);
 if(existingHashes.has(sha))throw Error('Duplicate source original in archive: '+item.slug);
 const meta=await sharp(bytes,{page:0}).metadata();
 if(meta.format!==item.ext||meta.width<100||meta.height<100)throw Error('Invalid source image '+item.slug);
 const folder='public/assets/historical';
 const paths=[folder+'/original/'+item.slug+'.'+item.ext,folder+'/web/'+item.slug+'.webp',folder+'/card/'+item.slug+'.webp'];
 for(const p of paths)try{await access(p);throw Error('Refusing to replace an accepted original '+p)}catch(e){if(e.code!=='ENOENT')throw e}
 const web=await sharp(bytes,{page:0}).resize({width:1600,withoutEnlargement:true}).webp({quality:86}).toBuffer();
 const card=await sharp(bytes,{page:0}).resize({width:720,withoutEnlargement:true}).webp({quality:83}).toBuffer();
 for(const type of ['original','web','card'])await mkdir(folder+'/'+type,{recursive:true});
 await Promise.all([writeFile(paths[0],bytes),writeFile(paths[1],web),writeFile(paths[2],card)]);
 const image={
  id:'image:'+item.slug,slug:item.slug,title:item.title,
  assetPath:'/assets/historical/web/'+item.slug+'.webp',
  sourceUrl:github+item.file,sourceName:'Toitū Te Whenua Land Information New Zealand, original LINZ Data Importer project',
  credit:'Copyright 2018–2021 Toitū Te Whenua/Land Information New Zealand and the New Zealand Government. Published in original project documentation under BSD 3-Clause terms.',
  licence:'BSD 3-Clause',licenceUrl:github+'LICENCE',licenceEvidenceUrl:github+'LICENCE',licenceDocumentPath:licencePath,
  caption:item.caption,altText:item.alt,dateDisplay:item.date,imageCaptureDate:'Not established',
  context:item.context,themeIds:[],archiveOnly:true,headerCandidate:false,
  originalAssetPath:'/assets/historical/original/'+item.slug+'.'+item.ext,
  thumbnailPath:'/assets/historical/card/'+item.slug+'.webp',
  originalSha256:sha,webSha256:hash('sha256',web),thumbnailSha256:hash('sha256',card),
  originalWidth:meta.width,originalHeight:meta.height,
  sourceFileTitle:item.file,sourceOriginalUrl:url,sourceSnapshotCommit:commit,sourceGitBlobSha:git,
  archiveUrl:github+item.file,
  derivativesNote:item.ext==='gif'?'The animated original GIF is unchanged; a reduced uncropped first frame is used for WebP display and cards.':'The unchanged original PNG is preserved; uncropped WebP derivatives are reduced without upscaling.'
 };
 await writeFile('src/content/images/'+item.slug+'.json',JSON.stringify(image,null,2)+'\n');
 decisions.push(item);
 console.log(JSON.stringify({slug:item.slug,originalBytes:bytes.length,width:meta.width,height:meta.height,sha256:sha}));
}
let csv=await readFile('docs/media/chapter-image-alignment-wave2-20261011.csv','utf8');
const quote=v=>'"'+String(v||'').replaceAll('"','""')+'"';
for(const item of items){
 if(csv.includes('"'+item.slug+'",'))continue;
 const values=[item.slug,item.title,'linz-qgis-importer-2018-2021','','archive-only-for-chapters',
 'Held: verified LINZ GIS interface; paragraph association not yet reviewed','','','',
 item.date,github+item.file,'BSD 3-Clause',github+'LICENCE',
 'Official LINZ QGIS plugin original from immutable pre-2025 Git commit, with licensed source and full BSD notice retained. Actual screen capture date is not claimed. No placement until independent passage review.'];
 csv=csv.trimEnd()+'\r\n'+values.map(quote).join(',')+'\r\n';
}
await writeFile('docs/media/chapter-image-alignment-wave2-20261011.csv',csv);
let ledger=await readFile('docs/media/documentary-archive-ledger-20261016.md','utf8');
const marker='<!-- LINZ IMPORTER ACQUISITION PENDING -->';
if(ledger.includes(marker)){
 ledger=ledger.replace(marker,items.map(x=>'- '+x.slug+': immutable pre-2025 original, WebP derivatives and explicit archive-only decision acquired, Git SHA verified.').join('\n'));
 await writeFile('docs/media/documentary-archive-ledger-20261016.md',ledger);
}
