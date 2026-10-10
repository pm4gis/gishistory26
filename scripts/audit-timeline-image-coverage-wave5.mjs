/**
 * Build a complete 189-event timeline illustration coverage register.
 * Editorial relationships are explicitly curated in timeline-media.mjs.
 * Do not infer exact historical depiction from a shared chapter or theme.
 */
import {readdir,readFile,writeFile,access} from 'node:fs/promises';
import {join} from 'node:path';
import {timelineMedia} from '../src/lib/timeline-media.mjs';

const readJson=async p=>JSON.parse(await readFile(p,'utf8'));
const byFolder=async folder=>Promise.all((await readdir(folder)).filter(n=>n.endsWith('.json')).sort().map(n=>readJson(join(folder,n))));
const [events,images]=await Promise.all([byFolder('src/content/events'),byFolder('src/content/images')]);
const eventById=new Map(events.map(x=>[x.id,x]));
const imageBySlug=new Map(images.map(x=>[x.slug,x]));
const csvCell=x=>'"'+String(x??'').replaceAll('"','""').replaceAll(/\r?\n/g,' ')+'"';
const rows=[];
const missingLinks=[];
const direct=new Set(['2011-christchurch-earthquake','2016-kaikoura-earthquake']);
const priorities=[
 ['1939-first-nzms1','Obtain verified 1939 first-edition N134 from National Library MapColl 830cba/1939-/15175; 1943 revised N134 is a different edition.'],
 ['1977-mappak','Locate Lands and Survey MAPPAK PDP-11 screen, printed map or equipment photograph.'],
 ['1977-nzlri-digitisation','Locate a licensed original NZMS 290/NZLRI sheet or 1970s digitisation photograph.'],
 ['1982-arcinfo','Find a dated early ARC/INFO screen or New Zealand institutional project output.'],
 ['2001-landonline','Locate an authentic 2001 Landonline screen; currently linked 2025 web interface is later.'],
 ['2003-docgis-java','Locate and document early DOCgis client screenshots and the 2013 public printed map.'],
 ['2010-lris','Find 2010 LRIS Portal interface or report figures with reproducible media rights.'],
 ['2011-s-map-online','Locate an identifiable dated S-map Online interface or output.'],
 ['2023-nzta-gabrielle','Find an NZTA ArcGIS Enterprise situational-awareness screenshot from Cyclone Gabrielle; satellite flooding is event context only.'],
 ['2007-google-maps-nz','Find contemporaneous Google Maps New Zealand UI or historical launch screenshot with permitted reuse conditions; period NASA World Wind shown only as a distinct supporting example.']
];
for(const key of Object.keys(timelineMedia))if(!eventById.has(key))missingLinks.push('Missing timeline event '+key);
for(const e of events){
 const ref=timelineMedia[e.id];
 const img=ref?imageBySlug.get(ref.slug):null;
 if(ref?.slug&&!img)missingLinks.push('Missing image '+ref.slug+' for '+e.id);
 for(const slug of ref?.additionalSlugs||[]){
   const supplement=imageBySlug.get(slug);
   if(!supplement){missingLinks.push('Missing supplementary image '+slug+' for '+e.id);continue;}
   if(!supplement.sourceUrl||!supplement.credit||!supplement.licenceUrl)missingLinks.push('Missing supplementary attribution '+slug);
   for(const asset of [supplement.assetPath,supplement.thumbnailPath||supplement.assetPath])try{await access(join('public',asset))}catch{missingLinks.push('Missing supplementary file '+asset);}
 }
 if(img){
  if(!img.sourceUrl||!img.credit||!img.licenceUrl||!img.assetPath)missingLinks.push('Incomplete image evidence '+img.slug);
  for(const asset of [img.assetPath,img.thumbnailPath||img.assetPath]){
   try{await access(join('public',asset))}catch{missingLinks.push('Missing local asset '+asset+' for '+e.id);}
  }
  if(!ref.relation||ref.relation.length<30)missingLinks.push('Missing contextual accuracy note for '+e.id);
 }
 const status=!img?((ref?.additionalSlugs||[]).length?'supplementary only':'unillustrated'):direct.has(e.id)?'event subject':'contextual illustration';
 rows.push([e.id,e.dateDisplay,e.label,e.url||'',status,img?.slug||'',img?.dateDisplay||'',img?.sourceUrl||'',img?.credit||'',img?.licence||'',ref?.relation||'',ref?.sourceLink||'',(ref?.additionalSlugs||[]).join('; '),(ref?.moreSources||[]).map(x=>x.url).join('; '),e.passageIds?.length||0,e.recordIds?.length||0,e.sources?.length||0]);
}
if(missingLinks.length)throw Error('Timeline image audit errors:\n'+missingLinks.join('\n'));
const headers=['event_id','date','event_title','linked_account','illustration_status','image_slug','image_date','image_source_url','image_credit','image_licence','accuracy_note','additional_original_source','supplementary_image_slugs','additional_archive_urls','passage_count','related_record_count','event_source_count'];
const csv=[headers,...rows].map(r=>r.map(csvCell).join(',')).join('\n')+'\n';
const illustrated=rows.filter(x=>x[4]==='event subject'||x[4]==='contextual illustration');
const supplementaryOnly=rows.filter(x=>x[4]==='supplementary only');
const exact=rows.filter(x=>x[4]==='event subject');
const missing=rows.filter(x=>x[4]==='unillustrated'||x[4]==='supplementary only');
const notes=[
 '# NZ GIS History timeline image coverage, wave 5',
 '',
 'Generated against the complete currently checked-in events and image collection. Every row in the accompanying CSV identifies an event, whether it has a documentary image, and the exact source and credit recorded on the image-detail page.',
 '',
 '| Measure | Count |',
 '| --- | ---: |',
 '| Timeline events audited | '+events.length+' |',
 '| Events with a curated image | '+illustrated.length+' |',
 '| Events without a card image | '+missing.length+' |',
 '| Events with supporting images but no card background | '+supplementaryOnly.length+' |',
 '| Events with directly matched image subjects | '+exact.length+' |',
 '| Contextual illustrations with explanatory notes | '+(illustrated.length-exact.length)+' |',
 '| Registered image pages | '+images.length+' |',
 '',
 'The coverage count is not a claim that every pictured scene dates to the event. Many images are later documentary maps, photographs or software screenshots that illustrate the same subject. Their relationships and historical differences are explicitly disclosed in the event detail panel. The 1939 first NZMS 1 map remains linked to the source catalogue while an approved original or derivative is sought.',
 '',
 '## Highest-value original-image gaps',
 '',
 ...priorities.map(([id,note])=>'- '+id+': '+note),
 '',
 '## Publication rule',
 '',
 'Every background resolves to a locally stored WebP and an attributed individual /images/<slug>/ page. No images are added from uncontrolled remote hotlinks. All files are validated for local existence, subject-specific descriptive note, source URL, credit and licence. Where original images are unavailable, retained public source links are not counted as a locally published image.',
 '',
 '## Unillustrated event identifiers',
 '',
 ...missing.map(r=>'- '+r[0]+' | '+r[2]),
 ''
].join('\n');
await writeFile('docs/media/timeline-event-image-coverage-wave5.csv',csv);
await writeFile('docs/media/timeline-event-image-coverage-wave5.md',notes);
console.log(JSON.stringify({events:events.length,images:images.length,illustrated:illustrated.length,exact:exact.length,contextual:illustrated.length-exact.length,unillustrated:missing.length,supplementaryOnly:supplementaryOnly.length,files:['docs/media/timeline-event-image-coverage-wave5.csv','docs/media/timeline-event-image-coverage-wave5.md']}));
