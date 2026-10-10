import fs from 'node:fs';import path from 'node:path';import zlib from 'node:zlib';
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);const files=walk('dist');const tooLarge=files.filter(p=>fs.statSync(p).size>25*1024*1024);if(files.length>20000||tooLarge.length)throw Error('Cloudflare asset limits exceeded');
const required=['index.html','read/index.html','browse/index.html','datasets/index.html','timeline/index.html','search/index.html','network/index.html','sitemap.xml','robots.txt','release.json'];for(const p of required)if(!fs.existsSync('dist/'+p))throw Error('Missing route '+p);
const js=files.filter(p=>p.endsWith('.js')&&p.includes('/_astro/')).map(p=>({path:p,gzip:zlib.gzipSync(fs.readFileSync(p)).length}));fs.mkdirSync('docs/verification',{recursive:true});fs.writeFileSync('docs/verification/build.json',JSON.stringify({files:files.length,largestAsset:Math.max(...files.map(p=>fs.statSync(p).size)),javascript:js},null,2)+'\n');console.log('Build verified: '+files.length+' files');

const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
const robots = fs.readFileSync('dist/robots.txt', 'utf8');
const canonical = 'https://history.pm4gis.nz';
if (!sitemap.includes('<loc>' + canonical + '/datasets/</loc>') ||
    !sitemap.includes('<loc>' + canonical + '/network/</loc>') ||
    !sitemap.includes('<loc>' + canonical + '/datasets/qmap-250k/</loc>')) {
  throw Error('Sitemap lacks required canonical NZ GIS History URLs');
}
if (sitemap.includes('https://gishistory26.pages.dev') ||
    !robots.includes('Sitemap: ' + canonical + '/sitemap.xml') ||
    robots.includes('https://gishistory26.pages.dev')) {
  throw Error('Sitemap or robots.txt contains a non-canonical production hostname');
}

function pageHtml(relativePath) {
  const file = path.join('dist', relativePath);
  if (!fs.existsSync(file)) throw Error('Missing SEO verification page ' + relativePath);
  return fs.readFileSync(file, 'utf8');
}
function parseJsonLd(html, label) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (!match) throw Error(label + ' is missing JSON-LD structured data');
  try { return JSON.parse(match[1]); }
  catch { throw Error(label + ' has invalid JSON-LD structured data'); }
}
const homeHtml = pageHtml('index.html');
const homeSchema = parseJsonLd(homeHtml, 'Home page');
if (!homeHtml.includes('name="description"') ||
    !homeHtml.includes('<link rel="canonical" href="' + canonical + '/"') ||
    !homeSchema['@graph']?.some((item) => item['@type'] === 'WebSite') ||
    !homeSchema['@graph']?.some((item) => item['@type'] === 'Book')) {
  throw Error('Home page is missing core Google search metadata or schema');
}
const storyHtml = pageHtml('stories/the-cadastre-becomes-data/index.html');
const storySchema = parseJsonLd(storyHtml, 'Story page');
if (!storyHtml.includes('property="og:type" content="article"') ||
    !storyHtml.includes('name="description"') ||
    !storySchema['@graph']?.some((item) => item['@type'] === 'Article') ||
    !storySchema['@graph']?.some((item) => item['@type'] === 'BreadcrumbList')) {
  throw Error('Story page is missing its article, breadcrumb or social metadata');
}
const contact = homeHtml.match(/href="(mailto:pm4gis@gmail\.com\?[^\"]+)"/);
if (!contact) throw Error('Home page is missing the Contributions and corrections email action');
const contactHref = contact[1].replaceAll('&amp;', '&');
const contactUrl = new URL(contactHref);
const emailSubject = contactUrl.searchParams.get('subject');
const emailBody = contactUrl.searchParams.get('body') || '';
if (emailSubject !== 'NZ GIS History Contributions and Corrections' ||
    !emailBody.includes('1. What page, chapter, passage, person, organisation, project or event is this about?') ||
    !emailBody.includes('4. What sources support the suggestion?') ||
    !emailBody.includes('5. For an image, what does it show') ||
    !emailBody.includes('Page I was viewing: ' + canonical + '/')) {
  throw Error('Contributions and corrections email template is incomplete');
}
const editorHtml = pageHtml('editor/index.html');
if (!editorHtml.includes('name="robots" content="noindex,follow"')) throw Error('Editor route must remain excluded from search indexing');
const errorHtml = pageHtml('404.html');
if (!errorHtml.includes('name="robots" content="noindex,follow"')) throw Error('404 route must remain excluded from search indexing');
if (!sitemap.includes(canonical + '/images/silverpeak-survey-district-1956/')) throw Error('Sitemap lacks image archive detail pages');
await import('./check-links.mjs');
