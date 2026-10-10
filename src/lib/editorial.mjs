import crypto from 'node:crypto';
export const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
function retained(old,next,location){
 if(Array.isArray(old)){
  if(!Array.isArray(next)||next.length<old.length)throw Error('Removal requires a reviewed migration: '+location);
  old.forEach((item,i)=>{
   const match=item&&typeof item==='object'&&item.id?next.find(n=>n?.id===item.id):next[i];
   if(item&&typeof item==='object'&&item.id&&!match)throw Error('Permanent block ID removed: '+item.id);
   retained(item,match,location+'['+i+']');
  });
 }else if(old&&typeof old==='object'){
  if(!next||typeof next!=='object'||Array.isArray(next))throw Error('Structured field removed: '+location);
  for(const key of Object.keys(old)){
   if(!Object.hasOwn(next,key))throw Error('Existing field removed: '+location+'.'+key);
   retained(old[key],next[key],location+'.'+key);
  }
 }
}
export function preparePatch(base,operations){
 const patch={schemaVersion:1,baseRevision:hash(base),operations};
 return {...patch,candidateHash:hash(applyPatch(base,patch))};
}
export function applyPatch(base,patch){
 if(patch.baseRevision!==hash(base))throw Error('Stale content revision');
 if(!Array.isArray(patch.operations))throw Error('Patch operations required');
 const target=structuredClone(base);const seen=new Set();
 for(const op of patch.operations){
  if(!['articles','passages','records','events','relationships','themes','images'].includes(op.collection))throw Error('Invalid collection');
  if(!['add','replace'].includes(op.action))throw Error('Unsupported operation; removals require a separate reviewed migration');
  const key=op.collection+':'+op.value?.id;
  if(seen.has(key))throw Error('Duplicate patch operation');seen.add(key);
  if(!op.value?.id)throw Error('Missing permanent ID');
  const collection=target[op.collection];const i=collection.findIndex(x=>x.id===op.value.id);
  if(op.action==='add'&&i>=0)throw Error('Duplicate permanent ID');
  if(op.action==='replace'&&i<0)throw Error('Unknown permanent ID');
  if(i>=0){
   const old=collection[i];
   if(old.url&&op.value.url!==old.url)throw Error('Route change requires a redirect migration');
   retained(old,op.value,key);
   if(hash(old)!==hash(op.value)&&op.acceptedEditorialChange!==true)throw Error('Content change needs explicit editorial acceptance');
   collection[i]=op.value;
  }else collection.push(op.value);
 }
 if(patch.candidateHash&&patch.candidateHash!==hash(target))throw Error('Candidate checksum mismatch');
 return target;
}
