/**
 * Provider-neutral contribution drafts and links. The site never sends email,
 * assumes a Gmail account, or requires a configured desktop mail application.
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
 chapter='',passage='',reference='',contribution='',whoWhen='',sources='',credit=''
}={}){
 const subject='NZ GIS History Contributions and Corrections'+(passage?' — '+passage:'');
 const answer=(question,value)=>question+'\n'+String(value||'').trim();
 const body=[
  'Kia ora,',
  '',
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
  answer('How would you like to be credited?',credit),
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

export function siteContributionPageUrl(){
 return contributionPagePath;
}

export function passageContributionPageUrl(article,passage){
 const params=new URLSearchParams({
  chapter:String(article?.title||''),
  passage:String(passage?.title||''),
  ref:passagePermanentUrl(article,passage)
 });
 return contributionPagePath+'?'+params.toString();
}

/** Retains deep links already issued to the /contribute/ route. */
export function contributionContextFromSearch(search){
 const params=new URLSearchParams(search);
 const chapter=String(params.get('chapter')||'').slice(0,180);
 const passage=String(params.get('passage')||'').slice(0,180);
 const raw=params.get('ref')||'';
 let reference='';
 try{
  const link=new URL(raw);
  if(link.origin===productionOrigin&&/^\/stories\/[a-z0-9-]+\/$/.test(link.pathname)&&/^#[a-z0-9-]+$/.test(link.hash))reference=link.href;
 }catch{}
 return {chapter,passage,reference};
}
