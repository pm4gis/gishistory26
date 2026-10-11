# LADEDA original-source review verification

Base production commit: `522eb4a666e23082ff617825258be6036c0a11d6`.

Scope: inspection and acquisition evidence only. No new public image, image-detail page, derivative, prose change or placement. Public inventory remains 182 image records. Master alignment retains its original 182 rows byte-for-byte and appends 18 explicitly held candidates (17 LADEDA examples and Levin N152). Held candidates are not site image records.

Local checks completed on 11 October 2026:

- `npm ci` succeeded.
- Full `npm test`: 59 passed, zero failed.
- Full `npm run build`: succeeded, 1,069 pages; content, manuscript preservation, historical-image files, decorative assets, type checking and internal-link checks completed.
- `node scripts/assert-editorial-exclusions.mjs`: zero matches among 14,711 checked source/build files.
- Git comparison: no change to accepted articles, passages, records, events, relationships, image records, historical assets or placement module.
- Existing master CSV bytes retained as an exact prefix of the updated register; all 17 held plot matches resolve to accepted Chapter 5 paragraph IDs.
- Source PDF SHA-256 checks completed. Handbook identity/date verified from title and copyright pages; 17 numbered plots inspected with explanations. The recovered 1979 booklet is complete and opens as 79 PDF pages.

Release gates are implemented in `verify-ladeda-review-20261011.yml`. They rerun validation and preservation, then use Chromium on desktop and mobile for local and Cloudflare preview checks. Existing Chapter 7 LUC map placement, direct image checksums, the eight-chapter journeys and primary geospatial figures are retained as regression checks. New browser checks ensure all 18 held image-detail routes return 404 and the held identities do not enter the chapter or gallery. A release may be merged only after these checks and the exact candidate Cloudflare deployment succeed. Production deployment and affected pages must be verified after merge.

Unavailable checks: native Safari/Firefox and physical iOS/Android devices are not available in this workflow. Desktop and mobile viewport Chromium checks are not represented as physical-device tests.
