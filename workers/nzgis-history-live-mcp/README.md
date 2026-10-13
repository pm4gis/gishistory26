# Live MCP

This Worker serves the Streamable HTTP MCP endpoint at https://mcp.history.pm4gis.nz/mcp. Cloudflare Access protects the custom domain with OAuth and a single owner-only allow rule. The account is configured in Cloudflare and is not stored in this repository. The legacy anonymous history.pm4gis.nz/mcp route is retired.

The Worker reads https://history.pm4gis.nz/editor-data.json, applies audited D1 editorial operations to subsequent MCP reads, and stores one-use preview tokens in KV. A small MCP edit updates the sidecar editorial revision only; it does not commit GitHub content or rebuild the public site. Use a GitHub-reviewed source change when an edit must appear on the site.

Bindings are declared in wrangler.toml. The Cloudflare Access application and its single-email policy are separate Zero Trust resources and must remain configured when deploying this script. Do not add a service-token policy to that application.

## Reconnection and verification

The ChatGPT MCP connection is a separate client registration. Removing it from ChatGPT **does not** remove the Cloudflare Worker, the D1 editorial history, the KV preview tokens, or the owner-only Cloudflare Access application. Register a new custom MCP connection using the existing Streamable HTTP URL `https://mcp.history.pm4gis.nz/mcp` and Cloudflare Access managed OAuth. Authenticate with the single authorised owner identity. ChatGPT client registration and OAuth consent require an actual owner action; they cannot be completed through the Cloudflare management API.

After a new ChatGPT connection is created, scan and enable the current remote tool catalogue. Confirm the presence of `get_publication_state`, `search_history`, `trace_evidence`, `list_timeline`, `prepare_github_publication`, `preview_history_patch`, `publish_history_patch`, and `restore_history_revision`. A server returning 401 `invalid_token` means the client has no valid Access OAuth authorisation; editing the Worker, D1 or GitHub content cannot refresh that client token. Do not create an unauthenticated route or a service-token bypass.

The MCP server filters timeline search and listing to events on or before 31 December 2025. A query for `2026` with `kind = Timeline event` must return no records. Verify this through the newly registered client before any write test. Small D1 edits are audited but do not publish GitHub Pages. Follow `docs/mcp-github-publication.md` when a website change is required.
