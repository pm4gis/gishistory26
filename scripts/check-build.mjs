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
const share='dist/assets/social/nzgis-selected-20261013.jpg';
if(!fs.existsSync(share))throw Error('Selected social sharing image is missing from build');
const bytes=fs.readFileSync(share);
if(bytes[0]!==0xff||bytes[1]!==0xd8||bytes[bytes.length-2]!==0xff||bytes[bytes.length-1]!==0xd9)
 throw Error('Invalid selected image: expected complete JPEG');
const meta=await (await import('sharp')).default(share).metadata();
if(meta.width!==1200||meta.height!==630||meta.format!=='jpeg')throw Error('Selected social JPEG has incorrect size');
// Home title assets are either existing documentary images or verified local crops.
const topo=(await import('../src/lib/home-topo-maps.mjs')).homeTopoMaps;
for(const map of topo){
 const file='dist'+map.src;
 if(!fs.existsSync(file))throw Error('Missing locally hosted homepage title image '+map.id);
 const bytes=fs.statSync(file).size;
 if(bytes<1000||bytes>5*1024*1024)throw Error('Invalid title image size: '+map.id+' '+bytes);
 const meta=await (await import('sharp')).default(file).metadata();
 if(meta.format!=='webp'||!meta.width||!meta.height)throw Error('Invalid homepage title image: '+map.id);
 if(map.driveId&&(meta.width!==1400||meta.height!==788))throw Error('Wrong topographic title crop dimensions: '+map.id);
}
console.log('Verified '+topo.length+' locally hosted homepage title images');

const homeHtml=fs.readFileSync('dist/index.html','utf8');
if(!homeHtml.includes('data-topo-sources=')||!homeHtml.includes('hero--topo')||homeHtml.includes('A different selection appears each time you visit.'))throw Error('Homepage image rotation or discreet highlights missing');
if(!homeHtml.includes('property="og:image"')||!homeHtml.includes('/assets/social/nzgis-selected-20261013.jpg')||!homeHtml.includes('name="twitter:card"')||!homeHtml.includes('image/jpeg'))
 throw Error('Approved social artwork metadata missing from generated homepage');
console.log('Selected social card verified: 1200 x 630, JPEG, Open Graph and X metadata');

await import('./check-links.mjs');
await import('./verify-indexable-build.mjs');
await import('./audit-seo-internal-discovery.mjs');

// Measure the final generated archive and checked internal links, then stamp the
// homepage. Changing numeric text adds neither a file nor an internal link.
const linkReport=JSON.parse(fs.readFileSync('docs/verification/links.json','utf8'));
const measured={files:walk('dist').length,links:linkReport.checked};
let measuredHome=fs.readFileSync('dist/index.html','utf8');
for(const [name,value] of Object.entries(measured)){
 const pattern=new RegExp('(<strong data-build-stat="'+name+'"[^>]*>)[^<]*(</strong>)');
 if(!pattern.test(measuredHome))throw Error('Missing homepage build statistic '+name);
 measuredHome=measuredHome.replace(pattern,(_,open,close)=>open+value.toLocaleString('en-NZ')+close);
}
fs.writeFileSync('dist/index.html',measuredHome);
fs.writeFileSync('docs/verification/home-build-stats.json',JSON.stringify(measured,null,2)+'\n');
console.log('Homepage statistics measured:',measured);
