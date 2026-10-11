/** Audit actual in-story image placement, not chapter-level metadata tags. */
import fs from 'node:fs/promises';
import {placeChapterImages,reviewedImagePassages} from '../src/lib/chapter-media.mjs';
const load=async(dir)=>Promise.all((await fs.readdir(dir)).filter(x=>x.endsWith('.json'))
 .map(async x=>JSON.parse(await fs.readFile(dir+'/'+x,'utf8'))));
const [articles,passages,images]=await Promise.all(['articles','passages','images'].map(n=>load('src/content/'+n)));
const wave=JSON.parse(await fs.readFile('docs/media/documentary-image-wave6-result-20261011.json','utf8'));
const edits=JSON.parse(await fs.readFile('docs/media/documentary-wave6-curation-result-20261011.json','utf8'));
const retrolens=JSON.parse(await fs.readFile('docs/media/retrolens-primary-frames-run-20261011.json','utf8'));
const nasa=JSON.parse(await fs.readFile('docs/media/nasa-nz-satellite-wave-run-20261011.json','utf8'));
const rejected=new Set(edits.cullReasons.map(x=>x.slug));
const wave6=wave.items.filter(x=>x.status==='archived'&&!rejected.has(x.slug)).map(x=>x.slug)
 .concat(edits.items.filter(x=>x.status==='archived').map(x=>x.slug));
const acquisitions=[...wave6,...retrolens.items.filter(x=>x.status==='archived').map(x=>x.slug),...nasa.items.filter(x=>x.status==='archived').map(x=>x.slug)];
const index=new Map(images.map(x=>[x.slug,x]));
const placements=[];
for(const article of articles){
 const active=passages.filter(p=>p.articleId===article.id);
 const result=placeChapterImages(article,active,images);
 for(const [passageId,items] of Object.entries(result))for(const image of items){
  const p=active.find(p=>p.id===passageId);
  if(!p.blocks?.some(b=>b.id===image.inlineAfterBlockId&&b.type==='paragraph'))throw Error('Image without an actual paragraph '+image.slug);
  placements.push({slug:image.slug,articleSlug:article.slug,passageTitle:p.title,afterParagraphId:image.inlineAfterBlockId});
 }
}
const referenced=placements.filter(x=>acquisitions.includes(x.slug));
const unique=new Set(acquisitions);
if(unique.size!==106||referenced.length!==Object.keys(reviewedImagePassages).length)throw Error('Image register or editorial matches changed unexpectedly');
const escape=x=>'"'+String(x??'').replaceAll('"','""').replaceAll(/\r?\n/g,' ')+'"';
const records=acquisitions.map(slug=>{
 const image=index.get(slug);if(!image)throw Error('Missing archived metadata '+slug);
 const match=referenced.find(x=>x.slug===slug);
 return {slug,title:image.title,originalChapter:image.articleSlug||'',placement:match?'reviewed-inline':'archive-only',
 article:match?.articleSlug||'',passage:match?.passageTitle||'',paragraph:match?.afterParagraphId||'',
 evidence:reviewedImagePassages[slug]?.evidence||'No verified match to a specific historical passage; retained as a source record only.',
 source:image.sourceUrl||'',licence:image.licence||'',date:image.dateDisplay||''};
});
const headings=Object.keys(records[0]);
await fs.writeFile('docs/media/chapter-image-alignment-20261011.csv',headings.join(',')+'\n'+records.map(x=>headings.map(y=>escape(x[y])).join(',')).join('\n')+'\n');
const chapterCounts={};for(const p of referenced)chapterCounts[p.articleSlug]=(chapterCounts[p.articleSlug]||0)+1;
const lines=[
 '# Chapter-image alignment correction, 11 October 2026',
 '',
 'The original 106-image acquisition was assigned to broad chapters and then automatically distributed across reading sections. This produced images beside unrelated paragraphs. That behaviour has been removed.',
 '',
 '- Existing archive: '+images.length+' registered source images, including '+acquisitions.length+' in the three October 11 acquisition batches.',
 '- Corrected image publication: '+referenced.length+' individually reviewed additional images with specific paragraph anchors in '+Object.keys(chapterCounts).length+' chapters.',
 '- Archive-only from new batches: '+(acquisitions.length-referenced.length)+'. Their copied originals, image pages, credits and licences remain available, but they are not inserted into stories merely to increase visual coverage.',
 '- Older image records without a specific paragraph/passage anchor are also excluded from automatic story placement. Existing explicitly embedded passage figures remain intact.',
 '- Seven previously reused contextual chapter illustrations are no longer forced into unrelated chapters. No approved story paragraphs, figures, source metadata or original binaries were deleted.',
 '',
 '## Confirmed matches',
 '',
 '| Chapter | Passage | Image | Exact paragraph | Why it belongs here |',
 '| --- | --- | --- | --- | --- |',
 ...referenced.map(p=>{const image=index.get(p.slug);return '| '+p.articleSlug+' | '+p.passageTitle.replaceAll('|','/')+' | '+image.title.replaceAll('|','/')+' | `'+p.afterParagraphId+'` | '+reviewedImagePassages[p.slug].evidence.replaceAll('|','/')+' |'}),
 '',
 '## Editorial rules',
 '',
 'A source-image category or `articleSlug` is not sufficient for publication in a story. A reviewed assignment must identify the actual paragraph and the documented relationship between its subject and the image. The caption must state the date and disclose contextual use without implying a historic first or that a source map was an original GIS system screen.',
 '',
 'Never auto-distribute leftover images alphabetically or equally across sections. Keep nonmatching files searchable as individual source-image records, and reassess them only if a suitable passage actually discusses the pictured system, dataset, person or process. The accompanying CSV accounts for all '+acquisitions.length+' new images with current status.',
 ''
];
await fs.writeFile('docs/media/chapter-image-alignment-20261011.md',lines.join('\n'));
console.log('Audited: '+acquisitions.length+' acquired; '+referenced.length+' reviewed-inline; '+(acquisitions.length-referenced.length)+' archive-only; '+placements.length+' total in-story images.');
