# DOC periodicals: original-page relevance review (22 October 2026)

Review basis: `main` at `0febde4eec18a53ea02d34632ab1babd3ee52689`; prospective PR #125 at `124cc97121b88fd018c1c29901d85b894801b92d`. This is a historical-content review, not a release approval. Publication dates below are original issue dates, not 2026 acquisition dates. Public history remains capped at 31 December 2025.

## Editorial acceptance standard

Archive a complete DOC issue in the NZ GIS collection only where **its original pages document an identifiable NZ geospatial method, dataset, technology, spatial analysis, map or spatially recorded field measurement used for a specific purpose**. A GIS substring, place name, table of contents, bibliography, generic species distribution, or vague GPS mention cannot by itself demonstrate relevance. A short but concrete operational example can qualify, but the public summary must identify that example rather than imply the whole issue is a GIS journal. Record the original issue and printed/PDF page; retain original URL, issue date, hash, full original and first-page thumbnail. New candidates must not be promoted by machine keyword matching alone.

## Seven page-checked cases

| Original | Original-page evidence | Decision | Follow-up |
| --- | --- | --- | --- |
| Conservation Science Newsletter 2 (June 1993), PDF page 2, printed p. 2 | Craig Trotter's remote-sensing seminar describes Rangitoto forest-health imagery and explains its use in a geographic information system. This is substantive geospatial practice, despite the archived evidence snippet starting in the contents. | **Retain** | Replace the current contents-only evidence with a properly cited page-2 snippet. |
| Conservation Science Newsletter 26 (November 1997), PDF page 10, printed p. 10 | The archived “Gis” keyword is OCR text for **Gisborne Region** in a list of separately published DOC reports. No GIS method is supported by that hit. | **Remove subject to full-issue manual confirmation** | Check remainder for distinct methods. If absent, remove original/thumbnail/catalogue/reader links in a reconciled change. |
| Conservation Science Newsletter 33 (August 1999), PDF page 15, printed p. 15 | “Monitoring forest canopy condition by remote sensing” occurs as a bibliographic entry for another report. The report itself may be relevant, but this newsletter's current citation is not evidence of an original geospatial article. | **Remove subject to full-issue manual confirmation** | Seek the original Trotter and Brown report separately. |
| Conservation Science Newsletter 38 (September 2000), PDF page 13, printed p. 13 | Lower-case “gis” is an OCR artefact inside prose about wetland restoration, not a reference to geographic information systems. | **Remove subject to full-issue manual confirmation** | Review any alternative hit before removing from the public collection. |
| Rare Bits 41 (June 2001), PDF page 11, printed p. 11 | Taiaroa Head trapping effort analysis explicitly uses GIS printouts to identify where traps are succeeding. | **Retain**, narrowly scoped | Attribute to the Taiaroa Head trapping effort rather than describing the entire issue as GIS-focused. |
| Rare Bits 44 (April 2002), PDF page 14, printed p. 14 | Hutton's shearwater colony boundaries in Kowhai Valley were recorded using GPS for subsequent extent comparison. | **Retain as a concise geospatial-fieldwork example** | Present as GPS boundary capture, not completed GIS modelling or an established longitudinal trend. |
| Rare Bits 47 (December 2002), PDF page 16, printed p. 16 | The source briefly mentions GPS logging of survey sites; the rest of the examined passage is a species monitoring report. It is a weak fit for a selective GIS-publication archive. | **Remove from proposed acquisition** | Do not add local PDF, thumbnail, public catalogue or chapter links solely on this evidence. |

Primary original PDFs:

- https://www.doc.govt.nz/globalassets/documents/science-and-technical/conservation-science-newsletter/conservation-science-newsletter-2-june-1993.pdf
- https://www.doc.govt.nz/globalassets/documents/science-and-technical/conservation-science-newsletter/conservation-science-newsletter-26-november-1997.pdf
- https://www.doc.govt.nz/globalassets/documents/science-and-technical/conservation-science-newsletter/conservation-science-newsletter-33-august-1999.pdf
- https://www.doc.govt.nz/globalassets/documents/science-and-technical/conservation-science-newsletter/conservation-science-newsletter-38-september-2000.pdf
- https://www.doc.govt.nz/documents/science-and-technical/RareBits41.pdf
- https://www.doc.govt.nz/documents/science-and-technical/RareBits44.pdf
- https://www.doc.govt.nz/documents/science-and-technical/RareBits47.pdf

All seven checked passages were inspected against the original PDF page images on 22 October 2026. No SHA-256 or local-file verification is claimed from this page review; the PR's existing automated tests cover binary checks.

## Remaining first- and second-tranche evidence rows

The table below is **triage based on the existing GitHub evidence register**, not a claim of page-level independent verification. See `docs/verification/doc-science-newsletter-gis-evidence-20261018.json` on PR #125. Every row still requires an original-page check before editorial sign-off.

| Issue | Existing registered match | Research priority |
| --- | --- | --- |
| Conservation Science Newsletter 3 (Aug 1993) | Biosite location database article | Likely relevant; verify article and technical detail. |
| Conservation Science Newsletter 4 (Oct 1993) | GPS and Argos albatross tracking | Likely relevant; verify context and page. |
| Conservation Science Newsletter 6 (Feb 1994) | Reptile sightings data transferred into Biosite/Oracle | Likely relevant; verify geographic component. |
| Conservation Science Newsletter 9 (Aug 1994) | Wetlands/fish records with catchment numbers and Biosite | Likely relevant; check context and precise page. |
| Conservation Science Newsletter 12 (Mar 1995) | Geo-Surveyor GPS used for coastal/dune fieldwork | Likely relevant; verify actual mapping use. |
| Conservation Science Newsletter 20 (Jun 1996) | Remote sensing mentioned in passing at a meeting | **Potentially incidental**; seek a substantive article or exclude. |
| Conservation Science Newsletter 24 (Mar 1997) | “GPS for DoC users” | Likely relevant; verify equipment/workflow article. |
| Conservation Science Newsletter 39 (Dec 2000) | GPS coordinates and flight lines in monitoring | Likely relevant; verify page. |
| Conservation Science Newsletter 49 (Apr 2004) | Passing phrase about helicopters and GPS | **Potentially incidental**; seek more evidence or exclude. |
| Rare Bits 37 (Jun 2000) | Differential GPS in aerial bait coverage | Likely relevant operational application; verify page. |
| Rare Bits 39 (Dec 2000) | Differential GPS monitors aerial bait spread | Likely relevant operational application; verify page. |

The separate combined Conservation Science Newsletter 28–29 (1998) requires its own page-level audit; it is not one of the 18 tranche evidence rows. The prior DOC bibliography audit in PR #125 asserts 50 of 51 remaining items qualify; that claim requires independently checked row-level evidence for **all** retained standalone works before it can be treated as editorial acceptance.

## Research to development handoff

On PR #125 first (1) reject Rare Bits 47 absent stronger original-page evidence; (2) repair the evidence record for issue 2; (3) investigate and conditionally remove issues 26, 33 and 38, preserving the accepted original-file baseline and recording any user-authorised deletion; (4) review 20 and 49; (5) ensure public chapter links, PDF listings, original bytes and first-page covers are reconciled; (6) update tests to require a curated page-specific research verdict **in addition** to machine matching. Keep the developer and QA branches separate; update PR #125 rather than silently merging a duplicate historical collection.
