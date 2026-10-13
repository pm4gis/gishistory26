// Verify the precise social artwork chosen in the conversation.
// This file never redraws a map or substitutes generated visual content.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const target='public/assets/social/nzgis-selected-20261013.jpg';
const image=await readFile(target);
const expected='e3af221679b6360667d1271ca32dd51399f66413f2c0f714791023343601f514';
const actual=createHash('sha256').update(image).digest('hex');
if(actual!==expected)throw Error('The approved user-selected social artwork has changed unexpectedly');
const {width,height,format}=await sharp(image).metadata();
if(width!==1200||height!==630||format!=='jpeg')throw Error('Invalid supplied social artwork dimensions or format');
console.log('Verified user-selected social artwork:',target,width+'x'+height,'SHA-256',actual);
