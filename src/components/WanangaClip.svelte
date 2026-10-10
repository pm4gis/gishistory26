<script lang="ts">
 import {ngaPoutamaThumbnail} from '../lib/nga-poutama-videos.mjs';
 export let video:any;
</script>
<aside class="wananga-inline" aria-label={'Later recorded Māori GIS demonstration: '+video.title}>
 <a class="wananga-inline-image" href={video.source} target="_blank" rel="noopener noreferrer" aria-label={'Watch '+video.title+' on YouTube'}>
  <img src={ngaPoutamaThumbnail(video.id)} alt={'YouTube video thumbnail: '+video.title} loading="lazy" decoding="async" width="480" height="360" referrerpolicy="no-referrer"/>
  <span class="wananga-play" aria-hidden="true">▶</span>
 </a>
 <div class="wananga-inline-copy">
  <p class="eyebrow">Related later demonstration · {video.publishedAt||'date unconfirmed'}</p>
  <h3><a href={video.source} target="_blank" rel="noopener noreferrer">{video.title} ↗</a></h3>
  <p>{video.description}</p>
  <small>{video.attribution}. This video illustrates subsequent practice; it is not original footage of the historical events described in this passage.</small>
 </div>
</aside>
