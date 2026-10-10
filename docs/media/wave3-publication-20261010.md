# Documentary subject images — wave 3 publication record

Prepared 10 October 2026. Production source `pm4gis/gishistory26`. Source research archive: `NZ_GIS_History_Subject_Images_Wave3_2026-10-10.zip` in Library → NZ GIS History → Research Packages. Acquisition archive ZIP SHA-256 is tracked with its original file set; the originals are **not copied** into this public GitHub repository. The published site serves existing prepared, checksum-verified, uncropped WebP derivatives only.

## Reconciliation and editorial decisions

The wave started with seven source photographs. Each one was compared against the current `src/content/images` catalogue, matching original file hashes, exact subject records and timeline event IDs. Four institutional photographs and one contemporary earthquake reconnaissance image are new. Two others were held/excluded for explicit reasons.

| Source image | Decision | Public placement | Treatment |
| --- | --- | --- | --- |
| `arc-pitt-street-2007` | **Publish** | `/entities/auckland-regional-council/`, and subject-aware discovery cards | Actual former Auckland Regional Council offices in 2007, not council GIS software |
| `upper-hutt-civic-centre-2005` | **Publish** | `/entities/upper-hutt-city-council/`, discovery cards | Genuine 2005 civic facilities near the early XPLORER period, not a screenshot of XPLORER |
| `lower-hutt-civic-centre-2021` | **Publish** | `/entities/hutt-city-council/`, discovery cards | Replaces a 1909 cadastral map as the institution's lead photograph; old map is retained in the archive |
| `christchurch-civic-offices-2019` | **Publish** | `/entities/christchurch-city-council/`, discovery cards | Replaces 1955 city aerial as institution's lead photograph; the historical aerial is retained elsewhere |
| `christchurch-orion-quake-2011` | **Publish** | Event `2011-christchurch-earthquake`, timeline and photo detail page | Actual RNZAF P-3K Orion reconnaissance image taken **22 February 2011**; existing post-event shaking map retained as an additional linked timeline image |
| `gabrielle-napier-sentinel-2023` | **Exclude duplicate** | No new image or link. **Existing** image `gabrielle-sentinel-flooding-napier-2023` remains on `2023-nzta-gabrielle`. | The new candidate is *exactly the same original* as the already-published record: SHA-256 `026936cc5c2c050fe69d61fee4426d2b26c772f437e61fb8e57cfba77e2433b8`. Existing caption already disclaims NZTA system imagery; its original and alternative NASA/MODIS context images are retained. |
| `auckland-city-civic-building-2007` | **Hold** | Research ZIP only | Former **Auckland City Council**, predecessor of the post-2010 unitary council. No distinct predecessor record exists in the current records catalogue. The image must not be presented as Auckland Council headquarters. |

## Source and rights

All five published photographs are directly traceable to Wikimedia Commons file-detail pages and the 10 October 2026 source manifest retained in research PR #21. Their exact historical dates and image creators are included in the live image records and caption cards.

- ARC January 2007: Ingolfson, public domain; [source](https://commons.wikimedia.org/wiki/File:Auckland_Regional_Council.jpg).
- Upper Hutt 29 April 2005: Michael Dudding, public domain; [source](https://commons.wikimedia.org/wiki/File:Upper_Hutt_Civic_Centre.jpg).
- Hutt City 25 September 2021: Tom Ackroyd, CC BY-SA 4.0; [source](https://commons.wikimedia.org/wiki/File:Lower_Hutt_Town_Hall_and_Council_building_2021-09-25_2.jpg).
- Christchurch council offices 21 January 2019: Roger 8 Roger, CC BY-SA 4.0; [source](https://commons.wikimedia.org/wiki/File:Christchurch_City_Council,_53_Hereford_St,_21_January_2019.jpg).
- Christchurch earthquake 22 February 2011: New Zealand Defence Force / RNZAF, CC BY 2.0; [source](https://commons.wikimedia.org/wiki/File:Christchurch_-_2011_earthquake_damage_001.jpg).

WebP derivatives are scaled without cropping from originals. Original JPEGs, their SHA-256 hashes and camera dimensions remain in the permanent project Library archive. The published JSON records include `originalSha256`, `webSha256`, `thumbnailSha256`, original dimensions, source URLs, licence evidence, creator, context, dates and an explanation of where originals are held. The image detail page links to Commons source-original URLs instead of claiming a locally served full JPEG. No generated historical images were introduced.

## Preservation and access

Existing image records and every historical passage, relationship, event and council record remain unchanged. The published mappings change only `src/lib/subject-media.mjs` and `src/lib/timeline-media.mjs`. The historical map replaced in the earthquake timeline remains present as an additional image. Existing decorative aerial imagery remains separate. No person profiles, biographies, portraits, profile galleries or avatars are changed.

### Remaining items

The Auckland City Council predecessor photograph remains in the research archive until a historically sourced record is justified. The Gabrielle candidate is not a publication gap: the original already exists in production. The Women in GIS documentary theme still needs a suitable reuse-cleared thematic photograph, but no generic face/person image should be assigned.

## Verification

The new `tests/wave3-subject-media.test.mjs` checks WebP file signatures and exact hashes, the retained original hash in metadata, exact council assignments, no Person assignments, no duplicate Gabrielle publication and existing earthquake map retention. Standard `npm test` and `npm run build` enforce publication integrity, schema checks, protected collection file hashes, Astro types and generated internal links. Record the workflow and Cloudflare production IDs after publishing; do not claim desktop/tablet/mobile screenshots were manually tested if only static page and responsive-code checks were performed.
