import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync,statSync} from 'node:fs';
import {resolve} from 'node:path';
import sharp from 'sharp';

const names=['north2024-raglan1','north2024-atene1','north2024-karikari2','north2024-taranaki1','north2024-moturoais1','north2024-tekaha1','north2024-tararua1','tasman-5','otago-8','otago-1','porirua-teawarua-o-porirua','porirua-whitirea','north2024-hawkes-bay-1','north2024-rangitoto1'];
const folder=resolve('public/decor');

test('only the selected web-optimised decorative assets ship',()=>{
  const expected=names.flatMap(id=>[id+'-background.webp',id+'-card.webp']).sort();
  assert.deepEqual(readdirSync(folder).sort(),expected);
});

test('all decorative assets are compact, decodable WebP files',async()=>{
  for(const id of names)for(const variant of ['background','card']){
    const filename=resolve(folder,id+'-'+variant+'.webp');
    assert.ok(statSync(filename).size<150*1024,id+' '+variant+' is too large');
    const image=await sharp(readFileSync(filename)).metadata();
    assert.equal(image.format,'webp');
    assert.equal(image.width,variant==='card'?768:1600);
    assert.ok(image.height>=430&&image.height<=910);
  }
});
