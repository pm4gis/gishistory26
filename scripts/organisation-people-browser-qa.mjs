import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {rawDataset} from '../src/lib/raw.mjs';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const d=rawDataset();
const added=JSON.parse(fs.readFileSync('docs/research/people-expansion-20261013.json','utf8'));
const proxyUrl=base.startsWith('http://127.')?null:process.env.HTTPS_PROXY||process.env.HTTP_PROXY;
const proxy=proxyUrl?(()=>{const u=new URL(proxyUrl);return {server:u.protocol+'//'+u.host,...(u.username?{username:decodeURIComponent(u.username),password:decodeURIComponent(u.password)}:{})}})():undefined;
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],proxy});
const context=await browser.newContext({viewport:{width:1440,height:1000},ignoreHTTPSErrors:!!proxy});
const page=await context.newPage();const errors=[];const checks=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 for(const item of added){
  const r=d.records.find(r=>r.id===item.id), target=d.records.find(r=>r.id===item.connection);
  const response=await page.goto(base+r.url,{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200,r.url);
  assert.equal(await page.locator('h1').innerText(),r.name);
  assert.ok(await page.locator('a').evaluateAll((links,href)=>links.some(a=>a.getAttribute('href')===href),target.url),r.name+' connection');
  checks.push({route:r.url,connectedTo:target.url,status:200});
 }
 await page.goto(base+'/browse/?q=Munro%20Morad',{waitUntil:'networkidle'});
 await page.locator('.subject-browse-card .title').first().waitFor();
 assert.equal(await page.locator('.subject-browse-card .title').innerText(),'Munir Morad');
 await page.goto(base+'/browse/?q=Buller',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.subject-browse-card').count(),0);
 await page.goto(base+'/entities/buller-district-council/');
 assert.equal(await page.locator('h1').innerText(),'Buller District Council');
 await page.goto(base+'/browse/?kind=Agency&q=Primary',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.subject-browse-card .title').innerText(),'Ministry for Primary Industries');
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});
  await page.goto(base+'/',{waitUntil:'networkidle'});
  const home=page.locator('#chapter-31 img');
  assert.ok((await home.getAttribute('src')).includes('doc-google-trekker-heaphy-2015'));
  await home.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const i=document.querySelector('#chapter-31 img');return i?.complete&&i?.naturalWidth>0});
  await home.evaluate(i=>i.decode());
  await page.screenshot({path:'/tmp/org-audit-home-'+width+'.png'});
  for(const [route,slug] of [['/stories/google-changes-the-audience/','doc-google-trekker-heaphy-2015'],['/stories/mapping-leaves-the-office/','doc-google-trekker-milford-mist-2015']]){
   await page.goto(base+route,{waitUntil:'networkidle'});
   const img=page.locator('img[src*="'+slug+'"]');
   assert.equal(await img.count(),1);
   await img.scrollIntoViewIfNeeded();
   await page.waitForFunction(slug=>{const i=document.querySelector('img[src*="'+slug+'"]');return i?.complete&&i?.naturalWidth>0},slug);
   await img.evaluate(i=>i.decode());
   const box=await img.boundingBox();assert.ok(box.width<=width,route+' overflow');
   await page.screenshot({path:'/tmp/org-audit-'+slug+'-'+width+'.png'});
  }
 }
 assert.deepEqual(errors,[]);
 const record={base,checkedAt:new Date().toISOString(),managedProxy:!!proxy,tlsCertificateVerification:proxy?'not assessed through the intercepted browser connection':'standard browser verification',newProfiles:checks.length,profiles:checks,viewports:[1440,390],aliasSearch:true,referenceCatalogueExcluded:true,referenceRoutePreserved:true,mpiAgencyFilter:true,imageLoads:true,pageErrors:errors};
 fs.writeFileSync('docs/verification/organisation-people-browser-'+(base.startsWith('http://127.')?'local':base.includes('pages.dev')?'preview':'production')+'-20261013.json',JSON.stringify(record,null,2)+'\n');
 console.log('Browser verification passed: '+checks.length+' new profiles, alias and catalogue controls, documentary images at desktop/mobile. '+base);
}finally{await browser.close();}
