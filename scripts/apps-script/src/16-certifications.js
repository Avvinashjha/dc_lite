/**
 * Certifications module — admin-managed course certificates.
 *   GET getCertification (auth; own row only)
 *   GET verifyCertificate (public; confirms validity + name/course, JSONP-capable)
 *   Tab: course_certifications (rows are filled in manually by an admin)
 */
var Certifications = (function () {
  function get(ctx) {
    var uid = ctx.getUid();
    if (!uid) return Http.error('Authentication required');

    var courseSlug = ctx.e.parameter.courseSlug || '';
    if (!courseSlug) return Http.error('Missing courseSlug');

    var data = DB.values('course_certifications');
    for (var ci = 1; ci < data.length; ci++) {
      if (data[ci][0] === uid && data[ci][1] === courseSlug) {
        return Http.json({
          status: 'success',
          certification: {
            courseSlug: data[ci][1],
            displayName: data[ci][2],
            round1: data[ci][3],
            round2: data[ci][4],
            round3: data[ci][5],
            certified: data[ci][6],
            certifiedAt: data[ci][7],
            certId: data[ci][8]
          }
        });
      }
    }
    return Http.json({ status: 'success', certification: null });
  }

  function verify(ctx) {
    var certId = ctx.e.parameter.certId || '';
    if (!certId) return Http.error('Missing certId');

    var data = DB.values('course_certifications');
    var result = { status: 'success', valid: false };
    for (var vi = 1; vi < data.length; vi++) {
      if (String(data[vi][8]) === String(certId) && Utils.isTruthyCell(data[vi][6])) {
        result = {
          status: 'success',
          valid: true,
          certificate: {
            displayName: data[vi][2],
            courseSlug: data[vi][1],
            certifiedAt: data[vi][7],
            certId: data[vi][8]
          }
        };
        break;
      }
    }
    return Http.reply(ctx, result);
  }

  return { get: get, verify: verify };
})();
