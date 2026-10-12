addEventListener('fetch', event => event.respondWith(handle(event.request)));
async function handle(request) {
  const incoming = new URL(request.url);
  if (incoming.hostname === 'gishistory.pm4gis.nz') {
    incoming.hostname = 'history.pm4gis.nz';
    incoming.protocol = 'https:';
    return Response.redirect(incoming.toString(), 301);
  }
  if (incoming.pathname === '/mcp' || incoming.pathname.startsWith('/mcp/')) {
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
  if (incoming.pathname === '/data.json' || incoming.pathname.startsWith('/__nzgis-feedback/')) {
    return fetch(request);
  }
  const upstream = new URL('https://gishistory26.pages.dev');
  upstream.pathname = incoming.pathname;
  upstream.search = incoming.search;
  const res = await fetch(new Request(upstream.toString(), request), { redirect: 'manual' });
  const headers = new Headers(res.headers);
  const location = headers.get('location');
  if (location) {
    try {
      const u = new URL(location, upstream);
      if (u.hostname === 'gishistory26.pages.dev') {
        u.hostname = incoming.hostname;
        headers.set('location', u.toString());
      }
    } catch {}
  }
  headers.set('x-nzgis-history-routing', 'gishistory26');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}