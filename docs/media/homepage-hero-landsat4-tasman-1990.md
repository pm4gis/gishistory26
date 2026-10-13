# Homepage title image: Tasman Glacier, Landsat 4, 1990

13 October 2026

The homepage title box previously used a decorative contemporary Raglan aerial photograph. It now uses the original Landsat 4 Thematic Mapper observation of Tasman Glacier and nearby valleys recorded on **30 December 1990**, which is already stored and documented in this repository.

- Image metadata: `src/content/images/nasa-landsat4-tasman-1990.json`
- Existing web image: `public/assets/historical/web/nasa-landsat4-tasman-1990.webp`
- Unchanged original: `public/assets/historical/original/nasa-landsat4-tasman-1990.jpg`
- Source: NASA Earth Observatory, https://science.nasa.gov/earth/earth-observatory/retreat-of-the-tasman-glacier-8434/
- Credit: NASA Earth Observatory / Jesse Allen; Landsat 4 data, University of Maryland Global Land Cover Facility
- Observation date: 30 December 1990
- Historical context: actual early satellite mapping, not a reconstruction, illustration, or a modern photorealistic image

The `src/pages/index.astro` hero reads the documented local image record. This prevents an unrelated stock image from being substituted. No changes were made to the satellite image or its existing data record, assets, credit or original verification checks.

## Presentation

Retain the established **Slate Blue first-visit default**, all five colour families, the existing title and navigation, and the responsive hero layout. Desktop places the photographic observation on the right, with a surface-coloured gradient ensuring that title, introduction and buttons remain legible. Mobile separates the image from the text and displays the full image within its frame using `object-fit:contain`. The image remains unfiltered in all modes.

The image has meaningful alternative text taken from the project record. Provenance, citation and credits remain accessible on its existing image detail page, rather than being duplicated across the homepage.

## Acceptance checks

- `npm test`: assert authentic source and date, existing image checksums, correct homepage reference, removal of the previous Raglan hero, no image filter, and mobile framing.
- `npm run build`: validate existing content, image integrity and Astro types/build.
- Chromium homepage QA: confirm the image loads and stays inside its panel at 1440, 1024, 768, 390 and 320 pixel widths; check its alternative text, unfiltered appearance, image fit and title visibility.
- Reader browser QA and Cloudflare Pages preview: ensure no regressions.
- Confirm the deployed homepage includes the source image, retains the original title, and continues to serve all current social-sharing artwork and appearance settings.

Do not alter the current approved social thumbnail in this change.
