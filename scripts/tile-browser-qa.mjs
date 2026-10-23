import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,existsSync,readFileSync,readdirSync} from 'node:fs';
import {chromium} from 'playwright';

const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const folder='docs/verification/tile-navigation-qa';
mkdirSync(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const outcomes=[];
const viewports=[
 {name:'desktop',width:1440,height:900,mobile:false},
 {name:'tablet',width:768,height:1024,mobile:true},
 {name:'mobile',width:390,height:844,mobile:true},
 {name:'narrow-mobile',width:320,height:720,mobile:true}
];
const catalogues=[
 {route:'/read/',selector:'.chapter-catalogue-card',exact:44},
 {route:'/themes/',selector:'.art-card',exact:8},
 {route:'/datasets/',selector:'.dataset-source-card',exact:45,ratio:16/9},
 {route:'/datasets/',selector:'.dataset-card:not(.dataset-source-card)',exact:55,ratio:16/9},
 {route:'/browse/',selector:'.subject-browse-card',min:60},
 {route:'/themes/cadastre/',selector:'.subject-entry-card',min:1},
 {route:'/themes/local-government/',selector:'.subject-entry-card',min:1},
 {route:'/themes/women-in-gis/',selector:'.subject-entry-card',min:1}
];
const palettes=['slate','coastal','forest','archive','bubblegum'];
const curated=JSON.parse(readFileSync('docs/media/catalogue-curation-25-20261015.json','utf8')).selections;
const followUpFile='docs/media/direct-gis-image-followup-20261015.json';
const followUp=existsSync(followUpFile)?JSON.parse(readFileSync(followUpFile,'utf8')):{replacements:[]};
const newerImages=new Map(followUp.replacements.map(x=>[x.recordSlug,x.imageSlug]));
const collection=type=>new Map(readdirSync('src/content/'+type).filter(x=>x.endsWith('.json'))
 .map(x=>JSON.parse(readFileSync('src/content/'+type+'/'+x,'utf8')))
 .map(x=>[x.slug,x]));
const curatedRecords=collection('records');
const curatedImages=collection('images');
async function check(label,fn){
 try{const result=await fn();outcomes.push({label,pass:true,...(result||{})});console.log('PASS '+label);}
 catch(e){outcomes.push({label,pass:false,error:String(e)});console.error('FAIL '+label+': '+e);process.exitCode=1;}
}
async function cards(page,selector,{min,exact,ratio}={}){
 const locator=page.locator(selector);
 await locator.first().waitFor({state:'attached'});
 const result=await locator.evaluateAll(elements=>elements.map(card=>{
  const image=card.querySelector('img');
  const imageLink=image?.closest('a');
  const title=card.querySelector('a.title, h3 a') || (card.matches('a')?card:null);
  const imageHref=imageLink?.getAttribute('href');
  const titleHref=title?.getAttribute('href');
  const imageRect=image?.getBoundingClientRect();
  return {
   textOnlyPerson:card.matches('.subject-browse-card--person'),
   title:card.querySelector('h3, .title')?.textContent?.trim()?.slice(0,120),
   titleHref,imageHref,imageSource:image?.getAttribute('src'),
   sourceHref:card.querySelector('.dataset-source-card-media figcaption a')?.getAttribute('href'),
   alt:image?.getAttribute('alt'),
   accessibleName:imageLink?.getAttribute('aria-label')||image?.getAttribute('alt')||imageLink?.textContent?.trim(),
   width:imageRect?.width||0,height:imageRect?.height||0,
   distinctLink:!!imageLink&&imageLink.closest('.image-index-card')===null,
   isDocumentary:!!image&&image.getAttribute('alt')?.trim().length>0
  };
 }));
 assert.ok(result.length>= (min||0),selector+' too few cards: '+result.length);
 if(exact!==undefined)assert.equal(result.length,exact,selector+' changed card count');
 for(let i=0;i<result.length;i++){
  const card=result[i];
  // Person records intentionally use text-first cards rather than unrelated scenic photographs.
  if(card.textOnlyPerson){assert.ok(card.titleHref?.startsWith('/'),selector+' #'+i+' has no readable destination');assert.ok(!card.imageSource,'Person card should not suggest an unrelated portrait');continue;}
  assert.ok(card.imageSource,selector+' #'+i+' has no image');
  const imageUrl=new URL(card.imageSource,base);
  if(imageUrl.origin===new URL(base).origin){
   assert.ok(existsSync('dist'+imageUrl.pathname),selector+' #'+i+' image asset missing from production build: '+imageUrl.pathname);
  }else{
   const allowedPreviewHosts=['tiles-cdn.koordinates.com','www.arcgis.com','www.nzpam.govt.nz','www.tpk.govt.nz','niwa.co.nz'];
   assert.ok(allowedPreviewHosts.some(host=>imageUrl.hostname===host||imageUrl.hostname.endsWith('.'+host)),selector+' #'+i+' has an unreviewed external image host: '+imageUrl.hostname);
   assert.ok(card.sourceHref?.startsWith('https://'),selector+' #'+i+' external preview has no source link');
   assert.ok(card.imageHref?.startsWith('https://'),selector+' #'+i+' external preview does not link directly to the dataset');
  }
  assert.ok(card.imageHref,selector+' #'+i+' image has no link');
  assert.ok(card.titleHref,selector+' #'+i+' title has no link');
  assert.equal(card.imageHref,card.titleHref,selector+' #'+i+' image opens different destination: '+card.imageHref);
  assert.doesNotMatch(card.imageHref,/^\/images\//,selector+' #'+i+' opens image archive instead of entry');
  assert.ok(card.width>25&&card.height>25,selector+' #'+i+' image has no visible frame');
  if(ratio!==undefined)assert.ok(Math.abs(card.width/card.height-ratio)<.03,selector+' #'+i+' thumbnail frame is not '+ratio+': '+card.width+'x'+card.height);
  assert.ok(card.accessibleName,selector+' #'+i+' image link has no accessible name');
 }
 return result;
}
async function imageSample(page,selector){
 const first=page.locator(selector+' img').first();
 await first.scrollIntoViewIfNeeded();
 const info=await first.evaluate(async img=>{
  img.loading='eager';
  await img.decode();
  return {width:img.naturalWidth,height:img.naturalHeight};
 });
 assert.ok(info.width>80&&info.height>70,selector+' first image did not decode');
}
async function openImageLink(page,selector,mobile,keyboard=false,useTitle=false){
 const card=page.locator(selector).first();
 const imageLink=useTitle?card.locator('a.title').first():card.locator('img').first().locator('xpath=ancestor::a[1]');
 const href=await imageLink.getAttribute('href');
 assert.ok(href&&href.startsWith('/'),'expected local destination: '+href);
 if(keyboard){
  await imageLink.focus();
  await page.keyboard.press('Enter');
 }else if(mobile)await imageLink.tap();
 else await imageLink.click();
 await page.waitForURL(url=>url.pathname+url.search+url.hash===href,{timeout:12000});
 assert.equal((await page.locator('h1').count())>0,true,'destination has no heading');
 return href;
}
function horizontalOverflow(page){
 return page.evaluate(()=>({width:window.innerWidth,scroll:document.documentElement.scrollWidth}));
}
async function paletteChecks(page,viewport){
 await page.goto(base+'/',{waitUntil:'domcontentloaded'});
 for(const palette of palettes)for(const mode of ['dark','light']){
  const css=await page.evaluate(({palette,mode})=>{
   document.documentElement.dataset.palette=palette;
   document.documentElement.dataset.appearance=mode;
   const cs=getComputedStyle(document.documentElement);
   const hex=name=>cs.getPropertyValue('--'+name).trim();
   const rgb=color=>{
    const short=color.match(/^#([\da-f]{3})$/i);
    if(short)return [...short[1]].map(c=>parseInt(c+c,16)/255);
    const full=color.match(/^#([\da-f]{6})$/i);
    if(full)return [0,2,4].map(n=>parseInt(full[1].slice(n,n+2),16)/255);
    const match=color.match(/rgba?\(\s*(\d+)[, ]+(\d+)[, ]+(\d+)/);
    if(match)return [Number(match[1])/255,Number(match[2])/255,Number(match[3])/255];
    throw Error('Cannot calculate contrast from colour '+color);
   };
   const lum=color=>{
    const v=rgb(color).map(c=>c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4));
    return .2126*v[0]+.7152*v[1]+.0722*v[2];
   };
   const ratio=(a,b)=>{const l=[lum(a),lum(b)].sort((a,b)=>b-a);return (l[0]+.05)/(l[1]+.05);};
   const tile=document.querySelector('.chapter-catalogue-card')||document.body;
   const a=tile?.querySelector('.chapter-card-media');
   const style=a&&getComputedStyle(a);
   return {text:ratio(hex('text'),hex('surface')),link:ratio(hex('link'),hex('surface')),
    imageFit:style?.outlineStyle,background:getComputedStyle(tile).backgroundColor,
    scroll:document.documentElement.scrollWidth,width:window.innerWidth};
  },{palette,mode});
  assert.ok(css.text>=4.5,viewport+' '+palette+' '+mode+' text contrast '+css.text);
  assert.ok(css.link>=4.5,viewport+' '+palette+' '+mode+' link contrast '+css.link);
  assert.ok(css.scroll<=css.width+2,viewport+' '+palette+' '+mode+' overflows horizontally');
 }
 await page.evaluate(()=>{document.documentElement.dataset.palette='slate';document.documentElement.dataset.appearance='dark';});
}
try{
 for(const viewport of viewports){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},
   isMobile:viewport.mobile,hasTouch:viewport.mobile,reducedMotion:'reduce'});
  const page=await context.newPage();
  page.setDefaultTimeout(15000);
  const groups=new Map();
  for(const c of catalogues){
   const key=c.route;
   if(!groups.has(key))groups.set(key,[]);
   groups.get(key).push(c);
  }
  for(const [route,items] of groups){
   await check(viewport.name+' '+route+' linked catalogue images',async()=>{
    const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});
    assert.ok(response&&response.status()===200,route+' HTTP error');
    // Allow the hydrated Svelte browser to initialise its filters.
    if(route==='/browse/')await page.locator('.subject-browse-card').first().waitFor();
    const result=[];
    for(const item of items)result.push({selector:item.selector,count:(await cards(page,item.selector,item)).length});
    if(route!=='/browse/')await imageSample(page,items[0].selector);
    const dim=await horizontalOverflow(page);
    assert.ok(dim.scroll<=dim.width+2,route+' horizontal overflow '+JSON.stringify(dim));
    return {catalogues:result};
   });
  }
  await check(viewport.name+' chapter / story / theme / dataset / organisation clicks',async()=>{
   const targets=[
    {route:'/read/',selector:'.chapter-catalogue-card',keyboard:true},
    {route:'/themes/',selector:'.art-card',keyboard:false},
    {route:'/datasets/',selector:'.dataset-card:not(.dataset-source-card)',keyboard:false},
    {route:'/browse/',selector:'.subject-browse-card',keyboard:false}
   ];
   const opened=[];
   for(const t of targets){
    await page.goto(base+t.route,{waitUntil:'domcontentloaded'});
    if(t.route==='/browse/')await page.locator('.subject-browse-card').first().waitFor();
    opened.push(await openImageLink(page,t.selector,viewport.mobile,t.keyboard,t.route==='/browse/'));
   }
   return {opened};
  });
  if(['desktop','mobile'].includes(viewport.name)){
   await check(viewport.name+' all 25 documented replacements have the intended image and destination',async()=>{
    const datasets=curated.filter(x=>x.kind==='Dataset');
    const orgs=curated.filter(x=>x.kind!=='Dataset');
    let count=0;
    await page.goto(base+'/datasets/',{waitUntil:'domcontentloaded'});
    for(const item of datasets){
     const record=curatedRecords.get(item.recordSlug);
     const image=curatedImages.get(newerImages.get(item.recordSlug)||item.imageSlug);
     const card=page.locator('#dataset-'+item.recordSlug);
     const photo=card.locator('.dataset-card-media img');
     await photo.waitFor();
     assert.equal(await photo.getAttribute('src'),image.thumbnailPath||image.assetPath,item.recordSlug+' dataset image');
     assert.equal(await photo.locator('xpath=ancestor::a[1]').getAttribute('href'),record.url);
     assert.equal(await card.locator('.dataset-card-media figcaption a').getAttribute('href'),'/images/'+image.slug+'/');
     count++;
    }
    await page.goto(base+'/browse/',{waitUntil:'domcontentloaded'});
    const search=page.locator('input[type="search"]');
    await search.waitFor();
    for(const item of orgs){
     const record=curatedRecords.get(item.recordSlug);
     const image=curatedImages.get(newerImages.get(item.recordSlug)||item.imageSlug);
     await search.fill(record.name);
     const card=page.locator('.subject-browse-card').filter({has:page.locator('a.title[href="'+record.url+'"]')});
     await card.waitFor();
     const photo=card.locator('img');
     assert.equal(await photo.getAttribute('src'),image.thumbnailPath||image.assetPath,item.recordSlug+' catalogue image');
     const anchor=photo.locator('xpath=ancestor::a[1]');
     assert.equal(await anchor.getAttribute('href'),record.url,item.recordSlug+' wrong content destination');
     assert.equal(await photo.getAttribute('alt'),image.altText,item.recordSlug+' missing documentary description');
     count++;
    }
    assert.equal(count,25,'incomplete curated browser coverage');
    return {checked:count};
   });
  }
  if(['desktop','mobile'].includes(viewport.name)){
   await check(viewport.name+' all five palettes and both modes keep tile text readable',async()=>paletteChecks(page,viewport.name));
   await check(viewport.name+' image provenance remains available in actual content pages',async()=>{
    await page.goto(base+'/themes/cadastre/',{waitUntil:'domcontentloaded'});
    const source=page.locator('.visual-page-heading .subject-media a[href^="/images/"]').first();
    assert.ok(await source.count()>0,'actual theme header should preserve image-detail link');
    const href=await source.getAttribute('href');
    await page.goto(base+href,{waitUntil:'domcontentloaded'});
    assert.ok(await page.locator('.image-source-card').count()>0,'image detail/source page missing');
    const details=await page.locator('.image-source-card').innerText();
    assert.match(details,/Credit/);assert.match(details,/Licence/);
   });
  }
  await page.goto(base+'/datasets/',{waitUntil:'domcontentloaded'});
  await page.screenshot({path:folder+'/'+viewport.name+'-datasets.png',animations:'disabled'});
  await page.goto(base+'/themes/',{waitUntil:'domcontentloaded'});
  await page.screenshot({path:folder+'/'+viewport.name+'-themes.png',animations:'disabled'});
  await context.close();
 }
} finally {
 await browser.close();
 const report={base,passed:outcomes.filter(x=>x.pass).length,failed:outcomes.filter(x=>!x.pass).length,cases:outcomes};
 writeFileSync(folder+'/results.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({passed:report.passed,failed:report.failed,failures:outcomes.filter(x=>!x.pass)},null,2));
}
