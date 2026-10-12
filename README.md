# NZ GIS History

Active production: https://history.pm4gis.nz. This Astro/Svelte/TypeScript site is built from this repository's main branch on Cloudflare Pages project gishistory26. The platform alias https://gishistory26.pages.dev serves the same build. A Cloudflare routing Worker keeps the canonical /data.json route available while sending reader pages to the new application. The unauthenticated /mcp route is retired; the private MCP is at https://mcp.history.pm4gis.nz/mcp. The older nzgis-history-stage Pages project has been deleted; gishistory.pm4gis.nz permanently redirects here.

The accepted baseline contains 45 articles including the preface, 583 passages, 796 records including 531 people, 167 events, 2502 relationships and seven themes. All 4102 baseline collection files are checksum-protected. Pending research is retained separately.

## Development

Use Node 22.19 or later. Run `npm ci`, `npm test` and `npm run build`. Every build checks content, preservation, types, search generation, asset limits, internal links and original paragraph/section anchors. CI retains verification reports and simulated review traces.

Read AGENTS.md, docs/delivery-plan.md, docs/architecture.md, docs/migration-status.md and docs/editorial-workflow.md before making changes. Editorial drafts name the base revision and expected Git head. Replacement drafts preserve existing fields and blocks and require explicit acceptance for changes.

## Delivery status

The new reader is live at history.pm4gis.nz. The reader, search, four palettes and optional network are implemented. The chronology supports period filters, zoom, keyboard-selectable markers and reduced-motion-aware feedback. The private MCP reads the current site feed and supports previewed, audited small edits for the authorised owner through Cloudflare Access OAuth. Those edits are MCP-sidecar revisions and do not rebuild the public site; website content still goes through GitHub and Cloudflare Pages. The legacy unauthenticated /mcp endpoint returns HTTP 410. /editor/ prepares local drafts.

Media reconciliation, pending research decisions, real-device/accessibility checks and an editorial release/recovery rehearsal remain open. The migration archive was saved, including 360 recovered published images. The original site challenges GitHub's downloader, so automatic recovery is disabled. See docs/media/unresolved.md and docs/verification/ for exact evidence. Do not describe the entire delivery plan as complete.
