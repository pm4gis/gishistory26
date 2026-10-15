/**
 * Curated, previously archived documentary illustrations for the dataset catalogue.
 * Every selection has a narrow source note; the illustrated source must never be
 * presented as if it were a screenshot of the named live dataset.
 * Image credits and licences remain available on the existing image detail pages.
 */
export const datasetCardSelections=Object.freeze({
 'nzlri':{imageSlug:'gisborne-east-coast-luc-map-1967',note:'Historic LUC map, a predecessor to the later national inventory.'},
 'national-luc-2021':{imageSlug:'nz-agricultural-landuse-capability-2022',note:'Related 2022 land-use capability analysis; not a screenshot of the 2021 layer.'},
 'lcdb':{imageSlug:'nasa-terra-modis-nz-2002',note:'Satellite observation used here to illustrate remotely sensed land cover, not an LCDB classification.'},
 'land-environments-nz-2003':{imageSlug:'ecoregions-qgis-2025',note:'Related ecological classification mapping, not a reproduced LENZ map.'},
 'fundamental-soil-layers':{imageSlug:'gisborne-east-coast-luc-map-1967',note:'Historic land-resource mapping associated with the source data lineage.'},
 'national-soils-database':{imageSlug:'gisborne-east-coast-luc-map-1967',note:'Historic mapped land-resource context; the soil-profile collection is separate.'},
 'nzlri-original-worksheets':{imageSlug:'gisborne-east-coast-luc-map-1967',note:'Original regional land-use capability map, related to the survey worksheets.'},
 'digital-cadastral-database':{imageSlug:'new-river-cadastre-1898',note:'Earlier cadastral survey map illustrating the paper records later digitised.'},
 'nztopo50':{imageSlug:'ongaonga-linz-topo50-2020',note:'LINZ Topo50 map as an example of this national topographic series.'},
 'nztopo50-vector':{imageSlug:'ongaonga-linz-topo50-2020',note:'Published Topo50 map rendered from underlying national feature data.'},
 'nztopo50-contours':{imageSlug:'ongaonga-linz-topo50-2020',note:'Topo50 cartography illustrating the mapped contour source.'},
 'nztopo50-roads':{imageSlug:'ongaonga-linz-topo50-2020',note:'Topo50 topographic sheet illustrating its associated road features.'},
 'nztopo250-vector':{imageSlug:'clutha-molyneux-nzms13-1955',note:'Earlier smaller-scale cartographic map; not a current NZTopo250 data extract.'},
 'historic-nz-orthophotos-1994-2006':{imageSlug:'southland-aerial-verdon-1988',note:'An earlier aerial photograph illustrating orthophotography source material.'},
 'nz-primary-parcels':{imageSlug:'linz-landonline-survey-work-2025',note:'Landonline survey interface, illustrating the cadastral source system.'},
 'nz-property-titles':{imageSlug:'linz-arcmap-property-relationships-2016',note:'LINZ ArcMap property relationships, not the current Titles polygon layer.'},
 'nz-property-boundaries':{imageSlug:'linz-arcmap-property-relationships-2016',note:'Related LINZ parcel/title mapping workflow, not the composite property layer.'},
 'nz-building-outlines':{imageSlug:'linz-otago',note:'Aerial photography illustrating the imagery source for roof outlines, not the outlines themselves.'},
 'nz-building-outlines-all-sources':{imageSlug:'victoria-square-aerial-1955',note:'Historic aerial imagery showing the source medium; not an outline-vintage layer.'},
 'nz-8m-dem-geographx-2012':{imageSlug:'nz-dem-arcgis-2006',note:'Different, earlier elevation model; the Geographx 8 m raster is not depicted.'},
 'lucas-land-use-map':{imageSlug:'nz-agricultural-landuse-capability-2022',note:'2022 analysis incorporating LUCAS, LUC and AgriBase inputs.'},
 'nz-addresses-2025':{imageSlug:'auckland-region-transport-2014',note:'Road-network context for address mapping, not national address points.'},
 'niwa-river-environment-classification':{imageSlug:'doc-aerial-c24a085218be4824',note:'Aerial photograph of the Waitaki River, illustrating river geography rather than the REC network.'},
 'gns-digital-qmap':{imageSlug:'qmap-christchurch-2008',note:'Actual digital QMAP geological mapping for Christchurch.'},
 'geographx-natural-colour-basemaps':{imageSlug:'ruapehu-3d-2002',note:'Independent 2002 3D terrain visualisation, not a Geographx commercial basemap.'},
 'geographx-10m-terrain-imagery':{imageSlug:'nz-dem-arcgis-2006',note:'Independent DEM illustration, not a reproduced DOC-hosted Geographx tile or licensed Geographx artwork.'}
});

export function datasetCardImageMap(records,images){
 const bySlug=new Map((images||[]).map(image=>[image.slug,image]));
 return Object.fromEntries((records||[]).map(record=>{
  const chosen=datasetCardSelections[record.slug];
  const image=chosen?bySlug.get(chosen.imageSlug):null;
  if(chosen&&(!image?.assetPath||!image?.altText||!image?.credit||!image?.licence||!image?.sourceUrl)){
   throw new Error('Missing sourced dataset card illustration: '+record.slug+' ('+chosen.imageSlug+')');
  }
  return [record.slug,image?{...image,sourceNote:chosen.note}:null];
 }));
}
