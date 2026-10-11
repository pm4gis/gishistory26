# Documentary imagery expansion, publication review

11 October 2026. Candidate PR #47 on `media/documentary-100-20261011`. Base repository: `pm4gis/gishistory26`.

## Acquired and retained

- Original broad Commons download: **86 verified source files** (Wikimedia Commons originals, individual reuse metadata, SHA-256 and locally generated uncropped WebP renditions). Automated run 38117947385 succeeded.
- Editorial quality check removed **7 images** that were fictitious maps, unrelated to historical geospatial work, vaguely identified or wrongly classified as original satellite observations.
- Targeted recovery downloaded **11 additional verified originals**: Palmerston North mapping (1942), Rangiriri and Paetai (c.1863), 2021 Gisborne USGS ShakeMap, Auckland Landsat mapping, Landsat imagery of Whakahau and Whakaari, Ashburton and Beaumont aerials, Duders Beach aerial imagery, a Southland Crown grant sheet and a historic Campbell Island map. The Auckland Islands archive map was withheld following Wikimedia HTTP 429; it was **not** counted or registered.
- Final **wave-6 publication collection: 90 images**, embedded within the relevant chapters through the existing in-story placement function and individually served with full attribution and licence pages.
- Independently merged compatible batches: **12 Retrolens aerial photos** in PR #43 and **4 NASA/USGS satellite observations** in PR #45. Across all three batches there are **106 additional images**. The initial public register had 75 images, giving an expected 181 after publication if no concurrent changes affected that collection. Actual post-merge counts must be checked.

The files retain the original Commons/NASA/USGS source bytes and separately stored, uncropped display and card derivatives. The metadata explains where a picture is contextual rather than a photograph or screenshot of the specific early New Zealand GIS system. Existing protected passages, anchors, pre-existing image records and article text remain unchanged.

## Publication checks

1. Read `docs/media/documentary-image-wave6-result-20261011.json` and `docs/media/documentary-wave6-curation-result-20261011.json`; reconcile source titles, hashes, actual local asset paths and the final **90** wave-six records. Verify the seven explicitly rejected originals are absent.
2. Check all new `/images/<slug>/` pages, links, credits, licences and the article placements. Read examples from the early cartographic history, cadastral history, aerial imagery, satellite observation and hazards chapters. Verify images are dispersed alongside relevant paragraphs, not placed as detached galleries.
3. Run `npm ci`, `npm test`, `npm run build`, editorial preservation checks, and browser/Cloudflare preview QA. Any failed check blocks a merge. Preserve the protected baseline of 4,102 historical content files.
4. Merge only the verified reviewed candidate; confirm Cloudflare production deployment and representative routes at `history.pm4gis.nz`.

## Source boundaries

The collection uses Wikimedia Commons file-specific licences and rights rather than assuming every image on Wikipedia or in an online archive is freely reusable. The dated LINZ/Retrolens source collection and NASA/USGS original observations are maintained separately. NZHistory, National Library and council archive references whose individual images lack demonstrated reuse permission were not copied. All new images represent subjects dated by 31 December 2025 or original paper maps in explicitly old historical map categories. An unspecified exact year is not supplied by inference.
