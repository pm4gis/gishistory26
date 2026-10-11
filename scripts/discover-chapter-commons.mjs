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
const summaryPath=process.argv[4]||outputPath.replace('commons-discovery-','commons-candidates-');
const imageFiles=(await fs.readdir('src/content/images')).filter(name=>name.endsWith('.json'));
const existingImages=await Promise.all(imageFiles.map(async name=>JSON.parse(await fs.readFile('src/content/images/'+name,'utf8'))));
const normalTitle=value=>clean(value).replace(/^File:/i,'').replaceAll('_',' ').toLowerCase();
const existingTitles=new Set(existingImages.map(image=>normalTitle(image.sourceFileTitle||'')).filter(Boolean));
const stop=new Set('new zealand the a an and for of in by after from to on at with into map maps image imagery data gis using from'.split(' '));
const words=value=>clean(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(word=>word.length>2&&!stop.has(word));
const years=value=>[...String(value||'').matchAll(/\b(18\d{2}|19\d{2}|20\d{2})\b/g)].map(match=>Number(match[1]));
const allowed=licence=>/^(?:CC0|Public domain(?: \(.*\))?|CC BY(?:-SA)? \d+(?:\.\d+)?(?: [a-z]+)?)$/i.test(String(licence||'').trim());
const preliminary=[];
for(const item of queries){
 for(const result of item.results||[]){
  if(result.width<400||result.height<300||result.bytes>2*1024*1024||!allowed(result.licence))continue;
  if(!result.sourceUrl||!result.originalUrl||existingTitles.has(normalTitle(result.title)))continue;
  const subjectText=[result.title,result.dateOriginal,result.dateProperty,result.objectName,result.description].join(' ');
  if(years(subjectText).some(year=>year>2025))continue;
  const evidenceOptions=[['DateTimeOriginal',result.dateOriginal],['Date',result.dateProperty],['ObjectName',result.objectName],['ImageDescription',result.description]];
  const evidence=evidenceOptions.find(([,value])=>years(value).length);
  if(!evidence)continue;
  const subjectYear=Math.max(...years(evidence[1]));
  const queryWords=words(item.query);
  const titleWords=new Set(words(result.title+' '+result.objectName));
  const descriptionWords=new Set(words(result.description));
  const matches=queryWords.filter(word=>titleWords.has(word)||descriptionWords.has(word));
  const score=matches.reduce((total,word)=>total+(titleWords.has(word)?2:1),0);
  if(score<2)continue;
  preliminary.push({
   chapter:item.chapter,articleSlug:item.articleSlug,passageSlug:item.passageSlug,passageTitle:item.passageTitle,query:item.query,
   title:result.title,sourceUrl:result.sourceUrl,originalUrl:result.originalUrl,width:result.width,height:result.height,bytes:result.bytes,
   licence:result.licence,licenceUrl:result.licenceUrl,artist:result.artist,credit:result.credit,
   dateEvidenceField:evidence[0],dateEvidenceValue:evidence[1],subjectDateEnd:String(subjectYear)+'-12-31',
   description:clean(result.description).slice(0,900),objectName:result.objectName,score,matchedTerms:matches
  });
 }
}
preliminary.sort((a,b)=>b.score-a.score||a.chapter-b.chapter||a.title.localeCompare(b.title));
const picked=[],seenTitles=new Set(),chapterCounts=new Map();
for(const candidate of preliminary){
 const title=normalTitle(candidate.title);
 const count=chapterCounts.get(candidate.chapter)||0;
 if(seenTitles.has(title)||count>=20)continue;
 seenTitles.add(title);chapterCounts.set(candidate.chapter,count+1);picked.push(candidate);
}
const candidateReport={searchedAt:report.searchedAt,subjectDateCutoff:cutoff,queryCount:plan.length,rawResultCount:report.resultCount,existingImageCount:existingImages.length,candidateCount:picked.length,candidates:picked};
await fs.writeFile(summaryPath,JSON.stringify(candidateReport,null,2)+'\n');
console.log('Screened candidates:',candidateReport.candidateCount,'after date, licence, size, duplicate and passage-query checks.');
console.log('Date-limited chapter discovery:',report.queryCount,'queries,',report.resultCount,'results,',queries.filter(q=>q.error).length,'errors.');
for(const q of queries.filter(q=>q.error))console.log('ERROR',q.chapter,q.query,q.error);
