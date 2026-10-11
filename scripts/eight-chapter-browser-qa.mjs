import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {chapterArchiveReuses} from '../src/lib/chapter-media.mjs';

const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const scenarios=[
 ...Object.entries(chapterArchiveReuses).flatMap(([story,links])=>links.map(link=>({
   story, slug:link.slug, paragraph:link.afterParagraphId, snippet:link.caption.slice(0,32)
 }))),
 {story:'the-first-web-maps',slug:'nz-libraries-wikidata-osm-2019',paragraph:'ch30-p-aedbf2d5def6',
  snippet:'A 2019 New Zealand library map'}
];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let passed=0;
try {
 for(const view of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
  const page=await browser.newPage({viewport:{width:view.width,height:view.height},reducedMotion:'reduce'});
  for(const item of scenarios){
   const route='/stories/'+item.story+'/';
   await page.goto(base+route,{waitUntil:'domcontentloaded'});
   const root=page.locator('.narrative');
   await root.waitFor({timeout:25000});
   const figure=page.locator('p[id="'+item.paragraph+'"] + figure.passage-illustration');
   await figure.waitFor({timeout:25000});
   const link=figure.locator('a[href="/images/'+item.slug+'/"]');
   assert.ok((await link.count())>=2,view.name+' '+item.story+' image and caption link to their own record');
   assert.ok((await figure.locator('figcaption').innerText()).includes(item.snippet),item.story+' caption provenance');
   const image=figure.locator('img');
   await image.evaluate(async img=>{if(!img.complete)await new Promise((resolve,reject)=>{
     img.addEventListener('load',resolve,{once:true});img.addEventListener('error',()=>reject(new Error('Image load failure')),{once:true});
   });});
   const result=await image.evaluate(img=>({ok:img.complete&&img.naturalWidth>0,width:img.naturalWidth,height:img.naturalHeight}));
   assert.ok(result.ok,'Broken image '+item.slug+' '+JSON.stringify(result));
   const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(sizes.scroll<=sizes.viewport+2,'Horizontal overflow '+item.story+' '+JSON.stringify(sizes));
   await page.goto(base+'/images/'+item.slug+'/',{waitUntil:'domcontentloaded'});
   const credit=page.locator('.image-source-card');
   await credit.waitFor({timeout:15000});
   assert.ok((await credit.innerText()).includes('Licence'),'No image licence '+item.slug);
   passed++;console.log('PASS '+view.name+' '+route+' '+item.slug+' '+result.width+'x'+result.height);
  }
  await page.close();
 }
}finally {await browser.close()}
assert.equal(passed,scenarios.length*2);
console.log('Verified '+passed+' desktop/mobile paragraph-image/source associations');
