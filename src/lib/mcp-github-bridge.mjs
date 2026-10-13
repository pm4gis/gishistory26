import { preparePatch, applyPatch, hash } from './editorial.mjs';

// The MCP owns authenticated previews, but Git remains the public publication's source.
// This bridge deliberately cannot import MCP-only researchSources into public records.
const equality = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const clone = v => structuredClone(v);
const PRIVATE = new Set(['researchSources','sourceNotes']);
const collections = ['records','passages','events'];

function pathTokens(input) {
  if (typeof input !== 'string' || input.length > 240 || !input) throw Error('Invalid path');
  const part = input.startsWith('/') ? input.slice(1).split('/') : input.replace(/\[(\d+)\]/g, '.$1').split('.');
  if (!part.length || part.some(s => !s || ['__proto__','prototype','constructor'].includes(s))) throw Error('Invalid path token');
  return part.map(s => /^(0|[1-9]\d*)$/.test(s) ? Number(s) : s);
}
function pathValue(obj, parts) {
  let node = obj;
  for (const p of parts) {
    if (node == null || !Object.hasOwn(Object(node),p)) return undefined;
    node = node[p];
  }
  return node;
}
function permitted(item, collection, parts, after) {
  const [a,b,c,d,e] = parts;
  if (PRIVATE.has(a)) return 'private_field';
  if (collection==='records') {
    if (a==='name' && parts.length===1 && item.kind==='Person' && typeof after==='string' && after.trim() && after.length<=200) return null;
    if (a==='story' && parts.length===2 && Number.isInteger(b) && typeof after==='string' && after.length<=20000) return null;
    if (a==='sources' && parts.length===1 && safeSources(after)) return null;
  }
  if (collection==='passages') {
    if (a==='blocks' && parts.length===3 && Number.isInteger(b) && c==='text' && typeof after==='string' && after.length<=20000) return null;
    if (a==='sources' && parts.length===1 && safeSources(after)) return null;
  }
  if (collection==='events') {
    if (['label','summary'].includes(a) && parts.length===1 && typeof after==='string' && after.trim() && after.length<=20000) return null;
    if (a==='sources' && parts.length===1 && safeSources(after)) return null;
  }
  return 'unsupported_field';
}
function safeSources(v) {
  return Array.isArray(v) && v.length<=50 && v.every(s => s && typeof s==='object' && !Array.isArray(s) &&
    Object.keys(s).every(k => ['id','label','title','url','note','accessed','date'].includes(k)) &&
    typeof s.label==='string' && s.label.trim() &&
    (!s.url || /^https?:\/\/|^\//.test(s.url)));
}
function replaceValue(obj, parts, after) {
  let node=obj;
  for(let i=0;i<parts.length-1;i++) node=node[parts[i]];
  node[parts.at(-1)]=clone(after);
  if(parts[0]==='blocks' && parts[2]==='text' && 'markdown' in obj.blocks[parts[1]]) {
    obj.blocks[parts[1]].markdown=after;
  }
}

/**
 * Reconcile authenticated MCP D1 operations against the CURRENT GitHub corpus.
 * Invalid/stale/publicly prohibited operations are reported, never quietly ignored.
 * By default no patch can be produced while blocked operations remain.
 */
export function reconcileMcpOperations(base, envelope, {permitPrivateOmissions=false}={}) {
  if(!envelope || !Array.isArray(envelope.operations) || !envelope.operations.length)
    throw Error('An MCP operations envelope is required');
  if(typeof envelope.expectedMcpRevision!=='string' || !/^editorial-\d{6}$/.test(envelope.expectedMcpRevision))
    throw Error('Expected MCP revision is required');
  const data=clone(base);
  const lookup=new Map();
  for(const collection of collections) for(const item of data[collection]||[]) {
    if(lookup.has(item.id)) throw Error('Duplicate source ID '+item.id);
    lookup.set(item.id,{item,collection});
  }
  const changed=new Map(), omitted=[], conflicts=[], already=[];
  for(const [position,op] of envelope.operations.entries()) {
    const entry={position,recordId:op?.recordId||null,path:op?.path||null};
    const target=lookup.get(op?.recordId);
    if(!target) {conflicts.push({...entry,reason:'record_missing'});continue;}
    if(!Object.hasOwn(op,'before') || !Object.hasOwn(op,'after')) {conflicts.push({...entry,reason:'malformed_operation'});continue;}
    let parts;
    try{parts=pathTokens(op.path)}catch{conflicts.push({...entry,reason:'invalid_path'});continue;}
    const restriction=permitted(target.item,target.collection,parts,op.after);
    if(restriction) { (restriction==='private_field'?omitted:conflicts).push({...entry,reason:restriction});continue; }
    const current=pathValue(target.item,parts);
    if(current===undefined) {conflicts.push({...entry,reason:'missing_field'});continue;}
    if(equality(current,op.after)) {already.push(entry);continue;}
    if(!equality(current,op.before)) {conflicts.push({...entry,reason:'stale_before_value'});continue;}
    replaceValue(target.item,parts,op.after);
    changed.set(op.recordId,target);
  }
  if(conflicts.length || (omitted.length && !permitPrivateOmissions)) return {
    status:'blocked', conflicts, omitted, already, applied:[], patch:null,
    reason: conflicts.length?'Conflicts or unsupported public fields require resolution':'Private MCP fields require explicit omission acknowledgement'
  };
  const operations=[...changed.values()].map(({item,collection}) => ({
    action:'replace', collection, value:item, acceptedEditorialChange:true
  }));
  const patch=preparePatch(base,operations);
  const candidate=applyPatch(base,patch);
  return {
    status:'prepared', conflicts:[], omitted, already,
    applied:operations.map(op=>({recordId:op.value.id,collection:op.collection})),
    patch, candidateHash:hash(candidate), candidate
  };
}
