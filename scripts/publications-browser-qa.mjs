import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import {chromium} from 'playwright';
import {contributedPrimarySources as publications} from '../src/lib/contributed-primary-sources.mjs';
import {onlinePdfPublications} from '../src/lib/online-pdf-publications.mjs';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const archiveCount=publications.length;
const onlineCount=onlinePdfPublications.length;
const totalCount=archiveCount+onlineCount;
const countForYear=year=>publications.filter(p=>p.startDate.slice(0,4)===year).length+onlinePdfPublications.filter(p=>p.year===year).length;
const countForTheme=theme=>publications.filter(p=>p.themeIds.includes(theme)).length+onlinePdfPublications.filter(p=>p.themeIds.includes(theme)).length;
const browser=await chromium.launch({headless:true});
const results=[];
try{
 for(const width of [390,1366]){
  const page=await browser.newPage({viewport:{width,height:850}});
  await page.goto(base+'/publications/');
  assert.equal(await page.locator('[data-publication]:visible').count(),totalCount);
  const groups=page.locator('[data-publication-group]');
  assert.equal(await groups.nth(0).locator('[data-publication]:visible').count(),archiveCount);
  assert.equal(await groups.nth(1).locator('[data-publication]:visible').count(),onlineCount);
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
  assert.equal(await page.locator('[data-publication]:visible').count(),totalCount,'Clear filters must restore every card');
  await page.getByRole('combobox',{name:'Year',exact:true}).selectOption('2007');
  assert.equal(await page.locator('[data-publication]:visible').count(),countForYear('2007'));
  await page.getByRole('button',{name:'Clear filters'}).click();
  await page.getByRole('combobox',{name:'Year',exact:true}).selectOption('1995');
  assert.equal(await page.locator('[data-publication]:visible').count(),countForYear('1995'));
  assert.equal(await groups.nth(0).isVisible(),false,'The archive section should hide when no archived item matches');
  assert.equal(await groups.nth(1).isVisible(),true,'The online section should remain for matching theses');
  await page.getByRole('button',{name:'Clear filters'}).click();
  assert.equal(await page.locator('[data-publication]:visible').count(),totalCount,'Clear filters must restore every card');
  await page.getByRole('combobox',{name:'Theme',exact:true}).selectOption('maori-gis');
  assert.equal(await page.locator('[data-publication]:visible').count(),countForTheme('maori-gis'));
  await page.reload();assert.equal(await page.locator('[data-publication]:visible').count(),countForTheme('maori-gis'));
  await page.getByRole('button',{name:'Clear filters'}).click();
  assert.equal(await page.locator('[data-publication]:visible').count(),totalCount,'Clear filters must restore every card');
  const onlineCards=page.locator('.publication-card--external');
  assert.equal(await onlineCards.count(),onlineCount);
  for(let i=0;i<onlineCount;i++){
   const item=onlinePdfPublications[i];
   const card=onlineCards.nth(i);
   const pdfLink=card.locator('.publication-actions a').first();
   assert.equal(await pdfLink.getAttribute('href'),item.pdfUrl);
   assert.equal(await pdfLink.getAttribute('aria-label'),item.pdfLabel+': '+item.title);
   assert.equal(await pdfLink.getAttribute('target'),'_blank');
   assert.ok((await pdfLink.getAttribute('rel')).includes('noopener'));
   const sourceLink=card.locator('.publication-source-link');
   assert.equal(await sourceLink.count(),item.sourceUrl?1:0);
   if(item.sourceUrl){
    assert.equal(await sourceLink.getAttribute('href'),item.sourceUrl);
    assert.equal(await sourceLink.getAttribute('aria-label'),(item.sourceLabel||'Publisher details')+' for '+item.title);
   }
  }
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
  results.push({width,archivePublications:archiveCount,onlinePublications:onlineCount,totalPublications:totalCount,palettes:5,modes:2,filters:'passed',externalLinks:'passed',keyboard:'passed',originalChecksums:'passed',viewerResponses:'passed',navigation:'passed'});
  await page.close();
 }
 fs.mkdirSync('docs/verification',{recursive:true});fs.writeFileSync('docs/verification/publications-browser-qa.json',JSON.stringify({base,results},null,2)+'\n');
 console.log('Publications browser QA passed: archive and online items, responsive layouts, palettes, filters, links, keyboard order and original PDFs.');
}finally{await browser.close();}
