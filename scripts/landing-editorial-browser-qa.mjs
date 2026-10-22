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
  assert.equal(await page.locator('.landing-image img').count(),3);
  assert.equal(await page.locator('.landscape-interlude').count(),1);
  assert.equal(await page.locator('.people-editorial').count(),1);
  assert.equal(await page.locator('.landscape-interlude img').count(),1);
  assert.equal(await page.locator('.people-editorial img').count(),1);
  const hero=page.locator('.landing-image--first img');assert.match(await hero.getAttribute('src'),/north2024-karikari2-background/);
  assert.ok(await hero.evaluate(img=>img.naturalWidth>=1400&&getComputedStyle(img).objectFit==='cover'));
  assert.equal(await page.locator('.landing-stats>a').count(),4);assert.equal(await page.locator('[data-build-stat]').count(),0);assert.equal(await page.locator('.editorial-paths-links>a').count(),3);
  assert.match(await page.locator('.history-endpoint').innerText(),/31 December 2025/);
  assert.equal(await page.locator('.chapter-preview a').count(),6);assert.equal(await page.locator('#themes nav a').count(),8);
  await page.locator('.all-chapters summary').click();for(let n=1;n<=44;n++)assert.equal(await page.locator('#chapter-'+n).count(),1);
  await page.locator('.all-chapters summary').click();
  for(const figure of ['.map-artefact','.computer-feature figure']){
   const href=await page.locator(figure+' > a').getAttribute('href');await page.locator(figure+' > a').focus();await page.keyboard.press('Enter');await page.waitForURL(url=>url.pathname===href);assert.equal(await page.locator('h1').count(),1);await page.goBack();
  }

  const headingTargets=[['#landing-title a','/read/'],['#features-heading a','/read/'],['#landscape-heading a','/themes/imagery/'],['#chapters-heading a','/read/'],['#people-editorial-heading a','/browse/?kind=Person'],['#themes-heading a','/themes/']];
  for(const [selector,target] of headingTargets){
   const link=page.locator(selector);assert.equal(await link.getAttribute('href'),target);await link.focus();await page.keyboard.press('Enter');
   await page.waitForURL(url=>url.pathname+url.search===target);await page.locator('h1').waitFor();await page.goBack();
  }
  for(const [selector,target] of [['.landscape-photo','/themes/imagery/'],['.people-editorial-image','/browse/?kind=Person']]){
   await page.locator(selector).click({position:{x:30,y:30}});await page.waitForURL(url=>url.pathname+url.search===target);await page.goBack();
  }
  const wallpapers=await page.locator('.landing-image img').evaluateAll(nodes=>nodes.map(img=>img.getAttribute('src')));
  assert.deepEqual(wallpapers,['/decor/north2024-karikari2-background.webp','/decor/north2024-raglan1-background.webp','/decor/north2024-taranaki1-background.webp']);
  const statistics=await page.locator('.landing-stats>a').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href')));
  assert.deepEqual(statistics,['/read/','/browse/?kind=Person','/timeline/','/publications/']);
  assert.deepEqual(await page.locator('.editorial-paths-links>a').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href'))),['/stories/what-the-computer-inherited/','/timeline/','/publications/']);

  const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2);assert.ok(noOverflow,width+' page overflow');
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],width+' accessibility');
  await page.locator('main img').evaluateAll(nodes=>Promise.all(nodes.map(img=>{img.loading='eager';return img.decode()})));
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:dir+'/home-'+width+'.png',fullPage:true});assert.deepEqual(errors,[]);results.push({width,passed:true,axeViolations:0});console.log('PASS approved landing composition, image links, chapters and accessibility '+width);await context.close();
 }
 const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'no-preference'}),page=await context.newPage();
 await page.goto(base+'/browse/?kind=Person');await page.waitForFunction(()=>document.querySelector('.subject-browse-card')?.textContent?.includes('Person'));
 assert.ok(await page.locator('.subject-browse-card').count()>0);const people=await page.locator('.subject-browse-card>small').allTextContents();assert.ok(people.every(t=>t==='Person'));
 await page.goto(base+'/browse/?kind=Organisation&kind=Agency&kind=Business&kind=Council&kind=Community');await page.waitForFunction(()=>document.querySelector('[aria-pressed="true"]'));
 assert.ok(await page.locator('.subject-browse-card').count()>0);assert.ok((await page.locator('.subject-browse-card>small').allTextContents()).every(t=>['Organisation','Agency','Business','Council','Community'].includes(t)));
 await page.goto(base+'/');
 for(const [time,frame] of [[1000,0],[10500,1],[20000,2]]){
  const opacity=await page.locator('.landing-image').evaluateAll((nodes,time)=>nodes.map(node=>{for(const animation of node.getAnimations()){animation.pause();animation.currentTime=time;}return Number(getComputedStyle(node).opacity);}),time);
  assert.equal(opacity[frame],1,'Wallpaper frame should be visible at '+time);assert.ok(opacity.every((v,i)=>i===frame||v===0));
 }
 await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));await context.close();
 const noJS=await browser.newContext({viewport:{width:1280,height:900},javaScriptEnabled:false});const plain=await noJS.newPage();await plain.goto(base+'/');assert.equal(await plain.locator('.chapter-preview a').count(),6);assert.equal(await plain.locator('.landing-image img').count(),3);await noJS.close();
 results.push({case:'filtered navigation destinations, text resize and no-JavaScript reading',passed:true});
}finally{await browser.close();writeFileSync(dir+'/results.json',JSON.stringify(results,null,2)+'\n');}
