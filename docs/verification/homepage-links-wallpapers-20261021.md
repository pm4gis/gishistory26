# Homepage links and wallpaper sequence

Base: 26956373e0f69a5f6abbf8c529e8c011e146c8f4. Scope: make the accepted homepage behave consistently as a linked publication, and replace its satellite header frame with the previously supplied wallpaper series.

The main title and section headings now open the chapter catalogue, imagery theme, people browser or themes catalogue as appropriate. The chapter, people and event statistics open their corresponding destinations. The Atene aerial feature image and Rangitoto people feature image also open the content advertised by the adjacent heading. Existing map, workstation, chapter, theme and menu links remain intact. These are ordinary HTML anchors, with keyboard focus, normal browser Back, new-tab and touch behaviour; no click-handler-only navigation is introduced.

All three header frames now use existing self-hosted derivatives from the owner's 4K wallpaper collection: Karikari, Raglan and Taranaki. The source folder and selection provenance are recorded in docs/media/decorative-landscapes-20261010.md and were checked against the connected Drive folder. The existing 27-second crossfade, reduced-motion first-frame fallback and layout are retained. Captions identify supplied wallpaper imagery without claiming a photograph capture date. The Landsat image and its source record remain in the historical archive.

Regression coverage extends the existing seven-width Chromium suite to keyboard activation of each linked heading, pointer activation of both linked landscape features, exact statistic destinations and all three local wallpaper assets. Existing content-preservation, image-integrity, internal-link, sitemap, accessibility, reader and publication checks remain in the GitHub workflows. Execution and production builds run in GitHub CI because the local execution environment is unavailable in this session; local checks are not claimed.

No historical chapter prose, source metadata, image binary, publication structure or timeline content changes. The historical cutoff remains 31 December 2025.

The release workflow also runs a separate production smoke check after a main-branch push. It waits for the new heading links and wallpaper frame to reach the public homepage, then checks the heading destinations and the actual WebP responses. This runs independently of the local browser build and provides public-deployment evidence through the retained GitHub job log.

The initial raw-HTTP production probe received HTTP 403 from GitHub's runner. The production check therefore uses standard Chromium navigation and native heading activation, with the same browser installation as the existing QA suite. No custom user agent, authentication bypass or Cloudflare security change is applied. A non-200 page response is reported with its visible error text rather than retried as a deployment delay. The actual outcome is retained in the production workflow log and live-homepage evidence artifact.
