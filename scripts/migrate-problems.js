#!/usr/bin/env node

/**
 * Migration script: converts content/problems/problems.json into
 * folder-per-problem structure (meta.json + description.md + solution.md).
 *
 * Usage: node scripts/migrate-problems.js
 *
 * Keeps the original problems.json intact as a backup.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROBLEMS_DIR = path.join(__dirname, '..', 'content', 'problems');
const SOURCE = path.join(PROBLEMS_DIR, 'problems.json');

const META_FIELDS = [
  'id', 'title', 'difficulty', 'topic', 'topics',
  'platform', 'externalUrl', 'problemSet',
  'sampleInput', 'sampleOutput',
  'constraints', 'followUps',
  'functionName', 'templateCode', 'testCases',
];

function migrate() {
  if (!fs.existsSync(SOURCE)) {
    console.error('problems.json not found at', SOURCE);
    process.exit(1);
  }

  const problems = JSON.parse(fs.readFileSync(SOURCE, 'utf-8'));
  console.log(`Found ${problems.length} problems to migrate.\n`);

  let created = 0;
  let skipped = 0;
  const issues = [];

  for (const p of problems) {
    if (!p.slug) {
      issues.push(`Problem ${p.id || '?'} has no slug – skipped`);
      skipped++;
      continue;
    }

    const dir = path.join(PROBLEMS_DIR, p.slug);

    if (fs.existsSync(dir)) {
      skipped++;
      continue;
    }

    fs.mkdirSync(dir, { recursive: true });

    const meta = { draft: false };
    for (const key of META_FIELDS) {
      if (p[key] !== undefined && p[key] !== null && p[key] !== '') {
        meta[key] = p[key];
      }
    }
    if (!meta.topics && meta.topic) {
      meta.topics = [meta.topic];
    }

    fs.writeFileSync(
      path.join(dir, 'meta.json'),
      JSON.stringify(meta, null, 2) + '\n',
    );

    const description = (p.description || '').trim() || 'Description coming soon.';
    fs.writeFileSync(path.join(dir, 'description.md'), description + '\n');

    const solution = (p.solution || '').trim() || 'Solution coming soon.';
    fs.writeFileSync(path.join(dir, 'solution.md'), solution + '\n');

    created++;
  }

  console.log(`Migration complete.`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped (already exists or no slug): ${skipped}`);
  if (issues.length) {
    console.log(`\nIssues:`);
    issues.forEach(i => console.log(`  - ${i}`));
  }
  console.log(`\nOriginal problems.json is preserved as backup.`);
}

migrate();
