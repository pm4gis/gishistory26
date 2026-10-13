import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { rawDataset } from '../src/lib/raw.mjs';
import { inspectContent } from '../src/lib/content-integrity.mjs';
import { reconcileMcpOperations } from '../src/lib/mcp-github-bridge.mjs';

const argv=process.argv.slice(2);
function arg(key){const p=argv.indexOf(key);return p<0?null:argv[p+1];}
const input=arg('--input');
const expectedHead=arg('--expected-head');
const apply=argv.includes('--apply');
const omitPrivate=argv.includes('--omit-private');
const reportPath=arg('--report');
if(!input)throw Error('Use --input mcp-operations.json [--expected-head COMMIT] [--omit-private] [--report path] [--apply]');
if(!fs.existsSync(input))throw Error('Input does not exist');
const envelope=JSON.parse(fs.readFileSync(input,'utf8'));
const currentHead=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(!expectedHead || !/^[0-9a-f]{40}$/.test(expectedHead))
  throw Error('A pinned --expected-head Git SHA is required for stale-edit protection');
if(expectedHead!==currentHead)throw Error('Stale Git HEAD. Prepare the editorial patch against the current branch.');
const base=rawDataset();
const result=reconcileMcpOperations(base,envelope,{permitPrivateOmissions:omitPrivate});
const safeReport={
  status:result.status,
  gitHead:currentHead,
  expectedMcpRevision:envelope.expectedMcpRevision,
  applied:result.applied,
  alreadyApplied:result.already,
  omittedPrivate:result.omitted,
  conflicts:result.conflicts,
  candidateHash:result.candidateHash||null
};
if(result.status==='prepared'){
  const problems=inspectContent(result.candidate);
  if(problems.length) {
    safeReport.status='invalid';
    safeReport.validationProblems=problems;
  }
}
if(apply && safeReport.status==='prepared' && execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim())
  throw Error('Refusing to apply with an uncommitted working tree');
if(reportPath){
  fs.mkdirSync(path.dirname(reportPath),{recursive:true});
  fs.writeFileSync(reportPath,JSON.stringify(safeReport,null,2)+'\n');
}
console.log(JSON.stringify(safeReport,null,2));
if(safeReport.status!=='prepared')process.exitCode=1;
else if(apply) {
  const filesById=new Map();
  for(const col of ['records','passages','events']){
    for(const file of fs.readdirSync('src/content/'+col).filter(f=>f.endsWith('.json'))){
      const location='src/content/'+col+'/'+file;
      const id=JSON.parse(fs.readFileSync(location,'utf8')).id;
      if(filesById.has(id))throw Error('Duplicate content ID '+id);
      filesById.set(id,{location,col});
    }
  }
  const changes=[];
  for(const op of result.patch.operations){
    const entry=filesById.get(op.value.id);
    if(!entry||entry.col!==op.collection)throw Error('File mapping no longer matches '+op.value.id);
    changes.push({path:entry.location,content:JSON.stringify(op.value,null,2)+'\n'});
  }
  // Prepare all outputs and checksums before touching a published source file.
  const manifestPath='content/preservation-manifest.json';
  const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  for(const change of changes)manifest[change.path]=crypto.createHash('sha256').update(change.content).digest('hex');
  if(changes.length)changes.push({path:manifestPath,content:JSON.stringify(manifest,null,2)+'\n'});
  for(const change of changes)fs.writeFileSync(change.path,change.content);
  console.log('Applied '+result.patch.operations.length+' verified record replacements locally. Commit via GitHub PR; Cloudflare Pages publishes the merged commit.');
}
