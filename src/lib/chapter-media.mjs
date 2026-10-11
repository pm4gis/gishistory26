
/* Exact paragraph anchors verified in the source-image acquisition notes. */
export const curatedImageParagraphs = Object.freeze({
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
    caption:'The 1850 Christchurch Black Map illustrates the nineteenth-century paper mapping inherited by later cadastral record systems. It is not a computer-era cadastral map.',
    evidence:'Chapter 1, The parcel record: historical paper plans and land-office records'
  },
  'doc-historic-map-777b1981f3a8ee1d': {
    articleSlug:'what-the-computer-inherited', afterParagraphId:'ch01-s02-p02',
    caption:'A 1922 Beaumont Survey District map is a surviving example of a paper survey sheet. The chapter discusses how offices maintained sheets and indexes long before electronic cadastral databases.',
    evidence:'Chapter 1, The parcel record: maintained survey district and record sheets'
  },
  'doc-aerial-5c1e84f30e04f7e4': {
    articleSlug:'what-the-computer-inherited', afterParagraphId:'ch01-s06-p02',
    caption:'Aerial view of Warkworth, 1937, from the early period of organised aerial survey in New Zealand. The photograph does not establish which firm flew this particular survey.',
    evidence:'Chapter 1, The country from the air: systematic aerial survey from the 1930s'
  },
  'wave6-curated-7a04bfeaf63f78f1': {
    articleSlug:'the-cadastre-becomes-data', afterParagraphId:'ch13-s02-p01',
    caption:'A Crown grant map for Forest Hill Hundred shows one type of historic land record. It is not a survey-grade digital boundary file or an example of the DCDB software.',
    evidence:'Chapter 13, Records made for different jobs: grants, survey plans, indexes and maps'
  },
  'retrolens-c515a148bd788efa': {
    articleSlug:'imagery-becomes-infrastructure', afterParagraphId:'ch20-s09-p01',
    caption:'An aerial photograph of the Verdon College site, Invercargill, captured on 7 June 1946 and subsequently preserved through Retrolens. It represents the film-frame archive described here.',
    evidence:'Chapter 20, An archive becomes digital: Crown Aerial Film Library and survey frames'
  },
  'retrolens-fb8cfefdccb907d2': {
    articleSlug:'imagery-becomes-infrastructure', afterParagraphId:'ch20-s09-p03',
    caption:'The same Verdon College area photographed on 28 February 1962, illustrating the value of retaining dated survey frames. This is a historical aerial frame, not necessarily an orthorectified GIS layer.',
    evidence:'Chapter 20, An archive becomes digital: different dated frames, scanning and orthorectification'
  },
  'nasa-terra-modis-nz-2002': {
    articleSlug:'earth-observation-becomes-routine', afterParagraphId:'ch36-s01-p02',
    caption:'NASA Terra MODIS observation of New Zealand on 23 October 2002. It illustrates nationwide satellite coverage from the early 2000s, not a complete national time-series mosaic.',
    evidence:'Chapter 36, Repeated satellite coverage: individual observations versus maintained national series'
  },
  'usgs-hundred-millionth-landsat-nz-2017': {
    articleSlug:'earth-observation-becomes-routine', afterParagraphId:'ch36-s06-p01',
    caption:'The 2017 New Zealand Landsat scene associated with the USGS archive’s 100-millionth download. The archive became freely available in 2008; this later scene illustrates its use, not the 2008 decision.',
    evidence:'Chapter 36, The archive opens: 2008 USGS Landsat free-access policy and subsequent reuse'
  },
  'nasa-landsat4-tasman-1990': {
    articleSlug:'earth-observation-becomes-routine', afterParagraphId:'ch36-p-3c6e90ec73b2',
    caption:'Landsat 4 acquired this image of Tasman Glacier on 30 December 1990. The chapter identifies the archive of New Zealand Landsat 4 material dating from 1990.',
    evidence:'Chapter 36, A national archive takes shape: Landsat 4 images from 1990'
  },
  'nasa-aster-tasman-2007': {
    articleSlug:'earth-observation-becomes-routine', afterParagraphId:'ch36-s13-p03',
    caption:'ASTER observed Tasman Glacier in December 2007. Together with the archived 1990 Landsat view, it shows why older acquisitions can be revisited, while cross-sensor comparisons still require care.',
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
