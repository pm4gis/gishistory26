# Passage contribution, desktop reading width and Ngā Poutama video integration

Implemented 10 October 2026 in `pm4gis/gishistory26`. Preserve all 4,102 source content baseline files, original chapter text, relationships, existing timeline associations and the explicit no-person-profile-imagery requirement.

## Reader contribution

Updated 11 October 2026: the Gmail-specific compose redirect and links have been replaced with a provider-neutral contribution page at `/contribute/`. The main navigation, About page and passage-level links all lead to that page. Passage links retain the original chapter, passage and permanent passage URL in validated query parameters, which are inserted in the prepared message.

The page provides four questions, a copy-complete-message button, an optional `mailto:` link using the visitor's configured email application, a copy-address button and a selectable message preview. It never redirects to Gmail, assumes an email provider, sends a message, stores personal data or claims that opening a draft sends an email. The copy option is the primary option for users without a configured default mail application; the visitor pastes the message into any email service and chooses to send it. The intended recipient is `pm4gis@gmail.com`.

Helper: `src/lib/passage-contributions.mjs`; page: `src/pages/contribute/index.astro`; regression tests: `tests/passage-contributions-wananga.test.mjs` and `tests/home-navigation.test.mjs`.

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

Run `npm ci`, `npm test`, `npm run build` and the existing automated quality suite. Verify the canonical passage URL in the on-site draft and mailto body, copy-to-clipboard and manual-copy fallback, no automatic redirect, no claim of delivery and no person profile image additions. Visually check wide desktop and mobile reader widths, source disclosures, video thumbnail rendering and keyboard navigation. Record the published GitHub PR merge SHA and exact matching Cloudflare production deployment only after they succeed.
