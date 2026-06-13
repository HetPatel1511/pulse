# Pull Request Board

Simulated PR history for the **pulse** repo. Each PR maps to a real branch in this
repository. Statuses cover open, merged, draft, and closed/rejected.

| PR | Title | Author | Branch | Status | Reviewers |
|----|-------|--------|--------|--------|-----------|
| #1 | Task priority levels and sorting | Liam O'Brien | `feature/priorities` | 🟣 Merged | Maya Chen ✅, Priya Nair ✅ |
| #2 | Derive tags from task titles | Sofia Rossi | `feature/tags` | 🟢 Open | Maya Chen 💬, Kenji Tanaka ⏳ |
| #3 | Due dates | Kenji Tanaka | `feature/due-dates` | ⚪ Draft | — |
| #4 | Move all state to a global singleton | Diego Fernandez | `refactor/global-singleton` | 🔴 Closed (Rejected) | Maya Chen ❌, Liam O'Brien ❌ |
| #5 | CI workflow | Priya Nair | `chore/ci` | 🟣 Merged | Maya Chen ✅ |

Legend: ✅ approved · ❌ changes requested/rejected · 💬 commented · ⏳ review pending

---

## PR #1 — Task priority levels and sorting  🟣 Merged
**Author:** Liam O'Brien · **Branch:** `feature/priorities` → `master`

> Adds `low/normal/high/urgent` levels and a stable `sortByPriority` helper.

**Reviews & comments**
- **Maya Chen** ✅ _Approved_ — "Clean. Nice that `rank()` defaults unknown levels to `normal` instead of throwing."
- **Priya Nair** ✅ _Approved_ — "`sortByPriority` copies the array before sorting 👍 no mutation surprises."
- **Liam O'Brien** (author) — "Thanks both, squashing and merging."

## PR #2 — Derive tags from task titles  🟢 Open
**Author:** Sofia Rossi · **Branch:** `feature/tags`

> Parses `#hashtags` out of task titles.

**Reviews & comments**
- **Maya Chen** 💬 _Commented_ on `src/tags.js:1` — "Can we cap tag length? A pathological title could produce huge tags."
  - **Sofia Rossi** (author) — "Good call, will clamp to 32 chars in the next push."
- **Kenji Tanaka** ⏳ _Review requested_ — not yet submitted.
- **Maya Chen** 💬 — "Also the `wip:` commit has a TODO for multi-word tags — split that into #6?"

## PR #3 — Due dates  ⚪ Draft
**Author:** Kenji Tanaka · **Branch:** `feature/due-dates`

> Draft. Adds `setDue` / `isOverdue`. Marked draft until timezone handling is decided.

**Reviews & comments**
- **Kenji Tanaka** (author) — "Opening as draft — `Date.now()` math is naive, need to confirm we store UTC everywhere before requesting review."

## PR #4 — Move all state to a global singleton  🔴 Closed (Rejected)
**Author:** Diego Fernandez · **Branch:** `refactor/global-singleton`

> Replaces the `Store` class with a single mutable `global.__PULSE__` object.

**Reviews & comments**
- **Maya Chen** ❌ _Changes requested_ — "This throws away testability and makes parallel tests impossible. Strong no from me."
- **Liam O'Brien** ❌ _Changes requested_ — "Global mutable state regresses everything #1 added. Closing in favor of keeping `Store`."
- **Diego Fernandez** (author) — "Fair, withdrawing. Closing without merge."

## PR #5 — CI workflow  🟣 Merged
**Author:** Priya Nair · **Branch:** `chore/ci` → `master`

> Adds a GitHub Actions workflow running `npm test` on push/PR.

**Reviews & comments**
- **Maya Chen** ✅ _Approved_ — "Pinning to node 20 is fine for now. Merging."
