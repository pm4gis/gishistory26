# NZ GIS History documentary image source decisions — wave 6

Prepared 10 October 2026 for the production event timeline. Each proposed image was checked for its subject, date, creator or issuing body, source record, relationship to the timeline event and image-specific reuse terms. National Library records expose image-specific reuse terms in their IIIF manifests. The acquisition checks each manifest's attribution and free-redistribution wording, selects the correct edition canvas, and downloads the full-resolution image response published for that canvas. The exact full-resolution image response returned by IIIF is preserved unchanged; WebP files are display derivatives. This is the published IIIF rendition, not a claim that the underlying TIFF/JP2 master was acquired. Commons licences and GIS service terms are checked live. The workflow preserves source binaries unchanged under `docs/media/originals/wave6/`, creates uncropped WebP derivatives, and records SHA-256 checksums, dimensions and byte size.

## First priority: N134 and T12 edition/access decisions

| Sheet | Record and identification | Digital access and decision |
| --- | --- | --- |
| NZMS 1 N134, first edition | National Library holding `MapColl 830cba/1939-/15175`; A.J. Reid, Lands and Survey, 1939. The NLB topographic-mapping exhibit identifies the 1939 first sheet. | The authorised digital scan located through the NLB IIIF manifest is the 1943 revised edition, record 23363272 / item IE11970572. It is a separate canvas from the 1939 physical holding and is displayed only as the 1943 revision. The manifest's image-specific statement permits copying and redistribution with “Sourced from LINZ. Crown Copyright reserved.” The exact 1939 digital original and its reuse permission remain unresolved. NLB exhibit: https://natlib.govt.nz/visiting/wellington/exhibitions/unfolding-the-map/topographical-mapping |
| NZMS 260 T12, Thames, first edition | NLB record 35866010; 1:50,000 NZMG sheet, first edition, 1977; IIIF item IE25165522. | The IIIF manifest contains separate 1977 and 1978 canvases. The 1977 canvas, labeled `NZMS260_T12_1977_600ppi` and listed as 22,424 × 15,561 pixels, is the acquired first edition; the 1978 reprint is not substituted. The manifest permits redistribution with “Sourced from LINZ. Crown Copyright reserved.” Record: https://natlib.govt.nz/records/35866010 |

## Acquired source objects and licence decisions

| Image | Source, date and creator | Event relationship and reuse condition |
| --- | --- | --- |
| `nzms1-n134-1943-revision` | NLB 23363272; Lands and Survey; 1943 revised N134, scanned by LINZ. | Separate edition context for the 1939 event; not the first issue. NLB reuse credit: “Sourced from LINZ. Crown Copyright reserved.” |
| `nzms260-t12-thames-1977` | NLB 35866010; Lands and Survey; T12 first edition, 1977; IIIF item IE25165522. | Direct 1977 sheet. Separate from 1978 reprint and later Topo50. Same LINZ attribution condition. |
| `nzlri-tiniroto-wairoa-1978-79` | NLB 22986786; NZLRI/Tiniroto–Wairoa paper sheets, 1978–79; Department of Lands and Survey. | Actual map product in the inventory digitised 1977–80; predecessor context for LRIS/S-map, not their interface. Same LINZ attribution condition. Mapping-editions history: https://lrp.landcareresearch.co.nz/topics/luc-surveys/mapping-editions |
| `nzms290-north-island-index-1982` | NLB 31826814; NZMS 290 North Island index, 1982. | Supplementary map-series index, not a digitising screen. Same LINZ attribution condition. |
| `nzms261-thames-cadastre-1980` | NLB 31821113; Thames cadastral sheet, 1980. | Paper parcel-map context for the DCDB and Māori land-resource mapping; not a DCDB interface or conference map. Same LINZ attribution condition. |
| `taranaki-topographic-map-1990` | NLB 38312675; Taranaki topographic map, 1990. | Later geographic context for North Taranaki, not the 1986 Intergraph thematic map. Same LINZ attribution condition. |
| `terralink-ongaonga-map-1996` | NLB 35865355; Ongaonga map, 1996; catalogue credits LINZ and Terralink. | Event-year map product, not a commercial-system screenshot. Same LINZ attribution condition. |
| `auckland-nzms260-r11-2004` | NLB 35865916; Auckland R11, 2004; digitised by University of Auckland. | Later geographic context for the Auckland Lifelines project. Credit: “Sourced from University of Auckland. Crown Copyright reserved.” |
| `christchurch-nzms260-m35-2004` | NLB 35865913; Christchurch M35, 2004; digitised by University of Auckland. | Later city context, not 1993 Lifelines project output. Same University of Auckland attribution condition. |
| `ibm-650-computer-context` | Alkivar's photograph, uploaded 14 April 2005, of the IBM 650 at the Smithsonian National Museum of American History. | Same machine model as the government-computing event, not the New Zealand Treasury installation. Creator released the image to the public domain: https://commons.wikimedia.org/wiki/File:IBM650.jpg |
| `calcomp-565-plotter-context` | Ryan Somma; Calcomp 565 model circa 1966, at Nemo Science Museum; photo date unknown. | Computer-plotting context for 1966, not a New Zealand system. CC BY-SA 2.0: https://commons.wikimedia.org/wiki/File:Calcomp_565_drum_plotter.jpg |
| `pdp11-70-mappak-context` | Judson McCranie; DEC PDP-11/70 museum photo, 11 August 2019. | PDP-11 model context for MAPPAK, not the Lands and Survey unit or interface. CC BY-SA 3.0: https://commons.wikimedia.org/wiki/File:DEC_PDP-11_at_Computer_Museum_of_America_(23)_(cropped).jpg |
| `intergraph-clix-workstation-context` | Gigs; decommissioned late-1980s Intergraph CLIX; photo from late 1990s. | Shared context for Auckland, DSIR and Canterbury; not an institution's actual workstation. Creator released it to the public domain: https://commons.wikimedia.org/wiki/File:Intergraph_CLIX_workstation.jpg |
| `arcinfo-coverage-model-diagram` | Bplewe; Arc/INFO coverage-model diagram created 4 November 2021. | Modern redraw, not a 1982 screen or New Zealand installation evidence. CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:ArcINFO_Coverage.svg |
| `doc-wetlands-map-export-2026` | Current ECan public service export, layer “Wetland Areas (DOC)” only; map acquired 10 October 2026. Service metadata names DOC and ECan. | Current conservation GIS context for both DOCgis events; not their Java client. No basemap. DOC data CC BY 3.0 NZ; exact credit “Crown Copyright: Department of Conservation Te Papa Atawhai 2026.” Terms: https://www.doc.govt.nz/our-work/maps-and-data/terms-and-conditions/ |
| `upper-hutt-property-map-export-2026` | Upper Hutt City Council Property Information service export; “Land Parcels” layer; current as acquired 10 October 2026. | Current council context for council GIS and Xplorer, not an original historical interface. Feature-service item declares CC BY 4.0; credit identifies LINZ and UHCC: https://maps.upperhutt.govt.nz/portal/home/item.html?id=4976327967204e71939e4349a016c472 |

## Event links and contextual notes

The 16 acquired image records create 19 event associations: 18 previously unillustrated timeline events and a stronger contemporary product image for the already illustrated 1996 DOSLI separation event. The event relationship text and complete register are maintained in `src/lib/timeline-media.mjs` and the wave 6 CSV.

- 1960 government computing: same IBM 650 model; not the local machine.
- 1966 computer mapping: period Calcomp model; not a New Zealand installation.
- MAPPAK: later photograph of a PDP-11/70; not the MAPPAK workstation.
- NZLRI: actual 1978–79 paper map and 1982 NZMS 290 index; not digitising equipment.
- ARC/INFO: modern model diagram.
- Auckland GIS course, DSIR and Canterbury teaching: later Intergraph workstation image, not local machines.
- North Taranaki: licensed 1990 regional map; not the 1986 thematic output.
- Christchurch and Auckland Lifelines: 2004 city sheets, not project GIS outputs.
- Māori land conference: 1980 Thames cadastral map showing Māori land blocks; not the conference or its location.
- DOSLI/LINZ/Terralink: a contemporary 1996 Ongaonga map product, not a depiction of the administrative split or a software screen. The 2020 Topo50 remains supplementary.
- Terralink: 1996 LINZ/Terralink map product, not a software screen.
- DOCgis: 2026 DOC wetland service export, not the historical client.
- Council GIS and Upper Hutt Xplorer: current council property layer, not historical interface evidence.
- LRIS and S-map: NZLRI predecessor paper mapping, not portal/application screens.

Existing event IDs, dates, chapters and relationships are retained. More precise primary associations are added while prior accepted images remain accessible as supplementary images.

## Sources investigated but not reused as unlicensed originals

- The exact 1939 N134 digital file remains unresolved; the authorised 1943 revision is separately labelled. The Te Ara image's reuse terms were not established.
- DOC's 1986 North Taranaki report contains the relevant Intergraph map, but DOC science-publication guidance requires permission to republish report figures. A licensed later topographic map is used only for region context.
- Early ARC/INFO, MAPPAK, DSIR and university screenshots were not reused where image-specific permissions or local subject identification were missing.
- The existing Landonline image remains the accurately labelled 2025 LINZ Web Search capture. A 2002 FIG paper includes a historical screenshot, but figure-level reproduction rights were not verified.
- NIWA's general conditions exclude photographs, charts and maps unless their individual terms permit reuse; prior written permission is required for those images. No NIWA PostGIS image is copied without permission.
- The DOCgis client image's specific reuse rights were not verified. The S-map Online site uses CC BY-NC-ND 3.0 NZ; the historical screenshot was not transformed into a WebP without permission.
- The current council export is only used because the Upper Hutt service item specifies CC BY 4.0. No modern view is described as an earlier council interface.

## File integrity and presentation

The workflow checks the item-specific IIIF reuse statement, exact canvas label and dimensions, Commons licence evidence, and GIS service layer metadata again at acquisition time. It preserves the exact source image bytes returned by the publisher in the research archive; records source URL, canvas/file title, creator/date, credit, licence wording and evidence, SHA-256, byte size and dimensions; and makes uncropped local WebP display/card assets. It stops if rights markers change, expected layers disappear, the source is not a readable image, or any original exceeds the repository's 94 MiB blob limit. The complete event register is generated after source integrity, image-page metadata, internal links, tests and production build pass.
