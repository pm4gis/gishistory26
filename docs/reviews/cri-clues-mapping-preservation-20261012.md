# Reviewed source preservation update, 12 October 2026

Branch `research/arcflax-clues-niwa-marine-20261012`, baseline `b9d2efd95e76482e81d21ddd27338ae79286e120`.

This release deliberately adds five researched paragraphs across four existing passage documents. The review compared every original block by exact ID, text and source metadata against the prior production revision. All accepted blocks remain present and unchanged, in their original sequence. New blocks are inserted only at specific passage locations.

| Passage | New paragraph IDs | Updated SHA-256 |
| --- | --- | --- |
| `src/content/passages/chapter-9-p010.json` | `research-whatawhata-catchments-1995`, `research-clues-working-gis-2008` | `8338f73276b3c663e8f847bf7071d37442e4c59593de0d31b71da15aead203eb` |
| `src/content/passages/chapter-9-p013.json` | `research-niwa-multibeam-biodiversity-2006` | `3294038bc32cb85ad67aee8e7794f6f25edca3fb4e379005eaa5c767242498f5` |
| `src/content/passages/chapter-35-p002.json` | `research-cfrt-3d-and-mapbooks-2004` | `969d4835dff12691869407ce7bcb105ffca8111f87c6c0440686499cebfb1e6b` |
| `src/content/passages/chapter-32-p002.json` | `research-niwa-bay-of-islands-public-portal-2010` | `61c6e07c70226060a9d1fd9a2e1b79251580b97d201468ba822a286820d00928` |

The existing `content/preservation-manifest.json` contains 4,128 source-file entries; only these four reviewed passage hashes are updated. The Māori GIS theme receives a separate documented 2004–2005 paragraph and two new project connections. No original image binary, archival source or accepted historical image assignment is changed.

The new projects, people, events and relationships are described in `docs/research/cri-arcflax-clues-marine-followup-20261012.md`; a separate image-candidate note records authentic historic mapping figures that could not yet be copied and checked. The release must still pass `npm test`, `npm run build`, editorial exclusions, simulated review, browser QA and Cloudflare preview.
