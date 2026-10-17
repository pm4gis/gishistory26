import {contributedPrimarySources} from './contributed-primary-sources.mjs';
import {onlinePdfPublications} from './online-pdf-publications.mjs';

// Keep a single browsing order across the original archive and reference PDFs.
// The historical publication year is used, never the 2026 archive date.
export const publicationReadingOrder = [
 ...contributedPrimarySources.map(p=>({slug:p.slug,title:p.title,year:p.startDate.slice(0,4),url:p.publicationUrl,kind:'archive'})),
 ...onlinePdfPublications.map(p=>({slug:p.slug,title:p.title,year:p.year,url:'/publications/pdf/'+p.slug+'/',kind:'research'}))
].sort((a,b)=>b.year.localeCompare(a.year)||a.title.localeCompare(b.title,'en-NZ'));

export function publicationReadingContext(url){
 const position=publicationReadingOrder.findIndex(item=>item.url===url);
 if(position===-1)throw new Error('Unknown publication reader URL: '+url);
 return {
  position:position+1,
  total:publicationReadingOrder.length,
  previous:publicationReadingOrder[position-1]||null,
  next:publicationReadingOrder[position+1]||null
 };
}
