// Source discovery only. This does not publish image files or assert reuse rights.
import sharp from 'sharp';
import {createHash} from 'node:crypto';
const targets=[
 {id:'nzfs-kura-metadata',url:'https://kura.aucklandlibraries.govt.nz/digital/api/singleitem/collection/maps/id/10386',kind:'json'},
 {id:'nzfs-kura-iiif',url:'https://kura.aucklandlibraries.govt.nz/digital/iiif/maps/10386/full/1000,/0/default.jpg',kind:'image'},
 {id:'mpi-kauri-map',url:'https://www.kauriprotection.co.nz/assets/In-page-images/kauri-map_small__ScaleMaxWidthWzkyMF0.jpg',kind:'image'}
];
for(const item of targets){
 try{
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),18000);
  const response=await fetch(item.url,{signal:controller.signal,headers:{'User-Agent':'NZGISHistoryResearch/1.0 (pm4gis@gmail.com)'}});
  clearTimeout(timeout);
  const data=Buffer.from(await response.arrayBuffer());
  const basic={id:item.id,status:response.status,type:response.headers.get('content-type'),bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')};
  if(item.kind==='image'&&response.ok)basic.image=await sharp(data).metadata().then(x=>({width:x.width,height:x.height,format:x.format}));
  if(item.kind==='json'&&response.ok)basic.preview=data.toString('utf8').slice(0,1000);
  console.log(JSON.stringify(basic));
 }catch(error){console.log(JSON.stringify({id:item.id,error:String(error)}));}
}
