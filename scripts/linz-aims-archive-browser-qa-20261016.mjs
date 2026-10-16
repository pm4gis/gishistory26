import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('docs/media/linz-aims-qgis-2024-20261016.json','utf8'));
const browser=await chromium.launch({headless:true});
try{
 for(const width of [390,1366]){
  const page=await browser.newPage({viewport:{width,height:850}});
  for(const item of manifest.images){
   await page.goto('http://127.0.0.1:4321/images/',{waitUntil:'domcontentloaded'});
   const tile=page.locator('a.image-index-card[href="/images/'+item.slug+'/"]');
   if(await tile.count()!==1)throw Error('Missing archive tile '+item.slug);
   await tile.click();
   if(new URL(page.url()).pathname!=='/images/'+item.slug+'/')throw Error('Wrong image-detail link '+item.slug);
   if(!(await page.locator('.image-detail-figure img').evaluate(el=>el.complete&&el.naturalWidth>0)))throw Error('Image failed '+item.slug);
   const copyright=page.locator('a[href="'+manifest.licenceLocal+'"]');
   if(await copyright.count()!==1)throw Error('Full publisher licence missing '+item.slug);
   const notice=await page.request.get('http://127.0.0.1:4321'+manifest.licenceLocal);
   if(!notice.ok()||!(await notice.text()).includes('Copyright (c) 2015'))throw Error('Full original licence bytes missing');
   if(await page.locator('a[download]').count()!==1)throw Error('Original download missing '+item.slug);
  }
  await page.close();
 }
 console.log('Three source-verified LINZ AIMS image pages, original downloads and BSD notice passed mobile and desktop Chromium QA.');
}finally{await browser.close()}
