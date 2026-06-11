/**
 * Http — response helpers (JSON + JSONP).
 *
 * `reply(ctx, obj)` returns JSONP when the request supplied a `callback`
 * parameter, otherwise plain JSON — matching the original behaviour for the
 * public, browser-script-tag-friendly endpoints.
 */
var Http = (function () {
  function json(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj))
      .setMimeType(ContentService.MimeType.JSON);
  }

  function jsonp(obj, callback) {
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(obj) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  // Reply honouring the request's optional JSONP callback (ctx.callback).
  function reply(ctx, obj) {
    if (ctx && ctx.callback) return jsonp(obj, ctx.callback);
    return json(obj);
  }

  function ok(extra) {
    var out = { status: 'success' };
    if (extra) for (var k in extra) if (extra.hasOwnProperty(k)) out[k] = extra[k];
    return json(out);
  }

  function error(message) {
    return json({ status: 'error', message: message });
  }

  return { json: json, jsonp: jsonp, reply: reply, ok: ok, error: error };
})();
