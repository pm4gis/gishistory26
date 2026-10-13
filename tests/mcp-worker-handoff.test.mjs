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
