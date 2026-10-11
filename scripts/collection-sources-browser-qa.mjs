import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {chapterCollectionSources} from '../src/lib/chapter-collection-sources.mjs';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  for(const article of new Set(chapterCollectionSources.map(s=>s.articleSlug))){
   await page.goto(base+'/stories/'+article+'/',{waitUntil:'networkidle'});
   const notes=chapterCollectionSources.filter(s=>s.articleSlug===article);
   assert.equal(await page.locator('details.collection-source').count(),notes.length);
   for(const source of notes){
    const card=page.locator('[data-source-note="'+source.id+'"]');
    assert.equal(await card.evaluate(el=>{let p=el.previousElementSibling;while(p&&!(p.tagName==='P'&&p.id))p=p.previousElementSibling;return p?.id}),source.afterParagraphId);
    await card.locator('summary').click();assert.ok((await card.innerText()).includes(source.text));
    for(const link of source.links)assert.equal(await card.locator('a[href="'+link.url+'"]').count(),1);
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),article+' overflow');
  }
  await page.goto(base+'/sources/collections/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('a[download]').count(),4);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  assert.deepEqual(errors,[]);await page.close();console.log('PASS ten collection notes, seven chapters, exact paragraph placement and source index '+width);
 }
}finally{await browser.close()}
