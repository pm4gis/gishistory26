/**
 * Archive 3 original 2015 LINZ TileMill layer previews, not article figures.
 * Bytes are fetched from the immutable 2016-11-09 source repository snapshot.
 * Reject any byte changes, unexpected formats, duplicate slugs or prior assets.
 */
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,access,readdir} from 'node:fs/promises';
import sharp from 'sharp';

const commit='6e1bb61b47d8e357def869c994e9c827ade0b13d';
const root='public/assets/historical';
const licenceUrl='https://creativecommons.org/licenses/by/3.0/nz/';
const licenceEvidence='https://github.com/linz/linz_basemaps/blob/'+commit+'/README.md#licensing';
const items=[
 {slug:'linz-geodetic-marks-layer-2015',path:'SupportingLayers/GeodeticMarks/.thumb.png',gitBlob:'e87207f457e8bbd68bd99265e2f9f37d95b02968',firstCommitted:'25 May 2015',title:'LINZ TileMill geodetic marks layer preview (2015)',subject:'geodetic-mark symbol layer',alt:'Small historical LINZ TileMill map-layer preview for geodetic marks.',caption:'An original thumbnail for the LINZ geodetic marks supporting layer in the 2015 New Zealand terrain basemap reconstruction project.'},
 {slug:'linz-motorways-layer-2015',path:'SupportingLayers/Motorways/.thumb.png',gitBlob:'214d43f49bddfb186fdd885c8752bed6d1036356',firstCommitted:'30 January 2015',title:'LINZ TileMill motorways layer preview (2015)',subject:'motorway mapping layer',alt:'Small historical LINZ TileMill map-layer preview for motorways.',caption:'An original thumbnail for the motorways supporting layer in LINZ’s 2015 terrain basemap reconstruction project.'},
 {slug:'linz-parcel-wireframe-layer-2015',path:'SupportingLayers/Parcel_WireFrame/.thumb.png',gitBlob:'19bf1984d8a47a122b69ca4981005848917db7c0',firstCommitted:'18 February 2015',title:'LINZ TileMill cadastral parcel layer preview (2015)',subject:'cadastral parcel wireframe layer',alt:'Small historical LINZ TileMill map-layer preview for parcel boundary linework.',caption:'An original thumbnail for the cadastral parcel wireframe supporting layer in LINZ’s 2015 terrain basemap reconstruction project.'}
];
const sha256=b=>createHash('sha256').update(b).digest('hex');
const errors=[];
const existing=new Set((await readdir('src/content/images')).filter(x=>x.endsWith('.json')).map(x=>x.slice(0,-5)));
for(const item of items){
 if(existing.has(item.slug)){ // No rewrite of previously published entries.
  console.log('Already archived: '+item.slug);
  continue;
 }
 const remote='https://raw.githubusercontent.com/linz/linz_basemaps/'+commit+'/'+item.path;
 const r=await fetch(remote,{redirect:'error',signal:AbortSignal.timeout(30000),headers:{'User-Agent':'NZGISHistoryArchive/1.0'}});
 if(!r.ok)throw Error('Source not available '+item.slug+' HTTP '+r.status);
 const bytes=Buffer.from(await r.arrayBuffer());
 if(bytes.length<1000||bytes.length>200000)throw Error('Implausible original bytes for '+item.slug+': '+bytes.length);
 const gitSha=createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
 if(gitSha!==item.gitBlob)throw Error('Source Git blob changed for '+item.slug+'; got '+gitSha);
 const meta=await sharp(bytes).metadata();
 if(meta.format!=='png'||!meta.width||!meta.height||meta.width<32||meta.height<32)throw Error('Not a valid map PNG: '+item.slug);
 const base=root+'/original/'+item.slug+'.png';
 const webFile=root+'/web/'+item.slug+'.webp';
 const cardFile=root+'/card/'+item.slug+'.webp';
 for(const f of [base,webFile,cardFile]){try{await access(f);throw Error('Existing asset must never be overwritten: '+f)}catch(e){if(e.code!=='ENOENT')throw e}}
 for(const kind of ['original','web','card'])await mkdir(root+'/'+kind,{recursive:true});
 const web=await sharp(bytes).resize({width:1600,withoutEnlargement:true}).webp({quality:86,effort:5}).toBuffer();
 const card=await sharp(bytes).resize({width:720,withoutEnlargement:true}).webp({quality:84,effort:5}).toBuffer();
 const sourcePage='https://github.com/linz/linz_basemaps/blob/'+commit+'/'+item.path;
 const record={
  id:'image:'+item.slug,slug:item.slug,title:item.title,
  assetPath:'/assets/historical/web/'+item.slug+'.webp',
  sourceUrl:sourcePage,sourceName:'Land Information New Zealand (LINZ), 2015 TileMill supporting-layer project',
  credit:'Crown copyright, Land Information New Zealand and New Zealand Government. Original LINZ TileMill map-layer thumbnail from the project’s 2015 Git history; locally resized WebP derivatives.',
  licence:'Creative Commons Attribution 3.0 New Zealand',licenceUrl,licenceEvidenceUrl:licenceEvidence,
  altText:item.alt,caption:item.caption,themeIds:[],
  dateDisplay:'First recorded in LINZ Git history by '+item.firstCommitted+'; rendering/capture date not stated',
  sourcePublicationDate:'2015 (repository change history)',
  imageCaptureDate:'Not established',
  originalPublicationEvidence:'https://github.com/linz/linz_basemaps/commits/'+commit+'/'+item.path,
  context:'This is a genuine original GIS map-layer preview for the '+item.subject+' in LINZ’s TileMill-based national terrain basemap project. It documents a 2015 GIS publishing workflow. It is not a full map export, a standalone GIS application screenshot, or proof of an earlier launch. Archive-only until a separate, paragraph-level placement review.',
  originalAssetPath:'/assets/historical/original/'+item.slug+'.png',
  thumbnailPath:'/assets/historical/card/'+item.slug+'.webp',
  originalSha256:sha256(bytes),webSha256:sha256(web),thumbnailSha256:sha256(card),
  originalWidth:meta.width,originalHeight:meta.height,
  sourceFileTitle:item.path,sourceOriginalUrl:remote,
  sourceGitBlobSha:gitSha,sourceSnapshotCommit:commit,archiveUrl:sourcePage,
  derivativesNote:'Original .thumb.png bytes preserved unchanged at the original path. Display and card files are WebP conversions without upscaling or cropping. Source Git blob SHA-1 and local SHA-256 recorded.',
  archiveOnly:true,headerCandidate:false
 };
 await writeFile(base,bytes);await writeFile(webFile,web);await writeFile(cardFile,card);
 await writeFile('src/content/images/'+item.slug+'.json',JSON.stringify(record,null,2)+'\n');
 existing.add(item.slug);
 console.log(JSON.stringify({slug:item.slug,bytes:bytes.length,width:meta.width,height:meta.height,sha256:record.originalSha256,source:sourcePage}));
}
const ledger='docs/media/documentary-archive-ledger-20261016.md';
let note=await readFile(ledger,'utf8');
if(note.includes('<!-- AUTO-ACQUISITION: PENDING -->')){
 const lines=items.map(i=>'- '+i.slug+' (LINZ 2015; original and two WebP derivatives; image metadata generated with checked SHA-1 and SHA-256)').join('\n');
 note=note.replace('<!-- AUTO-ACQUISITION: PENDING -->','Acquired in GitHub Actions, source files checked against pinned Git blobs:\n'+lines);
 await writeFile(ledger,note);
}
