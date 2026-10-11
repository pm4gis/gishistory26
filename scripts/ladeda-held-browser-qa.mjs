import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {chromium} from 'playwright';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const candidates=JSON.parse(fs.readFileSync('docs/media/ladeda-handbook-review-20261011.json','utf8')).plots.map(p=>p.id).concat('held-nzlri-levin-n152');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(base+'/stories/from-map-sheets-to-spatial-data/',{waitUntil:'networkidle'});
  const body=await page.locator('body').innerText();
  for(const expected of ['LADEDA','1977','1979','Williams'])assert.ok(body.includes(expected));
  const html=await page.content();
  for(const id of candidates)assert.ok(!html.includes(id),'Held candidate entered chapter HTML '+id);
  assert.ok(html.includes('/documents/ladeda-plotting-handbook-1982/'),'Original handbook download details missing');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  await page.goto(base+'/images/',{waitUntil:'networkidle'});
  const gallery=await page.content();
  for(const id of candidates)assert.ok(!gallery.includes('/images/'+id+'/'),'Held detail page in gallery');
  assert.deepEqual(errors,[]);
  console.log('PASS LADEDA held candidates absent from chapter/gallery, preserved chapter readable, no overflow '+viewport.width);
  await page.close();
 }
 const page=await browser.newPage();
 for(const id of candidates){
  const response=await page.request.get(base+'/images/'+id+'/');
  assert.equal(response.status(),404,'Unpublished extract detail route published '+id);
 }
 const path='/assets/historical/web/gisborne-east-coast-luc-map-1967.webp';
 const response=await page.request.get(base+path);assert.equal(response.status(),200);
 const hash=crypto.createHash('sha256').update(await response.body()).digest('hex');
 assert.equal(hash,JSON.parse(fs.readFileSync('src/content/images/gisborne-east-coast-luc-map-1967.json','utf8')).webSha256);
 console.log('PASS all 18 held routes 404; existing 1967 LUC image checksum preserved');
 await page.close();
}finally{await browser.close()}
