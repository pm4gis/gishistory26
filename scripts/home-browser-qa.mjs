import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const cases=[];
async function check(name,run){
 try{await run();cases.push({name,passed:true});console.log('PASS '+name);}
 catch(error){cases.push({name,passed:false,reason:String(error)});console.error('FAIL '+name+' '+String(error));process.exitCode=1;}
}
async function dimensions(page,label){
 const size=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:window.innerWidth}));
 assert.ok(size.scroll<=size.width+2,label+' overflow: '+JSON.stringify(size));
}
const colors=['slate','coastal','forest','archive','bubblegum'];
try{
 for(const viewport of [
  {name:'wide desktop',width:1440,height:900,mobile:false},
  {name:'tablet landscape',width:1024,height:768,mobile:true},
  {name:'tablet portrait',width:768,height:1024,mobile:true},
  {name:'mobile',width:390,height:844,mobile:true},
  {name:'narrow mobile',width:320,height:720,mobile:true}
 ]){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:'reduce'});
  await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});
  const page=await context.newPage();
  page.setDefaultTimeout(12000);
  await check(viewport.name+' navigation, contribution action and menu',async()=>{
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   const desktop=page.locator('.nav--desktop');
   const summary=page.locator('.mobile-menu > summary');
   const mobileMenu=page.locator('.mobile-menu');
   if(viewport.mobile){
    assert.equal(await desktop.isVisible(),false);
    assert.equal(await summary.isVisible(),true);
    assert.equal(await mobileMenu.getAttribute('open'),null);
    await summary.click();
    assert.notEqual(await mobileMenu.getAttribute('open'),null);
    assert.equal(await page.locator('.nav--mobile a[href="/read/"]').isVisible(),true);
    assert.equal(await page.locator('.nav--mobile .nav-contribute').isVisible(),true);
    await summary.focus();
    await page.keyboard.press('Escape');
    assert.equal(await mobileMenu.getAttribute('open'),null);
    await summary.focus();
    await page.keyboard.press('Enter');
    assert.notEqual(await mobileMenu.getAttribute('open'),null);
    await page.mouse.click(5,viewport.height-6);
    assert.equal(await mobileMenu.getAttribute('open'),null);
   }else{
    assert.equal(await desktop.isVisible(),true);
    assert.equal(await summary.isVisible(),false);
    assert.equal(await desktop.locator('a[href="/about/"]').count(),1);
    assert.equal(await desktop.locator('.nav-contribute').count(),1);
   }
   await dimensions(page,viewport.name+' header');
  });
  await check(viewport.name+' five palettes, modes, persistence and page consistency',async()=>{
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   const selector=page.locator('#palette');
   await selector.click();
   assert.equal(await selector.getAttribute('aria-expanded'),'true');
   for(const palette of colors){
    await page.locator('[data-appearance-palette="'+palette+'"]').click();
    assert.equal(await page.locator('html').getAttribute('data-palette'),palette);
    for(const mode of ['dark','light']){
     await page.locator('[data-appearance-mode="'+mode+'"]').click();
     assert.equal(await page.locator('html').getAttribute('data-appearance'),mode);
     const contrast=await page.evaluate(()=>{
      const element=document.querySelector('.nav--desktop .nav-contribute');
      const style=getComputedStyle(element);
      function rgb(s){return [...s.matchAll(/[\d.]+/g)].slice(0,3).map(x=>Number(x[0])/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);}
      const lum=([r,g,b])=>.2126*r+.7152*g+.0722*b;
      const a=lum(rgb(style.color)),b=lum(rgb(style.backgroundColor));
      return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
     });
     assert.ok(contrast>=4.5,'Contribute button contrast '+palette+'/'+mode+': '+contrast);
    }
   }
   await page.locator('[data-appearance-mode="system"]').click();
   const systemScheme=await page.evaluate(()=>matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
   assert.equal(await page.locator('html').getAttribute('data-appearance'),systemScheme);
   await page.locator('[data-appearance-palette="bubblegum"]').click();
   await page.locator('[data-appearance-mode="light"]').click();
   await page.keyboard.press('Escape');
   assert.equal(await selector.getAttribute('aria-expanded'),'false');
   await page.reload({waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('html').getAttribute('data-palette'),'bubblegum');
   assert.equal(await page.locator('html').getAttribute('data-appearance'),'light');
   for(const route of ['/read/','/timeline/','/datasets/','/themes/','/browse/','/network/','/search/']){
    await page.goto(base+route,{waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('html').getAttribute('data-palette'),'bubblegum');
    await dimensions(page,viewport.name+' '+route);
   }
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   const themeHref=await page.locator('#themes nav a').first().getAttribute('href');
   assert.ok(themeHref.startsWith('/themes/'));
  });
  await check(viewport.name+' page-specific correction links and email fallbacks',async()=>{
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   const links=page.locator('.nav-contribute');
   assert.equal(await links.count(),2);
   const correctionHref=await links.first().getAttribute('href');
   const correctionUrl=new URL(correctionHref,base);
   assert.equal(correctionUrl.pathname,'/contribute/');
   assert.equal(correctionUrl.searchParams.get('page'),'A History of GIS in New Zealand');
   assert.equal(new URL(correctionUrl.searchParams.get('pageUrl')).pathname,'/');
   for(const anchor of await links.all()){
    assert.equal(new URL(await anchor.getAttribute('href'),base).pathname,'/contribute/');
    assert.equal(await anchor.getAttribute('target'),null);
   }
   await page.goto(correctionUrl.href,{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('h1').innerText(),'Email a contribution');
   await page.waitForFunction(()=>document.getElementById('contribution-page-title')?.textContent?.includes('A History of GIS in New Zealand'));
   assert.equal(await page.locator('#contribution-page-title').innerText(),'Page: A History of GIS in New Zealand');
   assert.equal(await page.locator('form').count(),0);
   assert.equal(await page.locator('input, textarea').count(),0);
   const contextualDraft=new URL(await page.locator('#contribution-mailto').getAttribute('href'));
   assert.equal(contextualDraft.protocol,'mailto:');
   assert.ok(contextualDraft.searchParams.get('body').includes('Link to page: https://history.pm4gis.nz/'));
   assert.ok(contextualDraft.searchParams.get('body').includes('reuse rights or licence'));
   await page.goto(base+'/contribute/',{waitUntil:'domcontentloaded'});
   const alternative=new URL(await page.locator('#contribution-mailto').getAttribute('href'));
   assert.equal(alternative.protocol,'mailto:');
   assert.equal(decodeURIComponent(alternative.pathname),'pm4gis@gmail.com');
   for(const [id,host] of [['#contribution-gmail','mail.google.com'],['#contribution-outlook','outlook.live.com']]){
    const url=new URL(await page.locator(id).getAttribute('href'));
    assert.equal(url.hostname,host);
    assert.equal(url.searchParams.get('to'),'pm4gis@gmail.com');
   }
   assert.ok((await page.locator('#contribution-message').textContent()).includes('attach any photos'),'preview missing attachment');
   await page.locator('#contribution-copy').click();
   await page.waitForFunction(()=>/copied|Select the prepared text/i.test(document.getElementById('contribution-status')?.textContent||''));
   await dimensions(page,viewport.name+' email options');
  });
  await context.close();
 }
}finally{
 await browser.close();
 console.log(JSON.stringify({passed:cases.filter(c=>c.passed).length,failed:cases.filter(c=>!c.passed).length,results:cases},null,2));
}
