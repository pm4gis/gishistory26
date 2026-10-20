import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const dir='docs/verification/first-visit';mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox']});const results=[];
try{
 for(const width of [1440,1280,768,390,320]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(20000);
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  for(const route of ['/','/history/','/read/','/browse/','/timeline/','/network/','/publications/','/search/','/contribute/']){
   await page.goto(base+route);await page.waitForTimeout(150);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),width+' '+route+' overflow');
   const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   results.push({width,route,violations:audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});
   assert.equal(audit.violations.length,0,width+' '+route+' accessibility '+JSON.stringify(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))));
  }
  await page.goto(base+'/');assert.equal(await page.locator('.landing-primary').getAttribute('href'),'/read/');
  await page.locator('.landing-primary').click();await page.locator('.chapter-catalogue-card').first().waitFor();assert.equal(await page.locator('.chapter-catalogue-card').count(),44);await page.locator('.chapter-catalogue-card').first().click();await page.locator('h1').waitFor();
  await page.goto(base+'/search/?q=Landonline');await page.locator('.pagefind-ui__result').first().waitFor();assert.ok((await page.locator('.pagefind-ui__results').innerText()).includes('Landonline'));
  await page.goto(base+'/timeline/');const example=page.locator('.timeline-starters a').first();const label=await example.textContent();await example.click();await page.locator('.event-summary').waitFor();assert.ok((await page.locator('.event-summary').innerText()).includes(label.split(' · ').slice(1).join(' · ')));
  await page.locator('.period-choice').nth(1).click();await page.locator('.timeline-controls button').filter({hasText:'Clear filters'}).click();
  await page.goto(base+'/network/');await page.locator('.network-starter-list button').nth(1).click();await page.waitForFunction(()=>document.querySelectorAll('#connections li').length>0);assert.ok(await page.locator('#connections a').count()>0);
  await page.goto(base+'/publications/');if(width<=650)await page.locator('[data-publication-filter-toggle]').click();
  await page.locator('[data-filter-kind="decade"]').first().click();const visible=page.locator('[data-publication]:visible');assert.ok(await visible.count()>0);const decade=await page.locator('[data-filter-kind="decade"]').first().getAttribute('data-filter-value');assert.ok((await visible.evaluateAll(nodes=>nodes.map(n=>n.dataset.year))).every(y=>y.startsWith(decade.slice(0,3))));
  if(width<=650)await page.locator('[data-publication-filter-toggle]').click();await page.locator('.publication-org-filters summary').click();await page.locator('[data-filter-kind="creator"]').first().click();assert.ok(await visible.count()>0);
  await visible.first().locator('h3 a').click();const pdf=await page.locator('object[type="application/pdf"]').getAttribute('data');assert.ok(pdf.startsWith('/assets/'),pdf);const response=await page.request.get(new URL(pdf,base).href);assert.equal(response.status(),200);assert.equal((await response.body()).subarray(0,5).toString(),'%PDF-');
  await page.goto(base+'/');assert.equal(await page.locator('[data-story-play],[data-hero-motion]').count(),0);
  const contribute=page.locator('.footer a').filter({hasText:'Contribute'});await contribute.click();await page.waitForFunction(()=>{const a=document.getElementById('contribution-page-reference');return a&&a.getAttribute('href')&&a.getAttribute('href')!=='#'});assert.ok((await page.locator('#contribution-mailto').getAttribute('href')).startsWith('mailto:'));assert.ok((await page.locator('#contribution-page-reference').getAttribute('href')).includes(base)|| (await page.locator('#contribution-page-reference').getAttribute('href')).includes('history.pm4gis.nz'));
  assert.deepEqual(errors,[]);await page.goto(base+'/');await page.locator('main img').evaluateAll(nodes=>Promise.all(nodes.map(img=>{img.loading='eager';return img.decode().catch(()=>{})})));await page.screenshot({path:dir+'/home-'+width+'.png',fullPage:true});
  console.log('PASS first-visit journey and accessibility '+width);await context.close();
 }
}finally{await browser.close();writeFileSync(dir+'/results.json',JSON.stringify(results,null,2)+'\n');}
