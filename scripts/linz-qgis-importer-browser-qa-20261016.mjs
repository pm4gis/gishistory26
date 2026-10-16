import {chromium} from 'playwright';
const slugs=['linz-qgis-data-importer-settings-2018','linz-qgis-data-importer-demo-2021'];
const browser=await chromium.launch({headless:true});
try{
 for(const width of [390,1366]){
  const page=await browser.newPage({viewport:{width,height:850}});
  for(const slug of slugs){
   await page.goto('http://127.0.0.1:4321/images/',{waitUntil:'domcontentloaded'});
   const link=page.locator('a.image-index-card[href="/images/'+slug+'/"]');
   if(await link.count()!==1)throw Error('Missing archive tile '+slug);
   await link.click();
   if(new URL(page.url()).pathname!=='/images/'+slug+'/')throw Error('Wrong archive route '+slug);
   if(!await page.locator('.image-detail-figure img').evaluate(img=>img.complete&&img.naturalWidth>0))throw Error('Image not loaded '+slug);
   if(await page.locator('a[href*="/assets/historical/licences/"]').count()!==1)throw Error('Licence notice missing '+slug);
   const href=await page.locator('a[href*="/assets/historical/licences/"]').getAttribute('href');
   const response=await page.request.get('http://127.0.0.1:4321'+href);
   if(!response.ok()||!(await response.text()).includes('Copyright 2018-2021'))throw Error('Full original licence inaccessible');
   if(!await page.locator('a[download]').count())throw Error('Original GIF/PNG download missing '+slug);
  }
  await page.close();
 }
 console.log('Responsive archive image, navigation, source licence and original links passed');
}finally{await browser.close()}
