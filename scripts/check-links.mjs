import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
const files=walk(root).filter(p=>p.endsWith('.html'));
const redirects=new Map((fs.existsSync(root+'/_redirects')?fs.readFileSync(root+'/_redirects','utf8'):'').split('\n').filter(l=>l.trim()&&!l.startsWith('#')).map(l=>l.trim().split(/\s+/).slice(0,2)));
const cache=new Map();const issues=[];let checked=0;
const html=p=>{if(!cache.has(p))cache.set(p,fs.readFileSync(p,'utf8'));return cache.get(p)};
for(const file of files){
 const route='/'+path.relative(root,file).replace(/\\/g,'/').replace(/index\.html$/,'');
 for(const match of html(file).matchAll(/<(a|img)\b[^>]*?\b(href|src)=["']([^"']+)["']/g)){
  const value=match[3].replaceAll('&amp;','&');
  if(/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(value))continue;
  let url;try{url=new URL(value,'https://local.invalid'+route)}catch{issues.push({route,value,reason:'Invalid URL'});continue}
  let target=url.pathname;const seen=new Set();
  while(redirects.has(target)&&!seen.has(target)){seen.add(target);target=redirects.get(target)}
  let local=path.resolve(root,'.'+decodeURIComponent(target));
  if(!local.startsWith(root+path.sep)&&local!==root){issues.push({route,value,reason:'Outside build'});continue}
  if(fs.existsSync(local)&&fs.statSync(local).isDirectory())local=path.join(local,'index.html');
  else if(!fs.existsSync(local)&&!path.extname(local)&&fs.existsSync(local+'/index.html'))local+='/index.html';
  if(!fs.existsSync(local)){issues.push({route,value,reason:'Missing target'});continue}
  checked++;
  if(url.hash&&local.endsWith('.html')){
   let id;try{id=decodeURIComponent(url.hash.slice(1))}catch{issues.push({route,value,reason:'Invalid fragment'});continue}
   const ids=new Set([...html(local).matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]));
   if(!ids.has(id))issues.push({route,value,reason:'Missing fragment'});
  }
 }
}
const articles=new Map(fs.readdirSync('src/content/articles').filter(f=>f.endsWith('.json')).map(f=>{const a=JSON.parse(fs.readFileSync('src/content/articles/'+f));return [a.id,a]}));
for(const f of fs.readdirSync('src/content/passages').filter(f=>f.endsWith('.json'))){
 const p=JSON.parse(fs.readFileSync('src/content/passages/'+f));const a=articles.get(p.articleId);const file=path.join(root,a.url,'index.html');const ids=new Set([...html(file).matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]));
 for(const id of [p.slug,p.legacyAnchor,...(p.blocks||[]).map(b=>b.id)].filter(Boolean))if(!ids.has(id))issues.push({route:a.url,value:'#'+id,reason:'Original content anchor missing'});
}
fs.mkdirSync('docs/verification',{recursive:true});fs.writeFileSync('docs/verification/links.json',JSON.stringify({htmlPages:files.length,checked,issues},null,2)+'\n');
if(issues.length)throw Error('Internal link verification failed: '+JSON.stringify(issues.slice(0,30)));
console.log('Internal links passed: '+checked+' links across '+files.length+' pages');
