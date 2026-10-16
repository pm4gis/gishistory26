import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import fs from 'node:fs';
import {passageContributionMailtoUrl,siteContributionMailtoUrl,siteContributionPageUrl,passageContributionPageUrl,contributionDraft,contributionMailtoUrl,contributionText,contributionContextFromSearch,passagePermanentUrl,contributionRecipient,productionOrigin} from '../src/lib/passage-contributions.mjs';
import {ngaPoutamaVideos,ngaPoutamaPlaylist,ngaPoutamaThumbnail,ngaPoutamaForPassage,ngaPoutamaForEvent,ngaPoutamaRecordLinks} from '../src/lib/nga-poutama-videos.mjs';

const article={title:'Coordinates enter the computer',url:'/stories/coordinates-enter-the-computer/'};
const passage={title:'Transforming one coordinate world into another',slug:'transforming-one-coordinate-world-into-another-2ab91fbc4f'};

test('passage Contribute goes directly to a provider-neutral mailto draft',()=>{
 const url=passagePermanentUrl(article,passage);
 const mail=new URL(passageContributionMailtoUrl(article,passage));
 assert.equal(mail.protocol,'mailto:');
 assert.equal(decodeURIComponent(mail.pathname),contributionRecipient);
 assert.ok(mail.searchParams.get('subject').includes(passage.title));
 for(const phrase of ['Chapter: '+article.title,'Passage: '+passage.title,'Link to passage: '+url,'correct, add or clarify','sources, photographs','reuse rights or licence','credited','attach any photos'])assert.ok(mail.searchParams.get('body').includes(phrase),phrase);
 assert.equal(new URL(siteContributionMailtoUrl()).protocol,'mailto:');
 const fallback=new URL(passageContributionPageUrl(article,passage),'https://history.pm4gis.nz');
 assert.equal(fallback.pathname,'/contribute/');
 assert.equal(fallback.searchParams.get('ref'),url);
 assert.equal(fallback.searchParams.get('page'),article.title);
 assert.equal(fallback.searchParams.get('pageUrl'),url);
 assert.ok(contributionText(contributionDraft(contributionContextFromSearch(fallback.search))).includes(url));
});
test('page correction links carry the page title and safe first-party URL',()=>{
 const pageUrl=productionOrigin+'/about/';
 const target=new URL(siteContributionPageUrl('About the project',pageUrl),productionOrigin);
 assert.equal(target.pathname,'/contribute/');
 assert.equal(target.searchParams.get('page'),'About the project');
 assert.equal(target.searchParams.get('pageUrl'),pageUrl);
 const context=contributionContextFromSearch(target.search);
 assert.equal(context.pageTitle,'About the project');
 assert.equal(context.pageUrl,pageUrl);
 assert.ok(contributionDraft(context).body.includes('Link to page: '+pageUrl));
 assert.equal(contributionContextFromSearch('?page=Outside&pageUrl='+encodeURIComponent('https://evil.example/about/')).pageUrl,'');
});
test('separate passages have separate prefilled email drafts',()=>{
 const one=passageContributionMailtoUrl(article,passage);
 const two=passageContributionMailtoUrl(article,{title:'Second subsection',slug:'second-test-subsection'});
 assert.notEqual(one,two);
 assert.ok(new URL(two).searchParams.get('body').includes('#second-test-subsection'));
});
test('the email contains the contributor questions and attachment instruction',()=>{
 const draft=contributionDraft({contribution:'Correct the date',whoWhen:'GIS team 1998',sources:'Old map',credit:'Use my name'});
 for(const x of ['Correct the date','GIS team 1998','Old map','Use my name','attach any photos'])assert.ok(draft.body.includes(x));
 assert.ok(contributionText(draft).includes(contributionRecipient));
 assert.equal(new URL(contributionMailtoUrl(draft.subject,draft.body)).searchParams.get('body'),draft.body);
});
test('unsafe off-site references cannot be inserted into contribution drafts',()=>{
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
 assert.equal(ngaPoutamaForEvent('linzcap-2026-06-korero-a-mahere-3d-storymaps-wananga').length,0,'2026 recordings must not reference an event in the historical timeline');
 assert.equal(ngaPoutamaForEvent('linzcap-2025-05-16-nga-poutama-explores-korero-takutai')[0].id,'gZdhElp_GrI');
 assert.ok(ngaPoutamaRecordLinks['ZCb9zLz12O4'].some(x=>x.url==='/people/holden-hohaia/'));
 assert.ok(ngaPoutamaVideos.every(v=>v.evidenceUrl?.startsWith('https://')));
 assert.throws(()=>ngaPoutamaThumbnail('../bad'));
});

test('reader, about and navigation open direct email with a no-form fallback',()=>{
 const reader=readFileSync('src/components/Reader.svelte','utf8');
 assert.ok(reader.includes('Copy link</button><a class="button passage-contribute"'));
 assert.ok(reader.includes('passageContributionMailtoUrl(article,p)'));
 assert.ok(reader.includes('passageContributionPageUrl(article,p)'));
 assert.ok(readFileSync('src/layouts/Layout.astro','utf8').includes('siteContributionPageUrl(title,canonical.href)'));
 assert.ok(readFileSync('src/pages/about/index.astro','utf8').includes('siteContributionPageUrl'));
 const page=readFileSync('src/pages/contribute/index.astro','utf8');
 for(const item of ['contributionContextFromSearch(window.location.search)','Gmail in browser','Outlook in browser','Copy prepared email','Open my email app','contributionMailtoUrl','contributionText(current)','id="contribution-reference"','id="contribution-page-reference"'])assert.ok(page.includes(item),item);
 assert.ok(!/<form\b|<input\b|<textarea\b|window\.location\.replace/.test(page));
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
 assert.ok(timeline.includes('historicalEventVideos(selected.id)'));
 assert.ok(timeline.includes('video.publishedOn<=TIMELINE_LAST_DATE'));
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
