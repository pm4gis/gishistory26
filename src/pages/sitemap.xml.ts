import { dataset } from '../lib/data';
import { chapterDocuments } from '../lib/chapter-documents.mjs';
import { contributedPrimarySources } from '../lib/contributed-primary-sources.mjs';
import { onlinePdfPublications } from '../lib/online-pdf-publications.mjs';
import { ORIGIN } from '../lib/seo.mjs';

export async function GET() {
  const d = await dataset();
  const urls = new Map<string, string | undefined>();
  function include(path: string, modified?: string) {
    if (!/^\/[^?#]*$/.test(path)) return;
    const lastmod = typeof modified === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(modified) ? modified : undefined;
    // Only public, canonical HTML pages belong in the sitemap.
    if (!urls.has(path) || (lastmod && !urls.get(path))) urls.set(path, lastmod);
  }
  [
    '/', '/history/', '/publications/', '/sources/documents/', '/read/', '/timeline/', '/browse/', '/datasets/', '/network/',
    '/themes/', '/images/', '/about/', '/sources/collections/',
    '/nga-poutama-videos/'
  ].forEach(path => include(path));
  d.articles.filter((a: any) => a.status === 'published').forEach((a: any) => include(a.url, a.updatedAt));
  d.records.filter((r: any) => r.kind !== 'Story').forEach((r: any) => include(r.url, r.updatedAt));
  d.themes.forEach((t: any) => include('/themes/' + t.slug + '/', t.updatedAt));
  d.images.forEach((i: any) => include('/images/' + i.slug + '/'));
  chapterDocuments.forEach((doc: any) => include('/documents/' + doc.slug + '/'));
  contributedPrimarySources.forEach(doc => {include(doc.publicationUrl);include('/sources/documents/'+doc.slug+'/');});
  onlinePdfPublications.forEach(doc => include('/publications/pdf/'+doc.slug+'/'));
  const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const entries = [...urls.entries()].map(([path, lastmod]) =>
    '<url><loc>' + esc(ORIGIN + path) + '</loc>' + (lastmod ? '<lastmod>' + lastmod + '</lastmod>' : '') + '</url>'
  ).join('');
  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + entries + '</urlset>';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
