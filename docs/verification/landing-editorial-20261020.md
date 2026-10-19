# Landing page editorial revision

Base: production commit 3aba83174140d9c1e2aefd24059bc8b86f97cc8b, retaining publication-return behaviour from PR #127.

The opening is shorter, explains GIS in ordinary language and states the historical endpoint of 31 December 2025. The short-history button remains the primary route with an approximate reading time. Background pause/play is retained as a labelled corner control. The five accepted statistics retain their order and build-derived totals, with compact wrapping on small screens. The redundant navigation strip below the opening is removed.

The feature slider shows one complete story per view with keyboard arrows, swipe, Previous/Next, optional timed playback and pause on focus or page hiding. The five homepage headlines and teasers are edited separately from the accepted chapter prose. Dates in the feature copy come from the existing linked passages. Image labels use the retained image records' own dates and titles, making later illustrations distinguishable from the historical event being discussed. The census-price feature uses the accepted 2023 Census map produced in October 2024, rather than the LINZ screenshot with an uncertain capture date. Its original image record, chapter association and attribution remain intact.

## Feature evidence

| Feature | Existing passage | Evidence |
|---|---|---|
| The maps and records GIS inherited | existing-map-records-0170b9d0d6 | ch01-s01-p01 to ch01-s01-p03: plans, topographic and statistical records inherited by computer mapping |
| The 1989 national GIS conference | a-shared-name-bc94bd66ec | ch06-s01-p01 and ch06-s01-p02: 26 June 1989, Wellington, 116-page proceedings and the fields represented |
| Putting survey plans and land titles online | from-register-to-transaction-system-60c6ff7b97 | ch14-s01-p01 to ch14-s01-p03: integrated records and development approval in November 1997 |
| GIS moves into the web browser | gis-reaches-the-browser-78faf09cfe | ch30-s01-p01, ch30-p-aedbf2d5def6, ch30-p-f159a962ca8d: local workstations, central services and browser access |
| The price of census geography in 2002 | viewing-and-reuse-8d2a393282 | ch33-s01-p01 and ch33-s01-p02: free Census WebMap and NZ$1,200 plus GST for the Meshblock Database |

The six chapter previews keep their thumbnails, original destinations and anchors, while removing repeated excerpts. All 44 homepage chapter anchors remain available through the compact contents disclosure. All eight themes remain direct links with small thumbnails and complete titles. No chapter, passage, event, relationship, publication, source or image collection records are changed. Full chapter and theme catalogues retain their detailed layouts.

## Verification

Automated content tests include the five feature destinations and the explicitly dated claims. The production build runs preservation, historical-media, internal-link and sitemap checks. The editorial browser suite checks six viewport widths, compact opening and card dimensions, all five slider positions and wrap-around, keyboard controls, pause/play, normal/reduced motion, all 44 anchors and WCAG A/AA axe scans. Existing first-visit, homepage, palette, tile, publication and return-navigation browser checks remain in CI. Browser screenshots and structured results are retained as workflow artifacts. Chromium checks do not certify all browsers or assistive technologies.
