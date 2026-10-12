# Updating the publication

Use the private MCP at https://mcp.history.pm4gis.nz/mcp for sourced read/search, evidence tracing, timeline queries and small editorial patches. ChatGPT must complete Cloudflare Access OAuth as duane.wilkins@gmail.com. Access allows that identity only; no service-token policy remains. The old unauthenticated /mcp endpoint returns HTTP 410.

For a small edit, read the current publication revision, inspect the relevant passage and sources, submit a preview with the exact before/after values, review the returned digest and then publish using that one-use preview. The MCP stores these changes as an audited D1 editorial revision and includes them in subsequent MCP reads. This sidecar does not change the public website or GitHub source.

For an edit that must appear on the website, prepare a GitHub branch/PR with sources, run npm test and npm run build, and verify the Cloudflare Pages deployment and affected routes. GitHub remains the source for the public site's content. Do not treat a successful MCP sidecar write as a site release.

The /editor/ fallback prepares an offline draft and cannot write to GitHub. Its draft includes a base revision and is explicitly unvalidated; reconcile later changes before using it. Keep MCP editorial history and website commits as separate recovery points.
