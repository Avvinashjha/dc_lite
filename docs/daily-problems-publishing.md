# Daily Challenge (Problem of the Day)

The Daily hub highlights **one catalog problem per calendar day**. Problems live only under `content/problems/<slug>/`; the schedule maps dates to slugs.

## Schedule file

Edit **`content/daily-schedule.json`**:

```json
{
  "entries": [
    { "date": "2026-03-26", "slug": "two-sum" }
  ]
}
```

Rules enforced at build time:

- `date` must be `YYYY-MM-DD` and **unique** (no duplicate days).
- `slug` must exist in the problems catalog (`meta.json` present, not `draft`).
- Sorting in the file does not matter; entries are sorted by date when loaded.

Future-dated rows are omitted from the static build’s “published so far” lists. The **hub script** also filters by the visitor’s current date (see below) so the hero can update without a redeploy.

## URLs

| Route | Behavior |
|-------|----------|
| `/` (`#daily-challenge`) | **Homepage**: Problem of the day, sample I/O, sidebar stats & recent picks. |
| `/daily/problem` | Redirects to **`/`** (legacy). |
| `/daily/problem/[slug]` | **Redirects** to `/problems/[slug]` (editor-first). |
| `/daily/problem/rss.xml` | RSS items link to **`/problems/{slug}/`**. |

## Problems page integration

- Rows for slugs on the schedule show a **Daily** badge.
- Filter **Daily picks** limits the table/cards to those slugs.
- The **Daily challenge** strip links to today’s pick and recent schedule rows.

## Progress and Sheets sync

- Solving, attempts, and “solution unlock” for a POTD use the same **`problem-progress`** IndexedDB key as any other problem.
- Logged-in users mirror that data to the **`user_progress`** sheet (`type` = `problem-progress`), via `DCSyncService`—**no separate daily stats row is required**. Streak and consistency on the hub are **derived client-side** from schedule dates + `problem-progress` payloads.

## Scoring (unchanged logic)

- Solve on the **scheduled** day: full streak contribution + `1.0` consistency (for that slot).
- Solve after that day: backfill `+0.5` consistency, no streak extension from that slot.
- Unlock official solution (POTD problems): one-time `-0.5` consistency for that problem’s progress row (see editor behavior for slugs on the schedule).

## Hero image

If the chosen problem has `visuals[0].imageUrl` in `meta.json`, the hub uses it in the hero. Otherwise a code-themed placeholder is shown.

## Authoring checklist

- [ ] Problem exists under `content/problems/<slug>/` with description, solution, tests as usual.
- [ ] New row added to `daily-schedule.json` with correct `date` and `slug`.
- [ ] `npm run build` passes (invalid slug or duplicate date fails fast).

## Old model (deprecated)

Do **not** create separate `problemSet: "daily"` problem copies. One slug, one canonical problem folder; schedule only assigns the day.
