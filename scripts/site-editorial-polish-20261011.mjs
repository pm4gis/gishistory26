// Second editorial pass: reviewed prose corrections, with exact-match leases.
// Preserves all content IDs, paragraph sources, imagery licences and route fields.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const work='src/content/';
function change(p,oldText,newText){
 const s=fs.readFileSync(p,'utf8');
 if(!s.includes(oldText))throw Error('Expected source phrase missing in '+p+': '+oldText.slice(0,90));
 fs.writeFileSync(p,s.replaceAll(oldText,newText));
}
function jsonText(p,oldText,newText){
 const doc=JSON.parse(fs.readFileSync(p,'utf8'));
 let count=0;
 const walk=(x)=>{
  if(typeof x==='string'){if(x.includes(oldText)){count++;return x.replaceAll(oldText,newText);}return x;}
  if(Array.isArray(x))return x.map(walk);
  if(x&&typeof x==='object')for(const k of Object.keys(x))x[k]=walk(x[k]);
  return x;
 };
 walk(doc);
 if(!count)throw Error('Expected source phrase missing in '+p+': '+oldText.slice(0,90));
 fs.writeFileSync(p,JSON.stringify(doc,null,2)+'\n');
}
// A previous mechanical sweep inadvertently trimmed trailing spaces in these
// source files. Restore the accepted source text before applying reviewed changes.
const restoreFiles=[
 'articles/gis-at-the-end-of-2025.json','articles/gis-inside-government.json',
 'articles/lidar-remakes-the-landscape.json','articles/when-gis-became-gis.json',
 'passages/chapter-32-p001.json','passages/chapter-33-p008.json','passages/chapter-34-p011.json',
 'passages/chapter-35-p001.json','passages/chapter-35-p008.json','passages/chapter-38-p013.json',
 'passages/chapter-39-p004.json','passages/chapter-40-p006.json','passages/chapter-41-p013.json',
 'records/david-pimblott.json','records/drawing-maps-by-machine.json',
 'records/earth-observation-becomes-routine.json','records/gis-inside-government.json',
 'records/journey-gis.json','records/kat-salm.json','records/kirsty-mackie.json',
 'records/open-source-changes-the-tools.json','records/robert-sanson.json',
 'records/the-real-time-map.json','records/turning-the-landscape-into-numbers.json',
 'records/universities-build-a-field.json'
];
execFileSync('git',['restore','--source=origin/main','--',...restoreFiles.map(x=>work+x)]);
const edits=[
 ['passages/chapter-2-p006.json','The distinction matters when reading a claim that mapping had been computerised. A survey office could calculate coordinates electronically while draughting, photographic reproduction and final map compilation still happened through established production methods.','A survey office in 1966 could calculate coordinates electronically while producing and revising maps through established draughting and photographic methods. Computerised calculation came before digital map compilation.'],
 ['records/wellington-earthquake-lifelines-group.json','The distinction matters: an exercise and a proposal are evidence of coordination work, rather than proof that every organisation had installed the same GIS.','The 1996 exercise and the proposed centre document regional coordination. Brunsdon’s account provides no evidence that all participating organisations were operating a shared GIS at that date.'],
 ['passages/chapter-36-p001.json','In October 1975 a New Zealand Landsat II scene entered a computing world that looked nothing like modern GIS. The DSIR Physics and Engineering Laboratory programme handled satellite data through computer-compatible tapes, IBM mainframe processing, minicomputers and programs written in PL/I. Images had to be rectified, classified and interpreted by specialists who understood both the sensor and the limitations of the available computers. That early work established that satellite observation could contribute to New Zealand mapping and environmental analysis, but there was nothing routine about it. Obtaining a scene was only the beginning. Turning it into useful geographic information was a substantial technical project in its own right.','In October 1975, staff at the DSIR Physics and Engineering Laboratory processed Landsat II imagery using computer-compatible tapes, IBM mainframe processing, minicomputers and programs written in PL/I. Specialists rectified, classified and interpreted the imagery, working within the limitations of the available computers and image-processing software. Each scene required considerable technical work before it could contribute to mapping or environmental analysis.'],
 ['passages/chapter-36-p001.json','By the 2020s the same country could be represented by repeated national satellite mosaics, multispectral time series and land-cover products available through ordinary data services. A GIS analyst no longer needed to begin with magnetic tape or build a complete processing chain simply to look at a new observation. Satellite earth observation did not suddenly become useful when a particular sensor was launched, and it did not replace aerial photography. It became routine when repeated observations could be found, processed, compared and incorporated into continuing geographic datasets and operational workflows.','By the 2020s, New Zealand analysts could obtain repeated satellite observations, national mosaics and land-cover datasets through established data services. Online archives and processing software allowed them to examine imagery from many dates and use it alongside other spatial information. Repeated acquisitions and sustained data maintenance supported routine environmental monitoring, while aerial photography continued to serve applications requiring different detail and timing.'],
 ['passages/chapter-36-p003.json','That repeated character became more important as the series continued.','Later LCDB editions extended the sequence of national land-cover maps.'],
 ['passages/chapter-36-p004.json','The 2012 LUCAS interpretation guide did not treat imagery as self-explanatory. It defined land-use classes and described how interpreters should identify them from remotely sensed evidence.','The 2012 LUCAS interpretation guide defined land-use classes and described how interpreters should identify them from remotely sensed evidence.'],
 ['passages/chapter-36-p004.json',' More automation did not turn national land-use mapping into a one-button classification problem.',''],
 ['passages/chapter-36-p006.json','The satellite had been repeatedly observing the country whether or not a particular New Zealand agency had an active project underway. Once those observations were easily accessible, the archive became a time machine with some fairly obvious caveats: different sensors, different seasons, cloud, missing data and changing preprocessing all had to be handled properly.','The archive included acquisitions from years when New Zealand agencies had no particular project using them. Historical comparisons still required care with sensor differences, seasonal variation, cloud, missing data and changes in preprocessing.'],
 ['images/gisborne-east-coast-luc-map-1967.json','This is direct evidence for the eight-class LUC scheme discussed in this paragraph; it is not a first-edition NZLRI worksheet, digitisation photograph or LADEDA output.','The 1967 map documents the eight-class Land Use Capability scheme and predates the first-edition NZLRI mapping programme of 1973–1979.'],
 ['images/nasa-world-wind-napier-2006.json','This illustrates a contemporaneous online globe, not Google Maps, Google Earth or the 2007 localised New Zealand Google Maps interface.','The interface is NASA World Wind, as identified in the original source.'],
 ['images/linz-wfs-attribute-service-2023.json','It illustrates interoperable APIs and is not the first appearance of web geospatial services in New Zealand.','The screenshot shows the LINZ Web Feature Service request and response example.'],
 ['images/nz-libraries-wikidata-osm-2019.json','A genuine 2019 browser-based map, made long after the first New Zealand web maps of the late 1990s and early 2000s. It illustrates the later combination of open map services and linked data. It is not a screenshot of GUILD-on-the-Web, PHEW!, or the original 2001 Census WebMap.','A browser-based map created in 2019 from Wikidata and OpenStreetMap, showing New Zealand libraries.'],
 ['images/d2f88a23489401ef1cb1e75f.json','It illustrates a government fieldwork setting before mobile GIS; it is not evidence of a GIS-based field workflow.','The photograph records the preparation for a Ministry of Works field trip in March 1971.'],
 ['images/nasa-terra-modis-nz-2002.json','Shows the extent and regional coverage of early 2000s orbital environmental observations.','The scene shows most of the North and South Islands under nearly cloud-free conditions.']
];
for(const [p,from,to] of edits)jsonText(work+p,from,to);
const manifest=JSON.parse(fs.readFileSync('content/preservation-manifest.json','utf8'));
const changed=execFileSync('git',['diff','--name-only','origin/main','--','src/content'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
for(const p of changed)if(Object.hasOwn(manifest,p)&&fs.existsSync(p))manifest[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.writeFileSync('content/preservation-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log('Context-reviewed phrase edits applied: '+edits.length+'; accepted text restored in '+restoreFiles.length+' files; manifest updated for '+changed.length+' content files.');
