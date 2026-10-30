import {geodeticPdfPublications} from './geodetic-pdf-publications.mjs';
import {linzHistoricalReports} from './linz-historical-reports-20261018.mjs';
import {pre2000PdfPublications} from './pre2000-pdf-publications-20261018.mjs';
import {magazinePdfPublications} from './magazine-pdf-publications-20261018.mjs';
import {verifiedNzGis20261030} from './verified-nz-gis-publications-20261030.mjs';
const ccBy4 = 'Creative Commons Attribution 4.0 International (CC BY 4.0)';
const ccBy4Url = 'https://creativecommons.org/licenses/by/4.0/';

const hosted = item => ({
  ...item,
  hostedLocally: !item.externalPdfUrl,
  pdfPath: item.externalPdfUrl || `/assets/publications/pdfs/${item.fileName}`,
  thumbnailPath: `/assets/publications/thumbnails/${item.slug}.${item.generatedCover ? 'svg' : 'jpg'}`,
});

// Curated Internet publications and contributor-supplied archival copies.
// Hosted copies and source-linked references include reuse terms, attribution,
// a source link, and a first-page thumbnail.
export const onlinePdfPublications = [
  // 33 additional Internet publications dated 2025 or earlier. Five source
  // records link to the publisher because the report copy has no reuse grant.
  hosted({
    slug: 'auckland-coastal-hazard-guidance-2022', fileName: 'auckland-coastal-hazard-assessment-guidance-2022.pdf', isNewAddition: true,
    title: 'Coastal hazard assessment in the Auckland region', creator: 'Natasha Carpenter · Auckland Council', year: '2022', date: 'July 2022 · Auckland Council Guideline GD2021/010',
    kind: 'Council technical guideline', topic: 'GIS methods for coastal erosion, inundation and sea-level rise assessment',
    summary: 'Guidance for assessing coastal hazards in Auckland, including mapping coastal erosion and storm inundation areas to inform planning, asset management and adaptation.',
    sourceName: 'Auckland Council · Knowledge Auckland', sourceUrl: 'https://knowledgeauckland.org.nz/publications/coastal-hazard-assessment-in-the-auckland-region/', sourceLabel: 'Council publication record',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Carpenter (2022), Auckland Council Guideline Document GD2021/010. CC BY 4.0.',
    themeIds: ['profession', 'open-practice'], keywords: ['coastal hazards', 'GIS', 'erosion', 'inundation', 'sea-level rise', 'Auckland']
  }),
  hosted({
    slug: 'wetland-drainage-lidar-2023', fileName: 'paper-lidar-wetland-drainage-risks-2023.pdf', isNewAddition: true,
    title: 'LiDAR reveals drainage risks to wetlands have been under-estimated', creator: 'Olivia R. Burge, Robbie Price, Janet M. Wilmshurst, James M. Blyth and Hugh A. Robertson', year: '2023', date: '18 May 2023',
    kind: 'Peer-reviewed open-access article', topic: 'LiDAR analysis of wetland drainage and ecological risk',
    summary: 'Combines national wetland and drainage layers with LiDAR analysis in Waituna to show how conventional drainage data can understate the area of wetlands near drains.',
    sourceName: 'New Zealand Journal of Ecology', sourceUrl: 'https://newzealandecology.org/nzje/3523', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Burge et al. (2023), New Zealand Journal of Ecology 47(1), 3523. DOI: 10.20417/nzjecol.47.3523. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['LiDAR', 'wetlands', 'drainage', 'spatial modelling', 'ecology', 'GIS']
  }),
  hosted({
    slug: 'gisborne-insar-landslides-2023', fileName: 'paper-slow-moving-shallow-landslides-gisborne-2022.pdf', isNewAddition: true,
    title: 'Investigating slow-moving shallow soil landslides using Sentinel-1 InSAR data in Gisborne, New Zealand', creator: 'Matthew E. Cook, Martin S. Brook, Ian J. Hamling, Murry Cave, Jon F. Tunnicliffe and Rachel Holley', year: '2023', date: 'Published online 26 October 2022 · issue date February 2023',
    kind: 'Peer-reviewed open-access technical note', topic: 'InSAR, LiDAR and spatial mapping of slow-moving landslides',
    summary: 'Uses Sentinel-1 InSAR, regional LiDAR, aerial imagery and field observations to identify and monitor unstable slopes around Gisborne.',
    sourceName: 'Landslides · Springer Nature', sourceUrl: 'https://link.springer.com/article/10.1007/s10346-022-01982-9', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Cook et al. (2023), Landslides 20, 427–446. DOI: 10.1007/s10346-022-01982-9. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['Sentinel-1', 'InSAR', 'LiDAR', 'Gisborne', 'landslides', 'remote sensing']
  }),
  hosted({
    slug: 'auckland-landslide-susceptibility-2025', fileName: 'auckland-region-landslide-susceptibility-2025.pdf', externalPdfUrl: 'https://www.aucklandcouncil.govt.nz/UnitaryPlanDocuments/mir-document-landslide-susceptibility-assessment-25092025.pdf', isNewAddition: true,
    title: 'Auckland region landslide susceptibility assessment', creator: 'WSP for Auckland Council', year: '2025', date: '28 February 2025 · Auckland Council technical report TR2025/7',
    kind: 'Council technical report', topic: 'Regional landslide inventory and susceptibility mapping',
    summary: 'Presents regional shallow and large-scale landslide mapping and susceptibility analysis built from LiDAR terrain, satellite imagery and existing inventories.',
    sourceName: 'Auckland Council · Knowledge Auckland', sourceUrl: 'https://knowledgeauckland.org.nz/publications/auckland-region-landslide-susceptibility-assessment-may-2025/', sourceLabel: 'Council publication record',
    license: 'The report says it must not be reproduced without WSP’s prior written approval.', attribution: 'WSP for Auckland Council (2025), Auckland Council technical report TR2025/7.',
    themeIds: ['profession'], keywords: ['landslides', 'susceptibility', 'LiDAR', 'Auckland', 'hazard mapping', 'GIS']
  }),
  hosted({
    slug: 'basic-gis-manual-2020', fileName: 'basic-gis-manual-2019.pdf', externalPdfUrl: 'https://www.landcareresearch.co.nz/assets/Tools-And-Resources/Data/data-visualisation/Basic-GIS-manual.pdf', isNewAddition: true,
    title: 'Basic spatial visualisation GIS manual: example using kiwi populations', creator: 'Anne Sutherland and Kiri Reihana · Manaaki Whenua – Landcare Research', year: '2020', date: '30 April 2020',
    kind: 'GIS training manual', topic: 'QGIS workflows for community conservation mapping',
    summary: 'A practical guide to spatial data, QGIS basics and making conservation maps from public datasets, using kiwi populations as the example.',
    sourceName: 'Manaaki Whenua – Landcare Research', sourceUrl: 'https://www.landcareresearch.co.nz/assets/Tools-And-Resources/Data/data-visualisation/Basic-GIS-manual.pdf', sourceLabel: 'Publisher PDF',
    license: 'No reuse licence is stated in the manual; publisher terms apply.', attribution: 'Sutherland and Reihana (2020), Basic spatial visualisation GIS manual.',
    themeIds: ['profession'], keywords: ['QGIS', 'GIS manual', 'kiwi', 'conservation', 'community mapping', 'spatial data']
  }),
  hosted({
    slug: 'christchurch-lidar-report-2025', fileName: 'christchurch-lidar-survey-report-2024-2025.pdf', externalPdfUrl: 'https://data.linz.govt.nz/layer/123194-canterbury-christchurch-lidar-1m-dsm-2024-2025/', sourceOnly: true, isNewAddition: true,
    title: 'Christchurch 2024/25 CAI LiDAR survey: metadata report', creator: 'Aerial Surveys Ltd for Environment Canterbury', year: '2025', date: '2025 · Christchurch and Lyttelton Harbour capture in 2024–2025',
    kind: 'LiDAR survey report', topic: 'Christchurch elevation capture, processing and deliverables',
    summary: 'Metadata for the Christchurch and Lyttelton Harbour LiDAR survey, with acquisition, processing and delivery details on the LINZ source record.',
    sourceName: 'LINZ Data Service · Environment Canterbury', sourceUrl: 'https://data.linz.govt.nz/layer/123194-canterbury-christchurch-lidar-1m-dsm-2024-2025/', sourceLabel: 'LINZ source record and attachment',
    license: 'The attached report states all rights are reserved and prohibits reproduction without Aerial Surveys’ written consent. The LINZ CC BY licence on this record describes the data layer.', attribution: 'Aerial Surveys Ltd for Environment Canterbury (2025), Christchurch 2024/25 CAI LiDAR Survey metadata report.',
    themeIds: ['profession'], keywords: ['LiDAR', 'Christchurch', 'Canterbury', 'elevation', 'survey', 'metadata']
  }),
  hosted({
    slug: 'gisborne-priority-area-lidar-2023', fileName: 'gisborne-lidar-survey-report-2023.pdf', externalPdfUrl: 'https://object.cloud.sdsc.edu/v1/AUTH_opentopography/www/metadata/NZ23_Gisborne_metadata.pdf', isNewAddition: true,
    title: 'Tairāwhiti priority area LiDAR: metadata report', creator: 'Landpro Ltd for NIWA', year: '2023', date: '21 December 2023',
    kind: 'LiDAR metadata report', topic: 'Tairāwhiti elevation survey and geospatial data delivery',
    summary: 'Records the Tairāwhiti priority-area survey and delivered elevation products for NIWA, including the acquisition and processing specification.',
    sourceName: 'OpenTopography · NIWA / Landpro', sourceUrl: 'https://object.cloud.sdsc.edu/v1/AUTH_opentopography/www/metadata/NZ23_Gisborne_metadata.pdf', sourceLabel: 'Source metadata PDF',
    license: 'The report states all rights are reserved and restricts reproduction.', attribution: 'Landpro Ltd for NIWA (2023), Tairāwhiti priority area LiDAR metadata report.',
    themeIds: ['profession'], keywords: ['LiDAR', 'Tairāwhiti', 'Gisborne', 'NIWA', 'elevation', 'metadata']
  }),
  hosted({
    slug: 'marlborough-pgf-lidar-2022', fileName: 'marlborough-lidar-survey-report-2020-2022.pdf', externalPdfUrl: 'https://object.cloud.sdsc.edu/v1/AUTH_opentopography/www/metadata/NZ20_Marlbo_metadata.pdf', isNewAddition: true,
    title: 'Marlborough 2019–25 PGF LiDAR survey: metadata report', creator: 'Aerial Surveys Ltd for Marlborough District Council', year: '2022', date: '30 November 2022',
    kind: 'LiDAR metadata report', topic: 'Marlborough elevation survey and geospatial data delivery',
    summary: 'Describes the Marlborough airborne laser-scanning project and its point clouds, elevation grids, breaklines, QA records and metadata deliverables.',
    sourceName: 'OpenTopography · Marlborough District Council', sourceUrl: 'https://object.cloud.sdsc.edu/v1/AUTH_opentopography/www/metadata/NZ20_Marlbo_metadata.pdf', sourceLabel: 'Source metadata PDF',
    license: 'The report does not state an open reuse licence; source terms apply.', attribution: 'Aerial Surveys Ltd for Marlborough District Council (2022), Marlborough 2019–25 PGF LiDAR metadata report.',
    themeIds: ['profession'], keywords: ['LiDAR', 'Marlborough', 'PGF', 'elevation', 'survey', 'metadata']
  }),
  hosted({
    slug: 'auckland-part-2-lidar-2024', fileName: 'auckland-part-2-lidar-survey-report-2024.pdf', isNewAddition: true,
    title: 'Auckland LiDAR 2024: project summary for the outer Auckland areas', creator: 'Woolpert for Auckland Council', year: '2025', date: '27 June 2025 · survey captured in 2024',
    kind: 'LiDAR survey report', topic: 'Regional elevation mapping and LiDAR delivery',
    summary: 'Project summary for the 2024 LiDAR collection over Auckland’s outlying areas, including the capture blocks, processing, validation and delivered products.',
    sourceName: 'LINZ Data Service · Auckland Council', sourceUrl: 'https://data.linz.govt.nz/layer/d3W9HT9YGf35Ph8/auckland-part-2-lidar-point-cloud-2024/attachments/25756/', sourceLabel: 'LINZ source record and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Auckland Council; survey and processing by Woolpert. Sourced from LINZ Data Service.',
    themeIds: ['profession', 'open-practice'], keywords: ['LiDAR', 'elevation', 'Auckland', 'point cloud', 'survey']
  }),
  hosted({
    slug: 'bay-of-plenty-lidar-2024', fileName: 'bay-of-plenty-lidar-survey-report-2024.pdf', isNewAddition: true,
    title: 'Bay of Plenty LiDAR 2023–2024: project summary', creator: 'Woolpert for Regional Software Holdings Ltd and the New Zealand Government', year: '2024', date: '2024 · survey captured in 2023–2024',
    kind: 'LiDAR survey report', topic: 'Regional elevation mapping and post-event data',
    summary: 'Documents the Bay of Plenty LiDAR products captured as part of the North Island Weather Events survey programme, including processing and validation.',
    sourceName: 'LINZ Data Service · Bay of Plenty LiDAR', sourceUrl: 'https://data.linz.govt.nz/layer/120424-bay-of-plenty-lidar-index-tiles-2024/', sourceLabel: 'LINZ source record and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Regional Software Holdings Ltd / New Zealand Government; survey and processing by Woolpert. Sourced from LINZ Data Service.',
    themeIds: ['profession', 'open-practice'], keywords: ['LiDAR', 'elevation', 'Bay of Plenty', 'weather events', 'point cloud']
  }),
  hosted({
    slug: 'banks-peninsula-lidar-2023', fileName: 'banks-peninsula-lidar-survey-report-2023.pdf', isNewAddition: true,
    title: 'Banks Peninsula LiDAR: metadata report', creator: 'Landpro Ltd for Environment Canterbury', year: '2023', date: '2023 · capture completed 15 August 2023',
    kind: 'LiDAR metadata report', topic: 'Regional elevation mapping and data processing',
    summary: 'Metadata for the Banks Peninsula LiDAR survey, covering capture, processing and the digital map and elevation products supplied to Environment Canterbury.',
    sourceName: 'LINZ Data Service · Environment Canterbury', sourceUrl: 'https://data.linz.govt.nz/layer/d3Rwypq5fDpvYJv/canterbury-banks-peninsula-lidar-point-cloud-2023/', sourceLabel: 'LINZ source record and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Environment Canterbury; survey provider Landpro Ltd. Sourced from LINZ Data Service.',
    themeIds: ['profession', 'open-practice'], keywords: ['LiDAR', 'Banks Peninsula', 'Canterbury', 'elevation', 'metadata']
  }),
  hosted({
    slug: 'hawkes-bay-lidar-2024', fileName: 'hawkes-bay-lidar-survey-report-2023-2024.pdf', isNewAddition: true,
    title: 'Post-Cyclone Gabrielle Hawke’s Bay LiDAR: project summary', creator: 'Woolpert for NIWA', year: '2024', date: '2024 · capture mainly September–December 2023',
    kind: 'LiDAR survey report', topic: 'Post-disaster elevation mapping and data delivery',
    summary: 'Project summary for approximately 5,519 km² of post-Cyclone Gabrielle LiDAR and imagery across Hawke’s Bay, including later quality-assurance resubmissions.',
    sourceName: 'LINZ Data Service · NIWA', sourceUrl: 'https://data.linz.govt.nz/layer/118755-hawkes-bay-lidar-1m-dem-2023-2024/', sourceLabel: 'LINZ source record and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'NIWA; survey and processing by Woolpert. Sourced from LINZ Data Service.',
    themeIds: ['profession', 'open-practice'], keywords: ['LiDAR', 'Hawke’s Bay', 'Cyclone Gabrielle', 'elevation', 'survey']
  }),
  hosted({
    slug: 'stats-geographic-areas-standard-2018', fileName: 'statistical-standard-geographic-areas-2018.pdf', isNewAddition: true,
    title: 'Statistical standard for geographic areas 2018', creator: 'Stats NZ Tatauranga Aotearoa', year: '2017', date: '7 December 2017 · standard applies from 2018',
    kind: 'National statistical standard', topic: 'Statistical geographies and GIS classification',
    summary: 'Defines Stats NZ’s geographic classifications and requirements for creating and maintaining statistical geographies, including the SA1 and SA2 framework.',
    sourceName: 'Stats NZ', sourceUrl: 'https://www.stats.govt.nz/methods/statistical-standard-for-geographic-areas-2018/', sourceLabel: 'Stats NZ publication record',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Source: Stats NZ and licensed by Stats NZ for reuse under CC BY 4.0.',
    themeIds: ['profession', 'open-practice'], keywords: ['geography', 'statistics', 'classification', 'SA1', 'SA2', 'GIS']
  }),
  hosted({
    slug: 'stats-geographic-areas-standard-2023', fileName: 'statistical-standard-geographic-areas-2023.pdf', isNewAddition: true,
    title: 'Statistical standard for geographic areas 2023 (updated December 2023)', creator: 'Stats NZ Tatauranga Aotearoa', year: '2023', date: 'Published 16 December 2022 · updated December 2023',
    kind: 'National statistical standard', topic: 'Current statistical geographies and boundary release process',
    summary: 'The 2023 standard defines New Zealand statistical geographies and updates the 2018 standard with changes to geographic boundary releases and the official grid.',
    sourceName: 'Stats NZ', sourceUrl: 'https://www.stats.govt.nz/methods/statistical-standard-for-geographic-areas-2023/', sourceLabel: 'Stats NZ publication record',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Source: Stats NZ and licensed by Stats NZ for reuse under CC BY 4.0.',
    themeIds: ['profession', 'open-practice'], keywords: ['geography', 'statistics', 'classification', 'boundaries', 'GIS']
  }),
  hosted({
    slug: 'auckland-geospatial-transport-2025', fileName: 'auckland-geospatial-transport-modes-2025.pdf', isNewAddition: true,
    title: 'A geospatial comparison of driving with non-driving transport modes in Tāmaki Makaurau / Auckland', creator: 'Joanne Daniel and Kathryn Ovenden', year: '2025', date: 'March 2025 · Auckland Council technical report TR2025/4',
    kind: 'Council technical report', topic: 'Geospatial analysis of transport access and trip patterns',
    summary: 'Uses geocoded survey trips and spatial analysis to compare car journeys with public transport, cycling and walking across Auckland.',
    sourceName: 'Auckland Council · Knowledge Auckland', sourceUrl: 'https://knowledgeauckland.org.nz/publications/a-geospatial-comparison-of-driving-with-non-driving-transport-modes-in-tamaki-makaurau-auckland/', sourceLabel: 'Council publication record',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Daniel and Ovenden (2025), Auckland Council technical report TR2025/4. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['geospatial', 'transport', 'Auckland', 'accessibility', 'GIS', 'spatial analysis']
  }),
  hosted({
    slug: 'auckland-urban-forest-canopy-2021', fileName: 'auckland-urban-forest-canopy-cover-2021.pdf', isNewAddition: true,
    title: 'Auckland’s urban forest canopy cover: state and change (2013–2016/2018), revised April 2021', creator: 'Nancy Golubiewski, Grant Lawrence, Joe Zhao and Craig Bishop', year: '2021', date: 'April 2021 · Auckland Council technical report TR2020/009-2',
    kind: 'Council technical report', topic: 'LiDAR and GIS measurement of urban tree canopy',
    summary: 'Uses Auckland LiDAR and spatial comparisons to map tree canopy cover and change across local boards, land cover, zoning and tenure.',
    sourceName: 'Auckland Council · Knowledge Auckland', sourceUrl: 'https://knowledgeauckland.org.nz/publications/auckland-s-urban-forest-canopy-cover-state-and-change-2013-20162018-revised-april-2021/', sourceLabel: 'Council publication record',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Golubiewski, Lawrence, Zhao and Bishop (2021), Auckland Council technical report TR2020/009-2. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['LiDAR', 'urban forest', 'canopy', 'Auckland', 'remote sensing', 'GIS']
  }),
  hosted({
    slug: 'nz-national-landslide-database-2017', fileName: 'paper-new-zealand-national-landslide-database-2017.pdf', isNewAddition: true,
    title: 'New Zealand’s National Landslide Database', creator: 'Brenda Rosser, Sally Dellow, Soren Haubrock and Phil Glassey', year: '2017', date: '30 May 2017',
    kind: 'Peer-reviewed open-access article', topic: 'National geospatial hazard database design',
    summary: 'Describes the design, data sources and dissemination of New Zealand’s national landslide database, including its GIS, PostGIS and GeoServer foundations.',
    sourceName: 'Landslides · Springer Nature', sourceUrl: 'https://link.springer.com/article/10.1007/s10346-017-0843-6', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Rosser et al. (2017), Landslides 14, 1949–1959. DOI: 10.1007/s10346-017-0843-6. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['landslides', 'database', 'PostGIS', 'GeoServer', 'hazards', 'GIS']
  }),
  hosted({
    slug: 'kaikoura-landslide-dataset-2022', fileName: 'paper-kaikoura-landslide-dataset-2022.pdf', isNewAddition: true,
    title: 'An open dataset for landslides triggered by the 2016 Mw 7.8 Kaikōura earthquake, New Zealand', creator: 'Hakan Tanyaş, Tolga Görüm, Islam Fadel, Cengiz Yıldırım and Luigi Lombardo', year: '2022', date: '2 April 2022',
    kind: 'Peer-reviewed open-access article', topic: 'Earthquake landslide inventories and spatial distribution',
    summary: 'Maps 14,233 Kaikōura earthquake landslides and 101 landslide dams, documenting an open inventory and analysis across approximately 14,000 km².',
    sourceName: 'Landslides · Springer Nature', sourceUrl: 'https://link.springer.com/article/10.1007/s10346-022-01869-9', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Tanyaş et al. (2022), Landslides 19, 1405–1420. DOI: 10.1007/s10346-022-01869-9. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['Kaikōura', 'earthquake', 'landslides', 'inventory', 'spatial distribution', 'GIS']
  }),
  hosted({
    slug: 'cyclone-gabrielle-landslide-analysis-2025', fileName: 'paper-cyclone-gabrielle-landslides-2025.pdf', isNewAddition: true,
    title: 'What controlled the occurrence of more than 116,000 human-mapped landslides triggered by Cyclone Gabrielle, New Zealand?', creator: 'Chris Massey, Kerry Leith, Tom Robinson, Biljana Lukovic, Sam McColl, Trevor Carey-Smith, Brenda Rosser, Liam Wotherspoon, Hugh Smith, Harley Betts, Rob Buxton and Janine Bidmead', year: '2025', date: '15 August 2025',
    kind: 'Peer-reviewed open-access article', topic: 'GIS landslide analysis and national hazard mapping',
    summary: 'Analyses a large human-mapped landslide inventory from Cyclone Gabrielle to examine spatial controls and landslide occurrence across affected regions.',
    sourceName: 'Landslides · Springer Nature', sourceUrl: 'https://link.springer.com/article/10.1007/s10346-025-02591-y', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Massey et al. (2025), Landslides 22, 3953–3972. DOI: 10.1007/s10346-025-02591-y. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['Cyclone Gabrielle', 'landslides', 'GIS', 'spatial analysis', 'hazards']
  }),
  hosted({
    slug: 'geospatial-drinking-water-data-2024', fileName: 'paper-geospatial-drinking-water-data-2024.pdf', isNewAddition: true,
    title: 'Examining the structural inequities in the quality of nationwide drinking water data in Aotearoa New Zealand: a geospatial cross-sectional study', creator: 'Matthew Hobbs, Mario Puente-Sierra, Lukas Marek, Jonathan M. Broadbent and Terry Chambers', year: '2024', date: '28 February 2024',
    kind: 'Peer-reviewed open-access article', topic: 'Geospatial data quality and equity',
    summary: 'Assesses the quality of nationwide drinking-water distribution-zone data and examines geographic inequities in the data available across territorial authorities.',
    sourceName: 'Applied Spatial Analysis and Policy · Springer Nature', sourceUrl: 'https://link.springer.com/article/10.1007/s12061-024-09571-0', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Hobbs et al. (2024), Applied Spatial Analysis and Policy 17, 951–962. DOI: 10.1007/s12061-024-09571-0. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['geospatial data', 'water', 'quality', 'equity', 'GIS', 'territorial authorities']
  }),
  hosted({
    slug: 'hauraki-gulf-marine-spatial-planning-2023', fileName: 'paper-hauraki-gulf-marine-spatial-planning-2023.pdf', isNewAddition: true,
    title: 'Urban environmental ethics and coastal transformations: remapping the Hauraki Gulf Tīkapa Moana in a process of marine spatial planning', creator: 'Marie Aschenbrenner', year: '2023', date: '13 July 2023',
    kind: 'Peer-reviewed open-access article', topic: 'Marine spatial planning and coastal mapping',
    summary: 'Examines remapping and environmental decision-making in the Hauraki Gulf Tīkapa Moana, placing marine spatial planning in its Auckland and Aotearoa context.',
    sourceName: 'Maritime Studies · Springer Nature', sourceUrl: 'https://link.springer.com/article/10.1007/s40152-023-00321-5', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Aschenbrenner (2023), Maritime Studies 22, 33. DOI: 10.1007/s40152-023-00321-5. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['Hauraki Gulf', 'Tīkapa Moana', 'marine spatial planning', 'mapping', 'Auckland']
  }),
  hosted({
    slug: 'healthy-location-index-nz-2021', fileName: 'paper-healthy-location-index-new-zealand-2021.pdf', isNewAddition: true,
    title: 'The good, the bad, and the environment: developing an area-based measure of access to health-promoting and health-constraining environments in New Zealand', creator: 'Lukas Marek, Matthew Hobbs, Jamie Wiki, Matt Kingham and Terry Chambers', year: '2021', date: '6 April 2021',
    kind: 'Peer-reviewed open-access article', topic: 'GIS, accessibility and environmental health',
    summary: 'Develops a nationwide healthy-location index using geocoded environmental exposures, including access to green space and other health-relevant places.',
    sourceName: 'International Journal of Health Geographics · Springer Nature', sourceUrl: 'https://link.springer.com/article/10.1186/s12942-021-00269-x', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Marek et al. (2021), International Journal of Health Geographics 20, 16. DOI: 10.1186/s12942-021-00269-x. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['GIS', 'accessibility', 'health geography', 'environment', 'geocoding', 'New Zealand']
  }),
  hosted({
    slug: 'north-island-land-use-transitions-2025', fileName: 'paper-rural-land-use-transitions-north-island-2025.pdf', isNewAddition: true,
    title: 'Understanding land-use transitions in rural areas of the North Island, New Zealand from 1996 to 2018: an intensity analysis approach', creator: 'Grace B. Villamor, Benjamin S. C. Steer, Alliyah Baluyot and Dean F. Meason', year: '2025', date: '26 March 2025',
    kind: 'Peer-reviewed open-access article', topic: 'Spatial land-use change analysis',
    summary: 'Applies intensity analysis to rural land-use transitions across the North Island, including changes among pastoral, native-forest and exotic-forest uses.',
    sourceName: 'GeoJournal · Springer Nature', sourceUrl: 'https://link.springer.com/article/10.1007/s10708-025-11324-6', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Villamor et al. (2025), GeoJournal 90, 76. DOI: 10.1007/s10708-025-11324-6. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['land use', 'spatial analysis', 'North Island', 'forestry', 'land-cover change']
  }),
  hosted({
    slug: 'gisborne-urban-landslide-insar-2022', fileName: 'paper-gis-insar-urban-landslide-gisborne-2022.pdf', isNewAddition: true,
    title: 'Engineering geomorphological and InSAR investigation of an urban landslide, Gisborne, New Zealand', creator: 'Matthew E. Cook, Martin S. Brook, Ian J. Hamling, Murry Cave, Jon F. Tunnicliffe, Rachel Holley and David J. Alama', year: '2022', date: '2 August 2022',
    kind: 'Peer-reviewed open-access article', topic: 'InSAR, geomorphology and urban landslide mapping',
    summary: 'Combines geomorphological mapping and satellite InSAR to investigate an urban landslide in Gisborne and interpret its movement history.',
    sourceName: 'Landslides · Springer Nature', sourceUrl: 'https://link.springer.com/article/10.1007/s10346-022-01938-z', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Cook et al. (2022), Landslides 19, 2423–2437. DOI: 10.1007/s10346-022-01938-z. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['Gisborne', 'InSAR', 'landslide', 'remote sensing', 'geomorphology']
  }),
  hosted({
    slug: 'national-coastal-landcover-mapping-2022', fileName: 'paper-national-scale-coastal-landcover-2022.pdf', isNewAddition: true,
    title: 'A methodology for national scale coastal landcover mapping in New Zealand', creator: 'Benedict Collings, Murray Ford and Mark Dickson', year: '2022', date: '27 September 2022',
    kind: 'Peer-reviewed open-access article', topic: 'Satellite remote sensing and national coastal mapping',
    summary: 'Presents a pixel-based satellite-image method for mapping coastal land-cover change across New Zealand and discusses its use for shoreline analysis.',
    sourceName: 'Remote Sensing · MDPI', sourceUrl: 'https://www.mdpi.com/2072-4292/14/19/4827', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Collings, Ford and Dickson (2022), Remote Sensing 14(19), 4827. DOI: 10.3390/rs14194827. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['remote sensing', 'coastal landcover', 'satellite imagery', 'mapping', 'New Zealand']
  }),
  hosted({
    slug: 'east-coast-river-stories-2023', fileName: 'paper-east-coast-river-stories-2023.pdf', isNewAddition: true,
    title: 'Managing at source and at scale: geomorphic river stories for rehabilitation of East Coast Aotearoa New Zealand riverscapes', creator: 'Ian C. Fuller, Gary J. Brierley, Jon Tunnicliffe, Mike Marden, Jacqui McCord, Brenda Rosser, Dan Hikuroa, Khendra Harvey, Elliot Stevens and Megan Thomas', year: '2023', date: '13 April 2023',
    kind: 'Peer-reviewed open-access article', topic: 'Catchment mapping and river geomorphology',
    summary: 'Uses catchment-scale geomorphic mapping and “river stories” to compare five East Coast catchments and guide place-specific river rehabilitation.',
    sourceName: 'Frontiers in Environmental Science', sourceUrl: 'https://www.frontiersin.org/journals/environmental-science/articles/10.3389/fenvs.2023.1162099/full', sourceLabel: 'Journal article and licence',
    license: 'Creative Commons Attribution (CC BY)', licenseUrl: ccBy4Url, attribution: 'Fuller et al. (2023), Frontiers in Environmental Science 11, 1162099. DOI: 10.3389/fenvs.2023.1162099. CC BY.',
    themeIds: ['open-practice', 'profession'], keywords: ['river geomorphology', 'catchment', 'mapping', 'Tairāwhiti', 'East Coast', 'rehabilitation']
  }),
  hosted({
    slug: 'qgis-blender-nz-open-data-2024', fileName: 'paper-qgis-blender-nz-open-data-2024.pdf', isNewAddition: true,
    title: 'Using Aotearoa New Zealand’s open data with QGIS and Blender to create two map styles', creator: 'Andrew Tyrrell', year: '2024', date: '18 December 2024',
    kind: 'Peer-reviewed cartography paper', topic: 'Open spatial data and map visualisation',
    summary: 'Shows how LINZ and other open New Zealand spatial data can be styled into a natural basemap and a perspective linework map using QGIS and Blender.',
    sourceName: 'Proceedings of the International Cartographic Association', sourceUrl: 'https://ica-proc.copernicus.org/articles/6/11/2024/', sourceLabel: 'Proceedings paper and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Tyrrell (2024), Proceedings of the International Cartographic Association 6, 11. DOI: 10.5194/ica-proc-6-11-2024. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['QGIS', 'Blender', 'cartography', 'LINZ', 'open data', 'map styles']
  }),
  hosted({
    slug: 'national-coastal-change-dataset-2024', fileName: 'paper-national-coastal-change-dataset-2024.pdf', isNewAddition: true,
    title: 'A national scale coastal change dataset for Aotearoa New Zealand', creator: 'Megan Tuck, Mark Dickson, Emma Ryan, Murray Ford and Teresa Konlechner', year: '2024', date: '1 December 2024',
    kind: 'Open-access data paper', topic: 'National coastal change data and geospatial methods',
    summary: 'Documents a national coastal-change dataset and the methods used to derive it, developed with support from councils across New Zealand.',
    sourceName: 'Data in Brief · University of Otago OurArchive', sourceUrl: 'https://ourarchive.otago.ac.nz/esploro/outputs/journalArticle/A-national-scale-coastal-change-dataset/9926653701701891', sourceLabel: 'Repository record and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Tuck et al. (2024), Data in Brief 57, 111104. DOI: 10.1016/j.dib.2024.111104. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['coastal change', 'dataset', 'mapping', 'shoreline', 'councils', 'New Zealand']
  }),
  hosted({
    slug: 'nz-human-terrestrial-pressures-2025', fileName: 'paper-nz-human-terrestrial-pressures-2025.pdf', isNewAddition: true,
    title: 'A spatial layer of human terrestrial pressures for New Zealand', creator: 'Olivia R. Burge, Richard Law and Sandy Wakefield', year: '2025', date: '21 January 2025',
    kind: 'Peer-reviewed open-access article', topic: 'National spatial indicators for conservation planning',
    summary: 'Builds a 100-metre national spatial layer of eight human-pressure components in NZTM2000 and demonstrates its use for protected land and wetlands.',
    sourceName: 'New Zealand Journal of Ecology', sourceUrl: 'https://newzealandecology.org/nzje/3580', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Burge, Law and Wakefield (2025), New Zealand Journal of Ecology 49(1), 3580. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['spatial layer', 'human footprint', 'NZTM2000', 'conservation', 'wetlands', 'land use']
  }),
  hosted({
    slug: 'ship-rat-spatial-distribution-2025', fileName: 'paper-ship-rat-spatial-distribution-2025.pdf', isNewAddition: true,
    title: 'Spatial distribution of probable ship rat reinvaders in a pest-fenced ecosanctuary', creator: 'Helen Nathan, Robert Schadewinkel and Nick Mulgan', year: '2025', date: '2025',
    kind: 'Peer-reviewed open-access article', topic: 'Spatial ecology and conservation monitoring',
    summary: 'Uses spatially explicit pest monitoring to examine probable ship-rat reinvasion patterns in a New Zealand ecosanctuary.',
    sourceName: 'New Zealand Journal of Ecology', sourceUrl: 'https://newzealandecology.org/nzje/3578', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Nathan, Schadewinkel and Mulgan (2025), New Zealand Journal of Ecology 49(1), 3578. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['spatial distribution', 'ship rat', 'pest control', 'ecosanctuary', 'monitoring']
  }),
  hosted({
    slug: 'spatial-detection-parameters-pests-2023', fileName: 'paper-spatial-detection-parameters-pests-2023.pdf', isNewAddition: true,
    title: 'Detectability of ten invasive mammal pests in New Zealand: a synthesis of spatial detection parameters', creator: 'Giorgia Vattiato, Rachelle N. Binny, Sam J. Davidson, Andrea E. Byrom, Dean P. Anderson, Michael J. Plank, Joanna K. Carpenter and Alex James', year: '2023', date: '16 November 2023',
    kind: 'Peer-reviewed open-access review', topic: 'Spatial ecology and pest detection models',
    summary: 'Reviews spatially explicit capture–recapture and home-range studies to summarise detection parameters for ten invasive mammals in New Zealand.',
    sourceName: 'New Zealand Journal of Ecology', sourceUrl: 'https://newzealandecology.org/nzje/3552', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Vattiato et al. (2023), New Zealand Journal of Ecology 47(1), 3552. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['spatial detection', 'invasive mammals', 'capture-recapture', 'pest management', 'modelling']
  }),
  hosted({
    slug: 'systematic-ecosystem-conservation-2023', fileName: 'paper-conservation-framework-spatial-data-2023.pdf', isNewAddition: true,
    title: 'Establishing an evidence-based framework for the systematic conservation of New Zealand’s terrestrial ecosystems', creator: 'John R. Leathwick, Amy L. Whitehead, Nicholas J. D. Singers and Elizabeth Daly', year: '2023', date: '8 December 2023',
    kind: 'Peer-reviewed open-access article', topic: 'Spatial prioritisation for ecosystem conservation',
    summary: 'Combines potential ecosystem maps, current land cover and spatial prioritisation to assess ecosystem loss and conservation options in the Horizons Region.',
    sourceName: 'New Zealand Journal of Ecology', sourceUrl: 'https://newzealandecology.org/nzje/3557', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Leathwick et al. (2023), New Zealand Journal of Ecology 47(1), 3557. CC BY 4.0.',
    themeIds: ['open-practice', 'profession'], keywords: ['spatial data', 'conservation', 'ecosystems', 'land cover', 'prioritisation', 'Horizons Region']
  }),
  hosted({
    slug: 'geospatial-forestry-technologies-2025', fileName: 'paper-geospatial-tech-plantation-forestry-2025.pdf', isNewAddition: true,
    title: 'Use of geospatial technologies in New Zealand’s plantation forestry sector – a decade of change', creator: 'Cong Xu, Anna Manning, Ning Ye and Justin Morgenroth', year: '2025', date: '11 November 2025',
    kind: 'Peer-reviewed open-access article', topic: 'Geospatial technology adoption in forestry',
    summary: 'Reviews changes in the use of GIS, remote sensing and other geospatial technologies across New Zealand’s plantation forestry sector over a decade.',
    sourceName: 'New Zealand Journal of Forestry Science', sourceUrl: 'https://www.nzjforestryscience.nz/index.php/nzjfs/article/view/430', sourceLabel: 'Journal article and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Xu et al. (2025), New Zealand Journal of Forestry Science 55, 18. DOI: 10.33494/nzjfs552025x430x. CC BY 4.0.',
    themeIds: ['profession', 'open-practice'], keywords: ['geospatial', 'forestry', 'GIS', 'remote sensing', 'technology adoption']
  }),

  // Previously listed records that have now been downloaded and rights-checked.
  hosted({
    slug: 'national-planning-standards-2019', fileName: 'national-planning-standards-2019-updated-2022.pdf', isNewAddition: false,
    title: 'National Planning Standards', creator: 'Ministry for the Environment', year: '2019', date: 'November 2019 · updated February 2022',
    kind: 'National standards', topic: 'Planning maps and district spatial layers',
    summary: 'Sets consistent structures and formats for planning documents, including regional and district spatial layers, mapping and electronic accessibility.',
    sourceName: 'Ministry for the Environment · NZLUM document collection', sourceUrl: 'https://environment.govt.nz/publications/national-planning-standards/', sourceLabel: 'Publisher record',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Ministry for the Environment (2019; updated 2022). Crown copyright, CC BY 4.0.',
    themeIds: ['open-practice'], keywords: ['planning', 'mapping', 'spatial layers', 'district plans', 'standards']
  }),
  hosted({
    slug: 'linz-landonline-case-study-2021', fileName: 'linz-landonline-digital-government-case-study-2021.pdf', isNewAddition: false,
    title: 'LINZ Landonline: a successful digital government case study', creator: 'Elizabeth Eppel and Miriam Lips', year: '2021', date: '12 January 2021',
    kind: 'Digital-government case study', topic: 'Landonline and digital land administration',
    summary: 'A Victoria University of Wellington case study on the first phase of Landonline modernisation, including service pilots, platform changes and in-house digital capability.',
    sourceName: 'Te Herenga Waka—Victoria University of Wellington', sourceUrl: 'https://openaccess.wgtn.ac.nz/articles/report/LINZ_Landonline_A_successful_digital_government_case_study/24515203', sourceLabel: 'Repository record and licence',
    license: 'Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International (CC BY-NC-SA 4.0)', licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/', attribution: 'Eppel and Lips (2021), LINZ Landonline: A Successful Digital Government Case Study. CC BY-NC-SA 4.0.',
    themeIds: ['open-practice'], keywords: ['Landonline', 'LINZ', 'digital government', 'land administration']
  }),
  hosted({
    slug: 'nzlum-soil-quality-land-use-2022', fileName: 'nzlum-land-use-classification-soil-quality-2022.pdf', isNewAddition: false,
    title: 'Land-use classification for state of the environment soil quality monitoring and reporting', creator: 'Jo Cavanagh and Brandon Whitehead', year: '2022', date: 'June 2022 · Manaaki Whenua contract report LC4146',
    kind: 'Research report', topic: 'Land-use information for environmental monitoring',
    summary: 'Proposes consistent land-use categories and attributes for regional and national soil-quality monitoring and reporting.',
    sourceName: 'Manaaki Whenua – Landcare Research · NZLUM', sourceUrl: 'https://nzlum.landcareresearch.co.nz/reference/documents/', sourceLabel: 'NZLUM documents and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Cavanagh and Whitehead (2022), Manaaki Whenua contract report LC4146. NZLUM documentation, CC BY 4.0.',
    themeIds: ['open-practice'], keywords: ['land use', 'soil quality', 'environmental monitoring', 'classification', 'NZLUM']
  }),
  hosted({
    slug: 'nzlum-classification-connectivity-2023', fileName: 'nzlum-land-use-classification-interoperability-2023.pdf', isNewAddition: false,
    title: 'Enabling flexibility and connectivity in land-use classification for state of the environment soil quality monitoring', creator: 'Jo Cavanagh and Brandon Whitehead', year: '2023', date: 'June 2023 · Manaaki Whenua contract report LC4309',
    kind: 'Research report', topic: 'Interoperable land-use classification',
    summary: 'Describes a prototype model for linking land-use classification systems and aligning categories used in regional council soil-quality monitoring.',
    sourceName: 'Manaaki Whenua – Landcare Research · NZLUM', sourceUrl: 'https://nzlum.landcareresearch.co.nz/reference/documents/', sourceLabel: 'NZLUM documents and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Cavanagh and Whitehead (2023), Manaaki Whenua contract report LC4309. NZLUM documentation, CC BY 4.0.',
    themeIds: ['open-practice'], keywords: ['land use', 'interoperability', 'classification', 'regional councils', 'NZLUM']
  }),
  hosted({
    slug: 'nzlum-land-use-classification-framework-2024', fileName: 'nzlum-land-use-information-system-framework-2024.pdf', isNewAddition: false,
    title: 'Land Use Information System – Land Use Classification Framework: final report', creator: 'Richard Law, Brandon Whitehead, Jo Cavanagh, James Ardo, Garth Harmsworth and Laise Harris', year: '2024', date: 'June 2024 · Manaaki Whenua contract report LC4488',
    kind: 'Research report', topic: 'National land-use classification framework',
    summary: 'Develops draft national land-use classifications, including extractive and non-extractive uses and te ao Māori perspectives.',
    sourceName: 'Manaaki Whenua – Landcare Research · NZLUM', sourceUrl: 'https://nzlum.landcareresearch.co.nz/reference/documents/', sourceLabel: 'NZLUM documents and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Law et al. (2024), Manaaki Whenua contract report LC4488. NZLUM documentation, CC BY 4.0.',
    themeIds: ['open-practice', 'maori-gis'], keywords: ['NZLUM', 'classification', 'land use', 'te ao Māori', 'framework']
  }),
  hosted({
    slug: 'nzlum-pilot-land-use-map-2025', fileName: 'nzlum-pilot-land-use-map-methodology-2025.pdf', isNewAddition: false,
    title: 'Towards consistent land-use and management mapping: methodology and gap analysis for a pilot land-use map', creator: 'Richard Law, Simon Planzer, James Ardo and Stella Belliss', year: '2025', date: 'June 2025 · Manaaki Whenua contract report LC4620',
    kind: 'Research report', topic: 'National land-use mapping and data quality',
    summary: 'Documents a pilot national land-use map built from public datasets, its validation and the gaps that limit present coverage and accuracy.',
    sourceName: 'Manaaki Whenua – Landcare Research · NZLUM', sourceUrl: 'https://nzlum.landcareresearch.co.nz/reference/documents/', sourceLabel: 'NZLUM documents and licence',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Law et al. (2025), Manaaki Whenua contract report LC4620. NZLUM documentation, CC BY 4.0.',
    themeIds: ['open-practice'], keywords: ['NZLUM', 'national mapping', 'land use', 'validation', 'data gaps']
  }),

  // Six archival PDFs supplied for this site and published with contributor permission.
  hosted({
    slug: 'geospatial-data-standards-2009', fileName: 'geospatial-data-standards-project-report-2009.pdf', isNewAddition: false,
    title: 'Geospatial Data Standards Project: a role for government in the coordination of geospatial data standards', creator: 'Sarah Mehrtens · New Zealand Geospatial Office', year: '2009', date: '25 May 2009',
    kind: 'Government research report', topic: 'Geospatial data standards and coordination',
    summary: 'A report to the Geospatial Executives Group on how government could coordinate geospatial data standards across New Zealand.',
    sourceName: 'Contributor-supplied archival copy', sourceUrl: null, sourceLabel: null,
    license: 'Contributor-granted permission to host this archival copy; no open licence asserted.', licenseUrl: null, attribution: 'Sarah Mehrtens, New Zealand Geospatial Office (2009). Original rights and any third-party credits remain with their holders.',
    provenance: 'Copy supplied for this site and publication expressly authorised by the contributor on 17 October 2026.',
    themeIds: ['open-practice', 'profession'], keywords: ['geospatial standards', 'government', 'coordination', 'New Zealand Geospatial Office']
  }),
  hosted({
    slug: 'maori-land-spatial-dataset-factsheet-2017', fileName: 'maori-land-spatial-dataset-factsheet-2017.pdf', isNewAddition: false,
    title: 'Māori Land Spatial Dataset: factsheet', creator: 'Māori Land Court and Ministry for Primary Industries', year: '2017', date: '31 May 2017',
    kind: 'Government factsheet', topic: 'Māori land spatial data and reuse',
    summary: 'Explains the Māori Land Spatial Dataset release, its data description and methods, and the associated Creative Commons reuse licence.',
    sourceName: 'Māori Land Court · contributor-supplied archival copy', sourceUrl: 'https://maorilandcourt.govt.nz/your-maori-land/maori-land-data-service/#spatial-data', sourceLabel: 'Official source and dataset details',
    license: ccBy4, licenseUrl: ccBy4Url, attribution: 'Māori Land Court and Ministry for Primary Industries. Crown copyright; CC BY 4.0.',
    provenance: 'Archival copy supplied for this site; source document itself states CC BY 4.0.',
    themeIds: ['maori-gis', 'open-practice'], keywords: ['Māori land', 'spatial dataset', 'Māori Land Court', 'Ministry for Primary Industries', 'GIS']
  }),
  hosted({
    slug: 'maori-gis-conference-programme-2010', fileName: 'maori-gis-conference-programme-2010.pdf', isNewAddition: false,
    title: 'Māori GIS Conference 2010: programme', creator: 'Te Kāhui Manu Hōkai · conference organisers', year: '2010', date: '22–23 September 2010',
    kind: 'Conference programme', topic: 'Māori GIS practice and community',
    summary: 'Programme for the Māori GIS Conference held at GNS Avalon in Lower Hutt, including sessions and presenters from the geospatial community.',
    sourceName: 'Contributor-supplied archival copy', sourceUrl: null, sourceLabel: null,
    license: 'Contributor-granted permission to host this archival copy; no open licence asserted.', licenseUrl: null, attribution: 'Te Kāhui Manu Hōkai and the 2010 conference organisers. Original rights remain with the stated authors and organisers.',
    provenance: 'Copy supplied for this site and publication expressly authorised by the contributor on 17 October 2026.',
    themeIds: ['maori-gis', 'profession'], keywords: ['Māori GIS', 'conference', 'Te Kāhui Manu Hōkai', 'GNS', 'programme']
  }),
  hosted({
    slug: 'national-maori-gis-conference-2012', fileName: 'maori-gis-conference-programme-2012.pdf', isNewAddition: false,
    title: 'National Māori GIS Conference 2012: programme', creator: 'Te Kāhui Manu Hōkai · National Māori GIS Association', year: '2012', date: '9–11 May 2012',
    kind: 'Conference programme', topic: 'Māori GIS practice and community',
    summary: 'Programme for the 2012 National Māori GIS Conference in Rotorua, documenting the conference sessions and participating community.',
    sourceName: 'Contributor-supplied archival copy', sourceUrl: null, sourceLabel: null,
    license: 'Contributor-granted permission to host this archival copy; no open licence asserted.', licenseUrl: null, attribution: 'Te Kāhui Manu Hōkai / National Māori GIS Association and the 2012 conference organisers. Original rights remain with the stated authors and organisers.',
    provenance: 'Copy supplied for this site and publication expressly authorised by the contributor on 17 October 2026.',
    themeIds: ['maori-gis', 'profession'], keywords: ['Māori GIS', 'conference', 'Rotorua', 'Te Kāhui Manu Hōkai', 'programme']
  }),
  hosted({
    slug: 'free-gis-place-2013', fileName: 'free-gis-2013.pdf', isNewAddition: false,
    title: 'Just GIS me the Free Stuff: PLACE 2013 presentation', creator: 'Duane Wilkins', year: '2013', date: '2013 · PLACE conference, Auckland',
    kind: 'Conference presentation', topic: 'Free and open GIS software, data and services',
    summary: 'A presentation and resource list prepared for PLACE 2013, collecting free GIS software, data, Māori interests and online resources for participants.',
    sourceName: 'Contributor-supplied archival copy · PLACE 2013', sourceUrl: null, sourceLabel: null,
    license: 'Contributor-granted permission to host this archival copy; no open licence asserted.', licenseUrl: null, attribution: 'Duane Wilkins (2013), PLACE conference presentation. Original rights remain with the author and credited third parties.',
    provenance: 'Copy supplied for this site and publication expressly authorised by the contributor on 17 October 2026.',
    themeIds: ['open-practice', 'profession', 'maori-gis'], keywords: ['free GIS', 'open data', 'PLACE 2013', 'software', 'Māori interests']
  }),
  hosted({
    slug: 'gis-upskilling-future-2021', fileName: 'gis-upskilling-for-the-future-2021.pdf', isNewAddition: false,
    title: 'GIS – Upskilling for the Future', creator: 'Duane Wilkins', year: '2021', date: 'March 2021 · Surveying + Spatial magazine issue 104',
    kind: 'Magazine article', topic: 'GIS skills and professional development',
    summary: 'An article on the GIS skills and professional development needed as geospatial tools, data and work practices continue to change.',
    sourceName: 'Contributor-supplied archival copy · Surveying + Spatial', sourceUrl: null, sourceLabel: null,
    license: 'Contributor-granted permission to host this archival copy; no open licence asserted.', licenseUrl: null, attribution: 'Duane Wilkins (2021), Surveying + Spatial, issue 104. Original rights remain with the author, publisher and credited third parties.',
    provenance: 'Copy supplied for this site and publication expressly authorised by the contributor on 17 October 2026.',
    themeIds: ['profession'], keywords: ['GIS', 'skills', 'upskilling', 'Surveying + Spatial', 'professional development']
  }),
].concat(geodeticPdfPublications.map(hosted),linzHistoricalReports.map(hosted),pre2000PdfPublications.map(hosted),magazinePdfPublications.map(hosted),verifiedNzGis20261030.map(hosted));
