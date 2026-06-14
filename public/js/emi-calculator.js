/**
 * EMI Calculator logic for DailyCoder.
 * - Computes the standard EMI for a loan.
 * - Runs an amortization engine for three scenarios: no prepayment,
 *   reduce term (fixed EMI) and reduce EMI (fixed tenure).
 * - Supports monthly, yearly and random-month prepayments.
 * - Saves named plans via DCStore (IndexedDB, synced across devices).
 *
 * INR only. All currency display uses Intl.NumberFormat('en-IN').
 */
(function () {
  'use strict';

  var TOOL = 'emi-calculator';
  var MAX_MONTHS = 1200; // safety cap (100 years)

  var inrFmt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

  function formatINR(n) {
    if (!isFinite(n)) n = 0;
    return '₹' + inrFmt.format(Math.round(n));
  }

  function formatYears(months) {
    var y = months / 12;
    return (Math.round(y * 10) / 10).toString();
  }

  /** Compact INR for chart axes / insights (Cr / L). */
  function formatINRShort(n) {
    if (!isFinite(n)) n = 0;
    var abs = Math.abs(n);
    if (abs >= 1e7) return '₹' + (Math.round((n / 1e7) * 100) / 100) + ' Cr';
    if (abs >= 1e5) return '₹' + (Math.round((n / 1e5) * 10) / 10) + ' L';
    return '₹' + inrFmt.format(Math.round(n));
  }

  /** Render months as "Xy Ym". */
  function formatDuration(months) {
    var y = Math.floor(months / 12);
    var m = Math.round(months % 12);
    if (m === 12) { y += 1; m = 0; }
    var parts = [];
    if (y > 0) parts.push(y + 'y');
    if (m > 0) parts.push(m + 'm');
    return parts.length ? parts.join(' ') : '0m';
  }

  var COLORS = { none: '#64748b', term: '#16a34a', emi: '#f59e0b' };

  function $(id) {
    return document.getElementById(id);
  }

  /** Standard EMI / annuity payment. */
  function pmt(principal, monthlyRate, months) {
    if (months <= 0) return principal;
    if (monthlyRate === 0) return principal / months;
    var pow = Math.pow(1 + monthlyRate, months);
    return (principal * monthlyRate * pow) / (pow - 1);
  }

  /**
   * Run the amortization schedule.
   * strategy: 'none' | 'term' | 'emi'
   * Returns { rows, totalInterest, totalPrepay, totalPaid, principalPaid, months }.
   */
  function amortize(opts) {
    var principal = opts.principal;
    var monthlyRate = opts.monthlyRate;
    var baseMonths = opts.months;
    var baseEMI = opts.baseEMI;
    var strategy = opts.strategy;
    var prepay = opts.prepay; // { monthly, yearly, yearlyMonth, random: [{month, amount}] }

    var rows = [];
    var balance = principal;
    var totalInterest = 0;
    var totalPrepay = 0;
    var m = 0;

    while (balance > 0.005 && m < MAX_MONTHS) {
      m++;
      var remainingMonths = baseMonths - (m - 1);

      var emiThisMonth;
      if (strategy === 'emi') {
        // Fixed tenure: recompute EMI on the remaining balance for the months left.
        emiThisMonth = pmt(balance, monthlyRate, remainingMonths > 0 ? remainingMonths : 1);
      } else {
        emiThisMonth = baseEMI;
      }

      var interest = balance * monthlyRate;
      var principalComponent = emiThisMonth - interest;

      // Final payment guard: never pay more principal than what is owed.
      if (principalComponent > balance) {
        principalComponent = balance;
        emiThisMonth = principalComponent + interest;
      }

      var afterEMI = balance - principalComponent;

      // Prepayment only applies to strategies that use it.
      var prepayThisMonth = 0;
      if (strategy !== 'none') {
        prepayThisMonth += prepay.monthly || 0;
        if ((prepay.yearly || 0) > 0 && prepay.yearlyMonth > 0 && m % 12 === (prepay.yearlyMonth % 12)) {
          prepayThisMonth += prepay.yearly;
        }
        if (prepay.random && prepay.random.length) {
          for (var i = 0; i < prepay.random.length; i++) {
            if (prepay.random[i].month === m) prepayThisMonth += prepay.random[i].amount;
          }
        }
        if (prepayThisMonth > afterEMI) prepayThisMonth = afterEMI; // never overpay
        if (prepayThisMonth < 0) prepayThisMonth = 0;
      }

      var newBalance = afterEMI - prepayThisMonth;

      rows.push({
        month: m - 1, // "Start of Month" index, matches the sheet (0-based)
        outstanding: balance,
        emi: emiThisMonth,
        interest: interest,
        principal: principalComponent,
        outstandingRemaining: afterEMI,
        prepayment: prepayThisMonth,
        newOutstanding: newBalance,
      });

      totalInterest += interest;
      totalPrepay += prepayThisMonth;
      balance = newBalance;
    }

    var principalPaid = principal; // loan fully repaid in every scenario
    return {
      rows: rows,
      totalInterest: totalInterest,
      totalPrepay: totalPrepay,
      principalPaid: principalPaid,
      totalPaid: principalPaid + totalInterest,
      months: m,
    };
  }

  /** Read the random-month prepayment rows from the DOM. */
  function readRandom() {
    var out = [];
    var rows = document.querySelectorAll('#emi-random-list .emi-random-row');
    rows.forEach(function (row) {
      var monthEl = row.querySelector('.emi-random-month');
      var amountEl = row.querySelector('.emi-random-amount');
      var month = parseInt(monthEl && monthEl.value, 10);
      var amount = parseFloat(amountEl && amountEl.value);
      if (month > 0 && amount > 0) out.push({ month: month, amount: amount });
    });
    return out;
  }

  function readInputs() {
    var amount = parseFloat($('emi-amount').value) || 0;
    var rate = parseFloat($('emi-rate').value) || 0;
    var tenure = parseFloat($('emi-tenure').value) || 0;
    var monthly = parseFloat($('emi-prepay-monthly').value) || 0;
    var yearly = parseFloat($('emi-prepay-yearly').value) || 0;
    var yearlyMonth = parseInt($('emi-prepay-yearly-month').value, 10) || 12;
    return {
      amount: amount,
      rate: rate,
      tenure: tenure,
      monthly: monthly,
      yearly: yearly,
      yearlyMonth: yearlyMonth,
      random: readRandom(),
    };
  }

  function buildScheduleTable(result, strategy) {
    var showEmiCol = strategy === 'emi';
    var head =
      '<thead><tr>' +
      '<th>Start of Month</th>' +
      '<th>Outstanding</th>' +
      (showEmiCol ? '<th>EMI</th>' : '') +
      '<th>Interest Paid</th>' +
      '<th>Principal Paid</th>' +
      '<th>Outstanding Remaining</th>' +
      '<th class="emi-col-prepay">Prepayment</th>' +
      '<th>New Outstanding</th>' +
      '</tr></thead>';

    var body = '';
    for (var i = 0; i < result.rows.length; i++) {
      var r = result.rows[i];
      body +=
        '<tr>' +
        '<td>' + r.month + '</td>' +
        '<td>' + formatINR(r.outstanding) + '</td>' +
        (showEmiCol ? '<td>' + formatINR(r.emi) + '</td>' : '') +
        '<td>' + formatINR(r.interest) + '</td>' +
        '<td>' + formatINR(r.principal) + '</td>' +
        '<td>' + formatINR(r.outstandingRemaining) + '</td>' +
        '<td class="emi-prepay-cell">' + formatINR(r.prepayment) + '</td>' +
        '<td>' + formatINR(r.newOutstanding) + '</td>' +
        '</tr>';
    }
    return '<div class="emi-table-wrap"><table class="emi-table">' + head + '<tbody>' + body + '</tbody></table></div>';
  }

  function buildSummary(none, term, emi) {
    var termSaved = none.totalPaid - term.totalPaid;
    var emiSaved = none.totalPaid - emi.totalPaid;
    var anySaving = termSaved > 0.5 || emiSaved > 0.5;
    var best = termSaved >= emiSaved ? 'term' : 'emi';

    function rowDl(label, value) {
      return '<div class="emi-sumrow"><dt>' + label + '</dt><dd>' + value + '</dd></div>';
    }

    function card(opts) {
      var res = opts.res;
      var saved = none.totalPaid - res.totalPaid;
      var isBest = anySaving && opts.key === best;

      var savedBlock;
      if (opts.baseline) {
        savedBlock =
          '<div class="emi-saved emi-saved--zero">' +
          '<span class="emi-saved__label">Interest Saved</span>' +
          '<span class="emi-saved__value">' + formatINR(0) + '</span>' +
          '</div>';
      } else {
        savedBlock =
          '<div class="emi-saved' + (saved > 0.5 ? '' : ' emi-saved--zero') + '">' +
          '<span class="emi-saved__label">Interest Saved</span>' +
          '<span class="emi-saved__value">' + formatINR(saved) + '</span>' +
          '</div>';
      }

      return (
        '<div class="emi-sumcard' + (opts.accent ? ' emi-sumcard--accent' : '') + (isBest ? ' emi-sumcard--best' : '') + '">' +
        '<div class="emi-sumcard__head">' +
        '<span class="emi-sumcard__name">' + opts.title + '</span>' +
        (opts.baseline
          ? '<span class="emi-card-badge">Baseline</span>'
          : (isBest ? '<span class="emi-card-badge emi-card-badge--best">Best</span>' : '')) +
        '</div>' +
        savedBlock +
        '<dl class="emi-sumcard__rows">' +
        rowDl('Total Amount Paid', formatINR(res.totalPaid)) +
        rowDl('Principal Paid', formatINR(res.principalPaid)) +
        rowDl('Interest Paid', formatINR(res.totalInterest)) +
        rowDl('Loan paid in', formatYears(res.months) + ' yrs') +
        '</dl>' +
        '</div>'
      );
    }

    return (
      '<div class="emi-summary-grid">' +
      card({ key: 'none', title: 'No Prepayment', res: none, baseline: true }) +
      card({ key: 'term', title: 'Reduce Term', res: term, accent: true }) +
      card({ key: 'emi', title: 'Reduce EMI', res: emi, accent: true }) +
      '</div>'
    );
  }

  /* ── Key insight callouts ── */
  function buildInsights(none, term, emi, baseEMI) {
    var termSaved = none.totalPaid - term.totalPaid;
    var emiSaved = none.totalPaid - emi.totalPaid;
    var monthsEarlier = none.months - term.months;
    var finalEmi = emi.rows.length ? emi.rows[emi.rows.length - 1].emi : baseEMI;
    var emiDrop = baseEMI - finalEmi;

    function insight(icon, tone, value, label) {
      return (
        '<div class="emi-insight">' +
        '<div class="emi-insight__icon emi-insight__icon--' + tone + '">' + icon + '</div>' +
        '<div class="emi-insight__body">' +
        '<div class="emi-insight__value">' + value + '</div>' +
        '<div class="emi-insight__label">' + label + '</div>' +
        '</div></div>'
      );
    }

    var out = '';
    out += insight('₹', 'green', formatINRShort(termSaved), 'Interest saved by reducing tenure');
    out += insight('⏱', 'blue', formatDuration(monthsEarlier) + ' earlier', 'Loan closes ahead of schedule (reduce tenure)');
    out += insight('₹', 'amber', formatINRShort(emiSaved), 'Interest saved by reducing EMI');
    out += insight('↓', 'amber', formatINR(finalEmi), 'Final EMI after prepayments (down ' + formatINRShort(emiDrop) + ')');
    return '<div class="emi-insights">' + out + '</div>';
  }

  /* ── Comparison bars ── */
  function buildCompareBars(none, term, emi) {
    function bar(label, color, value, max, display) {
      var pct = max > 0 ? (value / max) * 100 : 0;
      return (
        '<div class="emi-bar-row">' +
        '<span class="emi-bar-label">' + label + '</span>' +
        '<div class="emi-bar-track"><div class="emi-bar-fill" style="width:' + pct.toFixed(1) + '%;background:' + color + '"></div></div>' +
        '<span class="emi-bar-value">' + display + '</span>' +
        '</div>'
      );
    }

    var maxInterest = Math.max(none.totalInterest, term.totalInterest, emi.totalInterest) || 1;
    var maxMonths = Math.max(none.months, term.months, emi.months) || 1;

    var interestBars =
      '<div class="emi-bars-group"><h4>Total Interest Paid</h4>' +
      bar('No Prepay', COLORS.none, none.totalInterest, maxInterest, formatINRShort(none.totalInterest)) +
      bar('Reduce Term', COLORS.term, term.totalInterest, maxInterest, formatINRShort(term.totalInterest)) +
      bar('Reduce EMI', COLORS.emi, emi.totalInterest, maxInterest, formatINRShort(emi.totalInterest)) +
      '</div>';

    var timeBars =
      '<div class="emi-bars-group"><h4>Time to Close</h4>' +
      bar('No Prepay', COLORS.none, none.months, maxMonths, formatDuration(none.months)) +
      bar('Reduce Term', COLORS.term, term.months, maxMonths, formatDuration(term.months)) +
      bar('Reduce EMI', COLORS.emi, emi.months, maxMonths, formatDuration(emi.months)) +
      '</div>';

    return '<div class="emi-bars">' + interestBars + timeBars + '</div>';
  }

  /* ── Outstanding-balance-over-time line chart (inline SVG) ── */
  function buildBalanceChart(none, term, emi) {
    var W = 820, H = 340;
    var padL = 70, padR = 18, padT = 14, padB = 38;
    var plotW = W - padL - padR, plotH = H - padT - padB;

    var principal = none.rows.length ? none.rows[0].outstanding : 0;
    var xMaxMonths = Math.max(none.months, term.months, emi.months) || 1;
    var yMax = principal || 1;

    function xPos(m) { return padL + (m / xMaxMonths) * plotW; }
    function yPos(v) { return padT + (1 - v / yMax) * plotH; }

    function pathFor(res) {
      if (!res.rows.length) return '';
      var d = 'M ' + xPos(0).toFixed(1) + ' ' + yPos(res.rows[0].outstanding).toFixed(1);
      for (var i = 0; i < res.rows.length; i++) {
        d += ' L ' + xPos(res.rows[i].month + 1).toFixed(1) + ' ' + yPos(res.rows[i].newOutstanding).toFixed(1);
      }
      return d;
    }

    // Y gridlines + labels
    var grid = '';
    var ySteps = 4;
    for (var g = 0; g <= ySteps; g++) {
      var val = yMax * (1 - g / ySteps);
      var y = padT + (g / ySteps) * plotH;
      grid += '<line class="emi-grid-line" x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) + '" />';
      grid += '<text class="emi-axis-label" x="' + (padL - 8) + '" y="' + (y + 3).toFixed(1) + '" text-anchor="end">' + formatINRShort(val) + '</text>';
    }

    // X axis labels (every ~5 years, always include the end)
    var totalYears = xMaxMonths / 12;
    var stepYears = totalYears > 24 ? 5 : (totalYears > 10 ? 2 : 1);
    var xLabels = '';
    for (var yr = 0; yr <= Math.ceil(totalYears); yr += stepYears) {
      var xm = yr * 12;
      if (xm > xMaxMonths) break;
      var xp = xPos(xm);
      xLabels += '<text class="emi-axis-label" x="' + xp.toFixed(1) + '" y="' + (H - padB + 18) + '" text-anchor="middle">' + yr + 'y</text>';
    }

    // Closing markers for term & emi
    function closeMarker(res, color) {
      if (!res.rows.length) return '';
      var xp = xPos(res.months);
      return (
        '<line class="emi-close-line" x1="' + xp.toFixed(1) + '" y1="' + padT + '" x2="' + xp.toFixed(1) + '" y2="' + (padT + plotH) + '" stroke="' + color + '" />' +
        '<text class="emi-close-label" x="' + xp.toFixed(1) + '" y="' + (padT + 10) + '" text-anchor="middle" fill="' + color + '">' + formatYears(res.months) + 'y</text>'
      );
    }

    var lines =
      '<path d="' + pathFor(none) + '" fill="none" stroke="' + COLORS.none + '" stroke-width="2" />' +
      '<path d="' + pathFor(emi) + '" fill="none" stroke="' + COLORS.emi + '" stroke-width="2" />' +
      '<path d="' + pathFor(term) + '" fill="none" stroke="' + COLORS.term + '" stroke-width="2.5" />';

    var axis =
      '<line class="emi-grid-line" x1="' + padL + '" y1="' + (padT + plotH) + '" x2="' + (W - padR) + '" y2="' + (padT + plotH) + '" />';

    var svg =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Outstanding balance over time">' +
      grid + axis + xLabels +
      closeMarker(term, COLORS.term) + closeMarker(emi, COLORS.emi) +
      lines +
      '</svg>';

    var legend =
      '<div class="emi-legend">' +
      '<span><i style="background:' + COLORS.none + '"></i>No Prepayment</span>' +
      '<span><i style="background:' + COLORS.term + '"></i>Reduce Term</span>' +
      '<span><i style="background:' + COLORS.emi + '"></i>Reduce EMI</span>' +
      '</div>';

    return (
      '<div class="emi-section-title">Outstanding balance over time</div>' +
      '<div class="emi-chart-card">' + svg + legend + '</div>'
    );
  }

  function buildCharts(none, term, emi) {
    return (
      buildBalanceChart(none, term, emi) +
      '<div class="emi-section-title">Side-by-side comparison</div>' +
      buildCompareBars(none, term, emi)
    );
  }

  function recalc() {
    var inp = readInputs();
    var monthlyRate = inp.rate / 12 / 100;
    var months = Math.round(inp.tenure * 12);

    if (inp.amount <= 0 || months <= 0) {
      $('emi-starting-emi').textContent = '₹0';
      $('emi-summary').innerHTML = '<p class="emi-empty">Enter a loan amount and tenure to see results.</p>';
      if ($('emi-insights')) $('emi-insights').innerHTML = '';
      if ($('emi-charts')) $('emi-charts').innerHTML = '';
      $('emi-schedule-term').innerHTML = '';
      $('emi-schedule-emi').innerHTML = '';
      return;
    }

    var baseEMI = pmt(inp.amount, monthlyRate, months);
    $('emi-starting-emi').textContent = formatINR(baseEMI);

    var prepay = {
      monthly: inp.monthly,
      yearly: inp.yearly,
      yearlyMonth: inp.yearlyMonth,
      random: inp.random,
    };

    var base = { principal: inp.amount, monthlyRate: monthlyRate, months: months, baseEMI: baseEMI };

    var none = amortize(Object.assign({}, base, { strategy: 'none', prepay: prepay }));
    var term = amortize(Object.assign({}, base, { strategy: 'term', prepay: prepay }));
    var emi = amortize(Object.assign({}, base, { strategy: 'emi', prepay: prepay }));

    if ($('emi-insights')) $('emi-insights').innerHTML = buildInsights(none, term, emi, baseEMI);
    $('emi-summary').innerHTML = buildSummary(none, term, emi);
    if ($('emi-charts')) $('emi-charts').innerHTML = buildCharts(none, term, emi);
    $('emi-schedule-term').innerHTML = buildScheduleTable(term, 'term');
    $('emi-schedule-emi').innerHTML = buildScheduleTable(emi, 'emi');
  }

  /* ── Random-month prepayment rows ── */
  function addRandomRow(month, amount) {
    var list = $('emi-random-list');
    if (!list) return;
    var row = document.createElement('div');
    row.className = 'emi-random-row';
    row.innerHTML =
      '<input type="number" class="tool-input emi-random-month" placeholder="Month #" min="1" value="' + (month || '') + '" />' +
      '<input type="number" class="tool-input emi-random-amount" placeholder="Amount" min="0" value="' + (amount || '') + '" />' +
      '<button type="button" class="tool-btn emi-random-remove" aria-label="Remove row">&times;</button>';
    list.appendChild(row);
    row.querySelector('.emi-random-remove').addEventListener('click', function () {
      row.remove();
      recalc();
    });
    row.querySelectorAll('input').forEach(function (el) {
      el.addEventListener('input', recalc);
    });
  }

  /* ── Tabs ── */
  function initTabs() {
    var tabs = document.querySelectorAll('[data-emi-tab]');
    var panels = document.querySelectorAll('[data-emi-panel]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var name = tab.getAttribute('data-emi-tab');
        tabs.forEach(function (t) { t.classList.toggle('is-active', t === tab); });
        panels.forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-emi-panel') === name);
        });
      });
    });
  }

  /* ── Saved plans (DCStore) ── */
  function planFromInputs(name) {
    var inp = readInputs();
    return {
      name: name,
      amount: inp.amount,
      rate: inp.rate,
      tenure: inp.tenure,
      monthly: inp.monthly,
      yearly: inp.yearly,
      yearlyMonth: inp.yearlyMonth,
      random: inp.random,
    };
  }

  function applyPlan(plan) {
    $('emi-amount').value = plan.amount != null ? plan.amount : '';
    $('emi-rate').value = plan.rate != null ? plan.rate : '';
    $('emi-tenure').value = plan.tenure != null ? plan.tenure : '';
    $('emi-prepay-monthly').value = plan.monthly || '';
    $('emi-prepay-yearly').value = plan.yearly || '';
    $('emi-prepay-yearly-month').value = plan.yearlyMonth || 12;

    var list = $('emi-random-list');
    if (list) list.innerHTML = '';
    if (plan.random && plan.random.length) {
      plan.random.forEach(function (r) { addRandomRow(r.month, r.amount); });
    }
    recalc();
  }

  function renderPlans(plans) {
    var listEl = $('emi-plans-list');
    if (!listEl) return;
    if (!plans || !plans.length) {
      listEl.innerHTML = '<span class="emi-plans-empty">No saved plans yet.</span>';
      return;
    }
    plans.sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
    listEl.innerHTML = '';
    plans.forEach(function (plan) {
      var chip = document.createElement('div');
      chip.className = 'emi-plan-chip';
      chip.innerHTML =
        '<button type="button" class="emi-plan-load">' + escapeHtml(plan.name) + '</button>' +
        '<button type="button" class="emi-plan-del" aria-label="Delete plan">&times;</button>';
      chip.querySelector('.emi-plan-load').addEventListener('click', function () { applyPlan(plan); });
      chip.querySelector('.emi-plan-del').addEventListener('click', function () {
        DCStore.remove(TOOL, plan.id).then(loadPlans);
      });
      listEl.appendChild(chip);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function loadPlans() {
    if (typeof DCStore === 'undefined') return;
    DCStore.getAll(TOOL).then(renderPlans).catch(function () {});
  }

  function savePlan() {
    if (typeof DCStore === 'undefined') return;
    var nameEl = $('emi-plan-name');
    var name = (nameEl.value || '').trim();
    if (!name) {
      nameEl.focus();
      return;
    }
    var id = 'plan-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    DCStore.set(TOOL, id, planFromInputs(name)).then(function () {
      nameEl.value = '';
      loadPlans();
    });
  }

  function init() {
    if (!$('emi-amount')) return;

    // Recalculate on any input change.
    ['emi-amount', 'emi-rate', 'emi-tenure', 'emi-prepay-monthly', 'emi-prepay-yearly', 'emi-prepay-yearly-month'].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener('input', recalc);
    });

    var addBtn = $('emi-random-add');
    if (addBtn) addBtn.addEventListener('click', function () { addRandomRow(); });

    var saveBtn = $('emi-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', savePlan);
    var nameEl = $('emi-plan-name');
    if (nameEl) {
      nameEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') savePlan();
      });
    }

    initTabs();
    recalc();
    loadPlans();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
