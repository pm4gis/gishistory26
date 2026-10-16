import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const base='ead680f09d2c06247810a6aa6420f521e78dce45';
const path='content/preservation-manifest.json';
const manifest=JSON.parse(fs.readFileSync(path));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const previousReport='docs/verification/publications-preservation-20261017.json';
const rows=fs.existsSync(previousReport)?JSON.parse(fs.readFileSync(previousReport)).updates:[];
for(const [file,expected] of Object.entries(manifest)){
 const now=fs.readFileSync(file);if(hash(now)===expected)continue;
 const old=execFileSync('git',['show',base+':'+file],{maxBuffer:8000000});
 if(hash(old)!==expected)throw Error('Stale preservation baseline: '+file);
 const before=JSON.parse(old),after=JSON.parse(now);
 if(file.startsWith('src/content/records/')){
  // Only append documentary contributions and evidence. Every accepted field remains exact.
  for(const key of ['sources','contentSections']){
   const a=before[key]||[],b=after[key]||[];
   if(JSON.stringify(b.slice(0,a.length))!==JSON.stringify(a))throw Error('Existing '+key+' changed: '+file);
   delete before[key];delete after[key];
  }
  if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Accepted record fields changed: '+file);
 }else if(file.startsWith('src/content/events/source-')){
  for(const key of ['passageIds','recordIds','themeIds']){
   if(!(before[key]||[]).every(id=>(after[key]||[]).includes(id)))throw Error('Accepted event link lost: '+file);
   delete before[key];delete after[key];
  }
  if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Event chronology or prose changed: '+file);
 }else if(file==='src/content/passages/chapter-29-p003.json'){
  const oldBlock=before.blocks.find(b=>b.text?.includes('if 2007 was skipped'));
  const newBlock=after.blocks.find(b=>b.id===oldBlock?.id);
  if(!oldBlock||!newBlock?.text?.includes('7–9 November 2007')||!newBlock.sources?.some(s=>s.url==='/publications/cfrt-gis-conference-handout-2007/'))throw Error('Unreviewed conference correction');
  const checked={...after,blocks:after.blocks.map(b=>b.id===oldBlock.id?oldBlock:b)};
  if(JSON.stringify(before)!==JSON.stringify(checked))throw Error('Unrelated passage changes: '+file);
 }else if(file==='src/content/passages/preface-p001.json'){
  const oldBlock=before.blocks.find(b=>b.text==='I chose the end of 2025 as the stopping point because history needed a boundary.');
  const at=before.blocks.indexOf(oldBlock);
  if(at<0||!after.blocks[at]?.text?.includes('data from LINZ, Stats NZ and NIWA')||after.blocks.length!==before.blocks.length)throw Error('Unreviewed preface change');
  const checked={...after,blocks:after.blocks.map((b,i)=>i===at?oldBlock:b)};
  if(JSON.stringify(before)!==JSON.stringify(checked))throw Error('Unrelated preface change');
 }else throw Error('Unreviewed baseline change: '+file);
 rows.push({file,before:expected,after:hash(now)});manifest[file]=hash(now);
}
fs.writeFileSync(path,JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync('docs/verification/publications-preservation-20261017.json',JSON.stringify({base,checkedAt:'2026-10-17',checks:'Existing record fields and array prefixes preserved; original event identities, prose and dates preserved; documentary contributions and links appended. One exact source-backed paragraph correction resolves the misleading 2007 conference gap using the dated CFRT handout. The author-supplied explanation for the 2025 stopping point replaces one preface paragraph. All other passage fields and blocks are unchanged.',updates:rows},null,2)+'\n');
console.log('Reviewed preservation updates: '+rows.length);
