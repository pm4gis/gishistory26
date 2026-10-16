# Documentary GIS image archive ledger

Prepared 16 October 2026. Repository: pm4gis/gishistory26. This file is the durable checkpoint for pre-2025 documentary GIS image acquisition. Do not modify or deploy the predecessor site.

## Repository state

- Base: main at 7292b66f3a95eaae9a6221eb806e0578631eab28; no assumption that main remains at this commit.
- Working branch: media/linz-2015-tilemill-layers-20261016.
- Archive entries before this batch: 189 JSON records (GitHub directory listing), with 174 original asset files in public/assets/historical/original.
- Release stage: archive-only acquisition; chapter, record and catalogue image placements are expressly deferred.
- PR: https://github.com/pm4gis/gishistory26/pull/98 . Acquisition GitHub Actions run 38886870835 succeeded after SHA/source checks, npm ci, npm test (128 tests), npm run build, and desktop/mobile Chromium browser QA. Automated asset commit on the feature branch is 5105152ca035d7fe369e8b750d4913bdae7799fa. Subsequent PR verification and Cloudflare production deployment remain pending; no live publication or chapter placement is claimed.
- Latest accepted imagery and existing images preserved; no historical prose, paragraph relationships, image routes, event dates, chapter images or theme media intentionally edited.

## Batch 1: archived 2015 LINZ TileMill layer previews

The original 2015 LINZ supporting-layer thumbnails are in the project repository at https://github.com/linz/linz_basemaps . The source repository's 9 November 2016 commit 6e1bb61b47d8e357def869c994e9c827ade0b13d is a fixed, dated snapshot. Its README Licensing section explicitly specifies CC BY 3.0 New Zealand and credits Crown copyright 2013, LINZ and the New Zealand Government. Dates below are Git change-history dates; the original screenshot/render capture dates are not independently established.

| Archive slug | Repository source path | Git blob SHA-1 | Documented Git history | Decision |
| --- | --- | --- | --- | --- |
| linz-geodetic-marks-layer-2015 | SupportingLayers/GeodeticMarks/.thumb.png | e87207f457e8bbd68bd99265e2f9f37d95b02968 | 25 May 2015 | Acquired and source-verified in run 38886870835; merge and production checks pending |
| linz-motorways-layer-2015 | SupportingLayers/Motorways/.thumb.png | 214d43f49bddfb186fdd885c8752bed6d1036356 | 30 January 2015 | Acquired and source-verified in run 38886870835; merge and production checks pending |
| linz-parcel-wireframe-layer-2015 | SupportingLayers/Parcel_WireFrame/.thumb.png | 19bf1984d8a47a122b69ca4981005848917db7c0 | 18 February 2015 | Acquired and source-verified in run 38886870835; merge and production checks pending |

Source snapshot and licence: https://github.com/linz/linz_basemaps/blob/6e1bb61b47d8e357def869c994e9c827ade0b13d/README.md#licensing . The batch archive script downloads each unchanged .thumb.png from the pinned commit and checks its Git blob SHA-1 before generating SHA-256, original dimensions and uncropped WebP display derivatives. It never upscales images and cannot overwrite accepted files. Each original is documented separately with title, source URL, credit, period, licence evidence, caption, alt text and original URL. Its archive-only status explicitly prevents accidental passage association.

Acquired in GitHub Actions, source files checked against pinned Git blobs:
- linz-geodetic-marks-layer-2015 (LINZ 2015; original and two WebP derivatives; image metadata generated with checked SHA-1 and SHA-256)
- linz-motorways-layer-2015 (LINZ 2015; original and two WebP derivatives; image metadata generated with checked SHA-1 and SHA-256)
- linz-parcel-wireframe-layer-2015 (LINZ 2015; original and two WebP derivatives; image metadata generated with checked SHA-1 and SHA-256)

## Sources searched and decisions

- LINZ basemap GitHub repository, 2015 layer originals: three accepted for guarded ingestion. The main colour basemap and terrain thumbnail are already present in the archive as linz-2013-north-island-natural-colour-bathymetry and linz-2013-terrain-natural-colour-preview; do not duplicate.
- LINZ SupportingLayers/Labels/.thumb.png: rejected as a low-information 870-byte preview.
- National Library of New Zealand, Aaron Jordan, “The future of maps” (21 July 2016), https://natlib.govt.nz/blog/posts/the-future-of-maps : first-hand LINZ Data Service and mapping-process screenshots found. Rights for the exact images, original file identity and byte-level provenance still to verify; not approved for download/publication.
- RNZ, “Points, lines and polygons”, 2016, https://www.rnz.co.nz/national/programmes/ourchangingworld/audio/201797240/points-lines-and-polygons-the-art-of-making-maps : contemporary desktop GIS screen located. No source-image specific redistribution licence confirmed; pending.
- Lincoln University GIS blog, 2022 map analysis article, https://blogs.lincoln.ac.nz/gis/zones-of-influence/ : real GIS screen. Reuse terms for the image and original capture date need confirmation; pending.
- Manaaki Whenua WMS help, https://maps.scinfo.org.nz/using.html : ArcMap WMS screen. Age of exact image and its specific republication terms need verification; pending.
- LINZ Data Service WMTS QGIS documentation, https://www.linz.govt.nz/guidance/data-service/linz-data-service-guide/map-tile-services/using-lds-wmts-qgis : original GIS screenshots and QGIS 3.4.11 example identified. Live page may have been updated. Obtain a pre-2025 preserved version and exact image licence before ingestion.
- Existing October 2026 catalogue curation, chapter-alignment registers and direct GIS follow-up: preserved; CERA map already included, Geographx and additional council original map rights unresolved. See docs/media/direct-gis-image-research-eight-20261015.md and docs/media/unresolved.md.

## Verification gate and exact next work

1. Confirm batch acquisition GitHub Action ran on the branch and inspect logs, image hash checks, npm ci, npm test, npm run build, image paths and desktop/mobile Chromium QA.
2. Open/review focused archive-only PR if not already open; merge only when new binaries are committed and all automated checks pass. Confirm Cloudflare production commit and live /images/ entries and original links. Report actual counts rather than the 500-image aspiration.
3. Continue source-specific pre-2025 GIS interface search at LINZ/National Library 2016 talk first; recover original screenshots and historical capture/source dates and clear reuse licence. Repeat with archival council, university, Archives NZ and National Library sources. Record duplicates, blocked candidates and explicit rights decisions without publishing unverified ones.
4. After the archive batches are fully published, create a separate reviewed PR for chapter/story placements based on exact paragraph and source relationships. Preserve all existing associations.


## Batch 2: LINZ QGIS Data Importer originals, 2018–2021

Base main 50cc01f98847571fe7c271dbfa6fe7dfa3208c7d, working branch media/linz-qgis-importer-2018-2021-20261016; pull request #99 https://github.com/pm4gis/gishistory26/pull/99 . Original acquisition run 38888225681 passed source hashes, npm ci, all 129 tests, npm run build and responsive Chromium archive/rights checks. Assets were committed to the branch as 7013d743d1832e8a5dd3e530a72551a647c9aaa9. PR verification, merge and production are pending. This is archive-only research, with no automatic story or chapter placement. The 2015 first batch is merged through pull request #98, and Cloudflare confirms production deployment; the public custom-domain HTTP probe remains unavailable.

Source: https://github.com/linz/linz-data-importer/tree/fff9011d63a921360dc0bcc65d5015268a1c33e8 ; source README embeds both examples; root LICENCE of the same immutable 2021 commit explicitly gives BSD 3-Clause redistribution rights, attribution and disclaimer, copyright 2018–2021 Toitū Te Whenua/LINZ and New Zealand Government. Full original licence is retained in public/assets/historical/licences/linz-data-importer-bsd-3-clause.txt and linked from each image detail page.

- linz-qgis-data-importer-settings-2018: original images/settings_example.png, 58,309 bytes, Git blob a4f9aff65a31f6f301d6dc1ec704c99f99cf3438. Image in repository by 13 November 2018. Visually inspected in source; displays the LINZ Data Importer Settings tab with placeholder API keys (not active private keys).
- linz-qgis-data-importer-demo-2021: original images/import_example.gif, 1,384,073 bytes, Git blob 4324002b1f5415be12c41443de7530d30cdc8bd3. Commit on 21 June 2021 explicitly updated GIF for QGIS 3.16; the exact underlying recording date is unknown. Original animation preserved with first-frame display derivative.

- linz-qgis-data-importer-settings-2018: immutable pre-2025 original, WebP derivatives and explicit archive-only decision acquired, Git SHA verified.
- linz-qgis-data-importer-demo-2021: immutable pre-2025 original, WebP derivatives and explicit archive-only decision acquired, Git SHA verified.

Checks required: npm ci, npm test, npm run build, historical-original hash checks and browser QA. Then focused PR, GitHub checks, Cloudflare deployment and archive live pages. Rights-held or uncertain National Library, council, Archives NZ, GIS company and agency candidates remain pending until licence and first-publication date checked. Do not use or update the predecessor site.
