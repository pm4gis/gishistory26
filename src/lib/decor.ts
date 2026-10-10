// Decorative aerial photography only. These images illustrate geographic patterns and do not depict specific historical events.
export const decorIds = [
  'north2024-raglan1',
  'north2024-atene1',
  'north2024-karikari2',
  'north2024-taranaki1',
  'north2024-moturoais1',
  'north2024-tekaha1',
  'north2024-tararua1',
  'tasman-5',
  'otago-8',
  'otago-1',
  'porirua-teawarua-o-porirua',
  'porirua-whitirea',
  'north2024-hawkes-bay-1',
  'north2024-rangitoto1'
] as const;
export type DecorId = typeof decorIds[number];
export function decorFor(index:number):DecorId {
  return decorIds[((index % decorIds.length) + decorIds.length) % decorIds.length];
}
export const decorUrl = (id: DecorId, role:'card'|'background'='background') => '/decor/'+id+'-'+role+'.webp';
