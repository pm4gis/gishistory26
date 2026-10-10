# Media reconciliation and remaining gaps

Checked 10 October 2026 against the saved migration archive, the current rebuild checkout and the project image-source index. The itemised, public-safe record is [reconciliation.json](reconciliation.json).

## Results

- The predecessor audit contains 448 unique asset paths.
- All 360 derivatives saved in the archive match their recorded SHA-256 hashes and byte counts. Their decoded JPEG dimensions also match the audit: 359 are 1800×520 and one is 2000×1120.
- The audit marked 88 paths missing from that archive: 55 `linz-*`, 17 `figure-*` and 16 `heading-*` paths.
- All 448 paths now map to 20 original PNG source images. The direct source fields in the audit cover 431 paths; the image-source index resolves the remaining 17 figure paths. The 20 source files were checked as PNGs and hashed.
- Two of the audited paths are already present in this rebuild. `heading-034.jpg` matches its archived derivative byte for byte. `figure-20.jpg` is present as a 1800×1013 rebuild variant and matches the indexed Otago source; it is not the missing legacy derivative. This leaves 87 paths without derivative bytes in either the archive or the current rebuild.

No raw source images or private identifiers were added to the public repository. The reconciliation JSON records asset paths, source labels, hashes, dimensions and rights status without Drive IDs or private source URLs.

## Rights and crop review

The archived records carry the attribution text “Imagery CC4.0 LINZ 2021” across all 448 paths. Toitū Te Whenua’s guidance says aerial imagery needs a distinct attribution because LINZ does not own its copyright. It gives a short web attribution and asks users to link to the aerial-imagery attribution guidance: [LINZ aerial imagery attribution](https://www.linz.govt.nz/products-services/data/licensing-and-using-data/attributing-elevation-or-aerial-imagery-data). The archive does not identify the individual imagery layer or its licensor, so the rights status remains pending for every candidate. Do not import the missing derivatives automatically.

Integrity checks do not establish that a crop is suitable. One inspected 1800×520 derivative clips a coordinate annotation at its top edge. Review each image for coordinates, dates, attribution marks and other source details before reuse. The recovered derivatives remain in the private migration archive; none were added to the rebuild in this pass.

## Other outstanding media

The accepted source references still include `/assets/images/landlink-1999-topographic-database.jpg`, which is absent. A temporary redirect preserves the source link and caption. Seven DOSLI photograph captions also remain without local image binaries. These are separate from the 448-path audit. Ten permitted-download research binaries still need licence and attribution reconciliation.

The prior automated publication-export attempts ended at HTTP 403 and a security challenge. That endpoint was not retried or bypassed; this pass used the saved archive and the authorised source-image records.
