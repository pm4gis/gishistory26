import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const cases=[
 {story:'mapping-land-as-data',slug:'nz-agricultural-landuse-capability-2022',anchor:'ch07-s05-p04'},
 {story:'automating-the-gis-work',slug:'nz-coastal-classification-workflow-2022',anchor:'ch43-s11-p01'},
 {story:'gis-at-the-end-of-2025',slug:'nz-wetlands-ml-national-2025',anchor:'ch44-s03-p04'}
];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let passed=0;
try {
 for(const screen of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
  const page=await browser.newPage({viewport:{width:screen.width,height:screen.height},reducedMotion:'reduce'});
  for(const item of cases){
   await page.goto(base+'/stories/'+item.story+'/',{waitUntil:'domcontentloaded'});
   const figure=page.locator('p[id="'+item.anchor+'"] + figure.passage-illustration');
   await figure.waitFor({timeout:20000});
   const figureHref='/images/'+item.slug+'/';
   assert.ok(await figure.locator('a[href="'+figureHref+'"]').count()>=2,'Image+caption source links missing '+item.slug);
   const img=figure.locator('img');
   await img.scrollIntoViewIfNeeded();
   await img.evaluate(async el=>{if(!el.complete)await new Promise((resolve,reject)=>{
      el.addEventListener('load',resolve,{once:true});el.addEventListener('error',()=>reject(Error('Broken web image')),{once:true});
   });});
   assert.ok(await img.evaluate(el=>el.complete&&el.naturalWidth>500),'Missing/invalid uncropped display '+item.slug);
   const dim=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,limit:innerWidth}));
   assert.ok(dim.actual<=dim.limit+2,'Horizontal overflow '+JSON.stringify(dim));
   await page.goto(base+figureHref,{waitUntil:'domcontentloaded'});
   await page.locator('.image-source-card').waitFor({timeout:20000});
   const body=await page.locator('.image-source-card').innerText();
   assert.ok(body.includes('CC BY 4.0'),'Licensing absent '+item.slug);
   assert.ok(await page.locator('a[href^="https://www.mdpi.com/"]').count()>=1,'Original publisher missing '+item.slug);
   passed++;
   console.log('PASS '+screen.name+' '+item.story+' '+item.slug);
  }
  await page.close();
 }
}finally {await browser.close()}
assert.equal(passed,6);
console.log('Checked '+passed+' desktop/mobile image placements and source records');
