import {chromium} from 'playwright';
const slugs=['linz-geodetic-marks-layer-2015','linz-motorways-layer-2015','linz-parcel-wireframe-layer-2015'];
const browser=await chromium.launch({headless:true});
try {
 for(const width of [390,1366]){
  const page=await browser.newPage({viewport:{width,height:850}});
  await page.goto('http://127.0.0.1:4321/images/',{waitUntil:'domcontentloaded'});
  for(const slug of slugs){
   const link=page.locator('a.image-index-card[href="/images/'+slug+'/"]');
   if(await link.count()!==1)throw Error('Missing image archive tile '+slug);
   await link.click();
   if(new URL(page.url()).pathname!=='/images/'+slug+'/')throw Error('Wrong detail route '+slug);
   if(!(await page.locator('.image-detail-figure img').evaluate(img=>img.complete&&img.naturalWidth>0)))throw Error('Image failed to load '+slug);
   if(!(await page.locator('a[download]').count()))throw Error('No preserved original download '+slug);
   if(!((await page.locator('.image-source-card').innerText()).includes('Creative Commons Attribution 3.0 New Zealand')))throw Error('Missing licence '+slug);
   if(await page.locator('a[href*="#ch"]').count())throw Error('Premature chapter association '+slug);
   await page.goto('http://127.0.0.1:4321/images/',{waitUntil:'domcontentloaded'});
  }
  await page.close();
 }
 console.log('Desktop/mobile archive cards, detail navigation, image loading and licence passed');
} finally {await browser.close();}
