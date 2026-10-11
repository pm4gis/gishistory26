# Eight-chapter documentary image integration, 11 October 2026

## Production baseline

Source `pm4gis/gishistory26`, accepted starting commit `69a42b16862c0a0e3f5c320c6f450c599ea8cd84`. The source catalogue initially held 71 registered images; this release adds one new source original and registered image, raising the count to 72. Previously accepted chapters, person biographies, events, routes, connections and historical content are unchanged.

The source review used the prior wave 1–3 media reports, the staged 2025-limited research discovery, the outstanding media register, the source-image catalogue and original source pages. The 2025-12-31 subject date cut-off was applied to this release.

## Chapter placements

| Chapter | Licensed image and date | Placement | Relationship and limitation |
| --- | --- | --- | --- |
| 7 Land assessment | `nz-geology-lange-2012`, 2012 | `ch07-s01-p01` | Genuine digital NZ geological map showing one of the physical information types used in land assessment. Not an NZLRI or Land Use Capability survey sheet. Reuses locally archived original. |
| 11 University teaching and research | `auckland-university-clocktower-2004`, 2004 | `ch11-s01-p02` | Auckland teaching-institution context only. Not the 1985 GIS laboratory. Reuses the existing licensed image. |
| 12 Companies and user groups | `intergraph-clix-workstation`, late 1980s | `ch12-s01-p02` | Genuine equipment of the commercial GIS period; not proven to be operated in New Zealand. Reuses the existing archived original. |
| 29 The GIS profession | `tripp-station-theodolite-surveyors`, historical, capture date not verified | `ch29-s01-p02` | Demonstrates the surveying profession preceding local GIS. Not a photograph of a GIS conference or practitioners using GIS. Reuses existing archival source. |
| 30 Early web mapping | `nz-libraries-wikidata-osm-2019`, 19 Feb 2019 | `ch30-p-aedbf2d5def6` | Newly downloaded original New Zealand browser-map screenshot. A later Wikidata/OpenStreetMap example, not GUILD-on-the-Web, PHEW! or the original Census WebMap. |
| 40 Enterprise GIS | `linz-wfs-attribute-service-2023`, source from 2023, exact capture date unverified | `ch40-p-f6bb5c1149ab` | Authentic LINZ attribute-filter service example showing later spatial-data access. Not a 1990s enterprise deployment screenshot. |
| 43 GIS automation | `linz-arcmap-property-relationships-2016`, guide files dated 2016, capture date uncertain | `ch43-s01-p02` | Genuine property-record table relationship in ArcMap, an operation relevant to repeatable GIS processing. Not an automation diagram or evidence of a particular Python process. |
| 44 GIS and AI in 2025 | `ecoregions-qgis-2025`, Oct 2025 | `ch44-s01-p02` | Genuine 2025 QGIS New Zealand environmental map, illustrating contemporary desktop GIS work. Not AI output. |

The seven reused photographs, maps and screenshots remain attached to their existing canonical image-detail records. The reader adds contextual captions only; source metadata and historic passage JSON do not change. Where the image's copyright credit or provenance is described, the source and licence remain on the individual image-detail page.

## New original and rights

`nz-libraries-wikidata-osm-2019`: [Wikimedia Commons source](https://commons.wikimedia.org/wiki/File:Screenshot_of_openstreetmap_map_generated_by_NZ_Libraries_wikidata_query.png). Creator Siobhan Leachman (Ambrosia10). Originally made 19 February 2019, CC BY-SA 4.0. The acquisition workflow queried Commons live image information, matched its licence to the manifest, downloaded the unchanged source PNG, generated two uncropped WebP variants, recorded original dimensions and SHA-256 checksums, and checked all three local files.

## Held and rejected

- Chapter 7: The [1967 Gisborne–East Coast Land Use Capability Survey sheet](https://natlib.govt.nz/records/37100560) would be directly relevant. The National Library image delivery remains unavailable to the automated source pipeline; a thumbnail is not an authorised original substitute. It was not copied or published.
- Chapter 11: The University of Canterbury's 1987–1992 Intergraph and ARC/INFO computing publications provide documentation, but a reuse-cleared, identified photograph of a period GIS laboratory has not been obtained. An institutional building is labelled strictly as context.
- Chapters 12 and 29: Suitable original New Zealand Esri users group/conference or commercial GIS equipment photographs with explicit reuse rights remain a collection priority. Contextual source images do not establish attendance or ownership.
- Chapter 30: A dated screenshot of the original New Zealand Census WebMap, GUILD-on-the-Web or PHEW! is still unlocated; the 2019 image cannot be used as a substitute for that historical interface.
- Chapter 40: The original LINZ Core Records System and late-1990s council corporate WebMap interfaces remain unillustrated. The reused 2023 LINZ service image depicts later capability only.
- Chapter 43: The QGIS 3.10 [graphical modeler documentation](https://docs.qgis.org/3.10/en/docs/user_manual/processing/modeler.html) supplied a relevant candidate. The image acquisition check could not establish the exact screenshot's publication/reuse licence; it remains in the manifest as **held** and was not downloaded or published.
- Chapter 44: The [2024 Ministry for the Environment LUCAS 2020 report](https://environment.govt.nz/publications/establishing-new-zealands-lucas-2020-land-use-map/) contains directly relevant deep-learning figures, but [the ministry's copyright statement](https://environment.govt.nz/about-this-site/copyright/) excludes photography and imagery from its general CC BY 4.0 licence. Those figures were not copied. Permission or a separately licensed source is required.

## Technical checks

The new image is held at `public/assets/historical/original/nz-libraries-wikidata-osm-2019.png`, with the uncropped WebPs in `web/` and `card/`. Its individual record is in `src/content/images/`. Contextual placements are in `src/lib/chapter-media.mjs`, and tests in `tests/eight-chapter-image-release.test.mjs`. The acquisition report is `docs/media/eight-chapter-download-run-20261011.json`.

Validate the final branch using `npm ci`, `npm test`, `npm run build`, editorial-preservation checks, HTML links and production browser QA before merging. The acquisition workflow must report zero unresolved intended downloads. Only publish the exact checked commit and verify live production routes and image files. Do not interpret chapter image coverage as proof of a directly matched period photograph or screenshot for every chapter.
