export const MEDIA_CUTOFF_DATE = '2025-12-31';

export const chapterImagePlacements = {
  "auckland-osm-bw-2018": "the-map-becomes-an-application-71de0c0d83",
  "auckland-osm-colour-2018": "a-community-large-enough-to-host-the-world-aa98df6e0c",
  "auckland-region-transport-2014": "roads-and-addresses-a972171969",
  "brees-surveyors-porirua-1840s": "people-between-the-field-book-and-the-machine-0c07b0b289",
  "canterbury-seismic-hazard-2010": "canterbury-exposes-the-gaps-617f32c44a",
  "canterbury-wilding-pines": "photographs-into-forest-data-5f74d8d0d8",
  "christchurch-orion-quake-2011": "imagery-after-the-ground-changes-3eae32241d",
  "christchurch-quake-shaking-2011": "emergency-mapping-products-0573ede669",
  "christchurch-response-orthophoto-2011": "imagery-after-the-ground-changes-3eae32241d",
  "clutha-molyneux-nzms13-1955": "digitising-map-sheets-5966de2c1f",
  "ecoregions-qgis-2025": "conservation-gis-beyond-government-611e7efe0e",
  "fiordland-nasa-earthquake-2009": "geonet-normalises-the-live-map-1f0c613fc3",
  "gabrielle-nasa-modis-2023": "finding-the-usable-observation-d9d482336e",
  "gabrielle-sentinel-flooding-napier-2023": "cyclone-gabrielle-b274c9f004",
  "geonet-kaikoura-felt-2016": "incident-geography-and-emergency-response-a74e7647c8",
  "greendale-fault-rupture-2010": "imagery-after-the-ground-changes-3eae32241d",
  "hector-geological-map-1884": "thematic-geography-899fa91ade",
  "kaikoura-shakemap-2016": "kaikoura-moves-the-map-again-e2a0d99be5",
  "kapiti-island-lidar-2024": "open-elevation-997878372e",
  "kiwirail-passenger-network-map": "network-connections-aa605f56a3",
  "landsat-christchurch-2001": "land-cover-through-time-b4b26dba97",
  "linz-arcmap-property-relationships-2016": "formats-become-everyday-infrastructure-29f24fa21a",
  "linz-landonline-survey-work-2025": "a-national-utility-226b4cfcfc",
  "linz-landonline-territorial-authority-2025": "routine-government-use-981b72aea2",
  "linz-positionz-2018": "corrections-are-infrastructure-a77896ba7d",
  "linz-wfs-attribute-service-2023": "types-of-service-d251b21eed",
  "linz-wmts-qgis-connection": "routine-data-exchange-6d5fdad9a2",
  "linz-wmts-qgis-data-view": "the-linz-data-service-51393f242c",
  "masterton-earthquake-fault-map-1942": "paper-still-works-074b2d23dc",
  "nasa-world-wind-napier-2006": "a-globe-on-the-desktop-fe3c526a67",
  "nema-tsunami-forecast-2021": "incident-geography-and-emergency-response-a74e7647c8",
  "new-river-cadastre-1898": "the-parcel-record-67bf38bca3",
  "nz-census-density-2023": "using-census-data-f2e8d11365",
  "nz-dem-arcgis-2006": "terrain-becomes-data-44fef5297f",
  "nz-geology-lange-2012": "rebuilding-the-geological-map-94bf81a964",
  "ongaonga-linz-topo50-2020": "the-topo50-release-6ca71b18e1",
  "petone-lower-hutt-survey-1909": "geodetic-adjustment-d29b3d5200",
  "qmap-christchurch-2008": "field-geology-into-digital-production-f9f05acb91",
  "riverhead-geodetic-mark-2025": "from-marks-to-active-control-1a47aa28cd",
  "rotoiti-bathymetry-2021": "catchment-monitoring-7b174cd504",
  "ruapehu-3d-2002": "visualisation-and-modelling-f305bc5792",
  "ruapehu-theodolite-1988": "scientific-map-records-7021842bb3",
  "southland-aerial-verdon-1988": "from-imagery-to-mapped-data-0c61026266",
  "tripp-station-theodolite-surveyors": "surveying-and-mapping-by-1966-8de87e20d6",
  "tuki-map-1793-1798": "existing-map-records-0170b9d0d6",
  "victoria-square-aerial-1955": "maps-from-all-over-council-9ef0acf90d",
  "waikaka-cadastre-1888": "cadastral-linework-573557de34",
  "wrights-hill-1945": "a-photograph-you-can-measure-72c979d587"
};

const ISO_DATE = /^\\d{4}-\\d{2}-\\d{2}$/;
const FUTURE_YEAR = /\\b20(?:2[6-9]|[3-9]\\d)\\b/;

export function isWithinMediaCutoff(image) {
  if (image?.subjectDateEnd) {
    return ISO_DATE.test(image.subjectDateEnd) && image.subjectDateEnd <= MEDIA_CUTOFF_DATE;
  }
  const knownDates = [image?.dateDisplay, image?.title, image?.caption, image?.context].filter(Boolean).join(' ');
  return !FUTURE_YEAR.test(knownDates);
}

export function hasExplicitCutoffDate(image) {
  return Boolean(image?.subjectDateEnd && ISO_DATE.test(image.subjectDateEnd) && image.subjectDateEnd <= MEDIA_CUTOFF_DATE);
}

export function imagesForPassage(images = [], article, passage) {
  if (!article?.slug || !passage?.slug) return [];
  return images.filter((image) =>
    image.articleSlug === article.slug &&
    (image.passageSlug || chapterImagePlacements[image.slug]) === passage.slug &&
    isWithinMediaCutoff(image)
  );
}
