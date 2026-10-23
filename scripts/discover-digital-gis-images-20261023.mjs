/**
 * Public-source GIS image discovery inventory, for human / editorial selection.
 * Images are not made public by this script.
 */
import fs from 'node:fs/promises';
const sources=[
 ['Manaaki Whenua WMS in QGIS, ArcGIS and uDig','https://maps.scinfo.org.nz/using.html','open-source-changes-the-tools'],
 ['LINZ WMTS in QGIS','https://www.linz.govt.nz/guidance/data-service/linz-data-service-guide/map-tile-services/using-lds-wmts-qgis','the-spatial-infrastructure-idea'],
 ['LINZ Esri file geodatabase relationships','https://www.linz.govt.nz/guidance/data-service/linz-data-service-guide/data-and-schemas/building-relationships-esri-file-geodatabase','enterprise-gis'],
 ['LINZ basemap ArcGIS Online','https://basemaps.linz.govt.nz/docs/user-guide/use-in-esri-software/how-to-add-linz-aerial-imagery-basemaps-to-arcgis-online/','cloud-services-and-apis'],
 ['LINZ ArcGIS desktop basemap','https://basemaps.linz.govt.nz/docs/user-guide/use-in-esri-software/how-to-add-individual-linz-basemaps-layers-to-arcgis/','gis-comes-to-the-desktop'],
 ['LINZ API use with QGIS','https://www.linz.govt.nz/guidance/data-service/linz-basemaps-guide/how-use-linz-basemaps-apis','open-data-changes-access'],
 ['LINZ survey georeferencing','https://www.linz.govt.nz/guidance/landonline-support/survey-support/irregular-lines-and-right-lines/irregular-lines/import-georef-image','landonline'],
 ['Canterbury Maps use case Aurecon','https://canterburymaps.govt.nz/about/user-stories/aurecon/','councils-build-corporate-gis'],
 ['LEARNZ GIS predator control mapping','https://www.learnz.org.nz/hokonui222/discover/GIS','conservation-and-environment'],
 ['LEARNZ GIS outdoor tracks','https://learnz.org.nz/getoutdoors204/discover/adding-information-maps-gis','mapping-leaves-the-office'],
 ['Eco-index land cover GIS','https://eco-index.nz/understand','science-goes-spatial'],
 ['National Library future of maps 2016','https://natlib.govt.nz/blog/posts/the-future-of-maps','open-data-changes-access'],
 ['RNZ LINZ cartography 2016','https://www.rnz.co.nz/national/programmes/ourchangingworld/audio/201797240/points-lines-and-polygons-the-art-of-making-maps','topography-goes-digital'],
 ['Geospatial LiDAR Whanganui 2025','https://www.teaonews.co.nz/2025/02/14/how-whanganui-river-maori-helped-fill-gaps-in-critical-data/','lidar-remakes-the-landscape'],
 ['LINZ QGIS data importer','https://www.linz.govt.nz/guidance/data-service/linz-data-service-guide/linz-data-service-in-qgis','the-spatial-infrastructure-idea'],
 ['ArcGIS Pro NZ Golden Bay worked example','https://community.esri.com/t5/arcgis-pro-questions/how-to-create-a-mmpk-file/td-p/1019378','gis-comes-to-the-desktop'],
 ['QGIS New Zealand vector tile issue','https://github.com/qgis/QGIS/issues/47941','open-source-changes-the-tools'],
 ['LINZ geographic web service ArcGIS map','https://www.linz.govt.nz/guidance/data-service/linz-data-service-guide/map-tile-services/using-lds-wmts-arcgis-desktop','the-spatial-infrastructure-idea']
];
const commonsQueries=[
 '"ArcView" GIS screenshot New Zealand','"MapInfo" GIS map','"ArcGIS Pro" New Zealand map',
 '"QGIS" New Zealand GIS screenshot','"QGIS" New Zealand population density',
 '"2023 NZ Census Population Density','New Zealand land cover GIS map',
 'New Zealand earthquake hazard map GIS','New Zealand LiDAR hillshade DEM',
 'New Zealand bathymetry map GIS','New Zealand geology GIS map',
 'New Zealand sea level inundation map GIS','New Zealand catchment river GIS map',
 'New Zealand forest cover map GIS','New Zealand land use capability GIS map',
 'New Zealand wildlife conservation GIS map','New Zealand topographic digital GIS map'
];
const ua='NZGISHistory/1.0 (image research; https://history.pm4gis.nz)';
const report={collectedAt:new Date().toISOString(),sourcePages:[],commonsSearches:[],summary:{}};
const fetchText=async u=>{let last;for(let i=0;i<2;i++){const ct=new AbortController(),to=setTimeout(()=>ct.abort(),15000);try{let r=await fetch(u,{signal:ct.signal,headers:{'User-Agent':ua,'Accept':'text/html,application/json'}});if(!r.ok)throw Error('HTTP '+r.status);return await r.text()}catch(e){last=e;if(i===0)await new Promise(r=>setTimeout(r,750))}finally{clearTimeout(to)}}throw last};
const entities=s=>s.replaceAll('&amp;','&').replaceAll('&#39;',"'").replaceAll('&quot;','"').replaceAll('&nbsp;',' ');
const srcFrom=s=>s.match(/(?:^|\s)(?:src|data-src)\s*=\s*["']([^"'<>]+)["']/i)?.[1]||'';
const altFrom=s=>s.match(/(?:^|\s)alt\s*=\s*["']([^"'<>]*)["']/i)?.[1]||'';
for(const [label,url,chapter] of sources){
 try{
  const html=await fetchText(url),images=[...html.matchAll(/<img\b[^>]*>/gi)]
   .map(m=>({url:(()=>{try{return new URL(entities(srcFrom(m[0])),url).toString()}catch{return''}})(),alt:entities(altFrom(m[0])).trim()}))
   .filter(x=>/\.(png|jpg|jpeg|webp|gif)(?:[?#]|$)/i.test(x.url)&&!/(avatar|logo|favicon|social-icon|tracking|spinner|advert)/i.test(x.url))
   .filter((v,i,a)=>a.findIndex(x=>x.url===v.url)===i);
  report.sourcePages.push({label,url,chapter,images:images.slice(0,100),count:images.length});
 }catch(e){report.sourcePages.push({label,url,chapter,error:String(e.message||e),images:[],count:0})}
}
for(const query of commonsQueries){
 try{
  const url=new URL('https://commons.wikimedia.org/w/api.php');for(const [k,v]of Object.entries({action:'query',generator:'search',gsrsearch:query,gsrnamespace:'6',gsrlimit:'35',prop:'imageinfo',iiprop:'url|size|extmetadata|timestamp',iiurlwidth:'960',format:'json',formatversion:'2'}))url.searchParams.set(k,v);
  const response=JSON.parse(await fetchText(url));
  const files=(response.query?.pages||[]).map(p=>{
   const im=p.imageinfo?.[0]||{},meta=im.extmetadata||{};
   const clean=v=>String(v?.value||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,450);
   return {title:p.title,originalUrl:im.url,previewUrl:im.thumburl,
    width:im.width,height:im.height,mime:im.mime,uploaded:im.timestamp,
    date:clean(meta.DateTimeOriginal)||clean(meta.DateTime),
    description:clean(meta.ImageDescription),author:clean(meta.Artist),
    licence:clean(meta.LicenseShortName),licenceUrl:clean(meta.LicenseUrl),
    sourceUrl:'https://commons.wikimedia.org/wiki/'+encodeURIComponent(p.title.replaceAll(' ','_')).replaceAll('%3A',':')};
  }).filter(i=>i.originalUrl&&/\.(png|jpe?g|webp)(?:\?|$)/i.test(i.originalUrl||''));
  report.commonsSearches.push({query,files:files.slice(0,35),count:files.length});
 }catch(e){report.commonsSearches.push({query,error:String(e.message||e),files:[],count:0})}
}
report.summary={htmlSources:sources.length,htmlCandidates:report.sourcePages.reduce((s,v)=>s+v.count,0),
 commonsQueries:commonsQueries.length,commonsCandidates:report.commonsSearches.reduce((s,v)=>s+v.count,0),
 failures:[...report.sourcePages,...report.commonsSearches].filter(x=>x.error).length};
await fs.mkdir('docs/media',{recursive:true});
await fs.writeFile('docs/media/digital-gis-image-source-inventory-20261023.json',JSON.stringify(report,null,2)+'\n');
console.log('GIS research:',JSON.stringify(report.summary));
