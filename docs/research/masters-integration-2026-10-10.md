# GIS master's research integration | 10 October 2026

This package reconciles the supplied 85-record master's workbook with the `pm4gis/gishistory26` production repository tree at `748f0d5804943faabf7da7736539a688a2f4793c`, inspected on 10 October 2026. Full semantic text comparison was restricted to sampled targeted searches and previously reviewed content; a filename match is not proof that every existing thesis is already described in prose.

## Disposition

- 24 entries already have an identifiable person record and are retained without overwriting them.
- 25 selected theses become new source-linked people, six thematic chapter passages, twelve selected year-precision events and fifty documented researcher–institution/chapter links.
- 35 entries remain individually tracked for later verification and incorporation.
- 1 entry may already be represented under another version of the person's name; investigate before merging.

See `masters-reconciliation-2026-10-10.csv` for the disposition of all 85 thesis IDs. University research records and titles are cited on each new profile. Only public bibliographic metadata and editorial paraphrases are included. Protected or sensitive original research data and files are excluded.

## Specific uncertainties

The University of Waikato MSocSc qualification and 2001 joint paper by Lars Brabyn and Duane Wilkins are documented, but a reliable official catalogue record for the exact master's dissertation title was not recovered. The publication cites the paper as a paper. Kirsten Fryer's documented earlier GIS employment is distinct from an unverified claim that she wrote a particular master's thesis; no thesis record has been created. Greg Lauer's precise award designation is inconsistent between the thesis citation and author byline in the 2003 published paper; that discrepancy is retained.

## Release conditions

This material is a prepared source patch, not evidence that production was updated. The repository's existing content and IDs are preserved. Apply the patch on a current clean checkout descended from the inspected baseline, update preservation hashes using the supplied script, run `npm ci`, `npm test` and `npm run build`, inspect changed routes and links, then create and review a GitHub pull request. Merge only after the preview build is successful and verify Cloudflare's production deployment against the resulting Git SHA.
