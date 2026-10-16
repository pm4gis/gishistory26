// Search metadata is derived from accepted, public content. Do not infer biographies,
// affiliations, dates or rights from relationships or unpublished editorial material.
export const ORIGIN = 'https://history.pm4gis.nz';
export const SITE_NAME = 'A History of GIS in New Zealand';
const WEB_SITE_ID = ORIGIN + '/#website';

export function canonicalHref(path) {
  const url = new URL(path, ORIGIN);
  if (url.origin !== ORIGIN) throw new Error('Non-canonical site URL');
  return url.href;
}
export function conciseDescription(value, max = 160) {
  const text = String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.replace(/\s+\S*$/, '').replace(/[\s,;:.]+$/, '') + '…';
}
export function recordDescription(record) {
  return conciseDescription(record.story?.find(p => typeof p === 'string' && p.trim()) || record.description || record.name);
}
export function cleanAliases(record) {
  return [...new Set((record.aliases || []).filter(a => typeof a === 'string' && a.trim() && a !== record.name))];
}
export function publicSourceLinks(sources = []) {
  const seen = new Set();
  return sources.filter(s => {
    if (!s || !s.url || typeof s.url !== 'string' || !/^https?:\/\//i.test(s.url)) return false;
    try {
      const url = new URL(s.url);
      if (!['http:', 'https:'].includes(url.protocol) || seen.has(url.href)) return false;
      seen.add(url.href);
      return true;
    } catch { return false; }
  }).map(s => ({ '@type': 'CreativeWork', name: s.label || s.url, url: s.url }));
}
function recordType(record) {
  if (record.kind === 'Person') return 'Person';
  if (record.kind === 'Dataset') return 'Dataset';
  if (['Agency', 'Business', 'Organisation', 'Organization', 'Company', 'Council', 'Association', 'Institution', 'University'].includes(record.kind)) return 'Organization';
  return 'Thing';
}
export function recordSchema(record, passageLinks = []) {
  const url = canonicalHref(record.url);
  const alternateName = cleanAliases(record);
  const subjectOf = [
    ...publicSourceLinks(record.sources),
    ...passageLinks.filter(p => p && typeof p.url === 'string' && p.url.startsWith('/')).map(p => ({
      '@type': 'CreativeWork', name: p.title, url: canonicalHref(p.url)
    }))
  ].slice(0, 40);
  const result = {
    '@type': recordType(record), '@id': url + '#subject',
    name: record.name, url, description: recordDescription(record)
  };
  if (alternateName.length) result.alternateName = alternateName;
  if (subjectOf.length) result.subjectOf = subjectOf;
  return result;
}
export function chapterSchema(article, passages = [], records = []) {
  const url = canonicalHref(article.url);
  const result = {
    '@type': 'Chapter', '@id': url + '#subject',
    name: article.title, url,
    description: conciseDescription(article.summary),
    inLanguage: 'en-NZ',
    isPartOf: { '@type': 'Book', '@id': ORIGIN + '/read/#publication', name: SITE_NAME, url: ORIGIN + '/read/' },
    author: { '@type': 'Person', name: 'Duane Wilkins' },
    hasPart: passages.map(p => ({
      '@type': 'CreativeWork', name: p.title,
      url: canonicalHref(article.url + '#' + encodeURIComponent(p.slug))
    }))
  };
  if (/^\d{4}-\d{2}-\d{2}$/.test(article.updatedAt || '')) result.dateModified = article.updatedAt;
  const about = [...new Map(records.filter(r => r.url && r.kind !== 'Story' && r.kind !== 'Chapter')
    .map(r => [r.id, { '@type': recordType(r), '@id': canonicalHref(r.url) + '#subject', name: r.name }])).values()];
  if (about.length) result.about = about;
  return result;
}
export function themeSchema(theme, passageLinks = []) {
  const url = canonicalHref('/themes/' + theme.slug + '/');
  return {
    '@type': 'ItemList', '@id': url + '#subject', name: theme.title,
    description: conciseDescription(theme.description),
    itemListElement: passageLinks.map((p, i) => ({
      '@type': 'ListItem', position: i + 1,
      name: p.title, url: canonicalHref(p.url)
    }))
  };
}
export function imageSchema(image) {
  const url = canonicalHref('/images/' + image.slug + '/');
  const result = {
    '@type': 'ImageObject', '@id': url + '#subject',
    name: image.title, description: conciseDescription(image.context || image.caption || image.altText || image.title),
    url, contentUrl: canonicalHref(image.assetPath), caption: image.caption || image.title,
    creditText: image.credit
  };
  if (typeof image.licenceUrl === 'string' && /^https?:\/\//.test(image.licenceUrl)) result.license = image.licenceUrl;
  if (typeof image.sourceUrl === 'string' && /^https?:\/\//.test(image.sourceUrl)) result.isBasedOn = image.sourceUrl;
  if (/^\d{4}(-\d{2}){0,2}$/.test(image.dateDisplay || '')) result.dateCreated = image.dateDisplay;
  return result;
}
export function pageSchema({url, title, description, entities = []}) {
  const page = {
    '@type': 'WebPage', '@id': url + '#webpage', url,
    name: title, description: conciseDescription(description),
    inLanguage: 'en-NZ', isPartOf: { '@id': WEB_SITE_ID }
  };
  const included = (Array.isArray(entities) ? entities : [entities]).filter(Boolean);
  if (included.length) page.mainEntity = { '@id': included[0]['@id'] };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite', '@id': WEB_SITE_ID, url: ORIGIN + '/',
        name: SITE_NAME, inLanguage: 'en-NZ',
        description: 'The documented history of geographic information systems in New Zealand to 31 December 2025.'
      },
      page, ...included
    ]
  };
}
export function safeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
