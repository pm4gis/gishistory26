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
await import('./check-links.mjs');
