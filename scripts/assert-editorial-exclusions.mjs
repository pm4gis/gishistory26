/**
 * Defend the generated history site against reintroducing editorial exclusions.
 * Names are assembled from parts to avoid a spurious match in this guard.
 * Scan all authored site surfaces, not the unserved research / documentation.
 */
import fs from 'node:fs';
import path from 'node:path';
const targets=[
 ['Stuart','Waring'],
 ['Claire','Johnstone'],
 ['Claire','Johnston']
];
const keys=targets.map(parts=>({
 display:parts.join(' '),
 spaced:new RegExp('\\b'+parts.join('[\\s._/-]+')+'\\b','i'),
 concatenated:parts.join('').toLowerCase()
}));
const roots=['src','public','dist'];
const textExt=new Set(['.json','.jsonld','.md','.mdx','.mjs','.js','.cjs','.ts','.tsx','.jsx','.astro','.svelte','.html','.htm','.css','.svg','.txt','.xml','.csv','.yml','.yaml','.toml']);
const skips=new Set(['node_modules','.git','dist','build','.astro','.cache','_astro']);
const findings=[];
let checked=0;
function walk(where){
 if(!fs.existsSync(where))return;
 for(const d of fs.readdirSync(where,{withFileTypes:true})){
  if(skips.has(d.name))continue;
  const pathname=path.join(where,d.name),rel=pathname.replaceAll('\\','/');
  for(const key of keys)if(rel.toLowerCase().includes(key.concatenated) || key.spaced.test(rel))findings.push({path:rel,match:key.display,location:'filename'});
  if(d.isDirectory()){walk(pathname);continue}
  if(!d.isFile()||!textExt.has(path.extname(d.name).toLowerCase()))continue;
  const body=fs.readFileSync(pathname,'utf8');
  checked++;
  const lines=body.split(/\r?\n/);
  for(let i=0;i<lines.length;i++){
   for(const key of keys){
    key.spaced.lastIndex=0;
    if(key.spaced.test(lines[i]) || lines[i].toLowerCase().includes(key.concatenated))findings.push({path:rel,line:i+1,match:key.display,excerpt:lines[i].slice(0,180)});
   }
  }
 }
}
for(const root of roots)walk(root);
console.log(JSON.stringify({checkedFiles:checked,excludedIdentityCount:keys.length,matchingReferences:findings.length,findings},null,2));
if(findings.length)process.exitCode=1;
