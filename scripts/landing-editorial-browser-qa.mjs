import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321',dir='docs/verification/landing-editorial';mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox']});const results=[];
try{
 for(const width of [1440,1280,1181,1024,768,390,320]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(15000);
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(base+'/');await page.locator('main img').evaluateAll(nodes=>Promise.all(nodes.map(img=>{img.loading='eager';return img.decode()})));
  assert.match(await page.locator('h1').innerText(),/A history of GIS\s+in New Zealand/);
  assert.equal(await page.locator('main [href="/history/"]').count(),0);
  assert.equal(await page.locator('[data-story-play],[data-story-next],[data-hero-motion],.story-slider,.home-summary').count(),0);
  assert.equal(await page.locator('main .card,main .art-card').count(),0);
  const hero=page.locator('.landing-image img');assert.match(await hero.getAttribute('src'),/nasa-landsat4-tasman-1990/);
  assert.ok(await hero.evaluate(img=>img.naturalWidth>=1400&&getComputedStyle(img).objectFit==='cover'));
  assert.equal(await page.locator('.landing-stats>span').count(),5);assert.match(await page.locator('[data-build-stat="files"]').innerText(),/\d/);assert.match(await page.locator('[data-build-stat="links"]').innerText(),/\d/);
  assert.match(await page.locator('.history-endpoint').innerText(),/31 December 2025/);
  assert.equal(await page.locator('.chapter-preview a').count(),6);assert.equal(await page.locator('#themes nav a').count(),8);
  await page.locator('.all-chapters summary').click();for(let n=1;n<=44;n++)assert.equal(await page.locator('#chapter-'+n).count(),1);
  await page.locator('.all-chapters summary').click();
  for(const figure of ['.map-artefact','.computer-feature figure']){
   const href=await page.locator(figure+' > a').getAttribute('href');await page.locator(figure+' > a').focus();await page.keyboard.press('Enter');await page.waitForURL(url=>url.pathname===href);assert.equal(await page.locator('h1').count(),1);await page.goBack();
  }
  const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2);assert.ok(noOverflow,width+' page overflow');
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],width+' accessibility');
  await page.locator('main img').evaluateAll(nodes=>Promise.all(nodes.map(img=>{img.loading='eager';return img.decode()})));
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:dir+'/home-'+width+'.png',fullPage:true});assert.deepEqual(errors,[]);results.push({width,passed:true,axeViolations:0});console.log('PASS approved landing composition, image links, chapters and accessibility '+width);await context.close();
 }
 const context=await browser.newContext({viewport:{width:1280,height:900}}),page=await context.newPage();
 await page.goto(base+'/browse/?kind=Person');await page.waitForFunction(()=>document.querySelector('.subject-browse-card')?.textContent?.includes('Person'));
 assert.ok(await page.locator('.subject-browse-card').count()>0);const people=await page.locator('.subject-browse-card>small').allTextContents();assert.ok(people.every(t=>t==='Person'));
 await page.goto(base+'/browse/?kind=Organisation&kind=Agency&kind=Business&kind=Council&kind=Community');await page.waitForFunction(()=>document.querySelector('[aria-pressed="true"]'));
 assert.ok(await page.locator('.subject-browse-card').count()>0);assert.ok((await page.locator('.subject-browse-card>small').allTextContents()).every(t=>['Organisation','Agency','Business','Council','Community'].includes(t)));
 await page.goto(base+'/');await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));await context.close();
 const noJS=await browser.newContext({viewport:{width:1280,height:900},javaScriptEnabled:false});const plain=await noJS.newPage();await plain.goto(base+'/');assert.equal(await plain.locator('.chapter-preview a').count(),6);assert.equal(await plain.locator('.landing-image img').count(),1);await noJS.close();
 results.push({case:'filtered navigation destinations, text resize and no-JavaScript reading',passed:true});
}finally{await browser.close();writeFileSync(dir+'/results.json',JSON.stringify(results,null,2)+'\n');}
