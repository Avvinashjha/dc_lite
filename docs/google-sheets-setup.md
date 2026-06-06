# Google Sheets & Apps Script Setup Guide

This document covers how to set up the Google Sheets backend and deploy the Apps Script that powers DailyCoder's user sync, comments, newsletter, and problem discussions.

---

## Prerequisites

- A Google account
- Access to [Google Sheets](https://sheets.google.com)
- Access to [Google Apps Script](https://script.google.com)

---

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it something like **DailyCoder Backend**.
3. Note the spreadsheet URL — you'll need it when linking the Apps Script.

---

## Step 2: Create the Sheet Tabs

Create the following tabs (sheets) at the bottom of the spreadsheet. For each tab, add the header row in **Row 1** exactly as shown.

### Tab: `subscribers`

For newsletter subscriptions.

| Column | A    | B     | C      | D         |
|--------|------|-------|--------|-----------|
| Header | id   | email | source | timestamp |


### Tab: `comments`

For blog and problem page comments.

| Column | A  | B        | C         | D    | E     | F       | G         | H   |
|--------|----|----------|-----------|------|-------|---------|-----------|-----|
| Header | id | postSlug | postTitle | name | email | comment | timestamp | uid |

### Tab: `user_progress`

For per-user problem progress, favorites, and notes. Compound key: `(uid, type, slug)`.

| Column | A   | B    | C    | D    | E         | F         |
|--------|-----|------|------|------|-----------|-----------|
| Header | uid | type | slug | data | updatedAt | createdAt |

**`type` values used:**
- `problem-progress` — solved state, attempts, attempts-by-day
- `problem-favorites` — bookmarked problems
- `problem-notes` — private user notes per problem

The `data` column stores a JSON string. Examples:

```
problem-progress:  {"solved":true,"solvedAt":1711234567890,"attempts":5,"attemptsByDay":{"2025-03-22":3}}
problem-favorites: {"slug":"two-sum","addedAt":1711234567890}
problem-notes:     {"content":"Use a hash map for O(n) lookup..."}
```

### Tab: `user_enrollments` (legacy)

Older slim course resume index. Superseded by `course_enrollments` (below) and no longer written by the site; kept only for back-compat. Compound key: `(uid, courseSlug)`.

| Column | A   | B          | C          | D          | E            | F         | G         |
|--------|-----|------------|------------|------------|--------------|-----------|-----------|
| Header | uid | courseSlug  | enrolledAt | lastLesson | lastLessonAt | updatedAt | createdAt |

### Tab: `course_enrollments`

Slim "is the user enrolled / has the course been completed" table. One row per `(uid, courseSlug)`. Written by `saveCourseProgress`.

| Column | A   | B          | C      | D          | E           | F          | G          | H            | I         | J         |
|--------|-----|------------|--------|------------|-------------|------------|------------|--------------|-----------|-----------|
| Header | uid | courseSlug | status | enrolledAt | completedAt | lastModule | lastLesson | lastLessonAt | updatedAt | createdAt |

- `status` — `enrolled` or `completed` (set to `completed` once every module is done)
- `lastModule` / `lastLesson` / `lastLessonAt` — resume pointer

### Tab: `course_module_progress`

Per-module progress for analytics (completion %, time spent, status). One row per `(uid, courseSlug, moduleSlug)`. Written by `saveCourseProgress`.

| Column | A   | B          | C          | D           | E      | F                | G            | H       | I                    | J            | K         | L           | M         | N         |
|--------|-----|------------|------------|-------------|--------|------------------|--------------|---------|----------------------|--------------|-----------|-------------|-----------|-----------|
| Header | uid | courseSlug | moduleSlug | moduleTitle | status | completedLessons | totalLessons | percent | completedLessonSlugs | timeSpentSec | startedAt | completedAt | updatedAt | createdAt |

- `status` — `not_started` / `in_progress` / `completed`
- `completedLessons` / `totalLessons` / `percent` — module roll-up
- `completedLessonSlugs` — JSON array of completed lesson slugs in this module
- `timeSpentSec` — active reading time across the module's lessons (visibility + idle aware)

### Tab: `course_quiz_scores`

Per-quiz results for course knowledge-checks (kept separate from the ranked public `quiz_scores`). One row per `(uid, courseSlug, moduleSlug, lessonSlug)`. Written by `saveCourseProgress`.

| Column | A   | B          | C          | D          | E        | F           | G           | H        | I            | J           | K           | L         | M         |
|--------|-----|------------|------------|------------|----------|-------------|-------------|----------|--------------|-------------|-------------|-----------|-----------|
| Header | uid | courseSlug | moduleSlug | lessonSlug | quizSlug | bestPercent | lastPercent | attempts | passed | passingScore | completedAt | updatedAt | createdAt |

- `bestPercent` / `lastPercent` — best and most-recent score
- `attempts` — number of times the quiz was taken
- `passed` — `bestPercent >= passingScore`

### Tab: `problem_discussions`

For shared problem discussions (visible to all users on a problem page). Key: `slug`.

| Column | A    | B    | C       | D   | E  | F         |
|--------|------|------|---------|-----|----|-----------|
| Header | slug | name | message | uid | ts | timestamp |

- `slug` — problem slug (e.g. `two-sum`)
- `name` — display name of the poster
- `message` — the discussion post content
- `uid` — Firebase UID of the poster (empty if anonymous)
- `ts` — Unix timestamp in milliseconds (for sorting)
- `timestamp` — ISO 8601 string (human-readable)

### Tab: `course_certifications`

Admin-managed course certificates. After a student completes a course and passes their interview rounds, **you fill this row in manually** — the website never writes to this tab. Compound key: `(uid, courseSlug)`.

| Column | A   | B          | C           | D      | E      | F      | G         | H           | I      | J     |
|--------|-----|------------|-------------|--------|--------|--------|-----------|-------------|--------|-------|
| Header | uid | courseSlug | displayName | round1 | round2 | round3 | certified | certifiedAt | certId | notes |

- `uid` — Firebase UID of the student (find it in `user_progress` for their course-enrollment row)
- `courseSlug` — e.g. `react-fundamentals`
- `displayName` — name printed on the certificate
- `round1` / `round2` / `round3` — interview round results; set to `TRUE` once the student passes each round
- `certified` — set to `TRUE` to issue the certificate (the certificate page only renders when this is truthy)
- `certifiedAt` — ISO date or any date string (shown as the issue date)
- `certId` — a unique id you assign (e.g. `DC-REACT-0001`); used for public verification
- `notes` — optional internal notes

Accepted truthy values for `roundN` / `certified`: `TRUE`, `true`, `1`, `yes`, `pass`, `passed`.

> **Note:** The Apps Script auto-creates tabs with headers on first write if they don't exist. `course_certifications` is read-only from the app, so create it manually (with the header row above).

---

## Step 3: Set Up the Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**.
2. This opens the Apps Script editor tied to your spreadsheet.
3. Delete any existing code in the `Code.gs` file.
4. Copy the entire contents of [`scripts/apps-script.js`](../scripts/apps-script.js) from the repository.
5. Paste it into the Apps Script editor.
6. Click **Save** (Ctrl+S / Cmd+S).

### (Recommended) Create all tabs at once

Instead of creating tabs by hand, you can create every tab (with headers) in one step:

1. In the Apps Script editor's function dropdown (top toolbar), select **`setupSheets`**.
2. Click **Run** and authorize if prompted.
3. All tabs — including `course_certifications`, `quiz_scores`, and `community_quizzes` — are created with their header rows. Re-running is safe; existing tabs are left untouched.

> Most tabs are also auto-created on first write. The exceptions are read-only tabs the app never writes to — notably **`course_certifications`** — so running `setupSheets` (or creating it manually) is required before you can issue certificates.

---

## Step 4: Deploy as Web App

1. In the Apps Script editor, click **Deploy > New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure:
   - **Description:** `DailyCoder Backend v1` (or any label)
   - **Execute as:** `Me` (your Google account)
   - **Who has access:** `Anyone`
4. Click **Deploy**.
5. **Authorize** the script when prompted (review permissions, click Allow).
6. Copy the **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbw.../exec
   ```

---

## Step 5: Configure DailyCoder

Add the Web App URL to `content/config.json` in three places:

```json
{
  "newsletter": {
    "enabled": true,
    "googleScriptUrl": "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
  },
  "comments": {
    "enabled": true,
    "googleScriptUrl": "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
  },
  "sync": {
    "enabled": true,
    "googleScriptUrl": "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
  }
}
```

All three can use the same URL — the script routes by `action` parameter.

---

## Step 6: Update the Deployment (after code changes)

When you update the Apps Script code:

1. Go to **Extensions > Apps Script** from the sheet.
2. Paste the new code and save.
3. Click **Deploy > Manage deployments**.
4. Click the **pencil icon** on the active deployment.
5. Change **Version** to **New version**.
6. Click **Deploy**.

> **Important:** If you only save without creating a new version, the old code continues running. You must create a new deployment version for changes to take effect.

---

## API Reference

### GET Actions

| Action           | Parameters              | Returns                                          |
|------------------|-------------------------|--------------------------------------------------|
| `listComments`   | `postSlug`              | `{ status, comments: [{ name, email, comment, timestamp }] }` |
| `getProgress`    | `uid`                   | `{ status, items: [{ type, slug, data, updatedAt }] }` |
| `getEnrollments` | `uid`                   | `{ status, enrollments: [{ courseSlug, enrolledAt, ... }] }` _(legacy)_ |
| `getCourseProgress` | `courseSlug` (optional) | `{ status, enrollment, modules: [...], quizzes: [...] }` (own data only) |
| `getDiscussion`  | `slug`                  | `{ status, posts: [{ name, message, uid, ts, timestamp }] }` |
| `getCertification` | `uid`, `courseSlug`   | `{ status, certification: { courseSlug, displayName, round1, round2, round3, certified, certifiedAt, certId } \| null }` |
| `verifyCertificate` | `certId`             | `{ status, valid, certificate?: { displayName, courseSlug, certifiedAt, certId } }` |

All GET actions support JSONP via `&callback=fnName` parameter.

### POST Actions

| Action             | Content-Type         | Body                                                                 |
|--------------------|----------------------|----------------------------------------------------------------------|
| `subscribe`        | `form-urlencoded`    | `action=subscribe&email=...&source=...&timestamp=...`                |
| `comment`          | `form-urlencoded`    | `action=comment&postSlug=...&name=...&comment=...&timestamp=...`     |
| `saveProgress`     | `application/json`   | `{ action, uid, items: [{ type, slug, data, updatedAt }] }`         |
| `saveEnrollment`   | `application/json`   | `{ action, uid, courseSlug, enrolledAt, lastLesson, ... }` _(legacy)_ |
| `saveCourseProgress` | `text/plain` (JSON) | `{ action, courseSlug, status, enrolledAt, completedAt, lastModule, lastLesson, lastLessonAt, modules: [{ moduleSlug, moduleTitle, status, completedLessons, totalLessons, percent, completedLessonSlugs, timeSpentSec, ... }], quizzes: [{ moduleSlug, lessonSlug, quizSlug, bestPercent, lastPercent, attempts, passed, passingScore, ... }] }` |
| `postDiscussion`   | `application/json`   | `{ action, slug, name, message, uid, timestamp }`                    |

---

## Data Flow Overview

```
Browser (IndexedDB)          Google Apps Script           Google Sheet
       │                            │                         │
       ├── DCStore.set() ──────────>│                         │
       │   (auto-sync via           │── saveProgress ────────>│ user_progress
       │    DCSyncService)          │                         │
       │                            │                         │
       ├── on sign-in ─────────────>│                         │
       │   (pull & merge)           │<── getProgress ────────│ user_progress
       │                            │                         │
       ├── post discussion ────────>│                         │
       │                            │── postDiscussion ──────>│ problem_discussions
       │                            │                         │
       ├── load discussion ────────>│                         │
       │                            │<── getDiscussion ──────│ problem_discussions
       │                            │                         │
       ├── comment form ───────────>│                         │
       │                            │── comment ─────────────>│ comments
       │                            │                         │
```

### What syncs per-user (private):
- Problem progress (solved, attempts)
- Problem favorites (bookmarks)
- Problem notes (private notes)
- Course enrollments (enrolled courses, last lesson)

### What syncs globally (shared):
- Problem discussions (visible to all users)
- Blog/problem comments (visible to all)
- Newsletter subscriptions

---

## Granting Course Certificates (Admin)

Course completion (lessons + quizzes) is tracked automatically in the browser and synced to `user_progress`. The **final certificate is granted manually by you** after the student passes their interview rounds. There is no in-app request flow — you control issuance entirely from the sheet.

1. The student finishes every lesson/module. On `/courses/<slug>/certificate` they see "Course complete — now the interviews" with the round checklist all **Pending**.
2. Schedule and conduct the interview rounds (free, arranged over email).
3. Open the **`course_certifications`** tab and add (or update) the student's row:
   - Find their `uid` in the `user_progress` tab (the row where `type` = `course-enrollment` and `slug` = the course slug).
   - Fill `courseSlug`, `displayName`.
   - Set `round1`, `round2`, `round3` to `TRUE` as they pass each round (the certificate page reflects this live).
   - When all rounds pass, set `certified` to `TRUE`, set `certifiedAt` (e.g. `2026-06-01`), and assign a unique `certId` (e.g. `DC-REACT-0001`).
4. The next time the student loads the certificate page (signed in), it renders their printable certificate.

Anyone can confirm a certificate is genuine by calling `?action=verifyCertificate&certId=<id>`.

---

## Security Model

The Apps Script URL is embedded in the client-side JavaScript (unavoidable for any static site). Security is enforced **server-side** using Firebase ID token verification:

### How it works

1. The client calls `user.getIdToken()` from Firebase Auth to get a short-lived JWT.
2. This token is sent with every request as `idToken` (query param for GET, JSON field for POST).
3. The Apps Script verifies it via the Firebase Identity Toolkit `accounts:lookup` endpoint (`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=<FIREBASE_API_KEY>`), which validates signature/expiry against the project and returns the canonical `uid` (`localId`).
4. The verified `uid` is used for all reads/writes, so a caller can never act as another user.

> ⚠️ Do **not** use `oauth2.googleapis.com/tokeninfo` — it only validates Google OAuth ID tokens and rejects Firebase tokens (issued by `securetoken.google.com`), silently breaking every signed-in feature.

#### Configure the API key (without committing it)

The key is read from **Script Properties**, not hardcoded (GitHub secret scanning flags hardcoded `google_api_key` values). In the Apps Script editor:

1. **Project Settings** (gear icon) → **Script properties** → **Add script property**.
2. Add `FIREBASE_API_KEY` = your `PUBLIC_FIREBASE_API_KEY`, and `FIREBASE_PROJECT_ID` = your `PUBLIC_FIREBASE_PROJECT_ID`.
3. **Create a new deployment version** (Deploy → Manage deployments → edit → New version).

To confirm the live deployment is verifying tokens, hit `?action=authcheck&idToken=<token>` — it returns `{ apiKeyConfigured, tokenVerified, uid }` without ever exposing the key.

### Protection levels

| Endpoint | Protection |
|----------|-----------|
| `getProgress` | Token verified; can only read own data |
| `getEnrollments` | Token verified; can only read own data |
| `saveProgress` | Token verified; uid must match token |
| `saveEnrollment` | Token verified; uid must match token |
| `getCourseProgress` | Token verified; can only read own course rows |
| `saveCourseProgress` | Token verified; rows written under verified uid |
| `postDiscussion` | Token required; post attributed to verified uid |
| `comment` | Token verified if provided; uid overridden by token |
| `getCertification` | Token verified; can only read own certification row |
| `verifyCertificate` | Public (read-only; only confirms validity + name/course) |
| `listComments` | Public (read-only, no sensitive data) |
| `getDiscussion` | Public (read-only, shared content) |
| `subscribe` | Public (newsletter sign-up) |

### What this prevents

- **UID spoofing**: Attackers can't read/write another user's progress, notes, or enrollments.
- **Impersonation in discussions**: Posts are always attributed to the verified Firebase UID.
- **Replay attacks**: Firebase ID tokens expire after 1 hour.

### What this does NOT prevent

- **Rate limiting**: Google Apps Script has its own [daily quotas](https://developers.google.com/apps-script/guides/services/quotas) but no per-IP rate limiting. For a low-traffic site this is fine.
- **Newsletter spam**: The `subscribe` endpoint is public. Consider adding a CAPTCHA if abuse occurs.

---

## Troubleshooting

### "Failed to fetch" errors in browser console
- Verify the Web App URL is correct in `config.json`.
- Check the deployment is set to "Anyone" for access.
- After code changes, make sure you created a **new version** of the deployment.

### Data not appearing in sheets
- Open the Apps Script editor and check **Executions** (left sidebar) for errors.
- Verify the tab names match exactly (case-sensitive).

### CORS issues
- Google Apps Script Web Apps deployed as "Anyone" automatically handle CORS.
- The `subscribe` and `comment` actions use `mode: 'no-cors'` (fire-and-forget).
- Sync actions (`saveProgress`, `getProgress`, etc.) use regular `fetch` and read the response.

### Auth not working
- Ensure Firebase environment variables are set (`PUBLIC_FIREBASE_*`).
- Check the browser console for Firebase initialization errors.
