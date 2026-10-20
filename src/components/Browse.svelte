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
 let browseSection='all';
 let contextKinds:string[]=[];
 const organisationKinds=['Organisation','Agency','Business','Council','Community'];

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
 function clearFilters(){query='';kinds=[...contextKinds];selectedThemes=[];connectionMode='all';linkedToPassages=false;sortBy='name';url()}
 onMount(()=>{
  const p=new URLSearchParams(location.search);
  query=p.get('q')||'';
  kinds=p.getAll('kind');
  const requestedKinds=p.getAll('kind');
  browseSection=requestedKinds.length===1&&requestedKinds[0]==='Person'?'people':requestedKinds.length>0&&requestedKinds.every(k=>organisationKinds.includes(k))?'organisations':'all';
  contextKinds=browseSection==='all'?[]:[...requestedKinds];
  const heading=document.querySelector<HTMLElement>('[data-browse-title]');
  const intro=document.querySelector<HTMLElement>('[data-browse-intro]');
  const sectionTitle=browseSection==='people'?'People':browseSection==='organisations'?'Organisations':'People & organisations';
  if(heading)heading.textContent=sectionTitle;
  if(intro)intro.textContent=browseSection==='people'?'Find people who contributed to the development and use of GIS in New Zealand.':browseSection==='organisations'?'Find government agencies, councils, companies and communities in New Zealand GIS history.':'Find people, organisations, projects and historical records.';
  document.title=sectionTitle+' · NZ GIS History';
  selectedThemes=p.getAll('theme');
  const requested=p.get('connections')||'all';
  connectionMode=['has','none'].includes(requested)?requested:'all';
  linkedToPassages=p.get('chapters')==='1';
  const requestedSort=p.get('sort')||'name';
  sortBy=['connections','passages'].includes(requestedSort)?requestedSort:'name';
 });
</script>
<div class="browse-simple-tools"><label>{browseSection==='people'?'Find a person':browseSection==='organisations'?'Find an organisation':'Find a name'}<input type="search" bind:value={query} on:input={url} placeholder="Search names and alternative names"/></label><a href="/search/">Search all historical content ↗</a></div>
<details class="browse-advanced"><summary>More filters and sorting</summary>
<div class="chips" aria-label="Entry types">{#each types as k}<button type="button" aria-pressed={kinds.includes(k)} on:click={()=>toggle(k)}>{k}</button>{/each}</div>
<details><summary>Filter by historical theme</summary><div class="chips">{#each themes as t}<button type="button" aria-pressed={selectedThemes.includes(t.id)} on:click={()=>theme(t.id)}>{t.title}</button>{/each}</div></details>
<div class="browse-refinements">
 <label>Documented connections<select bind:value={connectionMode} on:change={url}><option value="all">All entries</option><option value="has">Has a documented relationship</option><option value="none">No documented relationship</option></select></label>
 <label>Sort by<select bind:value={sortBy} on:change={url}><option value="name">Name</option><option value="connections">Most relationships</option><option value="passages">Most linked passages</option></select></label>
 <label class="browse-checkbox"><input type="checkbox" bind:checked={linkedToPassages} on:change={url}/> Linked to a chapter passage</label>
</div></details>
<p class="browse-count" aria-live="polite">{filtered.length} {filtered.length===1?'entry':'entries'} <button type="button" on:click={clearFilters}>Reset filters</button></p>
<div class="cards browse-cards">{#each filtered.slice(0,limit) as r}<article class={'card subject-browse-card'+(r.kind==='Person'?' subject-browse-card--person':'')}>{#if r.kind!=='Person'}<figure class="browse-image" class:decorative={!r.featuredImage}><a href={r.url} aria-label={"Read "+r.name}><img src={r.featuredImage?.src||r.fallbackImage} alt={r.featuredImage?.alt||""} loading="lazy" decoding="async"/></a></figure>{/if}<small>{r.kind}</small><a class="title" href={r.url}>{r.name}</a><p>{(r.description||r.story?.[0]||'').slice(0,180)}{(r.description||r.story?.[0]||'').length>180?'…':''}</p><p class="browse-evidence-counts">{r.chapterCount} linked {r.chapterCount===1?'passage':'passages'} · {r.connectionCount} {r.connectionCount===1?'relationship':'relationships'}</p></article>{/each}</div>
{#if !filtered.length}<p class="empty">No matching entries. Try another name or clear the filters.</p>{/if}
{#if filtered.length>limit}<button type="button" style="margin-top:25px" on:click={()=>limit+=60}>Show more entries</button>{/if}
<style>
 .browse-simple-tools{display:flex;align-items:end;justify-content:space-between;gap:18px;flex-wrap:wrap;margin:25px 0 10px}
 .browse-simple-tools label{display:grid;gap:8px;font-weight:600;flex:1 1 320px;max-width:640px}
 .browse-simple-tools input{width:100%;min-height:50px}
 .browse-simple-tools>a{font-size:14px;min-height:44px;display:inline-flex;align-items:center}
 .browse-advanced{border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin:8px 0 20px;padding:0 3px 12px}
 .browse-advanced>summary{font-weight:650;color:var(--text)}
 .browse-advanced .chips{margin:10px 0}
 .browse-advanced .chips button{font-size:13px;min-height:38px}
 .browse-cards{grid-template-columns:repeat(auto-fill,minmax(min(100%,270px),1fr))}
 .subject-browse-card--person{padding:21px 22px;border-radius:12px}
 .subject-browse-card--person .title{margin:7px 0 10px;font-size:20px}
 .subject-browse-card--person p{font-size:14px;line-height:1.55}
 .subject-browse-card--person>small{font-size:11px;letter-spacing:.08em;text-transform:uppercase}
 .subject-browse-card .browse-evidence-counts{margin-top:auto;font-size:12px;line-height:1.5}
 @media(max-width:650px){.browse-cards{grid-template-columns:1fr}.subject-browse-card--person{padding:17px 19px}.browse-simple-tools{align-items:stretch;gap:3px}.browse-simple-tools label{flex-basis:100%}}
 .browse-refinements{display:flex;flex-wrap:wrap;align-items:end;gap:12px 18px;margin:18px 0}
 .browse-refinements>label:not(.browse-checkbox){display:grid;gap:7px;font-weight:600}
 .browse-refinements select{min-height:44px;max-width:100%;padding:6px 10px}
 .browse-checkbox{display:flex;align-items:center;gap:9px;min-height:44px}
 .browse-checkbox input{width:20px;height:20px;accent-color:var(--accent)}
 .browse-evidence-counts{color:var(--muted);font-size:13px}
 .browse-count{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
</style>
