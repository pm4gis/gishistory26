/**
 * Mailto contribution hand-off. This opens the reader's own email client; it
 * never sends, submits or stores correspondence through NZ GIS History.
 *
 * Recipient: NZ GIS History contributions address specified by the project owner.
 * Keep the clicked passage's permanent production URL in the email body.
 */
export const contributionRecipient='pm4gis@gmail.com';
export const productionOrigin='https://history.pm4gis.nz';

export function passagePermanentUrl(article,passage,origin=productionOrigin){
  const path=String(article?.url||'');
  const slug=String(passage?.slug||'');
  if(!path.startsWith('/stories/')||path.startsWith('//')||!slug||/[?#]/.test(slug)){
    throw new Error('Passage contribution requires a known story path and stable passage slug');
  }
  return new URL(path+'#'+encodeURIComponent(slug),origin).href;
}

export function passageContributionMailto(article,passage){
  const url=passagePermanentUrl(article,passage);
  const title=String(passage.title||'Untitled passage').trim();
  const chapter=String(article.title||'NZ GIS History').trim();
  const subject='NZ GIS History Contributions and Corrections — '+title;
  const body=[
    'Kia ora,',
    '',
    'I would like to contribute to A History of GIS in New Zealand.',
    '',
    'Chapter: '+chapter,
    'Passage: '+title,
    'Link to passage: '+url,
    '',
    'What would you like to correct, add or clarify?',
    '',
    '',
    'What is your connection to the events, organisation, project or people described?',
    '',
    '',
    'What dates, sources, links or documents support this contribution?',
    '',
    '',
    'Can we credit your name, or would you prefer not to be named?',
    '',
    '',
    'Do you have permission to share any attached photographs, maps or other material? ',
    '',
    '',
    'Ngā mihi,',
  ].join('\n');
  return 'mailto:'+contributionRecipient+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
}


export function siteContributionMailto(){
  const subject='NZ GIS History Contributions and Corrections';
  const body=[
    'Kia ora,',
    '',
    'I would like to contribute to A History of GIS in New Zealand.',
    '',
    'Which chapter, story, person, organisation or event does this concern? Please include a link where possible.',
    '',
    '',
    'What would you like to correct, add or clarify?',
    '',
    '',
    'What is your connection to the events, project, organisation or people described?',
    '',
    '',
    'What dates, sources, links or documents support this contribution?',
    '',
    '',
    'Can we credit your name, or would you prefer not to be named?',
    '',
    '',
    'Do you have permission to share any attached photographs, maps or other material? Please avoid sending restricted iwi, hapū or personal information.',
    '',
    '',
    'Ngā mihi,'
  ].join('\n');
  return 'mailto:'+contributionRecipient+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
}


/** Opens the accessible browser contribution page with an exact link to the passage. */
export function passageContributionPageUrl(article,passage){
  const params=new URLSearchParams({
    chapter:String(article.title||'NZ GIS History'),
    passage:String(passage.title||'Untitled passage'),
    ref:passagePermanentUrl(article,passage)
  });
  return '/contribute/?'+params.toString();
}

/** Preserves passage links and the agreed editorial questions in the draft. */
export function contributionDraft({chapter='',passage='',reference=''}={}){
  const subject='NZ GIS History Contributions and Corrections'+(passage?' — '+passage:'');
  const body=[
    'Kia ora,',
    '',
    'I would like to contribute to A History of GIS in New Zealand.',
    ...(chapter?['','Chapter: '+chapter]:[]),
    ...(passage?['Passage: '+passage]:[]),
    ...(reference?['Link to passage: '+reference]:[]),
    '',
    'What would you like to correct, add or clarify?',
    '',
    '',
    'What is your connection to the events, organisation, project or people described?',
    '',
    '',
    'What dates, sources, links or documents support this contribution?',
    '',
    '',
    'Can we credit your name, or would you prefer not to be named?',
    '',
    '',
    'Who created any photographs, maps or other material you want to share, and how should they be credited?',
    '',
    '',
    'Ngā mihi,'
  ].join('\n');
  return {subject,body};
}

/** Gmail's website handles the compose screen without relying on Windows mailto settings. */
export function contributionGmailUrl(subject,body){
  const params=new URLSearchParams({view:'cm',fs:'1',to:contributionRecipient,su:String(subject||''),body:String(body||'')});
  return 'https://mail.google.com/mail/?'+params.toString();
}

/** Only allow known history site story references, not arbitrary external URLs. */
export function contributionContextFromSearch(search){
  const params=new URLSearchParams(search);
  const chapter=String(params.get('chapter')||'').slice(0,180);
  const passage=String(params.get('passage')||'').slice(0,180);
  const raw=params.get('ref')||'';
  let reference='';
  if(raw){
    try{
      const link=new URL(raw);
      if(link.origin===productionOrigin && /^\/stories\/[a-z0-9-]+\/$/.test(link.pathname) && /^#[a-z0-9-]+$/.test(link.hash)){
        reference=link.href;
      }
    }catch{}
  }
  return {chapter,passage,reference};
}
