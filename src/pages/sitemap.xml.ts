import { dataset } from '../lib/data';

const canonicalOrigin = 'https://history.pm4gis.nz';

export async function GET() {
  const d = await dataset();
  const paths = [
    '/', '/read/', '/timeline/', '/browse/', '/datasets/', '/network/',
    '/themes/', '/search/', '/images/', '/about/',
    ...d.articles.map((a: any) => a.url),
    ...d.records.filter((r: any) => r.kind !== 'Story').map((r: any) => r.url),
    ...d.themes.map((t: any) => '/themes/' + t.slug + '/'),
    ...d.images.map((image: any) => '/images/' + image.slug + '/'),
  ];
  const locations = [...new Set(paths)]
    .filter((path) => path.startsWith('/'))
    .map((path) => '<url><loc>' + (canonicalOrigin + path).replace(/&/g, '&amp;') + '</loc></url>')
    .join('');
  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    locations + '</urlset>';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
