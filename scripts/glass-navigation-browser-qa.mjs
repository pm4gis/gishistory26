import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const folder='docs/verification/glass-nav-qa';mkdirSync(folder,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox']});const results=[];
try{
 for(const width of [1440,1280,1024,768,390,320]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const page=await context.newPage();
  await page.goto(base+'/');
  const mobile=width<=1180;
  const nav=page.locator(mobile?'.nav--mobile':'.nav--desktop');
  if(mobile){await page.locator('.mobile-menu > summary').focus();await page.keyboard.press('Enter');}
  for(const route of ['read','timeline','themes','datasets','network','about','publications','search'])assert.equal(await nav.locator('a[href="/'+route+'/"]').isVisible(),true);
  assert.equal(await nav.locator('.nav-contribute').isVisible(),true);
  assert.equal(await nav.getByRole('link',{name:'People',exact:true}).isVisible(),true);
  assert.equal(await nav.getByRole('link',{name:'Organisations',exact:true}).isVisible(),true);
  assert.equal(await nav.locator('.nav-dropdown').count(),0);
  const links=await nav.locator('a').all();for(const a of links){await a.focus();assert.equal(await a.evaluate(el=>el===document.activeElement),true);}
  if(mobile){await page.keyboard.press('Escape');assert.equal(await page.locator('.mobile-menu').evaluate(el=>el.open),false);}
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  for(const palette of ['slate','coastal','forest','archive','bubblegum']){
   await page.locator('#palette').click();await page.locator('[data-appearance-palette="'+palette+'"]').click();
   for(const mode of ['dark','light']){await page.locator('[data-appearance-mode="'+mode+'"]').click();
    const contrast=await page.evaluate(()=>{
     const css=getComputedStyle(document.documentElement);
     const lum=(name)=>{let hex=css.getPropertyValue('--'+name).trim().slice(1);if(hex.length===3)hex=[...hex].map(c=>c+c).join('');const vals=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return vals.reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0)};
     return ['text','muted'].map(n=>{const [a,b]=[lum(n),lum('surface')].sort((a,b)=>b-a);return(a+.05)/(b+.05)});
    });assert.ok(contrast.every(x=>x>=4.5),palette+' '+mode+' contrast '+contrast);
   }
   await page.keyboard.press('Escape');
  }
  await page.screenshot({path:folder+'/'+width+'.png'});results.push({width,passed:true});await context.close();console.log('PASS direct navigation, keyboard, palettes '+width);
 }
}finally{await browser.close();writeFileSync(folder+'/results.json',JSON.stringify(results,null,2)+'\n');}
