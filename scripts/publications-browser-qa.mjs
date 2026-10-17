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
  const availableYears=[...new Set([...publications.map(p=>p.startDate.slice(0,4)),...onlinePdfPublications.map(p=>p.year)])].sort();
  assert.ok(availableYears.length>1,'The catalogue should expose more than one publication year');
  const latestYear=availableYears.at(-1);
  await page.getByRole('combobox',{name:'Year',exact:true}).selectOption(latestYear);
  assert.equal(await page.locator('[data-publication]:visible').count(),countForYear(latestYear));
  await page.getByRole('button',{name:'Clear filters'}).click();
  const earliestYear=availableYears[0];
  await page.getByRole('combobox',{name:'Year',exact:true}).selectOption(earliestYear);
  assert.equal(await page.locator('[data-publication]:visible').count(),countForYear(earliestYear));
  assert.equal(await groups.nth(0).isVisible(),publications.some(p=>p.startDate.slice(0,4)===earliestYear),'The archive section visibility should match the year filter');
  assert.equal(await groups.nth(1).isVisible(),onlinePdfPublications.some(p=>p.year===earliestYear),'The online reference section visibility should match the year filter');
  await page.getByRole('button',{name:'Clear filters'}).click();
  assert.equal(await page.locator('[data-publication]:visible').count(),totalCount,'Clear filters must restore every card');
  await page.getByRole('combobox',{name:'Theme',exact:true}).selectOption('maori-gis');
  assert.equal(await page.locator('[data-publication]:visible').count(),countForTheme('maori-gis'));
  await page.reload();assert.equal(await page.locator('[data-publication]:visible').count(),countForTheme('maori-gis'));
  await page.getByRole('button',{name:'Clear filters'}).click();
  assert.equal(await page.locator('[data-publication]:visible').count(),totalCount,'Clear filters must restore every card');
  assert.equal(await page.locator('.publication-filters option[value="2026"]').count(),0,'No 2026 publication year should be offered');
  assert.equal(await page.locator('.publication-card--source-linked').count(),onlinePdfPublications.filter(p=>!p.hostedLocally).length);
  const onlineCards=page.locator('.publication-card--hosted,.publication-card--source-linked');
  assert.equal(await onlineCards.count(),onlineCount);
  for(const item of onlinePdfPublications){
   const card=onlineCards.filter({has:page.getByRole('link',{name:item.title,exact:true})});
   assert.equal(await card.count(),1,item.slug);
   assert.equal(await card.getAttribute('data-year'),item.year);
   assert.ok(Number(item.year)<=2025,`${item.title} must be dated 2025 or earlier`);
   const readerUrl='/publications/research/'+item.slug+'/';
   const readLink=card.locator('.publication-read');
   assert.equal(await readLink.getAttribute('href'),readerUrl);
   assert.equal(await readLink.innerText(),'View publication');
   assert.equal(await card.locator('h3 a').getAttribute('href'),readerUrl);
   assert.equal(await card.locator('.publication-cover').getAttribute('href'),readerUrl);
   assert.equal(await card.locator('.publication-download').count(),0);
   assert.equal(await card.locator('a[download]').count(),0);
   const image=card.locator('.publication-cover img');
   assert.equal(await image.getAttribute('src'),item.thumbnailPath);
   await image.scrollIntoViewIfNeeded();
   assert.ok(await image.evaluate(el=>el.complete&&el.naturalWidth>0),`${item.title} thumbnail should load`);
   assert.ok((await card.locator('.publication-licence').innerText()).includes(item.license));
   assert.ok((await card.locator('.publication-attribution').innerText()).includes(item.attribution));
   const sourceLink=card.locator('.publication-source-link');
   const hasSeparateSource=item.sourceUrl&&item.sourceUrl!==item.externalPdfUrl;
   assert.equal(await sourceLink.count(),hasSeparateSource?1:0);
   if(hasSeparateSource){
    assert.equal(await sourceLink.getAttribute('href'),item.sourceUrl);
    assert.equal(await sourceLink.getAttribute('aria-label'),(item.sourceLabel||'Source record')+' for '+item.title);
   }else{
    assert.ok(item.provenance,`${item.title} must explain its contributor-supplied provenance`);
   }
  }
  const input=page.getByRole('searchbox');await input.focus();await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.name),'decade');
  for(const p of publications){
   const response=await page.goto(base+p.publicationUrl);assert.equal(response.status(),200);
   assert.equal(await page.locator('object[type="application/pdf"]').getAttribute('data'),p.viewerPath);
   assert.equal(await page.locator('a[download]').count(),0);
   assert.equal(await page.locator('.publication-reader-nav').count(),2);
   assert.ok(await page.locator('.publication-reader-nav a').count()>0,'The reader should link to another publication in the site');
   const img=page.locator('.publication-overview img');await img.scrollIntoViewIfNeeded();
   assert.ok(await img.evaluate(el=>el.complete&&el.naturalWidth>0));
   assert.ok((await page.locator('main').innerText()).includes('Original publication:'));
   assert.ok((await page.locator('main').innerText()).includes('17 October 2026'));
   const original=await page.request.get(base+p.assetPath);assert.equal(original.status(),200);
   assert.equal(crypto.createHash('sha256').update(await original.body()).digest('hex'),p.sha256);
   const pdf=await page.request.get(base+p.viewerPath);assert.equal(pdf.status(),200);
   assert.ok((await pdf.body()).subarray(0,5).equals(Buffer.from('%PDF-')));
   if(p===publications[0]){
    const nextInSite=page.locator('.publication-reader-nav').first().locator('a').last();
    const nextUrl=await nextInSite.getAttribute('href');
    assert.ok(nextUrl.startsWith('/publications/'));
    await nextInSite.click();
    assert.equal(new URL(page.url()).pathname,nextUrl,'Next PDF navigation should stay inside the site');
   }
  }
  for(const item of onlinePdfPublications){
   const response=await page.goto(base+'/publications/research/'+item.slug+'/');
   assert.equal(response.status(),200,item.slug);
   assert.equal(await page.locator('a[download]').count(),0,item.slug);
   assert.equal(await page.locator('.publication-reader-nav').count(),1,item.slug);
   assert.ok(await page.locator('.publication-reader-nav a').count()>0,item.slug);
   const pdfAvailable=String(item.pdfPath).toLowerCase().split('?')[0].split('#')[0].endsWith('.pdf');
   if(pdfAvailable)assert.equal(await page.locator('object[type="application/pdf"]').getAttribute('data'),item.pdfPath,item.slug);
   else assert.equal(await page.locator('.source-record-viewer a').getAttribute('href'),item.pdfPath,item.slug);
  }
  await page.goto(base+'/publications/');
  if(width===390)await page.locator('.mobile-menu > summary').click();
  assert.ok(await page.locator(width===390?'.nav--mobile a[href="/publications/"]':'.nav--desktop a[href="/publications/"]').isVisible());
  results.push({width,archivePublications:archiveCount,hostedPublications:onlineCount,totalPublications:totalCount,palettes:5,modes:2,filters:'passed',hostedPdfsAndThumbnails:'passed',sourceAndRights:'passed',keyboard:'passed',originalChecksums:'passed',viewerResponses:'passed',navigation:'passed'});
  await page.close();
 }
 fs.mkdirSync('docs/verification',{recursive:true});fs.writeFileSync('docs/verification/publications-browser-qa.json',JSON.stringify({base,results},null,2)+'\n');
 console.log('Publications browser QA passed: archive and hosted PDFs, thumbnails, sources and rights, responsive layouts, palettes, filters, keyboard order and original PDFs.');
}finally{await browser.close();}
