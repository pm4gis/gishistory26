# Geographx terrain and basemap research
Date: 15 October 2026. Historical coverage ends on 31 December 2025. No later event has been added to the public timeline.

## Findings

### Geographx: two distinct national datasets

Roger Smith's primary account, *Designing Raster Base Maps with Photoshop*, presented to the 2012 Mountain Cartography Workshop in Taurewa, documents a completed **national 4 m raster land-cover basemap**. It comprised 116 raster tiles, each 16,384 pixels square (approximately 65.5 km a side), and approximately 420 GB of layered Photoshop working files. Topo50 vector data and Landcare Research LCDB3 supplied the map features. The separately produced Geographx **8 m terrain model**, derived from Topo50 contours and height points, supplied the hillshading. This 8 m figure describes raster cell spacing, not survey accuracy.

Smith described Manifold GIS preparation, Global Mapper terrain/mask processing and scripted Photoshop compositing of as many as 100 layers. Features included controlled natural-colour land-cover textures, water transitions, hillshade and a configurable snowline. He illustrated Auckland-area textures and 3D Skyline TerraExplorer views of the Waitaki and Clarence rivers.

Source: Roger Smith, *Designing Raster Base Maps with Photoshop* (2012), pp 101–106:
https://mountaincartography.icaci.org/publications/papers/papers_taurewa_12/papers/mcw2012_sec4_ch13_p101-106_smith.pdf

The New Zealand Cartographic Society's 2015 ICA report distinguishes the **open-licensed 8 m elevation model** made available with LINZ's assistance from the **commercially offered 4 m basemap**. It confirms Smith was chief cartographer on the 2013 EARTH Platinum World Atlas, Craig MacAlpine was production manager, Geographx became a Skyline software distributor in 2012, and the company issued Great Walks fieldmaps in 2014. Smith's Tongariro oblique paper map received third place at the 2013 international cartographic exhibition.

Source: *Cartographic Activities in New Zealand 2011–2015*, NZ Cartographic Society, especially pp 3, 14:
https://icaci.org/files/documents/national_reports/2011-2015/new_zealand.pdf

The subsequent ICA report describes the firm's continuing relief-map design for public facilities, tourist destinations and other clients before 2019:
https://icaci.org/files/documents/national_reports/2015-2019/newzealand-2019_lq.pdf

### LINZ 2013 open-source terrain basemap

LINZ's `linz/linz_basemaps` repository supplies a separately released **TileMill/PostGIS natural-colour basemap-reconstruction project**, not the Geographx 4 m commercial imagery. Its 2013 documentation records use of Topo50, LCDB3.3, the 2012 8 m DEM and related hillshades, with QGIS/GDAL and TileMill. The historic process involved 115 DEM and hillshade tiles and a then-current 3.5 GB web download limitation.

The repository explicitly releases its project under **Creative Commons Attribution 3.0 New Zealand**, with 2013 Crown copyright. Two original source images have been archived byte-for-byte in this site's repository:

- `NZ_Terrain_Natural_Colour/.thumb.png` → `public/assets/historical/original/linz-2013-terrain-natural-colour-preview.png` (Git blob SHA-1 `41aa94ac467595e657233eec07ae1dec517b9f0a`).
- `img/Colour_GenTwo_Working_Windows_250Bathy.jpeg` → `public/assets/historical/original/linz-2013-north-island-natural-colour-bathymetry.jpeg` (Git blob SHA-1 `725bf1b3c7e69a83e22eaecb98c902d8eeae1cf3`).

Each transferred blob hash was checked against its source. The date assigned to the images describes the **2013 archive**, not a separately verified render date. These are LINZ images contextualising the same period and elevation workflows, not screenshots of Geographx's commercial 4 m tiles.

Source and applicable licence: https://github.com/linz/linz_basemaps

### DOC and other downstream services

DOC's `Terrain/Geographx10m` ArcGIS MapServer says the cache is 10 m resolution, credits © Geographx and uses EPSG:2193. Its production date, source data lineage and republication rights remain uncertain. No DOC-hosted map tiles were copied. The open 8 m DEM licence must not be assumed to cover other copyrighted graphics.

DOC: https://mapserver.doc.govt.nz/arcgis/rest/services/Terrain/Geographx10m/MapServer

LINZ 8 m DEM: https://data.linz.govt.nz/layer/51768-nz-8m-digital-elevation-model-2012/

### TV3 broadcast weather hypothesis

I searched Geographx, Roger Smith, TV3, 3 News, Newshub, weather graphics, terrain animation, Skyline and archives. No contemporary source establishes a Geographx supply agreement or identifiable Geographx artwork in a TV3 weather sequence.

**Positive evidence identifies MetService's Weatherscape system:** MetService's 2019 annual report (p 19) names TVNZ, TV3 and Prime News as New Zealand users. Its 2022 annual report names TVNZ and Newshub and describes the system's development with TVNZ. A 2010 WeatherWatch report says TVNZ and TV3 obtained forecasts from MetService. These sources concern the graphics platform and forecast data. They do not establish the provenance of every terrain background, so they cannot conclusively exclude third-party Geographx content.

Sources:
https://about.metservice.com/assets/downloads/annualreport/MetService-Annual-Report-2019-web.pdf
https://about.metservice.com/assets/Annual-Reports/MetService-Annual-Report-2022.pdf
https://www.weatherwatch.co.nz/content/blog-the-state-of-our-tv-weather-presentations

**Outstanding evidence:** a dated production credit, broadcast footage with verifiable source credits, an attributable Geographx statement, or documented first-hand testimony from a TV3/Newshub graphics producer.

### Image rights decision

Actual Geographx images in Smith's 2012 paper are © New Zealand Cartographic Society. No independent permission to republish those figures was established. The company's 4 m commercial imagery is not covered by LINZ's separate open licence. Both are linked as original evidence but not copied. Only the two LINZ 2013 CC BY 3.0 NZ images are reused, with explicit Crown credit, source URLs and licensing on image-detail pages.

### Integrated files and checks

Updated Roger Smith and Geographx profiles; corrected the three existing Geographx dataset records; added a discrete LINZ 2013 basemap dataset, relationships, two image records and matching editorial image decisions; selected authentic LINZ contextual images for four dataset cards; inserted primary-source paragraphs in Chapter 12 and Chapter 39. The existing chapter text, images, chronology and 2025 timeline cut-off remain intact. Both preservation-manifest hashes for the amended chapter passage files were recalculated and retained.

Required verification: repository tests, image-blob SHA-1 comparisons, source/reference completeness, preservation manifest, full build, Chromium desktop/mobile navigation and reader tests, Cloudflare preview and final production commit confirmation.

## Completed archive integrity verification

The feature-branch image preparation workflow successfully regenerated the two LINZ web/card image variants from the byte-identical archived originals, checked their original Git blob hashes, added measured image dimensions and SHA-256 file checksums, and ran `npm test` and `npm run validate` successfully. The original source files were retained unchanged. Only the explicitly reviewed Roger Smith and Geographx biography preservation hashes were updated, alongside the previously reviewed Chapter 12 and Chapter 39 passage hashes. Publication and browser checks must still pass on the final pull-request head before production release.
