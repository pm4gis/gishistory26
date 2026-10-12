# Architecture and operation

Astro renders the public publication from the GitHub source on Cloudflare Pages. Svelte provides the coordinated reader and timeline controls; the full prose and event list remain available without using the interactive timeline. The accepted production data contains 796 records, 2,502 relationships and 167 events.

The authenticated MCP runs as the Cloudflare Worker nzgis-history-live-mcp at https://mcp.history.pm4gis.nz/mcp. Cloudflare Access OAuth protects the endpoint and has one allow rule for duane.wilkins@gmail.com; the service-token bypass was removed. The legacy https://history.pm4gis.nz/mcp route returns HTTP 410. The Worker reads the current /editor-data.json feed, maps relationships and passages into the MCP search model, and applies its audited D1 editorial overlay to MCP read results. Writes use a revision check, exact preview digest and one-use token.

Small MCP edits are an audited sidecar revision. They appear in MCP read tools and do not alter GitHub files, rebuild the website or regenerate the PDF. Changes intended for the public website must still be committed through the GitHub review/build process. The MCP source and bindings are recorded under workers/nzgis-history-live-mcp/.

Recovery for a site release uses the content commit and matching Cloudflare Pages deployment. Recovery for a small MCP edit restores a retained editorial revision. Verify the relevant publication state and affected reads after either operation. Keep the public site available while private editor access is repaired.
