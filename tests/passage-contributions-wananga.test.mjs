import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import fs from 'node:fs';
import {passageContributionPageUrl,siteContributionPageUrl,contributionDraft,contributionMailtoUrl,contributionText,contributionContextFromSearch,passagePermanentUrl,contributionRecipient} from '../src/lib/passage-contributions.mjs';
import {ngaPoutamaVideos,ngaPoutamaPlaylist,ngaPoutamaThumbnail,ngaPoutamaForPassage,ngaPoutamaForEvent,ngaPoutamaRecordLinks} from '../src/lib/nga-poutama-videos.mjs';

const article={title:'Coordinates enter the computer',url:'/stories/coordinates-enter-the-computer/'};
const passage={title:'Transforming one coordinate world into another',slug:'transforming-one-coordinate-world-into-another-2ab91fbc4f'};

test('passage contribution opens on the site and retains the permanent link',()=>{
 const url=passagePermanentUrl(article,passage);
 const parsed=new URL(passageContributionPageUrl(article,passage),'https://history.pm4gis.nz');
 assert.equal(parsed.pathname,'/contribute/');
 assert.equal(parsed.searchParams.get('chapter'),article.title);
 assert.equal(parsed.searchParams.get('passage'),passage.title);
 assert.equal(parsed.searchParams.get('ref'),url);
 assert.equal(siteContributionPageUrl(),'/contribute/');
 const draft=contributionDraft(contributionContextFromSearch(parsed.search));
 for(const field of ['Chapter: '+article.title,'Passage: '+passage.title,'Link to passage: '+url,'correct, add or clarify','sources, photographs','credited'])assert.ok(draft.body.includes(field),field);
 const mail=new URL(contributionMailtoUrl(draft.subject,draft.body));
 assert.equal(mail.protocol,'mailto:');
 assert.equal(decodeURIComponent(mail.pathname),contributionRecipient);
 assert.equal(mail.searchParams.get('subject'),draft.subject);
 assert.equal(mail.searchParams.get('body'),draft.body);
 assert.ok(contributionText(draft).startsWith('To: '+contributionRecipient+'\nSubject: '));
});
test('different passages get different on-site contribution links',()=>{
 const one=passageContributionPageUrl(article,passage);
 const two=passageContributionPageUrl(article,{title:'Second subsection',slug:'second-test-subsection'});
 assert.notEqual(one,two);
 assert.ok(new URL(two,'https://history.pm4gis.nz').searchParams.get('ref').includes('#second-test-subsection'));
});
test('contribution answers are included in the prepared text',()=>{
 const draft=contributionDraft({contribution:'Fix the date',whoWhen:'Map team in 1998',sources:'https://example.org/source',credit:'Use my name'});
 for(const value of ['Fix the date','Map team in 1998','https://example.org/source','Use my name'])assert.ok(draft.body.includes(value));
});
test('contribution context rejects external passage links',()=>{
 assert.equal(contributionContextFromSearch('?ref='+encodeURIComponent('https://evil.example/stories/a/#b')).reference,'');
 assert.equal(contributionContextFromSearch('?ref='+encodeURIComponent(passagePermanentUrl(article,passage))).reference,passagePermanentUrl(article,passage));
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

test('reader, about and navigation use the provider-neutral contribution page',()=>{
 const reader=readFileSync('src/components/Reader.svelte','utf8');
 assert.ok(reader.includes('Copy link</button><a class="button passage-contribute"'));
 assert.ok(reader.includes('passageContributionPageUrl(article,p)'));
 assert.ok(readFileSync('src/layouts/Layout.astro','utf8').includes('siteContributionPageUrl()'));
 assert.ok(readFileSync('src/pages/about/index.astro','utf8').includes('siteContributionPageUrl()'));
 const page=readFileSync('src/pages/contribute/index.astro','utf8');
 for(const item of ['contributionContextFromSearch(window.location.search)','Copy complete message','Copy email address','Open email app','contributionMailtoUrl','contributionText(draft())','id="contribution-reference"'])assert.ok(page.includes(item),item);
 assert.ok(!page.includes('window.location.replace'));
 assert.ok(!page.includes('mail.google.com'));
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
