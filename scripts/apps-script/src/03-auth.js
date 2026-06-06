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

  return { verify: verify, uidFrom: uidFrom };
})();
