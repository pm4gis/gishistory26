import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {homeHighlightSlugs} from '../src/lib/home-highlights.mjs';
import {siteContributionMailto,contributionRecipient,contributionDraft,contributionGmailUrl,contributionContextFromSearch,passageContributionPageUrl} from '../src/lib/passage-contributions.mjs';

const home=readFileSync('src/pages/index.astro','utf8');
const layout=readFileSync('src/layouts/Layout.astro','utf8');
const reader=readFileSync('src/pages/read/index.astro','utf8');
const about=readFileSync('src/pages/about/index.astro','utf8');
const css=readFileSync('src/styles/site.css','utf8');

test('every published chapter remains eligible for both the homepage and chapter catalogue',()=>{
 const articles=readdirSync('src/content/articles').filter(n=>n.endsWith('.json')).map(n=>JSON.parse(readFileSync('src/content/articles/'+n,'utf8')));
 const chapters=articles.filter(a=>a.status==='published'&&a.slug!=='preface');
 assert.equal(chapters.length,44);
 assert.match(home,/chapters\.map\(/);
 assert.doesNotMatch(home,/chapters\.slice\(/);
 assert.match(home,/id=\{'chapter-'\+a\.readingOrder\}/);
 assert.match(reader,/chapters\.map\(/);
 assert.ok(home.indexOf('id="highlighted-stories"')<home.indexOf('id="chapters"'));
 assert.ok(home.indexOf('id="chapters"')<home.indexOf('id="themes"'));
});

test('highlight pool contains unique, published stories with real passages',()=>{
 const articles=readdirSync('src/content/articles').filter(n=>n.endsWith('.json')).map(n=>JSON.parse(readFileSync('src/content/articles/'+n,'utf8')));
 const passages=new Set(readdirSync('src/content/passages').filter(n=>n.endsWith('.json')).map(n=>JSON.parse(readFileSync('src/content/passages/'+n,'utf8')).articleId));
 assert.ok(homeHighlightSlugs.length>=20);
 assert.equal(new Set(homeHighlightSlugs).size,homeHighlightSlugs.length);
 for(const slug of homeHighlightSlugs){
  const a=articles.find(a=>a.slug===slug);
  assert.ok(a,slug+' missing');
  assert.equal(a.status,'published');
  assert.ok(passages.has(a.id),slug+' has no passage');
 }
 assert.match(home,/passage\.slug/);
 assert.match(home,/sessionStorage\.setItem\('nzgis-last-highlights'/);
 assert.match(home,/choices\.slice\(0,5\)/);
 assert.match(home,/hidden=\{i>=5\}/);
 assert.match(home,/img\.articleSlug===a\.slug/);
});

test('desktop and mobile menus provide About and Contribute, with accessible native disclosure',()=>{
 assert.match(layout,/<details class="mobile-menu">/);
 assert.ok(layout.includes('<summary aria-label="Open navigation menu"'));
 assert.match(layout,/aria-label="Mobile navigation"/);
 assert.match(layout,/aria-label="Main navigation"/);
 assert.equal((layout.match(/href="\/about\/"/g)||[]).length,3);
 assert.equal((layout.match(/href=\{contributionHref\}/g)||[]).length,2);
 assert.match(css,/@media\(max-width:1180px\)/);
 assert.match(css,/\.nav--desktop\{display:none\}/);
 assert.match(css,/\.mobile-menu\{display:block\}/);
 assert.match(layout,/id="palette"/);
});

test('contribution action opens email client with questions and no automatic sending',()=>{
 const mailto=siteContributionMailto();
 const url=new URL(mailto);
 assert.equal(url.protocol,'mailto:');
 assert.equal(url.pathname,contributionRecipient);
 assert.equal(url.searchParams.get('subject'),'NZ GIS History Contributions and Corrections');
 const body=url.searchParams.get('body')||'';
 for(const part of ['chapter, story','correct, add or clarify','dates, sources, links or documents','credit your name','permission to share'])assert.ok(body.includes(part));
 assert.ok(about.includes("const contributionHref='/contribute/'"));
 assert.ok(layout.includes("const contributionHref='/contribute/'"));
});

test('obsolete book labels are removed from reading navigation',()=>{
 for(const content of [home,layout,reader,about]){
  assert.doesNotMatch(content,/Begin the book|Book contents|The book/);
 }
});

test('browser contribution page and Gmail drafting work without Windows mailto',()=>{
 const page=readFileSync('src/pages/contribute/index.astro','utf8');
 const form=readFileSync('src/components/ContributeForm.svelte','utf8');
 assert.match(page,/ContributeForm client:load/);
 assert.match(form,/navigator.clipboard.writeText/);
 assert.match(form,/Open draft in Gmail/);
 assert.match(form,/id="contribution-subject"/);
 assert.match(form,/id="contribution-message"/);
 const article={title:'Landonline',url:'/stories/landonline/'};
 const passage={title:'From register to transaction system',slug:'from-register-to-transaction-system-60c6ff7b97'};
 const contributionUrl=passageContributionPageUrl(article,passage);
 const context=contributionContextFromSearch(new URL(contributionUrl,'https://history.pm4gis.nz').search);
 const draft=contributionDraft(context);
 assert.ok(draft.body.includes('Link to passage: https://history.pm4gis.nz/stories/landonline/#'+passage.slug));
 const gmail=new URL(contributionGmailUrl(draft.subject,draft.body));
 assert.equal(gmail.origin,'https://mail.google.com');
 assert.equal(gmail.searchParams.get('to'),'pm4gis@gmail.com');
 assert.equal(gmail.searchParams.get('su'),draft.subject);
 assert.ok(gmail.searchParams.get('body').includes(passage.slug));
 assert.equal(contributionContextFromSearch('?ref=https://evil.example/').reference,'');
 for(const text of [page,form,readFileSync('src/pages/about/index.astro','utf8'),readFileSync('src/lib/passage-contributions.mjs','utf8')]){
  assert.doesNotMatch(text,/Do not send restricted iwi or hapū information/);
  assert.doesNotMatch(text,/Please avoid sending restricted iwi/);
 }
});
