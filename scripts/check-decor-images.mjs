import {readFileSync,existsSync,statSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const ids=['north2024-raglan1','north2024-atene1','north2024-karikari2','north2024-taranaki1','north2024-moturoais1','north2024-tekaha1','north2024-tararua1','tasman-5','otago-8','otago-1','porirua-teawarua-o-porirua','porirua-whitirea','north2024-hawkes-bay-1','north2024-rangitoto1'];
let total=0, max=0;
for(const id of ids)for(const role of ['background','card']){
  const path=join('public','decor',id+'-'+role+'.webp');
  if(!existsSync(path))throw Error('Missing decorative image '+path);
  const size=statSync(path).size;total+=size;max=Math.max(max,size);
  if(size>150*1024)throw Error('Unnecessarily large decorative image '+path);
  const data=readFileSync(path);
  const m=await sharp(data).metadata();
  if(m.format!=='webp'||m.width!==(role==='card'?768:1600)||!(m.height>=430&&m.height<=910))throw Error('Unexpected image format or dimensions: '+path);
}
console.log('Decorative imagery passed: '+ids.length+' photographs, '+ids.length*2+' optimised WebPs, '+(total/1024/1024).toFixed(2)+' MiB total, max '+(max/1024).toFixed(0)+' KiB');
