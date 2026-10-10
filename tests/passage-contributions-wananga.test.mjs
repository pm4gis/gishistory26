import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import fs from 'node:fs';
import {passageContributionMailto,passagePermanentUrl,passageContributionPageUrl,contributionRecipient} from '../src/lib/passage-contributions.mjs';
import {ngaPoutamaVideos,ngaPoutamaPlaylist,ngaPoutamaThumbnail,ngaPoutamaForPassage,ngaPoutamaForEvent,ngaPoutamaRecordLinks} from '../src/lib/nga-poutama-videos.mjs';

const article={title:'Coordinates enter the computer',url:'/stories/coordinates-enter-the-computer/'};
const passage={title:'Transforming one coordinate world into another',slug:'transforming-one-coordinate-world-into-another-2ab91fbc4f'};

test('passage contribution opens user email client with exact canonical deep link, questions, and source request',()=>{
 const url=passagePermanentUrl(article,passage);
 assert.equal(url,'https://history.pm4gis.nz/stories/coordinates-enter-the-computer/#transforming-one-coordinate-world-into-another-2ab91fbc4f');
 const mailto=passageContributionMailto(article,passage);
 const parsed=new URL(mailto);
 assert.equal(parsed.protocol,'mailto:');
 assert.equal(parsed.pathname,contributionRecipient);
 assert.equal(contributionRecipient,'pm4gis@gmail.com');
 assert.ok(parsed.searchParams.get('subject')?.startsWith('NZ GIS History Contributions and Corrections'));
 assert.ok(parsed.searchParams.get('subject')?.includes(passage.title));
 const body=parsed.searchParams.get('body')||'';
 assert.ok(body.includes('Link to passage: '+url));
 for(const field of ['Chapter: '+article.title,'Passage: '+passage.title,'correct, add or clarify','dates, sources, links or documents','credit your name','permission to share']){
  assert.ok(body.includes(field),'Missing contribution prompt: '+field);
 }
 assert.ok(!mailto.includes('\n'),'Must encode line breaks in URL');
});

test('email links independently identify all chapters and passages without losing location',()=>{
 const one=passageContributionMailto(article,passage);
 const two=passageContributionMailto(article,{title:'A second subsection',slug:'second-test-subsection'});
 assert.notEqual(one,two);
 const body=new URL(two).searchParams.get('body')||'';
 assert.ok(body.includes('/stories/coordinates-enter-the-computer/#second-test-subsection'));
});

test('invalid non-passage URLs cannot create misleading contribution references',()=>{
 assert.throws(()=>passagePermanentUrl({url:'https://evil.example/page'},passage));
 assert.throws(()=>passagePermanentUrl(article,{slug:'bad#anchor'}));
 assert.throws(()=>passagePermanentUrl(article,{}));
});

test('Ngā Poutama recordings are verified direct video links with external thumbnail attribution',()=>{
 assert.equal(ngaPoutamaVideos.length,16);
 assert.equal(new Set(ngaPoutamaVideos.map(v=>v.id)).size,16);
 assert.match(ngaPoutamaPlaylist,/^https:\/\/www\.youtube\.com\/playlist\?list=/);
 for(const video of ngaPoutamaVideos){
  assert.match(video.id,/^[\w-]{11}$/);
  assert.equal(video.source,'https://www.youtube.com/watch?v='+video.id);
  assert.equal(ngaPoutamaThumbnail(video.id),'https://i.ytimg.com/vi/'+video.id+'/hqdefault.jpg');
  for(const f of ['title','description','date','attribution'])assert.ok(video[f].length>8);
 }
 assert.ok(ngaPoutamaVideos.some(v=>v.description.includes('Duane Wilkins')));
 assert.ok(ngaPoutamaVideos.some(v=>v.description.includes('Keith Holswich')));
 assert.equal(ngaPoutamaVideos.filter(v=>v.publishedOn).length,15);
 assert.equal(ngaPoutamaForPassage('passage:chapter-20-5cf3bc2665')[0].id,'yZcwtxGsZIE');
 assert.equal(ngaPoutamaForEvent('linzcap-2026-06-korero-a-mahere-3d-storymaps-wananga')[0].id,'uDBBtaO5k5Q');
 assert.equal(ngaPoutamaForEvent('linzcap-2025-05-16-nga-poutama-explores-korero-takutai')[0].id,'gZdhElp_GrI');
 assert.ok(ngaPoutamaRecordLinks['ZCb9zLz12O4'].some(x=>x.url==='/people/holden-hohaia/'));
 assert.ok(ngaPoutamaVideos.every(v=>v.evidenceUrl?.startsWith('https://')));
 assert.throws(()=>ngaPoutamaThumbnail('../bad'));
});

test('new reader contribution is beside Copy link and person profiles stay image-free',()=>{
 const reader=readFileSync('src/components/Reader.svelte','utf8');
 assert.ok(reader.includes('Copy link</button><a class="button passage-contribute"'));
 assert.ok(reader.includes('passageContributionPageUrl(article,p)'));
 const next=passageContributionPageUrl(article,passage);const query=new URL(next,'https://history.pm4gis.nz');assert.equal(query.pathname,'/contribute/');assert.ok(query.searchParams.get('ref')?.includes('#'+passage.slug));
 const profile=readFileSync('src/pages/[...path].astro','utf8');
 assert.ok(profile.includes("r.kind==='Person'?null:pickRecordImage"));
 assert.ok(profile.includes("r.slug==='nga-poutama-matawhenua'"));
});


test('curated video associations point to published passages, events and people entries',()=>{
 function collectionIds(collection){return new Set(fs.readdirSync('src/content/'+collection).filter(p=>p.endsWith('.json')).map(p=>JSON.parse(fs.readFileSync('src/content/'+collection+'/'+p,'utf8')).id))}
 const passages=collectionIds('passages'),events=collectionIds('events');
 for(const video of ngaPoutamaVideos){
  for(const id of video.passageIds)assert.ok(passages.has(id),video.id+': missing passage '+id);
  for(const id of video.eventIds)assert.ok(events.has(id),video.id+': missing event '+id);
 }
 for(const links of Object.values(ngaPoutamaRecordLinks))for(const link of links){
  assert.ok(fs.existsSync('src/content/records/'+link.url.split('/')[2]+'.json'),'missing profile '+link.url);
 }
 const reader=readFileSync('src/components/Reader.svelte','utf8');
 assert.ok(reader.includes('ngaPoutamaForPassage(p.id)'));
 assert.ok(reader.includes('blockIndex===Math.min(1,blocks(p).length-1)'));
 assert.ok(!reader.includes('complete&&article.slug===\'the-map-becomes-an-application\''),'end-of-chapter gallery should be replaced with passage inserts');
 const timeline=readFileSync('src/components/Timeline.svelte','utf8');
 assert.ok(timeline.includes('ngaPoutamaForEvent(selected.id)'));
});


test('new audiovisual archive preserves original filtered gallery and historical passage linking',()=>{
 const archive=readFileSync('src/pages/nga-poutama-videos/index.astro','utf8');
 const gallery=readFileSync('src/components/WanangaVideos.svelte','utf8');
 assert.ok(archive.includes('WanangaVideos archive client:load'));
 assert.ok(gallery.includes('bind:value={query}'));
 assert.ok(gallery.includes('readingLinks[video.passageIds[0]]'));
 assert.ok(gallery.includes('ngaPoutamaRelatedRecords(video.id)'));
 assert.ok(gallery.includes('video.eventIds?.length'));
 assert.ok(ngaPoutamaRecordLinks['gZdhElp_GrI'].some(r=>r.url==='/people/tania-te-hira/'));
});
