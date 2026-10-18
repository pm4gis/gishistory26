// Inspect the generated public HTML link graph from the canonical homepage.
// This is a technical discovery audit, not an estimate of Google indexing.
import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';

const site='https://history.pm4gis.nz';
const dist=resolve('dist');
const xml=readFileSync(join(dist,'sitemap.xml'),'utf8');
const paths=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(x=>new URL(x[1].replaceAll('&amp;','&')).pathname);
const all=new Set(paths);
const outgoing=new Map(),incoming=new Map(paths.map(p=>[p,new Set()]));
const files=new Map(paths.map(p=>[p,join(dist,p.slice(1),'index.html')]));
const detailCategories=new Set(['people','organisations','companies','datasets','stories','themes','images','documents','publications','sources']);
for(const p of paths){
  const file=files.get(p);
  if(!existsSync(file))continue;
  const text=readFileSync(file,'utf8');
  const links=new Set();
  for(const m of text.matchAll(/<a\b[^>]*?\bhref=["']([^"']+)["']/gi)){
    const href=m[1].replaceAll('&amp;','&');
    let dest;
    try{dest=new URL(href,site+p)}catch{continue}
    if(dest.origin!==site)continue;
    let t=dest.pathname;
    if(!t.endsWith('/')&&!t.includes('.',t.lastIndexOf('/')+1))t+='/';
    if(all.has(t)&&t!==p)links.add(t);
  }
  outgoing.set(p,links);
  for(const t of links)incoming.get(t).add(p);
}
const distances=new Map([['/',0]]);
const queue=['/'];
for(let i=0;i<queue.length;i++){
  const from=queue[i];
  for(const t of outgoing.get(from)||[]){
    if(distances.has(t))continue;
    distances.set(t,distances.get(from)+1);
    queue.push(t);
  }
}
const stats={},noInbound=[],unreachable=[],far=[];
for(const p of paths){
  const group=p.split('/').filter(Boolean)[0]||'home';
  const category=stats[group]??={total:0,unreachable:0,noInbound:0,maxDepth:0,deep:0};
  category.total++;
  const n=incoming.get(p)?.size||0,d=distances.get(p);
  if(n===0&&p!=='/'){category.noInbound++;noInbound.push(p)}
  if(d===undefined){category.unreachable++;unreachable.push(p)}
  else{category.maxDepth=Math.max(category.maxDepth,d);if(d>=5){category.deep++;far.push({p,depth:d})}}
}
const examples=(paths,n)=>paths.slice(0,n);
const essential=['/history/','/read/','/browse/','/timeline/','/publications/','/about/'];
const coreUnreachable=essential.filter(p=>!distances.has(p));
const report={
  checkedAt:'build',
  method:'Follow ordinary <a href> links in statically generated HTML, starting at /; no JavaScript execution',
  sitemapEntries:paths.length,
  reachableFromHome:distances.size,
  unreachable:unreachable.length,
  noInbound:noInbound.length,
  depthFiveOrMore:far.length,
  maxClickDepth:Math.max(...distances.values()),
  byCategory:stats,
  sampleUnreachable:examples(unreachable,60),
  sampleWithoutInbound:examples(noInbound,60),
  farthestPages:far.sort((a,b)=>b.depth-a.depth).slice(0,30),
  coreUnreachable
};
mkdirSync('docs/verification',{recursive:true});
writeFileSync('docs/verification/seo-internal-discovery.json',JSON.stringify(report,null,2)+'\n');
console.log('HTML crawl discovery: '+paths.length+' sitemap pages, '+distances.size+
 ' homepage-reachable, '+unreachable.length+' unreachable, '+noInbound.length+' without inbound links, depth max '+report.maxClickDepth);
console.log('Discovery by category: '+JSON.stringify(stats));
if(coreUnreachable.length)throw Error('Main site routes are unreachable via HTML links: '+coreUnreachable.join(', '));
