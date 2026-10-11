import fs from 'node:fs/promises';

const CUTOFF='2025-12-31';
const BATCH='chapter-image-wave4-2025';
const readJsonDir=async dir=>Promise.all((await fs.readdir(dir)).filter(name=>name.endsWith('.json')).map(async name=>JSON.parse(await fs.readFile(dir+'/'+name,'utf8'))));
const [images,articles,passages]=await Promise.all([
 readJsonDir('src/content/images'),readJsonDir('src/content/articles'),readJsonDir('src/content/passages')
]);
const batch=images.filter(image=>image.collectionBatch===BATCH);
const errors=[];
const allowedLicence=licence=>/^(?:CC0|Public domain(?: \(.*\))?|CC BY(?:-SA)? \d+(?:\.\d+)?(?: [a-z]+)?)$/i.test(String(licence||'').trim());
const futureYear=/\b20(?:2[6-9]|[3-9]\d)\b/;
const year=image=>Number(image.subjectDateEnd?.slice(0,4));
const articleBySlug=new Map(articles.map(article=>[article.slug,article]));
const passageBySlug=new Map(passages.map(passage=>[passage.slug,passage]));
const seen=new Set();
for(const image of batch){
 const key=image.slug||image.id;
 if(seen.has(key))errors.push(key+' duplicate batch slug');
 seen.add(key);
 if(!image.articleSlug||!image.passageSlug)errors.push(key+' missing articleSlug or passageSlug');
 const article=articleBySlug.get(image.articleSlug);
 const passage=passageBySlug.get(image.passageSlug);
 if(!article||!passage||passage.articleId!==article.id)errors.push(key+' points to a passage outside its article');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(image.subjectDateEnd||'')||image.subjectDateEnd>CUTOFF)errors.push(key+' subjectDateEnd is invalid or after '+CUTOFF);
 if(!image.dateEvidenceField||!image.dateEvidenceValue||!String(image.dateEvidenceValue).includes(String(year(image))))errors.push(key+' lacks matching source date evidence');
 if(futureYear.test([image.title,image.caption,image.context,image.dateDisplay,image.sourceFileTitle,image.dateEvidenceValue].filter(Boolean).join(' ')))errors.push(key+' contains a subject date after the cutoff');
 if(!allowedLicence(image.licence)||!image.licenceUrl||!image.sourceUrl||!image.credit)errors.push(key+' lacks approved reuse terms or attribution');
 if(image.headerCandidate!==false)errors.push(key+' should not be marked for a chapter header');
 if(/(?:\bCC BY|\bCC0|licensed under|\bcredit:|\bsource:)/i.test(image.caption||''))errors.push(key+' includes attribution in the chapter caption');
}
if(batch.length&&batch.length<200)errors.push('Only '+batch.length+' new batch images were acquired; at least 200 are required');
if(batch.length>=200){
 const covered=new Set(batch.map(image=>image.chapterNumber).filter(Number.isInteger));
 if(covered.size<44)errors.push('New image batch covers '+covered.size+' of 44 chapters');
}
console.log('Checked '+batch.length+' images in '+BATCH+' against the 2025-12-31 subject-date cutoff and passage links.');
if(errors.length){for(const error of errors)console.error(error);process.exitCode=1}
else console.log('Chapter image batch date evidence, licences, passage links and attribution placement passed.');
