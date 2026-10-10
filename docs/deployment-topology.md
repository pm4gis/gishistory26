# NZ GIS History production routing

Recorded 10 October 2026. The one active public reading edition is https://history.pm4gis.nz. The source repository is pm4gis/gishistory26, deployed automatically from main to Cloudflare Pages project gishistory26. Its built-in gishistory26.pages.dev address serves the same release.

## Active dependencies

Cloudflare Worker nzgis-history-cutover-bridge runs on the history.pm4gis.nz/* route. It proxies reading requests to gishistory26.pages.dev. For /data.json and /__nzgis-feedback/ routes it passes the original request to the origin Worker custom domain, nzgis-history-feedback-overlay. That legacy-origin dependency serves canonical historical data with live editorial overlays; deleting it would break the canonical publication MCP. The independent MCP Worker is nzgis-history-live-mcp on mcp.history.pm4gis.nz. These are supporting data/editing services, not alternative public reading editions.

Cloudflare's zone-level dynamic redirect rules permanently direct gishistory.pm4gis.nz paths to history.pm4gis.nz. Its former Pages project nzgis-history-stage was deleted following removal of older deployment records. contribute.pm4gis.nz/ redirects to the live NZ GIS History Feedback Google sign-in application at nz-gis-history-feedback-p6dqvy.v2.appdeploy.ai; older contribution-site reading paths redirect to the new production website. Other applications under pm4gis.nz are out of scope.

The obsolete pm4gis/nz-gis-history-rebuild GitHub repository remains available for research/history recovery, including unfinished PR #9. It is not deployed. The active pm4gis/gishistory26 PR #7 is an unmerged draft containing pending media-source rights and timeline URL-state work. Preserve both until their non-duplicated research and editorial material is reconciled. The ChatGPT GitHub connector does not expose repository archival or deletion.

## Verification and recovery

Before future changes, verify the production homepage, book, old chapter 301 redirects, timeline, network, search, release.json, data.json, and the canonical MCP publication state. The latter returned 796 records, 531 persons, 2,502 relationships, 167 events, canonical-000001 and editorial-000007 at cutover. A Cloudflare Pages build can be rolled back to an earlier known-good deployment. To restore the previous frontend temporarily, remove the history.pm4gis.nz/* route to nzgis-history-cutover-bridge; the retained origin Worker custom domain will resume handling the hostname. Do not remove the origin Worker until its data/editorial functions have been replaced and verified.

The new site has not yet completed all media-rights decisions, 87 missing derivative recoveries, manual accessibility testing, and the end-to-end editorial release rehearsal. These remain follow-up work and were not silently treated as completed by the hostname change.
