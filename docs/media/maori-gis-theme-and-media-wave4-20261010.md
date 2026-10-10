# Māori GIS theme and institutional documentary media — wave 4

Prepared 10 October 2026. Authoritative repository: `pm4gis/gishistory26`. Base: the currently published production content, not the predecessor `history.pm4gis.nz` canonical release. All existing narrative, record identifiers, biography material, relationship and event source files remain checksum-protected.

## Theme

The standalone theme `/themes/maori-gis/` provides a sourced five-part narrative, nine chapter passages, eleven historical milestone links and eleven associated organisations, agencies, businesses and councils. It covers Māori geographic knowledge and colonial survey records; 1996 Māori land and resource research; Māori Land Court GIS in 2011; 2003–05 MIRMAK; Kā Huru Manu (2005 pilot, 2007 hui, public 2017 atlas); 2009 and 2010 practitioner conferences; Te Mana Raraunga and data governance; and LINZ / Te Kāhui Manu Hōkai Ngā Poutama Matawhenua (beginning October 2020). The original underlying events and articles are preserved, including their unresolved or imperfect citations; the theme's narrative supplies specific authoritative evidence.

Membership is a read-only overlay in `src/lib/data.ts`, driven by `theme.recordIds`, `theme.eventIds` and `theme.passageIds`. This exposes the new theme in browse filtering, graph membership and chapter selection without modifying checksummed historical collection source files. A specific chronology and source-linked narrative appear in the theme view. Person profiles remain text-only and are not assigned portraits.

## Image priority audit

Ten requested high-priority non-person entries were assessed against 54 initial published historical images, rights, authentic subject evidence and the need to avoid confusing an institutional photograph with its GIS systems.

| Priority record | Existing issue | Action |
|---|---|---|
| Māori Land Court | No court-specific record imagery | **New** real photographed court minute books, Commons CC BY-SA 2.0 |
| Te Rūnanga o Ngāi Tahu / Ngāi Tahu Archive | No locally held Māori-sourced historical geographical illustration | **New** circa 1841 Māori-sourced map, explicitly *not* Kā Huru Manu imagery |
| NIWA | No direct institutional image | **New** NIWA research vessel Tangaroa photographed by Dave Allen, CC BY 3.0; not presented as a GIS system |
| University of Otago | No direct institutional image | **New** 2009 Registry Building photograph, CC BY-SA 3.0; not a GIS laboratory |
| University of Auckland | No direct institutional image | **New** 2004 University Clock Tower photograph, public domain; not a GIS classroom |
| Te Herenga Waka—Victoria University of Wellington | No direct institutional image | **New** 2025 Rutherford House bilingual building sign, CC BY-SA 4.0; not a GIS workspace |
| Department of Survey and Land Information (DOSLI) | No confirmed period photograph or original DOSLI GIS screen | **Hold** until original departmental/software evidence found; later Topo50 sheets are not DOSLI output |
| Terralink | No confirmed Terralink-authored mapping product with cleared redistribution | **Hold** pending primary company map/screenshot or photo and permissions |
| Manaaki Whenua Landcare Research | GIS/LRIS original interface not yet cleared as reusable | **Hold** pending verified institutional map or original software screenshot |
| Department of Conservation | Ecological cartography now shown is independent of DOC | **Hold** pending authentic DOCgis/agency system or direct institutional image with verified rights |

## Further licensed illustrations

- `ngai-tahu-takiwa-map-2010`: real contributor-generated GIS depiction of Ngāi Tahu takiwā by Igover, CC BY-SA 3.0, used as Māori GIS theme lead, **not** described as a Kā Huru Manu map or official boundary.
- `native-land-court-whanganui-2025`: Tom Ackroyd, CC BY-SA 4.0, the *former* Native Land Court and Aotea Māori Land Board building in Whanganui, dated 2025; heritage context, not a current Māori Land Court GIS office.

Each published photograph/map has a separate `/images/<slug>/` page with creator, licence, source URL, image date, contextual limitations, original checksum and a link to the source original. Originals are in the Wave 4 acquisition artifact / Library archive, not in the public repository. Public assets are uncropped 1600-pixel WebP and 720-pixel card images, with SHA-256 verification. An image present on one theme or organisation is not evidence it produced a related software application.

## Evidence and restraint

Primary references include LINZ annual reports 2020/21 and 2021/22, LINZ current Ngā Poutama programme page, 4 March 2011 ministerial Māori Land Court GIS launch, the Motueka 2005 report by Harmsworth, Park and Walker, Ngāi Tahu's own Kā Huru Manu history, and Te Mana Raraunga's charter. The current Waitangi Tribunal Rangahaua Whānui page is used for the earlier research history. No unpublished iwi-held geodata, precise wāhi tapu locations, owner data or restricted GIS layers have been copied.

Potential editorial issue: some existing 2020/22 Māori GIS events carry Women in Spatial source links unrelated to those particular events. Historical event JSON is checksum-protected and **was not rewritten** in this media/theme work. The Māori GIS theme supplies the correct LINZ annual reports, and a future separately reviewed editorial correction can reconcile these legacy source-note mismatches without deleting otherwise accepted events.

## QA and release

Check all content preservation manifests, theme membership and anchor links, file SHA-256, published image-detail links and alt text, desktop/mobile rendering, independent credits and People image exclusion. Record exact GitHub PR head and Cloudflare production SHA. Production must not be described as updated until a successful exact-SHA deployment is verified.

## Acquisition result

The eight individual Wikimedia Commons originals were retrieved and checked by the Wave 4 acquisition workflow. Eight WebP display images and eight card derivatives were committed directly to this PR branch with corresponding source/licence JSON. GitHub Actions artifact `NZ_GIS_History_Maori_GIS_Media_Wave4_2026-10-10`, acquisition run `38044752753`, preserves all eight originals and per-file SHA-256 values. A separate permanent ZIP copy is stored in Library → NZ GIS History → Research Packages. Four still-unresolved organisational image gaps remain research candidates; they were not substituted with an inaccurate map.
