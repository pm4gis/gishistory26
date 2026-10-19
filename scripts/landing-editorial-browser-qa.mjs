import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321',dir='docs/verification/landing-editorial';mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox']});const results=[];
try{
 for(const width of [1440,1280,1024,768,390,320]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage();
  page.setDefaultTimeout(12000);const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(base+'/');await page.locator('.story-slider').waitFor();
  assert.ok((await page.locator('.hero .intro').innerText()).includes('Geographic information systems (GIS)'));
  assert.ok((await page.locator('.hero .eyebrow').textContent()).includes('31 December 2025'));
  const hero=await page.locator('.hero').boundingBox();console.log('Opening height',width,hero.height);await page.screenshot({path:dir+'/opening-'+width+'.png'});assert.ok(hero.height<490,'Opening too tall: '+width+' '+hero.height);
  if(width>=1024){const feature=await page.locator('#highlighted-stories').boundingBox();assert.ok(feature.y<700,'Stories should begin on the first screen');}
  assert.equal(await page.locator('.home-summary').count(),0);
  assert.equal(await page.locator('.story-teaser').count(),5);
  assert.ok((await page.locator('.story-teaser').allTextContents()).every(text=>text.length>90),'Every feature needs its edited teaser');
  const frame=await page.locator('.story-slider').boundingBox();
  const first=await page.locator('.highlight-card').first().boundingBox();assert.ok(Math.abs(first.width-frame.width)<5,'Feature should occupy one whole slide');
  for(let n=2;n<=5;n++){await page.locator('[data-story-next]').click();await page.waitForFunction(n=>document.querySelector('[data-story-status]').textContent===n+' of 5',n);}
  await page.locator('[data-story-next]').click();await page.waitForFunction(()=>document.querySelector('[data-story-status]').textContent==='1 of 5');
  await page.locator('[data-story-prev]').click();await page.waitForFunction(()=>document.querySelector('[data-story-status]').textContent==='5 of 5');
  await page.locator('.story-slider').focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('[data-story-status]').textContent==='1 of 5');
  await page.locator('[data-story-play]').click();assert.equal(await page.locator('[data-story-play]').getAttribute('aria-pressed'),'true');
  await page.locator('.story-slider').focus();assert.equal(await page.locator('[data-story-play]').getAttribute('aria-pressed'),'false');
  assert.equal(await page.locator('[data-hero-motion]').getAttribute('aria-label'),'Play background');
  assert.equal(await page.locator('#chapters .chapter-card').count(),6);
  assert.equal(await page.locator('#themes .art-card').count(),8);
  await page.locator('#chapters details summary').click();
  for(let n=1;n<=44;n++)assert.equal(await page.locator('#chapter-'+n).count(),1,'Preserve homepage chapter '+n);
  await page.locator('#chapters details summary').click();
  const themeBoxes=await page.locator('#themes .art-card').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().height));assert.ok(themeBoxes.every(h=>h<150),'Theme cards must stay compact');
  const chapterBoxes=await page.locator('#chapters .chapter-card').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().height));assert.ok(chapterBoxes.every(h=>h<165),'Chapter previews must stay compact');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Page overflow');
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  await page.goto(base+'/');await page.locator('main img').evaluateAll(nodes=>Promise.all(nodes.map(img=>{img.loading='eager';return img.decode().catch(()=>{})})));
  await page.screenshot({path:dir+'/home-'+width+'.png',fullPage:true});assert.deepEqual(errors,[]);
  results.push({width,passed:true,axeViolations:0,heroHeight:hero.height});console.log('PASS editorial landing layout, all slides, anchors and accessibility '+width);await context.close();
 }
 const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'no-preference'}),page=await context.newPage();
 await page.goto(base+'/');await page.locator('[data-story-next]').click();await page.waitForFunction(()=>document.querySelector('[data-story-status]').textContent==='2 of 5');
 assert.equal(await page.locator('[data-hero-motion]').getAttribute('aria-label'),'Pause background');await page.locator('[data-hero-motion]').click();assert.equal(await page.locator('[data-hero-motion]').getAttribute('aria-label'),'Play background');
 await context.close();results.push({case:'normal-motion slider and background pause',passed:true});
}finally{await browser.close();writeFileSync(dir+'/results.json',JSON.stringify(results,null,2)+'\n');}
