/**
 * Discussions module — shared, server-backed problem discussions.
 *   GET  getDiscussion (public, JSONP-capable)
 *   POST postDiscussion (auth required; attributed to verified uid)
 *   Tab: problem_discussions
 */
var Discussions = (function () {
  function get(ctx) {
    var slug = ctx.e.parameter.slug || '';
    if (!slug) return Http.error('Missing slug');

    var data = DB.values('problem_discussions');
    var posts = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === slug) {
        posts.push({
          name: data[i][1],
          message: data[i][2],
          uid: data[i][3],
          ts: data[i][4],
          timestamp: data[i][5]
        });
      }
    }
    // Newest first
    posts.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });

    return Http.reply(ctx, { status: 'success', posts: posts });
  }

  function post(ctx) {
    var params = ctx.params;
    var uid = ctx.getUid();
    if (!uid) return Http.error('Authentication required');

    var slug = params.slug || '';
    var name = params.name || 'Anonymous';
    var message = params.message || '';
    var timestamp = params.timestamp || new Date().toISOString();

    if (!slug || !message) {
      return Http.error('slug and message required');
    }

    var sheet = DB.ensure('problem_discussions');
    var ts = new Date(timestamp).getTime() || Date.now();
    sheet.appendRow([slug, name, message, uid, ts, timestamp]);

    return Http.ok();
  }

  return { get: get, post: post };
})();
