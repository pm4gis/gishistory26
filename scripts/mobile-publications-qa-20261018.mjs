import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const widths=[320,390,650,768,1024,1440];
const results=[];
const evidenceDir='docs/verification/mobile-publications-20261018';
await fs.mkdir(evidenceDir,{recursive:true});

async function overflow(page,name){
 const data=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
 assert.ok(data.document<=data.viewport+2&&data.body<=data.viewport+2,name+' horizontal overflow: '+JSON.stringify(data));
 return data;
}
async function screenshot(page,name){await page.screenshot({path:evidenceDir+'/'+name+'.png',fullPage:false});}
try{
 for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
  page.setDefaultTimeout(15000);
  let response=await page.goto(base+'/',{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200,'homepage must load');
  await overflow(page,width+' homepage');
  if(width<=1180){
   const mobile=page.locator('.mobile-menu');
   assert.ok(await mobile.locator(':scope > summary').isVisible(),width+' menu toggle missing');
   await mobile.locator(':scope > summary').click();
   const nav=page.locator('.nav--mobile');
   assert.ok(await nav.isVisible(),'menu did not open');
   const b=await nav.boundingBox();assert.ok(b&&b.x>=-1&&b.x+b.width<=width+1,'mobile menu falls outside viewport');
   assert.ok(await nav.locator('a[href="/publications/"]').isVisible());
   await screenshot(page,'menu-'+width);
   await mobile.locator(':scope > summary').click();
  }
  response=await page.goto(base+'/publications/',{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200,'publication library must load');
  const cards=page.locator('[data-publication]');
  assert.ok(await cards.count()>=100,'catalogue has unexpected record loss');
  await overflow(page,width+' publications');
  if(width<=650){
   const toggle=page.locator('[data-publication-filter-toggle]');
   assert.ok(await toggle.isVisible(),'compact mobile filter toggle missing');
   assert.equal(await toggle.getAttribute('aria-expanded'),'false');
   assert.ok(!(await page.locator('#publication-filters').isVisible()),'mobile filters should be collapsed initially');
   const card=cards.first();
   const box=await card.boundingBox();const cover=await card.locator('.publication-cover').boundingBox();
   assert.ok(box&&cover&&cover.width<box.width*.45,'mobile publications should have side-by-side cover and text');
   await toggle.click();
   assert.equal(await toggle.getAttribute('aria-expanded'),'true');
   assert.ok(await page.locator('#publication-filters').isVisible());
   await page.locator('button[data-filter-kind="decade"][data-filter-value="1980"]').click();
   assert.equal(await toggle.getAttribute('aria-expanded'),'false');
   assert.ok(await page.locator('[data-publication]:visible').count()>0);
   await toggle.click();
   await page.locator('button[data-filter-kind="all"]').click();
   assert.equal(await page.locator('[data-publication]:visible').count(),await cards.count());
  }else{
   assert.ok(await page.locator('#publication-filters').isVisible(),'desktop/tablet filters missing');
  }
  await overflow(page,width+' publications with filters');
  await screenshot(page,'publications-'+width);
  response=await page.goto(base+'/publications/pdf/doc-gis-1990/',{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200,'historic DOC publication page missing');
  assert.ok(await page.locator('.publication-reader-nav a').count()>0,'PDF sequence links missing');
  if(width<=650)assert.ok(await page.locator('.publication-reader-open').isVisible(),'mobile source PDF needs accessible open action');
  await overflow(page,width+' PDF reader');
  await screenshot(page,'pdf-reader-'+width);
  response=await page.goto(base+'/stories/preface/',{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200,'chapter reader unavailable');
  await page.locator('.page').first().waitFor({state:'visible'});
  if(width<=850){
   const buttons=page.locator('.mobile-controls button');
   assert.equal(await buttons.count(),2,'Chapter mobile contents and related controls missing');
   await buttons.first().click();
   assert.ok(await page.locator('.contents.open').isVisible(),'mobile contents do not expand');
   await buttons.first().click();
  }
  await overflow(page,width+' chapter reader');
  await screenshot(page,'chapter-'+width);
  results.push({width,homepage:'passed',navigation:'passed',publications:'passed',historicPdf:'passed',chapter:'passed',horizontalOverflow:'none'});
  await page.close();
 }
 await fs.writeFile(evidenceDir+'/results.json',JSON.stringify({results},null,2)+'\n');
 console.log('Responsive QA PASS across '+widths.join(', ')+'px for homepage, navigation, PDF catalogue, reader and chapter');
}finally{await browser.close();}
