# Documentary image coverage, wave 3
Updated 10 October 2026 following acquisition of eight additional New Zealand geospatial images.

## Verified result
Of 44 chapters, **29** have at least one locally stored documentary image and **15** remain without one. The new batch covers chapters 14, 18, 21, 22, 24, 33, 37, 41, all previously unillustrated.

The site now has **41 newly acquired source-original files** (18 from wave 1, 15 from wave 2, 8 from wave 3), along with 41 local web-optimised display copies and 41 local thumbnails. Two older registered image records are retained, for **43 images in the archive**. Every acquired original has source and checksum metadata; wave 3 original bytes total 19,564,613 bytes.

The wave 3 figures consist of seven government-produced images sourced directly from LINZ's published documentation and one independently licensed Kāpiti Island LiDAR map from Wikimedia Commons. Source-original URLs, archive references, credit, context, date precision, licensing and exact chapter associations are stored in `src/content/images/`. Crosslinks to the existing LINZ entity page appear on the new source detail pages. Display images are resized and re-encoded as WebP without cropping, preserving originals.

## Source verification
- LINZ's own website material is released under CC BY 4.0 unless specifically excluded; the primary licence text at `https://www.linz.govt.nz/copyright` was verified by the downloader. This does not override third-party material or the restriction on inappropriate emblem use. Screenshots reproduced here are LINZ's own published how-to illustrations, not historic GIS system interfaces unless described as such.
- The Kāpiti map was identified on Commons as a 2024 derivative of LINZ LiDAR data, made by contributor Vallee with QGIS and aerialOD. The Commons licence was checked as CC BY-SA 4.0 and source-original original file was archived without modification.
- The preservation checks and CI build generate the image pages and verify original binaries, display derivatives and SHA checksums. The release must be merged/deployed only after GitHub's final verification workflow passes.

## Unillustrated chapters still requiring period-specific evidence
- Chapter 5, Digital land inventories: from-map-sheets-to-spatial-data.
- Chapter 6, Early GIS systems: when-gis-became-gis.
- Chapter 7, Land assessment: mapping-land-as-data.
- Chapter 10, Government GIS: gis-inside-government.
- Chapter 11, University teaching and research: universities-build-a-field.
- Chapter 12, Companies and user groups: an-industry-and-community-form.
- Chapter 27, Health population and place: health-population-and-place.
- Chapter 29, The GIS profession: becoming-a-gis-professional.
- Chapter 30, Early web mapping: the-first-web-maps.
- Chapter 31, Google Maps and Earth: google-changes-the-audience.
- Chapter 34, GIS in the field: mapping-leaves-the-office.
- Chapter 38, Drone mapping: mapping-from-a-drone.
- Chapter 40, Enterprise GIS: enterprise-gis.
- Chapter 43, GIS automation: automating-the-gis-work.
- Chapter 44, GIS and AI in 2025: gis-at-the-end-of-2025.

These gaps require actual software screens, cartographic outputs, survey scans, dated institutional photographs or material directly associated with the named systems. Particular collection priorities are 1970–1980s NZLRI and NZMS290, early DOC/DOSLI/GIS screenshots, Esri and local user-group archives, tertiary teaching laboratories, geospatial health mapping, early web maps, Google Earth, drone orthomosaics, council enterprise GIS and AI applications. A generic product shot or modern reference must not be mistaken for original historic systems.

The National Library pages for NZMS290 land inventory sheets document attributable reuse, but the original delivery service triggers an access protection challenge. No protected content was obtained or embedded. The historical media migration archive and separate unresolved originals remain untouched.

## Source and implementation files
- `docs/media/chapter-image-coverage-20261010-wave3.csv` gives one row for every chapter and the precise archived image IDs.
- `docs/media/curated-sources-wave3.json` gives file-specific acquisition provenance and captions.
- `docs/media/chapter-download-run-wave3.json` reports verified original size, dimensions and SHA-256 for eight acquired images.
- `public/assets/historical/original/` stores original source binaries. `web/` and `card/` store display and thumbnail derivatives.
- `src/pages/images/[slug].astro` and `src/styles/site.css` provide responsive source-image pages constrained by reading margins and viewport height.
- Previous waves' registers are retained as dated historical baseline evidence.

No prior publication content, passages, people or relationships were rewritten.
