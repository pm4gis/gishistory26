# NZ GIS History

Text-first reader built with Astro, Svelte and TypeScript. GitHub is the rebuild source; Cloudflare serves the preview at https://gishistory26.pages.dev. Existing production domains remain unchanged.

The accepted baseline contains 45 articles including the preface, 583 passages, 796 records including 531 people, 167 events, 2502 relationships and seven themes. All 4102 baseline collection files are checksum-protected. Pending research is retained separately.

## Development

Use Node 22.19 or later. Run `npm ci`, `npm test` and `npm run build`. Every build checks content, preservation, types, search generation, asset limits, internal links and original paragraph/section anchors. CI retains verification reports and simulated review traces.

Read AGENTS.md, docs/delivery-plan.md, docs/architecture.md, docs/migration-status.md and docs/editorial-workflow.md before making changes. Editorial drafts name the base revision and expected Git head. Replacement drafts preserve existing fields and blocks and require explicit acceptance for changes.

## Delivery status

The full text is available in the preview. Reader controls, horizontal chronology, contextual entries, search, four palettes and an optional network are implemented. Read-only MCP is at /mcp; /editor/ prepares local drafts. Direct authenticated publishing and write MCP are not operational.

Media reconciliation, pending research decisions, real-device/accessibility checks, an editorial release/recovery rehearsal and final domain cutover remain open. The migration archive was saved, including 360 recovered published images. The original site challenges GitHub's downloader, so automatic recovery is disabled. See docs/media/unresolved.md and docs/verification/ for exact evidence. Do not describe the entire delivery plan as complete.
