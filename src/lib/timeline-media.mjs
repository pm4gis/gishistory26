/**
 * Explicitly curated documentary illustrations for timeline events.
 * A related image must never be presented as a photograph or scan of the
 * event itself unless the association really is that direct.
 * Image credits and licences live on the existing /images/<slug>/ pages.
 */
export const timelineMedia = Object.freeze({
  '1909-wairarapa-baseline': {slug:'petone-lower-hutt-survey-1909',relation:'A contemporary 1909 survey map from the Hutt Valley. It illustrates New Zealand survey control but does not depict the Wairarapa baseline.'},
  '1926-waimakariri-air-survey': {slug:'wrights-hill-1945',relation:'A later aerial survey photograph from 1945, illustrating the photographic methods that developed after the Waimakariri survey.'},
  '1939-first-nzms1': {slug:'clutha-molyneux-nzms13-1955',relation:'Illustrative 1955 Lands and Survey sheet from NZMS 13, a different map series. This is not the original NZMS 1 N134 sheet.',sourceLink:'https://natlib.govt.nz/visiting/wellington/exhibitions/unfolding-the-map/topographical-mapping',sourceLabel:'See the original 1939 NZMS 1 N134 sheet at the National Library'},
  '1945-population-mesh-blocks': {slug:'nz-census-density-2023',relation:'Modern census geography from 2023. This illustrates later use of statistical geographic units, not a 1940s census map.'},
  '1949-nzgd49': {slug:'riverhead-geodetic-mark-2025',relation:'A geodetic survey mark photographed in 2025. Its relationship to NZGD49 has not been established.'},
  '1975-landsat': {slug:'landsat-christchurch-2001',relation:'Landsat 7 satellite imagery acquired in 2001, a later illustration of the earth-observation methods described.'},
  '1977-nzms260': {slug:'ongaonga-linz-topo50-2020',relation:'A 2020 Topo50 map, the modern successor to NZMS 260, provided for visual comparison.'},
  '1984-analytical-stereoplotter': {slug:'southland-aerial-verdon-1988',relation:'An aerial photograph captured in 1988, illustrating the input material used in photogrammetric mapping. It is not a photograph of a stereoplotter.'},
  '1989-wellington-lifelines-study': {slug:'masterton-earthquake-fault-map-1942',relation:'Historical hazard mapping from nearby Wairarapa, published in 1942. It does not depict the 1989 Wellington study.'},
  '1991-meshblock-digitised': {slug:'nz-census-density-2023',relation:'A later statistical-area map derived from the 2023 Census, illustrating what digital census geography now supports.'},
  '1993-council-gis-growth': {slug:'victoria-square-aerial-1955',relation:'1955 Christchurch aerial photography, later made accessible through council mapping services. This is not a 1993 GIS screen.'},
  '1996-wairarapa-lifelines-association': {slug:'masterton-earthquake-fault-map-1942',relation:'An earlier earthquake-fault map of the Wairarapa area, illustrating the hazard evidence that predates lifelines GIS.'},
  '1996-linz-terralink': {slug:'ongaonga-linz-topo50-2020',relation:'An example of later LINZ digital topographic cartography, produced in 2020 rather than in 1996.'},
  '1998-nzgd2000': {slug:'riverhead-geodetic-mark-2025',relation:'A physical survey mark photographed in 2025; the mark’s datum status has not been verified.'},
  '2000-gps-sa': {slug:'linz-positionz-2018',relation:'A later illustration of LINZ satellite positioning infrastructure from 2018, not a depiction of the 2000 selective availability decision.'},
  '2001-landonline': {slug:'linz-landonline-survey-work-2025',relation:'An authentic LINZ Landonline Web Search screenshot from 2025. The original 2001 interface is not depicted.'},
  '2001-nztm2000': {slug:'ongaonga-linz-topo50-2020',relation:'A 2020 map produced using the modern national topographic mapping framework, not an image from 2001.'},
  '2003-christchurch-lidar': {slug:'kapiti-island-lidar-2024',relation:'A 2024 LINZ LiDAR-derived shaded relief map of Kāpiti Island. It shows later LiDAR capabilities, not the 2003 Christchurch survey.'},
  '2004-03-04-south-island-orthophotos': {slug:'southland-aerial-verdon-1988',relation:'Earlier Southland aerial photography, illustrating an imagery source subsequently used by digital spatial services.'},
  '2009-topo50': {slug:'ongaonga-linz-topo50-2020',relation:'An actual Topo50 product dated 2020, illustrating the map series introduced in 2009.'},
  '2011-christchurch-earthquake': {slug:'christchurch-quake-shaking-2011',relation:'A documentary map of shaking associated with the 2011 Christchurch earthquake.'},
  '2011-linz-data-service': {slug:'linz-wmts-qgis-data-view',relation:'LINZ Data Service imagery accessed through QGIS WMTS in a later official guide. This is not the 2011 launch interface.'},
  '2014-quantum-map-qgis': {slug:'linz-wmts-qgis-connection',relation:'LINZ guidance illustrating a QGIS WMTS connection. The screenshot date is not established and it is not the original 2014 application.'},
  '2014-qmap-national-dataset': {slug:'qmap-christchurch-2008',relation:'A genuine GNS Science QMAP sheet of the Christchurch area from 2008, predating the consolidated national dataset.'},
  '2014-aerial-film-digitisation': {slug:'victoria-square-aerial-1955',relation:'1955 aerial imagery illustrating the historical material digitised for modern mapping portals.'},
  '2016-kaikoura-earthquake': {slug:'kaikoura-shakemap-2016',relation:'A map of the 2016 Kaikōura earthquake and its observed shaking, directly related to the event.'},
  '2018-linz-qgis-importer': {slug:'linz-wmts-qgis-connection',relation:'An actual LINZ QGIS network-service connection screen, illustrating related software integration. This is not the 2018 importer.'},
  '2024-future-topo-maps': {slug:'ongaonga-linz-topo50-2020',relation:'A 2020 Topo50 sheet illustrating the national cartographic products being renewed.'},
  '2025-giscience-historical-maps': {slug:'hector-geological-map-1884',relation:'An authentic nineteenth-century geological map, representing the historic documents studied with digital methods.'}
});

/** Enrich the presentation model without changing source event records or chronology. */
export function decorateTimelineEvents(events, passages, records, images) {
  const imageBySlug=new Map(images.map(image=>[image.slug,image]));
  const passageById=new Map(passages.map(p=>[p.id,p]));
  const recordById=new Map(records.map(r=>[r.id,r]));
  return events.map(event=>{
    const attachment=timelineMedia[event.id];
    const image=attachment&&imageBySlug.get(attachment.slug);
    const firstPassage=(event.passageIds||[]).map(id=>passageById.get(id)).find(Boolean);
    const textBlocks=firstPassage?.blocks?.length?firstPassage.blocks:firstPassage?.paragraphs||[];
    const details=textBlocks.filter(b=>b.type===undefined||b.type==='paragraph').map(b=>(b.text||'').trim()).filter(Boolean).slice(0,2);
    const related=(event.recordIds||[]).map(id=>recordById.get(id)).filter(r=>r&&r.url&&r.name&&r.kind!=='chapter').slice(0,7).map(r=>({name:r.name,url:r.url,kind:r.kind}));
    const sourceList=[...(event.sources||[]),...(firstPassage?.sources||[]),...textBlocks.flatMap(b=>b.sources||[])];
    const seen=new Set();
    const contextualSources=sourceList.filter(s=>{const key=s.url||s.label;if(!key||seen.has(key))return false;seen.add(key);return true}).slice(0,10);
    return {...event,
      featuredImage:image?{slug:image.slug,cardPath:image.thumbnailPath||image.assetPath,assetPath:image.assetPath,altText:image.altText,title:image.title,caption:image.caption||image.title,relation:attachment.relation,dateDisplay:image.dateDisplay||''}:null,
      imageSourceLink:attachment?.sourceLink||null,
      imageSourceLabel:attachment?.sourceLabel||null,
      contextTitle:firstPassage?.title||null,
      contextParagraphs:details,
      relatedRecords:related,
      contextualSources
    };
  });
}
