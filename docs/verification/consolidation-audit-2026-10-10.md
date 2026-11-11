# Production consolidation audit, 10 October 2026

Status: **retirement blocked pending verification**. This audit documents observed evidence, without treating identical file counts as a guarantee of identical text.

## Observed production state
- Repository: `pm4gis/gishistory26`, main commit `21744d6b2ef5ca5ee81fda3b830b6ae008e520f2`.
- Cloudflare Pages `gishistory26`: successful production deployment `52570b72-008c-4637-a444-a2abae6b35c8`.
- Cloudflare Worker `nzgis-history-cutover-bridge`: routes `history.pm4gis.nz/*` and `gishistory.pm4gis.nz/*`; old hostname redirects to the canonical hostname.
- The routing Worker deliberately passes `/data.json` and `/__nzgis-feedback/` to the legacy custom-domain origin. The separate MCP worker is `nzgis-history-live-mcp`. These must be preserved.
- Attempted external HTTP checks for `history.pm4gis.nz`, `gishistory.pm4gis.nz` and `gishistory26.pages.dev` did not provide accessible page responses. Do not claim independent browser verification.

## Repositories and content
- `gishistory26`: 45 article JSON files, 583 passage files, 796 record files, 167 event files, 2,502 relationship files, seven theme files.
- `nz-gis-history-rebuild`: the same structured-file counts and filenames.
- Git tree SHA comparison: 3,524 common files identical, 605 common files different, 22 predecessor-only files, 48 production-only files.
- Of the 605 differing common files, 582 are passages. Six initial sampled passages (chapters 1, 10, 20, 30 and 40) have identical joined paragraph `text`, while production supplies paragraph `id` and/or `legacyAnchor` additions. Some other fields may differ. **This does not establish equivalence across all 582 passages.**
- The 22 predecessor-only files include editor authentication Worker code, its configuration, Decap CMS configuration, tests, and earlier components. These are not assumed obsolete until functionality and security are reconciled.
- `nzgishistory` retains archived canonical-consolidation release ZIPs, research/reconciliation files and an older static website. Preserve as a recovery/source archive.
- Production draft PR #7 and predecessor PR #9 are unresolved and unmerged.

## Existing migration limitations
- An earlier migration document reports a 154,049,526-byte archive outside the public repository. Location/access and integrity were not independently verified during this audit.
- The first recorded media-recovery pass recovered 360 of 448 derivatives, leaving 88 unresolved at that time. Later recovery remains unverified.
- Media rights/attribution review, cross-device accessibility verification, complete editorial publication rehearsal, and full canonical/passage reconciliation remain open.

## Retirement guardrails
Do **not** remove `nz-gis-history-rebuild`, `nzgishistory`, `nzgis-history-feedback-overlay`, `nzgis-history-live-mcp`, the canonical-data endpoint, or historical archives before dependency, textual and rollback checks pass. There were no deletions as part of this audit.

## Immediate completion requirements
1. Run a programmatic comparison of all 583 passage pairs, keyed by stable passage ID and original block/paragraph ID. Compare paragraph text, markdown, sources, record links, block order and other metadata independently of new IDs/legacy anchors. Save a machine-readable difference register.
2. Reconcile substantive differences and the 22 predecessor-only files, preserving unfinished work and pending research permissions.
3. Run repository unit tests, integrity validation, production build, link checker, media manifest validation, URL/legacy-anchor tests and a real browser smoke test against all three hostnames.
4. Independently verify backup archive bytes and location. Retire only verified redundant resources, one at a time, with post-change checks.

This branch intentionally contains an evidence record only. It does not change application code, production configuration, content or data.
