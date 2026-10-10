/**
 * Curated documentary-media relationships for themes and non-person entries.
 * These reference existing, individually credited images from src/content/images.
 * They do not assert that a map/photograph depicts the organisation performing the
 * historical GIS work. Do not auto-populate Person profiles or infer associations
 * from record names, shared geography, or a generic image category.
 */
export const subjectMedia = Object.freeze({
  themes: {
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
    'auckland-council': {
      slug: 'auckland-osm-colour-2018',
      relation: 'An independently produced map of Auckland. It provides geographic context but is not an Auckland Council GeoMaps or GFMO screenshot.'
    },
    'christchurch-city-council': {
      slug: 'victoria-square-aerial-1955',
      relation: 'Historical aerial imagery of central Christchurch later made available through council mapping services. It does not depict the council GIS team.'
    },
    'hutt-city-council': {
      slug: 'petone-lower-hutt-survey-1909',
      relation: 'A 1909 survey map covering Petone and Lower Hutt, the geographic area administered by Hutt City Council today; predates council GIS.'
    },
    'wellington-city-council': {
      slug: 'wrights-hill-1945',
      relation: 'A 1945 aerial survey photograph of the Wellington area. It is geographic context, not a Wellington City Council software screen.'
    },
    'canterbury-regional-council-environment-canterbury': {
      slug: 'canterbury-wilding-pines',
      relation: 'A photograph of wilding pines in Canterbury, illustrating a regional land-management challenge. It is not a council GIS map or software screen.'
    }
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
  const binding=subjectMedia.records[record.slug];
  if(!binding)return null;
  const image=images.find(image=>image.slug===binding.slug);
  return image?{image,relation:binding.relation}:null;
}
