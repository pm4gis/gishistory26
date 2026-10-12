export async function onRequest() {
  return new Response(JSON.stringify({
    error: 'This unauthenticated MCP endpoint has been retired.',
    endpoint: 'https://mcp.history.pm4gis.nz/mcp',
  }), {
    status: 410,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
