# ArcFlax Northland and NIWA catchment GIS follow-up, 12 October 2026

Baseline: `5b813feb65fac71a3fdc625ec980fb6321360cf0` in `pm4gis/gishistory26`. Work follows `docs/research/cri-arcflax-clues-marine-followup-20261012.md` and earlier PR #58. This additive release records historical evidence absent from the previous chapters. No image binary has been fabricated or replaced.

## Evidence and decisions

| Period | Discovery | Verified evidence | Placement |
| --- | --- | --- | --- |
| August 2004 | NIWA Stage I already had an operating ArcGIS Water Quality Modelling Toolbox and connected SPARROW model, with Waikato mapped results. Some model integrations remained under development. | Original NIWA CHC2004-097, Figures 5-2 to 5-5, and named project-team responsibilities | Chapter 9 Catchment monitoring; updated existing multi-CRI project record |
| 2006 | Whanganui ArcFlax Edition 2.0 published as single interactive DVD with ArcReader 9.1 | National Library NZ record 30673810 | Preserve earlier account; add explicit comparison to Northland |
| January 2007 | ArcFlax 1.0 Northland, five-disc two-dimensional and three-dimensional GIS viewer, entries described as Crown Purchases, Old Land Claims, Native Land Court block and historical mapping | Waitangi Tribunal Wai 1040 Record of Inquiry index, entry A045, PDF p. 354, listed as delivered by CFRT in December 2013 | Chapter 35; Māori GIS theme; separate system and event |
| March 2008 | NIWA TopNet national river-flow simulation and mapped water availability, Ross Woods and colleagues | NIWA Freshwater Update No. 26, 18 March 2008 | Chapter 9 and separate project and event |
| March 2008 | NIWA ROTAN nutrient routing and land-use scenarios, applied to Rotorua and Taupō in separate collaborations | NIWA Freshwater Update No. 26, 18 March 2008 | Chapter 9, AgResearch and NIWA profiles; separate project and event |

Primary URLs:
- https://www.waitangitribunal.govt.nz/assets/DOCUMENTS/1040-ROI-index-1July2019.pdf
- https://natlib.govt.nz/records/30673810
- https://webstatic.niwa.co.nz/library/CHC2004-097.pdf
- https://niwa.co.nz/lakes/freshwater-update/no26-2008/how-much-water-available
- https://niwa.co.nz/lakes/freshwater-update/no26-2008/nitrates-water-now-and-future

## Key interpretation

The 2007 *Northland 1.0* item is dated later than *Whanganui Edition 2.0* in the National Library. These are regional editions and the numbering does not supply a reliable product-wide chronology. The Te Paparahi o Te Raki index establishes the five-disc Northland delivery and broad map subjects, not internal GIS software, licence, spatial accuracy, lineage of every underlying dataset or documentary proof that the 2006 Whanganui contents were identical. The index records a 2013 document receipt date separately from the package's January 2007 date.

The original August 2004 NIWA report documents a working ArcGIS toolbar and connected SPARROW model, unlike a merely proposed application. Integrations for other models were still prospective at that stage. Later CLUES releases and 2009 documentation must remain dated separately. TopNet (river-flow and water-resource estimation), ROTAN (nitrogen routing in Rotorua/Taupō catchments), and CLUES (multi-model land-use and catchment water-quality scenarios) are separate documented systems; do not combine their functions into a single product.

## Sources and illustration findings

Original contemporaneous GIS screenshots are printed in NIWA Stage I 2004 report, pp. 8–10, especially Figures 5-2 (ArcGIS toolbox), 5-3 (river selection), 5-4 (modelling toolbox) and 5-5 (mapped nitrogen loads). This register links that authentic source directly from the multi-CRI system profile. The original 2009 CLUES tutorial manual also contains ArcGIS application screenshots. No derivative screenshot has been inserted into the website because an original binary with verified page/caption/checksum has not been integrated. Archive the original reports and register individual image assets if a reproducible acquisition workflow is available; do not replace them with generated images.

The more recent ArcFlax 2.0 materials describing QGIS and tens of thousands of Māori land block maps belong to another product period; the 2006 and 2007 packages cannot be said to have contained those tools or all the contemporary datasets.

## Publishing and preservation

Two existing passage JSON files gain inserted source-linked paragraph blocks without edits to the original blocks or immutable paragraph identifiers. One existing theme and three existing profiles are extended; three new project records, three events and ten relationship records have distinct IDs. Recompute preservation-manifest SHA-256 only for the two changed passage files, add a reviewed manifest note, run `npm test`, `npm run build` and full browser QA, and verify Cloudflare preview and production deployment. Existing historical images and their binary checksums remain unchanged. 