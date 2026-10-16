/**
 * Direct, provider-neutral email drafts. A mailto: link opens the visitor's
 * registered email handler. Attachments are added in their email application.
 */
export const contributionRecipient='pm4gis@gmail.com';
export const productionOrigin='https://history.pm4gis.nz';
export const contributionPagePath='/contribute/';

export function passagePermanentUrl(article,passage){
 const path=String(article?.url||'');
 const slug=String(passage?.slug||'');
 if(!/^\/stories\/[a-z0-9-]+\/$/.test(path)|| !/^[a-z0-9-]+$/.test(slug)){
  throw new Error('A published chapter path and passage slug are required');
 }
 return productionOrigin+path+'#'+slug;
}

export function contributionDraft({
 pageTitle='',pageUrl='',chapter='',passage='',reference='',contribution='',whoWhen='',sources='',imageRights='',credit=''
}={}){
 const contextTitle=String(passage||pageTitle||'').trim();
 const subject='NZ GIS History Contributions and Corrections'+(contextTitle?' — '+contextTitle:'');
 const answer=(question,value)=>question+'\n'+String(value||'').trim();
 const body=[
  'Kia ora,',
  '',
  ...(pageTitle&&pageTitle!==chapter?['Page: '+String(pageTitle).trim()]:[]),
  ...(pageUrl&&pageUrl!==reference?['Link to page: '+String(pageUrl).trim()]:[]),
  ...(chapter?['Chapter: '+chapter]:[]),
  ...(passage?['Passage: '+passage]:[]),
  ...(reference?['Link to passage: '+reference]:[]),
  '',
  answer('What would you like to correct, add or clarify?',contribution),
  '',
  answer('Who or what is involved, and when did it happen?',whoWhen),
  '',
  answer('What sources, photographs, links or documents can you share?',sources),
  '',
  answer('For any image or document, who created it and what are the reuse rights or licence?',imageRights),
  '',
  answer('How would you like to be credited?',credit),
  '',
  'Please attach any photos, maps, screenshots or documents to this email before sending.',
  '',
  'Ngā mihi'
 ].join('\n');
 return {subject,body};
}

/** Mailto works with the visitor's chosen email application, not one provider. */
export function contributionMailtoUrl(subject,body){
 return 'mailto:'+contributionRecipient+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
}

export function contributionText({subject,body}){
 return 'To: '+contributionRecipient+'\nSubject: '+subject+'\n\n'+body;
}

export function siteContributionMailtoUrl(){
 const {subject,body}=contributionDraft();
 return contributionMailtoUrl(subject,body);
}

export function passageContributionMailtoUrl(article,passage){
 const {subject,body}=contributionDraft({
  chapter:String(article?.title||''),
  passage:String(passage?.title||''),
  reference:passagePermanentUrl(article,passage)
 });
 return contributionMailtoUrl(subject,body);
}

export function siteContributionPageUrl(pageTitle='',pageUrl=''){
 const params=new URLSearchParams();
 if(pageTitle)params.set('page',String(pageTitle).slice(0,180));
 if(pageUrl)params.set('pageUrl',String(pageUrl));
 const search=params.toString();
 return contributionPagePath+(search?'?'+search:'');
}

export function passageContributionPageUrl(article,passage){
 const reference=passagePermanentUrl(article,passage);
 const params=new URLSearchParams({
  page:String(article?.title||''),
  pageUrl:reference,
  chapter:String(article?.title||''),
  passage:String(passage?.title||''),
  ref:reference
 });
 return contributionPagePath+'?'+params.toString();
}

/** Retains deep links already issued to the /contribute/ route. */
export function contributionContextFromSearch(search){
 const params=new URLSearchParams(search);
 const pageTitle=String(params.get('page')||params.get('chapter')||'').slice(0,180);
 const rawPageUrl=params.get('pageUrl')||'';
 let pageUrl='';
 try{
  const link=new URL(rawPageUrl);
  if(link.origin===productionOrigin&&link.pathname.startsWith('/')&&!link.pathname.startsWith('//')&&!link.pathname.startsWith('/contribute/'))pageUrl=link.href;
 }catch{}
 const chapter=String(params.get('chapter')||'').slice(0,180);
 const passage=String(params.get('passage')||'').slice(0,180);
 const raw=params.get('ref')||'';
 let reference='';
 try{
  const link=new URL(raw);
  if(link.origin===productionOrigin&&/^\/stories\/[a-z0-9-]+\/$/.test(link.pathname)&&/^#[a-z0-9-]+$/.test(link.hash))reference=link.href;
 }catch{}
 return {pageTitle,pageUrl,chapter,passage,reference};
}
