import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

const dir='public/assets/historical';
const slug='pukeora-commercial-pine-plantation-2018';
const sourceUrl='https://commons.wikimedia.org/wiki/File:Pukeora_Forest.jpg';
const imageUrl='https://commons.wikimedia.org/wiki/Special:Redirect/file/Pukeora_Forest.jpg';
const dest=dir+'/original/'+slug+'.jpg';
const web=dir+'/web/'+slug+'.webp';
const card=dir+'/card/'+slug+'.webp';
const meta='src/content/images/'+slug+'.json';
await fs.mkdir(dir+'/original',{recursive:true});
await fs.mkdir(dir+'/web',{recursive:true});
await fs.mkdir(dir+'/card',{recursive:true});
let res=await fetch(imageUrl,{headers:{'User-Agent':'NZ-GIS-History-image-archiver/1.0 (source attribution: '+sourceUrl+')'}});
if(!res.ok)throw Error('Source image download HTTP '+res.status);
const data=Buffer.from(await res.arrayBuffer());
if(data.length<50000||data.length>18000000)throw Error('Unexpected original length '+data.length);
const info=await sharp(data).metadata();
if(info.format!=='jpeg'||info.width<900||info.height<650)throw Error('Unexpected original format or dimensions '+JSON.stringify(info));
const originalSha256=crypto.createHash('sha256').update(data).digest('hex');
const archive=await sharp(data).rotate().resize({width:1400,withoutEnlargement:true}).webp({quality:82,effort:5}).toBuffer();
const cardBytes=await sharp(data).rotate().resize({width:720,height:405,fit:'cover',position:'centre'}).webp({quality:83,effort:5}).toBuffer();
const webSha256=crypto.createHash('sha256').update(archive).digest('hex');
await Promise.all([fs.writeFile(dest,data),fs.writeFile(web,archive),fs.writeFile(card,cardBytes)]);
const record={
 id:'image:'+slug,slug,
 title:'Pukeora Forest commercial radiata-pine plantation, Hawke’s Bay (2018)',
 assetPath:'/assets/historical/web/'+slug+'.webp',
 sourceUrl,sourceName:'Wikimedia Commons',
 credit:'Mike Dickison / Giantflightlessbirds',
 licence:'CC BY-SA 3.0',
 licenceUrl:'https://creativecommons.org/licenses/by-sa/3.0/',
 altText:'Commercial Pinus radiata plantation at Pukeora Forest in Hawke’s Bay, New Zealand.',
 caption:'The remaining radiata-pine plantation at Pukeora Forest, Hawke’s Bay, photographed on 26 December 2018. Source: Mike Dickison, CC BY-SA 3.0. Used to illustrate plantation forestry; it does not depict an early New Zealand GIS installation.',
 themeIds:[],articleSlug:'forestry-finds-gis',chapterNumber:8,
 dateDisplay:'26 December 2018',
 context:'Contemporary real New Zealand commercial plantation scene; card illustration only, unrelated to the historical GIS hardware or survey described in the chapter.',
 originalAssetPath:'/assets/historical/original/'+slug+'.jpg',
 thumbnailPath:'/assets/historical/card/'+slug+'.webp',
 originalSha256,webSha256,
 originalWidth:info.width,originalHeight:info.height,sourceFileTitle:'File:Pukeora Forest.jpg',headerCandidate:false
};
await fs.writeFile(meta,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({slug,originalBytes:data.length,originalSha256,webSha256,width:info.width,height:info.height,sourceUrl},null,2));
