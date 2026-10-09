import {getCollection} from 'astro:content';
export async function dataset(){const names=['articles','passages','records','events','relationships','themes','images'] as const;const out:any={};await Promise.all(names.map(async n=>out[n]=(await getCollection(n)).map(e=>e.data)));out.articles.sort((a:any,b:any)=>(a.readingOrder??999)-(b.readingOrder??999));return out;}
export function blocks(p:any){return p.blocks?.length?p.blocks:(p.paragraphs||[]).map((x:any)=>({type:'paragraph',...x}));}
export function passageUrl(p:any,articles:any[]){return (articles.find(a=>a.id===p.articleId)?.url||'/read/')+'#'+p.slug;}
