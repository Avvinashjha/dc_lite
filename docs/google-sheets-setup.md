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

### Tab: `user_enrollments`

For course enrollment and lesson tracking. Compound key: `(uid, courseSlug)`.

| Column | A   | B          | C          | D          | E            | F         | G         |
|--------|-----|------------|------------|------------|--------------|-----------|-----------|
| Header | uid | courseSlug  | enrolledAt | lastLesson | lastLessonAt | updatedAt | createdAt |

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

> **Note:** The Apps Script auto-creates tabs with headers on first write if they don't exist. You can either create them manually (recommended for clarity) or let the script create them.

---

## Step 3: Set Up the Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**.
2. This opens the Apps Script editor tied to your spreadsheet.
3. Delete any existing code in the `Code.gs` file.
4. Copy the entire contents of [`scripts/apps-script.js`](../scripts/apps-script.js) from the repository.
5. Paste it into the Apps Script editor.
6. Click **Save** (Ctrl+S / Cmd+S).

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
| `getEnrollments` | `uid`                   | `{ status, enrollments: [{ courseSlug, enrolledAt, ... }] }` |
| `getDiscussion`  | `slug`                  | `{ status, posts: [{ name, message, uid, ts, timestamp }] }` |

All GET actions support JSONP via `&callback=fnName` parameter.

### POST Actions

| Action             | Content-Type         | Body                                                                 |
|--------------------|----------------------|----------------------------------------------------------------------|
| `subscribe`        | `form-urlencoded`    | `action=subscribe&email=...&source=...&timestamp=...`                |
| `comment`          | `form-urlencoded`    | `action=comment&postSlug=...&name=...&comment=...&timestamp=...`     |
| `saveProgress`     | `application/json`   | `{ action, uid, items: [{ type, slug, data, updatedAt }] }`         |
| `saveEnrollment`   | `application/json`   | `{ action, uid, courseSlug, enrolledAt, lastLesson, ... }`           |
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

## Security Model

The Apps Script URL is embedded in the client-side JavaScript (unavoidable for any static site). Security is enforced **server-side** using Firebase ID token verification:

### How it works

1. The client calls `user.getIdToken()` from Firebase Auth to get a short-lived JWT.
2. This token is sent with every request as `idToken` (query param for GET, JSON field for POST).
3. The Apps Script calls Google's `oauth2.googleapis.com/tokeninfo` endpoint to verify the token.
4. The verified `uid` from the token is compared against the claimed `uid` — mismatches are rejected.

### Protection levels

| Endpoint | Protection |
|----------|-----------|
| `getProgress` | Token verified; can only read own data |
| `getEnrollments` | Token verified; can only read own data |
| `saveProgress` | Token verified; uid must match token |
| `saveEnrollment` | Token verified; uid must match token |
| `postDiscussion` | Token required; post attributed to verified uid |
| `comment` | Token verified if provided; uid overridden by token |
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
