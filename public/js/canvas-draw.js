(function() {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var TOOL_KEY = 'canvas-draw';
  var GRID_SIZE = 20;
  var HANDLE_SIZE = 7;
  var MIN_SHAPE = 20;
  var MAX_UNDO = 50;
  var SAVE_DELAY = 600;
  var DEFAULT_FILL = '#ffffff';
  var DEFAULT_STROKE = '#374151';
  var CARD_HEADER_H = 32;
  var SNAP_RADIUS = 400;
  var STICKY_COLORS = ['#fef3c7', '#fce7f3', '#d1fae5', '#dbeafe', '#ede9fe', '#fef9c3'];

  var state = {
    tool: 'select',
    vb: { x: 0, y: 0, w: 1000, h: 700 },
    zoom: 1,
    selected: [],
    selectedConn: null,
    clipboard: [],
    nextShapeId: 1,
    nextConnId: 1,
    undoStack: [],
    redoStack: [],
    projects: [],
    activeProjectId: null,
    drawing: null,
    dragging: null,
    resizing: null,
    panning: null,
    connDrag: null,
    freehand: null,
    erasing: null,
    spaceHeld: false,
    marquee: null,
    tablePending: null,
    snapToGrid: false,
    stickyColorIdx: 0,
    waypointDrag: null
  };

  var svg, shapesLayer, connsLayer, uiLayer, gridPat;
  var wrap, zoomInfo, toolbar;
  var propsEmpty, propsForm, connForm;
  var fillIn, strokeIn, strokeWIn, fontSzIn, opacityIn;
  var connStrokeIn, connSwIn, connStyleIn, connStartIn, connEndIn;
  var tabList, modal, tableModal, importFile;

  function $(id) { return document.getElementById(id); }

  function svgEl(tag, attrs, parent) {
    var el = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(el);
    return el;
  }

  function screenToSVG(cx, cy) {
    var pt = svg.createSVGPoint();
    pt.x = cx; pt.y = cy;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function updateViewBox() {
    var v = state.vb;
    svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h);
    state.zoom = svg.clientWidth / v.w;
    zoomInfo.textContent = Math.round(state.zoom * 100) + '%';
  }

  function uid() { return 's' + (state.nextShapeId++); }
  function cid() { return 'c' + (state.nextConnId++); }

  function getShapeG(el) {
    if (!el) return null;
    return el.closest ? el.closest('[data-sid]') : null;
  }

  function getConnPath(el) {
    if (!el) return null;
    return el.closest ? el.closest('[data-cid]') : null;
  }

  function getShapeEl(g) { return g.querySelector('rect, ellipse, polygon, circle, path'); }
  function getTextEl(g) { return g.querySelector('text'); }

  function getTextContent(textEl) {
    var stored = textEl.getAttribute('data-text');
    if (stored !== null) return stored;
    var tspans = textEl.querySelectorAll('tspan');
    if (tspans.length > 0) {
      var parts = [];
      tspans.forEach(function(ts) { parts.push(ts.textContent); });
      return parts.join(' ').replace(/\u00A0/g, ' ').trim();
    }
    return textEl.textContent || '';
  }

  function wrapTextInShape(textEl, text, maxWidth, fontSize) {
    while (textEl.firstChild) textEl.removeChild(textEl.firstChild);
    textEl.setAttribute('data-text', text || '');
    if (!text) { textEl.textContent = ''; return 0; }
    var baseX = textEl.getAttribute('x');
    var lh = fontSize * 1.3;
    var paragraphs = text.split('\n');
    var allLines = [];
    var measurer = svgEl('tspan', {});
    textEl.appendChild(measurer);
    paragraphs.forEach(function(para) {
      if (!para) { allLines.push(''); return; }
      var words = para.split(/\s+/);
      var line = words[0] || '';
      for (var i = 1; i < words.length; i++) {
        var test = line + ' ' + words[i];
        measurer.textContent = test;
        var len = measurer.getComputedTextLength ? measurer.getComputedTextLength() : test.length * fontSize * 0.6;
        if (len > maxWidth && line) {
          allLines.push(line);
          line = words[i];
        } else {
          line = test;
        }
      }
      allLines.push(line);
    });
    textEl.removeChild(measurer);
    var totalH = allLines.length * lh;
    var startDy = -(totalH - lh) / 2;
    allLines.forEach(function(line, i) {
      var ts = svgEl('tspan', { x: baseX, dy: i === 0 ? startDy : lh });
      ts.textContent = line || '\u00A0';
      textEl.appendChild(ts);
    });
    return totalH;
  }

  function autoGrowShape(g, textH, padding) {
    var s = getShapeEl(g);
    if (!s || s.tagName !== 'rect') return;
    var b = getBBox(g);
    var needed = textH + (padding || 12);
    if (needed > b.h) {
      s.setAttribute('height', needed);
      var t = getTextEl(g);
      if (t) {
        t.setAttribute('y', b.y + needed / 2);
        wrapTextInShape(t, getTextContent(t), b.w - 8, parseFloat(t.getAttribute('font-size') || 14));
      }
    }
  }

  function getBBox(g) {
    var s = getShapeEl(g);
    if (!s) {
      var t = getTextEl(g);
      if (!t) return { x: 0, y: 0, w: 0, h: 0 };
      var bb = t.getBBox();
      return { x: bb.x - 4, y: bb.y - 2, w: bb.width + 8, h: bb.height + 4 };
    }
    var tag = s.tagName;
    if (tag === 'rect') return { x: +s.getAttribute('x'), y: +s.getAttribute('y'), w: +s.getAttribute('width'), h: +s.getAttribute('height') };
    if (tag === 'ellipse') {
      var cx = +s.getAttribute('cx'), cy = +s.getAttribute('cy'), rx = +s.getAttribute('rx'), ry = +s.getAttribute('ry');
      return { x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2 };
    }
    if (tag === 'polygon') { var bb2 = s.getBBox(); return { x: bb2.x, y: bb2.y, w: bb2.width, h: bb2.height }; }
    if (tag === 'path') { var bb3 = s.getBBox(); return { x: bb3.x, y: bb3.y, w: bb3.width, h: bb3.height }; }
    return { x: 0, y: 0, w: 0, h: 0 };
  }

  function getAnchors(g) {
    var b = getBBox(g);
    var type = g.getAttribute('data-type');
    if (type === 'triangle') {
      var tipX = b.x + b.w / 2, tipY = b.y;
      var blX = b.x, blY = b.y + b.h;
      var brX = b.x + b.w, brY = b.y + b.h;
      return {
        top: { x: tipX, y: tipY },
        right: { x: (tipX + brX) / 2, y: (tipY + brY) / 2 },
        bottom: { x: (blX + brX) / 2, y: blY },
        left: { x: (tipX + blX) / 2, y: (tipY + blY) / 2 }
      };
    }
    return {
      top: { x: b.x + b.w / 2, y: b.y },
      right: { x: b.x + b.w, y: b.y + b.h / 2 },
      bottom: { x: b.x + b.w / 2, y: b.y + b.h },
      left: { x: b.x, y: b.y + b.h / 2 }
    };
  }

  function dist(a, b) { var dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }

  function nearestAnchor(g, pt) {
    var a = getAnchors(g), best = null, bs = '', bd = Infinity;
    ['top', 'right', 'bottom', 'left'].forEach(function(s) {
      var d = dist(a[s], pt);
      if (d < bd) { bd = d; best = a[s]; bs = s; }
    });
    return { pt: best, side: bs, dist: bd };
  }

  function bestAnchorPair(g1, g2) {
    var a1 = getAnchors(g1), a2 = getAnchors(g2);
    var sides = ['top', 'right', 'bottom', 'left'];
    var best, bd = Infinity;
    sides.forEach(function(s1) { sides.forEach(function(s2) {
      var d = dist(a1[s1], a2[s2]);
      if (d < bd) { bd = d; best = { from: a1[s1], to: a2[s2], fromSide: s1, toSide: s2 }; }
    }); });
    return best;
  }

  function shapeAt(svgPt) {
    var result = null;
    var children = shapesLayer.children;
    for (var i = children.length - 1; i >= 0; i--) {
      var g = children[i];
      if (!g.hasAttribute('data-sid')) continue;
      var b = getBBox(g);
      if (svgPt.x >= b.x && svgPt.x <= b.x + b.w && svgPt.y >= b.y && svgPt.y <= b.y + b.h) {
        result = g; break;
      }
      var txt = getTextEl(g);
      if (txt) {
        try {
          var tb = txt.getBBox();
          if (tb.width > 0 && svgPt.x >= tb.x && svgPt.x <= tb.x + tb.width && svgPt.y >= tb.y && svgPt.y <= tb.y + tb.height) {
            result = g; break;
          }
        } catch(e) {}
      }
    }
    return result;
  }

  function setCursorMode(m) { wrap.setAttribute('data-mode', m); }

  function debounce(fn, ms) { var t; return function() { clearTimeout(t); t = setTimeout(fn, ms); }; }

  function snapVal(v) { return state.snapToGrid ? Math.round(v / GRID_SIZE) * GRID_SIZE : v; }

  function smoothPath(points) {
    if (points.length < 2) return '';
    if (points.length === 2) return 'M' + points[0].x + ',' + points[0].y + ' L' + points[1].x + ',' + points[1].y;
    var d = 'M' + points[0].x + ',' + points[0].y;
    for (var i = 0; i < points.length - 1; i++) {
      var p0 = points[i === 0 ? 0 : i - 1];
      var p1 = points[i], p2 = points[i + 1];
      var p3 = points[i + 2 < points.length ? i + 2 : i + 1];
      var cp1x = p1.x + (p2.x - p0.x) / 6;
      var cp1y = p1.y + (p2.y - p0.y) / 6;
      var cp2x = p2.x - (p3.x - p1.x) / 6;
      var cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ' C' + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + p2.x + ',' + p2.y;
    }
    return d;
  }

  function translatePathD(d, dx, dy) {
    if (!d) return d;
    return d.replace(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/g, function(_, xs, ys) {
      return (parseFloat(xs) + dx) + ',' + (parseFloat(ys) + dy);
    });
  }

  function darkenColor(hex) {
    hex = hex.replace('#', '');
    var r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 30);
    var g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 30);
    var b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 30);
    return '#' + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2);
  }

  function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function contrastColor(fill) {
    if (!fill || fill === 'none' || fill === 'transparent') {
      return isDarkMode() ? '#f9fafb' : '#1f2937';
    }
    var hex = fill.replace('#', '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length !== 6) return isDarkMode() ? '#f9fafb' : '#1f2937';
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    var lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.55 ? '#1f2937' : '#f9fafb';
  }

  function updateTextColors(g, fill, headerFill) {
    var tc = contrastColor(fill);
    var hc = headerFill ? contrastColor(headerFill) : tc;
    var type = g.getAttribute('data-type');
    g.querySelectorAll('.cd-shape-text').forEach(function(t) {
      if (type === 'table' && t.getAttribute('data-row') === '0') {
        t.setAttribute('fill', hc);
      } else {
        t.setAttribute('fill', tc);
      }
    });
  }

  /* ─── Shape Factory ─── */

  function createShape(type, x, y, w, h, opts) {
    opts = opts || {};
    var id = uid();
    var g = svgEl('g', { 'data-sid': id, 'data-type': type });
    var fill = opts.fill || DEFAULT_FILL;
    var stroke = opts.stroke || DEFAULT_STROKE;
    var sw = opts.strokeWidth || 2;
    var fontSize = opts.fontSize || 14;

    if (type === 'rect') {
      svgEl('rect', { x: x, y: y, width: w, height: h, fill: fill, stroke: stroke, 'stroke-width': sw }, g);
    } else if (type === 'roundedRect') {
      svgEl('rect', { x: x, y: y, width: w, height: h, rx: 10, ry: 10, fill: fill, stroke: stroke, 'stroke-width': sw }, g);
    } else if (type === 'circle') {
      svgEl('ellipse', { cx: x + w / 2, cy: y + h / 2, rx: w / 2, ry: h / 2, fill: fill, stroke: stroke, 'stroke-width': sw }, g);
    } else if (type === 'diamond') {
      svgEl('polygon', { points: [x + w / 2, y, x + w, y + h / 2, x + w / 2, y + h, x, y + h / 2].join(','), fill: fill, stroke: stroke, 'stroke-width': sw }, g);
    } else if (type === 'triangle') {
      svgEl('polygon', { points: [x + w / 2, y, x + w, y + h, x, y + h].join(','), fill: fill, stroke: stroke, 'stroke-width': sw }, g);
    } else if (type === 'text') {
      w = w || 120; h = h || 30;
      svgEl('rect', { x: x, y: y, width: w, height: h, fill: 'transparent', stroke: 'transparent', 'stroke-width': 1 }, g);
    } else if (type === 'card') {
      w = Math.max(w, 120); h = Math.max(h, 60);
      var tc = contrastColor(fill);
      svgEl('rect', { x: x, y: y, width: w, height: h, rx: 6, ry: 6, fill: fill, stroke: stroke, 'stroke-width': sw }, g);
      svgEl('line', { x1: x, y1: y + CARD_HEADER_H, x2: x + w, y2: y + CARD_HEADER_H, stroke: stroke, 'stroke-width': 1, 'class': 'cd-card-sep' }, g);
      var titleEl = svgEl('text', { x: x + w / 2, y: y + CARD_HEADER_H / 2, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': fontSize, 'font-weight': 'bold', fill: tc, 'class': 'cd-shape-text', 'data-role': 'title' }, g);
      var descEl = svgEl('text', { x: x + w / 2, y: y + CARD_HEADER_H + (h - CARD_HEADER_H) / 2, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': fontSize - 2, fill: tc, 'class': 'cd-shape-text', 'data-role': 'desc' }, g);
      shapesLayer.appendChild(g);
      wrapTextInShape(titleEl, opts.title || 'Title', w - 8, fontSize);
      wrapTextInShape(descEl, opts.desc || 'Description', w - 8, fontSize - 2);
      return g;
    } else if (type === 'table') {
      var rows = opts.rows || 3, cols = opts.cols || 3;
      var cellW = w / cols, cellH = h / rows;
      var headerFill = opts.headerFill || (isDarkMode() ? '#374151' : '#e5e7eb');
      var bodyTc = contrastColor(fill);
      var hdrTc = contrastColor(headerFill);
      g.setAttribute('data-rows', rows);
      g.setAttribute('data-cols', cols);
      svgEl('rect', { x: x, y: y, width: w, height: h, fill: fill, stroke: stroke, 'stroke-width': sw }, g);
      svgEl('rect', { x: x, y: y, width: w, height: cellH, fill: headerFill, stroke: 'none', 'class': 'cd-table-header' }, g);
      for (var r = 1; r < rows; r++) svgEl('line', { x1: x, y1: y + r * cellH, x2: x + w, y2: y + r * cellH, stroke: stroke, 'stroke-width': 0.5, 'class': 'cd-table-line' }, g);
      for (var c = 1; c < cols; c++) svgEl('line', { x1: x + c * cellW, y1: y, x2: x + c * cellW, y2: y + h, stroke: stroke, 'stroke-width': 0.5, 'class': 'cd-table-line' }, g);
      for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
          svgEl('text', {
            x: x + c * cellW + cellW / 2, y: y + r * cellH + cellH / 2,
            'text-anchor': 'middle', 'dominant-baseline': 'central',
            'font-size': r === 0 ? fontSize : fontSize - 1,
            'font-weight': r === 0 ? 'bold' : 'normal',
            fill: r === 0 ? hdrTc : bodyTc,
            'class': 'cd-shape-text', 'data-row': r, 'data-col': c
          }, g).textContent = r === 0 ? 'Col ' + (c + 1) : '';
        }
      }
      shapesLayer.appendChild(g);
      return g;
    } else if (type === 'freehand' || type === 'highlight') {
      svgEl('path', {
        d: opts.pathD || '', stroke: stroke, 'stroke-width': sw, fill: 'none',
        'stroke-linecap': 'round', 'stroke-linejoin': 'round'
      }, g);
      if (opts.opacity && opts.opacity < 1) g.setAttribute('opacity', opts.opacity);
      shapesLayer.appendChild(g);
      return g;
    } else if (type === 'sticky') {
      w = Math.max(w || 140, 80); h = Math.max(h || 140, 80);
      var stickyFill = opts.fill || STICKY_COLORS[state.stickyColorIdx % STICKY_COLORS.length];
      state.stickyColorIdx++;
      fill = stickyFill;
      var foldSize = Math.min(18, w * 0.12, h * 0.12);
      svgEl('rect', { x: x, y: y, width: w, height: h, fill: fill, stroke: 'none', 'stroke-width': 0, filter: 'url(#cd-shadow)' }, g);
      svgEl('polygon', { points: [x + w - foldSize, y, x + w, y + foldSize, x + w - foldSize, y + foldSize].join(' '), fill: darkenColor(fill), stroke: 'none', 'class': 'cd-sticky-fold' }, g);
      var stickyTc = contrastColor(fill);
      var stickyTextEl = svgEl('text', { x: x + w / 2, y: y + h / 2, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': fontSize, fill: stickyTc, 'class': 'cd-shape-text' }, g);
      shapesLayer.appendChild(g);
      var stickyLabel = opts.label || '';
      if (stickyLabel) wrapTextInShape(stickyTextEl, stickyLabel, w - 12, fontSize);
      return g;
    }

    var shapeTextColor = type === 'text' ? contrastColor(null) : contrastColor(fill);
    var textEl = svgEl('text', {
      x: x + w / 2, y: y + h / 2,
      'text-anchor': 'middle', 'dominant-baseline': 'central',
      'font-size': fontSize, fill: shapeTextColor, 'class': 'cd-shape-text'
    }, g);

    shapesLayer.appendChild(g);
    var label = opts.label || '';
    if (label) wrapTextInShape(textEl, label, w - 8, fontSize);
    return g;
  }

  function resizeShapeEl(g, nx, ny, nw, nh) {
    var s = getShapeEl(g);
    var type = g.getAttribute('data-type');
    nw = Math.max(nw, MIN_SHAPE);
    nh = Math.max(nh, MIN_SHAPE);
    if (s) {
      var tag = s.tagName;
      if (tag === 'rect') {
        s.setAttribute('x', nx); s.setAttribute('y', ny);
        s.setAttribute('width', nw); s.setAttribute('height', nh);
      } else if (tag === 'ellipse') {
        s.setAttribute('cx', nx + nw / 2); s.setAttribute('cy', ny + nh / 2);
        s.setAttribute('rx', nw / 2); s.setAttribute('ry', nh / 2);
      } else if (tag === 'polygon') {
        var pts;
        if (type === 'diamond') pts = [nx + nw / 2, ny, nx + nw, ny + nh / 2, nx + nw / 2, ny + nh, nx, ny + nh / 2].join(',');
        else pts = [nx + nw / 2, ny, nx + nw, ny + nh, nx, ny + nh].join(',');
        s.setAttribute('points', pts);
      }
    }

    if (type === 'freehand' || type === 'highlight') {
      var pathEl = g.querySelector('path');
      if (!pathEl) return;
      var pbb = pathEl.getBBox();
      var pdx = nx - pbb.x, pdy = ny - pbb.y;
      if (Math.abs(pdx) > 0.01 || Math.abs(pdy) > 0.01) {
        pathEl.setAttribute('d', translatePathD(pathEl.getAttribute('d'), pdx, pdy));
      }
      return;
    }

    if (type === 'sticky') {
      var sRect = g.querySelector('rect');
      if (sRect) { sRect.setAttribute('x', nx); sRect.setAttribute('y', ny); sRect.setAttribute('width', nw); sRect.setAttribute('height', nh); }
      var fold = g.querySelector('.cd-sticky-fold');
      if (fold) {
        var fs = Math.min(18, nw * 0.12, nh * 0.12);
        fold.setAttribute('points', [nx + nw - fs, ny, nx + nw, ny + fs, nx + nw - fs, ny + fs].join(' '));
      }
      var st = getTextEl(g);
      if (st) {
        st.setAttribute('x', nx + nw / 2); st.setAttribute('y', ny + nh / 2);
        var stText = getTextContent(st);
        if (stText) wrapTextInShape(st, stText, nw - 12, parseFloat(st.getAttribute('font-size') || 14));
      }
      return;
    }

    if (type === 'card') {
      var sep = g.querySelector('.cd-card-sep');
      if (sep) { sep.setAttribute('x1', nx); sep.setAttribute('y1', ny + CARD_HEADER_H); sep.setAttribute('x2', nx + nw); sep.setAttribute('y2', ny + CARD_HEADER_H); }
      var title = g.querySelector('[data-role="title"]');
      if (title) {
        title.setAttribute('x', nx + nw / 2); title.setAttribute('y', ny + CARD_HEADER_H / 2);
        var titleText = getTextContent(title);
        if (titleText) wrapTextInShape(title, titleText, nw - 8, parseFloat(title.getAttribute('font-size') || 14));
      }
      var desc = g.querySelector('[data-role="desc"]');
      if (desc) {
        desc.setAttribute('x', nx + nw / 2); desc.setAttribute('y', ny + CARD_HEADER_H + (nh - CARD_HEADER_H) / 2);
        var descText = getTextContent(desc);
        if (descText) wrapTextInShape(desc, descText, nw - 8, parseFloat(desc.getAttribute('font-size') || 12));
      }
      return;
    }

    if (type === 'table') {
      var rows = +g.getAttribute('data-rows') || 3;
      var cols = +g.getAttribute('data-cols') || 3;
      var cW = nw / cols, cH = nh / rows;
      var hdr = g.querySelector('.cd-table-header');
      if (hdr) { hdr.setAttribute('x', nx); hdr.setAttribute('y', ny); hdr.setAttribute('width', nw); hdr.setAttribute('height', cH); }
      var hIdx = 0, vIdx = 0;
      g.querySelectorAll('.cd-table-line').forEach(function(ln) {
        if (ln.getAttribute('y1') === ln.getAttribute('y2')) {
          hIdx++;
          ln.setAttribute('x1', nx); ln.setAttribute('x2', nx + nw);
          ln.setAttribute('y1', ny + hIdx * cH); ln.setAttribute('y2', ny + hIdx * cH);
        } else {
          vIdx++;
          ln.setAttribute('y1', ny); ln.setAttribute('y2', ny + nh);
          ln.setAttribute('x1', nx + vIdx * cW); ln.setAttribute('x2', nx + vIdx * cW);
        }
      });
      g.querySelectorAll('text[data-row]').forEach(function(t) {
        var r = +t.getAttribute('data-row'), c = +t.getAttribute('data-col');
        t.setAttribute('x', nx + c * cW + cW / 2);
        t.setAttribute('y', ny + r * cH + cH / 2);
      });
      return;
    }

    var t = getTextEl(g);
    if (t) {
      t.setAttribute('x', nx + nw / 2); t.setAttribute('y', ny + nh / 2);
      var tText = getTextContent(t);
      if (tText) {
        var fsize = parseFloat(t.getAttribute('font-size') || 14);
        var textH = wrapTextInShape(t, tText, nw - 8, fsize);
        if (type === 'text' && s && s.tagName === 'rect') {
          var fitH = Math.max(textH + 12, MIN_SHAPE);
          if (fitH !== nh) {
            s.setAttribute('height', fitH);
            t.setAttribute('y', ny + fitH / 2);
            wrapTextInShape(t, tText, nw - 8, fsize);
          }
        }
      }
    }
  }

  function moveShapeBy(g, dx, dy) {
    var b = getBBox(g);
    resizeShapeEl(g, b.x + dx, b.y + dy, b.w, b.h);
    updateConnsFor(g.getAttribute('data-sid'));
  }

  function cloneShapeG(g) {
    var clone = g.cloneNode(true);
    clone.setAttribute('data-sid', uid());
    shapesLayer.appendChild(clone);
    return clone;
  }

  /* ─── Selection ─── */

  function clearSelection() {
    state.selected = [];
    state.selectedConn = null;
    clearUI();
    showProps(null);
  }

  function selectShape(g, add) {
    if (!g) return;
    state.selectedConn = null;
    var sid = g.getAttribute('data-sid');
    if (!add) {
      if (state.selected.length === 1 && state.selected[0] === sid) { drawSelectionUI(); showProps(g); return; }
      state.selected = [];
    }
    if (state.selected.indexOf(sid) < 0) state.selected.push(sid);
    drawSelectionUI();
    showProps(state.selected.length === 1 ? g : null);
  }

  function selectConn(path) {
    state.selected = [];
    state.selectedConn = path.getAttribute('data-cid');
    clearUI();
    drawConnSelUI(path);
    showConnProps(path);
  }

  function selectedGs() {
    return state.selected.map(function(sid) {
      return shapesLayer.querySelector('[data-sid="' + sid + '"]');
    }).filter(Boolean);
  }

  function clearUI() { while (uiLayer.firstChild) uiLayer.removeChild(uiLayer.firstChild); }

  function drawSelectionUI() {
    clearUI();
    selectedGs().forEach(function(g) {
      var b = getBBox(g);
      var pad = 4;
      svgEl('rect', { x: b.x - pad, y: b.y - pad, width: b.w + pad * 2, height: b.h + pad * 2, 'class': 'cd-sel-outline' }, uiLayer);
      drawHandles(b, g.getAttribute('data-sid'));
    });
  }

  function drawConnSelUI(path) {
    var clone = path.cloneNode(false);
    clone.setAttribute('stroke', 'var(--color-primary, #2563eb)');
    clone.setAttribute('stroke-width', 4);
    clone.setAttribute('stroke-dasharray', '6 3');
    clone.setAttribute('fill', 'none');
    clone.setAttribute('pointer-events', 'none');
    clone.removeAttribute('marker-start');
    clone.removeAttribute('marker-end');
    clone.removeAttribute('data-cid');
    uiLayer.appendChild(clone);
    drawWaypointHandles(path);
  }

  function drawWaypointHandles(path) {
    var pts = resolveConnPoints(path);
    if (!pts) return;
    var wps = getWaypoints(path);
    var cid = path.getAttribute('data-cid');
    var hs = Math.max(6, HANDLE_SIZE / state.zoom);
    var allPts = [pts.from].concat(wps).concat([pts.to]);

    wps.forEach(function(wp, i) {
      svgEl('rect', {
        x: wp.x - hs / 2, y: wp.y - hs / 2, width: hs, height: hs,
        fill: '#2563eb', stroke: '#fff', 'stroke-width': 1.5 / state.zoom,
        'class': 'cd-wp-handle', 'data-wp-cid': cid, 'data-wp-idx': i,
        style: 'cursor:move'
      }, uiLayer);
    });

    for (var i = 0; i < allPts.length - 1; i++) {
      var mx = (allPts[i].x + allPts[i + 1].x) / 2;
      var my = (allPts[i].y + allPts[i + 1].y) / 2;
      svgEl('rect', {
        cx: mx, cy: my, x: mx - hs * 0.35, y: my - hs * 0.35,
        width: hs * 0.7, height: hs * 0.7,
        fill: '#93c5fd', stroke: '#2563eb', 'stroke-width': 1 / state.zoom,
        'class': 'cd-wp-mid', 'data-wp-cid': cid, 'data-wp-mid-idx': i,
        style: 'cursor:move', rx: 1 / state.zoom
      }, uiLayer);
    }

    svgEl('circle', {
      cx: pts.from.x, cy: pts.from.y, r: hs * 0.35,
      fill: '#fff', stroke: '#2563eb', 'stroke-width': 1.5 / state.zoom,
      'class': 'cd-wp-endpoint', 'pointer-events': 'none'
    }, uiLayer);
    svgEl('circle', {
      cx: pts.to.x, cy: pts.to.y, r: hs * 0.35,
      fill: '#fff', stroke: '#2563eb', 'stroke-width': 1.5 / state.zoom,
      'class': 'cd-wp-endpoint', 'pointer-events': 'none'
    }, uiLayer);
  }

  function drawHandles(b, sid) {
    var hs = HANDLE_SIZE / state.zoom;
    var positions = [
      { cx: b.x, cy: b.y, cursor: 'nwse-resize', dir: 'nw' },
      { cx: b.x + b.w / 2, cy: b.y, cursor: 'ns-resize', dir: 'n' },
      { cx: b.x + b.w, cy: b.y, cursor: 'nesw-resize', dir: 'ne' },
      { cx: b.x + b.w, cy: b.y + b.h / 2, cursor: 'ew-resize', dir: 'e' },
      { cx: b.x + b.w, cy: b.y + b.h, cursor: 'nwse-resize', dir: 'se' },
      { cx: b.x + b.w / 2, cy: b.y + b.h, cursor: 'ns-resize', dir: 's' },
      { cx: b.x, cy: b.y + b.h, cursor: 'nesw-resize', dir: 'sw' },
      { cx: b.x, cy: b.y + b.h / 2, cursor: 'ew-resize', dir: 'w' }
    ];
    positions.forEach(function(p) {
      svgEl('rect', {
        x: p.cx - hs / 2, y: p.cy - hs / 2, width: hs, height: hs,
        'class': 'cd-handle', 'data-handle': p.dir, 'data-target': sid,
        style: 'cursor:' + p.cursor
      }, uiLayer);
    });
  }

  /* ─── Connectors ─── */

  function buildPath(fromPt, toPt, fromSide, toSide, style) {
    if (style === 'elbow') {
      var mx = (fromPt.x + toPt.x) / 2, my = (fromPt.y + toPt.y) / 2;
      if (fromSide === 'left' || fromSide === 'right')
        return 'M' + fromPt.x + ',' + fromPt.y + ' L' + mx + ',' + fromPt.y + ' L' + mx + ',' + toPt.y + ' L' + toPt.x + ',' + toPt.y;
      if (fromSide === 'top' || fromSide === 'bottom')
        return 'M' + fromPt.x + ',' + fromPt.y + ' L' + fromPt.x + ',' + my + ' L' + toPt.x + ',' + my + ' L' + toPt.x + ',' + toPt.y;
      var dx = Math.abs(toPt.x - fromPt.x), dy = Math.abs(toPt.y - fromPt.y);
      if (dx >= dy)
        return 'M' + fromPt.x + ',' + fromPt.y + ' L' + mx + ',' + fromPt.y + ' L' + mx + ',' + toPt.y + ' L' + toPt.x + ',' + toPt.y;
      return 'M' + fromPt.x + ',' + fromPt.y + ' L' + fromPt.x + ',' + my + ' L' + toPt.x + ',' + my + ' L' + toPt.x + ',' + toPt.y;
    }
    if (style === 'curved') {
      var cdx = toPt.x - fromPt.x, cdy = toPt.y - fromPt.y;
      var d = Math.sqrt(cdx * cdx + cdy * cdy);
      var off = Math.max(40, d * 0.4);
      var cp1x = fromPt.x, cp1y = fromPt.y, cp2x = toPt.x, cp2y = toPt.y;
      if (fromSide === 'right') cp1x += off;
      else if (fromSide === 'left') cp1x -= off;
      else if (fromSide === 'bottom') cp1y += off;
      else if (fromSide === 'top') cp1y -= off;
      else { cp1x += off * (cdx >= 0 ? 1 : -1); }
      if (toSide === 'right') cp2x += off;
      else if (toSide === 'left') cp2x -= off;
      else if (toSide === 'bottom') cp2y += off;
      else if (toSide === 'top') cp2y -= off;
      else { cp2x -= off * (cdx >= 0 ? 1 : -1); }
      return 'M' + fromPt.x + ',' + fromPt.y + ' C' + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + toPt.x + ',' + toPt.y;
    }
    return 'M' + fromPt.x + ',' + fromPt.y + ' L' + toPt.x + ',' + toPt.y;
  }

  function resolveConnPoints(p) {
    var fromId = p.getAttribute('data-from');
    var toId = p.getAttribute('data-to');

    if (fromId && toId) {
      var g1 = shapesLayer.querySelector('[data-sid="' + fromId + '"]');
      var g2 = shapesLayer.querySelector('[data-sid="' + toId + '"]');
      if (!g1 || !g2) return null;
      return bestAnchorPair(g1, g2);
    }

    var fromPt, toPt, fromSide = '', toSide = '';

    if (fromId) {
      var gf = shapesLayer.querySelector('[data-sid="' + fromId + '"]');
      if (!gf) return null;
      toPt = { x: +p.getAttribute('data-tx'), y: +p.getAttribute('data-ty') };
      var na = nearestAnchor(gf, toPt);
      fromPt = na.pt; fromSide = na.side;
    } else {
      fromPt = { x: +p.getAttribute('data-fx'), y: +p.getAttribute('data-fy') };
    }

    if (toId) {
      var gt = shapesLayer.querySelector('[data-sid="' + toId + '"]');
      if (!gt) return null;
      if (!fromPt) fromPt = { x: +p.getAttribute('data-fx'), y: +p.getAttribute('data-fy') };
      var na2 = nearestAnchor(gt, fromPt);
      toPt = na2.pt; toSide = na2.side;
    } else if (!toPt) {
      toPt = { x: +p.getAttribute('data-tx'), y: +p.getAttribute('data-ty') };
    }

    return { from: fromPt, to: toPt, fromSide: fromSide, toSide: toSide };
  }

  function updateConnEl(p) {
    var pts = resolveConnPoints(p);
    if (!pts) return;
    var wps = getWaypoints(p);
    if (wps.length > 0) {
      p.setAttribute('d', buildPathWithWaypoints(pts.from, wps, pts.to));
    } else {
      p.setAttribute('d', buildPath(pts.from, pts.to, pts.fromSide, pts.toSide, p.getAttribute('data-conn-style') || 'straight'));
    }
  }

  function markerUrl(type, rev) {
    if (!type || type === 'none') return '';
    return 'url(#cd-m-' + type + (rev ? '-rev' : '') + ')';
  }

  function createConnector(opts) {
    var fromId = opts.fromId || '';
    var toId = opts.toId || '';
    var style = opts.style || 'straight';
    var id = cid();

    var attrs = {
      stroke: opts.stroke || DEFAULT_STROKE, 'stroke-width': opts.sw || 2,
      fill: 'none', 'data-cid': id, 'data-from': fromId, 'data-to': toId,
      'data-conn-style': style
    };

    if (!fromId) { attrs['data-fx'] = opts.fromPt.x; attrs['data-fy'] = opts.fromPt.y; }
    if (!toId) { attrs['data-tx'] = opts.toPt.x; attrs['data-ty'] = opts.toPt.y; }

    var endM = opts.endMarker || 'arrow';
    var startM = opts.startMarker || 'none';
    if (endM !== 'none') attrs['marker-end'] = markerUrl(endM);
    if (startM !== 'none') attrs['marker-start'] = markerUrl(startM, true);
    attrs['data-marker-start'] = startM;
    attrs['data-marker-end'] = endM;

    var fromPt, toPt, fromSide = '', toSide = '';

    if (fromId && toId) {
      var g1 = shapesLayer.querySelector('[data-sid="' + fromId + '"]');
      var g2 = shapesLayer.querySelector('[data-sid="' + toId + '"]');
      if (g1 && g2) {
        var pair = bestAnchorPair(g1, g2);
        fromPt = pair.from; toPt = pair.to;
        fromSide = pair.fromSide; toSide = pair.toSide;
      }
    }
    if (!fromPt) {
      if (fromId) {
        var gf = shapesLayer.querySelector('[data-sid="' + fromId + '"]');
        toPt = opts.toPt;
        if (gf && toPt) { var na = nearestAnchor(gf, toPt); fromPt = na.pt; fromSide = na.side; }
        else fromPt = opts.fromPt;
      } else {
        fromPt = opts.fromPt;
      }
    }
    if (!toPt) {
      if (toId) {
        var gt = shapesLayer.querySelector('[data-sid="' + toId + '"]');
        if (gt && fromPt) { var na2 = nearestAnchor(gt, fromPt); toPt = na2.pt; toSide = na2.side; }
        else toPt = opts.toPt;
      } else {
        toPt = opts.toPt;
      }
    }

    if (!fromPt || !toPt) return null;

    attrs.d = buildPath(fromPt, toPt, fromSide, toSide, style);
    return svgEl('path', attrs, connsLayer);
  }

  function updateConnsFor(sid) {
    connsLayer.querySelectorAll('[data-from="' + sid + '"], [data-to="' + sid + '"]').forEach(function(p) {
      updateConnEl(p);
    });
  }

  function removeConnsFor(sid) {
    var removed = [];
    connsLayer.querySelectorAll('[data-from="' + sid + '"], [data-to="' + sid + '"]').forEach(function(p) {
      removed.push({ el: p, html: p.outerHTML });
      p.remove();
    });
    return removed;
  }

  /* ─── Waypoints ─── */

  function getWaypoints(p) {
    var raw = p.getAttribute('data-waypoints');
    if (!raw) return [];
    try { return JSON.parse(raw); } catch(e) { return []; }
  }

  function setWaypoints(p, wps) {
    if (!wps || wps.length === 0) p.removeAttribute('data-waypoints');
    else p.setAttribute('data-waypoints', JSON.stringify(wps));
  }

  function buildPathWithWaypoints(from, waypoints, to) {
    var d = 'M' + from.x + ',' + from.y;
    waypoints.forEach(function(wp) { d += ' L' + wp.x + ',' + wp.y; });
    d += ' L' + to.x + ',' + to.y;
    return d;
  }

  function connAtPoint(svgPt, tolerance) {
    var best = null, bestD = tolerance;
    connsLayer.querySelectorAll('[data-cid]').forEach(function(p) {
      try {
        var len = p.getTotalLength();
        var step = Math.max(2, len / 80);
        for (var t = 0; t <= len; t += step) {
          var pp = p.getPointAtLength(t);
          var dx = pp.x - svgPt.x, dy = pp.y - svgPt.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < bestD) { bestD = d; best = p; }
        }
      } catch(e) {}
    });
    return best;
  }

  /* ─── Properties Panel ─── */

  function showProps(g) {
    connForm.style.display = 'none';
    if (!g) {
      propsForm.style.display = 'none';
      if (!state.selectedConn) propsEmpty.style.display = '';
      return;
    }
    propsEmpty.style.display = 'none';
    propsForm.style.display = '';
    var s = getShapeEl(g);
    var t = getTextEl(g);
    fillIn.value = s ? s.getAttribute('fill') || DEFAULT_FILL : DEFAULT_FILL;
    if (fillIn.value === 'transparent' || fillIn.value === 'none') fillIn.value = DEFAULT_FILL;
    strokeIn.value = s ? s.getAttribute('stroke') || DEFAULT_STROKE : DEFAULT_STROKE;
    if (strokeIn.value === 'none') strokeIn.value = DEFAULT_STROKE;
    strokeWIn.value = s ? s.getAttribute('stroke-width') || 2 : 2;
    fontSzIn.value = t ? t.getAttribute('font-size') || 14 : 14;
    opacityIn.value = Math.round(parseFloat(g.getAttribute('opacity') || 1) * 100);
  }

  function showConnProps(path) {
    propsEmpty.style.display = 'none';
    propsForm.style.display = 'none';
    connForm.style.display = '';
    connStrokeIn.value = path.getAttribute('stroke') || DEFAULT_STROKE;
    connSwIn.value = path.getAttribute('stroke-width') || 2;
    connStyleIn.value = path.getAttribute('data-conn-style') || 'straight';
    connStartIn.value = path.getAttribute('data-marker-start') || 'none';
    connEndIn.value = path.getAttribute('data-marker-end') || 'arrow';
  }

  function applyProp(attr, value) {
    selectedGs().forEach(function(g) {
      var old;
      if (attr === 'fill' || attr === 'stroke' || attr === 'stroke-width') {
        var s = getShapeEl(g); if (!s) return;
        old = s.getAttribute(attr); s.setAttribute(attr, value);
        pushUndo({ undo: function() { s.setAttribute(attr, old); updateTextColors(g, old); }, redo: function() { s.setAttribute(attr, value); updateTextColors(g, value); } });
        if (attr === 'fill') {
          var hdr = g.querySelector('.cd-table-header');
          var hdrFill = hdr ? hdr.getAttribute('fill') : null;
          updateTextColors(g, value, hdrFill);
        }
      } else if (attr === 'font-size') {
        var t = getTextEl(g); if (!t) return;
        old = t.getAttribute('font-size'); t.setAttribute('font-size', value);
        pushUndo({ undo: function() { t.setAttribute('font-size', old); }, redo: function() { t.setAttribute('font-size', value); } });
      } else if (attr === 'opacity') {
        old = g.getAttribute('opacity') || '1'; g.setAttribute('opacity', value);
        pushUndo({ undo: function() { g.setAttribute('opacity', old); }, redo: function() { g.setAttribute('opacity', value); } });
      }
    });
    scheduleSave();
  }

  function applyConnProp(attr, value) {
    if (!state.selectedConn) return;
    var p = connsLayer.querySelector('[data-cid="' + state.selectedConn + '"]');
    if (!p) return;
    var old = p.getAttribute(attr) || '';
    if (attr === 'stroke' || attr === 'stroke-width') {
      p.setAttribute(attr, value);
    } else if (attr === 'data-conn-style') {
      p.setAttribute(attr, value);
      updateConnEl(p);
    } else if (attr === 'data-marker-start') {
      p.setAttribute(attr, value);
      if (value === 'none') p.removeAttribute('marker-start');
      else p.setAttribute('marker-start', markerUrl(value, true));
    } else if (attr === 'data-marker-end') {
      p.setAttribute(attr, value);
      if (value === 'none') p.removeAttribute('marker-end');
      else p.setAttribute('marker-end', markerUrl(value));
    }
    pushUndo({ undo: function() { p.setAttribute(attr, old); }, redo: function() { p.setAttribute(attr, value); } });
    if (attr === 'data-conn-style') { clearUI(); drawConnSelUI(p); }
    scheduleSave();
  }

  /* ─── Undo / Redo ─── */

  function pushUndo(cmd) {
    state.undoStack.push(cmd);
    if (state.undoStack.length > MAX_UNDO) state.undoStack.shift();
    state.redoStack = [];
  }
  function undo() { var c = state.undoStack.pop(); if (!c) return; c.undo(); state.redoStack.push(c); clearSelection(); scheduleSave(); }
  function redo() { var c = state.redoStack.pop(); if (!c) return; c.redo(); state.undoStack.push(c); clearSelection(); scheduleSave(); }

  /* ─── Text Editing ─── */

  function startTextEdit(g, targetText) {
    var t = targetText || getTextEl(g);
    if (!t) return;
    var b = getBBox(g);
    var type = g.getAttribute('data-type');

    var editBox;
    if (type === 'card') {
      var role = t.getAttribute('data-role');
      if (role === 'title') {
        editBox = { x: b.x, y: b.y, w: b.w, h: CARD_HEADER_H };
      } else {
        editBox = { x: b.x, y: b.y + CARD_HEADER_H, w: b.w, h: b.h - CARD_HEADER_H };
      }
    } else if (type === 'table') {
      var rows = +g.getAttribute('data-rows') || 3;
      var cols = +g.getAttribute('data-cols') || 3;
      var cW = b.w / cols, cH = b.h / rows;
      var row = +t.getAttribute('data-row'), col = +t.getAttribute('data-col');
      editBox = { x: b.x + col * cW, y: b.y + row * cH, w: cW, h: cH };
    } else {
      editBox = { x: b.x, y: b.y, w: b.w, h: b.h };
    }

    var ctm = svg.getScreenCTM();
    var svgRect = svg.getBoundingClientRect();
    var sx = ctm.a, sy = ctm.d;
    var ox = ctm.e - svgRect.left, oy = ctm.f - svgRect.top;

    var ta = document.createElement('textarea');
    ta.className = 'cd-text-editor';
    ta.value = getTextContent(t);
    ta.style.left = (editBox.x * sx + ox) + 'px';
    ta.style.top = (editBox.y * sy + oy) + 'px';
    ta.style.width = (editBox.w * sx) + 'px';
    ta.style.height = (editBox.h * sy) + 'px';
    var fs = parseFloat(t.getAttribute('font-size') || 14);
    ta.style.fontSize = (fs * sx) + 'px';
    if (t.getAttribute('font-weight') === 'bold') ta.style.fontWeight = 'bold';
    wrap.appendChild(ta);
    ta.focus();
    ta.select();

    var oldHtml = t.innerHTML;
    var oldShapeH = getBBox(g).h;
    var maxW = editBox.w - 8;
    function commit() {
      var newText = ta.value;
      if (ta.parentNode) ta.remove();
      var textH = wrapTextInShape(t, newText, maxW, fs);
      autoGrowShape(g, textH, 12);
      var newHtml = t.innerHTML;
      var newShapeH = getBBox(g).h;
      if (newHtml !== oldHtml || newShapeH !== oldShapeH) {
        var savedNewHtml = newHtml;
        var savedOldHtml = oldHtml;
        var savedNewShapeH = newShapeH;
        var savedOldShapeH = oldShapeH;
        pushUndo({
          undo: function() {
            t.innerHTML = savedOldHtml;
            var s = getShapeEl(g);
            if (s && s.tagName === 'rect' && savedNewShapeH !== savedOldShapeH) {
              s.setAttribute('height', savedOldShapeH);
              t.setAttribute('y', parseFloat(s.getAttribute('y')) + savedOldShapeH / 2);
            }
          },
          redo: function() {
            t.innerHTML = savedNewHtml;
            var s = getShapeEl(g);
            if (s && s.tagName === 'rect' && savedNewShapeH !== savedOldShapeH) {
              s.setAttribute('height', savedNewShapeH);
              t.setAttribute('y', parseFloat(s.getAttribute('y')) + savedNewShapeH / 2);
            }
          }
        });
        scheduleSave();
      }
      if (state.selected.indexOf(g.getAttribute('data-sid')) >= 0) drawSelectionUI();
    }
    ta.addEventListener('blur', commit);
    ta.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { t.innerHTML = oldHtml; if (ta.parentNode) ta.remove(); }
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ta.blur(); }
      e.stopPropagation();
    });
  }

  /* ─── Drawing interaction ─── */

  function startDraw(sx, sy, e) {
    sx = snapVal(sx); sy = snapVal(sy);
    var type = state.tool;
    if (type === 'text') {
      var g = createShape('text', sx - 60, sy - 15, 120, 30, { label: 'Text' });
      pushUndo({ undo: function() { g.remove(); }, redo: function() { shapesLayer.appendChild(g); } });
      setTool('select'); selectShape(g); startTextEdit(g); scheduleSave();
      return;
    }
    if (type === 'card') {
      var gc = createShape('card', sx - 80, sy - 50, 160, 100);
      pushUndo({ undo: function() { gc.remove(); }, redo: function() { shapesLayer.appendChild(gc); } });
      setTool('select'); selectShape(gc); scheduleSave();
      return;
    }
    if (type === 'table') {
      state.tablePending = { x: sx, y: sy };
      tableModal.style.display = '';
      return;
    }
    state.drawing = { type: type, sx: sx, sy: sy, g: null, constrain: e && (e.metaKey || e.ctrlKey) };
  }

  function onDrawMove(mx, my, e) {
    var d = state.drawing; if (!d) return;
    var constrain = d.constrain || (e && (e.metaKey || e.ctrlKey));
    mx = snapVal(mx); my = snapVal(my);
    var x = Math.min(d.sx, mx), y = Math.min(d.sy, my);
    var w = Math.abs(mx - d.sx), h = Math.abs(my - d.sy);
    if (constrain) { var s = Math.max(w, h); w = s; h = s; x = d.sx < mx ? d.sx : d.sx - s; y = d.sy < my ? d.sy : d.sy - s; }
    if (w < 4 && h < 4) return;
    if (!d.g) d.g = createShape(d.type, x, y, w, h);
    else resizeShapeEl(d.g, x, y, w, h);
  }

  function endDraw() {
    var d = state.drawing; state.drawing = null; if (!d) return;
    if (!d.g) {
      var w = 120, h = 80;
      d.g = createShape(d.type, d.sx - w / 2, d.sy - h / 2, w, h);
    }
    var el = d.g;
    pushUndo({ undo: function() { el.remove(); }, redo: function() { shapesLayer.appendChild(el); } });
    setTool('select'); selectShape(el); scheduleSave();
  }

  function confirmTable() {
    var tp = state.tablePending; state.tablePending = null;
    tableModal.style.display = 'none'; if (!tp) return;
    var rows = Math.max(1, +$('cd-table-rows').value || 3);
    var cols = Math.max(1, +$('cd-table-cols').value || 3);
    var w = cols * 100, h = rows * 36;
    var g = createShape('table', tp.x - w / 2, tp.y - h / 2, w, h, { rows: rows, cols: cols });
    pushUndo({ undo: function() { g.remove(); }, redo: function() { shapesLayer.appendChild(g); } });
    setTool('select'); selectShape(g); scheduleSave();
  }

  /* ─── Freehand drawing ─── */

  function startFreehand(pt, type) {
    var isHL = type === 'highlight';
    var fStroke = isHL ? '#fbbf24' : DEFAULT_STROKE;
    var fSw = isHL ? 18 : 2;
    var fOpacity = isHL ? 0.35 : 1;
    var tempEl = svgEl('polyline', {
      points: pt.x + ',' + pt.y,
      stroke: fStroke, 'stroke-width': fSw, fill: 'none',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      opacity: fOpacity, 'pointer-events': 'none'
    }, uiLayer);
    state.freehand = { type: type, points: [{ x: pt.x, y: pt.y }], tempEl: tempEl, stroke: fStroke, sw: fSw, opacity: fOpacity };
  }

  function onFreehandMove(pt) {
    var f = state.freehand; if (!f) return;
    f.points.push({ x: pt.x, y: pt.y });
    f.tempEl.setAttribute('points', f.tempEl.getAttribute('points') + ' ' + pt.x + ',' + pt.y);
  }

  function endFreehand() {
    var f = state.freehand; state.freehand = null; if (!f) return;
    if (f.tempEl) f.tempEl.remove();
    if (f.points.length < 2) return;
    var d = smoothPath(f.points);
    var g = createShape(f.type, 0, 0, 0, 0, { pathD: d, stroke: f.stroke, strokeWidth: f.sw, opacity: f.opacity });
    pushUndo({ undo: function() { g.remove(); }, redo: function() { shapesLayer.appendChild(g); } });
    setTool(f.type === 'highlight' ? 'highlight' : 'pen');
    scheduleSave();
  }

  /* ─── Eraser ─── */

  function startEraser() { state.erasing = { deleted: [] }; }

  function eraseAt(pt) {
    if (!state.erasing) return;
    var g = shapeAt(pt);
    if (!g) return;
    var sid = g.getAttribute('data-sid');
    if (state.erasing.deleted.some(function(d) { return d.sid === sid; })) return;
    var conns = removeConnsFor(sid);
    g.remove();
    state.erasing.deleted.push({ el: g, sid: sid, conns: conns });
  }

  function endEraser() {
    if (!state.erasing) return;
    var deleted = state.erasing.deleted;
    state.erasing = null;
    if (!deleted.length) return;
    pushUndo({
      undo: function() { deleted.forEach(function(d) { shapesLayer.appendChild(d.el); d.conns.forEach(function(c) { connsLayer.insertAdjacentHTML('beforeend', c.html); }); }); },
      redo: function() { deleted.forEach(function(d) { removeConnsFor(d.sid); d.el.remove(); }); }
    });
    scheduleSave();
  }

  /* ─── Connector drag interaction ─── */

  /* ─── Waypoint Dragging ─── */

  function startWaypointDrag(cid, wpIdx) {
    var p = connsLayer.querySelector('[data-cid="' + cid + '"]');
    if (!p) return;
    var oldWps = JSON.parse(JSON.stringify(getWaypoints(p)));
    state.waypointDrag = { cid: cid, wpIdx: wpIdx, oldWps: oldWps };
  }

  function onWaypointDragMove(pt) {
    var wd = state.waypointDrag;
    if (!wd) return;
    var p = connsLayer.querySelector('[data-cid="' + wd.cid + '"]');
    if (!p) return;
    var wps = getWaypoints(p);
    if (wd.wpIdx >= wps.length) return;
    wps[wd.wpIdx] = { x: snapVal(pt.x), y: snapVal(pt.y) };
    setWaypoints(p, wps);
    updateConnEl(p);
    clearUI();
    drawConnSelUI(p);
    showConnProps(p);
  }

  function endWaypointDrag() {
    var wd = state.waypointDrag;
    state.waypointDrag = null;
    if (!wd) return;
    var p = connsLayer.querySelector('[data-cid="' + wd.cid + '"]');
    if (!p) return;
    var newWps = JSON.parse(JSON.stringify(getWaypoints(p)));
    var oldWps = wd.oldWps;
    pushUndo({
      undo: function() { setWaypoints(p, oldWps); updateConnEl(p); },
      redo: function() { setWaypoints(p, newWps); updateConnEl(p); }
    });
    scheduleSave();
  }

  function removeWaypoint(cid, idx) {
    var p = connsLayer.querySelector('[data-cid="' + cid + '"]');
    if (!p) return;
    var wps = getWaypoints(p);
    if (idx >= wps.length) return;
    var oldWps = JSON.parse(JSON.stringify(wps));
    wps.splice(idx, 1);
    setWaypoints(p, wps);
    updateConnEl(p);
    clearUI();
    drawConnSelUI(p);
    pushUndo({
      undo: function() { setWaypoints(p, oldWps); updateConnEl(p); clearUI(); drawConnSelUI(p); },
      redo: function() { var nw = JSON.parse(JSON.stringify(oldWps)); nw.splice(idx, 1); setWaypoints(p, nw); updateConnEl(p); clearUI(); drawConnSelUI(p); }
    });
    scheduleSave();
  }

  function startConnDrag(pt, shapeG) {
    clearUI();
    var fromId = shapeG ? shapeG.getAttribute('data-sid') : '';
    var fromPt;

    if (shapeG) {
      var na = nearestAnchor(shapeG, pt);
      fromPt = na.pt;
      var anchors = getAnchors(shapeG);
      ['top', 'right', 'bottom', 'left'].forEach(function(k) {
        svgEl('circle', { cx: anchors[k].x, cy: anchors[k].y, r: 5 / state.zoom, 'class': 'cd-anchor-hint' }, uiLayer);
      });
    } else {
      fromPt = { x: pt.x, y: pt.y };
    }

    var tempEl = svgEl('line', {
      x1: fromPt.x, y1: fromPt.y, x2: pt.x, y2: pt.y,
      'class': 'cd-conn-temp', 'pointer-events': 'none'
    }, uiLayer);

    state.connDrag = { fromId: fromId, fromPt: fromPt, tempEl: tempEl, lastHover: null };
  }

  function onConnDragMove(pt) {
    var cd = state.connDrag; if (!cd) return;

    var snapPt = { x: pt.x, y: pt.y };
    var hoverShape = shapeAt(pt);

    if (hoverShape && hoverShape.getAttribute('data-sid') !== cd.fromId) {
      if (cd.lastHover !== hoverShape.getAttribute('data-sid')) {
        uiLayer.querySelectorAll('.cd-anchor-hover').forEach(function(el) { el.remove(); });
        cd.lastHover = hoverShape.getAttribute('data-sid');
        var anchors = getAnchors(hoverShape);
        ['top', 'right', 'bottom', 'left'].forEach(function(k) {
          svgEl('circle', { cx: anchors[k].x, cy: anchors[k].y, r: 5 / state.zoom, 'class': 'cd-anchor-hint cd-anchor-hover' }, uiLayer);
        });
      }
      var na = nearestAnchor(hoverShape, pt);
      if (na.dist < SNAP_RADIUS) snapPt = na.pt;
    } else {
      if (cd.lastHover) {
        uiLayer.querySelectorAll('.cd-anchor-hover').forEach(function(el) { el.remove(); });
        cd.lastHover = null;
      }
    }

    cd.tempEl.setAttribute('x2', snapPt.x);
    cd.tempEl.setAttribute('y2', snapPt.y);
  }

  function endConnDrag(pt) {
    var cd = state.connDrag;
    state.connDrag = null;
    clearUI();
    drawSelectionUI();
    if (!cd) return;

    var targetShape = shapeAt(pt);
    var toId = '';
    var toPt = { x: pt.x, y: pt.y };

    if (targetShape) {
      var tsid = targetShape.getAttribute('data-sid');
      if (tsid === cd.fromId) return;
      toId = tsid;
      var na = nearestAnchor(targetShape, pt);
      if (na.dist < SNAP_RADIUS) toPt = na.pt;
    }

    if (dist(cd.fromPt, toPt) < 25) return;

    var path = createConnector({
      fromId: cd.fromId, toId: toId,
      fromPt: cd.fromPt, toPt: toPt
    });

    if (path) {
      pushUndo({ undo: function() { path.remove(); }, redo: function() { connsLayer.appendChild(path); } });
      scheduleSave();
    }
  }

  /* ─── Drag (move) ─── */

  function startDrag(g, sx, sy) {
    var boxes = selectedGs().map(function(gg) { return { g: gg, b: getBBox(gg) }; });
    state.dragging = { sx: sx, sy: sy, boxes: boxes };
  }
  function onDragMove(mx, my) {
    var d = state.dragging; if (!d) return;
    var dx = mx - d.sx, dy = my - d.sy;
    if (state.snapToGrid && d.boxes.length > 0) {
      var fb = d.boxes[0].b;
      dx = snapVal(fb.x + dx) - fb.x;
      dy = snapVal(fb.y + dy) - fb.y;
    }
    d.boxes.forEach(function(item) { resizeShapeEl(item.g, item.b.x + dx, item.b.y + dy, item.b.w, item.b.h); updateConnsFor(item.g.getAttribute('data-sid')); });
    drawSelectionUI();
  }
  function endDrag(mx, my) {
    var d = state.dragging; state.dragging = null; if (!d) return;
    var dx = mx - d.sx, dy = my - d.sy;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    var snaps = d.boxes.map(function(i) { return { g: i.g, ox: i.b.x, oy: i.b.y, nx: i.b.x + dx, ny: i.b.y + dy, w: i.b.w, h: i.b.h }; });
    pushUndo({
      undo: function() { snaps.forEach(function(s) { resizeShapeEl(s.g, s.ox, s.oy, s.w, s.h); updateConnsFor(s.g.getAttribute('data-sid')); }); drawSelectionUI(); },
      redo: function() { snaps.forEach(function(s) { resizeShapeEl(s.g, s.nx, s.ny, s.w, s.h); updateConnsFor(s.g.getAttribute('data-sid')); }); drawSelectionUI(); }
    });
    scheduleSave();
  }

  /* ─── Resize ─── */

  function startResize(handle, sid) {
    var g = shapesLayer.querySelector('[data-sid="' + sid + '"]'); if (!g) return;
    state.resizing = { g: g, dir: handle, orig: getBBox(g) };
  }
  function onResizeMove(mx, my, e) {
    var r = state.resizing; if (!r) return;
    mx = snapVal(mx); my = snapVal(my);
    var o = r.orig, dir = r.dir;
    var nx = o.x, ny = o.y, nw = o.w, nh = o.h;
    if (dir.indexOf('e') >= 0) nw = Math.max(MIN_SHAPE, mx - o.x);
    if (dir.indexOf('w') >= 0) { nx = Math.min(mx, o.x + o.w - MIN_SHAPE); nw = o.x + o.w - nx; }
    if (dir.indexOf('s') >= 0) nh = Math.max(MIN_SHAPE, my - o.y);
    if (dir.indexOf('n') >= 0) { ny = Math.min(my, o.y + o.h - MIN_SHAPE); nh = o.y + o.h - ny; }
    if (e && (e.metaKey || e.ctrlKey)) { var s = Math.max(nw, nh); nw = s; nh = s; }
    resizeShapeEl(r.g, nx, ny, nw, nh);
    updateConnsFor(r.g.getAttribute('data-sid'));
    drawSelectionUI();
  }
  function endResize() {
    var r = state.resizing; state.resizing = null; if (!r) return;
    var g = r.g, orig = r.orig, nb = getBBox(g);
    pushUndo({
      undo: function() { resizeShapeEl(g, orig.x, orig.y, orig.w, orig.h); updateConnsFor(g.getAttribute('data-sid')); drawSelectionUI(); },
      redo: function() { resizeShapeEl(g, nb.x, nb.y, nb.w, nb.h); updateConnsFor(g.getAttribute('data-sid')); drawSelectionUI(); }
    });
    scheduleSave();
  }

  /* ─── Pan / Zoom ─── */

  function startPan(cx, cy) { state.panning = { sx: cx, sy: cy, vx: state.vb.x, vy: state.vb.y }; setCursorMode('panning'); }
  function onPanMove(cx, cy) {
    var p = state.panning; if (!p) return;
    state.vb.x = p.vx - (cx - p.sx) / state.zoom;
    state.vb.y = p.vy - (cy - p.sy) / state.zoom;
    updateViewBox();
  }
  function endPan() { state.panning = null; setCursorMode(state.spaceHeld ? 'pan' : (state.tool === 'select' ? 'select' : '')); }

  function applyZoom(factor, cx, cy) {
    var cursor = (cx !== undefined) ? screenToSVG(cx, cy) : { x: state.vb.x + state.vb.w / 2, y: state.vb.y + state.vb.h / 2 };
    state.vb.x = cursor.x - (cursor.x - state.vb.x) * factor;
    state.vb.y = cursor.y - (cursor.y - state.vb.y) * factor;
    state.vb.w *= factor; state.vb.h *= factor;
    updateViewBox(); drawSelectionUI();
  }

  function zoomIn() { applyZoom(1 / 1.2); }
  function zoomOut() { applyZoom(1.2); }

  function handleWheel(e) {
    if (e.ctrlKey) {
      e.preventDefault();
      var factor = e.deltaY > 0 ? 1.08 : 1 / 1.08;
      applyZoom(factor, e.clientX, e.clientY);
    } else {
      e.preventDefault();
      state.vb.x += e.deltaX / state.zoom;
      state.vb.y += e.deltaY / state.zoom;
      updateViewBox();
      drawSelectionUI();
    }
  }

  function fitToScreen() {
    var allBB = null;
    Array.from(shapesLayer.children).forEach(function(g) {
      if (!g.hasAttribute('data-sid')) return;
      var b = getBBox(g);
      if (!allBB) { allBB = { x1: b.x, y1: b.y, x2: b.x + b.w, y2: b.y + b.h }; }
      else { allBB.x1 = Math.min(allBB.x1, b.x); allBB.y1 = Math.min(allBB.y1, b.y); allBB.x2 = Math.max(allBB.x2, b.x + b.w); allBB.y2 = Math.max(allBB.y2, b.y + b.h); }
    });
    Array.from(connsLayer.children).forEach(function(p) {
      if (!p.hasAttribute('data-cid')) return;
      try {
        var bb = p.getBBox();
        if (!allBB) { allBB = { x1: bb.x, y1: bb.y, x2: bb.x + bb.width, y2: bb.y + bb.height }; }
        else { allBB.x1 = Math.min(allBB.x1, bb.x); allBB.y1 = Math.min(allBB.y1, bb.y); allBB.x2 = Math.max(allBB.x2, bb.x + bb.width); allBB.y2 = Math.max(allBB.y2, bb.y + bb.height); }
      } catch (e) { /* ignore empty paths */ }
    });
    if (!allBB) return;
    var pad = 50;
    state.vb.x = allBB.x1 - pad; state.vb.y = allBB.y1 - pad;
    state.vb.w = (allBB.x2 - allBB.x1) + pad * 2;
    state.vb.h = (allBB.y2 - allBB.y1) + pad * 2;
    var wr = wrap.getBoundingClientRect();
    var aspect = wr.width / wr.height;
    var vbA = state.vb.w / state.vb.h;
    if (vbA > aspect) { var nh = state.vb.w / aspect; state.vb.y -= (nh - state.vb.h) / 2; state.vb.h = nh; }
    else { var nw = state.vb.h * aspect; state.vb.x -= (nw - state.vb.w) / 2; state.vb.w = nw; }
    updateViewBox(); drawSelectionUI();
  }

  function toggleHelp() {
    var el = $('cd-shortcuts-help');
    el.style.display = el.style.display === 'none' ? '' : 'none';
  }

  /* ─── Marquee ─── */

  function startMarquee(sx, sy) { state.marquee = { sx: sx, sy: sy, el: null }; }
  function onMarqueeMove(mx, my) {
    var m = state.marquee; if (!m) return;
    var x = Math.min(m.sx, mx), y = Math.min(m.sy, my), w = Math.abs(mx - m.sx), h = Math.abs(my - m.sy);
    if (!m.el) m.el = svgEl('rect', { x: x, y: y, width: w, height: h, 'class': 'cd-marquee' }, uiLayer);
    else { m.el.setAttribute('x', x); m.el.setAttribute('y', y); m.el.setAttribute('width', w); m.el.setAttribute('height', h); }
  }
  function endMarquee(mx, my) {
    var m = state.marquee; state.marquee = null; if (!m) return;
    if (m.el) m.el.remove();
    var x1 = Math.min(m.sx, mx), y1 = Math.min(m.sy, my), x2 = Math.max(m.sx, mx), y2 = Math.max(m.sy, my);
    if (x2 - x1 < 4 && y2 - y1 < 4) return;
    state.selected = [];
    Array.from(shapesLayer.children).forEach(function(g) {
      if (!g.hasAttribute('data-sid')) return;
      var b = getBBox(g);
      if (b.x < x2 && b.x + b.w > x1 && b.y < y2 && b.y + b.h > y1) state.selected.push(g.getAttribute('data-sid'));
    });
    drawSelectionUI();
    showProps(state.selected.length === 1 ? selectedGs()[0] : null);
  }

  /* ─── Delete / Duplicate / Copy-Paste / Z-order ─── */

  function deleteSelected() {
    if (state.selectedConn) {
      var connCid = state.selectedConn;
      var cp = connsLayer.querySelector('[data-cid="' + connCid + '"]');
      if (cp) {
        var html = cp.outerHTML;
        cp.remove();
        pushUndo({
          undo: function() { connsLayer.insertAdjacentHTML('beforeend', html); },
          redo: function() { var el = connsLayer.querySelector('[data-cid="' + connCid + '"]'); if (el) el.remove(); }
        });
      }
      clearSelection(); scheduleSave(); return;
    }
    var gs = selectedGs(); if (!gs.length) return;
    var removed = [];
    gs.forEach(function(g) {
      var sid = g.getAttribute('data-sid');
      var conns = removeConnsFor(sid);
      removed.push({ el: g, conns: conns }); g.remove();
    });
    clearSelection();
    pushUndo({
      undo: function() { removed.forEach(function(r) { shapesLayer.appendChild(r.el); r.conns.forEach(function(c) { connsLayer.insertAdjacentHTML('beforeend', c.html); }); }); },
      redo: function() { removed.forEach(function(r) { r.el.remove(); r.conns.forEach(function(c) { var el = connsLayer.querySelector('[data-cid="' + c.el.getAttribute('data-cid') + '"]'); if (el) el.remove(); }); }); }
    });
    scheduleSave();
  }

  function duplicateSelected() {
    var gs = selectedGs(); if (!gs.length) return;
    var clones = [];
    gs.forEach(function(g) { var c = cloneShapeG(g); moveShapeBy(c, 20, 20); clones.push(c); });
    pushUndo({ undo: function() { clones.forEach(function(c) { c.remove(); }); }, redo: function() { clones.forEach(function(c) { shapesLayer.appendChild(c); }); } });
    state.selected = clones.map(function(c) { return c.getAttribute('data-sid'); });
    drawSelectionUI(); showProps(clones.length === 1 ? clones[0] : null); scheduleSave();
  }

  function copySelected() {
    var gs = selectedGs(); if (!gs.length) return;
    state.clipboard = gs.map(function(g) { return g.outerHTML; });
  }

  function paste() {
    if (!state.clipboard.length) return;
    var clones = [];
    state.clipboard.forEach(function(html) {
      var tmp = document.createElementNS(NS, 'g');
      tmp.innerHTML = html;
      var g = tmp.firstChild; if (!g) return;
      g.setAttribute('data-sid', uid());
      shapesLayer.appendChild(g);
      moveShapeBy(g, 20, 20);
      clones.push(g);
    });
    if (!clones.length) return;
    pushUndo({ undo: function() { clones.forEach(function(c) { c.remove(); }); }, redo: function() { clones.forEach(function(c) { shapesLayer.appendChild(c); }); } });
    state.selected = clones.map(function(c) { return c.getAttribute('data-sid'); });
    drawSelectionUI(); showProps(clones.length === 1 ? clones[0] : null); scheduleSave();
  }

  function bringToFront() { selectedGs().forEach(function(g) { shapesLayer.appendChild(g); }); scheduleSave(); }
  function sendToBack() { selectedGs().reverse().forEach(function(g) { shapesLayer.insertBefore(g, shapesLayer.firstChild); }); scheduleSave(); }

  /* ─── Toolbar ─── */

  function setTool(name) {
    state.tool = name;
    toolbar.querySelectorAll('.cd-tool').forEach(function(b) { b.classList.toggle('cd-tool--active', b.getAttribute('data-tool') === name); });
    var cursorMap = { select: 'select', connector: 'select', pen: 'pen', highlight: 'highlight', eraser: 'eraser' };
    setCursorMode(cursorMap[name] || '');
    if (name !== 'connector') { state.connDrag = null; clearUI(); drawSelectionUI(); }
    if (name !== 'select') clearSelection();
  }

  /* ─── Projects ─── */

  function newProjectData(name) { return { id: 'p' + Date.now(), name: name || 'Untitled', shapesHTML: '', connectorsHTML: '', vb: { x: 0, y: 0, w: 1000, h: 700 }, nextShapeId: 1, nextConnId: 1 }; }

  function saveCurrentProject() {
    if (!state.activeProjectId) return Promise.resolve();
    return DCStore.set(TOOL_KEY, state.activeProjectId, {
      name: (state.projects.find(function(p) { return p.id === state.activeProjectId; }) || {}).name || 'Untitled',
      shapesHTML: shapesLayer.innerHTML, connectorsHTML: connsLayer.innerHTML,
      vb: Object.assign({}, state.vb), nextShapeId: state.nextShapeId, nextConnId: state.nextConnId
    });
  }

  var scheduleSave = debounce(function() { saveCurrentProject(); }, SAVE_DELAY);

  function fixupTextColors() {
    Array.prototype.forEach.call(shapesLayer.children, function(g) {
      if (!g.hasAttribute('data-sid')) return;
      var s = getShapeEl(g);
      var fill = s ? s.getAttribute('fill') : null;
      var hdr = g.querySelector('.cd-table-header');
      var hdrFill = hdr ? hdr.getAttribute('fill') : null;
      updateTextColors(g, fill, hdrFill);
    });
  }

  function loadProject(id) {
    if (state.activeProjectId && state.activeProjectId !== id) saveCurrentProject();
    state.activeProjectId = id;
    DCStore.get(TOOL_KEY, id).then(function(data) {
      if (!data) data = newProjectData();
      shapesLayer.innerHTML = data.shapesHTML || '';
      connsLayer.innerHTML = data.connectorsHTML || '';
      state.vb = data.vb || { x: 0, y: 0, w: 1000, h: 700 };
      state.nextShapeId = data.nextShapeId || 1;
      state.nextConnId = data.nextConnId || 1;
      state.undoStack = []; state.redoStack = [];
      clearSelection(); updateViewBox(); renderTabs();
      fixupTextColors();
    });
  }

  function addProject(name) {
    var p = newProjectData(name);
    state.projects.push({ id: p.id, name: p.name });
    DCStore.set(TOOL_KEY, p.id, p);
    localStorage.setItem('cd_projects', JSON.stringify(state.projects));
    loadProject(p.id);
  }

  function removeProject(id) {
    state.projects = state.projects.filter(function(p) { return p.id !== id; });
    DCStore.remove(TOOL_KEY, id);
    localStorage.setItem('cd_projects', JSON.stringify(state.projects));
    if (state.activeProjectId === id) { state.projects.length ? loadProject(state.projects[0].id) : addProject('Untitled'); }
    else renderTabs();
  }

  function renameProject(id, name) {
    state.projects.forEach(function(p) { if (p.id === id) p.name = name; });
    localStorage.setItem('cd_projects', JSON.stringify(state.projects));
    DCStore.get(TOOL_KEY, id).then(function(d) { if (d) { d.name = name; DCStore.set(TOOL_KEY, id, d); } });
    renderTabs();
  }

  function renderTabs() {
    tabList.innerHTML = '';
    state.projects.forEach(function(p) {
      var tab = document.createElement('button');
      tab.className = 'cd-tab' + (p.id === state.activeProjectId ? ' cd-tab--active' : '');
      var span = document.createElement('span');
      span.textContent = p.name;
      span.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        var n = prompt('Rename project:', p.name);
        if (n && n.trim()) renameProject(p.id, n.trim());
      });
      tab.appendChild(span);
      if (state.projects.length > 1) {
        var close = document.createElement('span');
        close.className = 'cd-tab__close'; close.textContent = '\u00d7';
        close.addEventListener('click', function(e) { e.stopPropagation(); removeProject(p.id); });
        tab.appendChild(close);
      }
      tab.addEventListener('click', function() { if (state.activeProjectId !== p.id) loadProject(p.id); });
      tabList.appendChild(tab);
    });
  }

  /* ─── Export ─── */

  function cleanClone() {
    var clone = svg.cloneNode(true);
    var ui = clone.querySelector('#cd-ui-layer'); if (ui) ui.remove();
    var bg = clone.querySelector('#cd-grid-bg'); if (bg) bg.remove();
    var pat = clone.querySelector('#cd-grid-pat'); if (pat) pat.remove();
    var v = state.vb;
    clone.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h);
    clone.setAttribute('width', Math.round(v.w));
    clone.setAttribute('height', Math.round(v.h));
    clone.setAttribute('xmlns', NS);
    return clone;
  }
  function exportSVG() { download(new XMLSerializer().serializeToString(cleanClone()), 'canvas-draw.svg', 'image/svg+xml'); }
  function exportPNG() {
    var clone = cleanClone(), w = Math.round(state.vb.w), h = Math.round(state.vb.h);
    var scale = Math.max(1, 1200 / w);
    clone.setAttribute('width', Math.round(w * scale)); clone.setAttribute('height', Math.round(h * scale));
    var blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' });
    var url = URL.createObjectURL(blob), img = new Image();
    img.onload = function() {
      var c = document.createElement('canvas'); c.width = Math.round(w * scale); c.height = Math.round(h * scale);
      var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url); c.toBlob(function(b) { download(b, 'canvas-draw.png', 'image/png'); });
    };
    img.src = url;
  }
  function exportJSON() {
    download(JSON.stringify({
      name: (state.projects.find(function(p) { return p.id === state.activeProjectId; }) || {}).name || 'Export',
      shapesHTML: shapesLayer.innerHTML, connectorsHTML: connsLayer.innerHTML,
      vb: state.vb, nextShapeId: state.nextShapeId, nextConnId: state.nextConnId
    }, null, 2), 'canvas-draw.json', 'application/json');
  }
  function importJSON(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = JSON.parse(e.target.result);
        var p = { id: 'p' + Date.now(), name: data.name || 'Imported' };
        state.projects.push(p); localStorage.setItem('cd_projects', JSON.stringify(state.projects));
        DCStore.set(TOOL_KEY, p.id, data).then(function() { loadProject(p.id); });
      } catch (err) { alert('Invalid JSON file'); }
    };
    reader.readAsText(file);
  }
  function download(content, name, type) {
    var blob = content instanceof Blob ? content : new Blob([content], { type: type });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(a.href);
  }

  /* ─── Main pointer events ─── */

  function onPointerDown(e) {
    if (e.button === 1) { startPan(e.clientX, e.clientY); e.preventDefault(); return; }
    if (e.button !== 0) return;
    var pt = screenToSVG(e.clientX, e.clientY);
    if (state.spaceHeld) { startPan(e.clientX, e.clientY); return; }

    var handleEl = e.target.closest ? e.target.closest('[data-handle]') : null;
    if (handleEl) { startResize(handleEl.getAttribute('data-handle'), handleEl.getAttribute('data-target')); return; }

    var wpHandleEl = e.target.closest ? e.target.closest('[data-wp-cid]') : null;
    if (wpHandleEl) {
      var wpCid = wpHandleEl.getAttribute('data-wp-cid');
      if (wpHandleEl.hasAttribute('data-wp-idx')) {
        startWaypointDrag(wpCid, +wpHandleEl.getAttribute('data-wp-idx'));
      } else if (wpHandleEl.hasAttribute('data-wp-mid-idx')) {
        var midIdx = +wpHandleEl.getAttribute('data-wp-mid-idx');
        var cp = connsLayer.querySelector('[data-cid="' + wpCid + '"]');
        if (cp) {
          var wps = getWaypoints(cp);
          var cpts = resolveConnPoints(cp);
          var allPts = cpts ? [cpts.from].concat(wps).concat([cpts.to]) : [];
          var mx = allPts.length > midIdx + 1 ? (allPts[midIdx].x + allPts[midIdx + 1].x) / 2 : pt.x;
          var my = allPts.length > midIdx + 1 ? (allPts[midIdx].y + allPts[midIdx + 1].y) / 2 : pt.y;
          wps.splice(midIdx, 0, { x: mx, y: my });
          setWaypoints(cp, wps);
          updateConnEl(cp);
          startWaypointDrag(wpCid, midIdx);
        }
      }
      return;
    }

    var shapeG = getShapeG(e.target);
    var connP = !shapeG ? getConnPath(e.target) : null;

    if (state.tool === 'connector') {
      startConnDrag(pt, shapeG);
      return;
    }

    if (state.tool === 'pen' || state.tool === 'highlight') {
      startFreehand(pt, state.tool === 'highlight' ? 'highlight' : 'freehand');
      return;
    }

    if (state.tool === 'eraser') {
      startEraser();
      eraseAt(pt);
      return;
    }

    if (state.tool === 'sticky') {
      var gs = createShape('sticky', pt.x - 70, pt.y - 70, 140, 140);
      pushUndo({ undo: function() { gs.remove(); }, redo: function() { shapesLayer.appendChild(gs); } });
      setTool('select'); selectShape(gs); scheduleSave();
      return;
    }

    if (state.tool === 'select') {
      if (shapeG) {
        var sid = shapeG.getAttribute('data-sid');
        if (e.shiftKey) selectShape(shapeG, true);
        else if (state.selected.indexOf(sid) < 0) selectShape(shapeG, false);
        startDrag(shapeG, pt.x, pt.y);
      } else if (connP) {
        selectConn(connP);
      } else {
        var nearConn = connAtPoint(pt, 8 / state.zoom);
        if (nearConn) {
          selectConn(nearConn);
        } else {
          if (!e.shiftKey) clearSelection();
          startMarquee(pt.x, pt.y);
        }
      }
      return;
    }

    startDraw(pt.x, pt.y, e);
  }

  function onPointerMove(e) {
    var pt = screenToSVG(e.clientX, e.clientY);
    if (state.waypointDrag) { onWaypointDragMove(pt); return; }
    if (state.panning) { onPanMove(e.clientX, e.clientY); return; }
    if (state.resizing) { onResizeMove(pt.x, pt.y, e); return; }
    if (state.dragging) { onDragMove(pt.x, pt.y); return; }
    if (state.drawing) { onDrawMove(pt.x, pt.y, e); return; }
    if (state.freehand) { onFreehandMove(pt); return; }
    if (state.erasing) { eraseAt(pt); return; }
    if (state.marquee) { onMarqueeMove(pt.x, pt.y); return; }
    if (state.connDrag) { onConnDragMove(pt); return; }
  }

  function onPointerUp(e) {
    var pt = screenToSVG(e.clientX, e.clientY);
    if (state.waypointDrag) { endWaypointDrag(); return; }
    if (state.panning) { endPan(); return; }
    if (state.resizing) { endResize(); return; }
    if (state.dragging) { endDrag(pt.x, pt.y); return; }
    if (state.drawing) { endDraw(); return; }
    if (state.freehand) { endFreehand(); return; }
    if (state.erasing) { endEraser(); return; }
    if (state.marquee) { endMarquee(pt.x, pt.y); return; }
    if (state.connDrag) { endConnDrag(pt); return; }
  }

  /* ─── Keyboard ─── */

  function onKeyDown(e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    if (e.key === ' ') { e.preventDefault(); if (!state.spaceHeld) { state.spaceHeld = true; setCursorMode('pan'); } return; }
    if (e.key === 'Escape') { setTool('select'); clearSelection(); modal.style.display = 'none'; tableModal.style.display = 'none'; $('cd-shortcuts-help').style.display = 'none'; return; }
    if (e.key === 'Delete' || e.key === 'Backspace') { deleteSelected(); return; }

    var ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
    if (ctrl && (e.key === 'Z' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); return; }
    if (ctrl && e.key === 'y') { e.preventDefault(); redo(); return; }
    if (ctrl && e.key === 'd') { e.preventDefault(); duplicateSelected(); return; }
    if (ctrl && e.key === 'c') { e.preventDefault(); copySelected(); return; }
    if (ctrl && e.key === 'v') { e.preventDefault(); paste(); return; }
    if (ctrl && e.key === 'a') { e.preventDefault(); state.selected = Array.from(shapesLayer.children).map(function(g) { return g.getAttribute('data-sid'); }).filter(Boolean); drawSelectionUI(); return; }
    if (ctrl && e.key === 's') { e.preventDefault(); saveCurrentProject(); return; }
    if (ctrl && e.key === 'e') { e.preventDefault(); modal.style.display = ''; return; }
    if (e.key === ']' && ctrl) { e.preventDefault(); bringToFront(); return; }
    if (e.key === '[' && ctrl) { e.preventDefault(); sendToBack(); return; }

    if (e.key === '?') { toggleHelp(); return; }

    if (e.key === 'v' || e.key === 'V') { setTool('select'); return; }
    if (e.key === 'r' || e.key === 'R') { setTool('rect'); return; }
    if ((e.key === 'c' || e.key === 'C') && !ctrl) { setTool('circle'); return; }
    if (e.key === 'd' && !ctrl) { setTool('diamond'); return; }
    if (e.key === 't' || e.key === 'T') { setTool('text'); return; }
    if (e.key === 'l' || e.key === 'L') { setTool('connector'); return; }
    if (e.key === 'p' || e.key === 'P') { setTool('pen'); return; }
    if (e.key === 'h' && !ctrl) { setTool('highlight'); return; }
    if (e.key === 'e' && !ctrl) { setTool('eraser'); return; }
    if (e.key === 'n' || e.key === 'N') { setTool('sticky'); return; }
  }

  function onKeyUp(e) {
    if (e.key === ' ') { state.spaceHeld = false; if (!state.panning) setCursorMode(state.tool === 'select' ? 'select' : ''); }
  }

  /* ─── Double-click for text edit ─── */

  function onDblClick(e) {
    var wpHandle = e.target.closest ? e.target.closest('[data-wp-idx]') : null;
    if (wpHandle && wpHandle.hasAttribute('data-wp-cid')) {
      removeWaypoint(wpHandle.getAttribute('data-wp-cid'), +wpHandle.getAttribute('data-wp-idx'));
      return;
    }
    var g = getShapeG(e.target);
    if (!g) return;
    var type = g.getAttribute('data-type');
    if (type === 'card') {
      var pt = screenToSVG(e.clientX, e.clientY);
      var b = getBBox(g);
      var target = (pt.y < b.y + CARD_HEADER_H) ? g.querySelector('[data-role="title"]') : g.querySelector('[data-role="desc"]');
      if (target) startTextEdit(g, target);
    } else if (type === 'table') {
      var pt2 = screenToSVG(e.clientX, e.clientY);
      var b2 = getBBox(g);
      var rows = +g.getAttribute('data-rows') || 3, cols = +g.getAttribute('data-cols') || 3;
      var cW = b2.w / cols, cH = b2.h / rows;
      var col = Math.floor((pt2.x - b2.x) / cW), row = Math.floor((pt2.y - b2.y) / cH);
      col = Math.max(0, Math.min(col, cols - 1)); row = Math.max(0, Math.min(row, rows - 1));
      var cellText = g.querySelector('text[data-row="' + row + '"][data-col="' + col + '"]');
      if (cellText) startTextEdit(g, cellText);
    } else {
      startTextEdit(g);
    }
  }

  /* ─── Init ─── */

  function init() {
    svg = $('cd-svg');
    shapesLayer = $('cd-shapes-layer');
    connsLayer = $('cd-connectors-layer');
    uiLayer = $('cd-ui-layer');
    gridPat = $('cd-grid-pat');
    wrap = $('cd-canvas-wrap');
    zoomInfo = $('cd-zoom-info');
    toolbar = $('cd-toolbar');
    propsEmpty = $('cd-props-empty');
    propsForm = $('cd-props-form');
    connForm = $('cd-conn-form');
    fillIn = $('cd-fill');
    strokeIn = $('cd-stroke');
    strokeWIn = $('cd-stroke-w');
    fontSzIn = $('cd-font-sz');
    opacityIn = $('cd-opacity');
    connStrokeIn = $('cd-conn-stroke');
    connSwIn = $('cd-conn-sw');
    connStyleIn = $('cd-conn-style');
    connStartIn = $('cd-conn-start');
    connEndIn = $('cd-conn-end');
    tabList = $('cd-tab-list');
    modal = $('cd-modal');
    tableModal = $('cd-table-modal');
    importFile = $('cd-import-file');

    var rect = wrap.getBoundingClientRect();
    state.vb.w = rect.width || 1000;
    state.vb.h = rect.height || 700;
    updateViewBox();

    new ResizeObserver(function() {
      var r = wrap.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) { state.vb.h = state.vb.w / (r.width / r.height); updateViewBox(); }
    }).observe(wrap);

    setCursorMode('select');

    svg.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    svg.addEventListener('wheel', handleWheel, { passive: false });
    svg.addEventListener('dblclick', onDblClick);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    svg.addEventListener('contextmenu', function(e) { e.preventDefault(); });

    toolbar.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-tool]');
      if (btn) setTool(btn.getAttribute('data-tool'));
    });

    fillIn.addEventListener('input', function() { applyProp('fill', fillIn.value); });
    strokeIn.addEventListener('input', function() { applyProp('stroke', strokeIn.value); });
    strokeWIn.addEventListener('input', function() { applyProp('stroke-width', strokeWIn.value); });
    fontSzIn.addEventListener('change', function() { applyProp('font-size', fontSzIn.value); });
    opacityIn.addEventListener('input', function() { applyProp('opacity', opacityIn.value / 100); });

    connStrokeIn.addEventListener('input', function() { applyConnProp('stroke', connStrokeIn.value); });
    connSwIn.addEventListener('input', function() { applyConnProp('stroke-width', connSwIn.value); });
    connStyleIn.addEventListener('change', function() { applyConnProp('data-conn-style', connStyleIn.value); });
    connStartIn.addEventListener('change', function() { applyConnProp('data-marker-start', connStartIn.value); });
    connEndIn.addEventListener('change', function() { applyConnProp('data-marker-end', connEndIn.value); });

    $('cd-zoom-in').addEventListener('click', zoomIn);
    $('cd-zoom-out').addEventListener('click', zoomOut);
    $('cd-fit-screen').addEventListener('click', fitToScreen);

    var snapBtn = $('cd-snap-grid');
    snapBtn.addEventListener('click', function() {
      state.snapToGrid = !state.snapToGrid;
      snapBtn.classList.toggle('cd-snap-active', state.snapToGrid);
    });

    $('cd-help-btn').addEventListener('click', toggleHelp);
    $('cd-help-close').addEventListener('click', function() { $('cd-shortcuts-help').style.display = 'none'; });
    $('cd-shortcuts-help').addEventListener('click', function(e) { if (e.target.id === 'cd-shortcuts-help') e.target.style.display = 'none'; });

    document.querySelectorAll('#cd-fill-palette .cd-swatch').forEach(function(sw) {
      sw.addEventListener('click', function() {
        fillIn.value = sw.getAttribute('data-color');
        applyProp('fill', fillIn.value);
      });
    });
    document.querySelectorAll('#cd-stroke-palette .cd-swatch').forEach(function(sw) {
      sw.addEventListener('click', function() {
        strokeIn.value = sw.getAttribute('data-color');
        applyProp('stroke', strokeIn.value);
      });
    });
    $('cd-del-btn').addEventListener('click', deleteSelected);
    $('cd-dup-btn').addEventListener('click', duplicateSelected);
    $('cd-front-btn').addEventListener('click', bringToFront);
    $('cd-back-btn').addEventListener('click', sendToBack);
    $('cd-conn-del-btn').addEventListener('click', deleteSelected);
    $('cd-add-project').addEventListener('click', function() { addProject('Untitled ' + (state.projects.length + 1)); });
    $('cd-export-btn').addEventListener('click', function() { modal.style.display = ''; });
    $('cd-modal-close').addEventListener('click', function() { modal.style.display = 'none'; });
    modal.addEventListener('click', function(e) { if (e.target === modal) modal.style.display = 'none'; });
    modal.querySelectorAll('[data-export]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var fmt = btn.getAttribute('data-export'); modal.style.display = 'none';
        if (fmt === 'svg') exportSVG(); else if (fmt === 'png') exportPNG(); else if (fmt === 'json') exportJSON();
      });
    });

    $('cd-table-ok').addEventListener('click', confirmTable);
    $('cd-table-cancel').addEventListener('click', function() { tableModal.style.display = 'none'; state.tablePending = null; setTool('select'); });
    tableModal.addEventListener('click', function(e) { if (e.target === tableModal) { tableModal.style.display = 'none'; state.tablePending = null; setTool('select'); } });

    $('cd-import-btn').addEventListener('click', function() { importFile.click(); });
    importFile.addEventListener('change', function() { if (importFile.files.length) { importJSON(importFile.files[0]); importFile.value = ''; } });

    DCStore.init().then(function() {
      var saved = localStorage.getItem('cd_projects');
      if (saved) { try { state.projects = JSON.parse(saved); } catch (e) { state.projects = []; } }
      if (!state.projects.length) addProject('Untitled');
      else { renderTabs(); loadProject(state.projects[0].id); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
