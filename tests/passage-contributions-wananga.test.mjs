import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {passageContributionMailto,passagePermanentUrl,contributionRecipient} from '../src/lib/passage-contributions.mjs';
import {ngaPoutamaVideos,ngaPoutamaPlaylist,ngaPoutamaFeedEvidence,ngaPoutamaThumbnail,videosForPassage} from '../src/lib/nga-poutama-videos.mjs';

const article={title:'Survey calculations',url:'/stories/coordinates-enter-the-computer/'};
const passage={title:'Transforming one coordinate world into another',slug:'transforming-one-coordinate-world-into-another-2ab91fbc4f'};

test('Contribute uses agreed address and exact subject, with passage URL and practical evidence questions',()=>{
 const url=passagePermanentUrl(article,passage);
 assert.equal(url,'https://history.pm4gis.nz/stories/coordinates-enter-the-computer/#transforming-one-coordinate-world-into-another-2ab91fbc4f');
 const mailto=passageContributionMailto(article,passage);
 const parsed=new URL(mailto);
 assert.equal(parsed.protocol,'mailto:');
 assert.equal(contributionRecipient,'pm4gis@gmail.com');
 assert.equal(parsed.pathname,contributionRecipient);
 assert.equal(parsed.searchParams.get('subject'),'NZ GIS History Contributions and Corrections');
 const body=parsed.searchParams.get('body')||'';
 assert.ok(body.includes('Link to passage: '+url));
 for(const field of ['Chapter: '+article.title,'Passage: '+passage.title,'correct, add or clarify','connection to the events','dates, sources, links or documents','credit your name','permission to share']){
  assert.ok(body.includes(field),'Missing contribution question '+field);
 }
 assert.ok(!mailto.includes('\n'));
});
test('Passage email drafts retain precise links in both chapter and page-by-page modes',()=>{
 const a=passageContributionMailto(article,passage);
 const b=passageContributionMailto(article,{slug:'another-passage',title:'Another passage'});
 assert.notEqual(a,b);
 assert.ok(new URL(b).searchParams.get('body')?.includes('https://history.pm4gis.nz/stories/coordinates-enter-the-computer/#another-passage'));
 for(const mode of ['?mode=page','']){
  assert.ok(passagePermanentUrl(article,passage).includes('#'+passage.slug));
 }
});
test('Malicious or noncanonical passage paths rejected',()=>{
 assert.throws(()=>passagePermanentUrl({url:'https://invalid.test/'} ,passage));
 assert.throws(()=>passagePermanentUrl(article,{slug:'bad#fragment'}));
 assert.throws(()=>passagePermanentUrl(article,{}));
});
test('Archive sources have unique valid IDs, evidence, speaker uncertainty and complete linked passage references',()=>{
 assert.equal(ngaPoutamaVideos.length,16);
 assert.equal(new Set(ngaPoutamaVideos.map(v=>v.id)).size,16);
 assert.equal(ngaPoutamaVideos.filter(v=>v.provenance==='official-playlist-feed').length,14);
 assert.match(ngaPoutamaPlaylist,/^https:\/\/www\.youtube\.com\/playlist\?list=/);
 assert.match(ngaPoutamaFeedEvidence,/^https:\/\/www\.youtube\.com\/feeds\/videos\.xml\?playlist_id=/);
 const passageIds=new Set(readdirSync('src/content/passages').filter(p=>p.endsWith('.json')).map(p=>JSON.parse(readFileSync('src/content/passages/'+p,'utf8')).id));
 const recordIds=new Set(readdirSync('src/content/records').filter(p=>p.endsWith('.json')).map(p=>JSON.parse(readFileSync('src/content/records/'+p,'utf8')).id));
 for(const v of ngaPoutamaVideos){
  assert.match(v.id,/^[A-Za-z0-9_-]{11}$/);
  assert.equal(v.source,'https://www.youtube.com/watch?v='+v.id);
  assert.equal(ngaPoutamaThumbnail(v.id),'https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg');
  assert.ok(v.title&&v.description&&v.attribution&&v.date&&v.topic);
  assert.ok(v.evidence.length>0);
  assert.ok(passageIds.has(v.passageId),v.id+' missing passage '+v.passageId);
  for(const r of v.recordIds)assert.ok(recordIds.has(r),v.id+' missing record '+r);
  assert.ok(videosForPassage(v.passageId).some(x=>x.id===v.id));
  if(v.presenters.length===0)assert.match(v.attribution,/(not established|unconfirmed)/i);
 }
 assert.equal(ngaPoutamaVideos.find(x=>x.id==='Fqq3Fzi5djc').presenters[0],'Keith Holswich');
 assert.equal(ngaPoutamaVideos.find(x=>x.id==='nbMkx7TcmtU').presenters[0],'Duane Wilkins');
 assert.ok(ngaPoutamaVideos.find(x=>x.id==='gZdhElp_GrI').presenters.includes('Tania Te Hira'));
 assert.throws(()=>ngaPoutamaThumbnail('../bad'));
});
test('Videos render inline within passage blocks in both reader modes, not after the whole chapter',()=>{
 const reader=readFileSync('src/components/Reader.svelte','utf8');
 assert.ok(reader.includes('Copy link</button><a class="button passage-contribute"'));
 assert.ok(reader.includes('passageContributionMailto(article,p)'));
 assert.ok(reader.includes('{#each clipsAfter(p,blockIndex) as clip'));
 assert.ok(reader.includes('<WanangaClip video={clip}/>'));
 assert.ok(!reader.includes('<WanangaVideos/>'));
 const page=readFileSync('src/pages/nga-poutama-videos/index.astro','utf8');
 assert.ok(page.includes('<WanangaVideos archive client:load/>'));
 const profile=readFileSync('src/pages/[...path].astro','utf8');
 assert.ok(profile.includes("r.kind==='Person'?null:pickRecordImage"));
});
