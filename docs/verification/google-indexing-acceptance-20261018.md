# NZ GIS History search indexing acceptance

Checked 18 October 2026 (NZDT). Repository: `pm4gis/gishistory26`. Canonical hostname: `https://history.pm4gis.nz`.

## Established

- The networked GitHub Actions live-crawl checked `https://history.pm4gis.nz/sitemap.xml` and found **1,607 distinct canonical URLs**. The sitemap and `robots.txt` returned HTTP 200, with the sitemap advertised in `robots.txt`.
- The audited samples returned HTTP 200 with canonical addresses, readable HTML, page titles, descriptions and Schema.org metadata: homepage, short history, chapter contents, People and organisations browse, Publications, timeline, a Person, an Organisation, a Dataset, a Chapter, a Theme, an historical Image, and a Document.
- The site's Search, Editor and Contribute utility pages returned HTTP 200 and were marked `noindex`. These pages are excluded from the public sitemap.
- The old `gishistory.pm4gis.nz` hostname redirects permanently to `history.pm4gis.nz`.
- The repository's generated-output audit verifies that every URL in the sitemap has an HTML file with matching canonical URL, title, description, visible H1 and JSON-LD, and does not carry a `noindex` directive. It also checks the intended `noindex` utility pages.
- Cloudflare DNS for `pm4gis.nz` is active and contains a Google site-verification TXT record. Google sent a Domain-property verification confirmation dated 16 October 2026. The underlying email and verification token have **not** been copied into this public repository.

## Cloudflare observations

- `history.pm4gis.nz/*` routes through `nzgis-history-cutover-bridge` to the existing `gishistory26.pages.dev` publication. The legacy history hostname redirects to the canonical hostname.
- Cloudflare Browser Integrity Check is enabled; security level is medium; Free Bot Fight Mode is enabled. No custom WAF blocking rule was found for the history hostname.
- Requests from a GitHub Actions runner **falsely claiming to be Googlebot** received HTTP 403 challenges on several paths. The same runner successfully fetched those paths with its own ordinary audit user-agent. Cloudflare distinguishes real verified bots from impersonators. A synthetic Googlebot user-agent does **not** test Google's actual crawler permissions. These 403 responses are recorded diagnostically and are not treated as grounds to disable the zone's security protections.

## Unverified

- Google Search Console property access was not available through the connected tools. The Search Console Sitemaps, Page indexing, URL Inspection and Performance reports could therefore not be read.
- No sitemap submission through Search Console or API is confirmed. The sitemap remains discoverable through `robots.txt`, but this does not establish an explicit owner submission.
- There is no verified count of Google-indexed pages or confirmed Googlebot crawl response. Public search queries are insufficient to establish either.
- No direct Googlebot traffic or Cloudflare security-event trace was available to confirm or refute an actual crawler block.

## Completion action

1. Sign into [Google Search Console](https://search.google.com/search-console) and select the already verified `pm4gis.nz` Domain property.
2. In **Sitemaps**, submit `https://history.pm4gis.nz/sitemap.xml`, if it is not already listed. Confirm the submission status and any fetch/parse errors.
3. In **URL Inspection**, check `https://history.pm4gis.nz/`, `https://history.pm4gis.nz/history/`, `https://history.pm4gis.nz/stories/landonline/`, `https://history.pm4gis.nz/people/a-c-shailes/`, and `https://history.pm4gis.nz/publications/`. Run live tests and inspect Google-selected canonical, last crawl, fetch and indexing status. Request indexing for priority pages if appropriate.
4. Use the **Page indexing** report to identify material exclusion groups. If Google reports 403 or challenges, check Cloudflare **Security > Analytics > Events** for verified Googlebot requests and the actual service/rule responsible before changing security configuration. Do not permit arbitrary clients just because they claim a Googlebot user-agent.
5. Record indexed counts, excluded counts, discovered URLs, sitemap processing state, inspection outcomes and the dated source of each finding. Repair confirmed issues through a separate reviewed commit if needed.

## Test evidence

- [Public live-crawl workflow](https://github.com/pm4gis/gishistory26/actions/runs/39100494566) (GitHub Actions, public networked runner, no authenticated Search Console).
- [Build verification workflow](https://github.com/pm4gis/gishistory26/actions/runs/39100494576), which runs Node tests, static generation, source preservation, sitemap-to-HTML audit and internal-link checking.

Historical records were not changed. The site's historical timeline still stops on 31 December 2025.
