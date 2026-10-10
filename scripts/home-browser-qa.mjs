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
const colors=['night','forest','paper','mist'];
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
  await check(viewport.name+' homepage complete and correctly ordered',async()=>{
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   await page.locator('#highlighted-stories .highlight-card:visible').first().waitFor();
   assert.equal(await page.locator('#chapters .chapter-card').count(),44);
   assert.equal(await page.locator('#chapters .chapter-index a').count(),44);
   assert.equal(await page.locator('#themes article.art-card').count(),8);
   assert.equal(await page.locator('#highlighted-stories .highlight-card:visible').count(),5);
   assert.equal(await page.locator('#highlighted-stories .highlight-card .read-link[href*="/stories/"]').count(),28);
   const order=await page.evaluate(()=>['highlighted-stories','chapters','themes'].map(id=>document.getElementById(id)?.getBoundingClientRect().top+window.scrollY));
   assert.ok(order[0]<order[1]&&order[1]<order[2],'homepage sections out of order');
   const numbers=await page.locator('#chapters .chapter-card .eyebrow').allTextContents();
   assert.deepEqual(numbers.map(x=>Number(x.trim().replace('Chapter ',''))),Array.from({length:44},(_,i)=>i+1));
   await dimensions(page,viewport.name+' homepage');
  });
  await check(viewport.name+' navigation, contribution action and menu',async()=>{
   const desktop=page.locator('.nav--desktop');
   const summary=page.locator('.mobile-menu summary');
   const mobileMenu=page.locator('.mobile-menu');
   if(viewport.mobile){
    assert.equal(await desktop.isVisible(),false);
    assert.equal(await summary.isVisible(),true);
    assert.equal(await mobileMenu.getAttribute('open'),null);
    await summary.click();
    assert.notEqual(await mobileMenu.getAttribute('open'),null);
    assert.equal(await page.locator('.nav--mobile a[href="/about/"]').isVisible(),true);
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
  await check(viewport.name+' story rotation, uniform image frames and image-page attribution',async()=>{
   const selections=async()=>await page.locator('#highlighted-stories .highlight-card:visible').evaluateAll(els=>els.map(el=>el.dataset.highlight));
   const first=await selections();
   assert.equal(new Set(first).size,5);
   await page.reload({waitUntil:'domcontentloaded'});
   const second=await selections();
   assert.equal(second.length,5);
   assert.equal(second.filter(x=>first.includes(x)).length,0,'repeat visit should avoid previous five');
   const ratios=await page.locator('#highlighted-stories .highlight-card:visible').evaluateAll(cards=>cards.map(card=>{
    const media=card.querySelector('.subject-media--card,.decorative-landscape--card');
    if(!media)return null;
    const rect=media.getBoundingClientRect();
    return rect.height?rect.width/rect.height:null;
   }));
   assert.equal(ratios.length,5);
   for(const ratio of ratios)assert.ok(ratio!==null&&Math.abs(ratio-16/9)<0.03,'highlight image frame should be 16:9: '+ratio);
   const linked=page.locator('#highlighted-stories .highlight-card:visible .subject-media');
   for(let j=0;j<await linked.count();j++){
    const image=linked.nth(j);
    assert.ok((await image.locator('img').getAttribute('alt'))?.length>10);
    assert.equal(await image.locator('figcaption').count(),0,'highlight cards should not show image attribution');
    const href=await image.locator('a.subject-media-link').getAttribute('href');
    assert.ok(href?.startsWith('/images/'),'documentary image should link to its detail page');
    const detailPage=await context.newPage();
    await detailPage.goto(new URL(href,base).href,{waitUntil:'domcontentloaded'});
    const attribution=detailPage.locator('.image-source-card');
    await attribution.waitFor();
    const details=await attribution.innerText();
    assert.match(details,/Credit/);
    assert.match(details,/Licence/);
    await detailPage.close();
   }
   await dimensions(page,viewport.name+' rotated highlights');
  });
  await check(viewport.name+' themes and colour palettes',async()=>{
   const selector=page.locator('#palette');
   for(const expected of ['forest','paper','mist','night']){
    await selector.click();
    assert.equal(await page.locator('html').getAttribute('data-theme'),expected);
    const contrast=await page.evaluate(()=>{
      const element=document.querySelector('.nav--desktop .nav-contribute');
      const style=getComputedStyle(element);
      function rgb(s){return [...s.matchAll(/[\d.]+/g)].slice(0,3).map(x=>Number(x[0])/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);}
      const lum=([r,g,b])=>.2126*r+.7152*g+.0722*b;
      const a=lum(rgb(style.color)),b=lum(rgb(style.backgroundColor));
      return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    });
    assert.ok(contrast>=4.5,'contribute button contrast '+expected+' '+contrast);
   }
   const themeHref=await page.locator('#themes article.art-card .title').first().getAttribute('href');
   assert.ok(themeHref.startsWith('/themes/'));
  });
  await check(viewport.name+' email-provider-neutral contribution journey',async()=>{
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   const links=page.locator('.nav-contribute');
   assert.equal(await links.count(),2);
   for(const anchor of await links.all()){
    assert.equal(await anchor.getAttribute('href'),'/contribute/');
    assert.equal(await anchor.getAttribute('target'),null);
   }
   if(viewport.mobile){
    await page.locator('.mobile-menu summary').click();
    await page.locator('.nav--mobile .nav-contribute').click();
   }else{
    await page.locator('.nav--desktop .nav-contribute').click();
   }
   await page.waitForURL('**/contribute/');
   assert.equal(await page.locator('h1').innerText(),'Contribute or suggest a correction');
   assert.equal(await page.locator('#contribution-mailto').count(),1);
   await page.locator('#contribution-detail').fill('The map was published in 1998');
   await page.locator('#contribution-credit').fill('NZ GIS historian');
   const preview=await page.locator('#contribution-message').inputValue();
   assert.ok(preview.includes('The map was published in 1998'));
   assert.ok(preview.includes('NZ GIS historian'));
   const email=new URL(await page.locator('#contribution-mailto').getAttribute('href'));
   assert.equal(email.protocol,'mailto:');
   assert.equal(decodeURIComponent(email.pathname),'pm4gis@gmail.com');
   assert.ok(email.searchParams.get('body').includes('The map was published in 1998'));
   await page.locator('#contribution-copy').click();
   await page.waitForFunction(()=>/copied|Copy the email address/i.test(document.getElementById('contribution-status')?.textContent||''));
   const message=await page.locator('#contribution-status').innerText();
   assert.ok(message.includes('copied')||message.includes('Copy the email address'),message);
   await dimensions(page,viewport.name+' contribution page');
  });
  await context.close();
 }
}finally{
 await browser.close();
 console.log(JSON.stringify({passed:cases.filter(c=>c.passed).length,failed:cases.filter(c=>!c.passed).length,results:cases},null,2));
}
