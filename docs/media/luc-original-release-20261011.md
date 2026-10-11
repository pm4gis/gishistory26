# LUC original recovery, 11 October 2026

Baseline: `d545a325d0e314d122944993f797d7282c1ed1b8`, `pm4gis/gishistory26`.

## Approved publication

One original documentary map is added after `ch07-s02-p02` in Land assessment, at the paragraph explaining the eight LUC classes. The original legend visibly separates classes I–IV, V–VII and VIII. No chapter prose, accepted source, identifier, existing image file or previous placement is changed. Chapter 5 receives no substitute image.

National Library catalogue **37100560**: *Land use capability survey. Gisborne-East Coast Region : North Island, New Zealand - 1964 / drawn by the Department of Lands and Survey.* Published [Wellington]: [Department of Lands and Survey], **1967**, first edition, **1:126,720**, series **L & S 72 ; 1**. Catalogue creators: New Zealand Department of Lands and Survey; C. S. (Charles S.) Harris; J. G. (James Grant) McKee, 1916–2011; T. N. (Thomas Noel) O’Byrne. The item comprises six sheets. The acquired map is **Land use capability classes, sheet 1**, credited on the map to Harris (Department of Agriculture) and McKee (Poverty Bay Catchment Board). O’Byrne’s contribution is to the separate rock-erodibility sheets, not this class sheet.

The title’s 1964 date is retained separately from the 1967 publication date. This regional LUC survey is earlier than the 1973–1979 national first-edition NZLRI survey and has twice its denominator scale. It is rejected as an illustration of national NZLRI creation or digitisation in Chapter 5.

## Source and reuse

- Catalogue: https://natlib.govt.nz/records/37100560
- Delivery object: `IE27807111`, file `FL27807309`, Alma MMSID `9917927613502836`.
- Exact reuse statement: “This image may be used, copied and re-distributed free of charge in any format or media. Where the image is redistributed to others the following acknowledgement note should be shown : 'Sourced from LINZ. Crown Copyright reserved.'”
- Required acknowledgement appears in the caption and image-detail credit: **Sourced from LINZ. Crown Copyright reserved.** No Creative Commons licence is invented.
- The catalogue describes a 600 ppi TIFF archival scan, electronically reproduced from a LINZ original by the University of Auckland in 2014. The currently delivered archival file is **JPEG 2000**, not TIFF. Both descriptions are preserved without treating one as the other.
- Full-resolution archival JP2 obtained intact: **18,557 × 17,240**, **530,411,389 bytes**, SHA-256 `2197c64d529e7561fe93b81a0fe02cf2f5964b7284ba3259d748d02db07c13db`. It is retained separately from deployment assets, and the image page links directly to the custodian’s archival file.
- Site access copy: unchanged IIIF JPEG, **4,640 × 4,310**. Optimised WebP display **2,400 pixels** wide and card **720 pixels** wide. No cropping, recolouring or invented labels. All local asset checksums are in the image record.
- Manifest and IIIF image information are preserved in `gisborne-luc-1967-iiif-manifest.json` and `gisborne-luc-1967-iiif-image-info.json`.

The initial web-tool 403 and catalogue free-download security check did not establish that the map was unavailable. The legitimate delivery viewer exposes its public IIIF manifest; that manifest supplied the file identity and image service. Two initial large-file transfers timed out and were not treated as complete originals. The archival JP2 was resumed and verified by complete decoding at reduced resolution. Its full dimensions, printed legend, authors, title and edition were visually checked.

## Unresolved originals

The source-by-source accepted, rejected and held decisions are in `luc-original-acquisition-20261011.json`. The master alignment CSV retains all previous 181 rows and adds the approved map as row 182.

R. D. Williams’s **LADEDA Plotting Handbook**, Water and Soil Science Centre Publication 1, **May 1982**, ISSN **0111-798X**, is now obtained from NIWA at https://webstatic.niwa.co.nz/library/pHCC1.pdf. The 58-page scan contains 51 numbered pages plus preliminary material; its title and copyright pages establish the date directly. Its copyright page says **Crown Copyright 1982**. The PDF SHA-256 is `1a8ebe35e862012cff6229eea8979dc0e87d547fe4e156cb0723e943c61920bd`. It is retained for research. No extracted map, cover, command example or plotting output is published because redistribution permission has not been established. A later institutional list gives 1983, while several other contemporary lists give May 1982; the handbook itself resolves its publication date for this retrieved copy. The accepted chapter wording is unchanged.

Manaaki Whenua’s institutional mapping-edition and development pages identify the first-edition chronology and the 1977–1980 digitisation. The LRIS distribution of current or restructured polygons does not supply an original first-edition worksheet image. *Our Land Resources* (1979), DOI `10.7931/dl27-olr`, is identified through the institutional key-document index, but its Digital Library item `p20022coll27/24` was inaccessible during retrieval. The 1971 LUC Handbook is available through the Land Resources Portal, but the host’s general copying terms do not automatically settle the rights of original third-party Ministry of Works pages. These source documents were not converted into published figures.

The 2013 *NZLRI/LUC Roadmap*, section 11.3 (printed page 30), states that original Edition 1 field sheets do not appear to have been kept and points to published worksheets as the closest raw-data equivalent. This is a dated archival warning, not proof that no sheets survive today. Its specific copyright page requires publisher permission, so its figures were held despite broader host terms. No individual first-edition worksheet with verified sheet identity and rights, or original photograph of the digitisation workflow, was obtained from the institutional, catalogue, university-oriented and technical-report searches. Generic geology, unrelated maps and later GIS interfaces remain excluded.

## Release gates

`npm ci`, `npm test`, `npm run build`, manuscript preservation, original-file checksums and editorial exclusions are required before release. The release workflow additionally compares all historical data files and existing assets against the production baseline, then checks local and Cloudflare preview pages in Chromium at desktop and mobile sizes. It confirms the new paragraph position, date distinction, acknowledgement, download, image-detail provenance, no horizontal overflow and absence from Chapter 5. Existing primary geospatial figures and eight-chapter journeys are rechecked. Merge is conditional on successful checks and a successful Cloudflare preview deployment.
