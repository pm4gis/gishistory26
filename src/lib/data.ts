import {getCollection} from 'astro:content';
import {isTimelineEventInPeriod} from './timeline-cutoff.mjs';
export async function dataset(){const names=['articles','passages','records','events','relationships','themes','images'] as const;const out:any={};await Promise.all(names.map(async n=>out[n]=(await getCollection(n)).map(e=>e.data)));out.articles.sort((a:any,b:any)=>(a.readingOrder??999)-(b.readingOrder??999));
  // Exclude post-2025 events from every public view, including chronology,
  // related-event panels, homepage counts and the editor-data feed.
  out.events=out.events.filter(isTimelineEventInPeriod);
  // Read-only presentation memberships: enrich curated theme links without
  // altering checksummed chapter, event or record source JSON.
  for(const theme of out.themes){
    for(const [collection,ids] of [['records',theme.recordIds||[]],['events',theme.eventIds||[]],['passages',theme.passageIds||[]]] as const){
      if(!ids.length)continue;
      const linked=new Set(ids);
      for(const item of out[collection]){
        if(linked.has(item.id))item.themeIds=[...new Set([...(item.themeIds||[]),theme.id])];
      }
    }
  }
  return out;}
export function blocks(p:any){return p.blocks?.length?p.blocks:(p.paragraphs||[]).map((x:any)=>({type:'paragraph',...x}));}
export function passageUrl(p:any,articles:any[]){return (articles.find(a=>a.id===p.articleId)?.url||'/read/')+'#'+p.slug;}
