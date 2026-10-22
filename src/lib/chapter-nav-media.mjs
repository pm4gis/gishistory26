import {placeChapterImages} from './chapter-media.mjs';

/**
 * Chapter navigation uses images already accepted beside a specific chapter passage,
 * or an explicitly embedded figure. Archive-only acquisition records stay excluded.
 * A chapter without approved imagery receives a text-only fallback.
 */
export function chapterNavImage(article,passages,images){
 if(!article?.slug || !Array.isArray(passages) || !Array.isArray(images))return null;
 const belonging=passages.filter(p=>p.articleId===article.id);
 const placed=Object.values(placeChapterImages(article,belonging,images)).flat();
 const byId=new Map(images.map(image=>[image.id,image]));
 const embedded=belonging.flatMap(p=>(p.blocks||[])
  .filter(b=>b.type==='figure'&&b.imageId)
  .map(b=>byId.get(b.imageId))
  .filter(Boolean));
 // A new in-story screenshot must not silently displace an approved chapter-card image.
 // It remains placed beside its reviewed paragraph and on its own image detail page.
 const eligible=[...placed,...embedded].filter(image=>!image.publicationSlug&&!image.gisScreenBatch&&image.assetPath&&image.slug&&image.altText);
 if(!eligible.length)return null;
 return eligible.find(image=>image.headerCandidate)||eligible[0];
}

export function chapterNavImageMap(articles,passages,images){
 return Object.fromEntries((articles||[]).map(a=>[a.slug,chapterNavImage(a,passages,images)]));
}
