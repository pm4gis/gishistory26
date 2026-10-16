import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const base='9154100596ddf94e5c697f1c7091ec0e9f97552d';
const names=['government-goes-spatial','mapping-land-as-data','the-spatial-infrastructure-idea','universities-build-a-field','becoming-a-gis-professional','an-industry-and-community-form','safety-policing-and-emergency-gis','conservation-and-environment'];
const sha=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
const manifestPath='content/preservation-manifest.json';
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const updates=[];
for(const name of names){
 const path='src/content/articles/'+name+'.json';
 const before=execFileSync('git',['show',base+':'+path],{maxBuffer:8*1024*1024});
 const now=fs.readFileSync(path);
 if(sha(before)!==manifest[path])throw Error('Old preservation baseline is not correct '+path);
 const old=JSON.parse(before.toString('utf8')),updated=JSON.parse(now.toString('utf8'));
 const oldNotes=old.sourceNotes||[],nowNotes=updated.sourceNotes||[];
 if(nowNotes.length!==oldNotes.length+1)throw Error('Only a single reviewed source note can be added to '+path);
 if(JSON.stringify(nowNotes.slice(0,oldNotes.length))!==JSON.stringify(oldNotes))throw Error('An accepted source note was modified: '+path);
 const oldFields=JSON.stringify({...old,sourceNotes:oldNotes});
 const updatedFields=JSON.stringify({...updated,sourceNotes:oldNotes});
 if(oldFields!==updatedFields)throw Error('Accepted article material changed beyond the new source note: '+path);
 const last=nowNotes.at(-1);
 if(!last?.id?.startsWith('source-')||!last.text?.trim())throw Error('New source note is not documented '+path);
 updates.push({path,old:manifest[path],current:sha(now),note:last.id});
 manifest[path]=sha(now);
}
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
const lines=[
 '# Reviewed source-note preservation update',
 '',
 'Base production source: \`'+base+'\`. Exactly eight complete story source files had a single new documented source note appended. For all eight files, this operation checked the previous file hash against the accepted preservation manifest and compared every existing key and pre-existing note to the original baseline. No accepted text or source note changed.',
 '',
 '| Story file | Before SHA-256 | Reviewed SHA-256 | New source note |',
 '| --- | --- | --- | --- |',
 ...updates.map(x=>'| \`'+x.path+'\` | \`'+x.old+'\` | \`'+x.current+'\` | \`'+x.note+'\` |'),
 '',
 'The public timeline uses the pre-2026 date cut-off. The originals are described in \`docs/research/eight-contributed-sources-20261017.md\`; no user-uploaded binary is falsely represented as hosted.',
 '',
 'Verification required: \`npm ci\`, \`npm test\`, \`npm run build\`, Chromium source-route QA and production Cloudflare deployment check.',
 ''
];
fs.writeFileSync('docs/verification/eight-source-notes-preservation-20261017.md',lines.join('\n'));
console.log('Preservation manuscript-only source-note update passed: '+updates.length+' existing articles, zero prose changes');
