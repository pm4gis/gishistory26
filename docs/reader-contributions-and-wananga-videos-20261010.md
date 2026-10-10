# Passage contribution, desktop reading width and Ngā Poutama video integration

Implemented 10 October 2026 in `pm4gis/gishistory26`. Preserve all 4,102 source content baseline files, original chapter text, relationships, existing timeline associations and the explicit no-person-profile-imagery requirement.

## Reader contribution

The Svelte reader now puts **Contribute** alongside **Link to passage** and **Copy link** for every published passage in both complete-chapter and page-by-page modes. The anchor has a genuine `mailto:` target and opens the visitor's own mail client; it does **not** send mail or store a submission.

The subject includes the passage title. The email body includes the chapter, exact original passage title, permanent production permalink (`https://history.pm4gis.nz/stories/<slug>/#<passage-slug>`) and the following requested information: what should be added/corrected; contributor's involvement; dates, sources and documentary evidence; attribution preference; permission for shared materials and a warning against submitting restricted iwi or personal information.

Recipient `duane.wilkins@gmail.com` is the contact LINZ publicly names for Duane Wilkins in its geospatial capability contacts at `https://www.linz.govt.nz/our-work/location-information/geospatial-capability/geospatial-capability-committee`. This is a direct email-draft facility, separate from the earlier authenticated `contribute.pm4gis.nz` workflow; the current rebuild previously had neither an active top-level contribution entry nor a mailto button. It does not claim the old site's Google authentication has been preserved.

Helper: `src/lib/passage-contributions.mjs`; regression tests: `tests/passage-contributions-wananga.test.mjs`.

## Desktop reader width

Before: a fixed middle column up to 760px and a 68-character narrative measure. Now large desktop screens at or above 1400px use a central content column up to 1100px, with a 94-character maximum narrative measure; the left/right panels remain present. Medium desktop and laptop screens have a fluid two-column main layout, while the existing mobile one-column reader remains unchanged. Increase to 1920px shell maximum only at wide desktop sizes; chapter title and documentary banners follow the wider content.

## Ngā Poutama recorded material

The authoritative, continuing recordings index is LINZ's official playlist:
`https://www.youtube.com/playlist?list=PLyE56PxGCqSXGUtFIvpNn0b_SauF4XfIk`. Linked individual recordings are:

1. `https://www.youtube.com/watch?v=yCBeRHA2Jnk`, *Ngā Poutama Matawhenua: a conversation*, published by Duane Wilkins on 14 April 2021. Published description explicitly identifies Duane Wilkins (LINZ), Roland Pomana (Journey GIS) and Matt Grose (DOC).
2. `https://www.youtube.com/watch?v=Fqq3Fzi5djc`, *He Kete Mātauranga: Bringing Whenua Stories to Life*, published by LINZ 2 July 2025. The 13 June 2025 presentation is credited to **Keith Holswich**, discussing Ngāti Rāhiri's community GIS and whenua records. LINZ's 16 July 2025 Te Pokapū newsletter links to this exact recording.
3. `https://www.youtube.com/watch?v=KYEVxcBEVQ8`, *Mapping sites of significance to iwi and Māori using GIS mapping tools*, published Ngā Poutama recording confirmed through the video title and MāoriGIS.nz video index. The individual presenter's name/date were not independently checked, so no such claim is made.
4. `https://www.youtube.com/watch?v=hCAVoBwRJwE`, *Utilising key datasets for Māori climate resilience and whenua protection*, confirmed Ngā Poutama recording. Individual presenter/date not independently established.

LINZ's Geospatial Capability Committee explicitly lists Duane Wilkins as a geospatial consultant for this programme, and its 2020/21 Annual Report independently describes his GIS facilitation work at Whangārei. He is therefore accurately credited for his documented **series facilitator role**, without attributing the delivery or authorship of every recording to him.

The gallery is available on `/entities/nga-poutama-matawhenua/`, `/themes/maori-gis/` and the relevant chapter reading views `/stories/becoming-a-gis-professional/` and `/stories/the-map-becomes-an-application/`.

Video thumbnails are **hotlinked from YouTube** via `https://i.ytimg.com/vi/<verified-id>/hqdefault.jpg`, used solely as clickable video link previews. The repository does not download, copy, alter, own or claim rights over these thumbnail files, nor does it rehost video footage. The gallery contains direct source links, dates where verified, named speakers where verified, contextual captions and the complete official LINZ playlist for additional recordings.

Project files: `src/lib/nga-poutama-videos.mjs`, `src/components/WanangaVideos.svelte`, the existing story/theme/profile templates, `src/styles/site.css`.

## Validation and preservation

Run `npm ci`, `npm test`, `npm run build` and the existing automated quality suite. Verify the canonical passage URL in the new mailto body, browser opens email app, disabled network/offline email client behaviour does not claim delivery, and no person profile image additions. Visually check wide desktop and mobile reader widths, source disclosures, video thumbnail rendering and keyboard navigation. Record the published GitHub PR merge SHA and exact matching Cloudflare production deployment only after they succeed.
