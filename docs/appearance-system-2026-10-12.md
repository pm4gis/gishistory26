# Appearance system, 12 October 2026

## Change

This branch changes appearance settings and presentation. It does not modify the historical chapters, records, images, relationships or deployment configuration.

- A new visitor receives Slate Blue dark. This is independent of the device setting until System mode is selected.
- Five colour families, Slate Blue, Coastal, Forest, Archive and Bubblegum, each offer light and dark variants.
- The Appearance popover uses separate mode and palette controls, visible focus states and explicit selected states. Escape closes the popover, as does clicking outside.
- Selections persist under `nzgis-appearance-v2`. Previous `nzgis-theme` and `nzgis-colour-palette-v1` values are mapped to the nearest new option.
- The shared semantic colour variables apply to navigation, chapter cards, reader panels, the timeline, search, datasets and the network graph. The Sigma/WebGL fallback uses computed palette colours and redraws on changes.
- Navigation uses restrained translucency. Reading panels remain solid. Documentary maps and timeline images keep their original colours. Scans displayed with containment use a neutral background.

## Tests and acceptance

The new `tests/appearance.test.mjs` checks the default, five palette definitions, paired foreground/background contrast of at least 4.5:1, legacy migration, storage persistence, system mode, and key accessibility wiring. It also checks colour definitions against the stylesheet.

The existing `scripts/home-browser-qa.mjs` now checks all five palettes in light and dark modes, contrast of the prominent Contribute action, system mode, Escape dismissal, saved preferences across major routes, and desktop/tablet/mobile widths. The pull request triggers `Verify publication`, including the repository's Node tests, build and editorial exclusions, and the Chromium homepage QA workflow.

Checks must actually run and pass before merge. Do not treat the existence of tests or this document as evidence of a successful run. Production remains unchanged until the pull request is reviewed and merged.
