# Eight contributed historical sources

Prepared 17 October 2026 against `pm4gis/gishistory26` main `9154100596ddf94e5c697f1c7091ec0e9f97552d`. This is an editorial source-acquisition ledger. No edits to the predecessor site.

Eight original uploads were opened and extracted: seven PDFs and one five-slide PowerPoint. Files, byte sizes and SHA-256 are recorded in `src/lib/contributed-primary-sources.mjs`. The source pages reproduce concise historical claims with original page references. All eight supplied originals were checked locally, not downloaded into the GitHub repository; do not describe them as locally hosted public PDFs.

## Published evidence decisions

- January 2007: Understanding our geographic information landscape: A New Zealand Geospatial Strategy. 30 pages; `be146c483a21a44db899dfca05cc717bf2f290e64df719b1c5acdfdfe263133c`. Timeline marker `source-nz-geospatial-strategy-2007`, catalogue route `/sources/documents/nz-geospatial-strategy-2007/`; original file republication: unhosted, rights not cleared.
- 7–9 November 2007: Crown Forestry Rental Trust: NZ Esri GIS Users Group Conference handout. 2 pages; `2102ee1ab44d019b7eaedc13fa4a5bc42bd59f0734dd06a0121fdd578854aa29`. Timeline marker `source-cfrt-gis-conference-handout-2007`, catalogue route `/sources/documents/cfrt-gis-conference-handout-2007/`; original file republication: unhosted, rights not cleared.
- December 2012: New Zealand SDI State of Play Report 2012. 26 pages; `a66a81c0cb5d4391570815c57ddfc9ca4aa0e618b186b42a9ea5a11fd23c82e8`. Timeline marker `source-nz-sdi-state-of-play-2012`, catalogue route `/sources/documents/nz-sdi-state-of-play-2012/`; original file republication: unhosted, rights not cleared.
- December 2015: New Zealand Geospatial Research and Development Priorities and Opportunities 2016–2020: Section A. 24 pages; `0ae5a760998d2da2f19e5e4848dc4d2fb64bef0e1c59e1f27b6df8f5477ad336`. Timeline marker `source-linz-geospatial-rd-priorities-2015`, catalogue route `/sources/documents/linz-geospatial-rd-priorities-2015/`; original file republication: unhosted, rights not cleared.
- 14 November 2018: GIS Day 2018 educational poster (Doctor Who-themed presentation). 5 slides; `872f860e8196a460f0904c826a8bc12df925428239c57a81e930affdc4f1a4ad`. Timeline marker `source-gis-day-education-poster-2018`, catalogue route `/sources/documents/gis-day-education-poster-2018/`; original file republication: unhosted, rights not cleared.
- 13–15 November 2019: PLACE19: Te Kāhui Manu Hōkai Māori GIS Association conference programme. 28 pages; `a3c6b4ec9191fdb3b6ff3d2ed6faab95671e89466d08213d4811361c40dd67c7`. Timeline marker `source-place19-maori-gis-programme-2019`, catalogue route `/sources/documents/place19-maori-gis-programme-2019/`; original file republication: unhosted, rights not cleared.
- May 2021: Taranaki CDEM Geospatial Strategy 2021–2026: stakeholder version. 30 pages; `7dc604a3f370c2d202a491a5c657f5517f831db0c1c0704c6331ebb2b444cb16`. Timeline marker `source-taranaki-cdem-geospatial-strategy-2021`, catalogue route `/sources/documents/taranaki-cdem-geospatial-strategy-2021/`; original file republication: publisher URL can be linked, local binary unhosted.
- 2021: GIS mapping tools for wetland projects, Te Reo o te Repo: Kei Konei Tonu Au, Chapter 16. 14 pages; `05c3c73a6e677f3c51047a11b9728998507d8bff0659db72d35a43441b07f4bc`. Timeline marker `source-gis-mapping-wetland-projects-2021`, catalogue route `/sources/documents/gis-mapping-wetland-projects-2021/`; original file republication: publisher URL can be linked, local binary unhosted.

## Rights and date safeguards

- The 2007 Crown Forestry Rental Trust handout specifically credits Ngāti Tamareheroto permission for an illustrated 2007 claimant map. This does not authorise a new online republication of that map. The original is therefore not redistributed.
- The 2018 Doctor Who-themed educational poster includes possible third-party visual IP. Until the artwork licence or creator permission is established, show the evidence record and educational references, not the slide images or PPTX.
- The Te Kāhui Manu Hōkai PLACE19 programme has no verified open republication licence in the supplied PDF. Names and conference sessions are cited, without copying the full programme.
- Government reports are publicly issued historical documents, but public availability alone has not been used as proof of an open PDF republication licence.
- The publisher PDF URLs for the 2021 Taranaki CDEM strategy and 2021 wetland GIS chapter were independently located. The file identities and page details in this register are those of the uploaded copies, not byte-for-byte verification of the live publisher files.
- Dates: January 2007 strategy, 7–9 November 2007 CFRT handout, December 2012 SDI report, December 2015 R&D report, 14 November 2018 GIS Day, 13–15 November 2019 PLACE19, May 2021 Taranaki strategy and 2021 wetland chapter. No events after 31 December 2025. The 2021–2026 Taranaki plan describes future planned work but has one 2021 publication marker and no 2026 timeline event.
- Source credibility: first-party originals are primary historical evidence. Attribution and specific maps/screenshots require separate item-level rights checks before using figures.

## Follow-up

The eight source descriptions, historical claims, linked stories and timeline anchors should be tested on the site and published. Exact original files require an authorised binary transfer or a verified publisher-licensed copy; do not imply that a description page stores the supplied PDF/PPTX. Next, reconcile named PLACE19 speakers and Taranaki strategy contributors against the current People and Organisation records, avoiding duplicate identities and preserving limited biography and exclusion rules. Then add sourced passage-level additions where the source changes a chapter’s historical account.

## Release verification

Pull request: https://github.com/pm4gis/gishistory26/pull/102 . The exact eight-file additive-preservation workflow [38979762303](https://github.com/pm4gis/gishistory26/actions/runs/38979762303) succeeded: it compared baseline content, amended only eight approved SHA-256 manifest entries, ran npm ci, npm test and npm run build, then committed the validated manifest on the feature branch as `027af15903d924863f756d2768cbf0ae6eea497f`. Production publication and live-page verification remain pending until the separate PR checks and Cloudflare release succeed.
