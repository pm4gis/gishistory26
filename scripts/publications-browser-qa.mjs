import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {chromium} from 'playwright';
import {contributedPrimarySources} from '../src/lib/contributed-primary-sources.mjs';
import {onlinePdfPublications} from '../src/lib/online-pdf-publications.mjs';
import {publicationReadingOrder} from '../src/lib/publication-reading-order.mjs';

const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const browser=await chromium.launch({headless:true});
const results=[];
try{
 for(const width of [390,1366]){
  const page=await browser.newPage({viewport:{width,height:900}});
  const response=await page.goto(base+'/publications/',{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200);
  const cards=page.locator('[data-publication]');
  assert.equal(await cards.count(),publicationReadingOrder.length);
  const years=await cards.evaluateAll(els=>els.map(el=>Number(el.getAttribute('data-year'))));
  const displayedYears=await cards.locator('.eyebrow').allTextContents();
  assert.deepEqual(displayedYears,years.map(String),'Cards must show only the year, not a repeat of the title or document category');
  assert.equal(await page.locator('.publication-format').count(),0,'No redundant PDF or format labels should be shown');
  assert.deepEqual(years,[...years].sort((a,b)=>a-b),'Publication cards must be chronological');
  assert.ok(await page.locator('input[type="search"]').count()===0,'No search bar in the catalogue');
  assert.ok(await page.locator('.publication-sidebar').count()===1);
  assert.equal(await page.locator('[data-publication]:visible').count(),publicationReadingOrder.length);
  const selectMobileFilters=async()=>{
   if(width<=650&&await page.locator('[data-publication-filter-toggle]').getAttribute('aria-expanded')==='false')
    await page.locator('[data-publication-filter-toggle]').click();
  };
  await selectMobileFilters();
  await page.locator('[data-filter-kind="decade"]').first().click();
  const activeDecade=await page.locator('[data-filter-kind="decade"][aria-pressed="true"]').getAttribute('data-filter-value');
  const expectedDecade=publicationReadingOrder.filter(x=>x.year.startsWith(activeDecade.slice(0,3))).length;
  assert.equal(await page.locator('[data-publication]:visible').count(),expectedDecade);
  assert.equal(new URL(page.url()).searchParams.get('filter'),'decade');
  await selectMobileFilters();
  await page.locator('[data-filter-kind="all"]').click();
  assert.equal(await page.locator('[data-publication]:visible').count(),publicationReadingOrder.length);
  // The user's filter choices are real navigable history states.
  await page.goBack();
  await page.waitForFunction(decade=>document.querySelector('[data-filter-kind="decade"][aria-pressed="true"]')?.getAttribute('data-filter-value')===decade,activeDecade);
  assert.equal(await page.locator('[data-publication]:visible').count(),expectedDecade,'Back must restore the selected decade and visible cards');
  await page.goForward();
  await page.waitForFunction(()=>document.querySelector('[data-filter-kind="all"][aria-pressed="true"]')!==null);
  assert.equal(await page.locator('[data-publication]:visible').count(),publicationReadingOrder.length,'Forward must restore all publications');
  await selectMobileFilters();
  const historyLength=await page.evaluate(()=>history.length);
  await page.locator('[data-filter-kind="all"]').click();
  assert.equal(await page.evaluate(()=>history.length),historyLength,'Selecting the active filter must not create duplicate history');
  await selectMobileFilters();
  await page.locator('[data-filter-kind="theme"]').first().click();
  assert.ok(await page.locator('[data-publication]:visible').count()>0);
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('[data-filter-kind="theme"][aria-pressed="true"]').count(),1,'Theme selection should survive refresh');
  await selectMobileFilters();
  await page.locator('[data-filter-kind="all"]').click();
  await selectMobileFilters();
  await page.locator('.publication-org-filters summary').click();
  await page.locator('[data-filter-kind="creator"]').first().click();
  const creator=await page.locator('[data-filter-kind="creator"][aria-pressed="true"]').getAttribute('data-filter-value');
  assert.equal(await page.locator('[data-publication]:visible').count(),publicationReadingOrder.filter(x=>{
   const item=x.kind==='archive'?contributedPrimarySources.find(p=>p.slug===x.slug):onlinePdfPublications.find(p=>p.slug===x.slug);
   return item.creator===creator;
  }).length);
  await selectMobileFilters();
  await page.locator('[data-filter-kind="all"]').click();
  for(const item of [publicationReadingOrder[0],publicationReadingOrder.find(x=>x.kind==='archive'),publicationReadingOrder.find(x=>x.kind==='research')]){
   const res=await page.goto(base+item.url,{waitUntil:'domcontentloaded'});
   assert.equal(res.status(),200,item.url);
   const obj=page.locator('.publication-reader-object');
   assert.equal(await obj.count(),1,item.url);
   const path=await obj.getAttribute('data');
   assert.ok(path?.includes('#view=FitH'),item.url);
   const frame=await page.locator('.publication-reader-frame').boundingBox();
   assert.ok(frame&&frame.width>=width*.88,'PDF viewer should span available screen width: '+item.url);
   assert.ok(frame.height>=450,'PDF viewer should use most of the viewport: '+item.url);
   assert.equal(await page.locator('a[download]').count(),0,'Reader must not offer direct download');
   assert.ok(await page.locator('.publication-reader-details').count()===1);
   assert.ok((await page.locator('main').innerText()).includes('About this publication'));
   const next=publicationReadingOrder.indexOf(item)+1;
   if(next<publicationReadingOrder.length){
    assert.equal(await page.locator('.publication-reader-nav a[rel="next"]').getAttribute('href'),publicationReadingOrder[next].url);
   }
  }
  const original=contributedPrimarySources[0];
  const originalRes=await page.request.get(base+original.assetPath);
  assert.equal(originalRes.status(),200);
  assert.equal(crypto.createHash('sha256').update(await originalRes.body()).digest('hex'),original.sha256);
  const story=await page.goto(base+'/stories/what-the-computer-inherited/',{waitUntil:'domcontentloaded'});
  assert.equal(story.status(),200);
  const sidebar=page.locator('.chapter-sidebar-timeline');
  if(width<850)await page.getByRole('button',{name:/Timeline & related/}).click();
  assert.equal(await sidebar.count(),1,'Chapter timeline belongs in sidebar');
  assert.ok(await sidebar.isVisible(),'Chapter timeline should be visible');
  assert.ok(await page.locator('details.passage-tools').count()>0,'Passage actions are collapsed');
  assert.equal(await page.locator('a.contribution-help').count(),0);
  const pageWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
  assert.ok(pageWidth<=width+4,'No mobile or desktop horizontal overflow: '+pageWidth+' > '+width);
  results.push({width,publicationCount:publicationReadingOrder.length,chronology:'passed',sidebarFilters:'passed',pdfViewer:'passed',publicationNavigation:'passed',chapterSidebar:'passed',passageActions:'passed'});
  await page.close();
 }
 // Verify every published reader route without depending on a fixed collection size.
 const routeContext=await browser.newContext();
 let checkedReaders=0,checkedHostFiles=0,externalReferences=0;
 for(let i=0;i<publicationReadingOrder.length;i++){
  const item=publicationReadingOrder[i];
  const response=await routeContext.request.get(base+item.url);
  assert.equal(response.status(),200,item.url+' must resolve on site');
  const html=await response.text();
  assert.ok(html.includes('publication-reader'),item.url+' missing reader');
  assert.ok(html.includes('publication-reader-details'),item.url+' missing details beneath reader');
  if(i>0)assert.ok(html.includes('rel="prev"'),item.url+' missing previous navigation');
  if(i<publicationReadingOrder.length-1)assert.ok(html.includes('rel="next"'),item.url+' missing next navigation');
  const record=item.kind==='archive'?contributedPrimarySources.find(p=>p.slug===item.slug):onlinePdfPublications.find(p=>p.slug===item.slug);
  assert.ok(record,'missing catalogue record '+item.slug);
  if(item.kind==='archive'||record.hostedLocally){
   const file=item.kind==='archive'?record.viewerPath:record.pdfPath;
   const check=await routeContext.request.head(base+file);
   assert.equal(check.status(),200,'Hosted PDF missing: '+file);
   assert.ok(check.headers()['content-type']?.includes('pdf'),'Hosted asset is not a PDF: '+file);
   checkedHostFiles++;
  }else{
   assert.ok(record.sourceUrl?.startsWith('https://'),'External PDF needs a source URL '+item.slug);
   externalReferences++;
  }
  checkedReaders++;
 }
 await routeContext.close();
 assert.equal(checkedReaders,publicationReadingOrder.length);
 assert.equal(checkedHostFiles+externalReferences,publicationReadingOrder.length);
 console.log('Checked '+checkedReaders+' publication readers, '+checkedHostFiles+' hosted PDF headers and '+externalReferences+' external source records.');
 fs.mkdirSync('docs/verification',{recursive:true});
 fs.writeFileSync('docs/verification/publications-browser-qa.json',JSON.stringify({base,results},null,2)+'\n');
 console.log('Publications browser QA passed: chronological catalogue, left filters, wide on-site PDF reader, previous/next and compact chapter controls.');
}finally{await browser.close();}
