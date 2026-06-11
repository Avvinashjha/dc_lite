/**
 * Comments module — blog/problem comments.
 *   GET  listComments (public, JSONP-capable)
 *   POST comment       (uid attributed to verified token when provided)
 *   Tab: comments
 */
var Comments = (function () {
  function list(ctx) {
    var postSlug = ctx.e.parameter.postSlug || '';
    var data = DB.values('comments');
    var comments = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === postSlug) {
        comments.push({
          name: data[i][3],
          email: data[i][4],
          comment: data[i][5],
          timestamp: data[i][6]
        });
      }
    }
    return Http.reply(ctx, { status: 'success', comments: comments });
  }

  function create(ctx) {
    var params = ctx.params, e = ctx.e;
    var verifiedUid = ctx.getUid();
    var postSlug = params.postSlug || e.parameter.postSlug || '';
    var postTitle = params.postTitle || e.parameter.postTitle || '';
    var name = params.name || e.parameter.name || 'Anonymous';
    var email = params.email || e.parameter.email || '';
    var comment = params.comment || e.parameter.comment || '';
    var timestamp = params.timestamp || e.parameter.timestamp || new Date().toISOString();
    var uid = verifiedUid || params.uid || e.parameter.uid || '';

    if (!comment || !postSlug) {
      return Http.error('Comment and postSlug required');
    }

    var sheet = DB.ensure('comments');
    var id = Utilities.getUuid();
    sheet.appendRow([id, postSlug, postTitle, name, email, comment, timestamp, uid]);

    return Http.ok();
  }

  return { list: list, create: create };
})();
