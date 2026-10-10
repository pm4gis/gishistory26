# Historical documentary image coverage, second release
Prepared 10 October 2026 against the verified source-original image registers and the 44-chapter master candidate list.

## Storage and integration
The first release saved 18 source originals, 18 web derivatives and 18 thumbnails. The second release added **15 originals**, **15 display WebP files** and **15 card WebP files**, with file-specific Commons licence checks, SHA-256 original checksums, creator and date metadata, detailed captions and standalone image pages. Total **33 new locally stored source originals**, **66 new WebP derivatives**, plus the two older registered images. The first wave added 38,422,764 original bytes and the second added 67,250,520 original bytes; the combined 105,673,284 original bytes are distributed across individual files, the largest under the 25 MiB per-file Pages limit.

The chapter reader already embeds the self-hosted documentary images as individual chapter figures and in image galleries. Image pages have their own source references, creator, date, contextual explanation, checksum, original-file download and reciprocal chapter link. No images are fetched from third-party sites at page-render time.

## Chapter coverage
21 of 44 chapters have at least one new directly associated historical documentary image. **23 remain without a confirmed locally stored subject-specific image.** Some newer images provide retrospective examples and do not claim to depict the origins of systems described in the chapter. A landscape photo with a documented subject is an illustration of that subject, not evidence of the technology that recorded it.

New wave images are linked with chapters: 1, 2, 3, 4, 8, 9, 15, 17, 19, 25, 28, 42. The source-covering count is based on actual downloaded files, not candidates alone.

### Still awaiting specific material
- Chapter 5, Digital land inventories: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 6, Early GIS systems: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 7, Land assessment: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 10, Government GIS: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 11, University teaching and research: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 12, Companies and user groups: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 14, Landonline: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 18, GPS in practice: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 21, Spatial data infrastructure: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 22, Desktop GIS: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 24, GIS across government: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 27, Health population and place: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 29, The GIS profession: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 30, Early web mapping: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 31, Google Maps and Earth: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 33, Open spatial data: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 34, GIS in the field: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 37, LiDAR mapping: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 38, Drone mapping: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 40, Enterprise GIS: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 41, Spatial services and the cloud: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 43, GIS automation: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.
- Chapter 44, GIS and AI in 2025: obtain a contemporary historical illustration, original system screenshot, original project map, institutional photograph, equipment photograph, diagram or other verified documentary subject tied directly to its passages.

## Evidence and safety checks
The second download job in GitHub Actions succeeded; 15/15 original images were retrieved, verified against Commons licence metadata, decoded and stored, with zero failures and zero holds. `npm test` and `npm run build` succeeded in the image acquisition job. Additional `scripts/check-historical-image-files.mjs` validation now checks local originals, thumbnails, displayed derivatives, SHA-256 hashes, dimensions and metadata as part of all production builds.

The first wave's unresolved Kaikōura radar image with JAXA/Google Earth content remains held and was not reintroduced. Material behind National Library's automated access challenge, including specific NZMS290 land inventory imagery, was not downloaded through this workflow. The collection still needs more authentic late-twentieth-century New Zealand GIS software screenshots, archive photographs, land inventory maps and local government application outputs.

## Files
- `docs/media/chapter-image-coverage-20261010-wave2.csv`, one chapter per row with exact registered image slugs.
- `docs/media/commons-discovery-wave2.json`, search evidence, file titles, licences and descriptions.
- `docs/media/curated-commons-queue-wave2.json`, selected files and full captions/context.
- `docs/media/chapter-download-run-wave2.json`, the authoritative download outcome and checksums.
- `src/content/images/*.json`, public image metadata and chapter links.
- `public/assets/historical/original/`, original source files; `web/` and `card/`, compact derivatives.

This is a substantive image expansion, rather than an assertion that every historical chapter now has a period-correct illustration. The remaining source-gap status should remain visible for future acquisitions.
