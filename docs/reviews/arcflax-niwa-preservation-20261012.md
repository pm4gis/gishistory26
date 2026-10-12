# Reviewed preservation changes – 12 October 2026

Baseline commit `5b813feb65fac71a3fdc625ec980fb6321360cf0`. Exactly two accepted passage JSON files were extended after previous content; no existing paragraph block, paragraph ID, source reference or historical image was removed.

New ids are `research-niwa-stage1-toolbox-2004`, `research-niwa-topnet-national-2008`, `research-niwa-rotan-2008` and `research-arcflax-northland-five-discs-2007`. Existing `src/content/passages/chapter-9-p010.json` and `src/content/passages/chapter-35-p002.json` remain in their original chapter order. Historical sourcing, proposed-versus-implemented model distinctions and regional ArcFlax version chronology are documented in `docs/research/arcflax-northland-niwa-models-20261012.md`.

Updated SHA-256 checksums computed from the exact new Git JSON blob contents:
- `src/content/passages/chapter-9-p010.json` – `a819bf7a1fe66fbb7ad7677c9e2a57928e8cfd144410620d72538d5e2d05b811`
- `src/content/passages/chapter-35-p002.json` – `81ef5e50d6705cb120be7eab57ab281b3d80fdcab007148577c15bf020c7020d`

Original preservation baseline contained 4,128 entries. This release only changes the two listed hashes; all other manifest entries remain identical. The site source-image assets and image-original checksums have not been modified. Test through `npm test`, `npm run build`, editorial exclusions and browser QA.
