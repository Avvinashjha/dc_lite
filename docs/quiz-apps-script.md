# Quiz module — Google Apps Script backend

The Quiz module is fully functional with **curated quizzes and local/practice play
without any backend**. The optional Google Apps Script below powers the
*community* features:

- **`createQuiz`** — publish a user-created quiz (stored in a Sheet).
- **`listCommunityQuizzes`** — list all community quizzes.
- **`submitScore`** — record a ranked-quiz score.
- **`getLeaderboard`** — read top scores for a quiz.

These quiz actions are part of the **single, unified backend** that powers the
whole site. The backend is authored as modular sources under
[`scripts/apps-script/src/`](../scripts/apps-script/) (the quiz handlers live in
`15-quiz.js`) and bundled into one deployable `dist/Code.gs` — see
[`scripts/apps-script/README.md`](../scripts/apps-script/README.md). There is no
separate quiz deployment.

It follows action-based dispatch, JSON responses, POST bodies sent as
`text/plain` (to avoid CORS preflight), and Firebase ID-token verification via
the Identity Toolkit `accounts:lookup` endpoint (set `FIREBASE_API_KEY` as a
**Script Property** in the Apps Script editor — not hardcoded; the `tokeninfo`
endpoint does **not** work for Firebase tokens).

> If the endpoint is **not** configured, the UI degrades gracefully: curated
> quizzes and local/practice play keep working, and community/leaderboard/create
> show a friendly "coming soon / not configured" state.

> **Course quizzes are not community quizzes.** Quizzes referenced by a course
> lesson (`type: "quiz"` + `quizSlug`) are automatically excluded from the public
> `/quiz` browser (see `getPublicQuizzes()` / `getCourseQuizSlugs()`), and their
> results are tracked in the `course_quiz_scores` tab via `saveCourseProgress`,
> not in the ranked `quiz_scores` tab. You can also force-hide a curated quiz
> with `"courseOnly": true` in its `quiz.json`.

---

## 1. Create the Sheet + script

The quiz actions ship inside the unified backend, so there is **nothing
quiz-specific to set up separately**. Follow the main backend setup in
[`docs/google-sheets-setup.md`](./google-sheets-setup.md):

1. Use the Google Sheet backing your site (reuse the existing one).
2. Build the bundle: `npm run build:gas`.
3. **Extensions → Apps Script**, paste `scripts/apps-script/dist/Code.gs`, save.
4. Set the `FIREBASE_API_KEY` / `FIREBASE_PROJECT_ID` Script Properties.
5. Run `setupSheets` once to create the `community_quizzes` / `quiz_scores` tabs
   (they are also auto-created on first write).

## 2. Deploy as a Web App

1. **Deploy → New deployment → Web app**.
2. **Execute as:** `Me`.
3. **Who has access:** `Anyone`.
4. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/AKfy.../exec`).
5. Paste it into `content/config.json`:

```json
"quiz": {
  "enabled": true,
  "googleScriptUrl": "https://script.google.com/macros/s/XXXX/exec"
}
```

6. Re-build / re-deploy the static site. That's it.

> After **any** code change in Apps Script you must create a **new deployment
> version** (Deploy → Manage deployments → edit → new version) for it to take effect.

The three sheets (`community_quizzes`, `quiz_scores`) are created automatically
on first write.

---

## 3. Apps Script code

The quiz handlers are **not** a standalone script anymore — they live in the
unified modular backend at
[`scripts/apps-script/src/15-quiz.js`](../scripts/apps-script/src/15-quiz.js)
(`Quiz.listCommunity`, `Quiz.leaderboard`, `Quiz.create`, `Quiz.submitScore`),
wired into the router's dispatch tables in
[`scripts/apps-script/src/20-router.js`](../scripts/apps-script/src/20-router.js).

Token verification uses the Identity Toolkit `accounts:lookup` endpoint with the
`FIREBASE_API_KEY` Script Property (shared core in `03-auth.js` / `00-config.js`),
not the legacy `tokeninfo` endpoint.

To deploy: run `npm run build:gas` and paste the generated
`scripts/apps-script/dist/Code.gs` — exactly as described in
[`docs/google-sheets-setup.md`](./google-sheets-setup.md). The quiz actions are
included automatically; there is no separate quiz deployment to maintain.

---

## 4. Request / response contract

All reads are `GET ...?action=<name>&...`; all writes are `POST` with a
`text/plain` JSON body `{ "action": "<name>", ... }`.

| Action | Method | Request | Response |
| --- | --- | --- | --- |
| `listCommunityQuizzes` | GET | `?action=listCommunityQuizzes` | `{ status, quizzes: Quiz[] }` |
| `getLeaderboard` | GET | `?action=getLeaderboard&quizSlug=&limit=` | `{ status, scores: LeaderboardEntry[] }` |
| `createQuiz` | POST | `{ action, uid, idToken, quiz: Quiz }` | `{ status, slug }` |
| `submitScore` | POST | `{ action, idToken, quizSlug, uid, displayName, score, maxScore, timeSec, completedAt }` | `{ status }` |

`Quiz` and `LeaderboardEntry` match the TypeScript types in
`src/types/quiz.ts`. `createQuiz` / `submitScore` require a valid Firebase ID
token (the client attaches it automatically via `window.getFirebaseIdToken`).

## 5. Security notes

- The script verifies the Firebase ID token server-side, so the `uid` is
  trustworthy. `source` and `ranked` are forced server-side on `createQuiz` so a
  client cannot self-publish a "ranked" quiz.
- There is no rate limiting or content moderation built in. For a public launch
  consider adding a simple per-uid quota, profanity filtering, or a manual
  `approved` column you flip before a quiz appears in `listCommunityQuizzes`.
- Leaderboard returns each user's best score (highest score, fastest time as
  tiebreaker).
