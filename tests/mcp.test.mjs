import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest} from '../functions/mcp.js';

test('the unauthenticated legacy MCP endpoint is retired',async()=>{
  for(const method of ['GET','POST']){
    const request=new Request('https://example.org/mcp',{method});
    const response=await onRequest({request});
    assert.equal(response.status,410);
    assert.match(response.headers.get('content-type')||'',/^application\\/json\\b/);
    assert.equal(response.headers.get('cache-control'),'no-store');
    const body=await response.json();
    assert.equal(body.endpoint,'https://mcp.history.pm4gis.nz/mcp');
  }
});
