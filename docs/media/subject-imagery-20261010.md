# Subject-based documentary image research and integration
10 October 2026. Repository: `pm4gis/gishistory26`. This work follows the published decorative-landscape redesign, and does not replace that collection.

## Editorial rule
Use verifiable **subject-relevant** images for themes, agencies, organisations, businesses, councils and dated events. A source image that illustrates an industry, geography, or modern successor must never be described as a photograph of an earlier GIS programme. Keep creator, date, licence, source and context accessible from the original `/images/<slug>/` page. Do **not** populate People profiles with new images, photographs, headshots, initials, silhouettes or avatar placeholders. Do not assign an image to a record based solely on the similarity of its name, region or type.

## Applied to the site
These links use locally stored, previously verified WebP derivatives with complete image detail pages. The existing protected article/record/event content files have not been modified.

| Section | Image | Representation and limitation |
| --- | --- | --- |
| Cadastre | `new-river-cadastre-1898` | Genuine nineteenth-century New Zealand parcel mapping; not a Landonline screenshot |
| Aerial / satellite imagery | `wrights-hill-1945` | Real historical New Zealand aerial photograph; not an image of digital GIS software |
| Local government GIS | `linz-landonline-territorial-authority-2025` | Genuine territorial-authority boundaries in a modern LINZ interface, not a historic local council desktop |
| Open source / open data | `linz-wmts-qgis-data-view` | Genuine LINZ guide to QGIS and open data |
| GIS profession | `linz-arcmap-property-relationships-2016` | Real ArcMap interface, not an identified geospatial practitioner |
| Technology stack | `linz-wfs-attribute-service-2023` | Real LINZ spatial service and standardised attribute filtering |
| Women in GIS | No documentary assignment in this wave | Existing abstract decoration retained rather than falsely attributing unknown mapping work to a particular woman or group |
| LINZ | `linz-landonline-survey-work-2025` | Agency-authored screen from a defined service |
| Stats NZ | `nz-census-density-2023` | Map derived from Stats NZ 2023 Census; independent cartographer |
| GNS Science | `qmap-christchurch-2008` | Named GNS publication |
| DOC | `ecoregions-qgis-2025` | Relevant ecological mapping, expressly not represented as DOC's product |
| Eagle Technology | `nz-dem-arcgis-2006` | Esri ArcGIS 9.1 output; not represented as produced by Eagle |
| Aerial Surveys | `southland-aerial-verdon-1988` | Original aerial survey example; photographer/source not attributed to this company |
| Auckland Council | `auckland-osm-colour-2018` | Regional map for geographic context; not an Auckland Council GIS application |
| Christchurch City Council | `victoria-square-aerial-1955` | Christchurch imagery later made available through council historic-image services |
| Hutt City Council | `petone-lower-hutt-survey-1909` | Survey map of Lower Hutt / Petone before corporate GIS |
| Wellington City Council | `wrights-hill-1945` | Wellington-region aerial photography; not a council-owned application |
| Canterbury Regional Council / Environment Canterbury | `canterbury-wilding-pines` | Relevant land-management subject, but an independent photograph |
| Bay of Plenty Regional Council | `rotoiti-bathymetry-2021` | Real GNS Science Lake Rotoiti survey, not a Bay of Plenty council project |
| NZ Transport Agency Waka Kotahi | `auckland-region-transport-2014` | Transport geography; independent map, not an agency-authored illustration |

The existing `src/lib/timeline-media.mjs` already relates several dozen real images to specific dated events, including the 2011 Christchurch and 2016 Kaikōura earthquakes, Landonline, LINZ Data Service, early aerial imagery, LiDAR and geological cartography. This task retains those image associations and adds images to themes and organisation/council pages without rewriting events, passages or image records.

## External candidates identified for the next acquisition wave
These are actual public Commons file records with source/author/licence descriptions checked on 10 October 2026. They are **not yet local assets**, so this wave does not assign them to public image slots. Choose and prepare responsive WebP files, store the original and derivative hashes, append to the image collection, then add contextual assignments.

| Candidate subject | Actual image, source record | Creator / licence | Editorial relevance |
| --- | --- | --- | --- |
| Auckland Regional Council | [ARC Pitt Street offices, 2007](https://commons.wikimedia.org/wiki/File:Auckland_Regional_Council.jpg) | Ingolfson; public domain | Direct historic photograph of the now-defunct ARC building, better than a generic Auckland map |
| Upper Hutt City Council | [Civic Centre, 2005](https://commons.wikimedia.org/wiki/File:Upper_Hutt_Civic_Centre.jpg) | Michael Dudding; public domain | Genuine historic council building contemporaneous with XPLORER |
| Upper Hutt City Council | [Council civic building, 2025](https://commons.wikimedia.org/wiki/File:Upper_Hutt_City_Council_civic_building.jpg) | AxonsArachnida; CC BY-SA 4.0 | Later council building photograph; distinguish date |
| Hutt City Council | [Town Hall and council building, 2021](https://commons.wikimedia.org/wiki/File:Lower_Hutt_Town_Hall_and_Council_building_2021-09-25_2.jpg) | See Commons file metadata; CC BY-SA 4.0 | Direct image of the institution |
| Christchurch City Council | [53 Hereford Street council offices, 2019](https://commons.wikimedia.org/wiki/File:Christchurch_City_Council,_53_Hereford_St,_21_January_2019.jpg) | Roger 8 Roger; CC BY-SA 4.0 | Council-owned building rather than a generic city map |
| Christchurch earthquake event | [NZDF Orion aerial reconnaissance, 22 February 2011](https://commons.wikimedia.org/wiki/File:Christchurch_-_2011_earthquake_damage_001.jpg) | NZ Defence Force; CC BY 2.0 | Direct contemporary event photograph, more immediately recognisable than later analytical layers |
| Cyclone Gabrielle event / flood mapping | [Flooding near Napier, February 2023](https://commons.wikimedia.org/wiki/File:Flooding_caused_by_Cyclone_Gabrielle_near_Napier,_New_Zealand_-_14_February_2023_(52690129056).jpg) | Pierre Markuse; CC BY 2.0; modified Copernicus Sentinel data 2023 must also be credited | Satellite-derived flood image, for relevant events only if an accepted event exists |
| Auckland civic history | [Auckland City Council Civic Building, 2007](https://commons.wikimedia.org/wiki/File:Auckland_City_Council_Main_Building.jpg) | Ingolfson; public domain | Historic predecessor council, not necessarily the post-2010 Auckland Council office |
| Women in GIS / professional networks | [Women in Spatial + Surveying](https://womeninspatial.wordpress.com/) | Specific visual reuse not verified | Genuine profession/community subject; request explicit reuse permission before publishing its photos or identity marks |

### Quality requirements
Use the correct institution and year; avoid implying a 2025 council building depicts an early GIS project. Treat site logos, screenshots, artwork, photographs and survey layers separately for licensing. Do not substitute generated historical images. Avoid repeatedly using the same regional picture merely because a council shares the region. Prefer direct organisational photos/maps and first-party screenshots as they become available. No person profile is to receive a new image.

## Implementation record
`src/lib/subject-media.mjs` contains exact association decisions. `SubjectImage.astro` presents accessible images with links to the real image detail page. The browse list suppresses person imagery and the catch-all record template enforces this restriction again. `tests/subject-media.test.mjs` checks the image records, the theme coverage and strict person exclusion. The source dataset, text and permanent identifiers remain unchanged.
