# Live MCP

This Worker serves the Streamable HTTP MCP endpoint at https://mcp.history.pm4gis.nz/mcp. Cloudflare Access protects the custom domain with OAuth; the only allowlisted user is duane.wilkins@gmail.com. The legacy anonymous history.pm4gis.nz/mcp route is retired.

The Worker reads https://history.pm4gis.nz/editor-data.json, applies audited D1 editorial operations to subsequent MCP reads, and stores one-use preview tokens in KV. A small MCP edit updates the sidecar editorial revision only; it does not commit GitHub content or rebuild the public site. Use a GitHub-reviewed source change when an edit must appear on the site.

Bindings are declared in wrangler.toml. The Cloudflare Access application and its single-email policy are separate Zero Trust resources and must remain configured when deploying this script. Do not add a service-token policy to that application.
