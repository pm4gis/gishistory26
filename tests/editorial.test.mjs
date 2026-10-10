import test from 'node:test';import assert from 'node:assert/strict';import {preparePatch,applyPatch} from '../src/lib/editorial.mjs';
const base={articles:[],passages:[{id:'p1',blocks:[{type:'paragraph',text:'Accepted prose.'}]}],records:[{id:'r1',url:'/people/a/',name:'A'}],events:[],relationships:[],themes:[],images:[]};
test('stale patch rejects later additions',()=>{const patch=preparePatch(base,[{action:'add',collection:'records',value:{id:'r2',name:'B'}}]);const later=structuredClone(base);later.events.push({id:'e1'});assert.throws(()=>applyPatch(later,patch),/Stale/)});
test('draft adds records while preserving other collections',()=>{const patch=preparePatch(base,[{action:'add',collection:'records',value:{id:'r2',name:'B'}}]);const out=applyPatch(base,patch);assert.equal(out.records.length,2);assert.deepEqual(out.passages,base.passages);assert.equal(base.records.length,1)});
test('unapproved paragraph replacement fails',()=>assert.throws(()=>preparePatch(base,[{action:'replace',collection:'passages',value:{id:'p1',blocks:[{type:'paragraph',text:'Changed.'}]}}]),/acceptance/));
test('route identity and checksum protect publication',()=>{assert.throws(()=>preparePatch(base,[{action:'replace',collection:'records',value:{id:'r1',url:'/different/',name:'A'}}]),/Route/);const p=preparePatch(base,[]);p.candidateHash='bad';assert.throws(()=>applyPatch(base,p),/checksum/)});

test('approved replacement retains unknown nested fields',()=>{
 const original=structuredClone(base);original.records[0].extra={provenance:{reference:'archive-1'}};
 const value=structuredClone(original.records[0]);value.name='Corrected name';
 const out=applyPatch(original,preparePatch(original,[{action:'replace',collection:'records',value,acceptedEditorialChange:true}]));
 assert.deepEqual(out.records[0].extra,original.records[0].extra);
});
test('approval does not permit silent nested field loss',()=>{
 const original=structuredClone(base);original.records[0].extra={provenance:{reference:'archive-1'}};
 const value={...original.records[0],extra:{provenance:{}}};
 assert.throws(()=>preparePatch(original,[{action:'replace',collection:'records',value,acceptedEditorialChange:true}]),/field removed/);
});
test('approval does not remove a stable paragraph block',()=>{
 const original=structuredClone(base);original.passages[0].blocks[0].id='paragraph-1';
 const value={id:'p1',blocks:[{id:'paragraph-2',type:'paragraph',text:'Replacement.'}]};
 assert.throws(()=>preparePatch(original,[{action:'replace',collection:'passages',value,acceptedEditorialChange:true}]),/block ID removed/);
});
test('record replacements need explicit editorial acceptance',()=>{
 assert.throws(()=>preparePatch(base,[{action:'replace',collection:'records',value:{id:'r1',url:'/people/a/',name:'Changed'}}]),/acceptance/);
});
