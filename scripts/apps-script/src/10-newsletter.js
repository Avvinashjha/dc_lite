/**
 * Newsletter module — public newsletter sign-up.
 *   POST subscribe
 *   Tab: subscribers
 */
var Newsletter = (function () {
  function subscribe(ctx) {
    var params = ctx.params, e = ctx.e;
    var email = params.email || e.parameter.email || '';
    var source = params.source || e.parameter.source || 'website';
    var timestamp = params.timestamp || e.parameter.timestamp || new Date().toISOString();

    if (!email) return Http.error('Email required');

    var sheet = DB.ensure('subscribers');
    var id = Utilities.getUuid();
    sheet.appendRow([id, email, source, timestamp]);

    return Http.ok();
  }

  return { subscribe: subscribe };
})();
