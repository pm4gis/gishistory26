<script lang="ts">
 import {scaleLinear} from 'd3-scale';
 import {ngaPoutamaForEvent} from '../lib/nga-poutama-videos.mjs';
 import {onMount} from 'svelte';
 export let events:any[]=[];
 export let compact=false;
 export let onSelect:(e:any)=>void=()=>{};
 let from='';
 let to='';
 let term='';
 let selected:any=null;
 let includeUndated=true;
 let zoom=1;
 let hoveredId='';
 const maxZoom=12;
 const year=(event:any):number|null=>{
  if(event.datePrecision==='unknown')return null;
  const raw=event.year??(event.startDate?.match(/^\d{4}/)?Number(event.startDate.slice(0,4)):null);
  const value=Number(raw);
  return raw===null||raw===undefined||!Number.isFinite(value)?null:value;
 };
 const endYear=(event:any):number|null=>{
  const match=event.endDate?.match(/^\d{4}/);
  return match?Number(match[0]):year(event);
 };
 $: dated=events.filter(e=>year(e)!==null);
 $: min=Math.min(...dated.map(e=>year(e) as number),1900);
 $: max=Math.max(...dated.map(e=>year(e) as number),new Date().getFullYear());
 $: rangeStart=from&&Number.isFinite(Number(from))?Math.max(min,Math.min(max,Number(from))):min;
 $: rangeEnd=to&&Number.isFinite(Number(to))?Math.max(min,Math.min(max,Number(to))):max;
 $: baseStart=Math.min(rangeStart,rangeEnd);
 $: baseEnd=Math.max(rangeStart,rangeEnd);
 $: centre=(baseStart+baseEnd)/2;
 $: zoomSpan=Math.max(1,(baseEnd-baseStart)/zoom);
 $: viewMin=Math.max(min,Math.min(max-1,centre-zoomSpan/2));
 $: viewMax=Math.min(max,Math.max(viewMin+1,centre+zoomSpan/2));
 $: scale=scaleLinear().domain([viewMin,viewMax]).range([30,970]);
 $: filtered=events.filter(e=>{
  const y=year(e);
  if(y===null&&!includeUndated)return false;
  const end=endYear(e)??y;
  const inPeriod=y===null||(!from||end>=Number(from))&&(!to||y<=Number(to));
  const q=term.trim().toLocaleLowerCase('en-NZ');
  const text=[e.label,e.summary,e.dateDisplay,...(e.categories||[])].map(v=>String(v||'')).join(' ').toLocaleLowerCase('en-NZ');
  return inPeriod&&(!q||text.includes(q));
 }).sort((a,b)=>(year(a)??Infinity)-(year(b)??Infinity)||a.id.localeCompare(b.id));
 $: ticks=scale.ticks(7);
 $: periodGroups=[...new Set(dated.map(e=>Math.floor((year(e)??0)/10)*10))].sort((a,b)=>a-b).map(y=>({year:y,count:dated.filter(e=>Math.floor((year(e)??0)/10)*10===y).length}));
 $: densityMax=Math.max(1,...periodGroups.map(x=>x.count));
 $: selectedPeriod=from&&to&&Number.isFinite(Number(from))&&Number(to)===Number(from)+9?Number(from):null;
 $: chartMarks=(()=>{
  const lanes=new Map<number,number>();
  return filtered.filter(e=>{
   const start=year(e);const end=endYear(e)??start;
   return start!==null&&end!==null&&end>=viewMin&&start<=viewMax;
  }).map(event=>{
   const start=year(event) as number;const end=endYear(event)??start;
   const lane=lanes.get(start)||0;lanes.set(start,lane+1);
   return {event,x1:scale(Math.max(viewMin,start)),x2:scale(Math.min(viewMax,end)),y:14+(lane%4)*8};
  });
 })();
 $: hoveredEvent=chartMarks.find(mark=>mark.event.id===hoveredId)?.event||null;
 function updateURL(eventId?:any){
  if(compact)return;
  const u=new URL(location.href);
  if(from)u.searchParams.set('from',from);else u.searchParams.delete('from');
  if(to)u.searchParams.set('to',to);else u.searchParams.delete('to');
  if(term.trim())u.searchParams.set('q',term.trim());else u.searchParams.delete('q');
  if(!includeUndated)u.searchParams.set('undated','0');else u.searchParams.delete('undated');
  if(zoom>1)u.searchParams.set('zoom',String(zoom));else u.searchParams.delete('zoom');
  if(typeof eventId==='string')u.searchParams.set('event',eventId);else u.searchParams.delete('event');
  history.replaceState(null,'',u);
 }
 function pick(e:any){selected=e;onSelect(e);if(!compact)updateURL(e.id)}
 function markerKeydown(event:KeyboardEvent,e:any){if(event.key==='Enter'||event.key===' '){event.preventDefault();pick(e)}}
 function zoomIn(){zoom=Math.min(maxZoom,Number((zoom+0.5).toFixed(2)));updateURL(selected?.id)}
 function zoomOut(){zoom=Math.max(1,Number((zoom-0.5).toFixed(2)));updateURL(selected?.id)}
 function resetZoom(){zoom=1;updateURL(selected?.id)}
 function decade(y:number){from=String(y);to=String(y+9);includeUndated=false;selected=null;zoom=1;updateURL()}
 function clearFilters(){from='';to='';term='';includeUndated=true;selected=null;zoom=1;updateURL()}
 function yearLabel(value:number){return String(Math.floor(value))}
 onMount(()=>{
  if(!compact){
   const p=new URLSearchParams(location.search);
   from=p.get('from')||'';
   to=p.get('to')||'';
   term=p.get('q')||'';
   includeUndated=p.get('undated')!=='0';
   const requestedZoom=Number(p.get('zoom'));
   zoom=Number.isFinite(requestedZoom)?Math.min(maxZoom,Math.max(1,requestedZoom)):1;
   const e=events.find(e=>e.id===p.get('event'));
   if(e)selected=e;
  }
 });
</script>
<section class="timeline-box" aria-label="Linked timeline"><div class="section-head" style="margin-top:0"><p class="eyebrow">{compact?'This chapter in time':'Explore the chronology'}</p>{#if compact}<a href="/timeline/">Full timeline →</a>{/if}</div>
 {#if !compact}<div class="timeline-controls"><label>From year<input type="number" min="1000" max="2100" bind:value={from} on:change={updateURL}/></label><label>To year<input type="number" min="1000" max="2100" bind:value={to} on:change={updateURL}/></label><label><span>Undated</span><input type="checkbox" bind:checked={includeUndated} on:change={updateURL}/></label><label class="timeline-search">Find an event<input type="search" placeholder="Search dates and accounts" bind:value={term} on:input={()=>{selected=null;updateURL()}}/></label><button on:click={clearFilters}>Clear filters</button></div>
 <div class="period-head"><h2>Choose a decade</h2><p>Move from left to right through the history. Select a decade to focus the events below.</p></div>
 <nav class="period-nav" aria-label="Timeline decades">
 <button class="period-choice" class:active={!from&&!to} aria-pressed={!from&&!to} on:click={clearFilters}><strong>All years</strong><span>{dated.length} dated events</span></button>
 {#each periodGroups as group}
 <button class="period-choice" class:active={selectedPeriod===group.year} aria-pressed={selectedPeriod===group.year} on:click={()=>decade(group.year)}><strong>{group.year}s</strong><span>{group.count} {group.count===1?'event':'events'}</span><i class="period-density" aria-hidden="true" style={'--density:'+Math.round(group.count/densityMax*100)+'%'}></i></button>
 {/each}</nav>{/if}
  <div class="timeline-overview-toolbar" aria-label="Timeline overview controls">
  <div><strong>Event date map</strong><span>{chartMarks.length} markers in view · {yearLabel(viewMin)}–{yearLabel(viewMax)}</span></div>
  {#if !compact}<div class="timeline-zoom-controls">
   <button type="button" aria-label="Zoom out" on:click={zoomOut} disabled={zoom<=1}>−</button>
   <label class="timeline-zoom-level"><span>Zoom {zoom.toFixed(1)}×</span><input type="range" min="1" max={maxZoom} step="0.5" bind:value={zoom} on:input={()=>updateURL(selected?.id)} aria-label="Timeline zoom level"/></label>
   <button type="button" aria-label="Zoom in" on:click={zoomIn} disabled={zoom>=maxZoom}>+</button>
   <button type="button" on:click={resetZoom} disabled={zoom===1}>Reset</button>
  </div>{/if}
 </div>
 <svg class="timeline-svg timeline-svg--interactive" viewBox="0 0 1000 92" role="group" aria-label="Interactive event date overview. Select a marker for its summary; zoom controls adjust the date scale.">
  <line class="timeline-axis" x1="30" y1="53" x2="970" y2="53"/>
  {#each ticks as tick}
   <line class="timeline-tick" x1={scale(tick)} y1="49" x2={scale(tick)} y2="58"/>
   <text x={scale(tick)} y="82" text-anchor="middle">{Math.round(tick)}</text>
  {/each}
  {#each chartMarks as mark (mark.event.id)}
   <g class="timeline-mark" class:selected={selected?.id===mark.event.id} class:hovered={hoveredId===mark.event.id} role="button" tabindex="0" aria-label={mark.event.dateDisplay+': '+mark.event.label} aria-pressed={selected?.id===mark.event.id}
    on:click={()=>pick(mark.event)} on:keydown={(event)=>markerKeydown(event,mark.event)} on:mouseenter={()=>hoveredId=mark.event.id} on:mouseleave={()=>hoveredId=''} on:focus={()=>hoveredId=mark.event.id} on:blur={()=>hoveredId=''}>
    <title>{mark.event.dateDisplay}: {mark.event.label} — select to view details</title>
    {#if mark.x2>mark.x1}<line class="timeline-span" x1={mark.x1} y1={mark.y} x2={mark.x2} y2={mark.y}/>{/if}
    <circle cx={mark.x1} cy={mark.y} r="4"/>
   </g>
  {/each}
 </svg>
 <div class="timeline-hover-label" aria-hidden="true">{#if hoveredEvent}{hoveredEvent.dateDisplay} · {hoveredEvent.label}{:else}Hover or focus a marker to preview it; select to open its account.{/if}</div>
 <div class="timeline-result-count" aria-live="polite">{filtered.length} of {events.length} events {#if !compact}· {chartMarks.length} markers in the overview · Select an event for its summary, sources and related account{/if}</div>

 <div class="timeline-rail" tabindex="0" aria-label="Chronological event buttons">
 {#each filtered as e (e.id)}
 <button class={'timeline-event'+(e.featuredImage?' timeline-event--photo':'')} aria-pressed={selected?.id===e.id} aria-label={e.dateDisplay+': '+e.label} on:click={()=>pick(e)}>
 {#if e.featuredImage}<img class="timeline-event-photo" src={e.featuredImage.cardPath} alt="" loading="lazy" decoding="async"/>{/if}
 <span class="timeline-event-body"><small>{e.dateDisplay} · {e.datePrecision}</small><span class="timeline-event-title">{e.label}</span>{#if !compact}<span class="timeline-event-teaser">{e.summary}</span>{/if}</span>
 </button>
 {/each}
 </div>
 {#if !filtered.length}<p class="empty">No events in this period. Clear the filters to see all dates.</p>{/if}

 {#if selected}
 <section class="event-summary" aria-live="polite">
  <div class={'event-summary-grid'+(selected.featuredImage?' event-summary-grid--with-image':'')}>
   <div class="event-summary-copy">
    <p class="eyebrow">Selected event · {selected.dateDisplay}</p>
    <h3>{selected.label}</h3>
    <p class="event-summary-lead">{selected.summary}</p>
    <small>{selected.dateDisplay} · {selected.datePrecision} precision</small>
    {#if selected.contextParagraphs?.length}
     <div class="event-summary-context">
      <h4>{selected.contextTitle||'Historical context'}</h4>
      {#each selected.contextParagraphs as paragraph}<p>{paragraph}</p>{/each}
     </div>
    {/if}
    {#if selected.url}<p><a href={selected.url}>Read the linked account →</a></p>{/if}
    {#if ngaPoutamaForEvent(selected.id).length}
      <div class="event-wananga-links"><h4>Related published recording</h4>
        {#each ngaPoutamaForEvent(selected.id) as video (video.id)}
          <p><a href={video.source} target="_blank" rel="noopener noreferrer">{video.title} ↗</a> <small>{video.date}. {video.attribution}</small></p>
        {/each}
      </div>
    {/if}
   </div>
   {#if selected.featuredImage}
   <figure class="event-illustration">
    <a href={'/images/'+selected.featuredImage.slug+'/'} aria-label={'View source and details for '+selected.featuredImage.title}><img src={selected.featuredImage.assetPath} alt={selected.featuredImage.altText} loading="lazy" decoding="async"/></a>
    <figcaption><strong>{selected.featuredImage.title}</strong>{#if selected.featuredImage.dateDisplay}<span>Image date: {selected.featuredImage.dateDisplay}</span>{/if}<span>{selected.featuredImage.relation}</span><a href={'/images/'+selected.featuredImage.slug+'/'}>View image, source and attribution →</a></figcaption>
   </figure>
   {/if}
  </div>
  {#if selected.additionalImages?.length}
   <section class="event-companion-images" aria-label="Related documentary images">
    <h4>Additional documentary images</h4>
    <div class="event-companion-images-grid">
     {#each selected.additionalImages as image (image.slug)}
      <a href={'/images/'+image.slug+'/'}><img src={image.assetPath} alt={image.altText} loading="lazy" decoding="async"/><span>{image.title} · View source, date and attribution →</span></a>
     {/each}
    </div>
   </section>
  {/if}
  {#if selected.imageSourceLink}<p class="event-primary-source"><a href={selected.imageSourceLink} target="_blank" rel="noopener noreferrer">{selected.imageSourceLabel||'See the archival source'} ↗</a></p>{/if}
  {#if selected.additionalArchivalSources?.length}<div class="event-extra-sources"><h4>Original archive references</h4><ul>{#each selected.additionalArchivalSources as source}<li><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></li>{/each}</ul></div>{/if}
  {#if selected.relatedRecords?.length}<div class="event-related"><h4>Related people and organisations</h4><div class="event-related-links">{#each selected.relatedRecords as r}<a href={r.url}>{r.name}</a>{/each}</div></div>{/if}
  {#if selected.contextualSources?.length}<details class="sources"><summary>Sources and further reading · {selected.contextualSources.length}</summary><ul>{#each selected.contextualSources as source}<li>{#if source.url&&(/^https?:\/\//.test(source.url)||source.url.startsWith('/'))}<a href={source.url}>{source.label}</a>{:else}{source.label}{/if}</li>{/each}</ul></details>{/if}
 </section>
 {/if}
</section>
<style>
.timeline-overview-toolbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin:10px 0 3px;font-size:13px}
.timeline-overview-toolbar>div:first-child{display:grid;gap:4px}
.timeline-overview-toolbar>div:first-child span{color:var(--muted)}
.timeline-zoom-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.timeline-zoom-controls button{min-width:44px}
.timeline-zoom-level{display:flex;align-items:center;gap:8px;color:var(--muted);white-space:nowrap}
.timeline-zoom-level input{width:120px;padding:0;accent-color:var(--accent)}
.timeline-svg--interactive{height:92px;overflow:visible}
.timeline-svg--interactive .timeline-axis,.timeline-svg--interactive .timeline-tick{stroke:var(--line);stroke-width:1}
.timeline-svg--interactive .timeline-span{stroke:var(--accent);stroke-width:3;opacity:.38;transition:opacity .16s,stroke-width .16s}
.timeline-mark{cursor:pointer;outline:none;animation:timeline-marker-in .18s ease both}
.timeline-mark circle{fill:var(--accent);stroke:var(--surface);stroke-width:1;transition:fill .14s,stroke .14s,transform .14s}
.timeline-mark:hover circle,.timeline-mark:focus-visible circle,.timeline-mark.selected circle{fill:var(--text);stroke:var(--accent);stroke-width:2;transform:scale(1.45);transform-box:fill-box;transform-origin:center}
.timeline-mark:hover .timeline-span,.timeline-mark:focus-visible .timeline-span,.timeline-mark.selected .timeline-span{opacity:.9;stroke-width:5}
.timeline-mark:focus-visible circle{stroke:var(--text);filter:drop-shadow(0 0 3px var(--accent))}
.timeline-hover-label{min-height:1.5em;padding:0 0 3px;color:var(--muted);font-size:12px}
@keyframes timeline-marker-in{from{opacity:.45;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:700px){.timeline-overview-toolbar{align-items:flex-start;flex-direction:column}.timeline-zoom-controls{width:100%}.timeline-zoom-level{flex:1}.timeline-zoom-level input{width:min(40vw,150px)}}
@media(prefers-reduced-motion:reduce){.timeline-mark,.timeline-mark circle,.timeline-mark .timeline-span{animation:none!important;transition:none!important}}
</style>
