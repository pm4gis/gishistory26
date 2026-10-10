# Production cutover and recovery

Verified 10 October 2026. Production publication: **https://history.pm4gis.nz/**.
Application repository: `pm4gis/gishistory26`. Cloudflare Pages project:
`gishistory26` with production branch `main` and origin
`https://gishistory26.pages.dev/`.

## Current routing

The Cloudflare DNS zone `pm4gis.nz` proxies `history.pm4gis.nz` and
`gishistory.pm4gis.nz` through the Worker
`nzgis-history-cutover-bridge` (matching `hostname/*` routes).

The Worker:
- Returns a permanent 301 redirect from `gishistory.pm4gis.nz` to
  `history.pm4gis.nz`, retaining the requested path and query.
- Proxies normal `history.pm4gis.nz` page and asset requests to
  `gishistory26.pages.dev`, keeping the public hostname unchanged.
- Leaves `/data.json` and `/__nzgis-feedback/*` on their existing origin
  route. Those endpoints still depend on the retained predecessor
  infrastructure and **must not be deleted as part of site tidying**.
- Rewrites upstream redirect locations to the public hostname where applicable.

Cloudflare Pages itself currently has only the `gishistory26.pages.dev`
domain attached; the public domain cutover is provided by the Worker route,
not a Pages custom-domain association. Do not configure a conflicting
Pages domain without a separate route migration and rollback plan.

## Indexing

The Astro `site` setting and HTML canonical tags use
`https://history.pm4gis.nz`. The generated XML sitemap and public
`robots.txt` use the same hostname. The Pages origin deliberately remains
accessible to the Worker; search engines should follow the canonical
addresses. A Pages-origin redirect could cause a loop in the Worker
and must not be introduced without an explicit bypass design.

## Release verification

1. Confirm the GitHub `main` SHA is the intended release.
2. Confirm the `gishistory26` Cloudflare Pages **canonical production
   deployment** succeeded for that SHA. Recent previews are not production.
3. Confirm the public home, `/datasets/`, six dataset routes, `/read/`,
   `/timeline/`, `/network/`, `/browse/`, `/search/`,
   `/release.json`, `/sitemap.xml` and `/robots.txt` respond.
4. Confirm the alternate hostname redirects to the primary hostname
   without a loop, retaining deep-link paths and queries.
5. Check that HTML canonical URLs, XML sitemap locations and the robots
   sitemap directive all reference `history.pm4gis.nz`.
6. Check retained `/data.json` separately, without copying private
   editorial fields into the rebuilt application's public repository.
7. Perform real-browser interactive and responsive checks in addition to
   non-interactive HTTP checks. A 10 October automated-browser run
   encountered Cloudflare bot verification on some subsequent routes:
   that result does **not** establish whether ordinary readers are
   challenged. Preserve bot protection until reviewed against evidence.

## Recovery procedure

**Application rollback:** Identify the last successful production deployment
in Cloudflare Pages `gishistory26`, noting its commit hash. Use Cloudflare's
Pages deployment rollback control to select that verified release, then
recheck `history.pm4gis.nz`, the Pages origin, `/release.json`, the sitemap,
search and several historic entity deep links. Keep later accepted Git commits
for reconciliation. Do not force-reset `main`.

**Hostname routing rollback:** If the bridge itself fails, retrieve the
current and previously retained versions of Worker
`nzgis-history-cutover-bridge`, inspect the earlier version's code, and
restore the last verified routing version using Cloudflare Worker deployment
controls. Record the restored version and re-test both hostnames and the
legacy API routes. Do not simply delete Worker routes or DNS records: they
currently provide both the cutover and preservation of the old endpoints.

**DNS:** Preserve the current proxied Cloudflare records until a tested
replacement serving arrangement is in place. Verify certificates and host
reachability after any approved DNS change.

This runbook is operational evidence, not authorisation to remove older
services. The historical-content migration and media-rights acceptance
registers have separate release gates.
