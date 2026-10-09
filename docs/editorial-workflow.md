# Updating the publication

Ask ChatGPT to make a sourced correction. ChatGPT retrieves the current repository and revision, prepares a patch on an isolated branch, runs preservation/content checks and tests, and supplies the Cloudflare preview. Publishing an authorised candidate updates GitHub and automatically builds Cloudflare. A failed build leaves the previous site live. Return release.json and changed routes as evidence of publication.

The fallback editor at /editor/ prepares an offline draft and retains all original fields. It cannot write to GitHub. Download its draft and give it to ChatGPT. The draft includes the base revision and is explicitly unvalidated; ChatGPT must reconcile any later changes. Never describe downloading a draft as publishing.

The existing OAuth Worker lacks GitHub client ID/secret bindings. It cannot currently support a new authenticated Decap editor. No account credentials have been copied or exposed. Direct browser publishing remains unavailable until an authorised OAuth integration is configured and tested. The existing GitHub and Cloudflare connectors work for ChatGPT updates without user coding.

Custom write MCP is not enabled. Public read tools expose publication state and content. GitHub connector-driven edits with shared validators are the launch fallback specified in the delivery plan. A future write endpoint must enforce authentication, base revision, exact preview checksum, duplicate/retry handling and a matching verified deployment.
