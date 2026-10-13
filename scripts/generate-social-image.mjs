import sharp from 'sharp';
import path from 'node:path';
import {mkdir,readFile} from 'node:fs/promises';

// This social image consists only of real, archived project image files.
// No coastline, map labels, contours, bathymetry or terrain are drawn by code.
const width=1200,height=630;
const output='public/assets/social/nzgis-verified-maps-20261013-v2.png';
const maps=[
 {record:'ongaonga-linz-topo50-2020.json',asset:'/assets/historical/web/ongaonga-linz-topo50-2020.webp',kind:'LINZ Topo50 Ongaonga 2020',x:887,y:24,w:292,h:282},
 {record:'gisborne-east-coast-luc-map-1967.json',asset:'/assets/historical/web/gisborne-east-coast-luc-map-1967.webp',kind:'Gisborne–East Coast LUC survey 1967',x:705,y:289,w:252,h:304},
 {record:'rotoiti-bathymetry-2021.json',asset:'/assets/historical/web/rotoiti-bathymetry-2021.webp',kind:'GNS Lake Rotoiti bathymetry 2021',x:946,y:321,w:247,h:132},
 {record:'retrolens-c515a148bd788efa.json',asset:'/assets/historical/web/retrolens-c515a148bd788efa.webp',kind:'Verdon College aerial 1946',x:966,y:460,w:227,h:150}
];
const bg=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="a" x2="1" y2="1"><stop stop-color="#111A29"/><stop offset=".65" stop-color="#1B283B"/><stop offset="1" stop-color="#253750"/></linearGradient><radialGradient id="b"><stop stop-color="#425B80" stop-opacity=".28"/><stop offset="1" stop-color="#1B283B" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="url(#a)"/><circle cx="1160" cy="300" r="570" fill="url(#b)"/><path d="M680 35V595" stroke="#6E849D" opacity=".3" stroke-width="2"/><path d="M68 419H615" stroke="#A2C6FF" opacity=".5" stroke-width="3"/></svg>');
const overlays=[{input:bg,top:0,left:0}];
for(const item of maps){
 const meta=JSON.parse(await readFile(path.join('src/content/images',item.record),'utf8'));
 if(meta.assetPath!==item.asset || !meta.sourceUrl || !meta.credit || !meta.dateDisplay){
  throw new Error('Unverified source record or changed asset for '+item.kind);
 }
 const source=path.join('public',meta.assetPath.replace(/^\/+/,'')); 
 const dimensions=await sharp(source).metadata();
 if(!dimensions.width || !dimensions.height)throw new Error('Invalid original map image: '+source);
 const paper=await sharp(source)
  .resize(item.w-12,item.h-12,{fit:'contain',background:'#F2F0EB',withoutEnlargement:true})
  .extend({top:6,bottom:6,left:6,right:6,background:'#F2F0EB'})
  .png().toBuffer();
 const frame=await sharp({create:{width:item.w,height:item.h,channels:4,background:'#F2F0EB'}})
  .composite([{input:paper,gravity:'center'}]).png().toBuffer();
 const shadow=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="'+item.w+'" height="'+item.h+'"><rect x="3" y="3" width="'+(item.w-4)+'" height="'+(item.h-4)+'" rx="2" fill="#000" opacity=".35"/></svg>');
 overlays.push({input:shadow,left:item.x,top:item.y});
 overlays.push({input:frame,left:item.x,top:item.y});
 console.log('Social preview source:',item.kind,'|',meta.sourceUrl);
}
const title=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><text x="67" y="234" font-family="DM Sans,DejaVu Sans,Arial,sans-serif" font-size="61" font-weight="700" letter-spacing="-1.5" fill="#E8EDF7">A history of <tspan fill="#A2C6FF">GIS</tspan></text><text x="67" y="317" font-family="DM Sans,DejaVu Sans,Arial,sans-serif" font-size="61" font-weight="700" letter-spacing="-1.5" fill="#E8EDF7">in New Zealand</text></svg>');
overlays.push({input:title,top:0,left:0});
await mkdir(path.dirname(output),{recursive:true});
const info=await sharp({create:{width,height,channels:4,background:'#111A29'}})
 .composite(overlays).png({compressionLevel:9,palette:false}).toFile(output);
if(info.width!==1200||info.height!==630)throw new Error('Social preview dimensions must be 1200 by 630');
console.log('Authentic-map social preview:',output,info.width+'x'+info.height,info.size+' bytes');
