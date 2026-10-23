/**
 * Official agency source pages retained as provenance for the historical dataset catalogue.
 * Product links point to publisher records, services or map tools; public historical
 * coverage remains anchored at 31 December 2025. Preview images come from the product
 * or its official guide, never generic placeholders.
 */
const koordinatesPreview=(layer,style,size='600x400')=>
 `https://tiles-cdn.koordinates.com/services/tiles/v4/thumbnail/layer=${layer}.${style},style=auto/${size}.png`;

const catalogueItem=(item)=>Object.freeze({
 ...item,
 searchText:[item.name,item.description,item.agencyLabel,item.kind,...(item.keywords||[])].join(' ').toLocaleLowerCase('en-NZ')
});

const linz=(slug,name,description,layer,style,imageAlt,options={})=>catalogueItem({
 id:`linz-${slug}`,agency:'linz',agencyLabel:'LINZ',name,
 url:options.url||`https://data.linz.govt.nz/layer/${slug}/`,
 description,kind:options.kind||'Dataset',
 imageUrl:koordinatesPreview(layer,style,options.imageSize||'600x400'),
 imageAlt,imageCredit:'Land Information New Zealand / LINZ Data Service',
 imageSourceUrl:options.imageSourceUrl||options.url||`https://data.linz.govt.nz/layer/${slug}/`,
 keywords:options.keywords||[]
});

const mfe=(slug,name,description,layer,style,imageAlt)=>catalogueItem({
 id:`mfe-${slug}`,agency:'mfe',agencyLabel:'Ministry for the Environment (MfE)',name,
 url:`https://data.mfe.govt.nz/layer/${slug}/`,description,kind:'Dataset',
 imageUrl:koordinatesPreview(layer,style,'1200x630'),imageAlt,
 imageCredit:'Ministry for the Environment / MfE Data Service',
 imageSourceUrl:`https://data.mfe.govt.nz/layer/${slug}/`,keywords:['environment','mfe']
});

const stats=(slug,name,description,layer,style,imageAlt)=>catalogueItem({
 id:`stats-${slug}`,agency:'stats-nz',agencyLabel:'Stats NZ',name,
 url:`https://datafinder.stats.govt.nz/layer/${slug}/`,description,kind:'Dataset',
 imageUrl:koordinatesPreview(layer,style,'600x400'),imageAlt,
 imageCredit:'Stats NZ Datafinder',imageSourceUrl:`https://datafinder.stats.govt.nz/layer/${slug}/`,
 keywords:['statistics','geography','stats nz']
});

export const datasetSourceCatalogue=Object.freeze([
 // LINZ source records are grouped with related cadastral and map-series histories.
 linz('50772-nz-primary-parcels','NZ Primary Parcels','National primary parcel polygons with legal descriptions, purpose, area and title references.',50772,452980,'LINZ map preview of New Zealand primary parcel polygons.',{keywords:['cadastre','land parcels']}),
 linz('50804-nz-property-titles','NZ Property Titles','Spatial title polygons linked to one or more primary parcels; ownership details are excluded from this public layer.',50804,452981,'LINZ map preview of property title polygons.',{keywords:['cadastre','titles','property']}),
 linz('122657-nz-property-boundaries','NZ Property Boundaries','A combined representation of property boundaries using rating units, titles and parcels.',122657,453156,'LINZ map preview of nationwide property boundaries.',{keywords:['cadastre','property']}),
 linz('101290-nz-building-outlines','NZ Building Outlines','Roof outlines classified from LINZ aerial imagery, with coverage and image dates varying by region.',101290,443726,'LINZ map preview of mapped building outlines.',{keywords:['buildings','aerial']}),
 linz('51153-nz-coastlines-and-islands-polygons-topo-150k','NZ Coastlines and Islands Polygons (Topo 1:50k)','A combined coastline and islands polygon layer based on LINZ Topo50 products.',51153,452059,'LINZ map preview of the New Zealand coastline and islands.',{keywords:['coast','islands','topographic']}),
 linz('50798-nz-topo250-maps','NZ Topo250 georeferenced map sheets','Georeferenced 1:250,000 topographic map images for New Zealand and the Chatham Islands.',50798,420731,'LINZ map preview of a NZ Topo250 georeferenced map sheet.',{keywords:['topographic','raster maps']}),
 linz('50182-nz-river-centrelines-topo-1250k','NZ River Centrelines (Topo, 1:250k)','Generalised river centrelines used in the national Topo250 map series.',50182,420710,'LINZ map preview of river centrelines from the Topo250 series.',{keywords:['rivers','hydrography']}),
 linz('123118-christchurch-0075m-urban-aerial-photos-2025','Christchurch 0.075m Urban Aerial Photos (2025)','High-resolution urban aerial photography covering Christchurch in 2025.',123118,429025,'2025 Christchurch urban aerial imagery preview from LINZ.',{url:'https://data.linz.govt.nz/layer/123118-christchurch-0075m-urban-aerial-photos-2025/',imageSize:'1200x630',keywords:['aerial photos','Christchurch']}),
 linz('112254-waikato-03m-rural-aerial-photos-2021-2024','Waikato 0.3m Rural Aerial Photos (2021–2024)','Rural aerial photography for Waikato captured between 2021 and 2024.',112254,409121,'Waikato rural aerial imagery preview from LINZ.',{url:'https://data.linz.govt.nz/layer/112254-waikato-03m-rural-aerial-photos-2021-2024/',imageSize:'1200x630',keywords:['aerial photos','Waikato']}),
 linz('120064-northland-03m-rural-aerial-photos-2023-2025','Northland 0.3m Rural Aerial Photos (2023–2025)','Rural aerial photography for Northland captured between 2023 and 2025.',120064,422764,'Northland rural aerial imagery preview from LINZ.',{url:'https://data.linz.govt.nz/layer/120064-northland-03m-rural-aerial-photos-2023-2025/',imageSize:'1200x630',keywords:['aerial photos','Northland']}),
 linz('121056-canterbury-02m-rural-aerial-photos-2024','Canterbury 0.2m Rural Aerial Photos (2024)','Rural aerial photography for Canterbury captured in 2024.',121056,414156,'Canterbury rural aerial imagery preview from LINZ.',{url:'https://data.linz.govt.nz/layer/121056-canterbury-02m-rural-aerial-photos-2024/',imageSize:'1200x630',keywords:['aerial photos','Canterbury']}),
 linz('123125-new-zealand-10m-satellite-imagery-2024-2025','New Zealand 10m Satellite Imagery (2024–2025)','Seamless 10 metre satellite imagery for the mainland and offshore islands, sourced from 2024–2025 observations.',123125,429081,'Satellite image preview of New Zealand from the LINZ 10m imagery layer.',{url:'https://data.linz.govt.nz/layer/123125-new-zealand-10m-satellite-imagery-2024-2025/',imageSize:'1200x630',keywords:['satellite','imagery']}),
 linz('122156-otago-02m-rural-aerial-photos-2025','Otago 0.2m Rural Aerial Photos (2025)','Rural aerial photography for Otago captured in 2025.',122156,424459,'Otago rural aerial imagery preview from LINZ.',{url:'https://data.linz.govt.nz/layer/122156-otago-02m-rural-aerial-photos-2025/',imageSize:'1200x630',keywords:['aerial photos','Otago']}),
 linz('113172-southland-lidar-1m-dem-2020-2024','Southland LiDAR 1m Digital Elevation Model (2020–2024)','One-metre digital elevation model derived from LiDAR surveys across Southland between 2020 and 2024.',113172,428973,'Southland LiDAR elevation model preview from LINZ.',{url:'https://data.linz.govt.nz/layer/113172-southland-lidar-1m-dem-2020-2024/',imageSize:'1200x630',keywords:['elevation','LiDAR','DEM']}),
 linz('115805-canterbury-selwyn-lidar-1m-dem-2023','Canterbury–Selwyn LiDAR 1m Digital Elevation Model (2023)','One-metre elevation data derived from the 2023 Selwyn LiDAR survey.',115805,397158,'Selwyn LiDAR elevation model preview from LINZ.',{url:'https://data.linz.govt.nz/layer/115805-canterbury-selwyn-lidar-1m-dem-2023/',imageSize:'1200x630',keywords:['elevation','LiDAR','DEM','Selwyn']}),

 // MfE: named layers open their own official data records and preview maps.
 mfe('99776-sea-draining-catchments','Sea-draining Catchments','Catchments that drain to the coast, represented as a national spatial layer.',99776,322661,'MfE map preview of New Zealand sea-draining catchments.'),
 mfe('53309-river-flows','River Flows','Mapped river-flow estimates distributed through the MfE Data Service.',53309,152138,'MfE map preview showing river-flow data.'),
 mfe('89421-average-annual-rainfall-19722016','Average Annual Rainfall (1972–2016)','National average annual rainfall surface for the 1972–2016 period.',89421,285660,'MfE map preview of average annual rainfall across New Zealand.'),
 mfe('99909-lucas-nz-forest-clearing-2008-2023-v023','LUCAS NZ Forest Clearing (2008–2023, v023)','Forest-clearing observations and classifications for 2008–2023 in the LUCAS programme.',99909,442034,'MfE map preview of mapped LUCAS forest clearing.'),
 mfe('52677-prediction-of-wetlands-before-humans-arrived','Predicted Wetlands before Human Settlement','A modelled view of wetland extent before human settlement; predictions are not observed historical boundaries.',52677,150158,'MfE map preview of predicted pre-settlement wetland extent.'),
 mfe('120714-freshwater-ecosystems-of-new-zealand-fenz-lakes-november-2024','Freshwater Ecosystems of New Zealand (FENZ) Lakes (November 2024)','Lake classifications from the Freshwater Ecosystems of New Zealand framework, November 2024 edition.',120714,412720,'MfE map preview of mapped FENZ lakes.'),
 mfe('105407-irrigated-land-area-raw-2020-update','Irrigated Land Area (2020 update)','Raw irrigated-land area polygons in the 2020 update.',105407,345575,'MfE map preview of irrigated land areas.'),
 mfe('95561-lake-water-quality-for-swimming-categories-raw-model-output','Lake Water Quality for Swimming Categories','Raw model output classifying lake water quality for swimming categories.',95561,300557,'MfE map preview of modelled lake swimming-water categories.'),
 mfe('52765-indigenous-vegetation-cover-remaining-and-protection-20012012','Indigenous Vegetation Cover Remaining and Protection (2001–2012)','National measures of remaining indigenous vegetation cover and protection for 2001–2012.',52765,150248,'MfE map preview of indigenous vegetation cover and protection.'),
 mfe('53565-nz-coastal-hydrosystems','New Zealand Coastal Hydrosystems','Mapped coastal hydrosystems used to describe connected coastal water environments.',53565,162275,'MfE map preview of New Zealand coastal hydrosystems.'),
 mfe('52760-marine-reserves','Marine Reserves','Marine reserve boundaries represented as a national spatial layer.',52760,150243,'MfE map preview of marine reserve areas.'),
 mfe('52676-current-wetland-extent-2013','Current Wetland Extent (2013)','Mapped wetland extent based on the 2013 national dataset.',52676,150157,'MfE map preview of mapped wetland extent.'),
 mfe('53558-lightning-groundstrikes-by-region','Lightning Ground Strikes by Region','Mapped lightning ground strikes summarised by region.',53558,163021,'MfE map preview of lightning ground strikes by region.'),
 mfe('89422-deforestation-by-territorial-authority-20082014','Deforestation by Territorial Authority (2008–2014)','Deforestation totals represented by territorial authority for 2008–2014.',89422,285661,'MfE map preview of deforestation by territorial authority.'),
 mfe('115979-seasonal-trends-particulate-matter-10-pm10-particulate-matter-25-pm25-nitrogen-dioxide-no2-sulphur-dioxide-so2-carbon-monoxide-co-and-ground-level-ozone-2011-2020','Seasonal Air-Quality Trends (2011–2020)','Seasonal trends for key particulate and gaseous air-quality measures from 2011 to 2020.',115979,398301,'MfE map preview of seasonal air-quality trends.'),

 // Stats NZ: four boundary layers, three population grids, and a census housing table layer.
 stats('120946-regional-council-2025','Regional Council 2025','Regional council boundaries for the 2025 geographic classification.',120946,413431,'Stats NZ map preview of 2025 regional council boundaries.'),
 stats('120978-statistical-area-2-2025','Statistical Area 2 (SA2) 2025','Statistical Area 2 boundaries for the 2025 geographic classification.',120978,413748,'Stats NZ map preview of 2025 Statistical Area 2 boundaries.'),
 stats('120963-territorial-authority-2025','Territorial Authority 2025','Territorial authority boundaries for the 2025 geographic classification.',120963,413724,'Stats NZ map preview of 2025 territorial authority boundaries.'),
 stats('119989-new-zealand-estimated-resident-population-grid-1-kilometre','Estimated Resident Population Grid (1 km)','Estimated resident population represented on a 1 kilometre grid.',119989,446013,'Stats NZ map preview of estimated population on a 1 km grid.'),
 stats('120026-new-zealand-estimated-resident-population-grid-500-metre','Estimated Resident Population Grid (500 m)','Estimated resident population represented on a 500 metre grid.',120026,446011,'Stats NZ map preview of estimated population on a 500 m grid.'),
 stats('119709-new-zealand-estimated-resident-population-grid-250-metre','Estimated Resident Population Grid (250 m)','Estimated resident population represented on a 250 metre grid.',119709,445967,'Stats NZ map preview of estimated population on a 250 m grid.'),
 stats('122391-2023-census-housing-data-by-statistical-area-2','2023 Census Housing Data by SA2','2023 Census housing measures, including dwelling counts and selected housing conditions, by Statistical Area 2.',122391,422255,'Stats NZ map preview of 2023 Census housing measures by SA2.'),

 // MPI: official ArcGIS Open Data catalogue entries with their own product thumbnails.
 catalogueItem({id:'mpi-deepwater-restrictions',agency:'mpi',agencyLabel:'Ministry for Primary Industries (MPI)',name:'PSH Deepwater Restrictions',
  url:'https://data-mpi.opendata.arcgis.com/datasets/MPI::psh-deepwater-restrictions',description:'Spatial restrictions applying to commercial deepwater fishing, with links to the supporting fisheries regulations.',kind:'Dataset',
  imageUrl:'https://www.arcgis.com/sharing/rest/content/items/23535ed3d52a4096b3e3ccee0d694a26/info/thumbnail/ago_downloaded.png?w=500',imageAlt:'MPI map preview outlining the New Zealand areas covered by deepwater fishing restrictions.',imageCredit:'Ministry for Primary Industries Open Data Site',imageSourceUrl:'https://data-mpi.opendata.arcgis.com/datasets/MPI::psh-deepwater-restrictions',keywords:['fisheries','marine','restrictions']}),
 catalogueItem({id:'mpi-shellfish-growing-areas',agency:'mpi',agencyLabel:'Ministry for Primary Industries (MPI)',name:'Shellfish Growing Areas Classified for Harvest',
  url:'https://data-mpi.opendata.arcgis.com/datasets/MPI::shellfish-growing-areas-classified-for-harvest-for-human-consumption',description:'Classified shellfish-growing areas relevant to harvesting shellfish for human consumption.',kind:'Dataset',
  imageUrl:'https://www.arcgis.com/sharing/rest/content/items/e781d10f912846cca6f8b8db53fbb229/info/thumbnail/thumbnail1607980797421.png?w=500',imageAlt:'MPI map preview showing classified shellfish-growing areas along New Zealand’s coast.',imageCredit:'Ministry for Primary Industries Open Data Site',imageSourceUrl:'https://data-mpi.opendata.arcgis.com/datasets/MPI::shellfish-growing-areas-classified-for-harvest-for-human-consumption',keywords:['aquaculture','shellfish','marine']}),

 // MBIE / NZP&M source pages identify map services; the second link opens the map UI.
 catalogueItem({id:'mbie-minerals-permits',agency:'mbie',agencyLabel:'MBIE · New Zealand Petroleum & Minerals',name:'Minerals Permit Layers',
  url:'https://gis.nzpam.govt.nz/server/rest/services/Public/Permits_Minerals_Layers/MapServer',mapUrl:'https://gis.nzpam.govt.nz/permitwebmaps/?commodity=minerals',description:'Official map service for mineral permit applications, active permits, extensions, contest rounds and reserved areas.',kind:'Map service',
  imageUrl:'https://www.nzpam.govt.nz/assets/Uploads/maps-geoscience/Permit-webmaps-user-guide/permit-map-minerals__ScaleMaxWidthWzE3MDBd.png',imageAlt:'NZP&M Minerals Permit Webmap showing permit areas across New Zealand.',imageCredit:'New Zealand Petroleum & Minerals, Permit Webmaps User Guide',imageSourceUrl:'https://www.nzpam.govt.nz/maps-geoscience/permit-webmaps-user-guide',keywords:['minerals','permits','mining','MBIE']}),
 catalogueItem({id:'mbie-petroleum-permits',agency:'mbie',agencyLabel:'MBIE · New Zealand Petroleum & Minerals',name:'Petroleum Permit Layers',
  url:'https://gis.nzpam.govt.nz/server/rest/services/Public/Permits_Petroleum_Layers/MapServer',mapUrl:'https://gis.nzpam.govt.nz/permitwebmaps/?commodity=petroleum',description:'Official map service for petroleum permits, applications and block-offer areas; the map also includes petroleum wells.',kind:'Map service',
  imageUrl:'https://www.nzpam.govt.nz/assets/Uploads/maps-geoscience/Permit-webmaps-user-guide/pop-up-panel__ScaleMaxWidthWzE3MDBd.png',imageAlt:'NZP&M permit map guide screenshot with a selected permit and its mapped information.',imageCredit:'New Zealand Petroleum & Minerals, Permit Webmaps User Guide',imageSourceUrl:'https://www.nzpam.govt.nz/maps-geoscience/permit-webmaps-user-guide',keywords:['petroleum','permits','wells','MBIE']}),

 // TPK: the source is an interactive hazard-data explorer, not a downloadable layer.
 catalogueItem({id:'tpk-climate-hazards-hapori-maori',agency:'tpk',agencyLabel:'Te Puni Kōkiri (TPK)',name:'Climate Hazards for Hapori Māori',
  url:'https://tepunikokiri.github.io/climate_data_tool/',description:'Regional and SA2 maps exploring climate hazards and socio-economic conditions affecting Māori households.',kind:'Interactive map',
  imageUrl:'https://www.tpk.govt.nz/media/image/MediaImages-16387-A/768x1024%2C1/aspect',imageAlt:'Te Puni Kōkiri presenting the Climate Resilience Web App at the 2024 Climate Change and Business Conference; a regional risk map is visible on the screen.',imageCredit:'Te Puni Kōkiri, Climate Change and Business Conference 2024',imageSourceUrl:'https://www.tpk.govt.nz/en/mo-te-puni-kokiri/our-stories-and-media/new-web-app-enhances-climate-resilience-for-hapor4',keywords:['climate','hazards','Māori','resilience']}),

 // NIWA / Earth Sciences NZ freshwater sources use imagery specific to each product.
 catalogueItem({id:'niwa-nrwqn-data',agency:'niwa',agencyLabel:'NIWA / Earth Sciences New Zealand',name:'National River Water Quality Network (NRWQN) Data',
  url:'https://hydrowebportal.niwa.co.nz/',description:'Free water-quality data from the national river monitoring network, including long-running physical, chemical and biological measurements.',kind:'Data portal',
  imageUrl:'https://niwa.co.nz/sites/default/files/sites/default/files/images/0012/110208/NRWQN-monitoring-sites_0.jpg',imageAlt:'NIWA map of National River Water Quality Network monitoring sites.',imageCredit:'NIWA, National River Water Quality Network monitoring-sites map',imageSourceUrl:'https://niwa.co.nz/freshwater/water-quality-monitoring-capabilities',keywords:['freshwater','rivers','water quality','monitoring']}),
 catalogueItem({id:'niwa-river-maps',agency:'niwa',agencyLabel:'NIWA / Earth Sciences New Zealand',name:'NZ River Maps',
  url:'https://shiny.niwa.co.nz/nzrivermaps/',description:'Interactive national maps and summaries for more than 100 predicted freshwater variables, including hydrology, fish, sediment and water quality.',kind:'Interactive map',
  imageUrl:'https://niwa.co.nz/sites/default/files/styles/gallery_wide/public/nzrivermaps_v2_ashley_malf.jpg?itok=95X9y97t',imageAlt:'NIWA NZ River Maps view displaying predicted river-flow information.',imageCredit:'NIWA, NZ River Maps product preview',imageSourceUrl:'https://niwa.co.nz/freshwater/new-zealand-river-maps',keywords:['freshwater','rivers','hydrology','water quality']}),
 catalogueItem({id:'niwa-nzffd',agency:'niwa',agencyLabel:'NIWA / Earth Sciences New Zealand',name:'New Zealand Freshwater Fish Database (NZFFD)',
  url:'https://nzffdms.niwa.co.nz/',description:'Search and download more than 50,000 freshwater fish sampling records, including site location, sampling method and species observations.',kind:'Data portal',
  imageUrl:'https://niwa.co.nz/sites/default/files/styles/wide/public/2024-02/Alpine%20galaxias.jpeg?itok=2H2DL3yW',imageAlt:'NIWA’s 2024 Alpine galaxias distribution map, with observed records clustered across the South Island.',imageCredit:'NIWA / Earth Sciences New Zealand, Alpine galaxias distribution map (2024)',imageSourceUrl:'https://niwa.co.nz/freshwater/nz-freshwater-fish-database/niwa-atlas-nz-freshwater-fishes/alpine-galaxias',keywords:['freshwater','biodiversity','fish','records','species']})
]);

export const datasetSourceAgencies=Object.freeze([
 {id:'linz',label:'LINZ'},
 {id:'mfe',label:'Ministry for the Environment (MfE)'},
 {id:'stats-nz',label:'Stats NZ'},
 {id:'mpi',label:'Ministry for Primary Industries (MPI)'},
 {id:'mbie',label:'MBIE · New Zealand Petroleum & Minerals'},
 {id:'tpk',label:'Te Puni Kōkiri (TPK)'},
 {id:'niwa',label:'NIWA / Earth Sciences New Zealand'}
]);
