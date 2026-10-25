# Reviewed preservation patch: Treasury / Critchlow attribution
Date: 23 October 2026 (NZ)
Baseline: `561166db15c10a7b954157cf974da71be2d5fb1d`
Review PR: #144

## Reason

A reader challenged the statement that Critchlow Associates supplied ArcView. The original June 2000 Treasury working paper WP 00/11 does indeed say "Data provider Critchlow Associates (CA) supplied the Census96 data and ArcView software" (section 3, printed page 11; PDF page 11). A bare repetition falsely suggests a proven Esri/ArcView reseller relationship. Independent contemporary and supplier records associate Critchlow with **MapInfo** and Eagle Technology with **Esri**.

- Treasury primary paper: https://www.treasury.govt.nz/sites/default/files/2007-10/twp00-11.pdf
- Statistics New Zealand early-2000s census map guidance: https://statsnz.contentdm.oclc.org/digital/api/collection/p20045coll19/id/437/download
- Eagle Technology distributorship history (Esri from 1985): https://www.eagle.co.nz/our-history/
- Contemporaneous GIS in Schools conference paper (Critchlow/MapInfo; Eagle/Esri): https://proceedings.esri.com/library/userconf/educ04/papers/pap5097.pdf

## Editorial decision

Keep what the working paper **actually said**, with explicit attribution, rather than silently rewrite the source. Separate three claims:

1. Critchlow supplied packaged Census96 geographic/statistical data to the project (source-backed).
2. The project also used or referred to ArcView (source-backed).
3. Whether Critchlow was an authorised Esri distributor or exactly how ArcView was procured (not established in that paper; contemporary evidence identifies Eagle Technology as Esri distributor).

Chapter 24 now names the disagreement in the text and note. The two researcher profiles carry a concise warning against treating the paper as reseller evidence.

## Exactly four baseline content files changed

| File | Scope | SHA-256 after reviewed change |
| --- | --- | --- |
| `src/content/articles/government-goes-spatial.json` | Clarify source note 01 and direct source URLs; other notes and article metadata unchanged | `5a67adcd19ee5ffe198fd64aaba1c017c3780ab3cf1648c971802d40940f58fa` |
| `src/content/passages/chapter-24-p002.json` | Reword two paragraph blocks, `ch24-s02-p01` and `ch24-s02-p04`; all other blocks, passage IDs, markdown synchronisation, section slug and relations unchanged | `7a61d57461b7de3cc79014d8c7b8eba343c890d0306efa5552fd261f2edf1ef3` |
| `src/content/records/jason-timmins.json` | Reword the June 2000 paragraph only; biography ID, other career paragraph, references and relations unchanged | `0496ad080f3b3a98485437fa1273624180952e48e0095b072e4df64d508cfb98` |
| `src/content/records/suzi-kerr.json` | Reword the same June 2000 paragraph only; biography ID, source links and relations unchanged | `1e0085d58e4bbab32fcea2ebf4a99e1a11ddda2545158f8d5e04a7e897ddb331` |

Old manifest hashes were independently recalculated from the `main` GitHub file bytes and **all four matched** before editing. New hashes were calculated from the exact content committed on this PR branch, using a separate SHA-256 implementation. `content/preservation-manifest.json` was updated only for those four keys. The total manifest size remains 5,543 file entries.

## Acceptance checks

- `tests/critchlow-arcview-attribution.test.mjs` verifies the attribution, researcher-profile wording, evidence URLs, consistent paragraph `text`/`markdown` and original IDs.
- `npm test` must pass, including unchanged historical cutoff tests.
- `npm run build` and `scripts/preserve.mjs` must pass with this manifest.
- No PDF original, media, public routes, historical dates, relationship edges, other record content, or 31 December 2025 cutoff modified.
- Require successful relevant GitHub Actions before merge and Cloudflare production commit verification after merge.

## Remaining uncertainty

There is no separate evidence proving or disproving a one-off ArcView licence supply in 2000. The claim that Critchlow was an ArcView **reseller** is unsupported; the paper itself remains faithfully described. Do not replace this nuance with an absolute claim that Critchlow could never have provided a licence to this project.
