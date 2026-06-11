/**
 * Auth — Firebase ID token verification.
 *
 * NOTE: Google's `oauth2.googleapis.com/tokeninfo` endpoint does NOT work for
 * Firebase ID tokens — those are issued by `securetoken.google.com`, not
 * Google's OAuth IdP, so tokeninfo rejects them. `accounts:lookup` validates
 * the token against the Firebase project (signature + expiry) and returns the
 * user record, whose `localId` is the Firebase uid.
 */
var Auth = (function () {
  // Returns { uid, email, name } on success, or null if the token is invalid.
  function verify(idToken) {
    if (!idToken) return null;
    var apiKey = Config.firebaseApiKey();
    if (!apiKey || apiKey === 'YOUR_FIREBASE_WEB_API_KEY') {
      // Misconfigured: fail closed so we never trust an unverified token.
      return null;
    }
    try {
      var url = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' +
        encodeURIComponent(apiKey);
      var res = UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ idToken: idToken }),
        muteHttpExceptions: true
      });
      if (res.getResponseCode() !== 200) return null;
      var body = JSON.parse(res.getContentText());
      var users = body.users || [];
      if (!users.length || !users[0].localId) return null;
      var u = users[0];
      return { uid: u.localId, email: u.email || '', name: u.displayName || '' };
    } catch (ex) {
      return null;
    }
  }

  /**
   * Extract + verify the token from a request. Apps Script Web Apps receive the
   * token via `e.parameter.idToken` (GET) or the JSON body (`params.idToken`, POST).
   * Returns the verified uid or null.
   */
  function uidFrom(e, params) {
    var token = (params && params.idToken) || (e && e.parameter && e.parameter.idToken) || '';
    if (!token) return null;
    var verified = verify(token);
    return verified ? verified.uid : null;
  }

  /**
   * Diagnostic-only: surfaces the raw accounts:lookup HTTP status + error so a
   * failing verification can be diagnosed via `?action=authcheck`. Never returns
   * the API key. Used by Debug.authcheck only.
   */
  function lookupDebug(idToken) {
    var out = { httpCode: null, errorMessage: '', errorStatus: '', uid: null };
    if (!idToken) { out.errorMessage = 'no token provided'; return out; }
    var apiKey = Config.firebaseApiKey();
    if (!apiKey || apiKey === 'YOUR_FIREBASE_WEB_API_KEY') {
      out.errorMessage = 'api key not configured';
      return out;
    }
    try {
      var url = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' +
        encodeURIComponent(apiKey);
      var res = UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ idToken: idToken }),
        muteHttpExceptions: true
      });
      out.httpCode = res.getResponseCode();
      var body = {};
      try { body = JSON.parse(res.getContentText()); } catch (exP) { body = {}; }
      if (out.httpCode === 200) {
        var users = body.users || [];
        out.uid = (users.length && users[0].localId) ? users[0].localId : null;
        if (!out.uid) out.errorMessage = 'lookup returned no user';
      } else if (body.error) {
        out.errorStatus = body.error.status || '';
        out.errorMessage = body.error.message || '';
      } else {
        out.errorMessage = 'non-200 with no error body';
      }
    } catch (ex) {
      out.errorMessage = 'fetch threw: ' + (ex && ex.message ? ex.message : String(ex));
    }
    return out;
  }

  return { verify: verify, uidFrom: uidFrom, lookupDebug: lookupDebug };
})();
