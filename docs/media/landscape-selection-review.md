# Landscape imagery selection and rights review

Prepared 10 October 2026. Processing package: `NZ_GIS_History_Landscape_Web_Assets_2026-10-10.zip`, from the owner-supplied [4k Wallpapers Drive folder](https://drive.google.com/drive/folders/1gtvCBXWmdpSU4BE5ERaK0JwyQuFQhzaJ). Sources are **not in this repository**. This document is a candidate-placement record, not permission to publish.

## Inventory and preliminary selection

The source processing package contains 162 PNG source records and 648 verified WebP derivatives (card 768 px, feature 1440 px, softened background 1600 px, hero 2560 px). The originals total 2,055,034,071 bytes and the derivatives 123,466,918 bytes. Every source image has a Drive folder reference and a SHA-256 checksum in the package's manifest. One duplicate pair is `north2024-layout` and `north2024-wairarapa`. The QA report flags 22 images for closer review. Do not deploy all 648 derivatives indiscriminately.

The following five source images were inspected individually at reduced resolution. Their original framing, coordinate labels, source-credit labels and any blank corners should be preserved.

| Source ID | Provisional use | Observed subject | Visual QA | Attribution status |
| --- | --- | --- | --- | --- |
| `north2024-whangarei2` | Homepage hero, alternative northern landscape feature | Green farmland, drains, river meanders and wetlands in an oblique aerial-style composition | No mechanical flag | Pending |
| `porirua-porirua1` | Urban GIS feature, not a generic rural hero | Urban coast, road interchange, commercial buildings and hills | No mechanical flag | Pending |
| `waikato-12` | Coastal geography feature only after geographic confirmation | Forested island surrounded by water, with smaller nearby islets | No mechanical flag; source appears to place the image at approximately 175.4 E, 36.74 S, **outside Waikato** despite its source folder | Pending |
| `tasman-14` | Topography/environment theme background | Steep densely vegetated hills with tracks and varied canopy | Large-source (10,667 px) quality review; visible source-area white patch | Pending |
| `otago-24` | Coastal landscape or regional mapping feature | Grassy coastline, rocky headlands, small beaches and sea | Possible blank-white corner in original | Pending |

These are layout suggestions, not geographic identifications or associations with the historical subject of a chapter. Do not caption a chapter image as a historical scene without independent evidence. Other library images can be assessed against actual article and theme names later.

## Permission and source findings

A source-folder name, position coordinate, screenshot credit or the phrase “LINZ imagery” is insufficient to establish the exact underlying imagery survey or the licensor. The user-supplied PNGs visibly have coordinate overlays and source credits; these establish the nature of the wallpaper, not a specific capture year. The `north2024` folder name does not mean the underlying photography was captured in 2024.

Authoritative references:

- [LINZ aerial/elevation imagery attribution](https://www.linz.govt.nz/products-services/data/licensing-and-using-data/attributing-elevation-or-aerial-imagery-data): LINZ does not necessarily own the aerial imagery copyright; name the actual licensor.
- [LINZ Basemaps attribution](https://www.linz.govt.nz/products-services/data/licensing-and-using-data/attributing-linz-basemaps-data): the aerial basemap contains different sources, including satellite imagery.
- [NZ Imagery Survey Index](https://data.linz.govt.nz/layer/95677-nz-imagery-survey-index/): survey metadata is the appropriate starting point for dates, provider and extent.
- [LINZ public imagery registry](https://github.com/linz/imagery): STAC collections help establish the exact collection and its licensing.

Every candidate needs the collection/layer URL, licensor, reuse licence, original source credit, capture date where established, screenshot source type, approval evidence URL and a visual crop decision. An approximate spatial match alone does not prove a screenshot's underlying collection. Record “unverified” until a specific match is supported.

## Repository implementation

`LandscapeImage.astro` is attached to the homepage and individual theme pages. It renders an image only when `src/data/landscape-images.json` includes an approved entry for that exact placement. The initial approved array is empty, leaving the existing publication visually and semantically unchanged. When approved, the component uses responsive WebP srcsets, intrinsic sizes, appropriate lazy or priority loading, and a visible credit with source and licence links. It uses the site's existing text and background variables across all four palettes.

`scripts/verify-landscapes.mjs` runs during `npm run validate`, and the tests cover missing authorisation and altered image hashes. The verifier rejects unregistered public assets, missing licences and wrong checksums. `scripts/install-landscapes.mjs` accepts the processing manifest and a *separate explicitly approved* selections file, verifies the source hashes, and defaults to a dry run. Only `--apply` stages publication assets and updates the approved registry. The processing package stays outside the public repository.

Example approval-file shape (the following is intentionally incomplete and must never be used to authorise publication):

```json
{
  "images": [
    {
      "sourceId": "north2024-whangarei2",
      "placement": "home-hero",
      "rightsStatus": "pending",
      "sourceLayerUrl": "",
      "licensor": "",
      "licenceUrl": "",
      "evidenceUrl": "",
      "attribution": "",
      "altText": "Aerial view of green farmland and winding waterways",
      "verifiedBy": "",
      "verifiedOn": ""
    }
  ]
}
```

## Completion gates

1. Resolve exact imagery collection and source ownership independently for the shortlist, including source capture dates and any third-party imagery providers.
2. Decide whether source labels in the corner interfere with hero placement. Never crop off a source credit or coordinate information without a separately retained provenance record and an approved crop.
3. Produce explicit reviewed approvals, rerun the installer and the full build, and check mobile/desktop crops, all palettes, visual contrast, image-source links, accessibility and loading behaviour.
4. Merge only after all checks. Do not publish pending files, raw originals or the complete private research package.

No production deployment or live-domain change forms part of this draft.
