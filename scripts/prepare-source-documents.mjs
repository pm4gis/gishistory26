import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {chapterDocuments} from '../src/lib/chapter-documents.mjs';
for(const document of chapterDocuments){
 if(!document.archiveParts)continue;
 const original=Buffer.concat(document.archiveParts.map(part=>fs.readFileSync(part)));
 if(original.length!==document.bytes || crypto.createHash('sha256').update(original).digest('hex')!==document.sha256)throw new Error('Original source archive integrity failed: '+document.slug);
 const destination='public'+document.assetPath;
 fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,original);
 console.log('Prepared unchanged original document: '+document.slug);
}
