# Timeline documentary image source decisions, wave 4

Prepared 10 October 2026 for `pm4gis/gishistory26`. This records verified source identity, publication conditions, distinctions between editions and the remaining documentary gaps. The complete per-event coverage CSV is produced by `scripts/audit-timeline-image-coverage.mjs`.

## First NZMS 1 sheet, N134 (1939)

The National Library's *Topographical mapping* exhibition explicitly identifies the first published NZMS 1 sheet as *Napier and Hastings*, N134, 1939, drawn by A. J. Reid, with National Library reference `MapColl 830cba/1939-/15175`. The exhibition describes compilation from survey data and aerial photographs, with 100-foot contours. Primary exhibition page: https://natlib.govt.nz/exhibitions/unfolding-the-map/topographical-mapping .

The National Library catalogues a digitised **1943 revision of the same NZMS 1 N134 sheet**, in its item record at https://natlib.govt.nz/records/23363272 and digitised delivery at https://ndhadeliver.natlib.govt.nz/delivery/DeliveryManagerServlet?dps_pid=IE11970572 . Its record gives the reuse wording: **“Sourced from LINZ. Crown Copyright reserved.”** and permits redistribution of that specific digital image. Its catalogue states “Previous ed.: 1939”; it must never be described as a scan of the 1939 first edition.

The Te Ara page https://teara.govt.nz/en/zoomify/18907/first-topographical-map-of-hawkes-bay describes a visual of the original 1939 map, but also warns that published reproduction may need clearance. MapsPast's 1939 snapshot is **NZMS 13**, not the NZMS 1 N134 sheet, and should not be mistaken for this event: https://mapspast.org.nz/basemap/15 .

A usable, verified 1939 source image binary has **not** been recovered. Automated extraction of the National Library pages was blocked by the site's access challenge; the 1943 revision's original TIFF has not been obtained. Preserve the source record and link on the event panel. The current 1955 NZMS 13 map remains labelled a contextual illustration and will be replaced when a verified N134 source image becomes available. Do not hotlink an unverified external thumbnail or mislabel another series as N134.

## Original Cyclone Gabrielle images

Two exact-subject satellite images were identified in the Wikimedia Commons archive, with individual primary image records and file-level reuse conditions. Originals and derived WebPs are acquired and verified by `scripts/download-timeline-images-wave4.mjs` in a GitHub Actions run. The asset records, binary checksums and acquisition report control publication; if the acquisition run fails, keep image associations unpublished until the assets exist.

* `gabrielle-sentinel-flooding-napier-2023`: Pierre Markuse, processed Copernicus Sentinel data [2023], flood-extent visualisation near Napier, published 15 February 2023. Commons file: https://commons.wikimedia.org/wiki/File:Flooding_caused_by_Cyclone_Gabrielle_near_Napier,_New_Zealand_-_14_February_2023_(52690129056).jpg . Stated licence CC BY 2.0, with required creator and Sentinel-data credit.
* `gabrielle-nasa-modis-2023`: NASA Aqua MODIS / EOSDIS Worldview, subtropical Cyclone Gabrielle approaching the North Island on 13 February 2023. Commons file: https://commons.wikimedia.org/wiki/File:Gabrielle_2023-02-13_0230Z.jpg . Commons identifies the U.S. Government source as public domain.

These images directly record the weather and flooding context of the `2023-nzta-gabrielle` event. Neither is a screenshot or proof of the NZTA enterprise ArcGIS platform or its operational effectiveness. Captions and display attribution retain that distinction.

## Publication and further work

The new event-to-image associations reuse existing locally registered originals and lightweight card derivatives. They include individual, specific accuracy notes and link to the existing image archive, where the source, creator and licence remain available without cluttering the timeline buttons. All other event IDs, chapter text, sources, relationships and image records are preserved.

Additional source material should be sought first for 1977 MAPPAK, NZLRI/NZMS 290, original ARC/INFO New Zealand screens, early Landonline, DOCgis, LRIS Portal and S-map. Verify original screenshots or photographs rather than using unrelated maps as though they depict the software or events. Large originals that exceed Cloudflare's single-file limit must be preserved in an appropriate archival store and linked with provenanced derivatives, not silently omitted or compressed as substitutes for the originals.
