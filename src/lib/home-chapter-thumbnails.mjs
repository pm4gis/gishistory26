import {chapterNavImageMap} from './chapter-nav-media.mjs';

/**
 * Homepage-only contextual thumbnails approved against the chapter subjects.
 * These additions NEVER alter paragraph-reviewed in-story image placements.
 * Explanations identify a later illustration, related discipline, or comparative
 * software where it would otherwise be easy to suggest an inaccurate history.
 * The underlying documentary source, date and attribution remain unchanged.
 */
export const curatedHomepageChapterImages=Object.freeze({
  "coordinates-enter-the-computer": {
    "imageSlug": "tripp-station-theodolite-surveyors",
    "reason": "Historic survey field observations supplied bearings and measurements for later computer calculations.",
    "kind": "photo"
  },
  "drawing-maps-by-machine": {
    "imageSlug": "petone-lower-hutt-survey-1909",
    "reason": "A real pre-computer survey sheet of the paper mapping that digital cartography progressively converted.",
    "kind": "map"
  },
  "turning-the-landscape-into-numbers": {
    "imageSlug": "landsat-christchurch-2001",
    "reason": "Actual Landsat satellite imagery illustrates the remote-sensing data lineage; this 2001 image does not represent the original 1975 Landsat work.",
    "kind": "map"
  },
  "forestry-finds-gis": {
    "imageSlug": "doc-landsat-b68fd62840dccdf1",
    "reason": "Actual satellite view of mapped forest cover on Taranaki, illustrating a later remote-sensing input to forestry mapping rather than an original forestry system.",
    "kind": "map"
  },
  "universities-build-a-field": {
    "imageSlug": "auckland-university-clocktower-2004",
    "reason": "The University of Auckland is specifically discussed as an early New Zealand centre of GIS teaching; the 2004 building photograph is institutional context.",
    "kind": "photo"
  },
  "an-industry-and-community-form": {
    "imageSlug": "intergraph-clix-workstation",
    "reason": "A contemporary GIS workstation illustrates specialist hardware underpinning the early New Zealand software and user community; this is not a photograph of a user-group meeting.",
    "kind": "photo"
  },
  "landonline": {
    "imageSlug": "linz-landonline-survey-work-2025",
    "reason": "Official 2025 Landonline Web Search interface; a later incarnation of the national cadastral service, not its launch screen.",
    "kind": "interface"
  },
  "topography-goes-digital": {
    "imageSlug": "ongaonga-linz-topo50-2020",
    "reason": "An official Topo50 map demonstrates the digital-era topographic product discussed in the chapter, not the first 1977 conversion.",
    "kind": "map"
  },
  "roads-addresses-and-property": {
    "imageSlug": "auckland-region-transport-2014",
    "reason": "Genuine Auckland region road network and route mapping illustrates the linked road geography needed for address systems.",
    "kind": "map"
  },
  "gps-changes-where-here-is": {
    "imageSlug": "linz-positionz-2018",
    "reason": "Official LINZ PositioNZ GNSS reference-network image illustrates the operational positioning systems discussed, rather than the original 1994 GPS field survey.",
    "kind": "map"
  },
  "rebuilding-the-coordinate-framework": {
    "imageSlug": "riverhead-geodetic-mark-2025",
    "reason": "Actual geodetic survey mark illustrating the physical control framework; the mark's datum status has not been verified.",
    "kind": "photo"
  },
  "the-spatial-infrastructure-idea": {
    "imageSlug": "linz-wmts-qgis-connection",
    "reason": "Official LINZ QGIS WMTS connection demonstrates interoperable spatial data infrastructure and services.",
    "kind": "interface"
  },
  "gis-comes-to-the-desktop": {
    "imageSlug": "linz-arcmap-property-relationships-2016",
    "reason": "An authentic desktop ArcMap Identify interface and related New Zealand property tables, illustrating a mature later desktop workflow.",
    "kind": "interface"
  },
  "government-goes-spatial": {
    "imageSlug": "linz-landonline-territorial-authority-2025",
    "reason": "Official LINZ display of territorial-authority spatial boundaries represents inter-agency geographic data sharing in a later service.",
    "kind": "interface"
  },
  "mapping-the-networks": {
    "imageSlug": "kiwirail-passenger-network-map",
    "reason": "A real passenger-rail network map shows geographic network connections as contextual cartography; it is not an electricity, water or telecom utility network.",
    "kind": "map"
  },
  "conservation-and-environment": {
    "imageSlug": "ecoregions-qgis-2025",
    "reason": "A genuine QGIS biogeographic mapping output illustrates ecological region mapping, but does not depict the Department of Conservation's original GIS.",
    "kind": "map"
  },
  "safety-policing-and-emergency-gis": {
    "imageSlug": "nema-tsunami-forecast-2021",
    "reason": "Actual NEMA public-safety tsunami map shows the emergency-mapping strand of the chapter, distinct from police operational GIS.",
    "kind": "map"
  },
  "becoming-a-gis-professional": {
    "imageSlug": "mow-field-trip-gisborne-1971",
    "reason": "Historical Ministry of Works field team photograph illustrates the surveying and engineering professional backgrounds from which GIS practice developed; subjects are not identified as GIS specialists.",
    "kind": "photo"
  },
  "google-changes-the-audience": {
    "imageSlug": "nasa-world-wind-napier-2006",
    "reason": "An authentic New Zealand NASA World Wind digital-globe screen from 2006 provides contemporary digital-globe context; it is expressly not Google Earth.",
    "kind": "interface"
  },
  "open-source-changes-the-tools": {
    "imageSlug": "auckland-osm-colour-2018",
    "reason": "An actual OpenStreetMap community-data cartographic output illustrates New Zealand open mapping contributions, not a first-release open-source GIS screen.",
    "kind": "map"
  },
  "open-data-changes-access": {
    "imageSlug": "linz-wmts-qgis-data-view",
    "reason": "Official LINZ open map tile imagery viewed through QGIS demonstrates publicly accessible national spatial data.",
    "kind": "interface"
  },
  "the-map-becomes-an-application": {
    "imageSlug": "nz-libraries-wikidata-osm-2019",
    "reason": "An actual New Zealand Wikidata-to-OpenStreetMap library mapping application illustrates a browser map built around a task, rather than a general GIS desktop.",
    "kind": "interface"
  },
  "lidar-remakes-the-landscape": {
    "imageSlug": "kapiti-island-lidar-2024",
    "reason": "A documented LiDAR-derived Kāpiti Island terrain map illustrates the mapping product, not the earliest 2003 Christchurch acquisition.",
    "kind": "map"
  },
  "enterprise-gis": {
    "imageSlug": "linz-arcmap-property-relationships-2016",
    "reason": "Official LINZ file-geodatabase table-relationship example illustrates managed enterprise GIS data and relational queries, not a particular corporate deployment.",
    "kind": "interface"
  },
  "cloud-services-and-apis": {
    "imageSlug": "linz-wfs-attribute-service-2023",
    "reason": "Official LINZ Web Feature Service request and response demonstrates spatial data access through a network API.",
    "kind": "interface"
  }
});

/**
 * Existing verified in-chapter associations always win. Remaining homepage
 * cards use the explicit reviewed chapter-level associations above.
 * No generic aerial/map fallback, automatic asset borrowing or generated maps.
 */
export function homepageChapterImageMap(articles,passages,images){
 const inline=chapterNavImageMap(articles,passages,images);
 const bySlug=new Map(images.map(image=>[image.slug,image]));
 const out=Object.create(null);
 for(const article of articles){
  const original=inline[article.slug];
  if(original){out[article.slug]=original;continue}
  const chosen=curatedHomepageChapterImages[article.slug];
  if(!chosen){out[article.slug]=null;continue}
  const image=bySlug.get(chosen.imageSlug);
  if(!image?.assetPath||!image.altText||!image.title||!image.credit||!image.sourceUrl){
   throw new Error('Missing verified homepage documentary image '+chosen.imageSlug+' for '+article.slug);
  }
  out[article.slug]={...image,homeCardReason:chosen.reason,homeCardKind:chosen.kind,homeCardContextual:true};
 }
 return out;
}
