import {contributedPrimarySources} from './contributed-primary-sources.mjs';
import {chapterDocuments} from './chapter-documents.mjs';

// A presentation view over the two accepted registers. Original metadata and bytes
// continue to belong to those registers; no competing document store is created.
const archiveDetails = {
 'ladeda-plotting-handbook-1982': {
  startDate:'1982-05',precision:'month',creatorType:'Person',kind:'Plotting handbook',
  topic:'LADEDA, computer cartography and land-resource inventory',
  themeIds:['open-practice'],
  summary:'R. D. Williams’s May 1982 handbook documents LADEDA plotting commands and worked outputs used in the land-resource information environment.',
  findings:[{page:'Original handbook, 58 PDF pages',text:'The preserved scan contains plotting commands and all 17 numbered examples. PDF page numbers differ from printed page numbers by seven; these examples are not complete first-edition NZLRI worksheets.'}]
 },
 'our-land-resources-1979': {
  startDate:'1979',precision:'year',creatorType:'Organization',kind:'Land-resource bulletin',
  topic:'New Zealand Land Resource Inventory, land-use capability and survey interpretation',
  themeIds:['open-practice'],
  summary:'The 1979 bulletin explains the New Zealand Land Resource Inventory and the interpretation of its mapped land-resource information.',
  findings:[{page:'PDF pp. 14–15',text:'The bulletin reproduces a worksheet excerpt and enlarged inventory codes. It does not identify this excerpt as a separately numbered, complete worksheet. The archived PDF contains 79 pages although the institutional catalogue describes 80.'}]
 },
 'hocken-maps-and-plans-guide': {
  startDate:null,precision:'unknown',creatorType:'Organization',kind:'Archival reference guide',
  topic:'Hocken Collections, historical maps, plans and archival discovery',
  themeIds:[],date:'Publication date not established',
  summary:'An undated University of Otago guide to maps and plans held by the Hocken Collections, including references to digitised and undigitised material.',
  findings:[{page:'Cover and file metadata',text:'The cover describes the Hector map as 1864? and identifies Map Collection 880 [1864] caq. An April 2026 file-creation date does not establish the guide’s publication date or the date of the historical map. This reference guide has no dated historical timeline entry.'}]
 },
 'geodatahub-drecki-2019': {
  startDate:'2019-07-15',precision:'day',creatorType:'Person',kind:'Conference abstract',
  topic:'GeoDataHub, university map collections and geospatial repositories',
  themeIds:['profession'],
  summary:'Igor Drecki’s 2019 conference abstract describes a centralised repository of authoritative cartographic and geospatial resources at the University of Auckland.',
  findings:[{page:'PDF p. 1',text:'Published in Abstracts of the International Cartographic Association 1, 66, with DOI 10.5194/ica-abs-1-66-2019. It describes GeoDataHub in 2019, without establishing availability during earlier university courses.'}]
 }
};

export const archivedChapterPublications = chapterDocuments.map(document=>{
 const details=archiveDetails[document.slug];
 if(!details)throw new Error('Missing publication presentation for '+document.slug);
 return {
  ...document,...details,format:'PDF',pages:document.pdfPages,
  filename:document.assetPath.split('/').at(-1),
  article:document.articleSlug,publicationUrl:'/publications/'+document.slug+'/',
  legacyDocumentUrl:'/documents/'+document.slug+'/',
  chapterUrl:'/stories/'+document.articleSlug+'/#'+document.afterParagraphId,
  viewerPath:document.assetPath,
  coverPath:'/assets/historical/publications/'+document.slug+'-cover.png',
  thumbnailPath:'/assets/historical/publications/'+document.slug+'-card.webp',
  archivedDate:'2026-10-11',cataloguedDate:'2026-10-17',
  provenance:'Existing institutional-source copy archived by the project on 11 October 2026; added to the shared Publications catalogue on 17 October 2026. The original asset URL, byte count, checksum and attribution are retained. Catalogue inclusion does not grant a new reuse licence.',
  related:[document.creator,document.title,details.topic],
  recordIds:[],eventId:null,historicalTimelineEligible:details.startDate!==null
 };
});

export const publications = [
 ...contributedPrimarySources.map(item=>({...item,eventId:'source-'+item.slug,chapterUrl:'/stories/'+item.article+'/',historicalTimelineEligible:true})),
 ...archivedChapterPublications
];
