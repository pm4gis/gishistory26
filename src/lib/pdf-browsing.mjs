import {contributedPrimarySources} from './contributed-primary-sources.mjs';
import {onlinePdfPublications} from './online-pdf-publications.mjs';

export const publicationSequence = [
  ...contributedPrimarySources
    .filter(item => item.format === 'PDF')
    .map(item => ({
      key: 'archive:' + item.slug,
      title: item.title,
      url: item.publicationUrl,
      date: item.startDate,
    })),
  ...onlinePdfPublications
    .map(item => ({
      key: 'research:' + item.slug,
      title: item.title,
      url: '/publications/research/' + item.slug + '/',
      date: String(item.year),
    })),
].sort((a, b) =>
  b.date.localeCompare(a.date) ||
  a.title.localeCompare(b.title, 'en-NZ') ||
  a.key.localeCompare(b.key, 'en-NZ')
);

export function publicationNavigation(key) {
  const index = publicationSequence.findIndex(item => item.key === key);
  if (index < 0) return null;
  return {
    previous: index > 0 ? publicationSequence[index - 1] : null,
    next: index < publicationSequence.length - 1 ? publicationSequence[index + 1] : null,
    position: index + 1,
    total: publicationSequence.length,
  };
}
