# NZ GIS History: comparative interface and usability review
23 October 2026 | Proposed redesign only | Baseline `main` `3a33cab599405acbefcd922bd94f4724fe458a27`

## Executive assessment

The site already contains a substantial historical publication: at the time of the live homepage rendering, **44 chapters, 884 people and 262 events** were linked from the front page. It has a differentiated reader, source-linked images, period selection, a full-width PDF viewer, faceted archives, multiple colour palettes, and an accessible HTML fallback for chronology. Its problem is not the absence of features but the lack of a consistently **reader-led editorial hierarchy** across an unusually rich research collection. The website sometimes looks like a collection of equally prominent application panels rather than a publication with a clear central story and progressively available tools.

**Recommendation: editorial atlas, not a dashboard or another boxed portal.** Preserve the approved image-led homepage, full-width historical images, direct top-level destinations, dark Slate Blue identity and 2025 cutoff. Improve the distinctions between (a) read a history, (b) explore evidence, and (c) find a person/place/organisation. Make the historical content the first-class object; push machine/build metadata and less-used controls into appropriate secondary areas. Use authentic NZ maps, aerial imagery, scans and equipment photography. Do not adopt generic stock graphics.

### Method and limitations

- **LIVE**: rendered production homepage, timeline, Publications index and Chapter 1 through Cloudflare Browser Rendering on 23 October 2026; primary generic web fetch returned an access error. The homepage reports **44 chapters, 884 people, 262 events, 9,843 build files and 69,744 internal links**; the timeline covers 1900–2025 with 262 events; the Publications list contains **145 items** with **73 author/organisation filter entries**, and Chapter 1 contains nine titled sections and a contextual `Timeline & related · 19` control. Initial parallel capture attempts received Cloudflare **HTTP 429**; later individual requests succeeded. Remaining routes were reviewed from source, not live browser interaction.
- **CODE**: inspected repository `AGENTS.md`, `docs/delivery-plan.md`, `docs/architecture.md`, `docs/migration-status.md`, `docs/appearance-system-2026-10-12.md`, `docs/verification/approved-homepage-20261020.md`, and the current homepage, browse, timeline, reader, publications, navigation and style source. These observations concern source behaviour, not proof of how the UI looks or performs on every device.
- **REFERENCE**: inspected actual publicly reachable pages or provider-authored documentation for the comparison sites below.
- **PROPOSED**: hypotheses that still need independent user testing, a real browser journey and visual screenshots before promotion to verified defects.
- **Independent-agent limitation**: the current ChatGPT connector environment offers no genuine subagent launcher. This report therefore contains **10 separately structured specialist review lenses conducted by one assistant**, not ten independently executed agents. No user interviews, separate-agent feedback, usability metrics, physical-device testing or Lighthouse runs are claimed.
- Automated repo browser and accessibility suites passed on relevant prior approved PRs. That is previous regression evidence, not fresh independent sign-off of this review.

## Additional live reading observations

- The [Chapter 1 reader](https://history.pm4gis.nz/stories/what-the-computer-inherited/) renders complete historical prose and nine source-grounded passage links under `In this chapter`, with page-by-page/full-chapter, A−/A+ and bookmark controls. It also shows `Timeline & related · 19`, theme links, inline source documents and contextual archival notes. The manuscript is already rich; a redesign should **reduce competition around the narrative**, not replace its prose or add more surrounding panels.
- The [Publications index](https://history.pm4gis.nz/publications/) renders 145 original-entry cards in chronological order, with a single left filter panel for decade, theme and 73 author/organisation values. The volume of long author labels is the clearest user-facing reason to test a `Organisation or series` grouping. The first item is the original 1973 New Zealand Map Grid technical circular, so the displayed `1973–2025` range is presently correct but fragile when the collection grows backward.
- The [Timeline](https://history.pm4gis.nz/timeline/) renders decade controls including the empty 1910s and 1950s. Preserve truthful gaps as a visual historical fact, but do not style them like productive filters.
- The homepage's three content statistics are useful cross-links; its two build statistics are engineering telemetry rather than reading aids. The revised mockup proposes moving them into maintenance reporting.

## Ten specialist review lenses

### 1. Comparable-site research
DigitalNZ and Europeana give users category-based starting points before presenting a large catalogue; Papers Past treats the document's native hierarchy as the way in; NZHistory uses topical feature stories. The practical improvement here is to use *three starting intents* (Read, Explore, Research) with real destinations on the homepage and chapter catalogue, **without** removing existing direct global menu links. Preserve the current image-first presentation rather than replacing it with rectangular category tiles.

### 2. First-visit UX
The homepage answers what the website is about, but the five equal-weight statistics mix visitor-interest content with build implementation measurements. `9,843 files` and `69,744 internal links` do not describe historical holdings meaningfully. Existing chapter samples jump from 1 to 8, 16, 24, 32, 44; they create breadth but give no guided route for someone unfamiliar with GIS. Introduce a short `Start here` reading sequence and three thematic entry points, while retaining all 44 linked chapter headings.

### 3. Information architecture
The site correctly preserves direct links for Chapters, Timeline, People, Organisations, Themes, Datasets, Connections, Publications, Search, About and Contribute. At the `min-width:1181px` desktop breakpoint the CSS compresses menu label size to around 12–15px and keeps every destination in a single line. **Hypothesis:** this will need careful focus, spacing, and 200% zoom testing. Keep direct routes but visually differentiate reading, research, and site controls. Use consistent contextual breadcrumbs and `on this page` outlines on detail pages, not an unapproved replacement `Explore` submenu.

### 4. Visual and editorial design
The wallpaper photography, Tuki map, Intergraph workstation and Atene aerial interlude already provide a distinctive foundation. `site.css` also applies blurred, partially transparent styling to `.page` and many dense text surfaces. The same translucent material treatment across archive cards and long-form text risks a visual sameness; retain glazing in navigation, hero and peripheral panels, but prefer **solid readable text surfaces** and more generous typographic hierarchy for chapters. Standardise image captions, original-year labels and links to authentic image records.

### 5. GIS practitioner and historian
The 44-chapter chronological book and 262-event timeline are meaningful. The homepage jumps from historic maps to computing and then recent imagery; early-career visitors could benefit from a short illustrated path through **survey and coordinates → early digitising and GIS → national datasets and enterprise systems → web/open GIS → 2025**. This is a navigation and explanation layer only, not a change to the accepted historical record. Use source-linked examples of NZMG, NZTM, LUC, DCDB and Landonline only where already documented.

### 6. Māori GIS and cultural context
The content should help users reach Māori GIS narratives, iwi/hapū mapping and land-information history without presuming a single Māori perspective or exposing restricted mātauranga or contributor details. Propose a clearly labelled **Māori GIS and whenua mapping** thematic route linking accepted public chapters and data. Validate terminology and representation with appropriate subject experts/knowledge holders before making editorial changes. This lens is an audit hypothesis, **not** cultural endorsement or consultation.

### 7. Archive and publications
`src/pages/publications/index.astro` builds a chronology from a joined source register and offers single-select decade/theme/author filters, mobile disclosure and viewer-return state. The rendered current collection contains **145 publications** and an author/organisation disclosure holding **73 unique filter labels**, including extremely long multi-author strings. This is genuine archive density, even when the panel is collapsed. Cards cap summaries at two lines and display only a year, which is good. The opening toolbar literally displays `1973–2025` rather than deriving the range from available records; the `Read PDF:` screen-reader label is redundant in a PDF-only collection. Prefer collection grouping by meaningful type (technical reports, professional periodicals, maps, proceedings) *when the metadata supports it*, with a compact, readable list-mode option alongside covers. Preserve the **locally hosted originals and full-width browser viewer**. Do not add external-only source entries to the public document catalogue. Resolve pending DOC relevance issues separately, not through interface design.

### 8. Mobile and accessibility
The code includes a 44px mobile publication filter target, keyboard-controlled inline record buttons, reduced-motion handling, a no-JavaScript timeline list, five accessible palette pairs and text-size controls. These are strengths. Test 320/390px reading order, the open mobile menu against large full-width banners, sticky headings, dialog escape/focus return, enlarged text at 200–400%, WCAG 2.2 AA focus appearance/obscuring, and low-contrast image captions. Do not claim violations without measured browser evidence. The publication reader's desktop full-screen button is hidden on phones but the local PDF 'Open document' link remains.

### 9. Front-end engineering
The Astro static generation and Svelte reader/timeline islands are sensible. `src/components/Timeline.svelte` constructs markers and density rows from all 262 events, and `src/pages/timeline/index.astro` presents the full event list as a collapsed `<details>`. Prioritise progressive disclosure and movement from decade to selected event, not a wholesale framework rewrite. Capture field Web Vitals, build size and CPU/memory on low-end phones before assuming performance regressions. Avoid adding 3D or an always-running network canvas to the homepage. Keep URL-state filters and chapter deep links.

### 10. Adversarial QA review
Do **not** replace the direct global navigation with a dropdown hierarchy: it was deliberately restored. Do **not** treat glassmorphism or photographs as an excuse to reduce text contrast. Do **not** add unsupported timelines, maps or portraits. Do **not** create new essays for every person or launch another massive interface rewrite in one PR. Treat design hypotheses as proposals until a verified browser/participant study and a preservation-safe implementation test prove they help.

## Comparable websites and transferability

These are genuine public examples checked on 23 October 2026 through site pages or provider-authored references, **not** a scored live speed contest. Every recommendation is a selective adaptation.

| Site and reference | Documented useful pattern | Applicability | Avoid |
| --- | --- | --- | --- |
| [DigitalNZ Explore](https://digitalnz.org/explore); [search help](https://digitalnz.org/help/how-to-search-digitalnz) | Search, date range, media facets, featured record and alternate tile/list results | Facets, meaningful routes, optional compact archive list | Huge open-ended facets on the history homepage |
| [Papers Past](https://paperspast.natlib.govt.nz/help/navigating-papers-past) | Title→issue→page→article browsing, breadcrumbs and tailored date controls | Publication series and evidence hierarchy | Newspaper-specific dense filters everywhere |
| [Te Ara](https://teara.govt.nz/en/te-ara-a-history) | Short/full stories, chapter-level contents, coherent media alongside text | Chapter overview and reading progress | Treating GIS history as an alphabetical encyclopedia |
| [NZHistory](https://nzhistory.govt.nz/) | Editorially featured narratives and clear subject paths | Strong themed narrative entry points | Indiscriminate topical tile accumulation |
| [Europeana](https://www.europeana.eu/en/collections) | Browse by theme, topic, century and institution | A small number of stable collection dimensions | Making all dimensions top navigation |
| [David Rumsey Historical Map Collection](https://www.davidrumsey.com/view.html) | High-resolution maps, What/Where/Who/When browse, georeferenced overlays | Image detail, source-first map comparison | Installing an elaborate viewer with little genuine georeferenced NZ content |
| [National Library of Scotland maps](https://maps.nls.uk/geo/explore/side-by-side/); [help](https://mapseries-tilesets.s3.amazonaws.com/maps/explore/help.html) | Side-by-side original/modern map comparison, date/scale filters and shareable map state | A future *opt-in* source-linked historic map feature | Treating it as essential to reading the publication |
| [OldMapsOnline NZ](https://www.oldmapsonline.org/en/New_Zealand) | Place-centred historical map discovery and time browse | NZ place-linked material if grounded coordinates exist | Automatically geolocating events without source evidence |
| [Smithsonian Collections Search](https://collections.si.edu/search/) | Collection highlights, subject browsing and object-level records | Stronger person/organisation/image detail templates | Large global object taxonomies |
| [Trove](https://trove.nla.gov.au/); [NLA search guidance](https://www.library.gov.au/learn/adults/lifelong-learning/introduction-trove-searching) | Search results refined by format, place, title and date | Researcher-facing search filters | Requiring a technical query to start reading |
| [Allmaps Viewer](https://viewer.allmaps.org/) | Explicit georeferenced IIIF source maps and visible modern-map context | A future experiment with properly licensed/mapped sources | Assuming normal scanned PDFs can automatically act as georeferenced layers |

## Ranked improvement register

`P0` = blocking confirmed failure, `P1` = high-value change, `P2` = worthwhile enhancement, `P3` = investigate later. None of the work here establishes a new P0.

| ID | Priority | Observed evidence or bounded hypothesis | Exact proposed change | Acceptance |
| --- | --- | --- | --- | --- |
| UX-01 | **P1** | LIVE and CODE: homepage shows build files and internal-link counts next to chapter/people/event counts | Move the two build diagnostics to a private/release QA page; use `Publications` and `Historical images` counts **only if dynamically computed and accurate**, or leave three useful counts | No implementation metrics in public hero; every displayed number has a verified user-oriented destination |
| UX-02 | **P1** | LIVE/CODE: homepage has no short guided route through 44 chapters, only six spaced samples | Add a visually composed `Where to begin` strip/paragraph with three reliable narrative routes and actual chapter links below first editorial feature | First-time reader can choose `Read from start`, `Explore by period`, or `Find evidence` in one interaction |
| UX-03 | **P1 / test** | CODE: 11 direct links compressed in desktop nav for widths >=1181px | Retain destinations; test responsive overflow, 200% zoom, focus visibility; improve grouping/spacing and accessible text where measured | No overlap, clipping, or focus loss at 1181, 1280, 1440 and 200–400% zoom |
| UX-04 | **P1** | CODE: translucent `.page` reading surface has backdrop blur | Separate solid chapter reading surfaces from blurred hero/peripheral surfaces | Text clarity/contrast unchanged or improved in all 10 theme modes; reduced transparency honoured |
| UX-05 | **P1** | CODE: publication catalogue hardcodes `1973–2025`; source collection changes frequently | Derive oldest/latest document dates from publication records and avoid a hardcoded label | Correct title and current filtered count for any valid catalogue |
| UX-06 | **P2** | LIVE timeline: 1910s and 1950s both show `0 events` | Present empty decades as a subdued chronology context, not as actionable pills; offer straightforward 5-year drill-down where there are events | No zero-result decade framed as an enticing selectable result, while timeline remains chronologically truthful |
| UX-07 | **P2** | CODE: timeline full text fallback lives inside collapsed details | Keep accessible fallback but expose a compact, readable list view toggle close to the graphical timeline | On keyboard and low-motion view, dates and event links require no awkward long zooming |
| UX-08 | **P2** | CODE: PDF cards all use fixed covers, reader supports previous/next | Offer a compact list mode with title/creator/year/one-line subject, preserving cover grid as default | User can inspect far more titles per screen, with same URL/filter/share state |
| UX-09 | **P2 / research** | LIVE: 145 publications and 73 author/organisation labels (some extensive multi-author names), while browsing records has five organisational classes | Show count per creator and test long labels; evaluate useful `series/organisation` grouping after checking metadata quality | No invented categories; filter state remains shareable |
| UX-10 | **P2** | CODE: PDF card aria label literally says `Read PDF` for every item | Use `Read publication: [title]`, inspect screen-reader output; preserve visual title | Screen reader announces distinct useful document titles |
| UX-11 | **P2** | CODE: Reader has a chapter list and related timeline, but reading text gets equal glass treatment | Prioritise text column and image captions; make secondary timeline contextual and keep citation/source links discoverable | Content, passage IDs, article anchors and link targets preserved |
| UX-12 | **P2 / editorial** | LIVE: site documents Māori GIS among hundreds of people and themes, but a clear reading entry point is not evident on landing | Add one source-checked thematic route, after appropriate editorial consultation | Links only to already accepted public material; no private data or presumed authority |
| UX-13 | **P3 / measured** | CODE: 27-second three-image hero crossfade and multiple large photograph areas | Measure LCP/INP/CLS, reduced-motion result, data usage and image decode before optimising | Meet field CWV guidelines at p75, or document representative lab measurements |
| UX-14 | **P3 / future** | COMPARATIVE: high-resolution original maps can support geographic comparison | Prototype **one** verifiably georeferenced NZ historical map in an optional viewer | Original image, coordinates, credits and evidence verifiable; no fake basemaps |
| UX-15 | **P2 / editorial gate** | Original-page DOC review found incidental GIS keyword matches in accepted material | Complete source relevance checks separately from this UI review | Only source-verified GIS/geospatial works remain in the public PDF collection |

## Conflicts and reconciliation

1. **Clean nav vs direct nav.** Keeping all 11 direct labels is a known owner decision. Improve typography and responsive behaviour first; no new `Explore` dropdown.
2. **Elegant glass vs a solid book.** Use glass on imagery, hero and side elements, but solid opaque prose/annotation surfaces. Both preferences can coexist.
3. **Beautiful map vs authentic source.** No synthetic map artwork. User-supplied wallpapers remain atmosphere and are identified as such; historical maps must link to their original evidence.
4. **Chronological book vs research database.** Support three explicit visitor tasks with cross-links, not three competing homepages.
5. **More visual dynamism vs speed/reduced motion.** Keep the existing calm three-image transition as the baseline. Do not add autoplay content panels or WebGL to the landing page.
6. **PDF archive breadth vs relevance.** A large public catalogue is useful only when titles genuinely document GIS; evidence review precedes volume claims.

## Proposed concept

A working **concept demonstrator**, not a website release, is provided at `public/design-concepts/review-20261023/index.html` on this review branch. It has three selectable example layouts: `Homepage`, `Chapter reader` and `Publications`. It uses the existing public Karikari wallpaper, Tuki map, Intergraph image and hosted PDF cover paths, with existing historical chapter/document titles and no new historical claims. The layouts are alternative **static interaction concepts** with responsive composition at desktop and mobile widths, not functional replacements for Pagefind, the real reader or source catalogue.

- **Homepage direction:** rich full-width landscape, dark blue header, plain visible destinations, warm off-white lower surfaces, a real Tuki map and editorial journey cards integrated into the page rather than many identical boxes. Remove build diagnostics.
- **Reader direction:** calm opaque high-contrast prose column, quiet chapter outline and a restrained contextual rail. Preserve existing headline, paragraph anchors, source/document links and inline records.
- **Publications direction:** left filters, comfortable list of actual report titles, cover thumbnails, immediate reader entry, visible count/year, next/previous local documents, minimal badges. The conceptual list view supplements the existing grid.

### Lightweight design system proposal

Use DM Sans (already installed), with normal system sans fallbacks; no serif. Stay within the existing Slate Blue/Coastal/Forest/Archive/Bubblegum semantic tokens. Editorial light surface defaults: warm neutral off-white for reading areas (`#F5F4F0` candidate), white paper panels, ink (`#15273B`), blue-grey secondary text; subject to a measured contrast audit in every palette. Allow larger lead titles (44–72px desktop) and 17–20px narrative type, responsive line-height 1.55–1.7 and a readable body measure of around 66–75 characters. Keep source captions compact and legible, use image aspect ratios without distortion, avoid fake gradients over historical artefacts.

## Independent testing required before implementation

1. Complete 10 task journeys on the current production and preview from a real browser: understand the site, begin a chapter, find a person, find an organisation, locate NZMG, filter a DOC publication, open/advance/return to a local PDF, choose a decade, navigate from an event to a chapter, and recover navigation on phone.
2. Capture real screenshots at **1440, 1280, 768, 390 and 320px** before and after. Include 200/400% zoom, no-JavaScript primary prose, keyboard-only navigation, reduced motion and an assistive technology pass.
3. Audit WCAG 2.2 AA focus visible/obscured, targets, reflow, contrast, names and roles. Reference: https://www.w3.org/WAI/WCAG22/quickref/.
4. Measure LCP, INP and CLS instead of guessing performance. Reference thresholds and method: https://web.dev/articles/vitals.
5. Recruit a few **real people** from first-time history readers, GIS practitioners, early-career researchers and Māori GIS audiences where suitable and consented. Do not treat synthetic personas as empirical user feedback. Record task outcome, breakdown point and observed behaviour, not demographic assumptions.
6. Run `npm ci`, `npm test`, `npm run build`, desktop/mobile Chromium suites, axe and content-preservation checks. Match the merged release commit to the actual Cloudflare Pages deployment and sample public routes. No deploy claims before successful verification.

## Delivery and approval sequence

| Stage | Smallest safe release | Dependencies | Gate |
| --- | --- | --- | --- |
| 1 | Remove build metrics, introduce grounded reading entry points; retain accepted homepage imagery and menu | Confirm design concept and visitor copy | Git diff excludes historical content; keyboard and narrow-screen screenshot review |
| 2 | Make chapter surfaces opaque and refine the three-column reader for reading comfort | Stage 1 design tokens | 44 chapters, every passage ID/anchor, source URL and keyboard interaction preserved |
| 3 | Derived archive year/count, revised accessible labels, optional PDF list view | Catalogue completeness and PDF original integrity | Every locally hosted PDF SHA and cover, no source-only public cards, consistent filter URL |
| 4 | Timeline empty-period affordance, list switch and discovery controls | Event counts and date precision | 2025 cutoff enforced; event IDs and source links unchanged |
| 5 | Optional cultural thematic path and geography-aware original map pilot | Specific accepted evidence, qualified editorial review, authentic georeferencing | Explicit editorial approval, source fidelity and standalone accessibility review |

**Decision requested:** approve or adjust the *design direction and mockups*, then authorise the first small implementation stage. The current production pages and historical corpus are unchanged by this research PR. Publication source relevance and independent QA remain tracked separately in repository issues #133 and #136.
