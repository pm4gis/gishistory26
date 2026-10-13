import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const sourceUrl = 'https://blog.doc.govt.nz/2015/11/06/the-great-walks-on-google-maps/';
const items = [
 {file:'routeburn-blog2',slug:'doc-google-trekker-routeburn-team-2015',title:'Google Trekker field team on the Routeburn Track, published 2015',alt:'Three members of the Routeburn field team with the Google Trekker camera visible beside them.',caption:'Matt Jenke, Peter Hiemstra and Riki Mules on the Routeburn Track, as identified in DOC’s November 2015 account. The photograph’s exact capture date is unstated.',article:'google-changes-the-audience',chapter:31,anchor:'research-doc-google-named-participants-launch-2015',credit:'Department of Conservation; photographer not separately identified for this group photograph.'},
 {file:'heaphy-blog1',slug:'doc-google-trekker-heaphy-2015',title:'Google Trekker recording the Heaphy Track, published 2015',alt:'Google Trekker operator carrying the backpack panorama camera along the Heaphy Track beside a track sign.',caption:'Google Trekker field capture on the Heaphy Track, photographed by DOC GIS analyst Peter Hiemstra and published in November 2015. DOC’s account describes battery planning and carrying the equipment along the 78.4 km track.',article:'google-changes-the-audience',chapter:31,anchor:'research-google-doc-seven-great-walks-street-view-2015',credit:'Peter Hiemstra / Department of Conservation.'},
 {file:'milford-blog2',slug:'doc-google-trekker-milford-mist-2015',title:'Google Trekker at Mackinnon Pass in mist, published 2015',alt:'A silhouetted operator carrying the Google Trekker camera in mist at Mackinnon Pass on the Milford Track.',caption:'Google Trekker operator Matt Jenke at Mackinnon Pass on the Milford Track. DOC published this field photograph in November 2015; the exact day of capture is unstated.',article:'mapping-leaves-the-office',chapter:34,anchor:'research-doc-trekker-field-capture-2015',credit:'Department of Conservation; the accompanying account credits Peter Hiemstra with photographing the fieldwork.'}
];
const operations=[];
for(const item of items){
 const original=await fs.readFile('/tmp/doc-photos/'+item.file+'.jpg');
 const metadata=await sharp(original).metadata();
 const web=await sharp(original).resize({width:1600,withoutEnlargement:true}).webp({quality:88}).toBuffer();
 const card=await sharp(original).resize({width:720,withoutEnlargement:true}).webp({quality:85}).toBuffer();
 const originalAssetPath='/assets/historical/original/'+item.slug+'.jpg';
 const assetPath='/assets/historical/web/'+item.slug+'.webp';
 const thumbnailPath='/assets/historical/card/'+item.slug+'.webp';
 for(const [p,b] of [[originalAssetPath,original],[assetPath,web],[thumbnailPath,card]])await fs.writeFile('public'+p,b);
 const value={id:'image:'+item.slug,slug:item.slug,title:item.title,assetPath,thumbnailPath,originalAssetPath,sourceUrl,sourceName:'Department of Conservation conservation blog',sourceOriginalUrl:'https://blog.doc.govt.nz/wp-content/uploads/2015/11/'+item.file+'.jpg',credit:item.credit,licence:'CC BY 4.0',licenceUrl:'https://creativecommons.org/licenses/by/4.0/',licenceEvidenceUrl:'https://www.doc.govt.nz/footer-links/copyright/',altText:item.alt,caption:item.caption,themeIds:[],articleSlug:item.article,chapterNumber:item.chapter,afterParagraphId:item.anchor,dateDisplay:'Published 6 November 2015; exact capture date unstated',context:'DOC’s own account documents the named Street View field programme, the people and tracks. Its footer links to DOC’s Crown-copyright CC BY 4.0 policy. No separate third-party copyright notice appears on these photographs.',originalSha256:sha(original),webSha256:sha(web),thumbnailSha256:sha(card),originalWidth:metadata.width,originalHeight:metadata.height,headerCandidate:true,derivativesNote:'Unchanged source JPEG retained; uncropped WebP display and thumbnail copies. No reconstructed historical content.'};
 operations.push({collection:'images',action:'add',value});
}
await fs.writeFile('/tmp/doc-image-operations.json',JSON.stringify({operations},null,2)+'\n');
await fs.writeFile('docs/media/doc-google-trekker-acquisition-20261013.json',JSON.stringify({sourceUrl,licenceEvidence:'https://www.doc.govt.nz/footer-links/copyright/',acquiredAt:new Date().toISOString(),approved:operations.map(o=>o.value),notPlaced:[{file:'kepler-blog1.jpg',reason:'The operator occupies a small part of the landscape; the Heaphy photograph documents the equipment and operation more clearly.'}]},null,2)+'\n');
console.log('Three unchanged DOC originals and uncropped derivatives prepared.');
