#!/usr/bin/env node

/**
 * Import problems from CSV into content/problems/problems.json
 * Usage: node scripts/import-problems.js "/absolute/path/to/file.csv"
 */

import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/import-problems.js "/path/to/problems.csv"');
  process.exit(1);
}

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = path.join(repoRoot, 'content', 'problems');
const outFile = path.join(outDir, 'problems.json');

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function parseCsvLine(line) {
  const cols = [];
  let cur = '';
  let inQuotes = false;

  for (let idx = 0; idx < line.length; idx += 1) {
    const ch = line[idx];
    const next = line[idx + 1];

    if (ch === '"' && inQuotes && next === '"') {
      cur += '"';
      idx += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      cols.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  cols.push(cur);
  return cols.map((value) => value.trim());
}

function normalizeDifficulty(raw) {
  const value = (raw || '').trim().toLowerCase();
  if (value === 'easy') return 'Easy';
  if (value === 'medium') return 'Medium';
  if (value === 'hard') return 'Hard';
  return '';
}

function detectPlatform(title) {
  if (/leetcode/i.test(title)) return 'LeetCode';
  if (/geeksforgeeks/i.test(title)) return 'GeeksforGeeks';
  return 'Other';
}

function cleanTitle(rawTitle) {
  return rawTitle
    .replace(/\s*-\s*LeetCode\s*$/i, '')
    .replace(/\s*\|\s*GeeksforGeeks\s*$/i, '')
    .trim();
}

function buildExternalUrl(platform, title) {
  const query = encodeURIComponent(title);
  if (platform === 'LeetCode') return `https://leetcode.com/problemset/?search=${query}`;
  if (platform === 'GeeksforGeeks') return `https://www.geeksforgeeks.org/?s=${query}`;
  return '';
}

const csvRaw = fs.readFileSync(inputPath, 'utf-8');
const lines = csvRaw.split(/\r?\n/).filter(Boolean);
if (lines.length <= 1) {
  console.error('CSV has no data rows.');
  process.exit(1);
}

const rows = lines.slice(1);
const seenSlugs = new Map();
const problems = [];

for (const row of rows) {
  const cols = parseCsvLine(row);
  const difficulty = normalizeDifficulty(cols[0] || '');
  const problemLabel = (cols[1] || '').trim();
  const status = (cols[2] || '').trim() || 'TODO';
  const confidence = Number(cols[3] || 0) || 0;
  const topic = (cols[4] || '').trim();
  const remarks = (cols[5] || '').trim();

  if (!difficulty || !problemLabel || !topic) continue;

  const title = cleanTitle(problemLabel);
  if (!title) continue;

  let slug = slugify(title);
  const count = (seenSlugs.get(slug) || 0) + 1;
  seenSlugs.set(slug, count);
  if (count > 1) slug = `${slug}-${count}`;

  const platform = detectPlatform(problemLabel);
  const topics = [topic];

  problems.push({
    id: `problem-${String(problems.length + 1).padStart(4, '0')}`,
    slug,
    title,
    difficulty,
    topic,
    topics,
    status,
    confidence,
    platform,
    externalUrl: buildExternalUrl(platform, title),
    remarks,
    description: '',
    sampleInput: '',
    sampleOutput: '',
    testCases: [],
    solution: '',
  });
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(problems, null, 2)}\n`, 'utf-8');

console.log(`Imported ${problems.length} problems to ${outFile}`);
