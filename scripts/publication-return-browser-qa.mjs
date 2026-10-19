import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const dir='docs/verification/publication-return';mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox']});const results=[];
try{
 for(const width of [1440,768,390,320]){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(15000);
  const errors=[];page.on('pageerror',error=>errors.push(String(error)));
  for(const filter of ['decade','theme','creator']){
   await page.goto(base+'/publications/');
   if(width<=650)await page.locator('[data-publication-filter-toggle]').click();
   if(filter==='creator')await page.locator('.publication-org-filters summary').click();
   // Choose the facet value with the largest list, then a card well below the top.
   const choices=await page.locator('[data-filter-kind="'+filter+'"]').evaluateAll(buttons=>buttons.map(b=>({value:b.dataset.filterValue,count:Number(b.querySelector('span').textContent)})));
   choices.sort((a,b)=>b.count-a.count);
   await page.locator('[data-filter-kind="'+filter+'"]').filter({has:page.locator('span')}).evaluateAll((buttons,value)=>buttons.find(b=>b.dataset.filterValue===value).click(),choices[0].value);
   const selectedValue=choices[0].value;
   const visible=page.locator('[data-publication]:visible');const count=await visible.count();assert.ok(count>1);
   const card=visible.nth(Math.min(count-1,8));const id=await card.getAttribute('id');const link=card.locator('h3 a');
   await link.scrollIntoViewIfNeeded();await page.waitForTimeout(100);const scroll=await page.evaluate(()=>scrollY);const libraryURL=page.url();
   const href=await link.getAttribute('href');const returnPath=new URL(href,base).searchParams.get('library');assert.ok(returnPath.endsWith('#'+id));
   assert.equal(new URL(returnPath,base).searchParams.get('value'),selectedValue);
   await link.click();await page.locator('.publication-reader-back').waitFor();
   assert.equal(await page.locator('.publication-reader-back').getAttribute('href'),returnPath);
   assert.ok((await page.locator('.topbar a').evaluateAll(links=>links.filter(a=>a.textContent==='Publications').map(a=>a.getAttribute('href')))).every(href=>href===returnPath));
   const next=page.locator('.publication-reader-nav a[rel="next"]');
   if(await next.count()){
    await next.click();await page.locator('.publication-reader-back').waitFor();assert.equal(await page.locator('.publication-reader-back').getAttribute('href'),returnPath);
   }
   await page.locator('.publication-reader-back').click();
   await page.waitForFunction(({id,y})=>document.activeElement?.closest('[data-publication]')?.id===id&&Math.abs(scrollY-y)<4,{id,y:scroll});
   assert.equal(new URL(page.url()).searchParams.get('value'),selectedValue);assert.equal(await page.locator('[data-publication]:visible').count(),count);
   // Browser Back must also restore the original list history entry.
   await page.goto(libraryURL);const same=page.locator('#'+id+' h3 a');await same.scrollIntoViewIfNeeded();const backScroll=await page.evaluate(()=>scrollY);await same.click();await page.locator('.publication-reader-back').waitFor();await page.goBack();
   await page.waitForFunction(({id,y})=>document.activeElement?.closest('[data-publication]')?.id===id&&Math.abs(scrollY-y)<4,{id,y:backScroll});
   await page.goForward();await page.locator('.publication-reader-back').waitFor();assert.equal(await page.locator('.publication-reader-back').getAttribute('href'),returnPath);
   await page.locator('[data-publication-library-return]').click();assert.equal(new URL(page.url()).hash,'#'+id);
   await page.screenshot({path:dir+'/'+width+'-'+filter+'.png'});results.push({width,filter,passed:true});console.log('PASS return, sequence and Back/Forward '+width+' '+filter);
  }
  // A normal library visit must not revive an unrelated previous filter.
  await page.goto(base+'/publications/');assert.equal(new URL(page.url()).search,'');assert.equal(await page.locator('[data-filter-kind="all"]').getAttribute('aria-pressed'),'true');
  assert.deepEqual(errors,[]);await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:850}});
 await context.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw new Error('Storage unavailable')}})});
 const page=await context.newPage();await page.goto(base+'/publications/?filter=decade&value=1990');const link=page.locator('[data-publication]:visible h3 a').nth(3);const href=await link.getAttribute('href');const target=new URL(href,base).searchParams.get('library');await link.click();await page.locator('.publication-reader-back').click();assert.equal(new URL(page.url()).pathname+new URL(page.url()).search+new URL(page.url()).hash,target);await page.waitForFunction(()=>document.querySelector('[data-filter-kind="decade"][data-filter-value="1990"]')?.getAttribute('aria-pressed')==='true');
 await page.goto(base+'/publications/pdf/nz-map-grid-1973/?library=https%3A%2F%2Fexample.com');assert.equal(await page.locator('.publication-reader-back').getAttribute('href'),'/publications/');
 await context.close();results.push({case:'storage unavailable and invalid return destination',passed:true});console.log('PASS storage fallback and invalid destination');
}finally{await browser.close();writeFileSync(dir+'/results.json',JSON.stringify(results,null,2)+'\n');}
