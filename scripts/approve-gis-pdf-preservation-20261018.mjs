import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

// Reviewed additive chapter changes accompanying the five verified 1998–2025 PDFs.
// Preserve every existing block and all unrelated metadata byte-for-byte in meaning.
const base='a9a06735f4306bd130abfbf287f806fada3d01b5';
const additions={
 'chapter-26-p003':'doc-conservation-science-newsletter-28-29-1998',
 'chapter-23-p017':'auckland-liquefaction-mapping-2021',
 'chapter-34-p012':'auckland-watercourse-methodology-2016',
 'chapter-29-p011':'nz-geospatial-industry-profile-survey-2023',
 'chapter-35-p013':'auckland-water-quality-data-explorer-2025'
};
const path='content/preservation-manifest.json';
const manifest=JSON.parse(fs.readFileSync(path,'utf8'));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const rows=[];
for(const [stem,slug] of Object.entries(additions)){
 const file='src/content/passages/'+stem+'.json';
 const now=fs.readFileSync(file);
 const expected=manifest[file];
 const current=hash(now);
 if(current===expected){rows.push({file,status:'already-approved',sha256:current});continue;}
 const old=execFileSync('git',['show',base+':'+file],{maxBuffer:8e6});
 if(hash(old)!==expected)throw Error('Unreviewed change or stale base: '+file);
 const before=JSON.parse(old),after=JSON.parse(now);
 const newId='archive-pdf-'+slug;
 const added=after.blocks?.filter(block=>block.id===newId)||[];
 if(added.length!==1||added[0].type!=='paragraph'||!added[0].text||added[0].text!==added[0].markdown||!added[0].sources?.some(s=>s.url==='/publications/pdf/'+slug+'/'))
  throw Error('Added source paragraph does not match reviewed entry: '+file);
 const other={...after,blocks:after.blocks.filter(block=>block.id!==newId)};
 if(JSON.stringify(other)!==JSON.stringify(before))throw Error('Accepted content or relationships changed: '+file);
 manifest[file]=current;
 rows.push({file,status:'approved-additive',sourceSlug:slug,oldSha256:expected,newSha256:current});
}
fs.writeFileSync(path,JSON.stringify(manifest,null,2)+'\n');
fs.mkdirSync('docs/verification',{recursive:true});
fs.writeFileSync('docs/verification/gis-pdf-chapter-preservation-20261018.json',JSON.stringify({base,reviewType:'One new source-backed paragraph per designated passage; all existing blocks, metadata and historical relationships unchanged',rows},null,2)+'\n');
console.log('GIS PDF chapter preservation accepted: '+rows.filter(x=>x.status==='approved-additive').length+' additive passages');
