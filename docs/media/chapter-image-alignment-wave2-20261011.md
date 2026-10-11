# All-image paragraph evidence audit, second wave — 11 October 2026

This supersedes the alignment decisions in the first-wave CSV while preserving it as an immutable historical checkpoint. The source collection is unchanged. Editorial matches link an actual historical item to a passage that discusses the same data, sensor, process or named event. No chronological or alphabetic scattering of maps is permitted.

## Full inventory

- 181 public image records evaluated (originals, source metadata and derivative paths unchanged).
- 106 October 11 acquired images, including 11 with paragraph-grounded matches and 95 retained outside chapter prose.
- 75 earlier registered images, including already accepted inline/embedded uses. Previously sourced image-detail pages, timeline associations and record/theme media are preserved.
- Total unique in-story auto placements across all chapters: 29. This count excludes independently embedded figure blocks.
- Image disposition across all records: 151 archive-only-for-chapters; 29 inline-linked; 1 embedded-figure.
- New exact paragraph matches approved in this wave: 6. Their source originals and reuse terms were already registered and independently checked where a source record was available.

## Priority chapters

- Chapter 5 (Digital land inventories): 1 evidence-based inline images; no addition was made simply to meet a per-chapter quantity.
- Chapter 7 (Land assessment): 1 evidence-based inline images; no addition was made simply to meet a per-chapter quantity.
- Chapter 13 (The digital cadastre): 2 evidence-based inline images; no addition was made simply to meet a per-chapter quantity.
- Chapter 20 (Aerial imagery): 4 evidence-based inline images; no addition was made simply to meet a per-chapter quantity.
- Chapter 23 (Council GIS): 1 evidence-based inline images; no addition was made simply to meet a per-chapter quantity.
- Chapter 36 (Satellite observations): 5 evidence-based inline images; no addition was made simply to meet a per-chapter quantity.
- Chapter 42 (Disaster response and live mapping): 3 evidence-based inline images; no addition was made simply to meet a per-chapter quantity.

## Accepted additions

| Image | Exact text anchor | Why accepted |
| --- | --- | --- |
| Retrolens historic aerial photograph: Glentunnel and Coalgate, Selwyn District (1943-03-09) | imagery-becomes-infrastructure / `ch20-s09-p02` | Chapter 20, An archive becomes digital: the scanned aerial frames and survey metadata of the Crown Aerial Film Library; original Retrolens image via individually licensed Wikimedia Commons file. |
| LINZ Christchurch earthquake-response aerial orthophotography, 24 February 2011 | the-real-time-map / `ch42-s06-p01` | Chapter 42, Imagery after the ground changes: new orthophotography acquired after a disaster; Commons credits LINZ, NZ Aerial Mapping and the Christchurch Response Centre. |
| GeoNet felt reports from the Kaikōura earthquake | the-real-time-map / `ch42-s02-p02` | Chapter 42, GeoNet normalises the live map: publicly mapped earthquake observations and felt reports; Commons file and official GeoNet 2016 event. |
| Sentinel satellite analysis of Cyclone Gabrielle flooding near Napier, 2023 | the-real-time-map / `ch42-s10-p01` | Chapter 42, Cyclone Gabrielle: documented flooding across Hawke’s Bay during the 2023 event; Commons original credits Pierre Markuse and modified Copernicus Sentinel data. |
| Landsat 7 observation of Christchurch, 2001 | earth-observation-becomes-routine / `ch36-s03-p01` | Chapter 36, Land cover through time: Landsat 7 ETM+ imagery acquired from September 2001 to March 2002; NASA Earth Observatory source identifies the sensor and exact image date. |
| New Zealand census population density by SA2 | census-geography / `ch16-s07-p01` | Chapter 16, Linking census records: aggregating and mapping population statistics with matching digital polygons; Commons original documents Stats NZ inputs and QGIS production. |

## Deliberately held

The accompanying 181-row CSV documents each retained item separately, identifies its subject, source, copyright/licence statement, current chapter association, editorial disposition and rationale. In particular: antique nautical charts were not repurposed as computer-era topography; unidentified old geological sheets were not called NZLRI worksheets; unrelated municipal maps were not inserted into corporate council GIS history; independent earthquake shakemaps were not labelled as CERA, LINZ, GeoNet or NEMA operational products.

Legacy image records still used on timeline, theme or organisation pages are unaffected by decisions about inline placement. The editorial standard is more demanding for a figure inserted beside the prose than for a properly labelled searchable source image. An image-detail page alone does not establish a passage relationship.

Original manuscript passages, identifiers, images, licence records and existing approved figures were not rewritten. A missing historical system screenshot remains a research gap, not an invitation to substitute scenery.

## Verification

Regenerate with `node scripts/audit-media-evidence-wave2.mjs` and inspect the 181 rows. Execute `npm test` and `npm run build`, including the existing preservation checks. Then run the desktop/mobile Chromium script `scripts/eight-chapter-browser-qa.mjs`; confirm the Cloudflare preview and production URLs. Reject the release on mismatched paragraph anchors, missing source records, broken images or failed tests.
