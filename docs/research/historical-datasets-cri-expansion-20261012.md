# Historical GIS dataset and CRI expansion, 12 October 2026

## Change scope
Additive research release following Git production commit `7ec3cfd63d1a39ad678419886c43e578a6533b64`. It extends early mapping lineage, 1990s Crown Research Institute work and 2000s GIS distribution and data management. New records use distinct dataset, system and organisation identifiers. Existing chapter paragraphs, accepted image files, names and routes are unchanged.

## Verified cases
- The 1999 ICC mapping paper documents the history of 1:250,000 and 1:50,000 vector topographic capture, the VISION and Laser-Scan software periods, and map-source limitations: https://icaci.org/files/documents/ICC_proceedings/ICC1999/sections/02.pdf
- The National Library documents ArcFlax Edition 2.0 Whanganui, 2006, publisher Crown Forestry Rental Trust, creator Duane Wilkins and ArcReader 9.1: https://natlib.govt.nz/records/30673810
- NIWA's September 2004 FBIS technical article documents live spatial queries and distinguishes the still-developing FINZ service: https://niwa.co.nz/water-atmosphere/vol12-no3-september-2004/fbis-new-freshwater-biodata-information-system
- NIWA's 1989 NRWQN start, 2001 GeoNet start, and GNS QMAP regional compilation are documented by the respective organisations. QMAP national seamless assembly took place later, in 2014.
- Manaaki Whenua's soil-survey history and an NVS development inventory distinguish the original observations, 1990s custody and database transition, and early-2000s services. The 2003 LENZ publication is corroborated by a dated ministerial announcement.
- The 1998 Forest Research spatial methods paper and 1999 journal study provide period evidence for plantation GIS and geostatistics.

## Media and passage decisions
The Clutha and South Molyneux 1955 NZMS13 image and Silverpeak 1956 cadastral sheet are already verified site assets. New dataset records link to the original image pages; the images have not been moved into unrelated topographic passages. Existing accepted prose remains preserved. Connections to passages are anchored only where the source mapping topic is explicitly discussed; research records that are not yet mentioned in chapter prose link through the graph without inventing passage appearances.

## Remaining source limitations
Individual QMAP regional map dates vary. ArcFlax edition 2.0 is catalogued, but its full GIS project files and detailed layer inventory were not inspected. The National Library record does not establish the first ArcFlax edition date. The AgriBase item is a December 2000 snapshot, not a claim about product launch. Scion's late-1990s Forest Research predecessor contribution is documented by the contemporary 1998 and 1999 papers. No new historical imagery was generated.

## Validation requirement
Run repository CI (`npm ci`, `npm test`, `npm run build`, content and preservation validation), confirm all new relationship endpoints exist, and verify the Cloudflare preview before merging and production deployment. 
