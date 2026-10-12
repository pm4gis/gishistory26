// Named appearance palettes and persistence helpers, shared by the site and tests.
export const PALETTE_ORDER=Object.freeze(['slate','coastal','forest','archive','bubblegum']);
export const PALETTE_NAMES=Object.freeze({slate:'Slate Blue',coastal:'Coastal',forest:'Forest',archive:'Archive',bubblegum:'Bubblegum'});
const raw={
 slate:{dark:['#111A29','#1B283B','#253750','#E8EDF7','#B6C5D9','#6E849D','#A2C6FF','#B9D8FF','#12233A'],light:['#EEF2F8','#FFFFFF','#DFE8F3','#1B3045','#4B6175','#6E8499','#245B99','#20558E','#FFFFFF']},
 coastal:{dark:['#0B1522','#132234','#1B2D41','#E9EFF6','#A9BBCE','#64819D','#77DDCA','#8BE3D2','#0B1522'],light:['#EAF0F6','#FFFFFF','#DCE6F0','#192C43','#4C6076','#647F99','#075F70','#075F70','#FFFFFF']},
 forest:{dark:['#101D1B','#192B27','#233A34','#EBF2EC','#B4C7BD','#739884','#A4E2BB','#B0EAC5','#10231B'],light:['#F1F5EF','#FFFFFF','#E2EBE2','#21342A','#496153','#739181','#246B4A','#226746','#FFFFFF']},
 archive:{dark:['#241F1B','#352C26','#44362D','#F3EDE4','#D7C5B0','#9D856E','#E9B87B','#F4C993','#241F1B'],light:['#F5F0E6','#FFFCF5','#ECE4D6','#322922','#665444','#947D68','#805126','#75481F','#FFFFFF']},
 bubblegum:{dark:['#201027','#32183A','#49234D','#FBEAF6','#EAC4DE','#AA769D','#FF84D6','#FFA2DF','#30102C'],light:['#FFF0F8','#FFFFFF','#FFDAEE','#471236','#70415D','#AA7395','#BD126F','#9E095C','#FFFFFF']}
};
const names=['bg','surface','raised','text','muted','line','accent','link','accent-on'];
export const PALETTE_TOKENS=Object.freeze(Object.fromEntries(
 Object.entries(raw).map(([id,modes])=>[id,Object.fromEntries(
  Object.entries(modes).map(([mode,values])=>[mode,Object.fromEntries(values.map((value,i)=>[names[i],value]))])
 )])
));
export const APPEARANCE_KEY='nzgis-appearance-v2';
export const DEFAULT_APPEARANCE=Object.freeze({palette:'slate',mode:'dark'});
const MODES=new Set(['dark','light','system']);
function get(storage,key){try{return storage?.getItem(key)??null}catch{return null}}
export function readAppearance(storage){
 let saved;try{saved=JSON.parse(get(storage,APPEARANCE_KEY)||'null')}catch{}
 if(saved&&typeof saved==='object'){
  return {palette:Object.hasOwn(PALETTE_TOKENS,saved.palette)?saved.palette:'slate',
   mode:MODES.has(saved.mode)?saved.mode:'dark'};
 }
 let old=get(storage,'nzgis-theme');
 if(!old){try{old=JSON.parse(get(storage,'nzgis-colour-palette-v1')||'null')}catch{}}
 const legacy={'night':['coastal','dark'],'dark-night':['coastal','dark'],
  'forest':['forest','dark'],'dark-forest':['forest','dark'],
  'paper':['archive','light'],'light-paper':['archive','light'],
  'mist':['coastal','light'],'light-mist':['coastal','light']};
 const values=legacy[old];
 return values?{palette:values[0],mode:values[1]}:{...DEFAULT_APPEARANCE};
}
export function resolveAppearance(mode,systemDark){
 return mode==='system'?(systemDark?'dark':'light'):(mode==='light'?'light':'dark');
}
export function saveAppearance(storage,choice){
 try{storage?.setItem(APPEARANCE_KEY,JSON.stringify(choice));return true}catch{return false}
}
export function contrastRatio(first,second){
 const luminance=(hex)=>{
  const value=hex.replace('#','');
  if(!/^[0-9a-f]{6}$/i.test(value))throw new Error('Expected six-digit colour');
  const rgb=[0,2,4].map(i=>parseInt(value.slice(i,i+2),16)/255)
    .map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);
  return 0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2];
 };
 const x=luminance(first),y=luminance(second);
 return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);
}
