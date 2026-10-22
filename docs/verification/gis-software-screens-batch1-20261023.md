# GIS software screenshots and generated maps — first acquisition verification

Date: 23 October 2026 (New Zealand)  
Branch: `media/gis-software-screens-batch1-20261023`

## Actual acquisition

The independent GitHub acquisition workflow [#39873250208](https://github.com/pm4gis/gishistory26/actions/runs/39873250208) **completed successfully** after resolving chapter-card preservation checks and the Git rebase logic. It produced a source-specific report at `docs/media/gis-software-screens-batch1-results.json`.

- **6 new original GIS screenshots** and 12 optimised WebP display/card derivatives, all locally stored.
- 6 new source-credited image records under `src/content/images` with original/display/card hashes, dimensions and exact relevant `afterParagraphId` linkage.
- **1 candidate held:** the 2002 Esri ArcView file URL returned HTML rather than a valid source image; no blank or fabricated substitute was published.
- The acquisition job ran **npm test** and **npm run build**, including historical content preservation, source-file and image checks, with success before committing binaries.
- It did not alter the existing 201 historical image records, their gallery pages, their original binary content, or existing approved chapter-card choices. The former 201-image alignment decisions remain frozen in `docs/media/chapter-image-alignment-wave2-20261011.csv`. The current batch has a separate seven-candidate manifest with exact in-passage decisions.

| Authentic GIS output / screen | Original publisher | Chapter and exact link | Explanation |
| --- | --- | --- | --- |
| ArcMap WMS layout and map legend | Manaaki Whenua | 21, `ch21-s05-p02` | National spatial services and datasets maintained by separate organisations |
| QGIS 3.4.3 WMS layer legend | Manaaki Whenua | 32, `ch32-s04-p01` | Open-source GIS desktop and scientific layers |
| ArcGIS Desktop with Canterbury Maps layers | Canterbury Maps / Aurecon | 23, `ch23-s04-p01` | Digital council services and asset/engineering layers |
| Canterbury Maps browser GIS viewer | Canterbury Maps / Aurecon | 33, `ch33-s01-p01` | Public GIS viewers |
| 2016 LINZ Data Service screenshot | National Library of NZ / LINZ | 33, `ch33-s05-p02` | Discovery of downloadable national spatial data |
| 2016 LINZ digital topo editing screenshot | RNZ / LINZ | 15, `ch15-s04-p02` | Digital cartographic production from spatial datasets |

## Acquisition integrity

The script requires real HTTPS image content with recognised format and dimensions, stores the publisher's original bytes unmodified, makes uncropped WebP derivatives and calculates SHA-256 hashes for every local file. It never fabricates a source image or associates an image with unrelated historical text. Source dates are qualified where capture dates are unverified. Links to the original source and creator are on each image detail page.

Image online availability alone is not evidence of a licence. Where no reuse licence is explicitly documented, the original publisher's rights and source details remain attributed; rights assertions are not silently converted into Creative Commons claims.

## Reader and navigation protections

`src/lib/chapter-media.mjs` already places image records beside the exact approved paragraph in chapter text. The new acquisition records contain both chapter slug and the checked paragraph ID, and `tests/gis-screen-batch1.test.mjs` verifies each. **New GIS-screen batch records are excluded from the unrelated chapter navigation image selector**, preserving the visually approved existing cards on homepage and chapter catalogue. The legacy image registry test now checks the original decisions unchanged and additionally checks each new acquired image against the new independent manifest.

## Remaining work

This is a first six-image tranche, **not completion** of the desired 60–100-image visual expansion. Further source research should prioritise authentic New Zealand 1980s–2000s screens (ARC/INFO, LADEDA, MAPPAK, DCDB, ArcView 3.x, MapInfo, DOCgis, Landonline), original GIS-produced analysis maps from locally hosted periodicals, and modern LiDAR, raster, hydrology and demographic GIS outputs. Subsequent batches need similarly precise acquisition, annotation, QA and placement. No screenshot or output produced after 31 December 2025 should enter the historical account.
