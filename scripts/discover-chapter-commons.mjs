import fs from 'node:fs/promises';

const cutoff='2025-12-31';
const planPath=process.argv[2]||'docs/media/chapter-image-search-plan-wave4-2025.json';
const outputPath=process.argv[3]||'docs/media/commons-discovery-wave4-2025.json';
const plan=JSON.parse(await fs.readFile(planPath,'utf8'));
const clean=value=>String(value||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#([0-9]+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/\s+/g,' ').trim();
function extValue(meta,key){return clean(meta?.[key]?.value||'')}
async function query(item){
 const url=new URL('https://commons.wikimedia.org/w/api.php');
 for(const [k,v] of Object.entries({action:'query',generator:'search',gsrsearch:item.query,gsrnamespace:'6',gsrlimit:'20',prop:'imageinfo',iiprop:'url|size|extmetadata',format:'json',formatversion:'2'}))url.searchParams.set(k,v);
 let last;
 for(let attempt=0;attempt<3;attempt++){
  try{
   const response=await fetch(url,{headers:{'User-Agent':'NZGISHistoryImageResearch/1.0 (https://history.pm4gis.nz/about/)','Accept':'application/json'},signal:AbortSignal.timeout(25000)});
   if(!response.ok)throw new Error('HTTP '+response.status);
   const json=await response.json();
   const results=(json.query?.pages||[]).filter(p=>/\.(jpe?g|png)$/i.test(p.title)).map(p=>{
    const i=p.imageinfo?.[0]||{},m=i.extmetadata||{};
    return {
     title:p.title,sourceUrl:i.descriptionurl||'',originalUrl:i.url||'',width:i.width||0,height:i.height||0,bytes:i.size||0,mime:i.mime||'',
     licence:extValue(m,'LicenseShortName'),licenceUrl:extValue(m,'LicenseUrl'),artist:extValue(m,'Artist'),
     credit:extValue(m,'Credit'),dateOriginal:extValue(m,'DateTimeOriginal'),dateProperty:extValue(m,'Date'),
     objectName:extValue(m,'ObjectName'),description:extValue(m,'ImageDescription'),uploadDate:extValue(m,'DateTime')
    };
   });
   return {...item,results};
  }catch(error){last=error;await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)))}
 }
 return {...item,error:String(last?.message||last),results:[]};
}
const queries=[];
for(let i=0;i<plan.length;i+=3){
 queries.push(...await Promise.all(plan.slice(i,i+3).map(query)));
 await new Promise(resolve=>setTimeout(resolve,250));
}
const report={searchedAt:new Date().toISOString(),subjectDateCutoff:cutoff,queryCount:plan.length,resultCount:queries.reduce((n,q)=>n+q.results.length,0),queries};
await fs.writeFile(outputPath,JSON.stringify(report,null,2)+'\n');
console.log('Date-limited chapter discovery:',report.queryCount,'queries,',report.resultCount,'results,',queries.filter(q=>q.error).length,'errors.');
for(const q of queries.filter(q=>q.error))console.log('ERROR',q.chapter,q.query,q.error);
