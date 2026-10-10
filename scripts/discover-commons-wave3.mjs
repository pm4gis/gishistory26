import fs from 'node:fs/promises';
const queries=[
 'Landonline', 'Landonline New Zealand', 'NZ land resource inventory', 'land classification map NZ', 'NZ land use capability', 'land use capability New Zealand',
 'land suitability map new zealand', 'New Zealand desktop GIS', 'ArcView GIS', 'ARC INFO software', 'MAPPACK mapping', 'New Zealand geographical information systems', 'New Zealand GIS conference',
 'land information New Zealand map', 'LINZ spatial data', 'DOC New Zealand map', 'New Zealand Department of Conservation map',
 'University of Otago cartography', 'New Zealand geography lab', 'University of Canterbury GIS', 'New Zealand GIS research',
 'New Zealand GPS surveying', 'New Zealand GPS surveyors', 'GPS survey New Zealand', 'GNSS geodetic New Zealand',
 'New Zealand digital mapping screenshot', 'Google Earth New Zealand screenshot', 'Google Maps New Zealand',
 'New Zealand location analysis GIS', 'New Zealand public health map', 'New Zealand health deprivation map',
 'New Zealand Landcover database', 'Land Cover Database NZ', 'New Zealand openstreetmap tracing',
 'New Zealand API geospatial map', 'QGIS New Zealand screenshot', 'NZ digital elevation lidar', 'LiDAR Waitakere', 'LiDAR Wellington',
 'Kapiti LiDAR', 'New Zealand LiDAR map', 'lidar survey New Zealand', 'New Zealand drone orthophoto', 'New Zealand UAV survey',
 'drone aerial survey NZ', 'New Zealand 3d building GIS', 'Wellington city model',
 'NZ geological survey geological map', 'New Zealand climate change map', 'Sea level rise map New Zealand',
 'New Zealand electoral map', 'NZ Department of Statistics thematic map',
 'New Zealand GIS professionals', 'New Zealand geospatial conference', 'geospatial software New Zealand',
 'Waikato GIS', 'Dunedin geography department', 'New Zealand geology survey map'
];
async function query(q){
 const u=new URL('https://commons.wikimedia.org/w/api.php');
 Object.entries({action:'query',generator:'search',gsrsearch:q,gsrnamespace:'6',gsrlimit:'18',prop:'imageinfo',iiprop:'url|size|extmetadata',format:'json',formatversion:'2'}).forEach(([k,v])=>u.searchParams.set(k,v));
 try {
 const res=await fetch(u,{headers:{'User-Agent':'NZGISHistoryImageResearch/1.0 (https://history.pm4gis.nz)','Accept':'application/json'},signal:AbortSignal.timeout(17000)});
 if(!res.ok)throw Error('HTTP '+res.status);
 const json=await res.json();
 return{query:q,results:(json.query?.pages||[]).filter(p=>/\.(jpe?g|png)$/i.test(p.title)).map(p=>({title:p.title,sourceUrl:p.imageinfo?.[0]?.descriptionurl,width:p.imageinfo?.[0]?.width,height:p.imageinfo?.[0]?.height,bytes:p.imageinfo?.[0]?.size,license:p.imageinfo?.[0]?.extmetadata?.LicenseShortName?.value||'',artist:(p.imageinfo?.[0]?.extmetadata?.Artist?.value||'').replace(/<[^>]*>/g,'').slice(0,240),description:(p.imageinfo?.[0]?.extmetadata?.ImageDescription?.value||'').replace(/<[^>]*>/g,' ').slice(0,380)}))}
 }catch(e){return{query:q,error:String(e),results:[]}}
}
const all=[];
for(let i=0;i<queries.length;i+=4){all.push(...await Promise.all(queries.slice(i,i+4).map(query)));await new Promise(r=>setTimeout(r,150))}
const report={searchedAt:new Date().toISOString(),queryCount:queries.length,resultCount:all.reduce((x,a)=>x+a.results.length,0),queries:all};
await fs.mkdir('docs/media',{recursive:true});await fs.writeFile('docs/media/commons-discovery-wave3.json',JSON.stringify(report,null,2)+'\n');
console.log('Wave3 search',report.queryCount,'queries',report.resultCount,'results',all.filter(a=>a.error).length,'errors');
all.forEach(x=>console.log(x.query,x.results.length,x.results.slice(0,3).map(z=>z.title).join(' | ')));
