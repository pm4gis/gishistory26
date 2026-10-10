<script lang="ts">
  import {ngaPoutamaPlaylist,ngaPoutamaVideos,ngaPoutamaThumbnail} from '../lib/nga-poutama-videos.mjs';
  export let compact=false;
</script>
<section class="wananga-videos" aria-label="Ngā Poutama Matawhenua recordings">
  <div class="wananga-videos-heading">
    <div>
      <p class="eyebrow">Recorded wānanga</p>
      <h2>Ngā Poutama Matawhenua videos</h2>
      <p>Watch public GIS demonstrations and conversations from the practical Māori mapping programme. Duane Wilkins is identified by LINZ as a facilitator of the series; individual session presenters are credited separately.</p>
    </div>
    <a class="button" href={ngaPoutamaPlaylist} target="_blank" rel="noopener noreferrer">All recordings on YouTube ↗</a>
  </div>
  <div class:compact class="wananga-video-grid">
    {#each ngaPoutamaVideos as video (video.id)}
      <article class="wananga-video-card">
        <a class="wananga-video-thumbnail" href={video.source} target="_blank" rel="noopener noreferrer" aria-label={"Watch "+video.title+" on YouTube"}>
          <img src={ngaPoutamaThumbnail(video.id)} alt={"YouTube preview thumbnail for "+video.title} loading="lazy" decoding="async" referrerpolicy="no-referrer" width="480" height="360"/>
          <span aria-hidden="true" class="wananga-play">▶</span>
        </a>
        <div class="wananga-video-copy">
          <h3><a href={video.source} target="_blank" rel="noopener noreferrer">{video.title} ↗</a></h3>
          <small>{video.date}</small>
          <p>{video.description}</p>
          <small>{video.attribution}</small>
        </div>
      </article>
    {/each}
  </div>
  <p class="wananga-video-note">Thumbnails are displayed directly from YouTube and are not reproduced as project-owned assets. The full videos remain hosted by their publishers. See <a href="https://www.linz.govt.nz/our-work/location-information/geospatial-capability/nga-poutama-matawhenua-practical-maori-gis-mapping-wananga" target="_blank" rel="noopener noreferrer">LINZ’s programme information ↗</a>.</p>
</section>
