/**
 * Router — request entry points (doGet/doPost), dispatch tables, setup + debug.
 *
 * This file MUST load last: the dispatch-table literals below reference the
 * module namespaces (Comments, Progress, ...) defined in earlier files. The
 * numeric filename prefixes guarantee that order in the bundle.
 *
 * The external contract is unchanged: same single Web App URL, same action
 * names, same response shapes as the previous monolithic script.
 */

// ─── Debug / meta actions ────────────────────────────────────────────────────
var Debug = (function () {
  // ?action=authcheck&idToken=<token> — confirm the live deployment is running
  // this build and whether token verification succeeds. Never leaks the API key.
  function authcheck(ctx) {
    var apiKey = Config.firebaseApiKey();
    var token = ctx.e.parameter.idToken || '';
    var dbg = token ? Auth.lookupDebug(token) : null;
    return Http.reply(ctx, {
      status: 'success',
      build: Config.BUILD,
      verifier: 'identitytoolkit/accounts:lookup',
      apiKeyConfigured: !!apiKey,
      tokenProvided: !!token,
      tokenVerified: !!(dbg && dbg.uid),
      uid: dbg ? dbg.uid : null,
      lookupHttpCode: dbg ? dbg.httpCode : null,
      lookupErrorStatus: dbg ? dbg.errorStatus : '',
      lookupErrorMessage: dbg ? dbg.errorMessage : ''
    });
  }

  // ?action=version — lightweight build stamp for deploy verification.
  function version(ctx) {
    return Http.reply(ctx, {
      status: 'success',
      build: Config.BUILD,
      verifier: 'identitytoolkit/accounts:lookup',
      time: new Date().toISOString()
    });
  }

  return { authcheck: authcheck, version: version };
})();

// ─── Dispatch tables (action name → handler) ─────────────────────────────────
var GET_ROUTES = {
  authcheck: Debug.authcheck,
  version: Debug.version,
  listComments: Comments.list,
  getProgress: Progress.get,
  getEnrollments: Progress.getEnrollments,
  getCourseProgress: Courses.getProgress,
  getDiscussion: Discussions.get,
  listCommunityQuizzes: Quiz.listCommunity,
  getLeaderboard: Quiz.leaderboard,
  getCertification: Certifications.get,
  verifyCertificate: Certifications.verify
};

var POST_ROUTES = {
  subscribe: Newsletter.subscribe,
  comment: Comments.create,
  saveProgress: Progress.save,
  saveEnrollment: Progress.saveEnrollment,
  saveCourseProgress: Courses.saveProgress,
  postDiscussion: Discussions.post,
  createQuiz: Quiz.create,
  submitScore: Quiz.submitScore
};

// ─── Request context ─────────────────────────────────────────────────────────
// Normalizes a request and lazily verifies the Firebase token (cached).
function makeContext(e, params, action, callback) {
  var ctx = {
    e: e,
    params: params || {},
    action: action || '',
    callback: callback || '',
    _uid: undefined
  };
  ctx.getUid = function () {
    if (ctx._uid === undefined) ctx._uid = Auth.uidFrom(ctx.e, ctx.params);
    return ctx._uid;
  };
  return ctx;
}

// ─── Entry points ────────────────────────────────────────────────────────────
function doGet(e) {
  var action = (e.parameter.action || '').trim();
  var callback = e.parameter.callback || '';
  var ctx = makeContext(e, e.parameter, action, callback);

  var handler = GET_ROUTES[action];
  if (!handler) return Http.reply(ctx, { status: 'error', message: 'Unknown action' });
  return handler(ctx);
}

function doPost(e) {
  var contentType = e.postData ? e.postData.type : '';
  var action = '';
  var params = {};

  // Action from JSON body (sent as text/plain to avoid CORS preflight) or form data.
  if (contentType === 'application/json' || contentType === 'text/plain') {
    try {
      params = JSON.parse(e.postData.contents);
      action = params.action || '';
    } catch (ex) {
      return Http.error('Invalid JSON');
    }
  } else {
    action = e.parameter.action || '';
    params = e.parameter;
  }

  var ctx = makeContext(e, params, action, '');

  var handler = POST_ROUTES[action];
  if (!handler) return Http.json({ status: 'error', message: 'Unknown action: ' + action });
  return handler(ctx);
}

/**
 * One-time setup: creates every registered tab (with headers) if missing.
 * Run once from the Apps Script editor (select `setupSheets`, then Run).
 * Safe to re-run: existing tabs are left untouched.
 */
function setupSheets() {
  DB.allNames().forEach(function (name) { DB.ensure(name); });
  return 'Sheets ready';
}
