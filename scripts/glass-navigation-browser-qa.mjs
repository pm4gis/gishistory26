import assert from 'node:assert/strict';
import {mkdirSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';

const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const themes=readdirSync('src/content/themes').filter(name=>name.endsWith('.json'))
 .map(name=>JSON.parse(readFileSync('src/content/themes/'+name,'utf8')))
 .sort((a,b)=>a.title.localeCompare(b.title,'en-NZ'));
const palettes=['slate','coastal','forest','archive','bubblegum'];
const shotDir='docs/verification/glass-nav-qa';
mkdirSync(shotDir,{recursive:true});
const cases=[];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
async function check(label,fn){
 try{await fn();cases.push({label,pass:true});console.log('PASS '+label);}
 catch(error){cases.push({label,pass:false,reason:String(error)});console.error('FAIL '+label+' '+String(error));process.exitCode=1;}
}
async function noOverflow(page,label){
 const dimensions=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
 assert.ok(dimensions.scroll<=dimensions.viewport+2,label+' horizontal overflow '+JSON.stringify(dimensions));
}
async function contrastValues(page){
 return page.evaluate(()=>{
  const root=getComputedStyle(document.documentElement);
  const variable=name=>root.getPropertyValue('--'+name).trim();
  const rgb=value=>{
   const short=value.match(/^#([\da-f]{3})$/i);
   if(short)return [...short[1]].map(c=>parseInt(c+c,16)/255);
   const match=value.match(/^#([\da-f]{6})$/i);
   if(match)return [0,2,4].map(n=>parseInt(match[1].slice(n,n+2),16)/255);
   const m=value.match(/rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/);
   if(m)return [Number(m[1])/255,Number(m[2])/255,Number(m[3])/255];
   throw Error('Unsupported colour '+value);
  };
  const luminance=values=>values.map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4)
   .reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
  const ratio=(a,b)=>{
   const l=[luminance(rgb(a)),luminance(rgb(b))].sort((x,y)=>y-x);
   return (l[0]+.05)/(l[1]+.05);
  };
  const summary=document.querySelector('.nav--desktop .nav-theme-toggle');
  return {
   normal:ratio(variable('text'),variable('surface')),
   raised:ratio(variable('text'),variable('raised')),
   muted:ratio(variable('muted'),variable('surface')),
   summaryColor:getComputedStyle(summary).color,
   headerFilter:getComputedStyle(document.querySelector('.topbar')).backdropFilter,
   themeLinkCount:document.querySelectorAll('.nav--desktop .nav-theme-grid a').length,
  };
 });
}
try{
 assert.equal(themes.length,8,'expected eight source-backed themes');
 for(const viewport of [
  {name:'desktop',width:1440,height:900,mobile:false},
  {name:'tablet',width:1024,height:768,mobile:true},
  {name:'mobile',width:390,height:844,mobile:true},
  {name:'narrow',width:320,height:720,mobile:true}
 ]){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.setDefaultTimeout(12000);
  await page.goto(base+'/',{waitUntil:'domcontentloaded'});
  const menu=page.locator(viewport.mobile?'.nav--mobile .nav-dropdown--themes':'.nav--desktop .nav-dropdown--themes');
  const summary=menu.locator('summary');
  const links=menu.locator('.nav-theme-grid a');

  await check(viewport.name+' populated theme links match all source records',async()=>{
   if(viewport.mobile)await page.locator('.mobile-menu > summary').click();
   assert.equal(await links.count(),themes.length);
   await summary.click();
   assert.ok(await menu.evaluate(element=>element.open));
   const displayed=await links.evaluateAll(anchors=>anchors.map(a=>({title:a.textContent.trim(),href:a.getAttribute('href')})));
   assert.deepEqual(displayed,themes.map(t=>({title:t.title,href:'/themes/'+t.slug+'/'})));
   const all=menu.locator('.nav-dropdown-all');
   assert.equal(await all.getAttribute('href'),'/themes/');
   assert.equal(await all.isVisible(),true);
   assert.equal(await menu.locator('summary').getAttribute('role'),null,'native disclosure should retain its role');
   await noOverflow(page,viewport.name+' themes open');
   const box=await (viewport.mobile?page.locator('.nav--mobile'):menu.locator('.nav-dropdown-panel')).boundingBox();
   assert.ok(box&&box.x>=-2&&box.x+box.width<=viewport.width+2,'themes menu clipped horizontally '+JSON.stringify(box));
   if(viewport.mobile){
    const scroll=await page.locator('.nav--mobile').evaluate(el=>({height:el.clientHeight,scroll:el.scrollHeight}));
    assert.ok(scroll.height<=viewport.height,'mobile navigation exceeds viewport');
    await links.last().focus();
    assert.equal(await links.last().evaluate(el=>document.activeElement===el),true);
   }
  });

  await check(viewport.name+' full dataset dropdown and sourced catalogue tiles',async()=>{
   await page.goto(base+'/datasets/',{waitUntil:'domcontentloaded'});
   const records=readdirSync('src/content/records').filter(n=>n.endsWith('.json'))
    .map(n=>JSON.parse(readFileSync('src/content/records/'+n,'utf8')))
    .filter(r=>r.kind==='Dataset');
   const target=page.locator(viewport.mobile?'.nav--mobile .nav-dropdown--datasets':'.nav--desktop .nav-dropdown--datasets');
   if(viewport.mobile)await page.locator('.mobile-menu > summary').click();
   await target.locator('summary').click();
   assert.equal(await target.locator('.nav-theme-grid a').count(),records.length,'menu must include every dataset history');
   const links=await target.locator('.nav-theme-grid a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
   assert.deepEqual(new Set(links),new Set(records.map(r=>r.url)));
   assert.equal(await target.locator('.nav-dropdown-all').getAttribute('href'),'/datasets/');
   await noOverflow(page,viewport.name+' dataset disclosure');
   const illustrated=page.locator('.dataset-card-media img');
   assert.ok(await illustrated.count()>=20,'dataset catalogue missing source imagery');
   assert.ok(await page.locator('.dataset-card-media figcaption a').count()>=20,'dataset image provenance links missing');
   assert.equal(await page.locator('.dataset-shortcuts a').count(),10);
   for(const card of ['nz-primary-parcels','lucas-land-use-map','nz-8m-dem-geographx-2012']){
    const el=page.locator('#dataset-'+card+' img');
    await el.scrollIntoViewIfNeeded();
    const info=await el.evaluate(async img=>{await img.decode();return {width:img.naturalWidth,height:img.naturalHeight,alt:img.alt}});
    assert.ok(info.width>=180&&info.height>=100&&info.alt.length>10,card+' documentary image failed');
   }
   await target.locator('summary').focus();
   await page.keyboard.press('Escape');
   assert.equal(await target.evaluate(el=>el.open),false);
   await page.screenshot({path:shotDir+'/'+viewport.name+'-dataset-catalogue.png',animations:'disabled'});
  });

  await check(viewport.name+' keyboard, focus, Escape and outside click',async()=>{
   await page.keyboard.press('Tab');
   await summary.focus();
   assert.equal(await summary.evaluate(el=>getComputedStyle(el).outlineStyle!=='none'),true,'missing focus outline');
   if(!await menu.evaluate(el=>el.open))await page.keyboard.press('Enter');
   await page.keyboard.press('ArrowDown');
   assert.equal(await links.first().evaluate(el=>document.activeElement===el),false,'ArrowDown should select first menu link');
   assert.equal(await menu.locator('.nav-dropdown-all').evaluate(el=>document.activeElement===el),true);
   await page.keyboard.press('ArrowDown');
   assert.equal(await links.first().evaluate(el=>document.activeElement===el),true);
   await page.keyboard.press('ArrowUp');
   assert.equal(await menu.locator('.nav-dropdown-all').evaluate(el=>document.activeElement===el),true);
   await page.keyboard.press('Escape');
   assert.equal(await menu.evaluate(el=>el.open),false);
   assert.equal(await summary.evaluate(el=>document.activeElement===el),true,'Escape focus must return to summary');
   await summary.click();
   await page.mouse.click(3,viewport.height-3);
   assert.equal(await menu.evaluate(el=>el.open),false,'outside click should close themes');
  });

  await check(viewport.name+' palette combinations retain readable glass surfaces',async()=>{
   if(viewport.mobile&&!(await page.locator('.mobile-menu').evaluate(el=>el.open))){
    await page.locator('.mobile-menu > summary').click();
   }
   for(const palette of palettes){
    for(const mode of ['dark','light']){
     await page.locator('#palette').click();
     await page.locator('[data-appearance-palette="'+palette+'"]').click();
     await page.locator('[data-appearance-mode="'+mode+'"]').click();
     const values=await contrastValues(page);
     assert.ok(values.normal>=4.5,palette+' '+mode+' text/surface ratio '+values.normal);
     assert.ok(values.raised>=4.5,palette+' '+mode+' text/raised ratio '+values.raised);
     assert.ok(values.muted>=4.5,palette+' '+mode+' muted/surface ratio '+values.muted);
     assert.ok(values.headerFilter!=='none',palette+' '+mode+' header lost glass blur');
     assert.equal(values.themeLinkCount,themes.length);
     assert.equal(await page.locator('html').getAttribute('data-palette'),palette);
     assert.equal(await page.locator('html').getAttribute('data-appearance'),mode);
     await page.keyboard.press('Escape');
     if(viewport.mobile&&!(await page.locator('.mobile-menu').evaluate(el=>el.open))){
      await page.locator('.mobile-menu > summary').click();
     }
     await summary.click();
     await page.screenshot({path:shotDir+'/'+viewport.name+'-'+palette+'-'+mode+'-themes.png',animations:'disabled'});
     await summary.click();
     await noOverflow(page,viewport.name+' '+palette+' '+mode);
    }
   }
  });

  await check(viewport.name+' routes retain navigation and avoid horizontal clipping',async()=>{
   for(const route of ['/','/read/','/timeline/','/search/','/themes/','/browse/','/datasets/','/stories/what-the-computer-inherited/']){
    await page.goto(base+route,{waitUntil:'domcontentloaded'});
    await noOverflow(page,viewport.name+' '+route);
    assert.equal(await page.locator('.nav-dropdown--themes').count(),2);
    assert.ok(await page.locator('main').count()===1);
    assert.ok(await page.locator('.brand').count()===1);
    if(['desktop','mobile'].includes(viewport.name)&&['/timeline/','/search/','/stories/what-the-computer-inherited/'].includes(route)){
     await page.screenshot({path:shotDir+'/'+viewport.name+'-'+route.replace(/\W+/g,'-')+'.png',animations:'disabled'});
    }
   }
  });
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
 const page=await context.newPage();
 await page.goto(base+'/',{waitUntil:'domcontentloaded'});
 await check('animated disclosure respects normal motion settings',async()=>{
  await page.locator('.nav--desktop .nav-theme-toggle').click();
  assert.equal(await page.locator('.nav--desktop .nav-dropdown-panel').evaluate(el=>getComputedStyle(el).animationName),'glass-menu-enter');
 });
 await context.close();
}finally{
 await browser.close();
 const report={base,themeCount:themes.length,passed:cases.filter(x=>x.pass).length,failed:cases.filter(x=>!x.pass).length,cases};
 writeFileSync(shotDir+'/report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({passed:report.passed,failed:report.failed},null,2));
}
