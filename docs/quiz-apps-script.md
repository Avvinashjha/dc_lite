# Quiz module — Google Apps Script backend

The Quiz module is fully functional with **curated quizzes and local/practice play
without any backend**. The optional Google Apps Script below powers the
*community* features:

- **`createQuiz`** — publish a user-created quiz (stored in a Sheet).
- **`listCommunityQuizzes`** — list all community quizzes.
- **`submitScore`** — record a ranked-quiz score.
- **`getLeaderboard`** — read top scores for a quiz.

It follows the exact same conventions as the existing site script
(`scripts/apps-script.js`): action-based dispatch, JSON responses, POST bodies
sent as `text/plain` (to avoid CORS preflight), and Firebase ID-token
verification via the Identity Toolkit `accounts:lookup` endpoint (set
`FIREBASE_API_KEY` in the script; the `tokeninfo` endpoint does **not** work for
Firebase tokens).

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

1. Create a new Google Sheet (or reuse the one backing your existing site script).
2. **Extensions → Apps Script**.
3. Paste the code from [section 3](#3-apps-script-code) into a `.gs` file.
   - You can either add it to your **existing** site Apps Script project (the
     `doGet`/`doPost` here use different `action` values, so they won't clash —
     just merge the `if (action === ...)` blocks into your existing handlers), or
     deploy it as a **separate** project with its own URL.

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

```javascript
/**
 * DailyCoder — Quiz backend (community quizzes + leaderboards).
 *
 * Deploy as Web App: Execute as "Me", Access "Anyone".
 * Create a NEW deployment version after each edit.
 *
 * Sheet tabs used:
 *   - community_quizzes   (slug, title, category, difficulty, author, uid, quizJson, createdAt)
 *   - quiz_scores         (quizSlug, uid, displayName, score, maxScore, timeSec, completedAt, createdAt)
 */

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length) sheet.appendRow(headers);
  }
  return sheet;
}

/** Verify a Firebase ID token via Google's tokeninfo endpoint. */
function verifyFirebaseToken(idToken) {
  if (!idToken) return null;
  try {
    var url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken);
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) return null;
    var payload = JSON.parse(res.getContentText());
    if (!payload.sub) return null;
    return { uid: payload.sub, email: payload.email || '', name: payload.name || '' };
  } catch (ex) {
    return null;
  }
}

function getAuthUid(params) {
  var token = (params && params.idToken) || '';
  if (!token) return null;
  var verified = verifyFirebaseToken(token);
  return verified ? verified.uid : null;
}

/** Basic slugify matching the client (lowercase, non-alphanumerics → dashes). */
function slugify(value) {
  return String(value || '')
    .toLowerCase().trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

// ─── GET ───────────────────────────────────────────────────────────────────

function doGet(e) {
  var action = (e.parameter.action || '').trim();

  if (action === 'listCommunityQuizzes') {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('community_quizzes');
    var quizzes = [];
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        var quizJson = data[i][6];
        if (!quizJson) continue;
        try {
          quizzes.push(JSON.parse(quizJson));
        } catch (ex) { /* skip malformed row */ }
      }
    }
    return jsonResponse({ status: 'success', quizzes: quizzes });
  }

  if (action === 'getLeaderboard') {
    var quizSlug = e.parameter.quizSlug || '';
    var limit = parseInt(e.parameter.limit, 10) || 20;
    if (!quizSlug) return jsonResponse({ status: 'error', message: 'Missing quizSlug' });

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('quiz_scores');
    var scores = [];
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      // Keep only each user's BEST score for this quiz.
      var best = {};
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] !== quizSlug) continue;
        var uid = data[i][1];
        var entry = {
          uid: uid,
          displayName: data[i][2],
          score: Number(data[i][3]) || 0,
          maxScore: Number(data[i][4]) || 0,
          timeSec: Number(data[i][5]) || 0,
          completedAt: data[i][6]
        };
        var prev = best[uid];
        // Higher score wins; ties broken by faster time.
        if (!prev || entry.score > prev.score ||
            (entry.score === prev.score && entry.timeSec < prev.timeSec)) {
          best[uid] = entry;
        }
      }
      scores = Object.keys(best).map(function (k) { return best[k]; });
    }
    scores.sort(function (a, b) {
      return b.score - a.score || a.timeSec - b.timeSec;
    });
    return jsonResponse({ status: 'success', scores: scores.slice(0, limit) });
  }

  return jsonResponse({ status: 'error', message: 'Unknown action' });
}

// ─── POST ──────────────────────────────────────────────────────────────────

function doPost(e) {
  var params = {};
  try {
    params = JSON.parse(e.postData.contents);
  } catch (ex) {
    return jsonResponse({ status: 'error', message: 'Invalid JSON' });
  }
  var action = params.action || '';

  if (action === 'createQuiz') {
    var uid = getAuthUid(params);
    if (!uid) return jsonResponse({ status: 'error', message: 'Authentication required' });

    var quiz = params.quiz;
    if (!quiz || !quiz.title || !Array.isArray(quiz.questions) || !quiz.questions.length) {
      return jsonResponse({ status: 'error', message: 'Invalid quiz' });
    }

    var sheet = getOrCreateSheet('community_quizzes',
      ['slug', 'title', 'category', 'difficulty', 'author', 'uid', 'quizJson', 'createdAt']);

    // Ensure a unique slug.
    var baseSlug = slugify(quiz.slug || quiz.title) || ('quiz-' + Date.now());
    var existing = sheet.getDataRange().getValues();
    var used = {};
    for (var i = 1; i < existing.length; i++) used[existing[i][0]] = true;
    var slug = baseSlug, n = 2;
    while (used[slug]) { slug = baseSlug + '-' + n; n++; }

    // Force trusted server-side fields.
    quiz.slug = slug;
    quiz.id = slug;
    quiz.source = 'community';
    quiz.ranked = false;

    sheet.appendRow([
      slug,
      quiz.title,
      quiz.category || 'General',
      quiz.difficulty || 'easy',
      quiz.author || 'Anonymous',
      uid,
      JSON.stringify(quiz),
      new Date().toISOString()
    ]);

    return jsonResponse({ status: 'success', slug: slug });
  }

  if (action === 'submitScore') {
    var uid = getAuthUid(params);
    if (!uid) return jsonResponse({ status: 'error', message: 'Authentication required' });

    if (!params.quizSlug) return jsonResponse({ status: 'error', message: 'Missing quizSlug' });

    var sheet = getOrCreateSheet('quiz_scores',
      ['quizSlug', 'uid', 'displayName', 'score', 'maxScore', 'timeSec', 'completedAt', 'createdAt']);

    sheet.appendRow([
      params.quizSlug,
      uid,
      params.displayName || 'Anonymous',
      Number(params.score) || 0,
      Number(params.maxScore) || 0,
      Number(params.timeSec) || 0,
      params.completedAt || new Date().toISOString(),
      new Date().toISOString()
    ]);

    return jsonResponse({ status: 'success' });
  }

  return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
}
```

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
