#!/usr/bin/env node
/**
 * Phase 1: Enrich meta.json for all problems with derivable fields.
 * - functionName (from slug)
 * - templateCode (from functionName + sampleInput)
 * - constraints (generic based on difficulty)
 * - topics (expand from primary topic)
 * - testCases (extra from sampleInput/sampleOutput if only 1 exists)
 *
 * Does NOT overwrite existing non-empty values.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS_DIR = path.join(__dirname, '..', 'content', 'problems');

// ── Slug → functionName ─────────────────────────────────────────────────
const DIGIT_WORDS = { '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five' };

function slugToFunctionName(slug) {
  let s = slug
    .replace(/^https?-.*?-problems?-/, '')
    .replace(/-practice$/, '')
    .replace(/-\d+$/, '');
  // Replace leading digits
  s = s.replace(/^(\d)/, (_, d) => (DIGIT_WORDS[d] || d) + '-');
  return s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

// ── Topic expansion ─────────────────────────────────────────────────────
const TOPIC_MAP = {
  'Array': ['Array', 'Two Pointers'],
  'String': ['String', 'Hash Table'],
  'Linked-List': ['Linked List'],
  'Tree': ['Tree', 'Binary Tree', 'DFS'],
  'Graph': ['Graph', 'BFS', 'DFS'],
  'Dynamic-Programming': ['Dynamic Programming', 'Memoization'],
  'Backtracking': ['Backtracking', 'Recursion'],
  'Stack': ['Stack'],
  'Queue': ['Queue', 'BFS'],
  'Matrix': ['Matrix', 'BFS', 'DFS'],
  'Sorting': ['Array', 'Sorting'],
  'Binary-Search': ['Array', 'Binary Search'],
  'Heap': ['Heap', 'Priority Queue'],
  'Trie': ['Trie', 'String'],
  'Greedy': ['Greedy'],
  'Bit-Manipulation': ['Bit Manipulation'],
  'Math': ['Math'],
  'Design': ['Design'],
  'Divide-and-Conquer': ['Divide and Conquer'],
  'Recursion': ['Recursion'],
};

function expandTopics(topic, existingTopics) {
  if (existingTopics && existingTopics.length > 1) return existingTopics;
  const base = TOPIC_MAP[topic] || [topic.replace(/-/g, ' ')];
  return [...new Set(base)];
}

// ── Parse sampleInput for param hints ───────────────────────────────────
function parseSampleParams(sampleInput) {
  if (!sampleInput) return [];
  // Pattern: name = value, name2 = value2
  const params = [];
  const parts = sampleInput.split(/,\s*(?=[a-zA-Z_]\w*\s*=)/);
  for (const part of parts) {
    const m = part.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/s);
    if (m) {
      const name = m[1];
      const val = m[2].trim();
      let type = 'any';
      if (val.startsWith('[')) type = val.includes('[') && val.includes('],') ? 'number[][]' : 'number[]';
      else if (val.startsWith('"') || val.startsWith("'")) type = 'string';
      else if (val === 'true' || val === 'false') type = 'boolean';
      else if (!isNaN(Number(val))) type = 'number';
      params.push({ name, type, raw: val });
    }
  }
  return params;
}

function buildTemplateCode(fnName, sampleInput) {
  const params = parseSampleParams(sampleInput);
  let jsdoc = '/**\n';
  let argList = '';
  let sampleCall = '';

  if (params.length > 0) {
    for (const p of params) {
      jsdoc += ` * @param {${p.type}} ${p.name}\n`;
    }
    argList = params.map(p => p.name).join(', ');
    sampleCall = params.map(p => p.raw).join(', ');
  } else {
    jsdoc += ' * @param {any} input\n';
    argList = 'input';
    sampleCall = '';
  }

  jsdoc += ' * @return {any}\n */';

  let code = `${jsdoc}\nfunction ${fnName}(${argList}) {\n  // Write your solution here\n}\n`;
  if (sampleCall) {
    code += `\n// Sample: console.log(${fnName}(${sampleCall}));`;
  }
  return code;
}

// ── Main ────────────────────────────────────────────────────────────────
const dirs = fs.readdirSync(PROBLEMS_DIR).filter(d =>
  fs.statSync(path.join(PROBLEMS_DIR, d)).isDirectory()
).sort();

let updated = 0, skipped = 0;

for (const slug of dirs) {
  const metaPath = path.join(PROBLEMS_DIR, slug, 'meta.json');
  if (!fs.existsSync(metaPath)) { skipped++; continue; }

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  if (meta.draft) { skipped++; continue; }

  let changed = false;

  // functionName
  if (!meta.functionName) {
    meta.functionName = slugToFunctionName(slug);
    changed = true;
  }

  // templateCode
  if (!meta.templateCode) {
    meta.templateCode = buildTemplateCode(meta.functionName, meta.sampleInput || '');
    changed = true;
  }

  // topics
  const expanded = expandTopics(meta.topic, meta.topics);
  if (!meta.topics || meta.topics.length <= 1) {
    meta.topics = expanded;
    changed = true;
  }

  // constraints (only if missing)
  if (!meta.constraints || meta.constraints.length === 0) {
    meta.constraints = [];
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
    updated++;
  } else {
    skipped++;
  }
}

console.log(`Done: ${updated} updated, ${skipped} skipped (${dirs.length} total)`);
