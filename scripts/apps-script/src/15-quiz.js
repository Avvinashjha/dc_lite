/**
 * Quiz module — community quizzes + ranked leaderboards.
 *   GET  listCommunityQuizzes, getLeaderboard (public, JSONP-capable)
 *   POST createQuiz, submitScore (uses client-supplied uid)
 *   Tabs: community_quizzes, quiz_scores
 *
 * AUTH: token verification is temporarily disabled for the POST actions — the
 * client only issues them for signed-in users and sends its own `uid`. Server-
 * side token verification will be reinstated later (swap params.uid back to
 * ctx.getUid()).
 */
var Quiz = (function () {
  function listCommunity(ctx) {
    var data = DB.values('community_quizzes');
    var quizzes = [];
    for (var i = 1; i < data.length; i++) {
      var quizJson = data[i][6];
      if (!quizJson) continue;
      try {
        quizzes.push(JSON.parse(quizJson));
      } catch (ex) { /* skip malformed row */ }
    }
    return Http.reply(ctx, { status: 'success', quizzes: quizzes });
  }

  // Best score per user, fastest time as tiebreaker.
  function leaderboard(ctx) {
    var quizSlug = ctx.e.parameter.quizSlug || '';
    var limit = parseInt(ctx.e.parameter.limit, 10) || 20;
    if (!quizSlug) return Http.error('Missing quizSlug');

    var data = DB.values('quiz_scores');
    var best = {};
    for (var j = 1; j < data.length; j++) {
      if (data[j][0] !== quizSlug) continue;
      var lbUid = data[j][1];
      var entry = {
        uid: lbUid,
        displayName: data[j][2],
        score: Number(data[j][3]) || 0,
        maxScore: Number(data[j][4]) || 0,
        timeSec: Number(data[j][5]) || 0,
        completedAt: data[j][6]
      };
      var prev = best[lbUid];
      if (!prev || entry.score > prev.score ||
          (entry.score === prev.score && entry.timeSec < prev.timeSec)) {
        best[lbUid] = entry;
      }
    }
    var scores = Object.keys(best).map(function (k) { return best[k]; });
    scores.sort(function (a, b) {
      return b.score - a.score || a.timeSec - b.timeSec;
    });
    return Http.reply(ctx, { status: 'success', scores: scores.slice(0, limit) });
  }

  function create(ctx) {
    var params = ctx.params;
    var uid = params.uid || '';
    if (!uid) return Http.error('Missing uid');

    var quiz = params.quiz;
    if (!quiz || !quiz.title || !Array.isArray(quiz.questions) || !quiz.questions.length) {
      return Http.error('Invalid quiz');
    }

    var cqSheet = DB.ensure('community_quizzes');

    // Ensure a unique slug.
    var baseSlug = Utils.slugify(quiz.slug || quiz.title) || ('quiz-' + Date.now());
    var cqExisting = cqSheet.getDataRange().getValues();
    var used = {};
    for (var i = 1; i < cqExisting.length; i++) used[cqExisting[i][0]] = true;
    var newSlug = baseSlug, n = 2;
    while (used[newSlug]) { newSlug = baseSlug + '-' + n; n++; }

    // Force trusted server-side fields.
    quiz.slug = newSlug;
    quiz.id = newSlug;
    quiz.source = 'community';
    quiz.ranked = false;

    cqSheet.appendRow([
      newSlug,
      quiz.title,
      quiz.category || 'General',
      quiz.difficulty || 'easy',
      quiz.author || 'Anonymous',
      uid,
      JSON.stringify(quiz),
      new Date().toISOString()
    ]);

    return Http.json({ status: 'success', slug: newSlug });
  }

  function submitScore(ctx) {
    var params = ctx.params;
    var uid = params.uid || '';
    if (!uid) return Http.error('Missing uid');

    if (!params.quizSlug) return Http.error('Missing quizSlug');

    var ssSheet = DB.ensure('quiz_scores');
    ssSheet.appendRow([
      params.quizSlug,
      uid,
      params.displayName || 'Anonymous',
      Number(params.score) || 0,
      Number(params.maxScore) || 0,
      Number(params.timeSec) || 0,
      params.completedAt || new Date().toISOString(),
      new Date().toISOString()
    ]);

    return Http.ok();
  }

  return {
    listCommunity: listCommunity,
    leaderboard: leaderboard,
    create: create,
    submitScore: submitScore
  };
})();
