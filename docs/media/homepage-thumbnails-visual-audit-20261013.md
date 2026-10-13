# Homepage chapter thumbnail audit — 13 October 2026

## Purpose and boundaries

Editorial/visual QA of all 44 chapter-card assignments on `history.pm4gis.nz` following PR #72. The approved image files, archival originals, licence text, source links, paragraph anchors and chapter narratives are preserved unchanged. This pass modifies **homepage presentation only**. It does not republish contextual homepage images as verified in-story evidence.

## Visual evidence and presentation

Cloudflare browser rendering retrieved the current live chapter image, alt text and heading for **44 of 44 cards**, with no blanks. Screenshots of the original layout were inspected for desktop cards 1–4, 9–20 and for chapter cards 3 and 9 at a 390-pixel mobile width. They showed square/portrait paper maps and multi-panel geological figures becoming pale, small images in 16:9 frames. The Chromium suite now independently loads and checks the 44 documentary images and 16:9 cards at desktop, tablet and mobile widths, including 1440 and 390 pixels.

The change introduces explicit, **homepage-only source-image viewport crops**, focussed around actual cartographic content for chapters 3, 9, 13, 16, 17, 18 and 25, and ordinary cover framing for identified photographic/aerial/terrain scenes. The files, colours, coastlines, contours, data values, legends and scanned originals remain unchanged; visual crops are only CSS `object-fit`/`object-position` on very small cards. Image-detail and chapter-reader pages continue to show their previously accepted source images and complete map pages.

## Chapter-by-chapter appraisal

| Ch | Title | Source currently assigned | Appraisal and outcome |
| --- | --- | --- | --- |
| 1 | Maps before computers | Warkworth aerial, 1937 | Retain; original survey-era aerial, now fills photographic frame |
| 2 | Survey calculations | Tripp Station surveyors | Retain; historical field measurement precursor, photo fills frame |
| 3 | Computer cartography | Petone/Lower Hutt survey sheet, 1909 | Retain with map-detail framing as a documented *precomputer* sheet; direct 1979 MAPPAK thesis digitiser/output figures remain a better acquisition priority |
| 4 | Early remote sensing | Christchurch Landsat 7, 2001 | Retain as explicitly *later* sensor context; original 1975 Landsat II New Zealand data illustration needed |
| 5 | Digital land inventories | Levin topographic sheet, 1973 | Retain verified placement; paper source, not an NZLRI theme |
| 6 | Early GIS systems | Intergraph CLIX workstation | Retain verified hardware evidence |
| 7 | Land assessment | Gisborne–East Coast LUC classes, 1967 | Retain original LUC map, fully contained |
| 8 | Forestry GIS | Taranaki Landsat forest boundary | Retain documented remote-sensing context; plantation inventory original still preferred |
| 9 | Scientific mapping | GNS QMAP Christchurch, 2008 | Retain documentary scientific GIS map with detailed thumbnail crop; full sheet available in image record |
| 10 | Government GIS | Te Kūiti Land Development Office | Retain dated institutional context (building photo is not a GIS screen) |
| 11 | University teaching and research | University of Auckland Clock Tower | Retain institutional context, photographic framing |
| 12 | Companies and user groups | Intergraph CLIX workstation | Retain hardware context, although repeated from chapter 6; a sourced period NZ user-group photo is preferable |
| 13 | The digital cadastre | Silverpeak cadastral survey sheet, 1956 | Retain historical survey source, thumbnail detail framing only |
| 14 | Landonline | Official LINZ Web Search interface, 2025 | Retain real later system screen |
| 15 | Digital topography | LINZ Topo50 Ongaonga, 2020 | Retain genuine topographic map, full map view |
| 16 | Census geography | 2023 Census population-density map | Retain authentic choropleth, detail framing |
| 17 | Roads, addresses and property | Auckland roads map, 2014 | Retain genuine road-network map, detail framing |
| 18 | GPS in practice | LINZ PositioNZ network, 2018 | Retain real GNSS context, detail framing |
| 19 | The national coordinate system | Riverhead geodetic mark photograph | Retain photographed physical survey control, without asserting its datum |
| 20 | Aerial imagery | Glentunnel/Coalgate aerial, 1943 | Retain verified Retrolens source, photographic framing |
| 21 | Spatial data infrastructure | Official LINZ WMTS in QGIS | Retain real interoperability interface |
| 22 | Desktop GIS | Official LINZ ArcMap Identify, 2016 | Retain genuine New Zealand desktop GIS workflow |
| 23 | Council GIS | North Island local-authority map, 1981 | Retain predecessor administrative geography context |
| 24 | GIS across government | LINZ territorial-authority map, 2025 | Retain authentic shared geography as later context |
| 25 | Utility networks | KiwiRail passenger route map | Retain temporarily as **network topology only** and frame readable excerpt; **weak subject match**, replacement should be a verified *electricity/water/telecom* network asset image |
| 26 | Conservation and environment | New Zealand QGIS ecoregions, 2025 | Retain later real environmental mapping |
| 27 | Health population and place | DHB geography, 2001–2010 | Retain authentic period health boundaries, not a map of original 1990s analytical units |
| 28 | Policing and public safety | NEMA tsunami map, 2021 | Retain actual emergency planning map, not an NZ Police GIS screenshot |
| 29 | The GIS profession | Ministry of Works field-trip photograph, 1971 | Retain historical professional predecessor context; repeated in chapter 34 |
| 30 | Early web mapping | NZ Wikidata/OpenStreetMap libraries web map, 2019 | Retain real later application; **weak period match**; seek a dated NZ 1996–2003 web GIS screenshot |
| 31 | Google Maps and Earth | NASA World Wind Napier scene, 2006 | Retain *contemporary alternative digital globe*, explicitly **not** Google Earth; seek an authentic Google Earth/Street View NZ-era image |
| 32 | Open source GIS | Auckland OpenStreetMap map, 2018 | Retain genuine open mapping data product |
| 33 | Open spatial data | LINZ WMTS QGIS map view | Retain official public data service |
| 34 | GIS in the field | Ministry of Works field trip, 1971 | Retain relevant historical field activity predecessor context |
| 35 | Mapping applications | NZ libraries Wikidata/OSM web map, 2019 | Retain real map application, also shown in chapter 30 |
| 36 | Satellite observations | **1990 NASA Landsat 4 Tasman Glacier** | **Homepage-only replacement** of the 2001 Christchurch scene; direct chapter evidence and independent historical period; original 2001 in-story placement remains intact |
| 37 | LiDAR mapping | Kāpiti Island LiDAR relief, 2024 | Retain actual LiDAR-derived terrain product |
| 38 | Drone mapping | Christchurch Victoria Square aerial, 1975 | Retain *earlier aircraft photograph as precursor only* pending actual UAV evidence from 2012 Te Maari or another verified NZ survey |
| 39 | Mapping in 3D | **2002 NASA Ruapehu oblique terrain model** | **Homepage-only replacement** of a flat aerial; the NASA Landsat/SRTM perspective visualisation directly matches computer 3D terrain use and is credited to the original; previous chapter media unchanged |
| 40 | Enterprise GIS | LINZ ArcMap Identify/relationships, 2016 | Retain real data workflow, repeated from chapter 22; stronger deployment-specific source desirable |
| 41 | Spatial services and cloud | LINZ WFS API response, 2023 | Retain real spatial service response |
| 42 | Disaster response and live mapping | Christchurch 2011 response orthophoto | Retain verified event-time imagery, now photographic frame |
| 43 | GIS automation | NZ coastal satellite-processing workflow, 2022 | Retain real processing workflow diagram, full view |
| 44 | GIS and AI in 2025 | Actual 2025 NZ wetland ML comparison | Retain relevant modelled output, full view |

## Verified documentary sources supporting the two replacements

- NASA Earth Observatory / USGS/University of Maryland, *Tasman Glacier*, Landsat 4 acquisition, 30 December 1990: https://science.nasa.gov/earth/earth-observatory/retreat-of-the-tasman-glacier-8434/
- NASA Earth Observatory / Landsat/SRTM, *Mt Ruapehu 23 October 2002*: https://commons.wikimedia.org/wiki/File:MtRuapehu_23oct2002.jpg
- Existing complete image metadata and checksum records: `src/content/images/nasa-landsat4-tasman-1990.json` and `src/content/images/ruapehu-3d-2002.json`.

## Evidence for future targeted acquisitions (excluded from this release)

- **Chapter 3**: M. S. Colley, *A computer system for a cadastral mapping application*, 1979, University of Canterbury. Verified computer-controlled cadastral digitising and output figures would be a stronger historic thumbnail than the 1909 source map. https://ir.canterbury.ac.nz/items/f2abb49d-e38f-4019-b8ba-38667aaba5bb
- **Chapter 25**: 2022 New Zealand high-voltage transmission grid map made from OpenStreetMap power-network line data, CC0; real electrical network rather than passenger railway. https://commons.wikimedia.org/wiki/File:Electrical_Power_Grid_-_New_Zealand.png . It needs a preserved local master asset, metadata, contextual caption and appropriate image placement before selection. Christchurch City Council also publishes an actual electricity network feature service at https://gis.ccc.govt.nz/server/rest/services/OpenData/Electricity/MapServer .
- **Chapter 38**: University of Canterbury research into UAV photogrammetry and structure-from-motion over the 2012 Te Maari crater field supplies direct subject evidence; acquire a verifiable original 3D reconstruction or UAV survey still from that research. https://ir.canterbury.ac.nz/items/0405855b-6bd6-4729-9c76-cbcc58fa0d22 .

Do not treat a passenger-rail route diagram as a utility asset map, a 1975 aircraft aerial as a drone capture, or a 2019 libraries app as 1990s web mapping. These contextual limits are recorded deliberately instead of silently relabelling assets. No imagery after the project's publication cutoff is introduced.

## Verification requirements

- Check 44/44 source-backed images on generated homepage, with provenance and alt text.
- Preserve the original 19 in-story placements, including the previous pictures in chapters 36 and 39.
- Unit-test the two *explicit* homepage-only overrides, thumbnail framing approvals and unchanged chapter/reader content.
- Test desktop/tablet/mobile widths in Chromium and confirm every image loads with correct aspect ratio, without horizontal overflow.
- Confirm Cloudflare Pages preview and production, publish only after all tests pass, and verify the rendered public page.
