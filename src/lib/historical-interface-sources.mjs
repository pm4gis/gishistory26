/**
 * Links to genuine period figures that are hosted by their original publisher.
 * These are NOT locally published images. Reproduction permission for the
 * image itself is unresolved and the figure must not be downloaded/cropped.
 */
export const externalHistoricInterfaces = Object.freeze({
  'ch30-s09-p01': Object.freeze({
    articleSlug: 'the-first-web-maps',
    captureYear: 2003,
    title: 'DOCgis Beta HTML 2.0, 2003',
    sourceLabel: 'View the original DOCgis browser interface (Figure 9, page 19)',
    sourceUrl: 'https://proceedings.esri.com/library/userconf/proc03/p1048.pdf#page=19',
    parentPublicationUrl: 'https://proceedings.esri.com/library/userconf/proc03/p1048.pdf',
    documentTitle: 'Managing Conservation Enterprise Systems, 2003 conference proceedings',
    figureNumber: 9,
    publishedBy: 'Esri international user conference proceedings, 2003',
    statement: 'A contemporary paper reproduces the 2003 DOCgis ArcIMS HTML interface. The original illustration is held by the publisher; permission to reproduce it on this site has not been confirmed.',
    reuseStatus: 'external-link-only',
    locallyApproved: false
  })
});

export function historicInterfaceFor(articleSlug, blockId) {
  const item=externalHistoricInterfaces[blockId];
  return item?.articleSlug===articleSlug ? item : null;
}
