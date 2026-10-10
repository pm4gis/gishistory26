import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const target='transforming-one-coordinate-world-into-another-2ab91fbc4f';
const link='https://history.pm4gis.nz/stories/coordinates-enter-the-computer/#'+target;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const cases=[];
async function check(name,run){try{await run();cases.push({name,passed:true});console.log('PASS '+name)}catch(e){cases.push({name,passed:false,reason:String(e)});console.error('FAIL '+name+' '+e);process.exitCode=1}}
async function noHorizontalOverflow(page,name){
 const sizes=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,view:window.innerWidth}));
 assert.ok(sizes.actual<=sizes.view+2,name+' horizontal overflow '+JSON.stringify(sizes));
}
try{
 for(const view of [{width:1440,height:900,name:'desktop'},{width:390,height:844,name:'mobile'}]){
  const page=await browser.newPage({viewport:{width:view.width,height:view.height},reducedMotion:'reduce'});
  const selector='section#'+target;
  await check(view.name+' full chapter contribution',async()=>{
   await page.goto(base+'/stories/coordinates-enter-the-computer/#'+target,{waitUntil:'domcontentloaded'});
   const btn=page.locator(selector+' .passage-contribute');await btn.waitFor({timeout:25000});
   const href=await btn.getAttribute('href');assert.ok(href?.startsWith('mailto:pm4gis@gmail.com'));
   const mail=new URL(href);assert.ok(mail.searchParams.get('subject')?.startsWith('NZ GIS History Contributions and Corrections'));
   assert.ok(mail.searchParams.get('subject')?.includes('Transforming one coordinate world into another'))
   const body=mail.searchParams.get('body')||'';
   for(const field of ['Link to passage: '+link,'Chapter: Survey calculations','Passage: Transforming one coordinate world into another','What dates, sources','credit your name','permission to share'])assert.ok(body.includes(field),field);
   await noHorizontalOverflow(page,view.name+' reader');
  });
  await check(view.name+' page-by-page contribution',async()=>{
   await page.goto(base+'/stories/coordinates-enter-the-computer/?mode=page#'+target,{waitUntil:'domcontentloaded'});
   await page.locator(selector+' .passage-contribute').waitFor({timeout:25000});
   const href=await page.locator(selector+' .passage-contribute').getAttribute('href');
   assert.ok(new URL(href).searchParams.get('body')?.includes(link));
   await noHorizontalOverflow(page,view.name+' page mode');
  });
  await check(view.name+' inline video and wider reader',async()=>{
   await page.goto(base+'/stories/the-map-becomes-an-application/',{waitUntil:'domcontentloaded'});
   const clips=page.locator('section#practical-maori-web-mapping-23fcc809db .wananga-videos--inline .wananga-video-card');
   await clips.first().waitFor({timeout:25000});
   assert.ok((await clips.count())>=3,'expected three related inline video records');
   const region=page.locator('section#practical-maori-web-mapping-23fcc809db');
   const sourceOrder=await region.evaluate(el=>[...el.querySelectorAll('.wananga-videos--inline,.passage-actions')].map(x=>x.classList.contains('wananga-videos--inline')?'video':'actions'));
   assert.equal(sourceOrder[0],'video');assert.equal(sourceOrder.at(-1),'actions');
   await noHorizontalOverflow(page,view.name+' videos');
   if(view.name==='desktop'){const width=(await page.locator('.page').boundingBox())?.width;assert.ok(width&&width>760,'reading column should exceed legacy 760px at 1440px: '+width)}
  });
  await check(view.name+' archive search, filter, related reading and provenance',async()=>{
   await page.goto(base+'/nga-poutama-videos/',{waitUntil:'domcontentloaded'});
   const cards=page.locator('.wananga-video-card');await cards.first().waitFor({timeout:25000});
   assert.equal(await cards.count(),16);
   assert.ok(await page.locator('.wananga-video-card a[href^="/stories/"]').count()>=1,'related passage links absent');
   await page.locator('#wananga-video-query').fill('StoryMaps');
   assert.ok(await cards.count()>=1&&await cards.count()<16,'search must narrow results');
   await page.locator('#wananga-video-query').fill('');
   await page.getByRole('button',{name:'Coastal and marine data'}).click();
   assert.equal(await cards.count(),1);
   await noHorizontalOverflow(page,view.name+' archive');
  });
  await page.close();
 }
 const page=await browser.newPage();
 await check('Māori GIS theme and organisation feature four videos and link to full archive',async()=>{
  for(const route of ['/themes/maori-gis/','/entities/nga-poutama-matawhenua/']){
   await page.goto(base+route,{waitUntil:'domcontentloaded'});
   await page.locator('.wananga-video-card').first().waitFor({timeout:25000});
   assert.equal(await page.locator('.wananga-video-card').count(),16);
   assert.ok(await page.locator('a[href="/nga-poutama-videos/"]').count()>=1);
  }
 });
 await check('People profiles have no new portrait',async()=>{
  await page.goto(base+'/people/duane-wilkins/',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('.subject-media').count(),0);
 });
 await page.close();
}finally{await browser.close()}
console.log(JSON.stringify({passed:cases.filter(c=>c.passed).length,failed:cases.filter(c=>!c.passed).length,tests:cases},null,2));
