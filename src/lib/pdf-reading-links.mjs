import {chapterDocuments} from './chapter-documents.mjs';
import {contributedPrimarySources} from './contributed-primary-sources.mjs';
import {onlinePdfPublications} from './online-pdf-publications.mjs';

// Resolve known PDF URLs to their own on-site reading pages. Source metadata
// remains unchanged; only navigational links are rewritten.
const pdfLike = url => typeof url === 'string' && (/\.pdf(?:$|[?#])/i.test(url) || /\/download(?:$|[?#])/i.test(url));
const normalise = url => {
 if(typeof url !== 'string' || !url.trim())return '';
 try {
  const parsed=new URL(url,'https://history.pm4gis.nz');
  const pathname=decodeURI(parsed.pathname).replace(/\/$/,'')||'/';
  return (parsed.origin==='https://history.pm4gis.nz'?'':parsed.origin)+pathname+parsed.search;
 } catch {return url.split('#')[0].trim();}
};
const pdfPages = new Map();
const register = (url,reader) => {if(url && reader)pdfPages.set(normalise(url),reader);};
for(const document of chapterDocuments){
 const reader='/documents/'+document.slug+'/';
 register(document.assetPath,reader);
 if(pdfLike(document.sourceUrl))register(document.sourceUrl,reader);
}
for(const publication of contributedPrimarySources){
 register(publication.viewerPath,publication.publicationUrl);
 register(publication.assetPath,publication.publicationUrl);
 if(pdfLike(publication.sourceUrl))register(publication.sourceUrl,publication.publicationUrl);
}
for(const publication of onlinePdfPublications.filter(p=>p.hostedLocally)){
 const reader='/publications/pdf/'+publication.slug+'/';
 register(publication.pdfPath,reader);
 if(pdfLike(publication.externalPdfUrl))register(publication.externalPdfUrl,reader);
 if(pdfLike(publication.sourceUrl))register(publication.sourceUrl,reader);
}
export function pdfReadingUrl(url){
 if(typeof url!=='string')return url;
 return pdfPages.get(normalise(url)) || (pdfLike(url) ? null : url);
}
export function pdfReadingLabel(label,url){
 if(typeof label!=='string')return label;
 return pdfReadingUrl(url)&&pdfReadingUrl(url)!==url?label.replace(/\bdownload\b/gi,'View'):label;
}
