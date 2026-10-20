import assert from 'node:assert/strict';
import {setTimeout as delay} from 'node:timers/promises';
const base='https://history.pm4gis.nz';
const headings=new Map([
 ['landing-title','/read/'],['features-heading','/read/'],
 ['landscape-heading','/themes/imagery/'],['chapters-heading','/read/'],
 ['people-editorial-heading','/browse/?kind=Person'],['themes-heading','/themes/']
]);
const wallpapers=['karikari2','raglan1','taranaki1'].map(id=>'/decor/north2024-'+id+'-background.webp');
async function get(path){
 const response=await fetch(new URL(path,base),{signal:AbortSignal.timeout(20000),headers:{'Cache-Control':'no-cache'}});
 assert.equal(response.status,200,path+' HTTP response');
 return response;
}
let html;
for(let attempt=0;attempt<20;attempt++){
 try{
  const candidate=await (await get('/')).text();
  const actual=new Map([...candidate.matchAll(/<h[12]\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h[12]>/g)].map(m=>[m[1],m[2].match(/<a\b[^>]*href="([^"]+)"/)?.[1]]));
  for(const [id,href] of headings)assert.equal(actual.get(id),href,id+' destination');
  for(const path of wallpapers)assert.ok(candidate.includes(path),'Missing wallpaper '+path);
  html=candidate;break;
 }catch(error){
  if(attempt===19)throw error;
  console.log('Waiting for the homepage deployment, attempt '+(attempt+1));
  await delay(15000);
 }
}
assert.ok(html,'Homepage content was not read');
const statisticRegion=html.match(/class="landing-stats"[^>]*>([\s\S]*?)<\/div>/)?.[1]||'';
const statisticLinks=[...statisticRegion.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(statisticLinks,['/read/','/browse/?kind=Person','/timeline/']);
for(const path of wallpapers){
 const response=await get(path);assert.match(response.headers.get('content-type')||'',/image\/webp/);
 assert.ok((await response.arrayBuffer()).byteLength>1000,path+' image bytes');
 console.log('Verified wallpaper '+path);
}
for(const path of new Set(headings.values())){await get(path);console.log('Verified destination '+path);}
console.log('Production homepage verified: six linked headings, three statistic links and three self-hosted wallpaper images.');
