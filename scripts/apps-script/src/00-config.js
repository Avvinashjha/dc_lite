/**
 * Config — runtime configuration, read from Script Properties.
 *
 * The Firebase Web API key is read from Script Properties so it is NOT stored in
 * any committed source file (GitHub secret scanning flags hardcoded
 * google_api_key values, even though Firebase web keys are public identifiers).
 *
 * SET IT ONCE in the Apps Script editor:
 *   Project Settings (gear icon) → Script properties → Add script property
 *     name:  FIREBASE_API_KEY     value: <your PUBLIC_FIREBASE_API_KEY>
 *     name:  FIREBASE_PROJECT_ID  value: <your PUBLIC_FIREBASE_PROJECT_ID>
 *
 * The fallback constants are intentionally blank; leave them blank in git.
 */
var Config = (function () {
  var FIREBASE_API_KEY = '';      // fallback only — prefer the script property
  var FIREBASE_PROJECT_ID = '';   // fallback only — prefer the script property

  // Bump when redeploying so `?action=version` / `authcheck` can confirm the
  // live deployment is running the latest bundle.
  var BUILD = 'modular-v1';

  function get(name, fallback) {
    try {
      var v = PropertiesService.getScriptProperties().getProperty(name);
      if (v) return v;
    } catch (ex) { /* PropertiesService unavailable in some contexts */ }
    return fallback || '';
  }

  function firebaseApiKey() {
    return get('FIREBASE_API_KEY', FIREBASE_API_KEY);
  }

  function firebaseProjectId() {
    return get('FIREBASE_PROJECT_ID', FIREBASE_PROJECT_ID);
  }

  return {
    BUILD: BUILD,
    get: get,
    firebaseApiKey: firebaseApiKey,
    firebaseProjectId: firebaseProjectId
  };
})();
