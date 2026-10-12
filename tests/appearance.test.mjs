import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PALETTE_ORDER,PALETTE_NAMES,PALETTE_TOKENS,APPEARANCE_KEY,DEFAULT_APPEARANCE,readAppearance,resolveAppearance,saveAppearance,contrastRatio} from '../src/lib/appearance.mjs';

const css=readFileSync('src/styles/site.css','utf8');
const layout=readFileSync('src/layouts/Layout.astro','utf8');
const network=readFileSync('src/lib/network.ts','utf8');
const storage=(initial={})=>{
 const map=new Map(Object.entries(initial));
 return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value)};
};
test('Slate Blue dark is the default for a new visitor',()=>{
 assert.deepEqual(readAppearance(storage()),DEFAULT_APPEARANCE);
 assert.deepEqual(DEFAULT_APPEARANCE,{palette:'slate',mode:'dark'});
 assert.match(css,/:root\{font-family:'DM Sans Variable'/);
 assert.match(layout,/id="appearance-panel"/);
 assert.match(layout,/id="palette"/);
});
test('all five palettes have AA text, link, secondary text and prominent button contrast in light and dark modes',()=>{
 assert.deepEqual(PALETTE_ORDER,['slate','coastal','forest','archive','bubblegum']);
 assert.equal(PALETTE_NAMES.bubblegum,'Bubblegum');
 for(const palette of PALETTE_ORDER)for(const mode of ['dark','light']){
  const tokens=PALETTE_TOKENS[palette][mode];
  const pairs=[
   ['body',tokens.text,tokens.bg],['panel',tokens.text,tokens.surface],
   ['secondary',tokens.muted,tokens.surface],['link',tokens.link,tokens.surface],
   ['button',tokens['accent-on'],tokens.accent]
  ];
  for(const [label,foreground,background] of pairs){
   assert.ok(contrastRatio(foreground,background)>=4.5,palette+'/'+mode+' '+label+' contrast');
  }
  const selector=palette==='slate'&&mode==='dark'?':root':':root[data-palette="'+palette+'"][data-appearance="'+mode+'"]';
  assert.ok(css.includes(selector+'{'),selector+' missing');
  for(const [key,value] of Object.entries(tokens)){
   assert.ok(css.includes('--'+key+':'+value),palette+'/'+mode+' '+key+' mismatch');
  }
 }
});
test('legacy four-state theme settings migrate and chosen settings persist',()=>{
 const legacy={
  night:['coastal','dark'],forest:['forest','dark'],paper:['archive','light'],mist:['coastal','light'],
  'dark-night':['coastal','dark'],'dark-forest':['forest','dark'],
  'light-paper':['archive','light'],'light-mist':['coastal','light']
 };
 for(const [previous,[palette,mode]] of Object.entries(legacy)){
  const key=previous.includes('-')?'nzgis-colour-palette-v1':'nzgis-theme';
  assert.deepEqual(readAppearance(storage({[key]:key==='nzgis-theme'?previous:JSON.stringify(previous)})),{palette,mode});
 }
 const writable=storage();
 assert.equal(saveAppearance(writable,{palette:'bubblegum',mode:'system'}),true);
 assert.deepEqual(readAppearance(writable),{palette:'bubblegum',mode:'system'});
 assert.ok(writable.getItem(APPEARANCE_KEY));
 assert.deepEqual(readAppearance(storage({[APPEARANCE_KEY]:'bad data'})),DEFAULT_APPEARANCE);
});
test('system mode resolves using the device preference while explicit selections remain stable',()=>{
 assert.equal(resolveAppearance('system',true),'dark');
 assert.equal(resolveAppearance('system',false),'light');
 assert.equal(resolveAppearance('dark',false),'dark');
 assert.equal(resolveAppearance('light',true),'light');
});
test('accessible appearance controls and palette-aware network rendering are connected',()=>{
 assert.match(network,/getComputedStyle\(document.documentElement\)/);
 assert.match(network,/attributeFilter:\['data-palette','data-appearance'\]/);
 assert.match(layout,/aria-controls="appearance-panel"/);
 assert.match(layout,/aria-pressed="false"/);
 assert.match(layout,/prefers-color-scheme: dark/);
 assert.match(layout,/media.addEventListener\('change'/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/\.timeline-event-photo\{filter:none\}/);
});
