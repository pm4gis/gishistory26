
/* Exact paragraph anchors verified in the source-image acquisition notes. */
export const curatedImageParagraphs = Object.freeze({
  'qmap-christchurch-2008':'research-cri-qmap-cd-2006',
  'levin-topographic-map-1973':'ch05-s01-p02',
  'intergraph-clix-workstation':'ch06-s01-p03',
  'te-kuiti-land-development-office':'ch10-p-f2800ed17165',
  'dhb-boundaries-2001-2010':'ch27-s01-p02',
  'mow-field-trip-gisborne-1971':'ch34-s01-p01',
  'victoria-square-aerial-1975':'ch38-s01-p04',
  'silverpeak-survey-district-1956':'ch13-s02-p02',
  'wiri-north-quarry-1982':'ch20-s01-p02',
  'north-island-counties-districts-1981':'ch23-s01-p01'
});

/**
 * Editorially reviewed links between a particular documentary original and
 * the passage that actually discusses its subject. A file's chapterNumber
 * alone is NOT evidence that it belongs anywhere in that story.
 *
 * New historical batches without a reviewed link remain discoverable through
 * their image-detail records, but do not appear as in-story illustrations.
 */
export const reviewedImagePassages = Object.freeze({
  'doc-historic-map-6c572e829a93c5f5': {
    articleSlug:'what-the-computer-inherited', afterParagraphId:'ch01-p-242c96db76e3',
    caption:'The Christchurch Black Map of 1850 is an example of the paper maps and plans kept in nineteenth-century land records.',
    evidence:'Chapter 1, The parcel record: historical paper plans and land-office records'
  },
  'doc-historic-map-777b1981f3a8ee1d': {
    articleSlug:'what-the-computer-inherited', afterParagraphId:'ch01-s02-p02',
    caption:'Beaumont Survey District map, 1922. Survey offices maintained maps and indexes such as these before cadastral records became electronic.',
    evidence:'Chapter 1, The parcel record: maintained survey district and record sheets'
  },
  'doc-aerial-5c1e84f30e04f7e4': {
    articleSlug:'what-the-computer-inherited', afterParagraphId:'ch01-s06-p02',
    caption:'Aerial photograph of Warkworth, 1937, from the early period of organised aerial surveying in New Zealand.',
    evidence:'Chapter 1, The country from the air: systematic aerial survey from the 1930s'
  },
  'wave6-curated-7a04bfeaf63f78f1': {
    articleSlug:'the-cadastre-becomes-data', afterParagraphId:'ch13-s02-p01',
    caption:'Crown grant map for Forest Hill Hundred, an example of a historical land record used alongside survey plans and indexes.',
    evidence:'Chapter 13, Records made for different jobs: grants, survey plans, indexes and maps'
  },
  'retrolens-c515a148bd788efa': {
    articleSlug:'imagery-becomes-infrastructure', afterParagraphId:'ch20-s09-p01',
    caption:'Aerial photograph of the Verdon College site, Invercargill, taken 7 June 1946 and later made available through Retrolens.',
    evidence:'Chapter 20, An archive becomes digital: Crown Aerial Film Library and survey frames'
  },
  'retrolens-fb8cfefdccb907d2': {
    articleSlug:'imagery-becomes-infrastructure', afterParagraphId:'ch20-s09-p03',
    caption:'The Verdon College area, Invercargill, photographed again on 28 February 1962. The 1946 and 1962 frames provide views of the same area at different dates.',
    evidence:'Chapter 20, An archive becomes digital: different dated frames, scanning and orthorectification'
  },
  'nasa-terra-modis-nz-2002': {
    articleSlug:'earth-observation-becomes-routine', afterParagraphId:'ch36-s01-p02',
    caption:'NASA Terra MODIS true-colour image acquired on 23 October 2002, showing most of New Zealand’s North and South Islands under nearly cloud-free conditions.',
    evidence:'Chapter 36, Repeated satellite coverage: individual observations versus maintained national series'
  },
  'usgs-hundred-millionth-landsat-nz-2017': {
    articleSlug:'earth-observation-becomes-routine', afterParagraphId:'ch36-s06-p01',
    caption:'A New Zealand Landsat scene associated with the USGS archive’s 100-millionth download in 2017. USGS began releasing its Landsat archive for free electronic access in 2008.',
    evidence:'Chapter 36, The archive opens: 2008 USGS Landsat free-access policy and subsequent reuse'
  },
  'nasa-landsat4-tasman-1990': {
    articleSlug:'earth-observation-becomes-routine', afterParagraphId:'ch36-p-3c6e90ec73b2',
    caption:'Landsat 4 image of Tasman Glacier acquired on 30 December 1990, part of the historical satellite record available for later analysis.',
    evidence:'Chapter 36, A national archive takes shape: Landsat 4 images from 1990'
  },
  'retrolens-3ec520daec5ae4a0': {
    articleSlug:'imagery-becomes-infrastructure', afterParagraphId:'ch20-s09-p02',
    caption:'Aerial photograph of Glentunnel and Coalgate, Selwyn, taken 9 March 1943. A scanned copy is accessible through Retrolens and Wikimedia Commons.',
    evidence:'Chapter 20, An archive becomes digital: the scanned aerial frames and survey metadata of the Crown Aerial Film Library; original Retrolens image via individually licensed Wikimedia Commons file.'
  },
  'christchurch-response-orthophoto-2011': {
    articleSlug:'the-real-time-map', afterParagraphId:'ch42-s06-p01',
    caption:'Christchurch Response Centre 10 cm orthophotography showing liquefaction at Cashmere High School, captured by New Zealand Aerial Mapping on 24 February 2011, two days after the earthquake.',
    evidence:'Chapter 42, Imagery after the ground changes: new orthophotography acquired after a disaster; Commons credits LINZ, NZ Aerial Mapping and the Christchurch Response Centre.'
  },
  'geonet-kaikoura-felt-2016': {
    articleSlug:'the-real-time-map', afterParagraphId:'ch42-s02-p02',
    caption:'GeoNet felt-report map for the 14 November 2016 Kaikōura earthquake, captured from the GeoNet website on 19 June 2025.',
    evidence:'Chapter 42, GeoNet normalises the live map: publicly mapped earthquake observations and felt reports; Commons file and official GeoNet 2016 event.'
  },
  'gabrielle-sentinel-flooding-napier-2023': {
    articleSlug:'the-real-time-map', afterParagraphId:'ch42-s10-p01',
    caption:'Copernicus Sentinel radar-derived view of flooding near Napier following Cyclone Gabrielle, processed by Pierre Markuse on 15 February 2023.',
    evidence:'Chapter 42, Cyclone Gabrielle: documented flooding across Hawke’s Bay during the 2023 event; Commons original credits Pierre Markuse and modified Copernicus Sentinel data.'
  },
  'landsat-christchurch-2001': {
    articleSlug:'earth-observation-becomes-routine', afterParagraphId:'ch36-s03-p01',
    caption:'NASA Landsat 7 ETM+ image of Christchurch and Banks Peninsula acquired on 25 September 2001, within the satellite acquisition period used for LCDB2.',
    evidence:'Chapter 36, Land cover through time: Landsat 7 ETM+ imagery acquired from September 2001 to March 2002; NASA Earth Observatory source identifies the sensor and exact image date.'
  },
  'nz-census-density-2023': {
    articleSlug:'census-geography', afterParagraphId:'ch16-s07-p01',
    caption:'QGIS population-density map prepared in 2024 using 2023 Census data and Stats NZ Statistical Area 2 boundaries.',
    evidence:'Chapter 16, Linking census records: aggregating and mapping population statistics with matching digital polygons; Commons original documents Stats NZ inputs and QGIS production.'
  },
  'nasa-aster-tasman-2007': {
    articleSlug:'earth-observation-becomes-routine', afterParagraphId:'ch36-s13-p03',
    caption:'ASTER satellite image of Tasman Glacier acquired in December 2007. An earlier Landsat 4 image of the same glacier dates from December 1990.',
    evidence:'Chapter 36, A national archive takes shape: reanalysis and limits of comparing different sensors'
  }
});

/**
 * A reviewed paragraph reference is required for in-story placement.
 * No alphabetical sorting, evenly distributed fallbacks or section fillers.
 * Image records and archived source files remain accessible independently.
 */
export function placeChapterImages(article, passages, images) {
  const assignments = Object.create(null);
  if (!article?.slug || !Array.isArray(passages) || !Array.isArray(images)) return assignments;
  const embedded = new Set(passages.flatMap(p =>
    (p.blocks || []).filter(b => b.type === 'figure' && b.imageId).map(b => b.imageId)));
  const paragraphLookup = new Map();
  for (const passage of passages) {
    for (const block of passage.blocks || []) {
      if (block.type === 'paragraph' && block.id) paragraphLookup.set(block.id, passage);
    }
  }
  const used = new Set();
  for (const image of images) {
    if (!image?.slug || !image.assetPath || used.has(image.id || image.slug)) continue;
    if (embedded.has(image.id) || embedded.has(image.slug)) continue;
    const reviewed = reviewedImagePassages[image.slug];
    const isNewBatch = /^(?:doc-|wave6-curated-|retrolens-|nasa-|usgs-)/.test(image.slug);
    if (isNewBatch && !reviewed) continue;
    if (reviewed && reviewed.articleSlug !== article.slug) continue;
    if (!reviewed && image.articleSlug !== article.slug) continue;
    const blockId = reviewed?.afterParagraphId || image.afterParagraphId || curatedImageParagraphs[image.slug];
    let passage = blockId ? paragraphLookup.get(blockId) : undefined;
    let actualBlockId = blockId;
    // An explicitly identified passage is accepted for older records only;
    // without an anchor, put the image beside the first paragraph in that passage.
    if (!passage && !isNewBatch && (image.passageId || image.passageSlug)) {
      passage = passages.find(p =>
        (image.passageId && p.id === image.passageId) ||
        (image.passageSlug && p.slug === image.passageSlug));
      actualBlockId = passage?.blocks?.find(b => b.type === 'paragraph')?.id;
    }
    if (!passage || !actualBlockId || paragraphLookup.get(actualBlockId) !== passage) continue;
    const placed = reviewed ? {...image,caption:reviewed.caption,context:reviewed.evidence,
      inlineAfterBlockId:actualBlockId} : {...image,inlineAfterBlockId:actualBlockId};
    (assignments[passage.id] ||= []).push(placed);
    used.add(image.id || image.slug);
  }
  return assignments;
}
