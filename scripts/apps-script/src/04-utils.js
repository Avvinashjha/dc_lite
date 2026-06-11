/**
 * Utils — small shared helpers used across modules.
 */
var Utils = (function () {
  // Interpret a spreadsheet cell as a boolean (handles TRUE/true/1/yes/pass).
  function isTruthyCell(v) {
    if (v === true) return true;
    var s = String(v).trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'yes' || s === 'y' || s === 'pass' || s === 'passed';
  }

  // Slugify matching the client (lowercase, non-alphanumerics → dashes).
  function slugify(value) {
    return String(value || '')
      .toLowerCase().trim()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }

  return { isTruthyCell: isTruthyCell, slugify: slugify };
})();
