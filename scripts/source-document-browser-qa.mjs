import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {chromium} from 'playwright';
import {chapterDocuments} from '../src/lib/chapter-documents.mjs';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try {
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));

  for(const document of chapterDocuments){
   await page.goto(base+'/stories/'+document.articleSlug+'/',{waitUntil:'networkidle'});
   const card=page.locator('#'+document.afterParagraphId+' + aside.source-download');
   assert.equal(await card.count(),1);
   assert.equal(await card.locator('a[download]').getAttribute('href'),document.assetPath);
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  for(const document of chapterDocuments){
   await page.goto(base+'/documents/'+document.slug+'/',{waitUntil:'networkidle'});
   assert.equal(await page.locator('a[download]').getAttribute('href'),document.assetPath);
   assert.ok((await page.locator('body').innerText()).includes(document.rights));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
   const response=await page.request.get(base+document.assetPath);assert.equal(response.status(),200);
   assert.equal(crypto.createHash('sha256').update(await response.body()).digest('hex'),document.sha256);
  }
  assert.deepEqual(errors,[]);await page.close();console.log('PASS original PDF links, paragraph placement, download hashes and detail pages '+width);
 }
}finally{await browser.close()}
