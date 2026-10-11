import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {homeHighlightSlugs} from '../src/lib/home-highlights.mjs';
import {siteContributionMailtoUrl,passageContributionMailtoUrl,passageContributionPageUrl,contributionRecipient,contributionDraft,contributionMailtoUrl,contributionContextFromSearch} from '../src/lib/passage-contributions.mjs';

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

test('navigation opens an email draft with the chosen registered mail handler',()=>{
 const url=new URL(siteContributionMailtoUrl());
 assert.equal(url.protocol,'mailto:');
 assert.equal(decodeURIComponent(url.pathname),contributionRecipient);
 assert.equal(url.searchParams.get('subject'),'NZ GIS History Contributions and Corrections');
 assert.ok(url.searchParams.get('body').includes('attach any photos'));
 assert.ok(layout.includes('const contributionHref=siteContributionMailtoUrl()'));
 assert.ok(about.includes('const contributionHref=siteContributionMailtoUrl()'));
 assert.equal((layout.match(/href=\{contributionHref\}/g)||[]).length,2);
 assert.ok(!layout.includes('mail.google.com'));
});

test('obsolete book labels are removed from reading navigation',()=>{
 for(const content of [home,layout,reader,about]){
  assert.doesNotMatch(content,/Begin the book|Book contents|The book/);
 }
});

test('passage-specific email drafts include the link and the alternative page has no form',()=>{
 const passage={title:'From register to transaction system',slug:'from-register-to-transaction-system-60c6ff7b97'};
 const mail=new URL(passageContributionMailtoUrl({title:'Landonline',url:'/stories/landonline/'},passage));
 assert.equal(mail.protocol,'mailto:');
 assert.equal(decodeURIComponent(mail.pathname),'pm4gis@gmail.com');
 assert.ok(mail.searchParams.get('body').includes('https://history.pm4gis.nz/stories/landonline/#'+passage.slug));
 assert.ok(mail.searchParams.get('subject').includes(passage.title));
 const url=new URL(passageContributionPageUrl({title:'Landonline',url:'/stories/landonline/'},passage),'https://history.pm4gis.nz');
 assert.equal(url.pathname,'/contribute/');
 const historic=contributionContextFromSearch(url.search);
 assert.ok(contributionDraft(historic).body.includes(passage.slug));
 assert.equal(contributionContextFromSearch('?ref=https://evil.example/').reference,'');
 const fallback=readFileSync('src/pages/contribute/index.astro','utf8');
 assert.match(fallback,/Gmail in browser/);
 assert.match(fallback,/Outlook in browser/);
 assert.match(fallback,/Copy prepared email/);
 assert.doesNotMatch(fallback,/<form\b|<input\b|<textarea\b|window\.location\.replace/);
 for(const text of [fallback,about,readFileSync('src/lib/passage-contributions.mjs','utf8')])assert.doesNotMatch(text,/Do not send restricted iwi|Please avoid sending restricted iwi/);
});
