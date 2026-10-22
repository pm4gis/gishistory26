# Review concept local browser smoke test
Date: 23 October 2026 NZT
Branch: `review/multi-lens-ux-benchmark-20261023`
Target: `public/design-concepts/review-20261023/index.html`

## Test method
Rendered the standalone prototype's complete HTML with local headless Chromium, using Python Playwright and `page.set_content(html, wait_until='domcontentloaded')`. Browser binary: `/usr/bin/chromium`. Simulated `prefers-reduced-motion: reduce`. These tests exercise **the concept HTML only**, not the production website or its Astro/Svelte interfaces. The container cannot reach remote asset hosts, so page images were blank in local screenshots. Live page copies are linked from the website and not replaced by generated historic pictures.

## Results

| Viewport | Reader tab | Publications tab | Periodicals button | Horizontal overflow | Mobile direct menu |
| --- | --- | --- | --- | --- | --- |
| 1440 × 900 | PASS | PASS | Exactly 1 of 4 rows visible | 0 px | Not applicable |
| 1280 × 900 | PASS | PASS | Exactly 1 of 4 rows visible | 0 px | Not applicable |
| 768 × 900 | PASS | PASS | Exactly 1 of 4 rows visible | 0 px | Not applicable |
| 390 × 900 | PASS | PASS | Exactly 1 of 4 rows visible | 0 px | 11 links inside native menu |
| 320 × 900 | PASS | PASS | Exactly 1 of 4 rows visible | 0 px | 11 links inside native menu |

## Corrected during test
- Added a `[hidden]` CSS rule; the first test exposed the four publication rows remaining visible despite a selected filter.
- Replaced the conceptual mobile horizontal navigation scroll with an explicit `Menu` disclosure retaining all 11 direct destinations.
- Reduced the mobile hero heading size to avoid unnecessary word wrapping.

## External source confirmation
Browser Rendering successfully read the initial Cloudflare Pages preview of this concept at `https://ff85d3f9.gishistory26.pages.dev/design-concepts/review-20261023/` (HTTP 200), including the three layout headings and the design-study banner. This was the **earlier** version, before the navigation fix. The later deployment for SHA `408b4c2c24d71c23269dafcdd413ab4ce08077a9` must be checked separately before claiming the final preview passed.

## Unverified
- Full original image loading on real devices, live CSS screenshots with actual owner-supplied imagery and all keyboard/assistive technology paths.
- WCAG 2.2 AA independent audit of the concept.
- Production site user tasks, accessibility and performance (this review PR does not change production).
- Ten independently executed specialist agents or empirical participant research.

The purpose of this artefact is to show repeatable smoke evidence, not to certify an unbuilt replacement site.
