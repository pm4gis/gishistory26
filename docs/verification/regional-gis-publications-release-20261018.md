# Regional GIS PDF release, 18 October 2026

This release adds **20 original PDFs**, **1353 pages**, **134263816 bytes** (134.3 MB) to the existing onsite reading collection. Original binary PDF files are in `public/assets/publications/pdfs/` with genuine first-page thumbnails and SHA-256 records in `src/lib/magazine-pdf-publications-20261018.mjs`.

| Year | Publication | Pages | Original bytes | Reader |
|---|---|---:|---:|---|
| 2004 | Predicting archaeological sites in New Zealand | 24 | 384439 | /publications/pdf/doc-archaeological-prediction-2004/ |
| 2008 | Environmental predictors of stoat and ship rat capture success | 28 | 498855 | /publications/pdf/doc-stoat-rat-modelling-2008/ |
| 2008 | Geographic Information Systems in wildlife management: yellow-eyed penguin nest sites | 35 | 862601 | /publications/pdf/doc-gis-wildlife-penguins-2008/ |
| 2009 | Identifying and managing landscape values in the Wellington region | 93 | 6011507 | /publications/pdf/gw-wellington-landscape-atlas-2009/ |
| 2010 | Distribution of Maui's dolphin: 2000–2009 | 27 | 2630507 | /publications/pdf/doc-maui-dolphin-distribution-2010/ |
| 2011 | A bibliography of research on visitors to public conservation areas in New Zealand 1995–2010 | 89 | 648304 | /publications/pdf/doc-visitor-conservation-bibliography-2011/ |
| 2012 | Estimation of current and potential carbon stocks and Kyoto-compliant carbon gain on conservation land | 44 | 1573044 | /publications/pdf/doc-conservation-carbon-spatial-models-2012/ |
| 2012 | Hutt landscape study | 89 | 23714684 | /publications/pdf/gw-hutt-landscape-study-2012/ |
| 2013 | How well does LCDB2 map wetlands in the Wellington region? | 25 | 2522132 | /publications/pdf/doc-wellington-wetlands-lcdb2-2013/ |
| 2014 | Ecosystem goods and services in marine protected areas | 100 | 2139293 | /publications/pdf/doc-marine-ecosystem-gis-2014/ |
| 2016 | Department of Conservation guidelines for assessing significant ecological values | 77 | 1368720 | /publications/pdf/doc-ecological-significance-gis-2016/ |
| 2016 | Mapping services and benefits of indigenous biodiversity and historic heritage | 139 | 4543639 | /publications/pdf/doc-mapping-biodiversity-heritage-2016/ |
| 2018 | South-East Marine Protection Forum: Recommendations to Ministers | 314 | 18307083 | /publications/pdf/doc-southeast-marine-spatial-2018/ |
| 2019 | Risk-exposure assessment of DOC coastal locations to flooding from the sea | 40 | 5967690 | /publications/pdf/doc-coastal-flood-risk-gis-2019/ |
| 2019 | UAV data for characterising sand-dune vegetation at Kaitorete Spit | 29 | 14036013 | /publications/pdf/doc-sand-dune-drone-2019/ |
| 2020 | Aerial remote sensing of pre-coning wilding conifers | 33 | 21852997 | /publications/pdf/doc-wilding-conifer-remote-sensing-2020/ |
| 2021 | Marine protected areas: Tier 1 statistic, 2021 | 8 | 978965 | /publications/pdf/doc-marine-areas-gis-statistic-2021/ |
| 2022 | Using Benthic Terrain Modeller to characterise New Zealand seafloor geomorphology | 25 | 9369728 | /publications/pdf/doc-benthic-terrain-modeller-2022/ |
| 2022 | Vehicles on New Zealand beaches: annotated ecological research bibliography | 21 | 1143075 | /publications/pdf/doc-coastal-vehicle-spatial-survey-2022/ |
| 2024 | Kāpiti Whaitua Implementation Programme | 113 | 15710540 | /publications/pdf/gw-kapiti-whaitua-gis-2024/ |

## Acquisition exclusions

10 candidates were rejected or could not be fetched. They are not present as reader pages on the public site.

- mfe-plan-mapping-standards-2017: Error: PDF source unreachable via fetch and curl: curl: (47) Maximum (50) redirects followed
- mfe-electronic-planning-maps-2018: Error: PDF source unreachable via fetch and curl: curl: (47) Maximum (50) redirects followed
- mfe-maori-catchment-geospatial-2019: Error: PDF source unreachable via fetch and curl: curl: (47) Maximum (50) redirects followed
- mfe-landuse-high-risk-gis-2019: Error: PDF source unreachable via fetch and curl: curl: (47) Maximum (50) redirects followed
- mfe-mahinga-kai-spatial-2022: Error: PDF source unreachable via fetch and curl: curl: (47) Maximum (50) redirects followed
- mfe-sheep-beef-emissions-gis-2021: Error: PDF source unreachable via fetch and curl: curl: (47) Maximum (50) redirects followed
- mfe-national-productive-land-2022: Error: PDF source unreachable via fetch and curl: curl: (47) Maximum (50) redirects followed
- mfe-national-gis-landuse-2016: Error: PDF source unreachable via fetch and curl: curl: (47) Maximum (50) redirects followed
- boprc-gis-annual-report-2015: Error: No document-level council republication licence identified
- doc-whanganui-fish-barriers-2021: Error: Source-specific reproduction restriction

## Chapter integration

The accepted chapter prose is unchanged. The shared chapter reader now lists verified, locally hosted, historically relevant publications from `src/lib/regional-gis-chapter-publications.mjs` in a compact expandable source list, linking to the on-site publication reader. All candidates and article associations are checked for pre-2026 publication dates, missing original PDFs and duplicate identifiers. Original-file checksums, PDF signature, cover and generated static routes were validated during GitHub Actions.

Research register: `docs/research/nz-gis-regional-and-periodicals-20261018.md`; original acquisition report: `docs/verification/magazine-pdf-archive-20261018.json`. No event occurring after 31 December 2025 is added to the historical chronology.
