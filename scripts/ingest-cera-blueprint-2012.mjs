/**
 * One-shot archival ingestion of an explicitly licensed, original CERA map.
 * Run in GitHub Actions; commit originals and derivatives only after checks.
 * The historical prose and all existing images remain unchanged.
 */
import {createHash} from 'node:crypto';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import sharp from 'sharp';

const slug='cera-central-recovery-blueprint-2012';
const file='Christchurch-central-recovery-plan-anchor-project-map-a3-1_(cropped).jpg';
const digest=createHash('md5').update(file).digest('hex');
const originalUrl='https://upload.wikimedia.org/wikipedia/commons/'+digest[0]+'/'+digest.slice(0,2)+'/'+encodeURIComponent(file);
const expectedMd5='1653f47af6554182942f23626ed98103483d52e7';
const expectedBytes=117683;
const response=await fetch(originalUrl,{headers:{'User-Agent':'NZGISHistoryDocumentaryResearch/1.0 (pm4gis@gmail.com)'}});
if(!response.ok)throw Error('CERA source image unavailable HTTP '+response.status+' '+originalUrl);
const header=response.headers.get('content-type')||'';
if(!/^image\/jpeg(?:;|$)/i.test(header))throw Error('Unexpected CERA source content type: '+header);
const data=Buffer.from(await response.arrayBuffer());
if(data.length!==expectedBytes)throw Error('Source byte count changed: '+data.length);
const md5=createHash('md5').update(data).digest('hex');
if(md5!==expectedMd5)throw Error('Source differs from verified Commons checksum: '+md5);
const metadata=await sharp(data).metadata();
if(metadata.width!==1891||metadata.height!==1330||metadata.format!=='jpeg')throw Error('CERA map dimensions changed');
const dir='public/assets/historical';
for(const kind of ['original','web','card'])await mkdir(dir+'/'+kind,{recursive:true});
await writeFile(dir+'/original/'+slug+'.jpg',data);
const web=await sharp(data).resize({width:1600,withoutEnlargement:true}).webp({quality:86,effort:5}).toBuffer();
const card=await sharp(data).resize({width:720,withoutEnlargement:true}).webp({quality:84,effort:5}).toBuffer();
await writeFile(dir+'/web/'+slug+'.webp',web);
await writeFile(dir+'/card/'+slug+'.webp',card);
const sha=buffer=>createHash('sha256').update(buffer).digest('hex');
const sourcePage='https://commons.wikimedia.org/wiki/File:Christchurch-central-recovery-plan-anchor-project-map-a3-1_(cropped).jpg';
const record={
 id:'image:'+slug,slug,
 title:'Christchurch Central Recovery Plan anchor projects map, July 2012',
 assetPath:'/assets/historical/web/'+slug+'.webp',
 sourceUrl:sourcePage,
 sourceName:'Wikimedia Commons; original Canterbury Earthquake Recovery Authority document',
 credit:'Canterbury Earthquake Recovery Authority (July 2012). Extracted and cropped on Wikimedia Commons by Schwede66 (2020). Local display derivatives resized without further cropping.',
 licence:'CC BY 4.0',
 licenceUrl:'https://creativecommons.org/licenses/by/4.0/',
 licenceEvidenceUrl:sourcePage,
 altText:'Original CERA map of central Christchurch showing 2012 recovery anchor projects and coloured precincts with labelled streets and facilities.',
 caption:'July 2012 Christchurch Central Recovery Plan map depicting anchor projects including the Convention Centre, Health Precinct, central library and other recovery zones.',
 dateDisplay:'July 2012',
 themeIds:[],
 context:'Original map prepared by CERA for its Christchurch Central Recovery Plan, illustrating post-earthquake spatial planning. It is distinct from the CERA Spatial Data Infrastructure service diagrams and parcel/technical-zoning viewers.',
 originalAssetPath:'/assets/historical/original/'+slug+'.jpg',
 thumbnailPath:'/assets/historical/card/'+slug+'.webp',
 originalSha256:sha(data),webSha256:sha(web),
 originalWidth:metadata.width,originalHeight:metadata.height,
 sourceFileTitle:'File:'+file,
 sourceOriginalUrl:originalUrl,
 derivativesNote:'The Wikimedia Commons image is itself an extract cropped from a July 2012 CERA map. Its archive original is preserved verbatim. Local WebP display and card images are resized without further cropping.',
 relatedRecords:[{name:'Canterbury Earthquake Recovery Authority (CERA)',url:'/entities/canterbury-earthquake-recovery-authority-cera/',role:'Produced the original 2012 map'}],
 headerCandidate:false
};
await writeFile('src/content/images/'+slug+'.json',JSON.stringify(record,null,2)+'\n');
const path='src/lib/subject-media.mjs';
let src=await readFile(path,'utf8');
const start=src.indexOf("    'canterbury-earthquake-recovery-authority-cera': {slug:'christchurch-response-orthophoto-2011'");
if(start<0)throw Error('Unexpected original CERA image binding. No edits committed.');
const end=src.indexOf('\n',start);
const replacement="    'canterbury-earthquake-recovery-authority-cera': {slug:'"+slug+"',relation:'A genuine CERA-produced July 2012 Christchurch Central Recovery Plan map showing designated anchor-project precincts. This is a spatial planning output, not a screenshot of the CERA data-sharing platform or technical land-zoning system.'},";
src=src.slice(0,start)+replacement+src.slice(end);
await writeFile(path,src);
console.log(JSON.stringify({slug,originalUrl,originalSha256:sha(data),webSha256:sha(web),originalSize:data.length,webBytes:web.length,cardBytes:card.length},null,2));
