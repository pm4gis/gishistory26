/**
 * Direct Gmail compose links. No forms, local storage or mail-client setup.
 * Opening a draft never sends an email.
 */
export const contributionRecipient='pm4gis@gmail.com';
export const productionOrigin='https://history.pm4gis.nz';

export function passagePermanentUrl(article,passage){
 const path=String(article?.url||'');
 const slug=String(passage?.slug||'');
 if(!/^\/stories\/[a-z0-9-]+\/$/.test(path)||! /^[a-z0-9-]+$/.test(slug)){
  throw new Error('A published chapter path and passage slug are required');
 }
 return productionOrigin+path+'#'+slug;
}

export function contributionDraft({chapter='',passage='',reference=''}={}){
 const subject='NZ GIS History Contributions and Corrections'+(passage?' — '+passage:'');
 const body=[
  'Kia ora,',
  '',
  ...(chapter?['Chapter: '+chapter]:[]),
  ...(passage?['Passage: '+passage]:[]),
  ...(reference?['Link to passage: '+reference]:[]),
  '',
  'What would you like to correct, add or clarify?',
  '',
  'Who or what is involved, and when did it happen?',
  '',
  'What sources, photographs, links or documents can you share?',
  '',
  'How would you like to be credited?',
  '',
  'Ngā mihi'
 ].join('\n');
 return {subject,body};
}

export function contributionGmailUrl(subject,body){
 const params=new URLSearchParams({
  view:'cm',fs:'1',to:contributionRecipient,su:subject,body
 });
 return 'https://mail.google.com/mail/?'+params.toString();
}

export function siteContributionGmailUrl(){
 const draft=contributionDraft();
 return contributionGmailUrl(draft.subject,draft.body);
}

export function passageContributionGmailUrl(article,passage){
 const draft=contributionDraft({
  chapter:String(article?.title||''),
  passage:String(passage?.title||''),
  reference:passagePermanentUrl(article,passage)
 });
 return contributionGmailUrl(draft.subject,draft.body);
}

/** Retains deep links already issued to the old /contribute/ route. */
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
