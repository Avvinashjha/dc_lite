#!/usr/bin/env node

/**
 * Fix LeetCode externalUrl to canonical form: https://leetcode.com/problems/{slug}/
 * Usage: node scripts/fix-leetcode-links.js
 */

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const filePath = path.join(repoRoot, 'content', 'problems', 'problems.json');

const raw = fs.readFileSync(filePath, 'utf-8');
const problems = JSON.parse(raw);

let updated = 0;
for (const problem of problems) {
  if (problem.platform === 'LeetCode') {
    const canonical = `https://leetcode.com/problems/${problem.slug}/`;
    if (problem.externalUrl !== canonical) {
      problem.externalUrl = canonical;
      updated += 1;
    }
  }
}

fs.writeFileSync(filePath, JSON.stringify(problems, null, 2) + '\n', 'utf-8');
console.log(`Updated ${updated} LeetCode problem link(s).`);
