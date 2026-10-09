# NZ GIS History complete delivery plan

Prepared 10 October 2026, New Zealand time. Target repository: https://github.com/pm4gis/gishistory26. Status: planning completed; implementation, migration, deployment and reader testing have not been performed by this plan.

## Agreed direction

Build a new, text-first historical publication with a book-style reader, a left-to-right timeline and useful connections between chapters, passages, people, organisations, businesses, agencies, events and themes. Reading remains comfortable without opening a graph. Related entries explain the connection and return readers to their original passage. Modern presentation comes from typography, composition, responsive controls and light animation. Authentic archival imagery can be added progressively; the site must look complete while it remains predominantly text.

Use Astro + Svelte + TypeScript. Astro generates complete HTML entry points; Svelte coordinates the interactive reader controls, timeline selection and related-entry panels. One reader island owns these coordinated controls rather than several independent widgets maintaining conflicting selections. Historical content and connection rules remain framework-independent. Use selected D3 modules for date positioning, generated indexes for routine relationships, Graphology where deeper traversal is useful, Pagefind for search and optional, lazy-loaded Sigma for visual exploration. ChatGPT performs development and maintenance. Duane reviews the reader experience and editorial changes; routine work must require no coding.

Keep GitHub and Cloudflare as the delivery platforms and remain within free allowances. MCP is the preferred ChatGPT editorial interface; a tested browser editor is a fallback. Both use the same GitHub-backed content and validators. No paid database, external hosted search, AI inference service or billing-enabled media service is required for launch. PDF, EPUB, read-aloud, offline caching, cross-device accounts and public attachments are outside launch scope. Contributions can begin with text and source URLs if their moderation flow is ready.

## Baseline and decisions

The GitHub connector returned metadata for `pm4gis/gishistory26` on this turn, including a public repository, default branch `main`, write/admin permissions and size zero. This establishes access and reported metadata, not a verified branch tree or configured Cloudflare project. Persistent access and deployment configuration remain to be checked. Platform authorisation cannot be guaranteed forever or bypassed; the goal is reusable configured connections and one-time integration setup wherever supported.

Use these existing specifications as inputs: `NZ_GIS_History_Comparative_Design_and_Astro_Specification_2026-10-09.md`, `NZ_GIS_History_Free_Technology_Review_2026-10-10.md`, and `NZ_GIS_History_Reference_Design_Brief_2026-10-10.md`. Apply the later approved reader mockup and subsequent instructions when they differ. The complete rebuild replaces the interface and implementation. It does not authorise deleting accepted historical material or rewriting prose.

The migration baseline must be retrieved afresh. Sources include `history.pm4gis.nz`, `gishistory.pm4gis.nz`, `pm4gis/nz-gis-history-rebuild`, accepted canonical/editorial exports and the relevant Library research packages. Include the Māori GIS canonical import and historical media integration packages where accepted or pending. Their acceptance state must be recorded rather than inferred from a filename. Earlier counts and revisions are historical checkpoints, not current acceptance totals.

Preserve the established exclusions and limited biographies in the editorial rules. Retain accepted corrections and New Zealand spelling. Carry the existing two dark and two light palettes forward, reconcile their actual names and saved preference keys, and preserve an existing user choice where feasible. Resolve the first-visit default in the prototype with Duane; use the approved dark shell as the starting concept. Do not make theme choice a release blocker when contrast and usability work in all four.

## Delivery sequence

The durations below are effort allowances in focused working days, not autonomous background execution or promised calendar dates. Execution occurs in active sessions. Allow approximately 25–40 focused days for the full release, depending on access, source extraction, content conflicts and editor/MCP integration. Re-estimate after the baseline and prototype gates. Do not compress migration verification to meet a date.

| Stage | Effort | Work and output | Completion gate |
|---|---:|---|---|
| 0. Establish baseline | 2–4 days | Access inventory, source snapshots, acceptance register, exact counts/checksums, route inventory, repository guide | Every source identified; unresolved access or acceptance gaps explicitly recorded |
| 1. Model content | 2–4 days | Portable schema, reconciliation importer, source precedence rules, migration ledger, deterministic validation | Dry-run migration preserves accepted material and reports conflicts |
| 2. Design system | 2–3 days | Design tokens, desktop/mobile layouts, component states, four palettes, revised mockups | Reader, timeline and connections accepted as one coherent experience |
| 3. Working vertical slice | 4–6 days | Complete real chapter, record pages, timeline, related-entry return path, search, preview build | Core journey works on desktop/mobile and keyboard; content intact |
| 4. Simulated review and repairs | 2–3 days | Structured 100-persona walkthrough, design review, prioritised fixes and retest | Highest-severity journey defects repaired in the slice |
| 5. Complete site | 5–8 days | All templates, full migrated corpus, full timeline/search, optional graph, source/media presentation | Every accepted item represented; no unaccounted content loss |
| 6. Editorial operations | 3–5 days | MCP read/patch/validate/preview/release/recover; editor fallback; audit and concurrency tests | A real correction completes the entire draft-to-preview-to-release process |
| 7. Release verification | 3–4 days | Device/browser/accessibility/performance checks, link reconciliation, recovery rehearsal | All launch gates pass; exceptions documented and agreed |
| 8. Cutover and stabilisation | 2–3 days plus observation | Final delta migration, production release, domain switch, redirects, monitoring and handover | Production verified; rollback available; routine update succeeds |

Stages 1 and 2 can overlap after source identity is established. Full import and template expansion follow the successful slice. Editor work can proceed once schemas stabilise. The final migration comparison must happen immediately before cutover, regardless of earlier successful checks.

## Content migration

Capture immutable snapshots of each available source with retrieval time, revision, commit where applicable and SHA-256 checksums. Export full structured content rather than relying on rendered pages when an authoritative export exists. Preserve raw exports separately from transformed data. Crawl rendered routes to detect published prose or media missing from structured exports; reconcile those differences explicitly. Retain restricted or unaccepted research in a private research area rather than silently publishing it into a public repository.

Create a migration ledger for every entity, article, passage, event, relationship, source and image. Each row records original identity/location, target identity/location, acceptance state, action, evidence and conflict resolution. Preserve permanent IDs. Maintain aliases for genuine merges rather than replacing identities with newly generated IDs. Never treat matching names alone as proof of duplication. Preserve source references and the exact historical wording before any separately authorised editorial repair.

Use a three-way comparison when a known common baseline exists: baseline, newer accepted publication and candidate import. Where it does not exist, compare the snapshots and record the uncertainty. Prefer the latest demonstrably accepted change, while retaining conflicting material in the reconciliation register until resolved. Proposed research remains proposed. A revision number alone does not establish that one independent source supersedes another.

Check inventory equality and content preservation at block level. Compare paragraphs, ordered passages, figure/caption associations, date precision, edge direction, relationship evidence and sources. Text normalisation for comparison must not change stored prose. A disappearing block fails migration unless it has an explicit accepted move, merge or removal decision. Duplicate material may be consolidated only with evidence, a recoverable original and an identity/route mapping. Matching total counts is insufficient.

Preserve media originals, permissions, attribution, repository references and checksums. Generate derivatives with recorded dimensions and transformations. Publicly serve only permitted media. Preserve excluded material privately where authorised rather than introducing it into the publication. Do not substitute generated historical imagery for unavailable originals. Missing files receive a precise issue entry with original source, intended use and permission status.

Choose one GitHub content layout after measuring the corpus. Prefer one file per independently edited entity/article and stable ordered passage blocks. Keep raw source snapshots outside normal published collections. Generate relationship, alias, chronology and search-support indexes at build time. Record schema version and supply explicit migrations when it changes. The content must remain exportable without Astro, Svelte or the CMS.

A revision manifest should identify the content revision, schema version, source revisions, Git commit and inventory/hash summaries. Establish Git as authoritative only after the final reconciled baseline is accepted. Earlier sites remain immutable references after cutover; they must not continue as competing editorial stores.

## Page design

| Page | Required behaviour |
|---|---|
| Home | Clear publication identity, Start reading, Continue reading when stored progress exists, Explore timeline, Search and a concise selection of themes. No compulsory animation or image-heavy introduction |
| Book reader | Contents, chapter title, stable reading sections, previous/next, complete-chapter mode, passage links, reading preferences and contextual entries. Full historical text remains accessible |
| Timeline | Horizontal chronological rail with explicit points/ranges, selected period and labelled event list. Event selection reveals relevant passages and records; changing period never hides the chapter text |
| Record | Full biography or organisational account, known dates, aliases, sources, linked passages, documented relationships and related themes |
| Theme | Introductory material, relevant chapters/events/records and meaningful ordering, using accepted taxonomy |
| Search | Full text, names/aliases, passage excerpts and type/theme filters, with shareable results and useful empty states |
| Sources/media | Provenance, bibliographic detail, rights, image credits and links to the relevant passages or records |
| Optional network | Opens around a selected record; clear edge meaning and evidence, with a text equivalent. Loaded only on demand |

On wide desktop layouts, show contents on the left, a 60–70-character reading column in the centre and related entries on the right. Put a compact timeline above the chapter content. Below the width where these become cramped, collapse contents and related entries into labelled controls. Mobile uses one reading column, a compact period control and accessible sheets/disclosures. Avoid nested independent scrolling panes unless a specific object viewer needs them. Neither fixed controls nor panels may cover the final paragraph or its sources.

A reading page groups complete passages; it is not a fixed-height viewport. Page numbers describe the current edition's sequence, while passage IDs are permanent citation targets. Next/Previous work at chapter boundaries. A complete-chapter link remains available. Store progress by stable passage ID and position, and preserve it when following a related entry, resizing text or changing palette. Share URLs encode meaningful chapter/passage and exploration state; browser Back restores the previous state and position.

Use DM Sans, self-hosted with its licence. Begin with 18–20 px body text, approximately 1.6 line spacing, comfortable paragraph spacing and 44 px preferred touch targets. Define spacing, type, colour, border, elevation and motion tokens centrally. Use opaque prose surfaces, restrained translucent navigation, clear focus states and four complete palettes. Do not use faux book textures, a dashboard template, constant motion or large empty image placeholders.

Start motion at 120–180 ms for feedback and 180–240 ms for panels/navigation, then adjust through the prototype. Prefer opacity and transform; avoid layout shifts and compulsory delays. Reduced motion removes nonessential movement. Page transitions must preserve focus, scroll behaviour and normal links. Hover previews also open on focus or tap, contain a deliberate full-entry link and close predictably. Do not automatically link ambiguous names; use an editorially validated mention/alias index.

## Connection rules

The relationship engine is shared by the reader, timeline, records, search and optional graph. Label documented relationships, mentions in a passage and shared themes separately. Show the evidence for a documented link and describe longer paths as paths through records, without inventing causation. A person mentioned near a dated event does not acquire that date as a biography date. Unknown, approximate and ranged dates retain their precision; undated entries remain discoverable outside the numeric scale.

Use OR within one filter facet and AND between facets. Filters have clear/reset controls and visible active selections. Limit the initial related panel to a useful selection with View all. Rank direct passage mentions and evidenced connections ahead of broad thematic associations, explain the basis and use stable deterministic ordering. Timeline controls include keyboard-operable period selection and a list alternative to dragging. Selected period, reading position and selected entry are distinct states with explicit synchronisation rules.

## Implementation structure

Suggested directories are `content/`, `schemas/`, `scripts/migration/`, `scripts/validation/`, `src/components/reader/`, `src/components/timeline/`, `src/components/records/`, `src/lib/connections/`, `src/styles/`, `tests/`, `docs/` and `public/admin/`. Finalise against the actual starter before coding. Add `AGENTS.md` containing agreed scope, editorial boundaries, architecture, build commands and required checks. Keep design and schema decisions in short versioned decision records.

Build in this order: schema/import and preservation validator; CSS tokens and semantic layouts; full chapter and record HTML; reader state and navigation; timeline and contextual links; search; remaining templates and complete import; media inspection and optional network; editorial tools; cutover. Prefer ordinary links and HTML for reading, progressively enhanced controls and a bounded Svelte reader shell. Do not ship the entire corpus or a graph renderer with every reading page.

Lock dependencies, pin the supported runtime, retain licences and automate update proposals with validation. Use one package manager. CI runs schema/referential validation, preservation comparison, type checks, production build, internal-link checks and meaningful browser journeys. Include a content-only check path, while every released content change still produces and verifies the final build and search index. Builds are reproducible from a named commit and content revision.

## Updates and MCP

Implement MCP tools for publication state, complete export, record/passage retrieval, search, patch preparation, validation, preview, release, audit and recovery. Share validation code with CI and the editor. A patch names its base content revision and expected Git head. Reject stale writes with a clear conflict report. Never overwrite newer accepted edits. Store secrets server-side in scoped integration credentials or Worker secrets, and keep them out of the public repository and browser bundle.

For a publish operation, bind the preview to exact candidate hashes and revision; validate again before applying it. Only a checked candidate can become a release. Produce a manifest containing changed IDs, sources, content differences, validation results and deployment identity. A failed build leaves the current publication live. Coordinate releases so multiple chat sessions cannot publish competing candidates silently. Retries must be idempotent, and release status must distinguish committed, built and live.

Use the existing canonical MCP ideas where their code and behaviour can be verified; do not presume the old endpoint writes to the new GitHub dataset. The MCP hosting/authentication design requires an explicit free-quota check before implementation. If a custom endpoint cannot operate within free constraints, retain GitHub connector-driven patches with the same CLI validators as the launch editorial route, and report the MCP gap clearly.

Test Decap against the actual schema before committing to it. It must round-trip unknown fields, stable IDs, dates, relationship evidence and complex sources without loss. If it fails, simplify forms or evaluate another Git-backed editor; do not alter the historical schema to suit a convenience form. Protect the same revision checks wherever the editor backend supports them and handle conflicts through Git review.

The normal update is: request research/correction in ChatGPT; retrieve the latest accepted state; prepare a sourced patch; validate; inspect preview and change report; release when authorised; verify live revision and affected routes. Content updates every other day should require no terminal commands from Duane. Platform access prompts and release decisions are separate: configure reusable integrations without claiming that ChatGPT can suppress account security requirements.

## Simulated reader review

The following is a design simulation, not a survey or actual browser test. Run 100 explicit persona walkthroughs against the working preview, using the cohort/task matrix below. Produce individual task traces, expected difficulty, suspected defect and suggested remedy. Do not manufacture satisfaction scores, participant quotations or completion percentages. Browser automation can verify operations, but cannot establish human comprehension.

| Simulated cohort | Number | Tasks and likely friction hypothesis |
|---|---:|---|
| General readers | 20 | Start reading, move three sections, resume later. Risk: too many exploration controls compete with reading |
| GIS practitioners | 15 | Find an organisation and its projects. Risk: inconsistent aliases or unexplained relationships |
| Researchers | 15 | Trace a claim to a source and link a passage. Risk: citations buried or temporary page numbers used as identifiers |
| Māori community readers | 15 | Find iwi mapping, people and place-name accounts. Risk: taxonomy hides relevant material or wording misrepresents contribution |
| Mobile readers | 15 | Read, change period, open a person and return. Risk: panels cover text or touch controls are cramped |
| Readers needing larger text or keyboard access | 10 | Enlarge text, use keyboard navigation and reduced motion. Risk: fixed page heights, hover-only links or lost focus |
| Casual discovery/social visitors | 5 | Open a deep link and understand its context. Risk: no clear chapter location or next action |
| Editors and contributors | 5 | Correct a source, inspect preview and submit a correction. Risk: unclear draft/live state or destructive forms |
| Total | 100 | Cohorts are testing lenses, not demographic representation or real participants |

Prioritised simulated findings before implementation: simplify the initial toolbar; keep the prose visible when filtering; make relationship labels explicit; supply a source action beside relevant text; make Next and return-to-passage reliable; expose mobile contents/related controls; keep a coherent theme taxonomy; support undated material; show useful empty states; separate editorial state from publication state. These are proposed improvements to test, not defects already observed in the new site.

At the slice gate, conduct a heuristic design review covering hierarchy, reading measure, navigation, state clarity, input/focus behaviour, all palettes and historical evidence. Log issues with reproducible steps and severity: blocker, major, moderate or minor. Fix blockers and major defects before expanding templates. Re-run affected tasks, then run the same review on the full corpus to expose long titles, sparse entries, dense relationship sets and unusual dates. Reserve real feedback for people who actually inspect the preview; invite a small varied group only when authorised and do not send unsolicited messages.

## Verification and release gates

| Gate | Required evidence |
|---|---|
| Content preservation | Exact inventory, block/identity reconciliation, no unaccounted missing prose/sources/media/edges and a clear register of pending material |
| Reader behaviour | Deep links, Next/Previous, chapter boundaries, complete chapter, bookmark/resume and return-to-passage pass |
| Evidence and dates | Ambiguous mentions, approximate/ranged/undated events and relationship categories display accurately |
| Responsive/accessibility | 320, 375, 768, 1024 and 1440 px layouts; keyboard; 200% text zoom; 400% reflow; reduced motion; palette contrast; representative screen-reader check |
| Browser/device | Current Chromium, Firefox and Safari where available; iOS/Android touch checks. Unavailable devices are disclosed, not marked passed |
| Performance | Initial reader JS target ≤150 KB gzip excluding lazy optional tools; no graph in baseline payload; lab LCP target ≤2.5 s, CLS ≤0.1 and checked interaction responsiveness |
| Editorial operation | Content update, stale-patch conflict, failed build, preview-to-live verification and audit all exercised |
| Recovery | Restore both content and matching deploy; verify revision, routes and search afterwards |
| Hosting | Free-plan file/build limits, largest asset, output count, build duration and credentials/headers inspected |

Performance values are engineering targets, not measured results. Field INP target is ≤200 ms when enough real traffic exists; lab traces alone do not establish field compliance. Run automated accessibility checks plus manual focus, reading and text-size checks. Cover real edge cases rather than tests that merely repeat component internals.

Current Cloudflare Pages documentation lists 500 builds/month, one concurrent build, a 20-minute build timeout, 20,000 files and 25 MiB per asset on Free. Use internal warning targets of 350 monthly builds, 15-minute builds, 15,000 output files and 20 MiB assets to retain headroom. Recheck limits at implementation and launch. Fifteen content releases with several previews should fit, but actual total account usage and build behaviour must be measured. No paid service is enabled to avoid a failed limit check.

## Cutover and recovery

Develop on an isolated branch and a new preview project, with no changes to existing live domains during design/migration. Confirm the staging hostname rather than assuming `gishistory.pm4gis.nz` is unused. Map every existing route, slug, passage anchor and known shared URL. Preserve original route shapes where practical; otherwise generate redirects and legacy anchor aliases. URL fragments are not sent to the server, so changed passage anchors require page-level compatibility, not merely HTTP redirects.

Immediately before launch, capture the latest source revisions and reconcile the delta. Establish an explicit single publishing destination during cutover so old-site edits cannot disappear. Publish the checked release to the chosen final hostname only when launch is authorised. Verify SSL, canonical URLs, sitemap, search, social metadata, deep links, editor/MCP connectivity and alternate hostnames. Keep an archive and known-good deployment available.

A rollback restores a matching content revision and build, checks the domain target and confirms search/caches correspond to that revision. Reverting a commit alone is not evidence that the live site is restored. Trigger rollback for content loss, broken core reading routes, compromised editorial integrity or a widespread unusable interface. Record the incident and preserve the failed candidate for diagnosis.

## Completion and ongoing operation

The site is complete when the entire accepted corpus is migrated and reconciled; every required template works; reading, timeline and connected records work together; all four palettes and mobile layouts are usable; frequent ChatGPT/editor updates are demonstrated; release/recovery checks pass; and the live domain serves the verified release. Outstanding optional features do not prevent completion. Unresolved accepted-content loss, missing sources, broken return navigation or unverified release state does.

Handover includes `AGENTS.md`, architecture/schema notes, design tokens, source/migration registers, route map, test results, release manifest, update instructions and a recovery runbook. After launch, verify the first normal content update and observe errors/link failures over seven days when sessions or authorised monitoring are available. Fix production defects before adding optional features. Review dependencies monthly and platform allowances when relevant; this plan does not create scheduled automation.

## Sources and next execution unit

Technology documentation: https://docs.astro.build/en/guides/framework-components/ and https://developers.cloudflare.com/pages/platform/limits/ were consulted during preparation. Prior specifications contain the comparative design and technology research. No current canonical dataset, full repository tree, Cloudflare account/project or research-package bytes were retrieved for this plan; those are Stage 0 dependencies.

The next complete unit is Stage 0 plus a dry-run reconciliation design: establish access, inspect the new repository and hosting configuration read-only, retrieve and checksum source exports, classify accepted versus pending material, build an exact inventory and route register, and produce a migration readiness report. Do not publish, change domains or rewrite history during that unit.
