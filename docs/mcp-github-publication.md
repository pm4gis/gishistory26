# MCP to GitHub publication bridge

The public site is built from **GitHub \`main\`**, then deployed by Cloudflare Pages. The owner-only MCP at \`mcp.history.pm4gis.nz\` reads public content and has a separate, audited Cloudflare D1 editorial overlay. The legacy MCP \`publish_history_patch\` operation **does not update the public site**. Never present an MCP D1 publication result as a public release.

## Safe publishing procedure

1. Retrieve the source record and supporting evidence through the owner-only MCP. Obtain the current MCP revision and preview the precise before/after changes. Save an authenticated, locally held patch envelope with \`expectedMcpRevision\` and \`operations\`. Do not commit this raw envelope or credentials to the public repository.
2. Using the connected GitHub account, check the current \`main\` SHA and create a fresh short-lived branch. Run \`node scripts/apply-mcp-git-patch.mjs --input /path/outside/repo/operations.json --expected-head <branch-head> --report /path/outside/repo/report.json\`. It checks all before-values against current GitHub content, rejects unsupported and stale changes and validates the whole publication. The public validator excludes private \`researchSources\` and internal fields.
3. Historical MCP D1 operation arrays may include research-only fields. Run \`--omit-private\` only after examining the omission report and retaining that material privately. It never silently imports these fields. Unsupported or conflicting public fields still block publication.
4. Run the same command with \`--apply\` on a clean branch only when the dry run is prepared and validated. This updates the accepted JSON records and \`content/preservation-manifest.json\`. Commit only the reviewed changed content, manifest and a public-safe source/audit summary. Do not commit the private MCP envelope or raw research material.
5. Run \`npm ci\`, \`npm test\`, \`npm run build\`. Open a GitHub PR, check the Actions verification and Cloudflare Pages preview. Merge once verified; confirm the new commit has a successful **production** Pages deployment and the affected public route shows the published value. Record the commit, preview, production deployment and affected paths.
6. Recovery is a Git revert and the corresponding Cloudflare Pages build/rollback. A separate MCP sidecar rollback **does not** revert the website. Compare the sidecar and GitHub after publication; record whether the operation is now already applied. Do not erase the 66 existing D1 operations without a complete reconciliation and a preserved audit.

For an individual small correction, ChatGPT may apply the exact reviewed \`recordId\` and path using GitHub connector updates directly, subject to the same checks and manifest update. No GitHub API key is currently bound to the MCP Worker. Accordingly it cannot securely commit directly to GitHub on its own. Connecting a narrowly scoped GitHub App or equivalent owner-authorised server credential, and testing its full permission boundary, would be required to automate the final commit from the Worker itself. Cloudflare's existing Pages-to-GitHub source connection does not supply the Worker with a repository write token.

## Checks

- Git head lease and source before-values reject concurrent editorial changes.
- An already-applied operation is reported, not replayed.
- No public field is silently removed. Current GitHub schema, paragraph identities, routes and other fields are preserved.
- Public content validation enforces the 31 December 2025 timeline cut-off, referential integrity and no orphan people.
- Preview and production deployments must be checked independently. Do not mistake the latest **preview** deployment for production.
- Production is protected by Cloudflare Access at the MCP hostname. Testing that unauthorised access is denied should not attempt to bypass Access or disclose credentials.

## Known reconciliation

As at 13 October 2026, D1 revision \`editorial-000008\` contained 66 historical operations: 46 \`story\`, one \`name\` and 19 \`researchSources\`. The research-source operations cannot be imported directly because public content validation excludes internal fields. The operation values must be compared with GitHub, not assumed outstanding. Previous media reconciliation recovered 360 of 448 published derivative paths with 88 still unresolved; see \`docs/media/unresolved.md\`.
