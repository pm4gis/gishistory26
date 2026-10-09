import fs from 'node:fs';
export function rawDataset(){return Object.fromEntries(['articles','passages','records','events','relationships','themes','images'].map(n=>[n,fs.readdirSync('src/content/'+n).filter(f=>f.endsWith('.json')).sort().map(f=>JSON.parse(fs.readFileSync('src/content/'+n+'/'+f)))]))}
