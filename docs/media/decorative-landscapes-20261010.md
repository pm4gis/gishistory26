# Decorative aerial landscapes
Prepared 10 October 2026.

This is a **visual design collection**, not a historical media account or evidence for any passage. The owner supplied 162 screenshots of aerial photography and asked that existing optimised WebP variants be used across the site's design. The selection comprises 14 varied aerial views and 28 existing derivatives (768-pixel cards and softened 1600-pixel photographic backgrounds). The original 162 PNG files remain outside GitHub.

## Design usage

The photographs are abstract visual motifs: river channels, natural textures, coastlines, islands, mountainous terrain and harbours. They decorate the homepage, theme pages, chapters, browse, search and timeline. No image is labelled as representing the subject of a historical event or person. All uses employ empty alt attributes because the surrounding text already names and describes the actual site content. No text is written directly on an unprotected image; reading text keeps its theme-appropriate solid surfaces.

Images are supplied from `public/decor/` and are static self-hosted WebP, not hotlinks to Drive or full-size PNGs. Source library: [owner-provided 4K wallpaper folder](https://drive.google.com/drive/folders/1gtvCBXWmdpSU4BE5ERaK0JwyQuFQhzaJ). The source wallpapers themselves display credits to LINZ or data.linz.govt.nz. The exact aerial photograph survey, capture time and underlying licensor are not confirmed from those labels. Do not imply these decorations are specific historical imagery or fabricate a universal photographer credit. Retain the existing separate historical media permission register for actual documentary figures.

Source IDs selected: `north2024-raglan1`, `north2024-atene1`, `north2024-karikari2`, `north2024-taranaki1`, `north2024-moturoais1`, `north2024-tekaha1`, `north2024-tararua1`, `tasman-5`, `otago-8`, `otago-1`, `porirua-teawarua-o-porirua`, `porirua-whitirea`, `north2024-hawkes-bay-1` and `north2024-rangitoto1`.

## Site delivery

The images are ordinary page decoration selected by a stable array and used in reusable Astro components. Main text and navigation remain fully usable with images disabled, without scripts and with reduced motion. Card images lazy load; the primary homepage image loads eagerly. CSS adds gentle scale on hover only, respects reduced motion, and keeps all text outside the imagery.

Use `npm test` and `npm run build` to check content and layout assets. `scripts/check-decor-images.mjs` checks all 28 binary assets and enforces a strict 150 KiB ceiling per file.
