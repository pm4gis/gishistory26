# Social sharing image from verified project source maps

13 October 2026

The social-sharing image is composed during the Astro build from four **existing documentary images in this repository**. It uses the Slate Blue visual system and a single, sans-serif title, `A history of GIS in New Zealand`. No geographic outline, contour, sounding, coordinate value or place label is constructed by the graphic generator. The map sheets and historical aerial image are displayed as supplied, with only uniform resizing, padding and layout.

| Original image in the repository | Date and subject | Source evidence | Credit |
| --- | --- | --- | --- |
| `src/content/images/ongaonga-linz-topo50-2020.json` | LINZ Topo50 sheet BL37, Ongaonga, 2020 | https://commons.wikimedia.org/wiki/File:Ongaonga_map.png | LINZ, CC BY 4.0 |
| `src/content/images/gisborne-east-coast-luc-map-1967.json` | Gisborne–East Coast land-use capability classes sheet 1, published 1967 | https://natlib.govt.nz/records/37100560 | Department of Lands and Survey, LINZ Crown copyright notice |
| `src/content/images/rotoiti-bathymetry-2021.json` | GNS Science bathymetric survey of Lake Rotoiti, 2021 | https://commons.wikimedia.org/wiki/File:Rotoiti_Bathymetry.png | C. E. J. de Ronde, F. Caratori Tontini and J. Black, GNS Science, CC BY-SA 3.0 |
| `src/content/images/retrolens-c515a148bd788efa.json` | Aerial photograph, Verdon College area, Invercargill, 7 June 1946 | https://commons.wikimedia.org/wiki/File:1946_aerial_image_of_Verdon_College_site.jpg | Southland Regional Council, NZ Crown, Retrolens and LINZ, credits as on original file record |

The social preview does **not** present these geographically separate images as one continuous or contemporaneous map. The 1946 aerial is an actual historic frame, the 1967 land-assessment map predates widespread GIS, and the 2020/2021 Topo50 and bathymetry exemplify subsequent cartographic products.

Source artwork remains in `public/assets/historical/web/` and full source, licence and original copy information is preserved in each `src/content/images/` record. No changes to the original images or their metadata have been made.

## Build and verification

`scripts/generate-social-image.mjs` reads each project's original image record, checks source and attribution fields, and fails if an expected stored source asset has been changed. `sharp` assembles the card at 1200 × 630 with `fit:contain`, retaining the original map content. Output is `public/assets/social/nzgis-verified-maps-20261013.png`. Open Graph and Twitter metadata use that asset and the changed filename prevents reuse of the previous cached social card.

The source-based unit test is in `tests/chapter-navigation-share.test.mjs`, and `scripts/check-build.mjs` checks the generated PNG signature, dimensions and live metadata path. The GitHub publication build, Chromium browser QA and Cloudflare Pages deployment must pass before this change is merged.