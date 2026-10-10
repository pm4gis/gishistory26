import fs from 'node:fs/promises';
const queries=[
 'New Zealand map grid coordinates',
 'New Zealand map surveying triangulation',
 'New Zealand cadastral map survey',
 'New Zealand surveyor theodolite',
 'New Zealand computer 1960 map',
 'New Zealand computer cartography',
 'New Zealand 1980s topographical mapping',
 'NZMS 260 New Zealand map',
 'NZMS 1 map survey',
 'New Zealand Land Resource Inventory',
 'NZLRI New Zealand land',
 'New Zealand forestry thematic map',
 'New Zealand wilding conifers map',
 'New Zealand landsat 1970',
 'New Zealand satellite imagery 1977',
 'New Zealand Esri GIS conference',
 'New Zealand university mapping laboratory',
 'New Zealand university cartography',
 'New Zealand Landonline survey',
 'New Zealand LINZ Data Service',
 'New Zealand GNSS survey station',
 'New Zealand geodetic marker',
 'New Zealand property parcel boundaries',
 'New Zealand roads traffic mapping',
 'New Zealand territorial authorities mapping',
 'New Zealand lidar elevation',
 'New Zealand airborne LiDAR',
 'New Zealand drone survey orthomosaic',
 'New Zealand conservation biodiversity map',
 'New Zealand DOC protected area map',
 'New Zealand geospatial open data',
 'New Zealand emergency map earthquake',
 'New Zealand tsunami hazard map',
 'New Zealand geologic fault map',
 'New Zealand water supply network map',
 'New Zealand railway system map',
 'New Zealand census meshblock map',
 'New Zealand QGIS choropleth',
 'New Zealand satellite radar Kaikoura'
];
async function get(q) {
 const url=new URL('https://commons.wikimedia.org/w/api.php');
 for(const [k,v] of Object.entries({action:'query',generator:'search',gsrsearch:q,gsrnamespace:'6',gsrlimit:'12',prop:'imageinfo',iiprop:'url|size|extmetadata',format:'json',formatversion:'2'}))url.searchParams.set(k,v);
 try {
 const resp=await fetch(url,{headers:{'User-Agent':'NZGISHistoryImageResearch/1.0 (https://history.pm4gis.nz/about/)','Accept':'application/json'},signal:AbortSignal.timeout(20000)});
 if(!resp.ok)throw Error('HTTP '+resp.status);
 const obj=await resp.json();
 return {query:q,results:(obj.query?.pages||[]).filter(p=>/\.(png|jpe?g|tif|svg)$/i.test(p.title)).map(p=>({title:p.title,url:p.imageinfo?.[0]?.descriptionurl||'https://commons.wikimedia.org/wiki/'+p.title.replaceAll(' ','_'),width:p.imageinfo?.[0]?.width,height:p.imageinfo?.[0]?.height,size:p.imageinfo?.[0]?.size,mime:p.imageinfo?.[0]?.mime,licence:p.imageinfo?.[0]?.extmetadata?.LicenseShortName?.value||'',artist:(p.imageinfo?.[0]?.extmetadata?.Artist?.value||'').replace(/<[^>]+>/g,'').slice(0,300),description:(p.imageinfo?.[0]?.extmetadata?.ImageDescription?.value||'').replace(/<[^>]+>/g,' ').slice(0,350)}))};
 }catch(e){return {query:q,error:String(e),results:[]}}
}
const all=[];
for(let i=0;i<queries.length;i+=3){all.push(...await Promise.all(queries.slice(i,i+3).map(get)));await new Promise(r=>setTimeout(r,300));}
const out={preparedAt:new Date().toISOString(),queries:all,total:all.reduce((n,a)=>n+a.results.length,0)};
await fs.writeFile('docs/media/commons-discovery-wave2.json',JSON.stringify(out,null,2)+'\n');
console.log('Results',out.total,'Errors',all.filter(x=>x.error).map(x=>x.query+': '+x.error));
for(const x of all)console.log(x.query, x.results.length, x.results.slice(0,3).map(r=>r.title).join(' | '));
