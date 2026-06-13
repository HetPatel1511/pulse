# Pulse

A tiny task-tracker service. Logic here is intentionally throwaway demo code —
the point of this repo is the *collaboration graph*: many branches, many authors,
PRs in every state, reviewers and comment threads.

See `docs/PULL_REQUESTS.md` for the full PR board.

## Persistence

`src/storage.js` (`FileStorage`) saves/loads the store as versioned JSON via
`src/serialize.js`. Set `PULSE_DB` to choose the file path. The old standalone
`src/search.js` was removed; search now lives behind the query builder.
