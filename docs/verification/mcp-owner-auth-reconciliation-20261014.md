# Owner MCP authentication and D1/GitHub reconciliation, 14 October 2026

## Scope and source identities

Public source: `pm4gis/gishistory26`, GitHub `main`, initial head `98483dfdfb776fd59f702384b8b7cd0ce5e23f38`. Production Cloudflare Pages project: `gishistory26`; initial successful deployment `bb231103-9b6a-450f-8c23-d3038e7c4e86`, serving the same head. The separate MCP Worker is `nzgis-history-live-mcp` at `https://mcp.history.pm4gis.nz/mcp`. The worker has its existing D1 `EDITORIAL_DB` and KV `EDITORIAL_KV` bindings. D1 editorial state is `editorial-000008`, with 66 operations. Canonical sidecar release is `canonical-000001`, `nzgis-history-canonical-2026-10-07`.

These are two publication states: MCP D1 edits affect MCP records, while GitHub `main` changes are built and published through Cloudflare Pages. A successful sidecar patch **does not** publish the website.

## Access repair and outstanding owner connection

The Cloudflare Access application remains on exactly the MCP hostname with one allow policy for the authorised owner's email account, and one allowed identity provider. It has no service-token bypass, public exception or additional allowed account.

On 14 October 2026 the Access application was updated in place and read back successfully: `session_duration=720h` (30 days), `oauth_configuration.grant.session_duration=720h`, and `oauth_configuration.grant.access_token_lifetime=24h`. These settings reduce routine authentication expiry, but cannot revive an already invalid client credential and do not guarantee perpetual login.

The ChatGPT MCP publishing connector's `get_publication_state` still returned HTTP 401 `invalid_token` after the change. Public `search_history` and `trace_evidence` succeeded but do not establish working owner authorisation. The Worker source declares `prepare_github_publication`, while the connected ChatGPT MCP tool catalogue does not expose that tool. This catalogue should be refreshed after reconnecting the owner-only MCP connection.

**Required owner action**: In ChatGPT, open Settings → Plugins, locate **A History of GIS in New Zealand**, reconnect or re-authenticate the MCP connection at `https://mcp.history.pm4gis.nz/mcp`, and sign in with the existing authorised owner Google identity. If an installation offers a Disconnect/Connect action instead of Reconnect, use that action for this MCP connection only; do not delete the Cloudflare Worker, D1 or Access policy. Then refresh the MCP tool catalogue. An OAuth login cannot be performed by the Cloudflare management API on the user's behalf.

An authenticated disposable D1 preview, one-use-token publication, revision increment and restoration remain **untested** until that connection works. No unauthorised substitute, direct D1 mutation, or impersonated MCP success was performed.

## Exact D1 editorial operation reconciliation

The `editorial_state.operations_json` array was read directly from D1 by indexed JSON query. All 66 entries were compared against the exact fields of current GitHub `src/content/records/` JSON files at the initial Git head. For public fields, a change is 'already present' only when GitHub's current field is byte-for-byte JSON-equal to the operation's `after` value; a safe pending edit would need equality with `before`. A private entry is recognised by the excluded `/researchSources` path. No affected record was missing.

| Classification | Count |
| --- | ---: |
| Public values already present in GitHub | 43 |
| Private research-source operations retained only in D1 | 19 |
| Public field differs from both D1 before and after, requiring review | 4 |
| Public value equal to D1 before and ready to apply | 0 |
| Missing record | 0 |
| **Total** | **66** |

The four divergent fields (D1 zero-based operation index) are:

| Index | Record ID | Field | Resolution at this stage |
| ---: | --- | --- | --- |
| 33 | `entity:grow-gis-nz` | `/story/2` | Keep GitHub's accepted prose about Grow GIS NZ, public events and LINZ/GCC responsibility; do not overwrite with an older GeoBites claim |
| 36 | `entity:new-zealand-cartographic-society` | `/story/0` | Keep the GitHub foundation/history paragraph; assess the D1 children's-map-competition claim separately, with evidence and paragraph placement |
| 37 | `entity:geospatial-special-interest-group-lgga` | `/story/0` | Keep the current LGGA account; D1 is related but neither its before nor after value equals the latest public field |
| 65 | `person:duane-wilkins` | `/story/3` | Keep the published 2017 LINZ/LEARNZ account. D1's longer replacement includes 2006 ArcFlax, 2025 publications and **2026** narrative; do not overwrite or duplicate published text |

Because all 47 non-private operations are either already applied (43) or conflict with newer current values (4), **there is no safely replayable public change** from this D1 set. Do not apply `--omit-private` to force a blind wholesale import or discard the D1 records. No private source URLs or underlying research contents are reproduced in this public report. The D1 editorial revision and all individual historical revisions remain intact.

## Validation and preservation boundary

The GitHub `scripts/apply-mcp-git-patch.mjs` reconciler requires an exact Git-head lease and matching before-values and rejects conflicting updates. `src/lib/content-integrity.mjs` validates the strict timeline cut-off of **31 December 2025** and referential integrity, including no orphan people. The GitHub workflow `.github/workflows/verify.yml` executes `npm ci`, `npm test`, `npm run build`, exclusions, editorial state and simulation scripts. The initial Git head's workflow run `38389136325` passed. A fresh workflow run for this report's branch/merge must be checked separately.

No chapter, record, event, image, source, attribution or historical prose file is changed by this verification report. The existing historical-media inventory identifies **360 recovered of 448** predecessor derivative paths and **88 unresolved** on the first pass; see `docs/media/unresolved.md` and `docs/media/recovery-targets-20261013.md`. There is no basis to declare those remaining originals recovered. The preservation and chronology gates must continue to run for every content release.

## Recovery and completion gates

Do not reset or delete the MCP D1 sidecar, its audit tables, preview-token storage, or Cloudflare Access app. Do not create a second unauthenticated MCP hostname. Once the owner's ChatGPT MCP OAuth connection has been renewed: read state; search and trace a known record; obtain `prepare_github_publication` with an exact expected revision; run a disposable preview and one-use-token D1 edit with exact before/after text; verify the changed revision; restore the original value as a further audited revision; verify the restored value and preserved revisions. Then check public GitHub Pages independently. This blocked test is not represented as passed.

Commit and Cloudflare production deployment for this report are recorded in the GitHub and Cloudflare deployment histories rather than asserted in advance here.
