# Four-chapter source-figure publication batch, 11 October 2026

## Exact result

Authoritative repository `pm4gis/gishistory26`, baseline production commit `c8a8bbf235e38c93f7bbd7b4a2650f3fba401861`. Three authentic, research-authored New Zealand geospatial figures dated 2022, 2022 and 2025 have now been downloaded successfully. The image catalogue increases from 72 to 75 records, assuming no concurrent catalogue changes. The historical image coverage remains 44 of 44 chapters because each target chapter already carried a period-labelled contextual image. This release improves documentary fit in chapters 7, 43 and 44; it does not fill the unresolved 1996–2003 screenshot gap in chapter 30.

Each new figure has its unchanged original PNG under `public/assets/historical/original/`, an uncropped display WebP under `web/`, an uncropped thumbnail WebP under `card/`, and a dedicated JSON image record and detail page. All originals, formats, dimensions, figures, authors, dates, licences, sources and checksums are in `docs/media/four-chapter-originals-run-20261011.json`. No generated substitute or material representing events after 31 December 2025 was used.

| Chapter | Figure | Exact paragraph anchor | Original PNG SHA-256 |
|---|---|---|---|
| 7 Land assessment | [Vannier et al., *Land* (2022), Fig. 1](https://www.mdpi.com/2073-445X/11/12/2334), national agricultural land use with LUC/LUCAS/AgriBase sources | `ch07-s05-p04` | `31e5cae579e35a59ae860280e35c82c2659bac16c5e3fec4e9f1a53749f89954` |
| 43 GIS automation | [Collings, Ford and Dickson, *Remote Sensing* (2022), Fig. 4](https://www.mdpi.com/2072-4292/14/19/4827), real New Zealand coastal landcover classification workflow | `ch43-s11-p01` | `baef8f06103a3f5264befc30f81e98225b4aadfd289f0dc740f363a0de731b94` |
| 44 GIS and AI | [Khan, Vega-Corredor and Wilson, *Remote Sensing* (2025), Fig. 8](https://www.mdpi.com/2072-4292/17/15/2626), national machine-learning prediction of wetlands | `ch44-s03-p04` | `94cea971d07065a6c49460781160e673d3029e3999176863f3759bce22c8ddba` |

All three primary articles identify reuse under Creative Commons Attribution 4.0. The full original is preserved. WebP copies are technical re-encodings and proportional resizing, without edits, annotations or cropping. Original source attribution and licence are displayed on the corresponding image-detail page rather than interrupting the reader at the top of a chapter.

## Remaining gaps

- Chapter 7: The new 2022 figure shows secondary use of real land-assessment data. The original first-edition NZLRI worksheet and 1967 Gisborne–East Coast sheet remain unarchived. National Library access/reuse and separate Manaaki Whenua rights must be obtained from their legitimate custodians.
- Chapter 30: A genuine dated screenshot of GUILD-on-the-Web, PHEW!, New Zealand Public Health Observatory (2002) or Statistics New Zealand 2001 Census WebMap is still absent. The existing 2019 map remains correctly labelled. Government launch notices and 1996–2002 publications corroborate early applications but cannot be converted into a fabricated interface image.
- Chapter 43: The Figure 4 output depicts a real 2022 automated classification workflow, not historical screenshots of NIWA DASmap, Auckland Council FME or a Waikato ArcView Avenue process. The held QGIS documentation figure has unresolved publication conditions and is not inserted.
- Chapter 44: The 2025 national wetland prediction is the work of Khan and colleagues. It is not the LUCAS 2020 land-use map. MfE's photographic/imagery carve-out still prevents reusing the ministry's LUCAS report figures without explicit permission.

## Validation and publication

The research acquisition workflow successfully downloaded three of three original figures, with zero rights failures after the publisher's public original-asset URLs were used. Source page licences were independently checked because unattended HTTP access to the article HTML returned 403; no access control was bypassed. The dedicated download workflow, script, manifest and downloaded source hashes provide reproducible provenance. Existing chapter content and stable IDs were not changed.

Before merging, rerun `npm test`, `npm run build`, preservation checks, internal-link checks and all dedicated reader/browser workflows. Check the exact final PR head, deploy success and eight existing context placements. After merging, verify the production site displays all three new figures at their paragraph anchors, each image detail page contains its source and licensing, and all three local original PNG URLs resolve. Record the merged commit and deployment IDs in the publication summary.
