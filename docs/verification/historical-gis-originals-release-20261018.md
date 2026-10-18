# New Zealand GIS history: early DOC originals and periodical evidence

18 October 2026. Internal release verification and source register.

This release adds **15** unmodified original PDFs, **654 original pages**, **34294740 bytes** (34.3 MB) to the locally hosted Publications library. Originals were retrieved from Department of Conservation historical science publications, validated as PDFs, checked against publication dates before 2026, assigned SHA-256 digests and genuine first-page JPEGs, and linked from the relevant historical chapters without changing the existing text.

| Year | Title | Pages | Reader path |
|---|---|---:|---|
| 2000 | Ecology and distribution of the freshwater crayfish Paranephrops zealandicus in Otago: implications for conservation | 42 | /publications/pdf/doc-koura-taieri-gis-2000/ |
| 2003 | Conservation, management and research directions for giant kōkopu in Otago | 26 | /publications/pdf/doc-otago-kokopu-arcview-2003/ |
| 2003 | Post-pastoral succession in intermontane basins and valleys of eastern South Island, New Zealand, Part 1 | 22 | /publications/pdf/doc-otago-postpastoral-arcview-2003/ |
| 2003 | Whangamarino Wetland vegetation map methodology | 14 | /publications/pdf/doc-whangamarino-arcinfo-2003/ |
| 2004 | Feral cats on Stewart Island/Rakiura: population regulation, home range size and habitat use | 35 | /publications/pdf/doc-rakiura-cats-arcview-2004/ |
| 2004 | Habitat for female longfinned eels in the West Coast and Southland, New Zealand | 33 | /publications/pdf/doc-freshwater-eel-arcview-2003/ |
| 2005 | Intertidal and subtidal habitats of Mimiwhangata Marine Park and adjacent shelf | 55 | /publications/pdf/doc-intertidal-arcview-mapping-2005/ |
| 2005 | Mapping Hurunui forest community distribution, using computer models | 42 | /publications/pdf/doc-hurunui-forest-gis-2005/ |
| 2006 | Consequences to threatened plants and insects of fragmentation of Southland floodplain forests, Part 1 | 29 | /publications/pdf/doc-southland-forest-fragmentation-2006/ |
| 2006 | Management and conservation of seagrass in New Zealand: an introduction | 90 | /publications/pdf/doc-seagrass-mapping-2006/ |
| 2007 | Mudfish (Neochanna: Galaxiidae) literature review, Part 3 | 29 | /publications/pdf/doc-sfc279-freshwater-2007/ |
| 2008 | New Zealand's remaining indigenous cover: recent changes and biodiversity protection needs | 84 | /publications/pdf/doc-remaining-indigenous-cover-2008/ |
| 2010 | Aquatic invertebrate communities of lowland wetlands in New Zealand: characterising spatial, temporal and geographic distribution patterns | 68 | /publications/pdf/doc-lowland-wetland-gis-2010/ |
| 2013 | Effects of introduced trout predation on non-diadromous galaxiid fish populations across invaded riverscapes | 27 | /publications/pdf/doc-galaxiid-trout-arcgis-2012/ |
| 2013 | The impact of climate change on the archaeology of New Zealand's coastline: Whangarei District | 58 | /publications/pdf/doc-whangarei-coastal-archaeology-gis-2013/ |

## Verification

- Exact original source URL, page count, file length and sha256 for all originals: `docs/verification/magazine-pdf-archive-20261018.json` and `src/lib/magazine-pdf-publications-20261018.mjs`.
- Historical chapter association data: `src/lib/historical-gis-new-candidates-20261018.mjs`, integrated by `src/lib/regional-gis-chapter-publications.mjs`. The public reader only lists original PDFs actually present in the repository.
- Regression checks: `tests/historical-gis-new-originals.test.mjs` and existing publication/build/browser QA suites.
- The publisher's *Science for Conservation* official series index was checked to correct a 2013 publication date, the 2004 eel report, DOC report 277 Part 3, report 265 Part 1, report 227 Part 1 and other original titles and authors.

## Unresolved source acquisition

The current acquisition report records 18 unsuccessful source candidates. The eight earlier Ministry for the Environment URLs plus six alternate official PDF URLs consistently enter redirect loops in GitHub Actions. Two candidate DOC source URLs return 404, and one older DOC report expressly restricts reproduction. Other unresolved source limitations remain as recorded individually in the acquisition report.

These sources have no public reader page or off-site PDF link in the Publications library. Further original magazine articles are indexed at `docs/research/nz-gis-magazines-original-sources-20261018.md`; specific historical NIWA *Water & Atmosphere* issues contain reproduction limitations, so their article bibliographic evidence is retained without copying the full PDF.

The historic timeline remains restricted to 31 December 2025, and accepted manuscript text, relationships and preservation manifest are unchanged. Archive date is never substituted for publication date.
