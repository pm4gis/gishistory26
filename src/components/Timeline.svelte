<script lang="ts">
 import {scaleLinear} from 'd3-scale';
 export let events:any[]=[];export let compact=false;export let onSelect:(e:any)=>void=()=>{};
 let from='';let to='';let term='';let selected:any=null;let includeUndated=true;
 const year=(e:any)=>e.datePrecision==='unknown'?null:(e.year??(e.startDate?.match(/^\d{4}/)?Number(e.startDate.slice(0,4)):null));
 $: dated=events.filter(e=>year(e)!==null);
 $: min=Math.min(...dated.map(e=>year(e)),1900);$: max=Math.max(...dated.map(e=>year(e)),2025);
 $: scale=scaleLinear().domain([min,max]).range([25,975]);
 $: filtered=events.filter(e=>{const y=year(e);if(y===null&&!includeUndated)return false;const end=e.endDate?.match(/^\d{4}/)?Number(e.endDate.slice(0,4)):y;const inPeriod=y===null||(!from||end>=Number(from))&&(!to||y<=Number(to));return inPeriod&&(!term||[e.label,e.summary,e.dateDisplay].some(v=>String(v||'').toLocaleLowerCase('en-NZ').includes(term.trim().toLocaleLowerCase('en-NZ'))))}).sort((a,b)=>(year(a)??Infinity)-(year(b)??Infinity)||a.id.localeCompare(b.id));
 $: ticks=scale.ticks(8);
 $: periodGroups=[...new Set(dated.map(e=>Math.floor((year(e)??0)/10)*10))].sort((a,b)=>a-b).map(y=>({year:y,count:dated.filter(e=>Math.floor((year(e)??0)/10)*10===y).length}));
 $: densityMax=Math.max(1,...periodGroups.map(x=>x.count));
 $: selectedPeriod=from&&to&&Number(to)===Number(from)+9?Number(from):null;
 function pick(e:any){selected=e;onSelect(e)}
 function updateURL(){if(compact)return;const u=new URL(location.href);if(from)u.searchParams.set('from',from);else u.searchParams.delete('from');if(to)u.searchParams.set('to',to);else u.searchParams.delete('to');if(term.trim())u.searchParams.set('q',term.trim());else u.searchParams.delete('q');if(!includeUndated)u.searchParams.set('undated','0');else u.searchParams.delete('undated');u.searchParams.delete('event');history.replaceState(null,'',u)}
 function decade(y:number){from=String(y);to=String(y+9);includeUndated=false;selected=null;updateURL()}
 function clearFilters(){from='';to='';term='';includeUndated=true;selected=null;updateURL()}
 import {onMount} from 'svelte';onMount(()=>{if(!compact){const p=new URLSearchParams(location.search);from=p.get('from')||'';to=p.get('to')||'';term=p.get('q')||'';includeUndated=p.get('undated')!=='0';const e=events.find(e=>e.id===p.get('event'));if(e)selected=e}});
</script>
<section class="timeline-box" aria-label="Linked timeline"><div class="section-head" style="margin-top:0"><p class="eyebrow">{compact?'This chapter in time':'Explore the chronology'}</p>{#if compact}<a href="/timeline/">Full timeline →</a>{/if}</div>
 {#if !compact}<div class="timeline-controls"><label>From year<input type="number" min="1000" max="2100" bind:value={from} on:change={updateURL}/></label><label>To year<input type="number" min="1000" max="2100" bind:value={to} on:change={updateURL}/></label><label><span>Undated</span><input type="checkbox" bind:checked={includeUndated} on:change={updateURL}/></label><label class="timeline-search">Find an event<input type="search" placeholder="Search dates and accounts" bind:value={term} on:input={()=>{selected=null;updateURL()}}/></label><button on:click={clearFilters}>Clear filters</button></div>
 <div class="period-head"><h2>Choose a decade</h2><p>Move from left to right through the history. Select a decade to focus the events below.</p></div>
 <nav class="period-nav" aria-label="Timeline decades">
 <button class="period-choice" class:active={!from&&!to} aria-pressed={!from&&!to} on:click={clearFilters}><strong>All years</strong><span>{dated.length} dated events</span></button>
 {#each periodGroups as group}
 <button class="period-choice" class:active={selectedPeriod===group.year} aria-pressed={selectedPeriod===group.year} on:click={()=>decade(group.year)}><strong>{group.year}s</strong><span>{group.count} {group.count===1?'event':'events'}</span><i class="period-density" aria-hidden="true" style={'--density:'+Math.round(group.count/densityMax*100)+'%'}></i></button>
 {/each}</nav>{/if}
 <svg class="timeline-svg" viewBox="0 0 1000 65" role="img" aria-label="Event dates overview. Use the labelled events below to explore."><line x1="25" y1="25" x2="975" y2="25"/>{#each ticks as y}<line x1={scale(y)} y1="20" x2={scale(y)} y2="32"/><text x={scale(y)} y="55" text-anchor="middle">{y}</text>{/each}{#each filtered.filter(e=>year(e)!==null) as e}{#if e.endDate&&Number(e.endDate.slice(0,4))>year(e)}<rect x={scale(year(e))} y="21" width={Math.max(3,scale(Number(e.endDate.slice(0,4)))-scale(year(e)))} height="8"/>{:else}<circle cx={scale(year(e))} cy="25" r="3"/>{/if}{/each}</svg>
 <div class="timeline-result-count" aria-live="polite">{filtered.length} of {events.length} events {#if !compact}· Select an event for its summary, sources and related account{/if}</div>

 <div class="timeline-rail" tabindex="0" aria-label="Chronological event buttons">
 {#each filtered as e (e.id)}
 <button class={'timeline-event'+(e.featuredImage?' timeline-event--photo':'')} aria-pressed={selected?.id===e.id} aria-label={e.dateDisplay+': '+e.label} on:click={()=>{pick(e);if(!compact){const u=new URL(location.href);u.searchParams.set('event',e.id);history.replaceState(null,'',u)}}>
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
   </div>
   {#if selected.featuredImage}
   <figure class="event-illustration">
    <a href={'/images/'+selected.featuredImage.slug+'/'} aria-label={'View source and details for '+selected.featuredImage.title}><img src={selected.featuredImage.assetPath} alt={selected.featuredImage.altText} loading="lazy" decoding="async"/></a>
    <figcaption><strong>{selected.featuredImage.title}</strong><span>{selected.featuredImage.relation}</span><a href={'/images/'+selected.featuredImage.slug+'/'}>View image, source and attribution →</a></figcaption>
   </figure>
   {/if}
  </div>
  {#if selected.imageSourceLink}<p class="event-primary-source"><a href={selected.imageSourceLink} target="_blank" rel="noopener noreferrer">{selected.imageSourceLabel||'See the archival source'} ↗</a></p>{/if}
  {#if selected.relatedRecords?.length}<div class="event-related"><h4>Related people and organisations</h4><div class="event-related-links">{#each selected.relatedRecords as r}<a href={r.url}>{r.name}</a>{/each}</div></div>{/if}
  {#if selected.contextualSources?.length}<details class="sources"><summary>Sources and further reading · {selected.contextualSources.length}</summary><ul>{#each selected.contextualSources as source}<li>{#if source.url&&(/^https?:\/\//.test(source.url)||source.url.startsWith('/'))}<a href={source.url}>{source.label}</a>{:else}{source.label}{/if}</li>{/each}</ul></details>{/if}
 </section>
 {/if}
</section>
