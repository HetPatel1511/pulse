# Pulse

A tiny task-tracker service. Logic here is intentionally throwaway demo code —
the point of this repo is the *collaboration graph*: many branches, many authors,
PRs in every state, reviewers and comment threads.

See `docs/PULL_REQUESTS.md` for the full PR board.

## Reminders

`src/scheduler.js` schedules once/interval/daily reminders for tasks and
`src/rules.js` parses strings like `in 30m`, `every 2h`, `daily at 09:00`.
