<script lang="ts">
 import {scaleLinear} from 'd3-scale';
 export let events:any[]=[];export let compact=false;export let onSelect:(e:any)=>void=()=>{};
 let from='';let to='';let selected:any=null;let includeUndated=true;
 const year=(e:any)=>e.datePrecision==='unknown'?null:(e.year??(e.startDate?.match(/^\d{4}/)?Number(e.startDate.slice(0,4)):null));
 $: dated=events.filter(e=>year(e)!==null);
 $: min=Math.min(...dated.map(e=>year(e)),1900);$: max=Math.max(...dated.map(e=>year(e)),2025);
 $: scale=scaleLinear().domain([min,max]).range([25,975]);
 $: filtered=events.filter(e=>{const y=year(e);if(y===null)return includeUndated;const end=e.endDate?.match(/^\d{4}/)?Number(e.endDate.slice(0,4)):y;return (!from||end>=Number(from))&&(!to||y<=Number(to))}).sort((a,b)=>(year(a)??Infinity)-(year(b)??Infinity)||a.id.localeCompare(b.id));
 $: ticks=scale.ticks(8);
 function pick(e:any){selected=e;onSelect(e)}
 function updateURL(){if(compact)return;const u=new URL(location.href);if(from)u.searchParams.set('from',from);else u.searchParams.delete('from');if(to)u.searchParams.set('to',to);else u.searchParams.delete('to');history.replaceState(null,'',u)}
 function decade(y:number){from=String(y);to=String(y+9);updateURL()}
 import {onMount} from 'svelte';onMount(()=>{if(!compact){const p=new URLSearchParams(location.search);from=p.get('from')||'';to=p.get('to')||'';const e=events.find(e=>e.id===p.get('event'));if(e)selected=e}});
</script>
<section class="timeline-box" aria-label="Linked timeline"><div class="section-head" style="margin-top:0"><p class="eyebrow">{compact?'This chapter in time':'Explore the chronology'}</p>{#if compact}<a href="/timeline/">Full timeline →</a>{/if}</div>
 {#if !compact}<div class="timeline-controls"><label>From year<input type="number" min="1000" max="2100" bind:value={from} on:change={updateURL}/></label><label>To year<input type="number" min="1000" max="2100" bind:value={to} on:change={updateURL}/></label><label><span>Undated</span><input type="checkbox" bind:checked={includeUndated}/></label><button on:click={()=>{from='';to='';includeUndated=true;updateURL()}}>Clear filters</button></div><div class="chips" style="margin-top:15px">{#each [1960,1970,1980,1990,2000,2010,2020] as y}<button aria-pressed={Number(from)===y&&Number(to)===y+9} on:click={()=>decade(y)}>{y}s</button>{/each}</div>{/if}
 <svg class="timeline-svg" viewBox="0 0 1000 65" role="img" aria-label="Event dates overview. Use the labelled events below to explore."><line x1="25" y1="25" x2="975" y2="25"/>{#each ticks as y}<line x1={scale(y)} y1="20" x2={scale(y)} y2="32"/><text x={scale(y)} y="55" text-anchor="middle">{y}</text>{/each}{#each filtered.filter(e=>year(e)!==null) as e}{#if e.endDate&&Number(e.endDate.slice(0,4))>year(e)}<rect x={scale(year(e))} y="21" width={Math.max(3,scale(Number(e.endDate.slice(0,4)))-scale(year(e)))} height="8"/>{:else}<circle cx={scale(year(e))} cy="25" r="3"/>{/if}{/each}</svg>
 <div class="timeline-rail" tabindex="0" aria-label="Chronological event buttons">{#each filtered as e}<button class="timeline-event" aria-pressed={selected?.id===e.id} on:click={()=>{pick(e);if(!compact){const u=new URL(location.href);u.searchParams.set('event',e.id);history.replaceState(null,'',u)}}}><small>{e.dateDisplay} · {e.datePrecision}</small><span>{e.label}</span></button>{/each}</div>
 {#if !filtered.length}<p class="empty">No events in this period. Clear the filters to see all dates.</p>{/if}
 {#if selected}<section class="event-summary" aria-live="polite"><h3>{selected.label}</h3><p>{selected.summary}</p><small>{selected.dateDisplay} · {selected.datePrecision} precision</small>{#if selected.url}<p><a href={selected.url}>Read the linked account →</a></p>{/if}{#if selected.sources?.length}<details class="sources"><summary>Event sources</summary><ul>{#each selected.sources as s}<li>{#if s.url&&(/^https?:\/\//.test(s.url)||s.url.startsWith('/'))}<a href={s.url}>{s.label}</a>{:else}{s.label}{/if}</li>{/each}</ul></details>{/if}</section>{/if}
</section>
