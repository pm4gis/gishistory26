import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {passageContributionMailto,passagePermanentUrl,contributionRecipient} from '../src/lib/passage-contributions.mjs';
import {ngaPoutamaVideos,ngaPoutamaPlaylist,ngaPoutamaThumbnail} from '../src/lib/nga-poutama-videos.mjs';

const article={title:'Coordinates enter the computer',url:'/stories/coordinates-enter-the-computer/'};
const passage={title:'Transforming one coordinate world into another',slug:'transforming-one-coordinate-world-into-another-2ab91fbc4f'};

test('passage contribution opens user email client with exact canonical deep link, questions, and source request',()=>{
 const url=passagePermanentUrl(article,passage);
 assert.equal(url,'https://history.pm4gis.nz/stories/coordinates-enter-the-computer/#transforming-one-coordinate-world-into-another-2ab91fbc4f');
 const mailto=passageContributionMailto(article,passage);
 const parsed=new URL(mailto);
 assert.equal(parsed.protocol,'mailto:');
 assert.equal(parsed.pathname,contributionRecipient);
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
 assert.equal(ngaPoutamaVideos.length,4);
 assert.equal(new Set(ngaPoutamaVideos.map(v=>v.id)).size,4);
 assert.match(ngaPoutamaPlaylist,/^https:\/\/www\.youtube\.com\/playlist\?list=/);
 for(const video of ngaPoutamaVideos){
  assert.match(video.id,/^[\w-]{11}$/);
  assert.equal(video.source,'https://www.youtube.com/watch?v='+video.id);
  assert.equal(ngaPoutamaThumbnail(video.id),'https://i.ytimg.com/vi/'+video.id+'/hqdefault.jpg');
  for(const f of ['title','description','date','attribution'])assert.ok(video[f].length>8);
 }
 assert.ok(ngaPoutamaVideos.some(v=>v.description.includes('Duane Wilkins')));
 assert.ok(ngaPoutamaVideos.some(v=>v.description.includes('Keith Holswich')));
 assert.throws(()=>ngaPoutamaThumbnail('../bad'));
});

test('new reader contribution is beside Copy link and person profiles stay image-free',()=>{
 const reader=readFileSync('src/components/Reader.svelte','utf8');
 assert.ok(reader.includes('Copy link</button><a class="button passage-contribute"'));
 assert.ok(reader.includes('passageContributionMailto(article,p)'));
 const profile=readFileSync('src/pages/[...path].astro','utf8');
 assert.ok(profile.includes("r.kind==='Person'?null:pickRecordImage"));
 assert.ok(profile.includes("r.slug==='nga-poutama-matawhenua'"));
});
