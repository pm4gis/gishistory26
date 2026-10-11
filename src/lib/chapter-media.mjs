
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
 * Place previously verified chapter-linked images inside chapter prose.
 * This is presentation-only: accepted passage content and source files are untouched.
 * Figures already embedded by an editor retain their original position.
 */

/**
 * Additional illustrations reuse already licensed archive files. These are
 * historical context with a plainly stated limitation, never evidence of
 * the original New Zealand installation or an individual's involvement.
 */
export const chapterArchiveReuses = Object.freeze({
  'universities-build-a-field': [
    {slug:'auckland-university-clocktower-2004',
     afterParagraphId:'ch11-s01-p02',
     caption:'The University of Auckland Clock Tower in 2004. University context for the documented 1985 GIS teaching; not a photograph of the original course, students or software.'}
  ],
  'an-industry-and-community-form': [
    {slug:'intergraph-clix-workstation',
     afterParagraphId:'ch12-s01-p02',
     caption:'A genuine late-1980s Intergraph CLIX workstation, representative of specialist hardware sold and supported during the early commercial GIS period. Its use at a New Zealand business has not been established.'}
  ],
  'becoming-a-gis-professional': [
    {slug:'tripp-station-theodolite-surveyors',
     afterParagraphId:'ch29-s01-p02',
     caption:'Surveyors using a theodolite at Tripp Station. The photograph illustrates a predecessor profession that supplied GIS practitioners; its date and any GIS involvement are unverified.'}
  ],
  'enterprise-gis': [
    {slug:'linz-wfs-attribute-service-2023',
     afterParagraphId:'ch40-p-f6bb5c1149ab',
     caption:'LINZ Web Feature Service filtering example from material held by 2023. This is evidence of later interoperable spatial-data services, not an image of an enterprise GIS system from the 1990s.'}
  ]
});

export function placeChapterImages(article, passages, images) {
  const assignments = Object.create(null);
  if (!article?.slug || !Array.isArray(passages) || !Array.isArray(images)) return assignments;
  const sections = passages.filter(p => (p.blocks?.length || p.paragraphs?.length || 0) > 0);
  if (!sections.length) return assignments;

  const embedded = new Set(passages.flatMap(p =>
    (p.blocks || []).filter(b => b.type === 'figure' && b.imageId).map(b => b.imageId)));
  const seen = new Set();
  const archiveReuses = (chapterArchiveReuses[article.slug] || []).flatMap(reuse => {
    const original = images.find(i => i.slug === reuse.slug);
    return original && original.assetPath ? [{...original,
      afterParagraphId:reuse.afterParagraphId,
      caption:reuse.caption,
      context:reuse.caption}] : [];
  });
  const linked = [...images.filter(image => image.articleSlug === article.slug), ...archiveReuses].filter(image => {
    if (!image.slug || !image.assetPath) return false;
    if (embedded.has(image.id) || embedded.has(image.slug)) return false;
    const key = image.id || image.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) =>
    Number(Boolean(b.headerCandidate)) - Number(Boolean(a.headerCandidate)) ||
    a.slug.localeCompare(b.slug, 'en-NZ'));

  // Let the account develop before the first image. Distribute later images
  // across different reading sections, rather than clustering at the start or end.
  const eligible = sections.length > 2 ? sections.slice(1) : sections;
  for (let index = 0; index < linked.length; index++) {
    const picture = linked[index];
    const blockId = picture.afterParagraphId || curatedImageParagraphs[picture.slug];
    const blockSection = blockId && sections.find(p =>
      p.blocks?.some(b => b.id === blockId && b.type === 'paragraph'));
    const requested = sections.find(p => (picture.passageId && picture.passageId === p.id) ||
      (picture.passageSlug && picture.passageSlug === p.slug));
    const section = blockSection || requested || eligible[Math.min(eligible.length - 1,
      Math.floor(((index + 0.5) * eligible.length) / linked.length))];
    // The presentation copy does not modify protected image metadata.
    (assignments[section.id] ||= []).push({...picture,
      inlineAfterBlockId: blockSection ? blockId : null});
  }
  return assignments;
}
