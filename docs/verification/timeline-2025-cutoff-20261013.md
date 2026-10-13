# Timeline historical boundary, 13 October 2026

## Accepted editorial decision

The public NZ GIS History chronology ends at 23:59:59 on 31 December 2025 (New Zealand calendar date). Do not publish or feature events, linked event descriptions, timeline images or retrospective paragraphs that describe events after this date. This applies to the full timeline, compact reader timeline, theme timelines, record-linked events, homepage event count and the public editor-data feed. The boundary is fixed and does not advance with the current year.

The accepted endpoint `2025-endpoint` is retained. Dates retain their original precision. Event ranges extending beyond the boundary are excluded pending a separate evidence-based split; later events are not assigned an earlier year.

## Reviewed publication removal

Approved against main branch `e928fb7083b6febf631e90c359b995e66e1fc162` via PR #74. The five post-2025 event JSON files listed below were removed from the public source. They remain recoverable through the Git history before this change. Their original SHA-256 hashes were recorded in the previous `content/preservation-manifest.json`. The preservation baseline now omits only these five entries; all remaining baseline files and hashes are preserved.

| Removed event file within `src/content/events/` | Original SHA-256 |
| --- | --- |
| `linzcap-2026-03-22-nga-poutama-covers-southern-institute-of-technology-g.json` | `e3e1dbcefc0ab1df97a784188084256cb5dad4647f95bb42abfe5e4969c5da1c` |
| `linzcap-2026-05-17-nga-poutama-earthquake-and-earth-science-data-session.json` | `208b4d77d9e02a34c114dade39ef1e5047699451af76f72138151c05ef1c5cd7` |
| `linzcap-2026-06-korero-a-mahere-3d-storymaps-wananga.json` | `af44a5a21c1d9296647d75ab74806db2bd3cb3dec69b9f7b58ffd3d60978ef72` |
| `linzcap-2026-09-linz-pauses-tertiary-gis-scholarships-for-2027.json` | `dff2519ff1b3a29b64a7b63968b11e2b9c39b69d1482ca92a6e121c9cbc45632` |
| `linzcap-2026-nga-poutama-uses-baymaps-as-a-council-gis-case-study.json` | `f46aed8e09cc1ff7f2ff8aa93a4dd16de6f4db7cf1643198c46038c4f2386931` |

The Māori GIS theme event references and the Ngā Poutama audiovisual event links were updated to avoid orphan links. The original audiovisual material is separate from the historical chronology and remains accessible in the independent video archive.

## Enforcement and acceptance

- `src/lib/timeline-cutoff.mjs` provides the fixed boundary and content gate.
- `src/lib/data.ts` applies the gate to all public event consumers.
- `src/components/Timeline.svelte` caps the chart and inputs at 2025, rejects future event deep links and excludes post-2025 recordings from its detail view.
- `src/lib/timeline-media.mjs` excludes later event context, images and sources.
- `src/lib/content-integrity.mjs` fails validation if a post-2025 event is introduced into the source collection.
- `tests/timeline-cutoff.test.mjs` covers the date ceiling and scans all source event JSON.

Acceptance requires `npm ci`, `npm test`, `npm run build` and the GitHub Actions release verification to pass, followed by confirming that the Cloudflare production timeline has no post-2025 date markers, event cards, deep-link targets or related-event lists.
