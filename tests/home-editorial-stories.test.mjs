import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {homeStories} from '../src/lib/home-stories.mjs';
const collection=name=>readdirSync('src/content/'+name).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(readFileSync('src/content/'+name+'/'+f)));
const articles=collection('articles'),passages=collection('passages');
test('all five homepage features resolve to accepted historical passages',()=>{
 assert.equal(homeStories.length,5);
 assert.equal(new Set(homeStories.map(s=>s.slug)).size,5);
 for(const story of homeStories){
  const article=articles.find(a=>a.slug===story.slug);assert.equal(article?.status,'published');
  const passage=passages.find(p=>p.articleId===article.id&&p.slug===story.passageSlug);assert.ok(passage,story.slug);
  assert.notEqual(story.title,passage.title,'homepage needs a standalone headline');
  assert.ok(story.title.length<75&&story.summary.length<250);
  assert.ok(story.dateDisplay&&!/2026/.test(story.dateDisplay));
 }
});
test('dated feature claims are supported by their existing linked passage',()=>{
 const prose=slug=>{const s=homeStories.find(s=>s.slug===slug),a=articles.find(a=>a.slug===slug),p=passages.find(p=>p.articleId===a.id&&p.slug===s.passageSlug);return JSON.stringify(p.blocks||p.paragraphs);};
 assert.match(prose('when-gis-became-gis'),/26 June 1989/);assert.match(prose('when-gis-became-gis'),/116 pages/);
 assert.match(prose('landonline'),/November 1997/);
 assert.match(prose('open-data-changes-access'),/March 2002/);assert.match(prose('open-data-changes-access'),/1,200 plus GST/);
});
