# Media reconciliation and remaining gaps

Checked 10 October 2026 against the saved migration archive, the current rebuild checkout and the project image-source index. The itemised, public-safe record is [reconciliation.json](reconciliation.json).

## Results

- The predecessor audit contains 448 unique asset paths.
- All 360 derivatives saved in the archive match their recorded SHA-256 hashes and byte counts. Their decoded JPEG dimensions also match the audit: 359 are 1800×520 and one is 2000×1120.
- The audit marked 88 paths missing from that archive: 55 `linz-*`, 17 `figure-*` and 16 `heading-*` paths.
- All 448 paths now map to 20 original PNG source images. The direct source fields in the audit cover 431 paths; the image-source index resolves the remaining 17 figure paths. The 20 source files were checked as PNGs and hashed.
- Two of the audited paths are already present in this rebuild. `heading-034.jpg` matches its archived derivative byte for byte. `figure-20.jpg` is present as a 1800×1013 rebuild variant and matches the indexed Otago source; it is not the missing legacy derivative. This leaves 87 paths without derivative bytes in either the archive or the current rebuild.

No raw source images or private identifiers were added to the public repository. The reconciliation JSON records asset paths, source labels, hashes, dimensions and rights status without Drive IDs or private source URLs.

## Rights and crop decisions

Every one of the 20 source records and 448 mapped asset paths now has an explicit decision in [reconciliation.json](reconciliation.json). All 448 are on hold for publication. The archive’s repeated “Imagery CC4.0 LINZ 2021” text is an unverified claim; it does not identify an imagery collection, capture date or licensor.

The authoritative [NZ Imagery Survey Index, layer 95677](https://data.linz.govt.nz/layer/95677-nz-imagery-survey-index/) exposes survey names, suppliers, licensors and flight dates. The [LINZ-managed imagery STAC catalogue](https://nz-imagery.s3.ap-southeast-2.amazonaws.com/catalog.json) lists collection extents, capture intervals, licences and licensor roles. The source screenshots and mapping records do not contain a collection ID or capture date, so no exact collection or licensor can be assigned. A coordinate can intersect surveys from several capture periods; location alone is not attribution. LINZ’s [aerial-imagery attribution guidance](https://www.linz.govt.nz/products-services/data/licensing-and-using-data/attributing-elevation-or-aerial-imagery-data) explains the distinct attribution needed for aerial imagery.

Crop decisions are recorded per path as well. One inspected 1800×520 crop (`linz-6ae974ac4846.jpg`) is rejected because it clips a coordinate annotation. Two images already present in the rebuild have limited visual crop dispositions: `heading-034.jpg` is an acceptable banner crop, and `figure-20.jpg` is a full-frame resize. Their rights are still pending. A further 358 crop decisions remain pending path-level visual review; 87 missing-derivative paths cannot be assessed until their binaries are recovered; archive hash and dimension checks do not approve a crop. No additional derivative was recovered or prepared, and no private source file was added to the repository. The 87 remaining derivative gaps stay unresolved.

## Other outstanding media

The accepted source references still include `/assets/images/landlink-1999-topographic-database.jpg`, which is absent. A temporary redirect preserves the source link and caption. Seven DOSLI photograph captions also remain without local image binaries. These are separate from the 448-path audit. Ten permitted-download research binaries still need licence and attribution reconciliation.

The prior automated publication-export attempts ended at HTTP 403 and a security challenge. That endpoint was not retried or bypassed; this pass used the saved archive and the authorised source-image records.
