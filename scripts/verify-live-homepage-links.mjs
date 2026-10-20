import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
const base='https://history.pm4gis.nz',dir='docs/verification/live-homepage';
mkdirSync(dir,{recursive:true});
const headings=[['#landing-title a','/read/'],['#features-heading a','/read/'],['#landscape-heading a','/themes/imagery/'],['#chapters-heading a','/read/'],['#people-editorial-heading a','/browse/?kind=Person'],['#themes-heading a','/themes/']];
const wallpapers=['karikari2','raglan1','taranaki1'].map(id=>'/decor/north2024-'+id+'-background.webp');
const browser=await chromium.launch({args:['--no-sandbox']});
const results=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),page=await context.newPage();
 page.setDefaultTimeout(20000);
 const response=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});
 if(response.status()!==200){
  const details=(await page.locator('body').innerText()).slice(0,2000);
  throw Error('Public homepage HTTP '+response.status()+': '+details);
 }
 for(const [selector,path] of headings)assert.equal(await page.locator(selector).getAttribute('href'),path,selector);
 assert.deepEqual(await page.locator('.landing-stats>a').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href'))),['/read/','/browse/?kind=Person','/timeline/']);
 assert.deepEqual(await page.locator('.landing-image img').evaluateAll(nodes=>nodes.map(img=>img.getAttribute('src'))),wallpapers);
 const loaded=await page.locator('.landing-image img').evaluateAll(nodes=>Promise.all(nodes.map(async img=>{await img.decode();return {src:img.getAttribute('src'),width:img.naturalWidth,height:img.naturalHeight};})));
 assert.ok(loaded.every(img=>img.width>=1400&&img.height>=788));
 await page.screenshot({path:dir+'/homepage.png',fullPage:true});
 results.push({case:'public homepage headings, statistics and wallpaper images',images:loaded,passed:true});
 for(const [selector,path] of headings){
  await page.locator(selector).focus();await page.keyboard.press('Enter');
  await page.waitForURL(url=>url.pathname+url.search===path);await page.locator('h1').waitFor();
  results.push({selector,path,passed:true});console.log('Verified public heading '+selector+' → '+path);await page.goBack();
 }
 console.log('Production homepage verified in Chromium: six linked headings, three statistic links and three self-hosted wallpaper images.');
 await context.close();
}finally{
 writeFileSync(dir+'/results.json',JSON.stringify(results,null,2)+'\n');
 await browser.close();
}
