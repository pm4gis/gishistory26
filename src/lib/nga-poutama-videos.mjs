/** Publicly identified recordings and LINZ programme playlist; linked, not copied. */
export const ngaPoutamaPlaylist='https://www.youtube.com/playlist?list=PLyE56PxGCqSXGUtFIvpNn0b_SauF4XfIk';
export const ngaPoutamaVideos=Object.freeze([
  {
    id:'yCBeRHA2Jnk',
    title:'Ngā Poutama Matawhenua: a conversation',
    date:'14 April 2021',
    description:'Duane Wilkins (Toitū Te Whenua LINZ), Roland Pomana (Journey GIS) and Matt Grose (Department of Conservation) discuss the development of the practical Māori GIS learning initiative.',
    attribution:'Published by Duane Wilkins; description identifies all three participants.',
    source:'https://www.youtube.com/watch?v=yCBeRHA2Jnk'
  },
  {
    id:'Fqq3Fzi5djc',
    title:'He Kete Mātauranga: Bringing Whenua Stories to Life',
    date:'2 July 2025; recorded 13 June 2025',
    description:'Keith Holswich (Ngāti Rāhiri) presents a hapū-built GIS drawing on historic aerials, Māori Land Court records and local whenua knowledge.',
    attribution:'Published by Toitū Te Whenua LINZ; Keith Holswich is the named presenter.',
    source:'https://www.youtube.com/watch?v=Fqq3Fzi5djc'
  },
  {
    id:'KYEVxcBEVQ8',
    title:'Mapping sites of significance to iwi and Māori using GIS mapping tools',
    date:'Publication date not independently confirmed',
    description:'Practical GIS tools, historical resources and information-management approaches for mapping sites of significance.',
    attribution:'Public Ngā Poutama resource index; individual presenter not independently established.',
    source:'https://www.youtube.com/watch?v=KYEVxcBEVQ8'
  },
  {
    id:'hCAVoBwRJwE',
    title:'Utilising key datasets for Māori climate resilience and whenua protection',
    date:'Publication date not independently confirmed',
    description:'Using geospatial datasets for hazard preparedness, emergency response, whenua protection and community planning.',
    attribution:'Ngā Poutama recording; individual presenter not independently established.',
    source:'https://www.youtube.com/watch?v=hCAVoBwRJwE'
  }
]);
export function ngaPoutamaThumbnail(id){
  if(!/^[\w-]{11}$/.test(id))throw new Error('Invalid YouTube video ID');
  return 'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg';
}
