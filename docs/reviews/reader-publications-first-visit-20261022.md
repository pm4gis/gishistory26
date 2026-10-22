# Reader and publications: first-visit review (22 October 2026)

Source inspected: `src/pages/index.astro`, `src/pages/publications/index.astro`, `src/components/PublicationReader.astro`, `src/lib/publication-return.mjs`, tests and approved 20–21 October homepage verification notes on `main` (`0febde4`). This is a source-based design audit, **not a recorded browser run**.

## Preserve accepted presentation

The current homepage has the three locally supplied Karikari/Raglan/Taranaki wallpaper frames, 27-second crossfade, reduced-motion fallback, plain linked chapter and section headings, accessible chapter catalogue route and individual top-level menu destinations. Keep these decisions. Do not restore the superseded short-history-first design, play controls, carousel or nested Explore menu. Retain local archive image credits, image-link destinations and all chapter anchors. Five palette families with light/dark variants must remain functional.

## Specific findings and recommendations

1. **P1, publication filter Back/Forward:** `src/pages/publications/index.astro` handles `popstate` but uses `history.replaceState(null, '', u.pathname+u.search)` when readers actively choose a filter. This overwrites the prior catalogue state, so Browser Back does not step through earlier filters despite implemented popstate restoration. Change the user-driven filter action to `history.pushState(null, '', u.pathname+u.search)`; retain `apply(false)` on Back/Forward and the existing return-to-publications snapshot. Ensure selecting an already-active filter does not create an additional history entry. Implement a unit source check and an actual browser Back/Forward journey.
2. **P2, publication relevance:** Cards present titles, excerpts and images well, but the DOC collection includes three verified weak/false GIS evidence matches; remove irrelevant source items only after original-page research and preservation reconciliation (Research #133). Code tests that accept the mere presence of the word “gis” cannot function as editorial approval.
3. **P2, PDF reading:** The document appears first in a large self-hosted viewer, with previous/next and local return links. Preserve this structure, especially mobile fallback “Open document”. The library and PDF viewer should retain context when switching documents or returning. Avoid downloading as the default action.
4. **P2, catalogue text:** `aria-label={'Read PDF: '+p.title}` repeats the medium for a collection containing PDFs, while the visible card deliberately avoids it. A separately approved small wording change to “Read publication: [title]” is appropriate after checking existing tests and screen-reader clarity.
5. **P3, small-screen review:** The mobile filter disclosure, one-column image/text cards and 44px filter targets are already present in source. Confirm visibility, focus order, overflow, 320px wrapping and no hidden panels in Chromium. The code review alone cannot establish performance on real devices.
6. **P3, chronology display:** The list toolbar currently embeds the literal “1973–2025”; derive both endpoints from the actual publication records when the catalogue dataset changes. Keep historical date limit 31 December 2025.

## Acceptance criteria for Development

- Existing homepage, CSS wallpaper transitions, links, palette preferences, menu and content remain unchanged in this wave.
- Clicking filter A then B leaves distinct shareable history states; Back returns to A with correct visible cards, selected `aria-pressed`, count and return links; Forward returns to B.
- User navigation does not create duplicate history entries when choosing the active filter.
- A publication opened from a filtered catalogue returns to the filtered collection and restores the selected card as appropriate.
- Tests and build pass; a separate mobile/keyboard browser run is reported explicitly as passed, failed or blocked, with screenshots if available.
- Historical content, PDFs, source metadata and record IDs are untouched by this UI fix.

Handoff: Development #135 owns implementation in `src/pages/publications/` and tests, QA #136 reviews the patch independently. No production release until the owner approves the resulting PR.
