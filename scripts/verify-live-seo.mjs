// Validate the public production publication over HTTP from a networked runner.
// This is an acceptance check, not a Search Console or Bing Webmaster submission.
import { appendFileSync, writeFileSync } from 'node:fs';

const origin = 'https://history.pm4gis.nz';
const errors = [];
const observations = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const matches = (value, pattern) => String(value || '').match(pattern)?.[1] || '';
const decodeXml = value => value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

async function retrieve(path) {
  const url = new URL(path, origin);
  let response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(20000),
      headers: { 'user-agent': 'NZ-GIS-History-SEO-Acceptance/1.0' }
    });
    const body = await response.text();
    const result = {
      path, status: response.status, url: response.url,
      contentType: response.headers.get('content-type') || '',
      xRobotsTag: response.headers.get('x-robots-tag') || '',
      bytes: Buffer.byteLength(body)
    };
    observations.push(result);
    return { ...result, body };
  } catch (error) {
    errors.push(path + ': request failed: ' + String(error));
    observations.push({ path, error: String(error) });
    return null;
  }
}

const robots = await retrieve('/robots.txt');
if (robots) {
  assert(robots.status === 200, 'robots.txt must return HTTP 200');
  assert(/User-agent:\s*\*/i.test(robots.body) && /Allow:\s*\//i.test(robots.body),
    'robots.txt must permit general crawling');
  assert(robots.body.includes('Sitemap: ' + origin + '/sitemap.xml'),
    'robots.txt must advertise the canonical sitemap');
}

const llms = await retrieve('/llms.txt');
if (llms) {
  assert(llms.status === 200, 'llms.txt must return HTTP 200');
  assert(llms.body.includes(origin + '/read/') && llms.body.includes(origin + '/sitemap.xml'),
    'llms.txt must link to reading material and the sitemap');
  assert(llms.body.includes('31 December 2025'), 'llms.txt must preserve the historical cut-off');
}

const sitemap = await retrieve('/sitemap.xml');
let urls = [];
if (sitemap) {
  assert(sitemap.status === 200, 'sitemap.xml must return HTTP 200');
  assert(/(?:application|text)\/xml/i.test(sitemap.contentType), 'Sitemap must have an XML content type');
  assert(/<urlset\b/.test(sitemap.body) && /<\/urlset>/.test(sitemap.body), 'Sitemap root element missing');
  urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => decodeXml(m[1]));
  assert(urls.length > 100, 'Sitemap unexpectedly small');
  assert(new Set(urls).size === urls.length, 'Sitemap contains duplicate canonical URLs');
  for (const url of urls) {
    assert(url.startsWith(origin + '/') && !/[?#]/.test(url),
      'Invalid or non-canonical sitemap URL: ' + url);
    assert(!/\/(?:search|editor|contribute)\//.test(new URL(url).pathname),
      'Non-indexable utility page in sitemap: ' + url);
  }
  for (const group of ['people', 'organisations', 'datasets', 'stories', 'themes', 'images', 'documents']) {
    assert(urls.some(url => url.startsWith(origin + '/' + group + '/')),
      'Sitemap has no ' + group + ' detail pages');
  }
  for (const lastmod of sitemap.body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(lastmod[1]), 'Invalid sitemap lastmod: ' + lastmod[1]);
  }
}

const samples = [
  ['/', null],
  ['/history/', 'Article'],
  ['/read/', null],
  ['/browse/', null],
  ['/publications/', null],
  ['/timeline/', null],
  ['/people/a-c-shailes/', 'Person'],
  ['/organisations/agresearch/', 'Organization'],
  ['/datasets/nzlri/', 'Dataset'],
  ['/stories/preface/', 'Chapter'],
  ['/themes/cadastre/', 'ItemList'],
  ['/images/arc-pitt-street-2007/', 'ImageObject'],
  ['/documents/our-land-resources-1979/', null],
  ['/search/', 'noindex'],
  ['/editor/', 'noindex'],
  ['/contribute/', 'noindex']
];
for (const [path] of samples) {
  if (!['/search/', '/editor/', '/contribute/'].includes(path)) {
    assert(urls.includes(origin + path), 'Indexable sample absent from sitemap: ' + path);
  }
}
const summaries = [];
for (let start = 0; start < samples.length; start += 3) {
  const batch = samples.slice(start, start + 3);
  const checked = await Promise.all(batch.map(async ([path, expectedType]) => {
    const page = await retrieve(path);
    if (!page) return null;
    assert(page.status === 200, path + ': expected HTTP 200, got ' + page.status);
    assert(page.url === origin + path, path + ': unexpected redirect or non-canonical destination ' + page.url);
    assert(/text\/html/i.test(page.contentType), path + ': expected HTML content type');
    const title = matches(page.body, /<title>([\s\S]*?)<\/title>/i);
    const descriptionTag = matches(page.body, /(<meta\b[^>]*\bname="description"[^>]*>)/i);
    const description = matches(descriptionTag, /\bcontent="([^"]*)"/i);
    const canonicalTag = matches(page.body, /(<link\b[^>]*\brel="canonical"[^>]*>)/i);
    const canonical = matches(canonicalTag, /\bhref="([^"]*)"/i);
    const robotsTag = matches(page.body, /(<meta\b[^>]*\bname="robots"[^>]*>)/i);
    const robotsValue = matches(robotsTag, /\bcontent="([^"]*)"/i);
    const jsonLd = matches(page.body, /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
    assert(Boolean(title), path + ': missing title');
    assert(description.trim().length >= 20, path + ': missing or very short description');
    assert(canonical === origin + path, path + ': incorrect canonical URL ' + canonical);
    assert(Boolean(jsonLd), path + ': missing Schema.org JSON-LD');
    if (expectedType === 'noindex') {
      assert(/noindex/i.test(robotsValue), path + ': missing noindex');
    } else {
      assert(!/noindex/i.test(robotsValue + ' ' + page.xRobotsTag), path + ': unexpectedly noindex');
      assert(/<h1\b/i.test(page.body), path + ': missing server-rendered H1');
    }
    let schemaTypes = [];
    if (jsonLd) {
      try {
        const schema = JSON.parse(jsonLd);
        schemaTypes = (schema['@graph'] || []).map(node => node['@type']);
        assert(schemaTypes.includes('WebSite') && schemaTypes.includes('WebPage'),
          path + ': missing WebSite/WebPage schema nodes');
        assert(schema['@graph'].some(node => node['@type'] === 'WebPage' && node.url === origin + path),
          path + ': structured WebPage URL inconsistent with canonical');
        if (expectedType !== 'noindex' && expectedType) {
          assert(schemaTypes.includes(expectedType), path + ': expected schema type ' + expectedType);
        }
      } catch (error) { errors.push(path + ': invalid JSON-LD: ' + String(error)); }
    }
    return { path, status: page.status, title, canonical, descriptionLength: description.length,
      noindex: /noindex/i.test(robotsValue), schemaTypes, bytes: page.bytes };
  }));
  summaries.push(...checked.filter(Boolean));
}

// These requests impersonate only the Googlebot user-agent string. They do not
// establish a verified Google crawler identity or prove Search Console indexing.
const simulatedGooglebot = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const botProbes = [];
for (const path of ['/robots.txt', '/sitemap.xml', '/', '/history/', '/stories/landonline/']) {
  const target = origin + path;
  try {
    const response = await fetch(target, {redirect: 'manual', signal: AbortSignal.timeout(20000),
      headers: {'user-agent': simulatedGooglebot, 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'}});
    const body = await response.text();
    const item = {path, status:response.status, contentType:response.headers.get('content-type') || '',
      xRobotsTag:response.headers.get('x-robots-tag') || '',
      xRouting:response.headers.get('x-nzgis-history-routing') || '',
      server:response.headers.get('server') || '',bytes:Buffer.byteLength(body)};
    botProbes.push(item);
    assert(response.status === 200, path + ': simulated Googlebot received HTTP ' + response.status);
    assert(!/captcha|challenge-platform|just a moment/i.test(body.slice(0,2500)),
      path + ': simulated Googlebot received a challenge response');
    if (path.endsWith('/')) {
      assert(body.includes('<title>') && body.includes('</title>'), path + ': bot did not receive rendered page title');
      assert(body.includes('rel="canonical"'), path + ': bot did not receive canonical HTML');
      assert(!/name="robots"[^>]+noindex/i.test(body), path + ': bot received noindex');
    }
  } catch(error) {
    errors.push('simulated Googlebot '+path+': '+String(error));
    botProbes.push({path,error:String(error)});
  }
}
// The old public hostname should never produce a second indexable copy.
const redirectProbes = [];
for(const url of ['https://gishistory.pm4gis.nz/', 'https://gishistory.pm4gis.nz/history/']) {
  try {
    const response = await fetch(url, {redirect:'manual',signal:AbortSignal.timeout(20000)});
    const location = response.headers.get('location') || '';
    redirectProbes.push({url,status:response.status,location});
    assert([301,308].includes(response.status), 'Legacy host not permanently redirected: '+url+' ('+response.status+')');
    assert(location === url.replace('gishistory.pm4gis.nz','history.pm4gis.nz'), 'Legacy redirect target differs: '+url+' => '+location);
  } catch(error) {
    errors.push('Legacy hostname '+url+': '+String(error));
    redirectProbes.push({url,error:String(error)});
  }
}

const report = {
  auditedAt: new Date().toISOString(),
  site: origin,
  sitemapUrlCount: urls.length,
  checked: observations,
  pageSummaries: summaries,
  simulatedGooglebotUserAgentProbes: botProbes,
  legacyHostnameRedirectProbes: redirectProbes,
  errors
};
writeFileSync('docs/verification/live-seo-acceptance.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ sitemapUrlCount: urls.length, pageSummaries: summaries, errors }, null, 2));
if (process.env.GITHUB_STEP_SUMMARY) {
  const lines = [
    '# Live SEO crawl acceptance',
    '',
    'Public sitemap URLs: **' + urls.length + '**',
    '',
    '| URL | HTTP | Canonical | Schema types |',
    '| --- | --- | --- | --- |',
    ...summaries.map(x => '| \`' + x.path + '\` | ' + x.status + ' | ' +
      (x.canonical === origin + x.path ? 'OK' : 'Mismatch') + ' | ' + x.schemaTypes.join(', ') + ' |'),
    '',
    'Errors: **' + errors.length + '**',
    ...errors.map(x => '- ' + x),
    ''
  ];
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'));
}
if (errors.length) process.exitCode = 1;
