<script lang="ts">
 import {onMount} from 'svelte';
 export let records:any[]=[];
 export let themes:any[]=[];
 let query='';
 let kinds:string[]=[];
 let selectedThemes:string[]=[];
 let connectionMode='all';
 let linkedToPassages=false;
 let sortBy='name';
 let limit=60;

 $: types=[...new Set(records.map(r=>r.kind))].filter(k=>k!=='Story').sort();
 $: filtered=records.filter(r=>
  r.kind!=='Story'&&
  (!kinds.length||kinds.includes(r.kind))&&
  (!selectedThemes.length||selectedThemes.some(t=>r.themeIds?.includes(t)))&&
  (connectionMode==='all'||(connectionMode==='has'?Number(r.connectionCount)>0:Number(r.connectionCount)===0))&&
  (!linkedToPassages||Number(r.chapterCount)>0)&&
  (!query||[r.name,...(r.aliases||[])].join(' ').toLocaleLowerCase('en-NZ').includes(query.toLocaleLowerCase('en-NZ')))
 ).sort((a,b)=>{
  if(sortBy==='connections')return Number(b.connectionCount)-Number(a.connectionCount)||a.name.localeCompare(b.name,'en-NZ');
  if(sortBy==='passages')return Number(b.chapterCount)-Number(a.chapterCount)||a.name.localeCompare(b.name,'en-NZ');
  return a.name.localeCompare(b.name,'en-NZ');
 });

 function url(){
  const p=new URLSearchParams();
  if(query.trim())p.set('q',query.trim());
  kinds.forEach(k=>p.append('kind',k));
  selectedThemes.forEach(t=>p.append('theme',t));
  if(connectionMode!=='all')p.set('connections',connectionMode);
  if(linkedToPassages)p.set('chapters','1');
  if(sortBy!=='name')p.set('sort',sortBy);
  const search=p.toString();
  history.replaceState(null,'',location.pathname+(search?'?'+search:'')+location.hash);
  limit=60;
 }
 function toggle(k:string){kinds=kinds.includes(k)?kinds.filter(x=>x!==k):[...kinds,k];url()}
 function theme(t:string){selectedThemes=selectedThemes.includes(t)?selectedThemes.filter(x=>x!==t):[...selectedThemes,t];url()}
 function clearFilters(){query='';kinds=[];selectedThemes=[];connectionMode='all';linkedToPassages=false;sortBy='name';url()}
 onMount(()=>{
  const p=new URLSearchParams(location.search);
  query=p.get('q')||'';
  kinds=p.getAll('kind');
  selectedThemes=p.getAll('theme');
  const requested=p.get('connections')||'all';
  connectionMode=['has','none'].includes(requested)?requested:'all';
  linkedToPassages=p.get('chapters')==='1';
  const requestedSort=p.get('sort')||'name';
  sortBy=['connections','passages'].includes(requestedSort)?requestedSort:'name';
 });
</script>
<label>Find a name<input type="search" bind:value={query} on:input={url} placeholder="Name or other known name" style="display:block;width:100%;margin:12px 0 22px"/></label>
<div class="chips" aria-label="Entry types">{#each types as k}<button type="button" aria-pressed={kinds.includes(k)} on:click={()=>toggle(k)}>{k}</button>{/each}</div>
<details><summary>Filter by theme</summary><div class="chips">{#each themes as t}<button type="button" aria-pressed={selectedThemes.includes(t.id)} on:click={()=>theme(t.id)}>{t.title}</button>{/each}</div></details>
<div class="browse-refinements">
 <label>Documented connections<select bind:value={connectionMode} on:change={url}><option value="all">All entries</option><option value="has">Has a documented relationship</option><option value="none">No documented relationship</option></select></label>
 <label>Sort by<select bind:value={sortBy} on:change={url}><option value="name">Name</option><option value="connections">Most relationships</option><option value="passages">Most linked passages</option></select></label>
 <label class="browse-checkbox"><input type="checkbox" bind:checked={linkedToPassages} on:change={url}/> Linked to a chapter passage</label>
</div>
<p class="browse-count" aria-live="polite">{filtered.length} entries <button type="button" on:click={clearFilters}>Clear filters</button></p>
<div class="cards">{#each filtered.slice(0,limit) as r}<article class="card subject-browse-card"><figure class="browse-image" class:decorative={!r.featuredImage}><a href={r.url} aria-label={"Read "+r.name}><img src={r.featuredImage?.src||r.fallbackImage} alt={r.featuredImage?.alt||""} loading="lazy" decoding="async"/></a></figure><small>{r.kind}</small><a class="title" href={r.url}>{r.name}</a><p>{(r.description||r.story?.[0]||'').slice(0,180)}{(r.description||r.story?.[0]||'').length>180?'…':''}</p><p class="browse-evidence-counts">{r.chapterCount} linked {r.chapterCount===1?'passage':'passages'} · {r.connectionCount} {r.connectionCount===1?'relationship':'relationships'}</p></article>{/each}</div>
{#if !filtered.length}<p class="empty">No matching entries. Try another name or clear the filters.</p>{/if}
{#if filtered.length>limit}<button type="button" style="margin-top:25px" on:click={()=>limit+=60}>Show more entries</button>{/if}
<style>
 .browse-refinements{display:flex;flex-wrap:wrap;align-items:end;gap:12px 18px;margin:18px 0}
 .browse-refinements>label:not(.browse-checkbox){display:grid;gap:7px;font-weight:600}
 .browse-refinements select{min-height:44px;max-width:100%;padding:6px 10px}
 .browse-checkbox{display:flex;align-items:center;gap:9px;min-height:44px}
 .browse-checkbox input{width:20px;height:20px;accent-color:var(--accent)}
 .browse-evidence-counts{color:var(--muted);font-size:13px}
 .browse-count{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
</style>
