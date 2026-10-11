<script lang="ts">
  import {ngaPoutamaPlaylist,ngaPoutamaVideos,ngaPoutamaThumbnail,ngaPoutamaTopics,ngaPoutamaRelatedRecords} from '../lib/nga-poutama-videos.mjs';
  export let videos:any[]=ngaPoutamaVideos;
  export let compact=false;
  export let inline=false;
  export let archive=false;
  export let readingLinks:Record<string,string>={};
  let query='';
  let topic='all';
  $: listed=(topic==='all'?videos:videos.filter((v:any)=>v.topics?.includes(topic))).filter((v:any)=>(v.title+' '+v.description+' '+v.attribution).toLowerCase().includes(query.trim().toLowerCase()));
  $: topics=ngaPoutamaTopics.filter(([id]:any)=>id==='all'||videos.some((v:any)=>v.topics.includes(id)));
</script>
<section class:wananga-videos--inline={inline} class="wananga-videos" aria-label={inline?'Related Māori GIS video recordings':'Ngā Poutama Matawhenua recordings'}>
  {#if inline}
    <div class="wananga-videos-inline-head">
      <h3>{videos.length===1?'Related recorded wānanga':'Related recorded wānanga and demonstrations'}</h3>
      <p>Later recordings are supplementary resources, not evidence that their tools existed at the time of the historical account.</p>
    </div>
  {:else}
    <div class="wananga-videos-heading">
      <div>
        <p class="eyebrow">Documentary video archive</p>
        <h2>Ngā Poutama Matawhenua {archive?'recordings archive':'recordings'}</h2>
        <p>{videos.length} individually identified recordings and conversations, with publication dates and presenter names where the published sources establish them. This curated catalogue is not claimed to contain every older video in the YouTube playlist. Duane Wilkins is a documented facilitator of the series; other presenters are credited to their particular recording.</p>
      </div>
      <a class="button" href={ngaPoutamaPlaylist} target="_blank" rel="noopener noreferrer">Official LINZ playlist ↗</a>
    </div>
  {/if}
  {#if archive}<p class="wananga-archive-note">These sixteen identified recordings include fourteen retrieved from the official LINZ playlist feed and two separately verified links. Older videos could not be exhaustively enumerated; consult the official playlist for additional material.</p><label class="wananga-search-label" for="wananga-video-query">Search recordings</label><input id="wananga-video-query" class="wananga-video-query" type="search" bind:value={query} placeholder="Presenter, subject, tool or dataset" autocomplete="off"/><p class="wananga-video-count" aria-live="polite">{listed.length} matching recordings</p>{/if}
  {#if !inline&&videos.length>6}
    <div class="wananga-video-filters" role="group" aria-label="Filter Ngā Poutama recordings by kaupapa">
      {#each topics as pair (pair[0])}
        <button aria-pressed={topic===pair[0]} on:click={()=>topic=pair[0]}>{pair[1]}</button>
      {/each}
    </div>
  {/if}
  {#if inline&&videos.length>1}<p class="wananga-video-note">Scroll sideways through the related recordings, or use Tab to open any video.</p>{/if}
  <div class:compact class:wananga-video-grid--inline={inline} class="wananga-video-grid" tabindex={inline&&videos.length>1?0:undefined} role={inline&&videos.length>1?'region':undefined} aria-label={inline&&videos.length>1?'Horizontally scrollable related wānanga recordings':undefined}>
    {#each listed as video (video.id)}
      <article class="wananga-video-card">
        <a class="wananga-video-thumbnail" href={video.source} target="_blank" rel="noopener noreferrer" aria-label={"Watch "+video.title+" on YouTube"}>
          <img src={ngaPoutamaThumbnail(video.id)} alt={"YouTube-hosted video thumbnail: "+video.title} loading="lazy" decoding="async" referrerpolicy="no-referrer" width="480" height="360"/>
          <span aria-hidden="true" class="wananga-play">▶</span>
        </a>
        <div class="wananga-video-copy">
          <h3><a href={video.source} target="_blank" rel="noopener noreferrer">{video.title} ↗</a></h3>
          <small>{video.date}</small>
          <p>{video.description}</p>
          <small>{video.attribution}</small>
          {#if readingLinks[video.passageIds[0]]}<p class="wananga-video-evidence"><a href={readingLinks[video.passageIds[0]]}>Read the related history passage →</a></p>{/if}
          {#if video.eventIds?.length}<p class="wananga-video-evidence"><a href={'/timeline/?event='+encodeURIComponent(video.eventIds[0])}>Related timeline entry →</a></p>{/if}
          {#if ngaPoutamaRelatedRecords(video.id).length}
            <p class="wananga-video-people">Connected entries:
              {#each ngaPoutamaRelatedRecords(video.id) as related (related.url)}
                <a href={related.url}>{related.name}</a>
              {/each}
            </p>
          {/if}
        </div>
      </article>
    {/each}
  </div>
  {#if !inline&&!archive}<p><a class="button" href="/nga-poutama-videos/">Browse all sixteen verified recordings →</a></p>{/if}
  {#if !inline}
    <p class="wananga-video-note">Thumbnails are loaded from YouTube, not downloaded or republished as project assets. YouTube retains the original recordings. See <a href="https://www.linz.govt.nz/our-work/location-information/geospatial-capability/nga-poutama-matawhenua-practical-maori-gis-mapping-wananga" target="_blank" rel="noopener noreferrer">LINZ’s programme information ↗</a>.</p>
  {/if}
</section>
