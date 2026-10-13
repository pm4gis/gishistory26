import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/nzgis-history-live-mcp/index.mjs';

const rpc=async (env,name,args={})=>{
  const request=new Request('https://mcp.history.pm4gis.nz/mcp',{
    method:'POST',headers:{'content-type':'application/json'},
    body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/call',params:{name,arguments:args}})
  });
  return (await worker.fetch(request,env,{})).json();
};
const state={revision:'editorial-000008',sequence:8,updated_at:'2026-10-12T07:06:44Z',summary:'Earlier verified editorial revision',operations_json:JSON.stringify([
 {recordId:'person:alpha',path:'/story/0',before:'Old account',after:'New account'},
 {recordId:'person:alpha',path:'/researchSources',before:[],after:[{label:'Private register',url:'https://example.org/private'}]}
])};
test('MCP tool list distinguishes a Git handoff from private sidecar publication',async()=>{
 const request=new Request('https://mcp.history.pm4gis.nz/mcp',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/list'})});
 const response=await worker.fetch(request,{},{});const doc=await response.json();
 const tools=doc.result.tools;
 assert.ok(tools.some(x=>x.name==='prepare_github_publication'));
 assert.match(tools.find(x=>x.name==='publish_history_patch').description,/DOES NOT update the public website/);
});
test('Git handoff omits private operations and rejects a stale MCP revision',async()=>{
 const originalFetch=globalThis.fetch;
 globalThis.fetch=async()=>new Response(JSON.stringify({revision:'git-verified',data:{records:[{id:'person:alpha',kind:'Person',name:'Alpha',story:['Old account']}],articles:[],passages:[],events:[],edges:[]}}),{status:200,headers:{'content-type':'application/json'}});
 const env={EDITORIAL_DB:{prepare(){return {async first(){return state;}}}}};
 try{
  const good=await rpc(env,'prepare_github_publication',{expectedRevision:'editorial-000008'});
  assert.equal(good.result.isError,false);
  assert.equal(good.result.structuredContent.operations.length,1);
  assert.equal(good.result.structuredContent.operations[0].path,'/story/0');
  assert.equal(good.result.structuredContent.privateOmissions.length,1);
  assert.equal(good.result.structuredContent.sourceRevision,'git-verified');
  assert.equal(good.result.structuredContent.publicWebsiteUpdated,false);
  const stale=await rpc(env,'prepare_github_publication',{expectedRevision:'editorial-000007'});
  assert.equal(stale.result.isError,true);
  assert.match(stale.result.content[0].text,/Stale MCP revision/);
 } finally {globalThis.fetch=originalFetch;}
});

test('MCP timeline and search exclude every event after 31 December 2025',async()=>{
 const originalFetch=globalThis.fetch;
 const dataset={records:[{id:'person:alpha',kind:'Person',name:'Alpha',story:['Old account']}],articles:[],passages:[],edges:[],events:[
  {id:'event:valid',year:2025,startDate:'2025-12-31',dateDisplay:'2025',label:'Survey completed',summary:'Historical survey completed in 2025',url:'/timeline/'},
  {id:'event:later',year:2026,startDate:'2026-01-01',dateDisplay:'2026',label:'Future webinar',summary:'2026 webinar',url:'/timeline/'},
  {id:'event:retrospective',year:2025,startDate:'2025-01-01',dateDisplay:'2025',label:'A programme',summary:'Work continued in 2027',url:'/timeline/'}
 ]};
 globalThis.fetch=async()=>new Response(JSON.stringify({revision:'github-test',data:dataset}),{status:200,headers:{'content-type':'application/json'}});
 const env={EDITORIAL_DB:{prepare(){return {async first(){return state;},async all(){return {results:[]};}}}}};
 try{
  const listed=await rpc(env,'list_timeline',{});
  assert.equal(listed.result.isError,false);
  assert.deepEqual(listed.result.structuredContent.events.map(event=>event.id),['event:valid']);
  const future=await rpc(env,'search_history',{query:'2026',kind:'Timeline event'});
  assert.equal(future.result.isError,false);
  assert.deepEqual(future.result.structuredContent.results,[]);
  const valid=await rpc(env,'search_history',{query:'Survey completed',kind:'Timeline event'});
  assert.deepEqual(valid.result.structuredContent.results.map(event=>event.id),['event:valid']);
  const publishedState=await rpc(env,'get_publication_state',{});
  assert.equal(publishedState.result.isError,false);
  assert.equal(publishedState.result.structuredContent.eventCount,1);
 } finally {globalThis.fetch=originalFetch;}
});
