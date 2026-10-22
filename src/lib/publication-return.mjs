/** Only the local publication catalogue can be a reader's return destination. */
export function publicationReturnPath(value){
 if(typeof value!=='string'||value.length>3000||!value.startsWith('/publications/'))return null;
 const url=new URL(value,'https://library.invalid');
 if(url.origin!=='https://library.invalid'||url.pathname!=='/publications/')return null;
 if(url.hash&&!/^#publication-(archive|research)-[a-z0-9-]+$/.test(url.hash))return null;
 const params=new URLSearchParams();
 const kind=url.searchParams.get('filter'),filterValue=url.searchParams.get('value');
 if(kind&&['decade','theme','creator'].includes(kind)&&filterValue){params.set('filter',kind);params.set('value',filterValue);}
 if(url.searchParams.get('view')==='list')params.set('view','list');
 return '/publications/'+(params.size?'?'+params.toString():'')+url.hash;
}
const storagePrefix='nzgis-publication-return-v1:';

/** Prepare links before interaction so keyboard, touch and new tabs all work. */
export function initPublicationLibraryReturn(){
 const cards=[...document.querySelectorAll('[data-publication]')];
 function returnPath(card){return publicationReturnPath(location.pathname+location.search+'#'+card.id);}
 function remember(card){
  const href=returnPath(card);
  const snapshot={href,scrollY:window.scrollY,anchor:card.id};
  try{history.replaceState({...history.state,publicationReturn:snapshot},'');}catch{}
  try{sessionStorage.setItem(storagePrefix+href,JSON.stringify(snapshot));}catch{}
 }
 for(const card of cards){
  for(const link of card.querySelectorAll('a[href]')){
   link.dataset.publicationUrl=link.getAttribute('href');
   link.addEventListener('click',()=>remember(card));
   link.addEventListener('auxclick',()=>remember(card));
  }
 }
 function refresh(){
  for(const card of cards){
   for(const link of card.querySelectorAll('a[data-publication-url]')){
    const url=new URL(link.dataset.publicationUrl,location.origin);
    url.searchParams.set('library',returnPath(card));
    link.href=url.pathname+url.search+url.hash;
   }
  }
 }
 function restore(){
  let snapshot=history.state?.publicationReturn;
  const current=publicationReturnPath(location.pathname+location.search+location.hash);
  if(!snapshot&&location.hash){try{snapshot=JSON.parse(sessionStorage.getItem(storagePrefix+current)||'null');}catch{}}
  if(!snapshot||!publicationReturnPath(snapshot.href)||!Number.isFinite(snapshot.scrollY)||snapshot.scrollY<0)return;
  const saved=new URL(snapshot.href,location.origin),now=new URL(current||'/publications/',location.origin);
  if(saved.pathname!==now.pathname||saved.search!==now.search||snapshot.anchor!==saved.hash.slice(1))return;
  const card=document.getElementById(snapshot.anchor);
  if(!card||card.hidden)return;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   card.querySelector('h3 a')?.focus({preventScroll:true});
   window.scrollTo({top:snapshot.scrollY,behavior:'instant'});
  }));
 }
 refresh();restore();
 window.addEventListener('pageshow',restore);
 return refresh;
}

/** Keep the same library context while reading adjacent publications. */
export function initPublicationReaderReturn(){
 const path=publicationReturnPath(new URLSearchParams(location.search).get('library'));
 if(!path)return;
 document.querySelectorAll('a[href="/publications/"]').forEach(link=>{link.href=path;});
 document.querySelectorAll('[data-publication-library-return]').forEach(link=>{link.textContent='Back to publications';});
 document.querySelectorAll('.publication-reader a[rel="prev"],.publication-reader a[rel="next"]').forEach(link=>{
  const url=new URL(link.href,location.origin);url.searchParams.set('library',path);link.href=url.pathname+url.search+url.hash;
 });
}
