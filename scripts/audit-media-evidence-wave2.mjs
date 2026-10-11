/**
 * Evidence-gated audit of all public image records, including the 106 archived
 * 11 October acquisitions. This is an editorial decision register: in-story
 * placement is earned by an exact paragraph association, never by category.
 * Archived-but-unplaced images remain available for galleries and image pages.
 */
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {placeChapterImages,reviewedImagePassages,curatedImageParagraphs} from '../src/lib/chapter-media.mjs';
const root='src/content/';
const readJson=async directory=>Promise.all((await readdir(root+directory))
 .filter(f=>f.endsWith('.json')).map(async f=>JSON.parse(await readFile(root+directory+'/'+f,'utf8'))));
const [articles,passages,images]=await Promise.all(['articles','passages','images'].map(readJson));
const previouslyAcquired=(await readFile('docs/media/chapter-image-alignment-20261011.csv','utf8'))
 .split(/\r?\n/).slice(1).map(line=>line.match(/"(?:[^"]|"")*"|[^,]+/g)?.[0]?.replaceAll('"','')).filter(Boolean);
const wave=new Set(previouslyAcquired);
const imageIndex=new Map(images.map(i=>[i.id,i]));
const figureImageIds=new Set(passages.flatMap(p=>p.blocks||[])
 .filter(b=>b.type==='figure'&&b.imageId).map(b=>b.imageId));
const usage=[];
const missing=[];
for(const article of articles){
 const story=passages.filter(p=>p.articleId===article.id);
 const assigned=placeChapterImages(article,story,images);
 for(const [passageId,linked] of Object.entries(assigned)){
  const p=story.find(q=>q.id===passageId);
  for(const item of linked){
   const paragraph=p?.blocks?.find(b=>b.id===item.inlineAfterBlockId&&b.type==='paragraph');
   if(!paragraph)missing.push(item.slug+': image without verified paragraph in '+article.slug);
   usage.push({slug:item.slug,chapter:article.slug,paragraph:item.inlineAfterBlockId,
     section:p?.title||'',sourceType:reviewedImagePassages[item.slug]?'reviewed-original':'existing-explicit-anchor'});
  }
 }
}
const bySlug=new Map();
for(const u of usage){if(bySlug.has(u.slug))missing.push('Ambiguous or duplicate inline image '+u.slug);bySlug.set(u.slug,u);}
for(const [slug,review] of Object.entries(reviewedImagePassages)){
 const image=images.find(i=>i.slug===slug);
 if(!image||!image.sourceUrl||!image.licence||!image.licenceUrl)missing.push('Incomplete reviewed provenance '+slug);
 const link=bySlug.get(slug);
 if(!link||link.paragraph!==review.afterParagraphId||link.chapter!==review.articleSlug)missing.push('Reviewed item missing exact expected anchor '+slug);
}
if(images.length!==181||wave.size!==106)missing.push('Source collection changed: images='+images.length+', prior acquisition='+wave.size);
const detail=item=>{
 const title=item.title||item.slug; const chapter=item.articleSlug||'';
 const prefix='Image '+JSON.stringify(title)+'. ';
 if(/^(?:doc-cadastre-|wave6-curated-7a04)/.test(item.slug) || /Crown Grant Map/i.test(title))
  return prefix+'This particular grant or cadastral sheet is not identified as a digital system input or output in '+chapter+'. An old property map cannot stand in for DCDB or Landonline software.';
 if(/^(?:doc-historic-map-|wave6-curated-)/.test(item.slug) && /map|chart|survey|sketch|plan|islands/i.test(title))
  return prefix+'The mapped place or paper sheet is not specifically analysed in the target passage. A historical map on its own does not illustrate the named computer mapping workflow or system.';
 if(/^(?:retrolens-|doc-aerial-|wave6-curated-)/.test(item.slug)&&/aerial|Retrolens|photo/i.test(title))
  return prefix+'The frame and its date are documentary, but the chapter does not identify this specific survey, flight or location. Do not repeatedly illustrate processing with arbitrary aerial views.';
 if(/(?:geolog|fault|zealandia|topograph|relief|Gondwana)/i.test(title))
  return prefix+'The geological or terrain subject is not the identified land-inventory worksheet, dataset or geological analysis discussed in the passage. Avoid substituting an unrelated map.';
 if(/(?:satellite|landsat|sentinel|Whakaari|Whakahau)/i.test(title))
  return prefix+'An authentic observation or satellite-derived figure, but no confirmed tie to the particular dataset, mission analysis or named place in the published passage. Additional general satellite scenery is unnecessary.';
 if(/(?:earthquake|hazard|intensity|shakemap|risk)/i.test(title))
  return prefix+'This hazard or event map has no proven direct relationship to the specific response system, GIS product or dated event discussed in the candidate passage.';
 return prefix+'No individually evidenced image-to-paragraph relationship has been confirmed in the chapter text. Retain source metadata and image file; do not imply a connection from geography or shared theme alone.';
};
const csv=v=>'"'+String(v??'').replaceAll('"','""').replaceAll(/\r?\n/g,' ')+'"';
const records=images.map(image=>{
 const use=bySlug.get(image.slug);
 const reviewed=reviewedImagePassages[image.slug];
 const embedded=figureImageIds.has(image.id)||figureImageIds.has(image.slug);
 const state=use?'inline-linked':embedded?'embedded-figure':'archive-only-for-chapters';
 const disposition=reviewed?'accepted: exact source-to-paragraph match':
    use?'accepted: existing explicit paragraph/passage reference':
    embedded?'accepted: historical figure already embedded in original prose':
    'held: no subject-specific paragraph match';
 const evidence=reviewed?.evidence|| (use ? 'Existing paragraph association; preserve pending further source review':
 embedded?'Embedded in accepted chapter prose; left untouched':detail(image));
 return {slug:image.slug,title:image.title,collection:wave.has(image.slug)?'new-106':'earlier-75',
  originalChapter:image.articleSlug||'',status:state,disposition,
  linkedChapter:use?.chapter||'',passage:use?.section||'',paragraph:use?.paragraph||'',
  imageDate:image.dateDisplay||'',sourceUrl:image.sourceUrl||'',licence:image.licence||'',
  licenceEvidence:image.licenceEvidenceUrl||image.licenceUrl||'',editorialEvidence:evidence};
}).sort((a,b)=>a.collection.localeCompare(b.collection)||a.slug.localeCompare(b.slug));
const keys=Object.keys(records[0]);
await writeFile('docs/media/chapter-image-alignment-wave2-20261011.csv',keys.join(',')+'\n'+records.map(x=>keys.map(k=>csv(x[k])).join(',')).join('\n')+'\n');
const newBatch=records.filter(x=>x.collection==='new-106');
const totals=records.reduce((o,x)=>(o[x.status]=(o[x.status]||0)+1,o),{});
const originalNames=['mapping-land-as-data','the-cadastre-becomes-data','imagery-becomes-infrastructure','councils-build-corporate-gis','earth-observation-becomes-routine','the-real-time-map'];
const count=slug=>usage.filter(x=>x.chapter===slug).length;
const oldReviewed=['doc-historic-map-6c572e829a93c5f5','doc-historic-map-777b1981f3a8ee1d','doc-aerial-5c1e84f30e04f7e4','wave6-curated-7a04bfeaf63f78f1','retrolens-c515a148bd788efa','retrolens-fb8cfefdccb907d2','nasa-terra-modis-nz-2002','usgs-hundred-millionth-landsat-nz-2017','nasa-landsat4-tasman-1990','nasa-aster-tasman-2007'];
const added=Object.entries(reviewedImagePassages).filter(([slug])=>!oldReviewed.includes(slug));
const md=[
 '# All-image paragraph evidence audit, second wave — 11 October 2026',
 '',
 'This supersedes the alignment decisions in the first-wave CSV while preserving it as an immutable historical checkpoint. The source collection is unchanged. Editorial matches link an actual historical item to a passage that discusses the same data, sensor, process or named event. No chronological or alphabetic scattering of maps is permitted.',
 '',
 '## Full inventory',
 '',
 '- '+images.length+' public image records evaluated (originals, source metadata and derivative paths unchanged).',
 '- '+newBatch.length+' October 11 acquired images, including '+newBatch.filter(x=>x.status==='inline-linked').length+' with paragraph-grounded matches and '+newBatch.filter(x=>x.status!=='inline-linked').length+' retained outside chapter prose.',
 '- '+(images.length-newBatch.length)+' earlier registered images, including already accepted inline/embedded uses. Previously sourced image-detail pages, timeline associations and record/theme media are preserved.',
 '- Total unique in-story auto placements across all chapters: '+usage.length+'. This count excludes independently embedded figure blocks.',
 '- Image disposition across all records: '+Object.entries(totals).map(([k,v])=>v+' '+k).join('; ')+'.',
 '- New exact paragraph matches approved in this wave: '+added.length+'. Their source originals and reuse terms were already registered and independently checked where a source record was available.',
 '',
 '## Priority chapters',
 '',
 ...[5,7,13,20,23,36,42].map(n=>{const art=articles.find(a=>a.readingOrder===n);return '- Chapter '+n+' ('+(art?.title||'')+'): '+(art?count(art.slug):0)+' evidence-based inline images; no addition was made simply to meet a per-chapter quantity.'}),
 '',
 '## Accepted additions',
 '',
 '| Image | Exact text anchor | Why accepted |',
 '| --- | --- | --- |',
 ...added.map(([slug,x])=>'| '+images.find(i=>i.slug===slug)?.title.replaceAll('|','/')+' | '+x.articleSlug+' / `'+x.afterParagraphId+'` | '+x.evidence.replaceAll('|','/')+' |'),
 '',
 '## Deliberately held',
 '',
 'The accompanying 181-row CSV documents each retained item separately, identifies its subject, source, copyright/licence statement, current chapter association, editorial disposition and rationale. In particular: antique nautical charts were not repurposed as computer-era topography; unidentified old geological sheets were not called NZLRI worksheets; unrelated municipal maps were not inserted into corporate council GIS history; independent earthquake shakemaps were not labelled as CERA, LINZ, GeoNet or NEMA operational products.',
 '',
 'Legacy image records still used on timeline, theme or organisation pages are unaffected by decisions about inline placement. The editorial standard is more demanding for a figure inserted beside the prose than for a properly labelled searchable source image. An image-detail page alone does not establish a passage relationship.',
 '',
 'Original manuscript passages, identifiers, images, licence records and existing approved figures were not rewritten. A missing historical system screenshot remains a research gap, not an invitation to substitute scenery.',
 '',
 '## Verification',
 '',
 'Regenerate with `node scripts/audit-media-evidence-wave2.mjs` and inspect the 181 rows. Execute `npm test` and `npm run build`, including the existing preservation checks. Then run the desktop/mobile Chromium script `scripts/eight-chapter-browser-qa.mjs`; confirm the Cloudflare preview and production URLs. Reject the release on mismatched paragraph anchors, missing source records, broken images or failed tests.',
 ''
];
await writeFile('docs/media/chapter-image-alignment-wave2-20261011.md',md.join('\n'));
if(missing.length){console.error(missing.join('\n'));process.exitCode=1;}
else console.log('Verified '+records.length+' source records, '+newBatch.length+' newly acquired, '+usage.length+' inline, '+added.length+' newly approved. '+Object.entries(totals).map(([k,v])=>k+':'+v).join(', '));
