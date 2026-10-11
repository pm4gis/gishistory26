/**
 * Place previously verified chapter-linked images inside chapter prose.
 * This is presentation-only: accepted passage content and source files are untouched.
 * Figures already embedded by an editor retain their original position.
 */
export function placeChapterImages(article, passages, images) {
  const assignments = Object.create(null);
  if (!article?.slug || !Array.isArray(passages) || !Array.isArray(images)) return assignments;
  const sections = passages.filter(p => (p.blocks?.length || p.paragraphs?.length || 0) > 0);
  if (!sections.length) return assignments;

  const embedded = new Set(passages.flatMap(p =>
    (p.blocks || []).filter(b => b.type === 'figure' && b.imageId).map(b => b.imageId)));
  const seen = new Set();
  const linked = images.filter(image => {
    if (image.articleSlug !== article.slug || !image.slug || !image.assetPath) return false;
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
    const requested = sections.find(p => (picture.passageId && picture.passageId === p.id) ||
      (picture.passageSlug && picture.passageSlug === p.slug));
    const section = requested || eligible[Math.min(eligible.length - 1,
      Math.floor(((index + 0.5) * eligible.length) / linked.length))];
    (assignments[section.id] ||= []).push(picture);
  }
  return assignments;
}
