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
  await check(viewport.name+' homepage complete and correctly ordered',async()=>{
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   await page.locator('#highlighted-stories .highlight-card:visible').first().waitFor();
   assert.equal(await page.locator('#chapters .chapter-card').count(),44);
   assert.equal(await page.locator('#chapters .chapter-card-media img').count(),44,'every chapter should have a documentary thumbnail');
   assert.equal(await page.locator('#chapters .chapter-image-fallback').count(),0,'no generic chapter placeholder should remain');
   const imageAlt=await page.locator('#chapters .chapter-card-media img').evaluateAll(images=>images.map(img=>img.getAttribute('alt')));
   assert.equal(imageAlt.length,44);
   assert.ok(imageAlt.every(alt=>alt&&alt.length>=12),'every chapter thumbnail requires documentary alt text');
   for(const chapter of [2,8,14,25,31,37,41]){
    const cover=page.locator('#chapter-'+chapter+' .chapter-card-media img');
    await cover.scrollIntoViewIfNeeded();
    const info=await cover.evaluate(async img=>{
     await img.decode();
     const style=getComputedStyle(img);
     return {width:img.naturalWidth,height:img.naturalHeight,fit:style.objectFit};
    });
    assert.ok(info.width>=100&&info.height>=100,'chapter '+chapter+' thumbnail failed to decode');
    assert.ok(['contain','cover'].includes(info.fit),'chapter '+chapter+' unexpected image fit '+info.fit);
   }

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
  await check(viewport.name+' topographic title crop and readable heading',async()=>{
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   const hero=page.locator('.hero--topo');
   assert.equal(await hero.count(),1);
   const images=hero.locator('.hero-documentary-media .topo-slide');
   assert.equal(await images.count(),2);
   const active=hero.locator('.topo-slide.is-active');
   assert.equal(await active.count(),1);
   const src=await active.getAttribute('src')||'';
   assert.match(src,/^\/assets\/home-topo\/topo-\d{2}\.webp$/);
   const observed=await active.evaluate(async img=>{
    await img.decode();
    const frame=img.getBoundingClientRect();
    const outer=img.closest('.hero--topo').getBoundingClientRect();
    const title=img.closest('.hero--topo').querySelector('h1');
    const style=getComputedStyle(img);
    return {naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,fit:style.objectFit,
      imgLeft:frame.left,imgRight:frame.right,heroLeft:outer.left,heroRight:outer.right,titleVisible:!!title&&title.getBoundingClientRect().height>0};
   });
   assert.equal(observed.naturalWidth,1400);
   assert.equal(observed.naturalHeight,788);
   assert.equal(observed.fit,'cover');
   assert.ok(observed.imgLeft>=observed.heroLeft-2&&observed.imgRight<=observed.heroRight+2,'map image must stay inside the hero');
   assert.equal(observed.titleVisible,true);
   await dimensions(page,viewport.name+' topographic hero');
  });
  await check(viewport.name+' 44 chapter thumbnails present and correctly framed',async()=>{
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   const images=page.locator('#chapters .chapter-card img');
   assert.equal(await images.count(),44);
   if(['wide desktop','mobile'].includes(viewport.name)){
    await images.evaluateAll(list=>list.forEach(img=>{img.loading='eager';}));
    await images.evaluateAll(list=>Promise.all(list.map(img=>img.decode())));
   }
   const cards=await page.locator('#chapters .chapter-card').evaluateAll(list=>list.map(card=>{
    const frame=card.querySelector('.chapter-card-media');
    const img=frame?.querySelector('img');
    const box=frame?.getBoundingClientRect();
    const style=img?getComputedStyle(img):null;
    return {number:card.id,width:box?.width,height:box?.height,source:img?.getAttribute('src'),
     fit:style?.objectFit,loaded:!!(img?.complete&&img?.naturalWidth),alt:img?.alt,
     photo:frame?.classList.contains('chapter-card-media--photo'),detail:frame?.classList.contains('chapter-card-media--detail')};
   }));
   assert.equal(cards.length,44);
   for(const c of cards){
    assert.ok(c.source?.startsWith('/assets/'),c.number+' must show project image');
    assert.ok((c.alt||'').length>12,c.number+' must retain source alt text');
    assert.ok(Math.abs(c.width/c.height-16/9)<.02,c.number+' image frame distorted');
    if(['wide desktop','mobile'].includes(viewport.name))assert.ok(c.loaded,c.number+' original must load');
    if(c.photo||c.detail)assert.equal(c.fit,'cover',c.number+' editorial image framing');
    else assert.equal(c.fit,'contain',c.number+' must preserve full map/diagram');
   }
   assert.equal(cards.find(c=>c.number==='chapter-39')?.source,'/assets/historical/card/ruapehu-3d-2002.webp');
   assert.equal(cards.find(c=>c.number==='chapter-36')?.source,'/assets/historical/card/nasa-landsat4-tasman-1990.webp');
   assert.equal(cards.find(c=>c.number==='chapter-9')?.fit,'cover');
   await dimensions(page,viewport.name+' documentary thumbnail grid');
  });
  await check(viewport.name+' navigation, contribution action and menu',async()=>{
   const desktop=page.locator('.nav--desktop');
   const summary=page.locator('.mobile-menu > summary');
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
  await check(viewport.name+' story rotation, linked thumbnails and separate image-page attribution',async()=>{
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
    const storyHref=await image.locator('..').locator('a.title').getAttribute('href');
    assert.equal(href,storyHref,'highlight image must open its story, not the image-information page');
    assert.ok(href?.startsWith('/stories/'),'highlight must open a published story');
    // Source and licence remain available separately through the image archive.
    const imageSrc=await image.locator('img').getAttribute('src');
    const imageSlug=(imageSrc||'').split('/').at(-1).replace(/\.webp$/,'');
    assert.ok(imageSlug,'documentary image missing its identifiable source image');
    const detailPage=await context.newPage();
    await detailPage.goto(new URL('/images/'+encodeURIComponent(imageSlug)+'/',base).href,{waitUntil:'domcontentloaded'});
    const attribution=detailPage.locator('.image-source-card');
    await attribution.waitFor();
    const details=await attribution.innerText();
    assert.match(details,/Credit/);
    assert.match(details,/Licence/);
    await detailPage.close();
   }
   await dimensions(page,viewport.name+' rotated highlights');
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
   const themeHref=await page.locator('#themes article.art-card .title').first().getAttribute('href');
   assert.ok(themeHref.startsWith('/themes/'));
  });
  await check(viewport.name+' direct email draft and no-form fallback',async()=>{
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   const links=page.locator('.nav-contribute');
   assert.equal(await links.count(),2);
   for(const anchor of await links.all()){
    const uri=new URL(await anchor.getAttribute('href'));
    assert.equal(uri.protocol,'mailto:');
    assert.equal(decodeURIComponent(uri.pathname),'pm4gis@gmail.com');
    assert.ok((uri.searchParams.get('body')||'').includes('attach any photos'),'mail body '+JSON.stringify(await anchor.getAttribute('href')).slice(0,950));
    assert.equal(await anchor.getAttribute('target'),null);
   }
   await page.goto(base+'/contribute/',{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('h1').innerText(),'Email a contribution');
   assert.equal(await page.locator('form').count(),0);
   assert.equal(await page.locator('input, textarea').count(),0);
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
