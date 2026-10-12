# CRI and Treaty GIS documentary follow-up, 12 October 2026

Baseline: `b9d2efd95e76482e81d21ddd27338ae79286e120`. Prior research: `docs/research/cri-1990-2010-chapter-integration-20261012.md`.

## Confirmed programme outcomes

| Period | Finding | Source | Editorial handling |
| --- | --- | --- | --- |
| 2004–2006 | NIWA Stage I and II described a proposed GIS decision-support tool for catchment land use and water quality | NIWA CHC2004-097 and HAM2006-096 | Keep development dates and intended scope separate from later operational claims |
| 2005 | Initial CLUES release date stated in a 2016 technical retrospective | Elliott et al., Environmental Modelling & Software, 2016, https://www.sciencedirect.com/science/article/abs/pii/S1364815216306260 | Treat as a retrospective date, with contemporary 2008 and 2009 corroboration of a working system |
| July 2008 | CLUES custom ArcGIS control panel and river-reach scenario tools were documented with an actual nitrate-risk model application | Elliott et al., iEMSs 2008 https://scholarsarchive.byu.edu/iemssconference/2008/all/2/ | Implemented GIS, not only a project proposal |
| August 2009 | Regional council staff had been trained in CLUES; ongoing model development was recorded | Harris et al., NZARES 2009 https://ageconsearch.umn.edu/record/97166 | Evidence of adoption and training, not a count of all users |
| 1995–2001 | Whatawhata monitoring from 1995, management group from 1996, modified Mangaotama catchment from 2000–2001 | AgResearch and NIWA Whatawhata project publications | Distinct long-running field experiment, no unsupported claim its measurements fed CLUES |
| November 2004 | Crown Forestry Rental Trust used 3D mapping in Treaty claims | CFRT release via Scoop https://www.scoop.co.nz/stories/BU0411/S00197/cfrt-is-an-independent-trust.htm | Working 3D activity predates 2006 ArcFlax DVD; precise software unknown |
| 2005 | Trust-commissioned thematic map books for several inquiry districts have Waitangi Tribunal bibliography identifiers | Waitangi Tribunal, *Bibliography 1975–2016 Part 2*, pp. 41–42 https://www.waitangitribunal.govt.nz/assets/DOCUMENTS/WT-Bibliography-Part-2.pdf | Identify map-book products; do not assert matching ArcFlax digital layers or software |
| 2006 | ArcFlax Whanganui DVD independently catalogued | National Library https://natlib.govt.nz/records/30673810 | The original DVD remains unexamined; only its format, edition, publisher, ArcReader 9.1 and credited creator verified |
| August 2006–June 2007 | NIWA multibeam seabed mapping informed Chatham Rise/Challenger Plateau sampling | Nodder, Robertson and Bowden, NIWA June 2008 https://niwa.co.nz/about-niwa/water-atmosphere/vol16-no2-june-2008/mapping-biodiversity-new-zealands-exclusive-economic-zone | Specific sensor, acquisition period and sampling methodology |
| 2008–2010 | Bay of Islands OS20/20 marine survey and December 2010 public GIS portal | NIWA 22 December 2010 https://niwa.co.nz/oceans/aquatic-biodiversity-biosecurity-update/aquatic-biodiversity-biosecurity-update-31-december/web-portal-opens-door-bay-islands-data | Distinguish data acquisition from public release and later portal history |

## ArcFlax and mapping distinctions

The 2004 Trust statement describes 3D mapping but does not identify ArcFlax as the system. The 2005 inquiry map-book bibliography describes printed documentary maps, while the 2006 National Library ArcFlax entry describes one interactive GIS DVD edition. No file-by-file DVD inventory was found, and no first-edition date was established. A contemporary 2020s product also called ArcFlax 2.0 provides much larger packages for Māori GIS; do not backdate its present contents or software to 2006. The map books' Tribunal identifiers are recoverable from the bibliography; do not invent all exact identifiers within the site without reading their individual entries.

## Technical architecture and dates

The 2008 CLUES conference article records a custom front-end inside Esri ArcGIS, reach selection and scenario preparation. A 2009 study records training of regional-council staff. Later ArcMap distributions contain changed environmental datasets and REC versions; those datasets were not necessarily present in 2005. The 2016 technical paper retrospectively gives the first release date. Keep those evidence classes distinct.

## Documentary image candidates, not yet copied

1. Original 2008 NIWA Chatham Rise and Challenger Plateau sampling/coverage maps, embedded in the June 2008 Water & Atmosphere article. These precisely depict the programme and should be retained as original documentary sources if the source binary can be safely retrieved and verified.
2. The 2008 Elliott et al. iEMSs CLUES paper includes a system schematic and GIS interface screenshot, with a contemporaneous date and attributable publication.
3. A NIWA water-quality-modelling factsheet `https://niwa.co.nz/sites/default/files/dipcon_wq_models.pdf` displays a CLUES ArcGIS interface with catchments and nutrient map outputs; check the document's actual creation date and whether its screenshot derives from the 2000s before placing.
4. NIWA's Whatawhata research page includes a genuine mapped study area with land-cover classes and monitoring stations. The current website does not establish the creation date of the image itself. Keep it as a documentary candidate, not a claimed 1996 map.

No new image binary has been installed in this batch because original binary downloads and local image checksum validation could not be completed. Existing image placements remain unchanged.

## Publication QA

Validate new project, dataset and person IDs; relationship endpoints; source URLs; dates; passage inclusion; editable theme metadata and chronology. New chapter passages need preservation-manifest updates for changed source bytes. Execute `npm test`, `npm run build`, preservation, image integrity and browser QA before merge; verify Cloudflare preview and production deployment. Existing accepted prose and images are preserved.
