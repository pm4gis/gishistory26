// Review public text across the entire NZ GIS History content tree.
// Only the repeated, factually empty image disclaimers are changed automatically.
// Other negative constructions are recorded for contextual editorial review.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve('.');
const folders = ['articles','passages','records','events','images','themes','relationships'];
const locations = folders.map(k => 'src/content/' + k);
const reportDir = 'docs/reviews';
fs.mkdirSync(reportDir, {recursive:true});
const date = '20261011';
const auditFile = reportDir + '/site-language-audit-' + date + '.md';
const detailsFile = reportDir + '/site-language-candidates-' + date + '.csv';
const fixes = [];
const candidates = [];
const stats = {};
const markers = [
 ['quoted-example', /It illustrates nationwide satellite coverage from the early 2000s, not a complete national time-series mosaic\./gi, 100],
 ['matters', /\bmatters\b/gi, 12],
 ['contrived-not', /\bnot (?:just|simply|merely|only|a|an)\b/gi, 9],
 ['not-rather', /\b(?:rather than|instead of)\b/gi, 5],
 ['no-longer', /\bno longer\b/gi, 4],
 ['does-not', /\b(?:does not|did not|is not|was not|were not)\b/gi, 4],
 ['it-illustrates', /\b(?:it|this) illustrates\b/gi, 9],
 ['AI-stock', /\b(?:crucial|pivotal|at its core|key takeaway|testament to|underscores|tapestry|landscape of possibility)\b/gi, 12],
 ['more-than', /\bmore than\b/gi, 4],
 ['generic-not', /\bnot\b/gi, 2],
];
function proseStrings(x, p='', list=[]) {
 if(typeof x==='string') {
   if(x.length>28 && !/^https?:\/\/|^\/|^image:|^person:|^entity:/i.test(x))list.push({key:p,text:x});
 } else if(Array.isArray(x)) {
   x.forEach((v,i)=>proseStrings(v,p+'['+i+']',list));
 } else if(x && typeof x==='object') {
   Object.entries(x).forEach(([k,v])=>{
     if(['sources','sourceNotes','paragraphSources','biographyParagraphSources','contentSections','photoGallery','relatedRecords'].includes(k) || /^(text|markdown|summary|description|caption|context|altText|title|label|basis|story|recollections|name|intro|credit|derivativesNote|stops|paragraphs)$/i.test(k)){
       proseStrings(v, p ? p+'.'+k:k, list);
     }
   });
 }
 return list;
}
function imageRewrite(s,field) {
 let value=s;
 // The specific satellite example confuses a dated scene with a survey of data products.
 value=value.replace(/\s*It illustrates nationwide satellite coverage from the early 2000s, not a complete national time-series mosaic\./gi,'');
 if(field==='caption' || field==='context'){
   value=value.replace(/\. This is remotely sensed imagery, not a photograph of GIS software\./gi,'.');
   value=value.replace(/; this image is historical or geographical context and is not evidence of a particular New Zealand GIS installation\./gi,'.');
   value=value.replace(/; it does not depict (?:the|a|an|any) [^.]+\./gi,'.');
   value=value.replace(/\. It does not depict (?:the|a|an|any) [^.]+\./gi,'.');
   value=value.replace(/\. This is not (?:an?|the) (?:example|illustration|photograph|image|screenshot) of [^.]+\./gi,'.');
 }
 return value.replace(/  +/g,' ').trim();
}
function rewriteDocument(obj,kind){
 if(kind!=='images'){
   function reviseExample(o) {
     if(typeof o==='string')return o.replace(/\s*It illustrates nationwide satellite coverage from the early 2000s, not a complete national time-series mosaic\./gi,'').trim();
     if(Array.isArray(o))return o.map(reviseExample);
     if(o&&typeof o==='object')for(const k of Object.keys(o)){
       if(['text','markdown','caption','context','description','summary'].includes(k))o[k]=reviseExample(o[k]);
     }
     return o;
   }
   return reviseExample(obj);
 }
 for(const k of ['caption','context'])if(typeof obj[k]==='string') obj[k]=imageRewrite(obj[k],k);
 return obj;
}
function csv(value){return '"'+String(value).replaceAll('"','""')+'"';}
for(const [idx,folder] of locations.entries()) {
 const kind=folders[idx];
 const entries=fs.readdirSync(folder).filter(f=>f.endsWith('.json')).sort();
 stats[kind]={files:entries.length,hits:0,changed:0};
 for(const name of entries){
   const file=folder+'/'+name;
   const raw=fs.readFileSync(file,'utf8');
   const doc=JSON.parse(raw);
   const before=proseStrings(doc);
   const seen=new Set();
   for(const item of before) {
     // Passages store identical sentences as text and markdown.
     const text=item.text;
     if(seen.has(text))continue;
     seen.add(text);
     const matched=[];
     for(const [label,re,weight] of markers){re.lastIndex=0; if(re.test(text)) matched.push({label,weight});}
     if(!matched.length)continue;
     stats[kind].hits++;
     const first=matched.sort((a,b)=>b.weight-a.weight);
     const sentences=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text];
     const example=sentences.find(s=>markers.some(([label,re])=>{re.lastIndex=0;return re.test(s);})) || text.slice(0,260);
     candidates.push({file,key:item.key,pattern:first.map(x=>x.label).join(';'),score:first.reduce((n,x)=>n+x.weight,0),excerpt:example.trim().replace(/\s+/g,' ').slice(0,340)});
   }
   const changed=rewriteDocument(doc,kind);
   const updated=JSON.stringify(changed,null,2)+'\n';
   if(updated!==raw){
     fs.writeFileSync(file,updated);
     fixes.push(file);
     stats[kind].changed++;
   }
 }
}
const otherFiles=['src/pages','src/components','src/layouts'];
for(const folder of otherFiles) {
 const list=fs.readdirSync(folder,{recursive:true,withFileTypes:true});
 let n=0;
 for(const entry of list) {
   if(!entry.isFile()||!/\.(astro|svelte)$/i.test(entry.name))continue;
   const fp=path.join(entry.parentPath,entry.name).replaceAll('\\','/');
   const str=fs.readFileSync(fp,'utf8');n++;
   for(const [label,re,weight] of markers){
     re.lastIndex=0;
     let m;
     while((m=re.exec(str))!==null){
       const a=Math.max(0,m.index-110), b=Math.min(str.length,m.index+150);
       candidates.push({file:fp,key:'page',pattern:label,score:weight,excerpt:str.slice(a,b).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()});
       if(m[0].length===0)break;
     }
   }
 }
 stats[folder]={files:n,hits:candidates.filter(c=>c.file.startsWith(folder+'/')).length,changed:0};
}
const manifest=JSON.parse(fs.readFileSync('content/preservation-manifest.json','utf8'));
for(const file of fixes)if(Object.hasOwn(manifest,file))manifest[file]=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
if(fixes.length)fs.writeFileSync('content/preservation-manifest.json',JSON.stringify(manifest,null,2)+'\n');
const counts=Object.fromEntries(Object.entries(stats).map(([k,v])=>[k,v.hits]));
const totals=Object.values(stats).reduce((x,v)=>({files:x.files+v.files,hits:x.hits+v.hits,changed:x.changed+v.changed}),{files:0,hits:0,changed:0});
const rows=candidates.map(x=>[x.file,x.key,x.pattern,x.score,x.excerpt].map(csv).join(','));
fs.writeFileSync(detailsFile,['file,key,patterns,priority,excerpt',...rows].join('\n')+'\n');
const lines=[
 '# Site-wide language audit, 11 October 2026','',
 'Scope: all article, passage, record, event, image, theme and relationship JSON, plus readable Astro/Svelte page templates. Checks recorded as editorial candidates, rather than proof that the historical prose is wrong. The word “not” may express an important factual distinction and must be reviewed in context.','',
 '## Coverage','',
 '| Collection | Files scanned | Candidate passages | Auto-corrected files |','| --- | ---: | ---: | ---: |',
 ...Object.entries(stats).map(([k,v])=>'| '+k+' | '+v.files+' | '+v.hits+' | '+v.changed+' |'),
 '| **Total** | **'+totals.files+'** | **'+totals.hits+'** | **'+totals.changed+'** |','',
 '## Applied corrections','',
 'Only empty image disclaimers and the exact unsupported satellite claim are removed automatically. Image provenance, licences, attribution and source links remain intact.',
 ...fixes.map(f=>'- '+f),'',
 '## Highest-priority passages','',
 'All candidates, including lower-priority hits, are in '+detailsFile+'. Repeated paragraph text/markdown is reported once. Source notes and source quotations are excluded from automatic rewriting.','',
 ...candidates.slice().sort((a,b)=>b.score-a.score).slice(0,300).map(x=>'- **'+x.file+'** ('+x.key+'; '+x.pattern+'): '+x.excerpt.replaceAll('|','/')),
 '',
 '## Release checks','',
 'Before release, review flagged sentences for factual accuracy, remove formulaic contrast, preserve material qualification, run content preservation and build tests, and confirm the production deployment.'
];
fs.writeFileSync(auditFile,lines.join('\n')+'\n');
console.log(JSON.stringify({totals,counts,candidates:candidates.length,filesChanged:fixes.length,report:auditFile,details:detailsFile},null,2));
