# Chapter-specific documentary imagery audit
10 October 2026. Baseline: `pm4gis/gishistory26`, `main` as read on 10 October 2026. Editorial research only: no live site, historical text or media binaries changed.

## Scope and finding
The repository contains 44 chapter records plus one preface, 588 passage JSON files, two registered historical image records (`linz-otago` and `linz-pauatahanui`), two `public/assets/images` binaries and 28 decorative WebP derivatives. Chapter 39 references one of the historical records as a header. The decorative aerial wallpaper collection is deliberately non-evidentiary and must not be passed off as a chapter illustration. The live history.pm4gis.nz pages were not independently reachable through the public web inspection tool; these counts refer to the production repository, not a rendered browser crawl.

The companion [44-chapter candidate register](chapter-image-candidates-20261010.csv) maps every accepted chapter title and slug to a specific proposed documentary object, source page when verified, rights state, placement and editorial caution. This is an evidence-oriented sourcing register, **not** a permission to publish every row.

| Status | Chapters | Meaning |
| --- | ---: | --- |
| verified-file-page | 10 | Named, relevant, directly identified Wikimedia Commons file page; stated licence checked on source listing, source/binary and attribution still to reconcile before publication. |
| verified-licensor-page | 4 | Named New Zealand map sheets at National Library with expressly documented LINZ redistribution permission and required credit. |
| rights-review | 9 | Actual institutional image/page identified or licence needs source-specific confirmation. Do not copy yet. |
| dataset-not-rendered | 1 | CC-licensed specific dataset found; no checked derivative, capture or figure exists yet. |
| source-to-find | 20 | Concrete historical image target identified, but no exact public reusable file was established; do not add generic stock image or fabricate a picture. |

Some rows deliberately reuse one eligible source: a 1978 land-inventory sheet may support both land inventory and forestry chapters, but captions must identify the distinct sheet or overlay. Rows with modern examples must be captions within the relevant passage, not false representations of early system history. A single generic graphic must not be repeated as the header for unrelated chapters.

## Strong documented candidates
- Chapter 1: Tuki Te Terenui Whare Pirau's map, drawn 1793, published 1798. Alexander Turnbull Library copy on Wikimedia Commons; public domain. Indigenous mapping history should be described with specific context and no unsupported claim that the original was made using GIS.
- Chapter 5: Tiniroto–Wairoa NZMS 290 New Zealand Land Inventory, 1978–79. National Library's item permits redistribution with the acknowledgement “Sourced from LINZ. Crown Copyright reserved.”
- Chapters 7–8: Hukerenui–Whangārei NZMS 290 land inventory, including the exotic forestry suitability overlay, 1978–85. National Library grants the same attributed reuse.
- Chapter 9: GNS Science's QMAP map of the Christchurch area, 2008. Wikimedia Commons identifies the published geological map and CC BY 4.0.
- Chapter 13: Waikaka Survey District cadastral plan, March 1888, Archives New Zealand reference DABB D101 423/IN 3939 (R6617915), CC BY 2.0.
- Chapter 20: Wrights Hill Fortress vertical aerial photograph, 28 September 1945, survey SN373, run B, photo 15, CC BY 3.0.
- Chapter 23: Victoria Square, Christchurch aerial coverage circa 1955, Canterbury historical imagery; CC BY 3.0. Best as an inline example of preserved imagery, not a claim about 1990s council software.
- Chapter 32: Auckland OpenStreetMap 2018 map, author attribution and compatible tile/database licence required.
- Chapter 36: NASA Landsat 7 observation of Christchurch and Banks Peninsula acquired 25 September 2001, published 2003, public-domain NASA imagery.
- Chapter 39: NASA Landsat plus Shuttle Radar Topography Mission visualisation of Mt Ruapehu, 2002, public-domain NASA imagery. Preserve the existing Pauatahanui image as a separate existing site asset.
- Chapter 42: NASA Earth Observatory and USGS-related mapped Christchurch earthquake shaking from 4 March 2011, public-domain NASA image. Say it is an annotated later mapping product, not a real-time operations screen.

## Sourcing gaps deserving targeted searches
The early decades need real MAPPACK/computer plotter output, original 1970s New Zealand remote sensing frames, the earliest NZ GIS conference material, DOC/DOSLI screens, a university GIS laboratory photograph, early DCDB and Landonline screens, early council GIS layouts, utility network maps and late-1990s web GIS screenshots. Later chapters need actual NZ GPS fieldwork, mapping apps, a documented public safety GIS product, drone orthomosaics, cloud/enterprise implementations and verifiable NZ geospatial AI examples published by 2025.

Start with original institutions and creators and archived publications. Request a licence or permission from the actual owner if the rights are not clear. Photographs of identified people require accurate identities and provenance; publication licence remains a separate requirement. Do not use generic photos of laptops, drones, cartographers, satellite dishes or glowing data networks to fill these gaps.

## Integration method
1. Reconcile the older media archive and current draft PR #7 before reusing a path or title. That PR concerns 20 owner-supplied aerial landscape sources and pending rights decisions; it is a separate decorative-image exercise. Do not merge its source/rights decisions into these historical figures.
2. For each proposed file, recover the original from the recorded page, verify the exact source item, date, creator, rights, licence URL, image dimensions and permission for on-site reproduction. Retain the source URL and credit line in the image record. File-page verification alone is not equivalent to binary verification.
3. Record a definitive allowed/hold/rejected decision. Only allowed records receive a local original, checksum and web derivative, with documented resize/crop and preserved required attribution. Originals and any licensed non-public material stay in appropriate protected storage.
4. Add eligible figures to `src/content/images`, then associate their `imageId` with the appropriate `src/content/passages` figure blocks. Use `headerImageId` only where the figure represents the chapter well; keep existing figure/heading links unchanged. A heading without a suitable period-correct asset can remain unillustrated while research continues.
5. Add descriptive alt text, visible caption and credit, source link, licence link, full image detail page, responsive and lazy-loaded web derivatives, and a rights audit. Keep historic map legibility at mobile size; provide a click-through to a larger readable map.
6. Run preservation checks, `npm ci`, `npm test`, `npm run build`, verify no external broken images or internal broken links, and inspect responsive layouts in all four colour themes. Release independently from this research branch after rights and source-binary checks.

## Publication status
This document and the accompanying CSV are research deliverables. They have not published images or altered chapter prose. The current production repository remains unchanged.