# Google Earth and Street View editorial review – 13 October 2026

Base production commit: `7a3eb2482059db97980e5a10b06c7f90fbfcb058`. Reviewed patch branch: `research/google-earth-street-view-nz-20261013`.

The evidence-checked patch adds six new source-linked paragraphs to three existing passages of Chapter 31 without rewriting or deleting any original block, ID, image association or source. It adds six dated, cited timeline entries and updates their entries in the SHA-256 preservation manifest. The original existing paragraph IDs are recorded below to check that they remain in order.

- `src/content/passages/chapter-31-p008.json` (61ce25cb9df1b2f2fdc42809df310c155e144bb717d2a9f1db9815eddba86550): ch31-s08-p01, ch31-s08-p02, ch31-s08-p03
- `src/content/passages/chapter-31-p010.json` (f7d76701ad10f712795cbe0a11b48ba2e7da75debcd97994bc7a0b36b4fd8bea): ch31-s10-p01, ch31-s10-p02, ch31-s10-p03, ch31-p-5bf84846a4e0
- `src/content/passages/chapter-31-p014.json` (82c9bf8c937c9b5d06dafbc836137f75bdd8947920a3ac31eb9bedba6d9986ef): ch31-s14-p01, ch31-s14-p02, ch31-s14-p03, ch31-p-866f04464cdb

New paragraph IDs: `research-nz-street-view-launch-2008`, `research-nz-street-view-privacy-2010`, `research-nz-christchurch-historical-street-view-2014`, `research-canterbury-cordon-kml-google-earth-2011`, `research-google-earth-outreach-nz-2012`, `research-lower-hutt-map-my-waahi-2019`.

New event IDs: `2008-google-street-view-new-zealand`, `2010-google-street-view-wifi-privacy`, `2011-canterbury-cordon-google-earth-kml`, `2012-google-earth-outreach-aotearoa`, `2014-historical-street-view-christchurch`, `2019-map-my-waahi-google-earth-lower-hutt`.

Sources were read from Google's official New Zealand or Australia publications, the Office of the Privacy Commissioner, DPMC's archived CERA data listing, LINZ and LEARNZ. The December 2008 Street View release is distinct from the December 2007 launch of localised Google Maps. The 2010 Privacy Commissioner inquiry concerned Wi-Fi data recorded during Street View photography. The Christchurch CERA KML listing has a 22 February 2011 dataset date, but its original publication date is unproven, so the timeline event is year-precision. The 2019 Map My Wāhi Google Earth interview and Lower Hutt community-history video are separate items within one programme; ArcGIS StoryMaps was demonstrated separately.

No Street View image has been copied or attached without a source-level media review. The undated Google Earth/Lower Hutt video alluded to in the research brief has not been independently identified beyond the documented 2019 LEARNZ examples. No previously accepted event or passage was removed. Tests, Pagefind generation, source preservation and Cloudflare preview remain required before merge.

## DOC Great Walks continuation, 13 October 2026

Editorial extension on the same PR branch after source checking. Source files are DOC 2014 Annual Report, p. 76; Google's dated 18 August 2013 Trekker announcement and 4 November 2015 Street View announcement; and DOC's 6 November 2015 launch report. Exactly two new Chapter 31 paragraphs were inserted: `research-google-trekker-great-walks-capture-2013` ahead of the previously proposed 2014 Christchurch block, and `research-google-doc-seven-great-walks-street-view-2015` at the end. No original Chapter 31 paragraph was altered or removed. Added timeline records `2013-doc-google-street-view-trekker-great-walks` (day precision) and `2015-doc-google-seven-great-walks-street-view` (month precision). The latter avoids claiming one indisputable calendar date where Google's blog and DOC's launch account differ. Both events refer to the real DOC entity. Preservation SHA-256 values for the amended passage and two new events are registered. Historical photos remain source candidates and were not added as file assets.
