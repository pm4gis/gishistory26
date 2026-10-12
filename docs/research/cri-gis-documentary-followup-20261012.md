# CRI GIS documentary follow-up: ArcFlax, CLUES and applied mapping, 12 October 2026

Baseline: production commit `4d3a6bd0498be12960ac9d86946f0bf7cf35f012` in `pm4gis/gishistory26`, including PR #58 and PR #60. This review first checked the active chapter passages, institution and project profiles, existing events and relationship graph, preservation manifest, accepted QMAP placement, and the CRI image-alignment register. Existing ESR EpiSurv/PHEW! and 2000s health-geocoding passages already document the operational workflow, so no duplicate health passage was added. Existing QMAP image placement and the ArcFlax Northland (2007) account are retained.

## 1. ArcFlax Whanganui Edition 2.0 (2006)

| Detail | Verified record | What the record does not establish |
| --- | --- | --- |
| Publication | National Library catalogue describes *ArcFlax – Edition 2.0 Whanganui 2006*, an interactive GIS data DVD, one DVD-ROM, publisher Crown Forestry Rental Trust (CFRT), and creator Duane Wilkins. | No first-edition publication date, print run, circulation list or exact distribution recipients. |
| Software | ArcReader 9.1 is the documented system requirement. Esri product documentation explains the general ArcReader viewer and Publisher workflow. | The original Whanganui files have not been examined, so the ArcFlax authoring tool, PMF or other internal formats, layer structure, data connections, installation process and software licence conditions for this item remain unverified. |
| Coverage | The catalogue title says Whanganui; its subject headings include Taranaki. Relief is described through contours, shading and spot heights; map scales vary. | The catalogue does not define a precise boundary or prove that all of either named region was covered. Relief depiction does not identify the source elevation dataset. |
| Users and purpose | CFRT’s current mapping description says eligible claimant groups use maps as evidence in Waitangi Tribunal hearings and settlement negotiations; it notes that claimant-supplied material may be confidential. Duane Wilkins’s 2026 first-person recollection describes ArcReader packages designed to let non-professional users explore prepared GIS. | Neither source gives a recipient list or exact user workflow for this one-disc 2006 edition. Wilkins’s recollection concerns the wider ArcFlax resource family and is not a layer inventory for Whanganui. |
| Datasets and contributors | The National Library names Wilkins and CFRT. | No file-level inventory, source-dataset list, data dates, lineage notes, named additional contributors or original documentation was found for the Whanganui DVD. |

The separate Northland ArcFlax 1.0 item dated January 2007 remains separate: Waitangi Tribunal entry A045 describes five discs, a 2D/3D viewer and historic land/claim mapping, supplied by CFRT in 2013. Its content must not be projected back onto Whanganui 2006. Nor should the 2026 recollection of a wider multi-disc resource package be treated as proof that this specific 2006 DVD had the same contents.

**Highest-value archive action:** obtain the original Whanganui DVD and any accompanying readme, user guide, Publisher project, source-data inventory or distribution register; preserve a write-protected bit image and record checksums before inspecting files. The National Library record is the contemporary bibliographic anchor; it is not a digital copy of the DVD.

## 2. NIWA-led catchment GIS and CLUES (2004–2006, with later outcomes)

The reports support a staged account rather than a single jump from proposal to public service.

- **Stage I, August 2004:** NIWA’s CHC2004-097 report shows an ArcGIS Water Quality Modelling Toolbox linked to SPARROW, with reach selection and mapped Waikato nitrogen loads (Figures 5-2–5-5). Ross Woods led the project; Ude Shankar worked on the GIS framework; Sandy Elliott led SPARROW. OVERSEER, SPASMO and other connections were still being developed at this stage.
- **Stage II, July 2006:** HAM2006-096 documents a working toolbox for ArcGIS 8.3 or 9. Users could sketch up to five land-use scenarios, overlay them on catchments, query river reaches, and map or tabulate nitrogen and economic outputs. SPARROW, OVERSEER and Harris Consulting economic models were integrated; work on SPASMO had only begun. The report’s cover displays the identifier CHC2006-096 while its title page and filename use HAM2006-096.
- **Testing:** the Stage II report records Environment Waikato testing begun on 3 June 2005. Council staff reported generating their own land-use scenarios and gave specific interface feedback. This is direct evidence of an external pilot, not merely internal development.
- **Project data exchange:** a Landcare FTP area was password-protected and limited to project participants and science-provider accounts. This is evidence of partner data exchange, not public software distribution.
- **Land-use data actually used:** the 2006 land-use layer used AgriBase dated September 2003, LCDB2 based on 2001/02 imagery (released 2004), MAF Monitor Farms (2004), and LENZ (2002). The report says AgriBase and LCDB2 were incompatible in some places; AgriBase classes were used only where consistent with LCDB2. The AgriBase snapshot is distinct from the December 2000 item already catalogued in this site.
- **Soils and model limits:** NZLRI/Fundamental Soil Layers and the National Soils Database supplied soil attributes. SPARROW, EnSus and OVERSEER inputs could be supplied nationally, but spatial detail was coarse. SPASMO had the greatest data needs; it was not run spatially, because only a limited number of NSD sites carried the required soil-physics attributes. The report used representative regional horticultural soil profiles instead.
- **Later release and use:** a 2016 retrospective dates an initial CLUES release to 2005. The 2008 technical article describes a completed first version and distribution to national and regional land/water agencies; the 2009 report records regional-council training. The sources may use “initial release” and “first version” for different milestones. Their version labels are not fully reconciled. These later sources establish development and use, while the 2006 report alone does not prove a public download or complete integration of every planned model.

## 3. Further identifiable CRI spatial work

| Date | Work and organisations | Evidence and limit |
| --- | --- | --- |
| 1999 | Forest Research / Kinleith Forest: Payn, Hill, Höck, Skinner, Thorn and Rijkse used GIS and geostatistics to explore site-index growth, foliar phosphorus and mapped soil units. | The paper tests kriging and modeled spatial trends across two rotations, then says soil/foliage data were too sparse for confident estimates. It is exploratory research, not proof of an operational estate-wide monitoring system. |
| 2001–2003 | NIWA, Landcare Research, Crop & Food Research, HortResearch, Kaipara District Council and Far North District Council: Hokianga and Western Kaipara crop-suitability mapping. | AKL2003-037 lists ten co-authors and a 35-map inventory: 28 climate maps at 1:250,000 and seven soil maps at 1:50,000; climate values are estimated on 500 m cells from existing data. Ten crop options were mapped. Councils made outputs available via two public libraries and council offices. The report does not identify the software, and labels the map products as screening rather than site-specific recommendations. NIWA’s later page groups this with separate Tararua and Gisborne projects and possible web/CD map interrogation, without dating a specific electronic release. |
| 2003–2004 | Institute of Geological & Nuclear Sciences / GNS Science: Active Faults Database. | The 2003 data dictionary defines line traces and sections, point trench/terrace features, and field attributes; it says the database had not yet been used in a working environment. A 2004 GNS conference abstract documents a public web map and attribute query for more than 200 faults. The two dates distinguish schema development from an operating public interface. |
| 2008–2010 | AgResearch and Landcare Research: Iwi Futures Land and Resource Evaluation module with four Māori land case studies. | The 2010 paper describes participatory GIS, case-study repositories, thematic maps, desktop GIS data packages and a draft step-by-step web-accessible module. It does not demonstrate a public live service. Cultural layers are explicitly described as confidential and access restricted. |
| 1999–2001, already covered | ESR/EpiSurv/PHEW! and the Waikato disease-mapping methods. | Existing Chapter 27 passages already describe GeoStan geocoding, precision scores, privacy, automated ArcView mapping and the limitations of vector/raster rate maps; no duplicate activity was added. |

These additions complement existing coverage of AgResearch’s 2007 GIS service, NIWA’s CLUES, TopNet and ROTAN, HortResearch persimmon research, GNS QMAP, and Forest Research’s 1998 methods.

## 4. Documentary-image review

No substitute historical art was created and no new image was inserted. The existing verified 2008 QMAP Christchurch map remains anchored to its QMAP paragraph. The source audit found authentic NIWA Stage II ArcGIS screenshots and model maps, original 2003 Northland suitability maps, the Forest Research 1999 modeled figures, and a 2004 Active Faults web-map description. Their reuse was withheld: the NIWA report requires client permission, the crop report requires prior consent from both councils and four institutes, and other original-image rights/files were not verified. The 2010 Iwi Futures paper also warns that case-study cultural layers are access restricted. The media-alignment CSV records these decisions and the missing-original-file status.

## Primary sources

- National Library, ArcFlax Whanganui DVD: https://natlib.govt.nz/records/30673810
- CFRT mapping services: https://cfrt.org.nz/research-activities/
- Esri ArcReader/Publisher product guide: https://content.esri.com/support/documentation/ao_/what_is_arcgis_sep2005.pdf
- Duane Wilkins, ArcFlax retrospective: https://maorigis.nz/blog/when-maori-gis-came-on-ten-dvds
- Waitangi Tribunal, Northland ArcFlax A045: https://www.waitangitribunal.govt.nz/assets/DOCUMENTS/1040-ROI-index-1July2019.pdf
- NIWA Stage I: https://webstatic.niwa.co.nz/library/CHC2004-097.pdf
- NIWA Stage II: https://webstatic.niwa.co.nz/library/HAM2006-096.pdf
- CLUES 2008 technical article: https://scholarsarchive.byu.edu/iemssconference/2008/all/2/
- Hokianga / Western Kaipara report: https://www.kaipara.govt.nz/uploads/Climate%20and%20Soil%20data/Information_Document.pdf
- NIWA crop/tree suitability programme: https://niwa.co.nz/climate-and-weather/assessment-crop-and-tree-species-growing-potential-using-climate-soil-and
- Forest Research 1999 paper: https://www.sciencedirect.com/science/article/abs/pii/S0378112799000419
- GNS 2003 Active Faults dictionary: https://shop.gns.cri.nz/sr_2003-017-pdf/
- GNS 2004 conference abstract: https://gsnz.org.nz/assets/Uploads/Shop/Products/GSNZ_annual_conference/MP117_2004_Taupo/MP117A_2004_GSNZ_conference_Taupo_abstract_volume.pdf
- Iwi Futures 2010 module paper: https://cdm20022.contentdm.oclc.org/digital/api/collection/p20022coll30/id/1025/download
