# Archived publications integration

Base production commit: `9f0348938d57ddffb684fd54375cc652442289bd`.

The shared Publications view imports the existing eight contributed-source records and four chapter-document records. It retains all original source registers, PDF bytes, hashes, asset paths, chapter anchors, legacy document routes and the accepted About/Preface explanations. No historical content JSON, image catalogue record, relationship or timeline event is changed, so the existing preservation manifest remains intact.

Four catalogue additions: LADEDA Plotting Handbook (May 1982), Our Land Resources (1979), Maps and plans at the Hocken Collections (undated), and GeoDataHub (15 July 2019). The Hocken guide has a null publication date; its October 2026 retrieval/catalogue dates and April 2026 PDF creation metadata are not historical publication dates. It has no timeline link or event. All dated public timeline content remains subject to the 31 December 2025 cut-off.

Cover generation checks the four originals against their accepted sizes, SHA-256 and PDF page counts, then renders only first-page derivatives. The 79-page Our Land Resources file is reconstructed using its existing archive parts; no second PDF is committed. See the cover report for derivative checksums and dimensions.

Release gates: npm ci, npm test, npm run build, preservation and link validation; responsive Chromium checks for twelve catalogue pages, downloads and checksums, all palettes/modes, filters including 1970s and undated material, legacy document links, and undated structured metadata. Production deployment and public route verification are required after merge.
