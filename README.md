# Pulse

A tiny task-tracker service. Logic here is intentionally throwaway demo code —
the point of this repo is the *collaboration graph*: many branches, many authors,
PRs in every state, reviewers and comment threads.

See `docs/PULL_REQUESTS.md` for the full PR board.

## Querying & formatting

`src/filters.js` provides a chainable `query(store)` builder and
`src/format.js` renders tasks as tables. See `tests/suite.js`.
