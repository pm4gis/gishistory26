import {datasetCardSelections} from './dataset-card-media.mjs';
/**
 * Curated documentary-media relationships for themes and non-person entries.
 * These reference existing, individually credited images from src/content/images.
 * They do not assert that a map/photograph depicts the organisation performing the
 * historical GIS work. Do not auto-populate Person profiles or infer associations
 * from record names, shared geography, or a generic image category.
 */
export const subjectMedia = Object.freeze({
  themes: {
    'maori-gis': {slug:'ngai-tahu-takiwa-map-2010',relation:'A real GIS-produced map of the territory recognised as Ngāi Tahu takiwā, created in 2010 by Commons contributor Igover. The map is not the later Kā Huru Manu atlas or an iwi-endorsed boundary determination.'},
    'cadastre': {
      slug: 'new-river-cadastre-1898',
      relation: 'Historic cadastral survey records are the starting point of this theme. This sheet is not an early Landonline screenshot.'
    },
    'imagery': {
      slug: 'wrights-hill-1945',
      relation: 'A genuine New Zealand aerial survey photograph, illustrating the imagery that preceded modern digital orthophotography.'
    },
    'local-government': {
      slug: 'linz-landonline-territorial-authority-2025',
      relation: 'A current territorial-authority spatial-information interface, illustrating the information councils work with. It is not a 1980s council GIS system.'
    },
    'open-practice': {
      slug: 'linz-wmts-qgis-data-view',
      relation: 'Public spatial data delivered into QGIS through LINZ map services. This screen is later than the earliest open-data initiatives.'
    },
    'profession': {
      slug: 'linz-arcmap-property-relationships-2016',
      relation: 'An authentic GIS analysis interface, illustrating professional spatial data work rather than a particular conference or practitioner.'
    },
    'technology-stack': {
      slug: 'linz-wfs-attribute-service-2023',
      relation: 'A real standardised spatial-data service, one part of the progression towards connected GIS platforms.'
    }
  },
  records: {
    'maori-land-court': {slug:'maori-land-court-minute-books-2013',relation:'Māori Land Court minute books documented by Archives New Zealand in 2013, illustrating the historical records that underpin later digitisation and land information services; not a GIS application screen.'},
    'te-runanga-o-ngai-tahu-ngai-tahu-archive': {slug:'maori-south-island-sketch-1841',relation:'An early nineteenth-century map based on an unidentified Ngāi Tahu/Kāi Tahu sketch, transcribed through colonial mapping. Historical context, not a Kā Huru Manu GIS map or an image produced by the contemporary Ngāi Tahu Archive.'},
    'niwa': {slug:'niwa-rv-tangaroa-2010',relation:'NIWA research vessel Tangaroa photographed for NIWA by Dave Allen, an institutional research platform; not a screenshot of NIWA GIS, bathymetry or DASmap.'},
    'university-of-otago': {slug:'otago-registry-2009',relation:'The University of Otago Registry Building in 2009, institutional context for GIS teaching and research rather than a photograph of a GIS laboratory.'},
    'university-of-auckland': {slug:'auckland-university-clocktower-2004',relation:'University of Auckland Clock Tower in December 2004, institutional context rather than a photograph of an early GIS teaching workstation.'},
    'victoria-university-of-wellington': {slug:'victoria-rutherford-2025',relation:'Te Herenga Waka—Victoria University of Wellington bilingual signage on Rutherford House, photographed in 2025; not an image of its GIS teaching facilities.'},
    // Central government, research, companies.
    'land-information-new-zealand-linz': {
      slug: 'linz-landonline-survey-work-2025',
      relation: 'Landonline Web Search produced by LINZ in 2025; an example of one LINZ service, not its 1996 launch.'
    },
    'stats-nz': {
      slug: 'nz-census-density-2023',
      relation: 'A population-density map based on Stats NZ 2023 Census information, produced by an independent cartographer using QGIS.'
    },
    'nz-transport-agency-waka-kotahi': {
      slug: 'auckland-region-transport-2014',
      relation: 'A map of road hierarchy across Auckland, illustrating the transport networks analysed with GIS. It is not an NZ Transport Agency product.'
    },
    'bay-of-plenty-regional-council': {
      slug: 'rotoiti-bathymetry-2021',
      relation: 'GNS Science bathymetry of Lake Rotoiti in the Bay of Plenty. It illustrates regional scientific spatial data, not a Bay of Plenty Regional Council project.'
    },
    'department-of-conservation': {
      slug: 'ecoregions-qgis-2025',
      relation: 'A QGIS map of ecological regions. It illustrates the type of geographic information used in conservation, but is not a DOC system screenshot.'
    },
    'gns-science': {
      slug: 'qmap-christchurch-2008',
      relation: 'An actual GNS Science QMAP geological map, compiled in 2008.'
    },
    'eagle-technology': {
      slug: 'nz-dem-arcgis-2006',
      relation: 'Digital elevation mapping created with ArcGIS 9.1; an illustration of the Esri software family represented by Eagle, not an Eagle-produced map.'
    },
    'aerial-surveys': {
      slug: 'southland-aerial-verdon-1988',
      relation: 'A genuine historic New Zealand aerial photograph. It illustrates aerial survey inputs rather than documenting an Aerial Surveys project.'
    },
    // Local government: prefer an image of the authority's geography or mapping.
    'auckland-regional-council': {
      slug: 'arc-pitt-street-2007',
      relation: 'The former Auckland Regional Council offices on Pitt Street, photographed in January 2007; not an image of a council GIS application.'
    },
    'upper-hutt-city-council': {
      slug: 'upper-hutt-civic-centre-2005',
      relation: 'Upper Hutt City Council administration building and council chambers in 2005, two years after XPLORER launched; not a screenshot of that service.'
    },
    'auckland-council': {
      slug: 'auckland-osm-colour-2018',
      relation: 'An independently produced map of Auckland. It provides geographic context but is not an Auckland Council GeoMaps or GFMO screenshot.'
    },
    'christchurch-city-council': {
      slug: 'christchurch-civic-offices-2019',
      relation: 'Photograph of Christchurch City Council offices in 2019, after the city had adopted GIS and following the earthquakes; the photograph does not depict software.'
    },
    'hutt-city-council': {
      slug: 'lower-hutt-civic-centre-2021',
      relation: 'The Lower Hutt Town Hall and council administration building in September 2021; this is an institutional portrait, not a council GIS map.'
    },
    'wellington-city-council': {
      slug: 'wrights-hill-1945',
      relation: 'A 1945 aerial survey photograph of the Wellington area. It is geographic context, not a Wellington City Council software screen.'
    },
    'canterbury-regional-council-environment-canterbury': {
      slug: 'canterbury-wilding-pines',
      relation: 'A photograph of wilding pines in Canterbury, illustrating a regional land-management challenge. It is not a council GIS map or software screen.'
    },
    // Reviewed documentary associations, October 2026. Sources and limitations: docs/media/catalogue-curation-25-20261015.md
    'department-of-lands-and-survey': {slug:'clutha-molyneux-nzms13-1955',relation:"A 1955 survey-district map credited to the Department of Lands and Survey, an original output of the department’s paper mapping programme, not a computer-produced map."},
    'department-of-survey-and-land-information-dosli': {slug:'north-island-counties-districts-1981',relation:"A 1981 Lands and Survey administrative map from DOSLI’s predecessor. The sheet predates DOSLI’s 1987 establishment and is not a DOSLI system screenshot."},
    'new-zealand-aerial-mapping': {slug:'christchurch-response-orthophoto-2011',relation:"Aerial orthophotography captured by New Zealand Aerial Mapping for the Christchurch Response Centre in February 2011; a documented company image product."},
    'environment-southland-southland-regional-council': {slug:'southland-aerial-verdon-1988',relation:"A 1988 Invercargill aerial survey image credited to Southland Regional Council via LINZ, illustrating the regional imagery archive; not a Topoclimate South map."},
    'new-zealand-geographic-board': {slug:'ongaonga-linz-topo50-2020',relation:"An actual LINZ Topo50 sheet with geographical names, illustrating an official mapping context for the Geographic Board’s naming work; not a Gazetteer screen."},
    'canterbury-earthquake-recovery-authority-cera': {slug:'cera-central-recovery-blueprint-2012',relation:'A genuine CERA-produced July 2012 Christchurch Central Recovery Plan map showing designated anchor-project precincts. This is a spatial planning output, not a screenshot of the CERA data-sharing platform or technical land-zoning system.'},
    'geographx': {slug:'ruapehu-3d-2002',relation:"NASA’s authentic 2002 Ruapehu terrain visualisation illustrates the 3D cartography field in which Geographx worked. It is NASA work, not an image made by Geographx."},
    'manaaki-whenua-landcare-research': {slug:'nz-agricultural-landuse-capability-2022',relation:"An independently published 2022 map using New Zealand Land Use Capability, LUCAS and AgriBase inputs. It illustrates downstream land-resource data use, not a Landcare-produced map."},
    'ministry-for-primary-industries': {slug:'pukeora-commercial-pine-plantation-2018',relation:"A documented 2018 Hawke’s Bay commercial plantation illustrates a primary-industry landscape. It does not depict MPI’s biosecurity GIS or Survey123 programme."},
    'new-zealand-forest-service': {slug:'pukeora-commercial-pine-plantation-2018',relation:"A real commercial radiata-pine plantation photographed in 2018. The image illustrates forest-management geography decades after the Forest Service ceased; it is not an agency inventory product."},
    'hawke-s-bay-regional-council': {slug:'gabrielle-sentinel-flooding-napier-2023',relation:"Processed Copernicus Sentinel imagery shows February 2023 flood extent near Napier, relevant to regional hazard work. It is an independent satellite analysis, not a council-issued GIS map."},
    'otago-regional-council': {slug:'doc-aerial-c24a085218be4824',relation:"An attributable 2005 aerial photograph of the Waitaki River and Benmore Dam in Otago, illustrating regional river and infrastructure geography; not an Otago Regional Council product."},
    'gisborne-district-council': {slug:'gisborne-east-coast-luc-map-1967',relation:"The original 1967 Gisborne–East Coast LUC sheet provides a documented predecessor to the 1990s council–Landcare second-edition inventory work. The 1967 sheet is not council-produced."},
    'ministry-for-the-environment': {slug:'ecoregions-qgis-2025',relation:"An independent 2025 QGIS ecoregion map illustrates environmental classification, a related field to LENZ. It is neither a LENZ atlas sheet nor a Ministry-produced map."},
    'kapiti-coast-district-council': {slug:'kapiti-island-lidar-2024',relation:"A genuine LiDAR-derived depiction of Kāpiti Island terrain in 2024. It illustrates the district’s geographical setting but is not a council GIS or LIM application screenshot."},
  }
});
export function pickThemeImage(slug,images) {
  const binding=subjectMedia.themes[slug];
  if(!binding)return null;
  const image=images.find(image=>image.slug===binding.slug);
  return image?{image,relation:binding.relation}:null;
}
export function pickRecordImage(record,images) {
  if(!record || record.kind==='Person' || record.kind==='Story')return null;
  const selection=record.kind==='Dataset'?datasetCardSelections[record.slug]:null;
  const binding=subjectMedia.records[record.slug]||(selection?{slug:selection.imageSlug,relation:selection.note}:null);
  if(!binding)return null;
  const image=images.find(image=>image.slug===binding.slug);
  return image?{image,relation:binding.relation}:null;
}
