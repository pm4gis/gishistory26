# People biographies and relationships, 15 October 2026

Base commit: `5965be899ea74fad5df49735158135ed11007ea2`. Editorial focus: better source-backed person biographies and more specific connections, following the 13 October 2026 review. Existing IDs, aliases, routes, unrelated source links and event dates are retained.

## Biographies

Nine existing profiles were revised: Mairéad de Róiste, Linda Lilburne, Mary de Winton, Don Robertson, Mary Sutherland, Beryl Pimblott, Munir Morad, Malindi Reihana-Ruka and Maureen Coomer. Mairéad de Róiste's duplicate 2014-study account and 2026-status paragraph were replaced by two concise paragraphs, grounded in the published 2014 study. Linda Lilburne’s early Internet anecdote remains, followed by documented S-map research and Landcare Research work. The NIWA co-authors now have complementary profiles distinguishing FBIS (operational in 2004) from FINZ (then in development).

Sutherland’s biography identifies the professional forestry and land-record work that preceded GIS, without attributing computerised GIS work to her. Beryl Pimblott’s profile now distinguishes documented co-founding from an undocumented individual technical portfolio. Morad’s alternate name and the 1997 Waikato teaching recollection are retained without conflating that source with the later London career interview. Reihana-Ruka’s profile no longer reproduces other committee members’ biographies, and it avoids a current employment claim based on an undated page. Coomer’s entry distinguishes the cited 1:1 million geology product from the earlier QMAP sheets.

Each paragraph has a matching `biographyParagraphSources` group. All inherited source citations remain available in `sources`.

## New substantive relationships

Nine explicit links replace the need to infer roles from simple co-mentions: Mary de Winton to NIWA; de Winton and Don Robertson separately to FBIS; a co-authorship link between the two; Linda Lilburne to S-map and Landcare Research; David and Beryl Pimblott as co-founders; Malindi Reihana-Ruka to Women in Spatial + Surveying; and Munir Morad to Duane Wilkins’s 1997 Waikato KeyCad recollection. Each new link has a source and a defined relationship type. The 2013/2026 prior content and the 31 December 2025 timeline cut-off remain unchanged.

## Sources checked

- Mairéad de Róiste, *New Zealand Geographer* 70(3), 2014: https://doi.org/10.1111/nzg.12054
- NIWA, Robertson and de Winton, September 2004: https://niwa.co.nz/water-atmosphere/vol12-no3-september-2004/fbis-new-freshwater-biodata-information-system
- Manaaki Whenua, citing S-map: https://smap.landcareresearch.co.nz/support/citing-s-map
- Manaaki Whenua, S-map team account: https://www.landcareresearch.co.nz/publications/soil-horizons/soil-horizons-articles/s-map-expands-further-and-reaches-11-million-hectares/
- Te Ara, Mary Sutherland: https://teara.govt.nz/en/biographies/4s58/sutherland-mary
- NorthSouth GIS, History: https://www.northsouthgis.com/about-nsg/history
- Professor Munir Morad, recorded career interview: https://icould.com/stories/professor-munir-morad/
- Women in Spatial + Surveying committee biography: https://womeninspatial.wordpress.com/the-committee/
- GNS geological-map service metadata: https://gis.gns.cri.nz/server/rest/services/Geological_Map_of_New_Zealand_1_Million/NZL_GNS_1M_geology_FeatureService/FeatureServer

## Verification

The candidate was checked for unique new IDs and file paths, JSON serialisability, source presence, valid known endpoint IDs and equal story/source-group counts. Run `npm ci`, `npm test`, `npm run build` and the preservation/link tests on the branch before merging. A draft GitHub commit or PR does not itself establish a successful deployment.
