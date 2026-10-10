import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {homeHighlightSlugs} from '../src/lib/home-highlights.mjs';
import {siteContributionPageUrl,passageContributionPageUrl,contributionRecipient,contributionDraft,contributionMailtoUrl,contributionContextFromSearch} from '../src/lib/passage-contributions.mjs';

const home=readFileSync('src/pages/index.astro','utf8');
const layout=readFileSync('src/layouts/Layout.astro','utf8');
const reader=readFileSync('src/pages/read/index.astro','utf8');
const about=readFileSync('src/pages/about/index.astro','utf8');
const css=readFileSync('src/styles/site.css','utf8');
const subjectImage=readFileSync('src/components/SubjectImage.astro','utf8');
const imageDetail=readFileSync('src/pages/images/[slug].astro','utf8');

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

test('homepage highlights use equal image frames and keep image credits on detail pages',()=>{
 assert.match(home,/variant="card" showCaption=\{false\}/);
 assert.match(subjectImage,/showCaption\?:boolean/);
 assert.match(subjectImage,/\{showCaption&&<figcaption>/);
 assert.match(css,/\.highlight-card > \.subject-media--card,[\s\S]*?aspect-ratio:16\/9/);
 assert.match(imageDetail,/Credit: \{image\.credit\}/);
 assert.match(imageDetail,/<dt>Licence<\/dt>/);
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

test('navigation buttons open the in-site contribution page for all email providers',()=>{
 assert.equal(siteContributionPageUrl(),'/contribute/');
 assert.ok(layout.includes('const contributionHref=siteContributionPageUrl()'));
 assert.ok(about.includes('const contributionHref=siteContributionPageUrl()'));
 assert.equal((layout.match(/href=\{contributionHref\}/g)||[]).length,2);
 assert.ok(!layout.includes('mail.google.com'));
 const draft=contributionDraft();
 const mail=contributionMailtoUrl(draft.subject,draft.body);
 assert.ok(mail.startsWith('mailto:'+contributionRecipient+'?'));
 for(const field of ['correct, add or clarify','Who or what is involved','sources, photographs','credited'])assert.ok(decodeURIComponent(mail).includes(field));
});

test('obsolete book labels are removed from reading navigation',()=>{
 for(const content of [home,layout,reader,about]){
  assert.doesNotMatch(content,/Begin the book|Book contents|The book/);
 }
});

test('passage context is retained with an email-app and copy alternative',()=>{
 const passage={title:'From register to transaction system',slug:'from-register-to-transaction-system-60c6ff7b97'};
 const url=new URL(passageContributionPageUrl({title:'Landonline',url:'/stories/landonline/'},passage),'https://history.pm4gis.nz');
 assert.equal(url.pathname,'/contribute/');
 assert.equal(url.searchParams.get('passage'),passage.title);
 assert.ok(url.searchParams.get('ref').includes('https://history.pm4gis.nz/stories/landonline/#'+passage.slug));
 const historic=contributionContextFromSearch(url.search);
 assert.ok(contributionDraft(historic).body.includes(passage.slug));
 assert.equal(contributionContextFromSearch('?ref=https://evil.example/').reference,'');
 const fallback=readFileSync('src/pages/contribute/index.astro','utf8');
 assert.doesNotMatch(fallback,/window.location.replace/);
 assert.match(fallback,/Copy complete message/);
 assert.match(fallback,/Copy email address/);
 assert.match(fallback,/contributionMailtoUrl/);
 for(const text of [fallback,about,readFileSync('src/lib/passage-contributions.mjs','utf8')])assert.doesNotMatch(text,/Do not send restricted iwi|Please avoid sending restricted iwi/);
});
