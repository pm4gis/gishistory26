import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import {chromium} from 'playwright';
import {contributedPrimarySources as publications} from '../src/lib/contributed-primary-sources.mjs';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const browser=await chromium.launch({headless:true});
const results=[];
try{
 for(const width of [390,1366]){
  const page=await browser.newPage({viewport:{width,height:850}});
  await page.goto(base+'/publications/');
  assert.equal(await page.locator('[data-publication]:visible').count(),8);
  for(const palette of ['slate','coastal','forest','archive','bubblegum'])for(const mode of ['light','dark']){
   await page.getByRole('button',{name:/Open settings|Open appearance settings/}).click();
   await page.locator('[data-appearance-mode="'+mode+'"]').click();
   await page.locator('[data-appearance-palette="'+palette+'"]').click();
   await page.getByRole('button',{name:'Close appearance settings',exact:true}).click();
   assert.equal(await page.locator('html').getAttribute('data-appearance'),mode);
   assert.equal(await page.locator('html').getAttribute('data-palette'),palette);
   const sizes=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(sizes.scroll<=sizes.width+2,JSON.stringify({width,palette,mode,...sizes}));
  }
  await page.getByRole('searchbox').fill('Maori');
  assert.ok(await page.locator('[data-publication]:visible').count()>0);
  await page.getByRole('button',{name:'Clear filters'}).click();
  await page.getByLabel('Year',{exact:true}).selectOption('2007');
  assert.equal(await page.locator('[data-publication]:visible').count(),2);
  await page.getByRole('button',{name:'Clear filters'}).click();
  await page.getByLabel('Theme',{exact:true}).selectOption('maori-gis');
  assert.equal(await page.locator('[data-publication]:visible').count(),3);
  await page.reload();assert.equal(await page.locator('[data-publication]:visible').count(),3);
  await page.getByRole('button',{name:'Clear filters'}).click();
  const input=page.getByRole('searchbox');await input.focus();await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.name),'decade');
  for(const p of publications){
   const response=await page.goto(base+p.publicationUrl);assert.equal(response.status(),200);
   assert.equal(await page.locator('object[type="application/pdf"]').getAttribute('data'),p.viewerPath);
   assert.ok(await page.locator('a[download]').count());
   const img=page.locator('.publication-overview img');await img.scrollIntoViewIfNeeded();
   assert.ok(await img.evaluate(el=>el.complete&&el.naturalWidth>0));
   assert.ok((await page.locator('main').innerText()).includes('Original publication:'));
   assert.ok((await page.locator('main').innerText()).includes('17 October 2026'));
   const original=await page.request.get(base+p.assetPath);assert.equal(original.status(),200);
   assert.equal(crypto.createHash('sha256').update(await original.body()).digest('hex'),p.sha256);
   const pdf=await page.request.get(base+p.viewerPath);assert.equal(pdf.status(),200);
   assert.ok((await pdf.body()).subarray(0,5).equals(Buffer.from('%PDF-')));
  }
  await page.goto(base+'/publications/');
  if(width===390)await page.locator('.mobile-menu > summary').click();
  assert.ok(await page.locator(width===390?'.nav--mobile a[href="/publications/"]':'.nav--desktop a[href="/publications/"]').isVisible());
  results.push({width,publications:8,palettes:5,modes:2,filters:'passed',keyboard:'passed',originalChecksums:'passed',viewerResponses:'passed',navigation:'passed'});
  await page.close();
 }
 fs.mkdirSync('docs/verification',{recursive:true});fs.writeFileSync('docs/verification/publications-browser-qa.json',JSON.stringify({base,results},null,2)+'\n');
 console.log('Publications browser QA passed: mobile/desktop, all palettes and modes, filters, keyboard order, eight original checksums and PDF viewing responses.');
}finally{await browser.close();}
