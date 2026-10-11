import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const chapter='/stories/the-first-web-maps/';
const source='https://proceedings.esri.com/library/userconf/proc03/p1048.pdf#page=19';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let passed=0;
try {
 for(const view of [{width:1440,height:900,name:'desktop'},{width:390,height:844,name:'mobile'}]){
  const page=await browser.newPage({viewport:{width:view.width,height:view.height},reducedMotion:'reduce'});
  for(const mode of ['full','page']){
   const href=chapter+(mode==='page'?'?mode=page#arcims-inside-government-77a201a83c':'');
   await page.goto(base+href,{waitUntil:'domcontentloaded'});
   const section=page.locator('section#arcims-inside-government-77a201a83c');
   await section.waitFor({timeout:20000});
   const exhibit=section.locator('aside.period-interface-source');
   assert.equal(await exhibit.count(),1,'One original interface link '+view.name+' '+mode);
   assert.ok((await exhibit.innerText()).includes('DOCgis'));
   assert.ok((await exhibit.innerText()).includes('reproduce it on this site has not been confirmed'));
   const a=exhibit.locator('a');
   assert.equal(await a.getAttribute('href'),source);
   assert.equal(await a.getAttribute('target'),'_blank');
   assert.equal(await a.getAttribute('rel'),'noopener noreferrer');
   const order=await section.evaluate(node=>{const p=node.querySelector('#ch30-s09-p01');const evidence=node.querySelector('.period-interface-source');return Boolean(p && evidence && (p.compareDocumentPosition(evidence)&Node.DOCUMENT_POSITION_FOLLOWING));});
   assert.ok(order,'Source link must follow actual historical paragraph');
   const screen=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(screen.scroll<=screen.viewport+2,'Horizontal overflow '+JSON.stringify(screen));
   passed++;console.log('PASS '+view.name+' '+mode+' original DOCgis publisher link');
  }
  await page.goto(base+chapter,{waitUntil:'domcontentloaded'});
  assert.ok(await page.locator('a[href="/images/nz-libraries-wikidata-osm-2019/"]').count()>=1,'Existing dated 2019 documentary image disappeared');
  await page.close();
 }
}finally {await browser.close()}
assert.equal(passed,4);
console.log('Verified '+passed+' desktop/mobile full/page reading routes and publisher reference');
