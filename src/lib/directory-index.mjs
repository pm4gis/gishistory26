import {isListedRecord} from './record-listing.mjs';
const collator=new Intl.Collator('en-NZ',{numeric:true,sensitivity:'base'});
export function directoryLetter(name) {
  const stripped=String(name||'').normalize('NFD').replace(/\p{M}/gu,'').trim();
  const first=stripped.match(/[a-z0-9]/i)?.[0]?.toUpperCase();
  return /^[0-9]$/.test(first||'')?'0-9':first||'#';
}
export function directoryGroups(records=[]) {
  const groups=new Map();
  for(const item of records.filter(isListedRecord)) {
    const letter=directoryLetter(item.name);
    if(!groups.has(letter))groups.set(letter,[]);
    groups.get(letter).push({name:item.name,kind:item.kind,url:item.url,id:item.id});
  }
  return [...groups].sort((a,b)=>collator.compare(a[0],b[0]))
    .map(([letter,entries])=>({letter,slug:letter==='#'?'other':letter.toLowerCase(),entries:entries.sort((a,b)=>collator.compare(a.name,b.name)||collator.compare(a.url,b.url))}));
}
