import {chromium} from 'playwright';
import {contributedPrimarySources} from '../src/lib/contributed-primary-sources.mjs';
const browser=await chromium.launch({headless:true});
try{
 for(const width of [390,1366]){
  const page=await browser.newPage({viewport:{width,height:850}});
  await page.goto('http://127.0.0.1:4321/sources/documents/',{waitUntil:'domcontentloaded'});
  for(const s of contributedPrimarySources){
   const link=page.locator('a[href="/sources/documents/'+s.slug+'/"]');
   if(await link.count()!==1)throw Error('Missing source catalogue link: '+s.slug);
   await link.click();
   if(new URL(page.url()).pathname!=='/sources/documents/'+s.slug+'/')throw Error('Wrong source page: '+s.slug);
   if(!(await page.locator('main').innerText()).includes(s.eventLabel))throw Error('Missing source relationship summary: '+s.slug);
   if(!(await page.locator('a[href="/timeline/?event=source-'+s.slug+'"]').count()))throw Error('Missing timeline link: '+s.slug);
   await page.goto('http://127.0.0.1:4321/sources/documents/',{waitUntil:'domcontentloaded'});
  }
  await page.close();
 }
 console.log('Eight source pages and timeline links passed mobile and desktop browser QA');
}finally{await browser.close()}
