import type {APIRoute} from 'astro';
import {geodeticPdfPublications} from '../../../../lib/geodetic-pdf-publications.mjs';
type Cover = {slug:string; title:string; creator:string; year:string};
const covers = geodeticPdfPublications as Cover[];

// Plain catalogue cards for publisher-hosted PDFs. These are metadata cards,
// not invented reproductions of the documents' original covers.
export function getStaticPaths() {
  return covers.map(item => ({params: {slug:item.slug},props:{item}}));
}

const escapeXml = (value:string) => String(value).replace(/[&<>"']/g, char => (({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'} as Record<string,string>)[char] ?? char));
function wrap(str:string, limit=29) {
 const words=String(str).split(/\s+/), lines=[];let line='';
 for(const word of words) {
  if(line && (line+' '+word).length>limit){lines.push(line);line=word;} else line=line?line+' '+word:word;
 }
 if(line)lines.push(line);
 return lines.slice(0,7);
}
export const GET: APIRoute = ({props}) => {
 const item = props.item as Cover;
 const lines=wrap(item.title);
 const title=lines.map((line,i)=>`<text x="58" y="${244+i*61}" font-size="43" font-weight="700" fill="#f8fafc">${escapeXml(line)}</text>`).join('');
 const year=escapeXml(item.year), organisation=escapeXml(item.creator);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960" role="img" aria-label="Catalogue card for ${escapeXml(item.title)}">
 <rect width="720" height="960" fill="#102637"/>
 <rect x="0" y="0" width="720" height="18" fill="#81d6d0"/>
 <text x="58" y="97" font-family="Arial, sans-serif" font-size="24" letter-spacing="3" fill="#9de3db">NZ GIS HISTORY</text>
 <text x="58" y="157" font-family="Arial, sans-serif" font-size="25" fill="#c2ccd2">PDF PUBLICATION · ${year}</text>
 <g font-family="Arial, sans-serif">${title}</g>
 <line x1="58" x2="662" y1="785" y2="785" stroke="#558394"/>
 <text x="58" y="826" font-family="Arial, sans-serif" font-size="22" fill="#c2ccd2">Publisher or repository copy</text>
 <text x="58" y="867" font-family="Arial, sans-serif" font-size="19" fill="#b0c3cd">${organisation.length>62?organisation.slice(0,59)+'…':organisation}</text>
 </svg>`;
 return new Response(svg,{headers:{'Content-Type':'image/svg+xml; charset=utf-8','Cache-Control':'public, max-age=86400'}});
};
