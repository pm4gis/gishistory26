# Original NZ GIS periodicals: October 2026 release evidence

Historical period covered by original publications: 1993–2004. Acquisition and research date: 18 October 2026. This is an internal QA and provenance record, not public rights copy.

**Original magazine PDFs newly archived: 15**, covering **231 pages** and **72,919,671 bytes** (72.9 MB). The previous site contained 121 PDFs. With this release it contains **136 locally hosted PDF files**, subject to the final GitHub and Cloudflare production deployment checks.

| Original date | Magazine and issue | Pages | Original bytes | On-site reader |
|---|---|---:|---:|---|
| June 1993 | Conservation Science Newsletter, issue 2 | 16 | 5845922 | /publications/pdf/doc-conservation-science-newsletter-2-1993/ |
| August 1993 | Conservation Science Newsletter, issue 3 | 16 | 5132267 | /publications/pdf/doc-conservation-science-newsletter-3-1993/ |
| October 1993 | Conservation Science Newsletter, issue 4 | 12 | 4608639 | /publications/pdf/doc-conservation-science-newsletter-4-1993/ |
| February 1994 | Conservation Science Newsletter, issue 6 | 12 | 4461418 | /publications/pdf/doc-conservation-science-newsletter-6-1994/ |
| August 1994 | Conservation Science Newsletter, issue 9 | 16 | 5642401 | /publications/pdf/doc-conservation-science-newsletter-9-1994/ |
| March 1995 | Conservation Science Newsletter, issue 12 | 12 | 4287446 | /publications/pdf/doc-conservation-science-newsletter-12-1995/ |
| June 1996 | Conservation Science Newsletter, issue 20 | 12 | 5625066 | /publications/pdf/doc-conservation-science-newsletter-20-1996/ |
| March 1997 | Conservation Science Newsletter, issue 24 | 12 | 5548115 | /publications/pdf/doc-conservation-science-newsletter-24-1997/ |
| November 1997 | Conservation Science Newsletter, issue 26 | 12 | 5333332 | /publications/pdf/doc-conservation-science-newsletter-26-1997/ |
| August 1999 | Conservation Science Newsletter, issue 33 | 16 | 4176863 | /publications/pdf/doc-conservation-science-newsletter-33-1999/ |
| September 2000 | Conservation Science Newsletter, issue 38 | 16 | 7765381 | /publications/pdf/doc-conservation-science-newsletter-38-2000/ |
| December 2000 | Conservation Science Newsletter, issue 39 | 16 | 6866883 | /publications/pdf/doc-conservation-science-newsletter-39-2000/ |
| June 2000 | Rare Bits, issue 37 | 24 | 181448 | /publications/pdf/doc-rare-bits-37-2000/ |
| December 2000 | Rare Bits, issue 39 | 23 | 365363 | /publications/pdf/doc-rare-bits-39-2000/ |
| April 2004 | Conservation Science Newsletter, issue 49 | 16 | 7079127 | /publications/pdf/doc-conservation-science-newsletter-49-2004/ |

## Archive verification

- Original PDF binary signature, pdfinfo page count and text extraction were verified on a Linux GitHub Actions runner; actual first-page JPEGs were rendered from each same PDF using poppler.
- SHA-256 digests, original publisher URLs and structured publication metadata are retained in `src/lib/magazine-pdf-publications-20261018.mjs` and `docs/verification/magazine-pdf-archive-20261018.json`.
- **15 matched excerpts**, including the publication name, geospatial term, surrounding actual PDF text, SHA-256 and page count, are retained at `docs/verification/doc-science-newsletter-gis-evidence-20261018.json`. First-pass evidence for 1993–2000 was separately retained to prevent concurrent workflow overwrites.
- No new magazine PDF is published merely for being in the publisher index: selected issues had an extractable mention of GIS, ArcView, ARC/INFO, Biosite, GPS, remote sensing or comparable spatial-information practice. A matched term is discovery evidence, not independently verified proof that the whole issue concerns GIS.
- The shared chapter reader lists only hosted originals under the appropriate conservation/early GIS and field mapping chapter related-publications sections. Existing historical prose, entities, relationships and the pre-2026 event cutoff were not changed.

## Key primary evidence

- DOC Conservation Science Newsletter 3 (August 1993): Biosite proposed as an Oracle-based species-information and location database, alongside legacy regional data sources.
- DOC Conservation Science Newsletter 6 (February 1994): amphibian and reptile distributions and the planned transfer of observations into Biosite's Oracle database.
- DOC Rare Bits 37 (June 2000) and 39 (December 2000): DOC field research and threatened species reports with geospatial terminology; specific snippets are retained in the archive evidence.
- DOC Conservation Science Newsletter issues 28–29 (December 1998) were already present in the archive. This release neither recopied nor recounted them.

## Remaining research and acquisition gaps

- MfE official original assets from 2016–2022 still enter redirect loops from the GitHub runner. No unverified original was published. The retrieval script requires explicit recheck opt-in instead of repeatedly requesting known looping URLs.
- NIWA's earlier Water & Atmosphere, New Zealand Surveyor, Surveying + Spatial and GIS articles in Information in Formation remain evidence sources, but no original issue was copied without appropriate source rights and verified original bytes.
- Some DOC indexed issues did not contain extractable spatial information and were rejected; incorrect combined-issue source URLs were rejected, rather than used as grounds for inventing a document.

## Acceptance

Run `npm test`, `npm run build` and the responsive Chromium browser workflow. Confirm that the 15 originals and their first-page thumbnails are present on the merged main branch and that the Cloudflare production commit deploys successfully. Compare the production SHA with the merge commit and confirm all historical reader pages and SEO routes.
