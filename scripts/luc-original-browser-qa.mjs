import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const slug='gisborne-east-coast-luc-map-1967';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(base+'/stories/mapping-land-as-data/',{waitUntil:'networkidle'});
  const figure=page.locator('p[id="ch07-s02-p02"] + figure.passage-illustration');
  await figure.waitFor();await figure.scrollIntoViewIfNeeded();
  assert.match(await figure.innerText(),/1967/);assert.match(await figure.innerText(),/1973–1979/);
  const img=figure.locator('img');await img.evaluate(el=>el.decode());
  assert.ok(await img.evaluate(el=>el.naturalWidth>=2000));
  assert.ok(await page.locator('figure.passage-illustration a[href="/images/'+slug+'/"]').count()>=2);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  await page.goto(base+'/images/'+slug+'/',{waitUntil:'networkidle'});
  const body=await page.locator('.image-source-card').innerText();
  for(const expected of ['Sourced from LINZ. Crown Copyright reserved.','1967','National Library'])assert.ok(body.includes(expected));
  assert.match(await page.locator('#image-context-heading + p').innerText(),/1:126,720/);
  const original=await page.request.get(base+'/assets/historical/original/'+slug+'.jpg');assert.equal(original.status(),200);assert.ok((await original.body()).length>4000000);
  await page.goto(base+'/stories/from-map-sheets-to-spatial-data/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('figure.passage-illustration a[href="/images/'+slug+'/"]').count(),0);
  assert.deepEqual(errors,[]);console.log('PASS LUC map placement, attribution, full access image, mobile overflow and Chapter 5 exclusion '+viewport.width);
  await page.close();
 }
}finally{await browser.close()}
