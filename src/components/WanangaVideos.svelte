<script lang="ts">
  import {ngaPoutamaPlaylist,ngaPoutamaVideos,ngaPoutamaThumbnail} from '../lib/nga-poutama-videos.mjs';
  export let compact=false;
  export let archive=false;
  export let readingLinks:Record<string,string>={};
  export let recordLinks:Record<string,{name:string,url:string}>={};
  let topic='All';
  let query='';
  const featured=new Set(['yCBeRHA2Jnk','Fqq3Fzi5djc','KYEVxcBEVQ8','hCAVoBwRJwE']);
  $: topics=['All',...new Set(ngaPoutamaVideos.map(v=>v.topic))].sort((a,b)=>a==='All'?-1:b==='All'?1:a.localeCompare(b));
  $: list=(archive?ngaPoutamaVideos:ngaPoutamaVideos.filter(v=>featured.has(v.id))).filter(v=>(topic==='All'||v.topic===topic)&&(v.title+' '+v.description+' '+v.presenters.join(' ')).toLowerCase().includes(query.trim().toLowerCase()));
</script>
<section class="wananga-videos" aria-label="Ngā Poutama Matawhenua recordings">
  <div class="wananga-videos-heading">
    <div>
      <p class="eyebrow">Recorded wānanga</p>
      <h2>Ngā Poutama Matawhenua {archive?'recordings index':'videos'}</h2>
      <p>Public demonstrations and discussions from the practical Māori GIS programme. Duane Wilkins is documented as a programme facilitator; individual session presenters are identified only where a recording or authoritative source names them.</p>
    </div>
    <a class="button" href={ngaPoutamaPlaylist} target="_blank" rel="noopener noreferrer">Official LINZ YouTube playlist ↗</a>
  </div>
  {#if archive}
    <p class="wananga-archive-note">Sixteen individually verified recordings are indexed here. Fourteen appear in the available official playlist feed (November 2024 to June 2026); two are verified separately. The playlist contains earlier material that could not be exhaustively enumerated, so this is a documented selection, not a complete inventory.</p>
    <div class="wananga-filterbar">
      <label for="wananga-query">Search recordings</label>
      <input id="wananga-query" type="search" bind:value={query} placeholder="Topic, presenter or tool" autocomplete="off"/>
      <label for="wananga-topic">Topic</label>
      <select id="wananga-topic" bind:value={topic}>{#each topics as t}<option value={t}>{t}</option>{/each}</select>
      <span aria-live="polite">{list.length} recording{list.length===1?'':'s'}</span>
    </div>
  {/if}
  <div class:compact class="wananga-video-grid">
    {#each list as video (video.id)}
      <article class="wananga-video-card">
        <a class="wananga-video-thumbnail" href={video.source} target="_blank" rel="noopener noreferrer" aria-label={'Watch '+video.title+' on YouTube'}>
          <img src={ngaPoutamaThumbnail(video.id)} alt={'YouTube thumbnail for '+video.title} loading="lazy" decoding="async" referrerpolicy="no-referrer" width="480" height="360"/>
          <span aria-hidden="true" class="wananga-play">▶</span>
        </a>
        <div class="wananga-video-copy">
          <small class="wananga-video-topic">{video.topic}</small>
          <h3><a href={video.source} target="_blank" rel="noopener noreferrer">{video.title} ↗</a></h3>
          <small>{video.date}</small>
          <p>{video.description}</p>
          <small>{video.attribution}</small>
          {#if readingLinks[video.passageId]}<p class="wananga-related-reading"><a href={readingLinks[video.passageId]}>Read the related NZ GIS history passage →</a></p>{/if}
          {#if video.eventIds?.length}<p class="wananga-related-reading"><a href={'/timeline/?event='+encodeURIComponent(video.eventIds[0])}>Related historical timeline event →</a></p>{/if}
          {#if video.recordIds?.some(id=>id!=='entity:nga-poutama-matawhenua'&&recordLinks[id])}<p class="wananga-record-links">Connected entries: {#each video.recordIds.filter(id=>id!=='entity:nga-poutama-matawhenua'&&recordLinks[id]) as id,i (id)}{#if i>0} · {/if}<a href={recordLinks[id].url}>{recordLinks[id].name}</a>{/each}</p>{/if}
        </div>
      </article>
    {/each}
  </div>
  {#if archive&&list.length===0}<p class="muted">No recordings match the current search. Try another topic or remove the search term.</p>{/if}
  {#if !archive}<p><a class="button" href="/nga-poutama-videos/">Explore all 16 verified recordings and related historical accounts →</a></p>{/if}
  <p class="wananga-video-note">Thumbnails are linked directly from YouTube, not stored as NZ GIS History images. Videos remain with their publishers. <a href="https://www.linz.govt.nz/our-work/location-information/geospatial-capability/nga-poutama-matawhenua-practical-maori-gis-mapping-wananga" target="_blank" rel="noopener noreferrer">Official LINZ programme page ↗</a></p>
</section>
