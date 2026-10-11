<script lang="ts">
 import {onMount,tick} from 'svelte';
 import {fade} from 'svelte/transition';
 import Timeline from './Timeline.svelte';
 import {chapterDocuments} from '../lib/chapter-documents.mjs';
 import WanangaVideos from './WanangaVideos.svelte';
 import {passageContributionMailtoUrl,passageContributionPageUrl} from '../lib/passage-contributions.mjs';
 import {ngaPoutamaForPassage} from '../lib/nga-poutama-videos.mjs';
 import {placeChapterImages} from '../lib/chapter-media.mjs';
 export let article:any;export let passages:any[]=[];export let records:any[]=[];export let events:any[]=[];export let relationships:any[]=[];export let images:any[]=[];export let themes:any[]=[];export let previous:any;export let next:any;export let decorSrc:string='';
 let suppressPreview=false;let relatedAll=false;let relatedKind='All';let previewTrigger:HTMLElement|null=null;let previewTimer:ReturnType<typeof setTimeout>|undefined;let page=0;let complete=true;let contentsOpen=false;let relatedOpen=false;let selected:any=null;let size=19;let motion=true;let status='';
 $: current=passages[page];
 $: visible=complete?passages:[current].filter(Boolean);
 $: relevant=records.filter(r=>r.kind!=='Chapter'&&r.kind!=='Story'&&(complete||current?.recordIds?.includes(r.id)));
 $: relatedKinds=[...new Set(relevant.map(r=>r.kind))].sort();
 $: filteredRelated=relevant.filter(r=>relatedKind==='All'||r.kind===relatedKind).sort((a,b)=>a.name.localeCompare(b.name,'en-NZ'));
 $: currentEvents=events.filter(e=>complete||e.passageIds?.includes(current?.id));
 $: currentThemes=themes.filter(t=>[...(article.themeIds||[]),...(current?.themeIds||[])].includes(t.id));
 $: imagePlacements=placeChapterImages(article,passages,images);
 function safe(u:string){return u?.startsWith('/')||/^https?:\/\//.test(u)}
 function sources(p:any){return [...(p.sources||[]),...(p.blocks||[]).flatMap((b:any)=>b.sources||[])].filter((s:any)=>s.label)}
 function blocks(p:any){return p.blocks?.length?p.blocks:(p.paragraphs||[]).map((x:any)=>({type:'paragraph',...x}))}
 function image(b:any){return images.find(i=>i.id===b.imageId)}
 function save(p:any=current){try{localStorage.setItem('nzgis-progress',JSON.stringify({articleId:article.id,passageId:p.id,url:article.url+(complete?'':'?mode=page')+'#'+p.slug,mode:complete?'chapter':'page'}))}catch{}}
 async function go(i:number,update=true){if(i<0||i>=passages.length)return;page=i;complete=false;selected=null;relatedAll=false;relatedKind='All';if(update)history.pushState(null,'',article.url+'?mode=page#'+passages[i].slug);save(passages[i]);await tick();requestAnimationFrame(()=>{document.querySelector<HTMLElement>('.page h2')?.focus();document.querySelector('.page')?.scrollIntoView({block:'start',behavior:motion?'smooth':'auto'})})}
 async function chapter(){complete=true;history.pushState(null,'',article.url+'#'+current.slug);save();await tick();document.getElementById(current.slug)?.scrollIntoView({block:'start',behavior:motion?'smooth':'auto'})}
 function fromURL(){let id='';try{id=decodeURIComponent(location.hash.slice(1))}catch{}const i=passages.findIndex(p=>p.slug===id||p.legacyAnchor===id||p.id===id||p.blocks?.some((b:any)=>b.id===id));if(i>=0)page=i;complete=new URLSearchParams(location.search).get('mode')!=='page'}
 function restoreDeepLink(){if(!location.hash)return;let id='';try{id=decodeURIComponent(location.hash.slice(1))}catch{return}tick().then(()=>requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start',behavior:'auto'})))}
 function selectEvent(e:any){const i=passages.findIndex(p=>e.passageIds?.includes(p.id));if(i>=0)go(i)}
 function cancelPreview(){if(previewTimer)clearTimeout(previewTimer)}
 function hover(r:any,trigger:HTMLElement){cancelPreview();previewTimer=setTimeout(()=>{previewTrigger=trigger;selected=r},300)}
 function leavePreview(){cancelPreview();previewTimer=setTimeout(()=>close(false),300)}
 async function open(r:any,trigger:HTMLElement,focus=false){cancelPreview();previewTrigger=trigger;selected=r;if(focus){await tick();document.querySelector<HTMLElement>('.reader-popover a')?.focus()}}
 function close(restore=false){cancelPreview();selected=null;if(restore){suppressPreview=true;previewTrigger?.focus();queueMicrotask(()=>suppressPreview=false)}}

 function relatedClick(){save()}
 function recordLink(r:any){const origin=article.url+(complete?'':'?mode=page')+'#'+current.slug;return r.url+(r.url.includes('?')?'&':'?')+'from='+encodeURIComponent(origin)}
 function parts(text:string,p:any):any[]{
  const allowed=records.filter(r=>p.recordIds?.includes(r.id)&&r.kind!=='Chapter'&&r.kind!=='Story');
  const map=new Map<string,any[]>();for(const r of allowed)for(const n of [r.name,...(r.aliases||[])])if(n?.length>=4)map.set(n,[...(map.get(n)||[]),r]);
  const names=[...map.keys()].filter(n=>new Set(map.get(n)!.map(r=>r.id)).size===1).sort((a,b)=>b.length-a.length);
  if(!names.length)return [{text}];const escape=(n:string)=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const re=new RegExp(names.map(escape).join('|'),'g');const out:any[]=[];let pos=0;
  for(const m of text.matchAll(re)){const i=m.index!;const end=i+m[0].length;if(i>0&&/[\p{L}\p{N}]/u.test(text[i-1])||end<text.length&&/[\p{L}\p{N}]/u.test(text[end]))continue;if(i>pos)out.push({text:text.slice(pos,i)});out.push({text:m[0],record:map.get(m[0])![0]});pos=end}if(pos<text.length)out.push({text:text.slice(pos)});return out;
 }
 onMount(()=>{motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;fromURL();restoreDeepLink();try{size=Number(localStorage.getItem('nzgis-text-size'))||19}catch{}
  const pop=()=>{fromURL();restoreDeepLink()};window.addEventListener('popstate',pop);const hash=()=>{fromURL();restoreDeepLink()};window.addEventListener('hashchange',hash);
  const sections=document.querySelectorAll('[data-passage]');const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting&&complete){const i=passages.findIndex(p=>p.slug===e.target.id);if(i>=0){page=i;save(passages[i])}}},{rootMargin:'-10% 0px -65% 0px'});sections.forEach(e=>observer.observe(e));
  return()=>{observer.disconnect();window.removeEventListener('popstate',pop);window.removeEventListener('hashchange',hash)};
 });
 function textSize(delta:number){size=Math.min(25,Math.max(17,size+delta));try{localStorage.setItem('nzgis-text-size',String(size))}catch{}}
 async function copy(p:any){try{await navigator.clipboard.writeText(new URL(article.url+'#'+p.slug,location.origin).href);status='Passage link copied.'}catch{status='Copy the passage address from your browser.'}}
</script>
<svelte:window on:keydown={(e)=>{if(e.key==='Escape'&&selected){e.preventDefault();close(true)}}}/>
<div class="reading-shell" style={`--reading-size:${size}px`}>
 <header class="reading-heading"><a class="breadcrumb" href="/read/">Chapter contents / {article.slug==='preface'?'Preface':'Chapter '+article.readingOrder}</a><h1>{article.title}</h1><p class="intro">{article.summary}</p><div class="chips">{#each currentThemes as t}<a class="button" href={'/themes/'+t.slug+'/'}>{t.title}</a>{/each}</div></header>
 {#if events.length}<Timeline {events} compact={true} onSelect={selectEvent}/>{/if}
 <div class="mobile-controls"><button aria-expanded={contentsOpen} on:click={()=>contentsOpen=!contentsOpen}>Contents</button><button aria-expanded={relatedOpen} on:click={()=>relatedOpen=!relatedOpen}>Related entries · {relevant.length}</button></div>
 <div class="reading-grid"><aside class:open={contentsOpen} class="contents" aria-label="Chapter contents"><p class="eyebrow">In this chapter</p>{#each passages as p,i}<a href={article.url+'?mode=page#'+p.slug} class:active={page===i} on:click={(e)=>{e.preventDefault();go(i);contentsOpen=false}}>{p.title}</a>{/each}<a href="/read/">All chapters →</a></aside>
 <article class="page" aria-label="Chapter text" data-pagefind-body ><span class="sr-only" data-pagefind-filter="type">Chapter</span>
 <div class="toolbar"><div class="actions"><button aria-pressed={!complete} on:click={()=>go(page)}>Page by page</button><button aria-pressed={complete} on:click={chapter}>Complete chapter</button></div><div class="actions"><button aria-label="Decrease text size" on:click={()=>textSize(-1)}>A−</button><button aria-label="Increase text size" on:click={()=>textSize(1)}>A+</button><button on:click={()=>{save();status='Reading position saved on this device.'}}>Bookmark</button></div></div>
 <p class="sr-only" aria-live="polite">{status}</p>
 <div class="narrative">
 {#each currentThemes as t}<span class="sr-only" data-pagefind-filter="theme">{t.title}</span>{/each}
 {#each visible as p (p.id)}
 <section id={p.slug} data-passage={p.id} in:fade={{duration:motion?160:0}}>
 {#if p.legacyAnchor}<span id={p.legacyAnchor} class="legacy-anchor"></span>{/if}<h2 tabindex="-1">{p.title}</h2>
 {#each blocks(p) as b,blockIndex}
 {#if b.type==='figure'}<figure id={b.id}>{#if image(b)}<a href={'/images/'+image(b).slug+'/'}><img src={image(b).assetPath} alt={b.alt||image(b).altText} loading="lazy"/></a>{/if}<figcaption>{b.caption} {b.credit||b.source||''}{#if image(b)} <a href={'/images/'+image(b).slug+'/'}>Image details</a>{/if}</figcaption></figure>
 {:else}<p id={b.id}>{#each parts(b.text||'',p) as part}{#if part.record}<button class="inline-record" aria-haspopup="dialog" aria-expanded={selected?.id===part.record.id} on:mouseenter={(e)=>hover(part.record,e.currentTarget)} on:mouseleave={leavePreview} on:focus={(e)=>{if(!suppressPreview)open(part.record,e.currentTarget)}} on:click={(e)=>open(part.record,e.currentTarget,true)}>{part.text}</button>{:else}{part.text}{/if}{/each}</p>{/if}
 {#each (imagePlacements[p.id] || []).filter(document => document.inlineAfterBlockId ? document.inlineAfterBlockId === b.id : blockIndex === 0) as document (document.id)}
 <figure class="passage-illustration">
  <a href={'/images/'+document.slug+'/'} aria-label={'View the image record for '+document.title}>
   <img src={document.assetPath} alt={document.altText} loading="lazy" decoding="async"/>
  </a>
  <figcaption>{document.caption||document.context||document.title} <a href={'/images/'+document.slug+'/'}>Image details</a></figcaption>
 </figure>
 {/each}
 {#each chapterDocuments.filter(document => document.articleSlug === article.slug && document.afterParagraphId === b.id) as document}
 <aside class="source-download" aria-label="Original source document">
  <p><strong>{document.title}</strong> · {document.date}<br/><a href={document.assetPath} download>Download original PDF ({(document.bytes/1000000).toFixed(1)} MB)</a> · <a href={'/documents/'+document.slug+'/'}>Document details</a></p>
 </aside>
 {/each}
 {#if blockIndex===Math.min(1,blocks(p).length-1)&&ngaPoutamaForPassage(p.id).length}
   <WanangaVideos inline={true} compact={true} videos={ngaPoutamaForPassage(p.id)}/>
 {/if}
 {/each}
 <div class="actions passage-actions"><a href={article.url+'#'+p.slug}>Link to passage</a><button on:click={()=>copy(p)}>Copy link</button><a class="button passage-contribute" aria-label={"Contribute information about "+p.title} href={passageContributionMailtoUrl(article,p)}>Contribute</a><a class="contribution-help" aria-label={"Alternative email options for "+p.title} href={passageContributionPageUrl(article,p)}>Email options</a></div>
 {#if sources(p).length}<details class="sources"><summary>Sources · {sources(p).length}</summary><ol>{#each sources(p) as s}<li>{#if safe(s.url)}<a href={s.url}>{s.label}</a>{:else}{s.label}{/if}</li>{/each}</ol></details>{/if}
 </section>{/each}
 {#if complete&&article.sourceNotes?.length}<details class="sources"><summary>Chapter source notes</summary>{#each article.sourceNotes as n}<p>{n.text}</p>{/each}</details>{/if}
 </div>
 <nav class="page-nav" aria-label="Reading navigation">{#if !complete&&page>0}<button on:click={()=>go(page-1)}>← Previous</button>{:else if previous}<a class="button" href={previous.url}>← Previous chapter</a>{:else}<a href="/read/">Contents</a>{/if}<span>{complete?'Complete chapter':`${page+1} of ${passages.length}`}</span>{#if !complete&&page<passages.length-1}<button on:click={()=>go(page+1)}>Next →</button>{:else if next}<a class="button primary" href={next.url}>Next chapter →</a>{:else}<a href="/read/">Back to contents</a>{/if}</nav>
 </article>
 <aside class:open={relatedOpen} class="related" aria-label="Related material"><p class="eyebrow">Follow a connection</p><h3>Related entries</h3><div class="related-filters" role="group" aria-label="Related entry types"><button aria-pressed={relatedKind==='All'} on:click={()=>{relatedKind='All';relatedAll=false}}>All</button>{#each relatedKinds as kind}<button aria-pressed={relatedKind===kind} on:click={()=>{relatedKind=kind;relatedAll=false}}>{kind}</button>{/each}</div><div class="related-list">{#each (relatedAll?filteredRelated:filteredRelated.slice(0,8)) as r}<a class="related-item" href={recordLink(r)} on:click={relatedClick}>{r.name}<span>{r.kind} · indexed with {complete?'this chapter':'this passage'}</span></a>{/each}</div>{#if filteredRelated.length>8}<button aria-expanded={relatedAll} on:click={()=>relatedAll=!relatedAll}>{relatedAll?'Show fewer entries':`View all ${filteredRelated.length} entries`}</button>{/if}{#if !filteredRelated.length}<p class="muted">No matching entries. Select All to see the entries indexed for this {complete?'chapter':'passage'}.</p>{/if}
 {#if currentEvents.length}<details><summary>Linked events · {currentEvents.length}</summary>{#each currentEvents as e}<button on:click={()=>selectEvent(e)}>{e.dateDisplay} · {e.label}</button>{/each}</details>{/if}
 {#if relationships.length}<details><summary>Relationship evidence</summary>{#each relationships as edge}<p><a href={records.find(r=>r.id===edge.a)?.url||'/browse/'}>{records.find(r=>r.id===edge.a)?.name||edge.a}</a> · {edge.label} · <a href={records.find(r=>r.id===edge.b)?.url||'/browse/'}>{records.find(r=>r.id===edge.b)?.name||edge.b}</a></p><p class="muted">{edge.basis}</p>{#each edge.sources||[] as s}{#if safe(s.url)}<a href={s.url}>{s.label}</a>{/if}{/each}{/each}</details>{/if}<p><a href={'/network/?focus='+encodeURIComponent(relevant[0]?.id||article.id)}>Optional network view →</a></p></aside></div>
</div>
{#if selected}<aside role="dialog" aria-modal="false" on:mouseenter={cancelPreview} on:mouseleave={leavePreview} class="reader-popover" aria-label={'Preview of '+selected.name} transition:fade={{duration:motion?180:0}}><h3>{selected.name}</h3><small>{selected.kind}</small><p>{selected.description||selected.story?.[0]||'Open the complete entry for the available account and sources.'}</p><div class="actions"><a class="button primary" href={recordLink(selected)} on:click={relatedClick}>Open full entry →</a><button on:click={()=>close(true)}>Close</button></div></aside>{/if}
