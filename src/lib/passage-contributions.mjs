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
    'Do you have permission to share any attached photographs, maps or other material? Please avoid sending restricted iwi, hapū or personal information.',
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
