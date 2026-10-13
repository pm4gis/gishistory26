import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileMcpOperations } from '../src/lib/mcp-github-bridge.mjs';
import { applyPatch } from '../src/lib/editorial.mjs';

const base=()=>({
  records:[{id:'person:alpha',kind:'Person',name:'Alpha',story:['Original account'],sources:[],url:'/people/alpha/',slug:'alpha'}],
  passages:[{id:'passage:one',articleId:'article:one',slug:'one',blocks:[{type:'paragraph',text:'Original prose',markdown:'Original prose'}]}],
  events:[],articles:[],relationships:[],themes:[],images:[]
});
const envelope=operations=>({expectedMcpRevision:'editorial-000008',operations});
const storyPatch=()=>({recordId:'person:alpha',path:'/story/0',before:'Original account',after:'Sourced correction'});

test('prepares an explicitly accepted GitHub patch without mutating the source',()=>{
  const original=base(), input=envelope([storyPatch()]);
  const out=reconcileMcpOperations(original,input);
  assert.equal(out.status,'prepared');
  assert.equal(out.applied.length,1);
  assert.equal(out.candidate.records[0].story[0],'Sourced correction');
  assert.equal(original.records[0].story[0],'Original account');
  assert.equal(applyPatch(original,out.patch).records[0].story[0],'Sourced correction');
});
test('already committed edit is idempotent',()=>{
  const current=base();current.records[0].story[0]='Sourced correction';
  const out=reconcileMcpOperations(current,envelope([storyPatch()]));
  assert.equal(out.status,'prepared');
  assert.equal(out.applied.length,0);
  assert.equal(out.already.length,1);
});
test('stale before-values block publication',()=>{
  const current=base();current.records[0].story[0]='Independent later correction';
  const out=reconcileMcpOperations(current,envelope([storyPatch()]));
  assert.equal(out.status,'blocked');
  assert.equal(out.conflicts[0].reason,'stale_before_value');
  assert.equal(out.patch,null);
});
test('private research fields cannot become public content',()=>{
  const op={recordId:'person:alpha',path:'/researchSources',before:[],after:[{label:'Internal register',url:'https://example.org'}]};
  const blocked=reconcileMcpOperations(base(),envelope([storyPatch(),op]));
  assert.equal(blocked.status,'blocked');
  assert.deepEqual(blocked.omitted.map(x=>x.reason),['private_field']);
  const approved=reconcileMcpOperations(base(),envelope([storyPatch(),op]),{permitPrivateOmissions:true});
  assert.equal(approved.status,'prepared');
  assert.equal(approved.omitted.length,1);
  assert.deepEqual(approved.candidate.records[0].story,['Sourced correction']);
  assert.equal('researchSources' in approved.candidate.records[0],false);
});
test('sequential edits to the same field are checked in order',()=>{
  const second={...storyPatch(),before:'Sourced correction',after:'Final account'};
  const out=reconcileMcpOperations(base(),envelope([storyPatch(),second]));
  assert.equal(out.status,'prepared');
  assert.equal(out.applied.length,1);
  assert.equal(out.candidate.records[0].story[0],'Final account');
});
test('passage markdown is kept in sync with its visible text',()=>{
  const op={recordId:'passage:one',path:'/blocks/0/text',before:'Original prose',after:'Corrected prose'};
  const out=reconcileMcpOperations(base(),envelope([op]));
  assert.equal(out.status,'prepared');
  assert.equal(out.candidate.passages[0].blocks[0].markdown,'Corrected prose');
});
test('unsupported fields and prototype pollution fail closed',()=>{
  for(const path of ['/slug','/__proto__/polluted','/sections/0','/story/not-index']){
    const out=reconcileMcpOperations(base(),envelope([{recordId:'person:alpha',path,before:'x',after:'y'}]));
    assert.equal(out.status,'blocked',path);
    assert.equal(out.patch,null);
  }
  assert.equal({}.polluted,undefined);
});
test('requires revision and source record identity',()=>{
  assert.throws(()=>reconcileMcpOperations(base(),{operations:[storyPatch()]}),/revision/);
  const out=reconcileMcpOperations(base(),envelope([{...storyPatch(),recordId:'person:missing'}]));
  assert.equal(out.status,'blocked');
  assert.equal(out.conflicts[0].reason,'record_missing');
});
