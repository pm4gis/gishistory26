# Cutover bridge

This Worker sends reader requests for history.pm4gis.nz and gishistory.pm4gis.nz to the Cloudflare Pages origin, retains the canonical /data.json route, and redirects the old hostname. It returns HTTP 410 for /mcp and /mcp/* so the old unauthenticated MCP cannot bypass the OAuth-protected Worker on mcp.history.pm4gis.nz.

The public site remains public. This route change retires only the old unauthenticated MCP transport; authenticated MCP requests use the separate Cloudflare Access application.
