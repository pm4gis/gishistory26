// Verify that every canonical URL in the generated sitemap has a corresponding
// indexable HTML document. This checks the built artefact, independently of Google.
import fs from 'node:fs';
import path from 'node:path';

const origin = 'https://history.pm4gis.nz';
const dist = path.resolve('dist');
const errors = [];
const grouped = {};
const requireTrue = (ok, message) => { if (!ok) errors.push(message); };
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&'));
const indexability = [/^\/search\//, /^\/editor\//, /^\/contribute\//];
requireTrue(urls.length >= 100, 'Too few public sitemap entries: ' + urls.length);
requireTrue(urls.length <= 50000, 'Sitemap exceeds 50,000 URL maximum');
requireTrue(new Set(urls).size === urls.length, 'Duplicate URL in sitemap');
requireTrue(robots.includes('Sitemap: ' + origin + '/sitemap.xml'), 'robots.txt does not list sitemap');
requireTrue(!/disallow:\s*\//i.test(robots), 'robots.txt broadly blocks crawling');
for (const url of urls) {
  let u;
  try { u = new URL(url); } catch { errors.push('Invalid URL ' + url); continue; }
  const route = u.pathname;
  requireTrue(u.origin === origin && u.search === '' && u.hash === '',
    'Unexpected host or query/fragment in sitemap: ' + url);
  requireTrue(route.endsWith('/'), 'Sitemap route missing trailing slash: ' + route);
  requireTrue(!indexability.some(re => re.test(route)), 'Noindex utility route in sitemap: ' + route);
  const file = path.join(dist, route.slice(1), 'index.html');
  if (!fs.existsSync(file)) { errors.push('Missing HTML for sitemap URL ' + url); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/i)?.[1] || '';
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
  const description = html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/i)?.[1] || '';
  requireTrue(canonical === url, 'HTML canonical mismatch for ' + route + ': ' + canonical);
  requireTrue(title.trim().length > 8, 'No descriptive title for ' + route);
  requireTrue(description.trim().length >= 20, 'No description for ' + route);
  requireTrue(!/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html),
    'Sitemap indexes a page explicitly marked noindex: ' + route);
  requireTrue(/<h1(?:\s|>)/i.test(html), 'Missing server-rendered H1 for ' + route);
  requireTrue(html.includes('application/ld+json'), 'Missing structured data for ' + route);
  const type = route.split('/').filter(Boolean)[0] || 'home';
  grouped[type] = (grouped[type] || 0) + 1;
}
const noindexRoutes = ['/search/', '/contribute/', '/editor/'];
for (const route of noindexRoutes) {
  const file = path.join(dist, route.slice(1), 'index.html');
  if (!fs.existsSync(file)) { errors.push('Missing utility page: ' + route); continue; }
  const html = fs.readFileSync(file, 'utf8');
  requireTrue(/<meta\b[^>]*name="robots"[^>]*content="noindex,follow"/i.test(html),
    'Utility page is not marked noindex: ' + route);
}
for(const route of ['/history/','/read/','/timeline/','/browse/','/publications/','/about/']){
  requireTrue(urls.includes(origin + route), 'Core search route missing from sitemap: ' + route);
}
const report={source:'generated static build, not Google Search Console',canonicalOrigin:origin,sitemapEntries:urls.length,groups:grouped,errors};
fs.mkdirSync('docs/verification',{recursive:true});
fs.writeFileSync('docs/verification/sitemap-page-audit.json',JSON.stringify(report,null,2)+'\n');
console.log('Indexable sitemap audit: '+urls.length+' canonical HTML pages, '+errors.length+' problems');
if(errors.length)throw new Error('Sitemap/page acceptance: '+JSON.stringify(errors.slice(0,20)));
