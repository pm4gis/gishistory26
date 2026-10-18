import {magazinePdfPublications} from './magazine-pdf-publications-20261018.mjs';
// Reviewed chapter associations. Show a publication only when its original file was archived.
export const regionalGisChapterMap = {
  "doc-gis-wildlife-penguins-2008": [
    "conservation-and-environment",
    "science-goes-spatial"
  ],
  "doc-stoat-rat-modelling-2008": [
    "conservation-and-environment"
  ],
  "doc-archaeological-prediction-2004": [
    "conservation-and-environment",
    "mapping-land-as-data"
  ],
  "doc-mapping-biodiversity-heritage-2016": [
    "conservation-and-environment"
  ],
  "doc-sand-dune-drone-2019": [
    "mapping-from-a-drone",
    "conservation-and-environment"
  ],
  "doc-wilding-conifer-remote-sensing-2020": [
    "earth-observation-becomes-routine",
    "conservation-and-environment"
  ],
  "doc-benthic-terrain-modeller-2022": [
    "from-flat-maps-to-3d",
    "science-goes-spatial"
  ],
  "mfe-plan-mapping-standards-2017": [
    "councils-build-corporate-gis",
    "the-map-becomes-an-application"
  ],
  "mfe-electronic-planning-maps-2018": [
    "councils-build-corporate-gis",
    "the-map-becomes-an-application"
  ],
  "mfe-maori-catchment-geospatial-2019": [
    "conservation-and-environment",
    "gis-inside-government"
  ],
  "mfe-landuse-high-risk-gis-2019": [
    "conservation-and-environment",
    "science-goes-spatial"
  ],
  "mfe-mahinga-kai-spatial-2022": [
    "conservation-and-environment"
  ],
  "mfe-sheep-beef-emissions-gis-2021": [
    "conservation-and-environment",
    "science-goes-spatial"
  ],
  "mfe-national-productive-land-2022": [
    "councils-build-corporate-gis"
  ],
  "mfe-national-gis-landuse-2016": [
    "science-goes-spatial"
  ],
  "gw-wellington-landscape-atlas-2009": [
    "councils-build-corporate-gis"
  ],
  "gw-hutt-landscape-study-2012": [
    "councils-build-corporate-gis"
  ],
  "gw-kapiti-whaitua-gis-2024": [
    "conservation-and-environment",
    "councils-build-corporate-gis"
  ],
  "boprc-gis-annual-report-2015": [
    "councils-build-corporate-gis"
  ],
  "doc-coastal-flood-risk-gis-2019": [
    "conservation-and-environment",
    "from-flat-maps-to-3d"
  ],
  "doc-wellington-wetlands-lcdb2-2013": [
    "conservation-and-environment",
    "earth-observation-becomes-routine"
  ],
  "doc-maui-dolphin-distribution-2010": [
    "conservation-and-environment"
  ],
  "doc-marine-ecosystem-gis-2014": [
    "conservation-and-environment",
    "science-goes-spatial"
  ],
  "doc-marine-areas-gis-statistic-2021": [
    "conservation-and-environment",
    "rebuilding-the-coordinate-framework"
  ],
  "doc-southeast-marine-spatial-2018": [
    "conservation-and-environment",
    "from-flat-maps-to-3d"
  ],
  "doc-whanganui-fish-barriers-2021": [
    "conservation-and-environment",
    "mapping-leaves-the-office"
  ],
  "doc-coastal-vehicle-spatial-survey-2022": [
    "conservation-and-environment",
    "mapping-from-a-drone"
  ],
  "doc-visitor-conservation-bibliography-2011": [
    "conservation-and-environment",
    "science-goes-spatial"
  ],
  "doc-conservation-carbon-spatial-models-2012": [
    "conservation-and-environment",
    "science-goes-spatial"
  ],
  "doc-ecological-significance-gis-2016": [
    "conservation-and-environment"
  ]
};
export function regionalGisChapterPublications(articleSlug){
 return magazinePdfPublications
  .filter(p=>p.hostedLocally&&regionalGisChapterMap[p.slug]?.includes(articleSlug))
  .sort((a,b)=>a.year.localeCompare(b.year)||a.title.localeCompare(b.title,'en-NZ'))
  .map(p=>({slug:p.slug,title:p.title,year:p.year,url:'/publications/pdf/'+p.slug+'/'}));
}
