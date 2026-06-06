# DailyCoder — Apps Script backend

The Google Apps Script Web App that backs newsletter sign-ups, comments,
progress sync, course tracking, discussions, quizzes, and certifications.

Apps Script projects are **flat in the cloud** (no real subfolders) and you
deploy by **pasting a single script**. So the code is authored as small modular
files under `src/` and a tiny Node bundler concatenates them into one
deployable file at `dist/Code.gs`.

## Layout

```
scripts/apps-script/
  build.mjs                 concatenates src/*.js (filename order) -> dist/Code.gs
  src/
    00-config.js            Config: Script Properties (FIREBASE_API_KEY / PROJECT_ID), BUILD stamp
    01-http.js              Http: json / jsonp / reply / ok / error
    02-db.js                DB: SHEETS registry + get / ensure / values / upsert
    03-auth.js              Auth: verify (accounts:lookup), uidFrom
    04-utils.js             Utils: isTruthyCell, slugify
    10-newsletter.js        Newsletter.subscribe
    11-comments.js          Comments.list / create
    12-progress.js          Progress.get / save / getEnrollments / saveEnrollment
    13-courses.js           Courses.getProgress / saveProgress
    14-discussions.js       Discussions.get / post
    15-quiz.js              Quiz.listCommunity / leaderboard / create / submitScore
    16-certifications.js    Certifications.get / verify
    20-router.js            doGet / doPost dispatch tables, makeContext, setupSheets(), Debug.authcheck/version
  dist/
    Code.gs                 GENERATED — paste THIS into Apps Script
```

Each feature file exposes a namespace whose handlers take a request **context**
(`ctx`) and return a `ContentService` response. The core namespaces
(`Config`, `Http`, `DB`, `Auth`, `Utils`) provide the reusable methods every
module consumes. `20-router.js` loads last so its dispatch tables can reference
the already-defined namespaces.

## Build

```bash
npm run build:gas
```

Regenerates `dist/Code.gs`. Never edit `dist/Code.gs` by hand — edit the
sources under `src/` and rebuild.

## Deploy

1. `npm run build:gas`.
2. Open the Apps Script project, select all in the editor, and paste the full
   contents of `dist/Code.gs`.
3. **Script Properties** (Project Settings → Script properties) must contain:
   - `FIREBASE_API_KEY` = your public Firebase Web API key
   - `FIREBASE_PROJECT_ID` = your Firebase project id
4. Run `setupSheets` once (function dropdown → Run) to create any missing tabs.
5. **Deploy → Manage deployments → Edit → New version** (a new version is
   required for changes to take effect). Execute as *Me*, access *Anyone*.

## Verify a deployment

- `?action=version` — returns the `build` stamp (`Config.BUILD`) so you can
  confirm the live deployment is running the latest bundle.
- `?action=authcheck&idToken=<token>` — reports `apiKeyConfigured`,
  `tokenProvided`, `tokenVerified`, and the resolved `uid` (never leaks the key).

## Contract

The external contract is identical to the previous monolithic script: same
single Web App URL, same action names, same response shapes. Clients
(`public/js/sync.js`, `src/lib/quizApi.ts`, the Astro components) are untouched.
