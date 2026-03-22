#!/usr/bin/env node
/**
 * Build batch manifests for content generation subagents.
 * Outputs 4 JSON files: scripts/batch-1.json through batch-4.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS_DIR = path.join(__dirname, '..', 'content', 'problems');

const dirs = fs.readdirSync(PROBLEMS_DIR).filter(d =>
  fs.statSync(path.join(PROBLEMS_DIR, d)).isDirectory()
).sort();

const needsWork = [];

for (const slug of dirs) {
  const metaPath = path.join(PROBLEMS_DIR, slug, 'meta.json');
  if (!fs.existsSync(metaPath)) continue;
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  if (meta.draft) continue;

  const descPath = path.join(PROBLEMS_DIR, slug, 'description.md');
  const solPath = path.join(PROBLEMS_DIR, slug, 'solution.md');
  const descMd = fs.existsSync(descPath) ? fs.readFileSync(descPath, 'utf-8').trim() : '';
  const solMd = fs.existsSync(solPath) ? fs.readFileSync(solPath, 'utf-8').trim() : '';

  const noDesc = descMd === 'Description coming soon.' || descMd === '';
  const noSol = solMd === 'Solution coming soon.' || solMd === '';
  const noTests = !meta.testCases || meta.testCases.length === 0;
  const noConstraints = !meta.constraints || meta.constraints.length === 0;

  if (!noDesc && !noSol && !noTests && !noConstraints) continue;

  needsWork.push({
    slug,
    title: meta.title,
    difficulty: meta.difficulty,
    topic: meta.topic,
    platform: meta.platform,
    functionName: meta.functionName || slug.replace(/-./g, m => m[1].toUpperCase()),
    sampleInput: meta.sampleInput || '',
    sampleOutput: meta.sampleOutput || '',
    needs: {
      description: noDesc,
      solution: noSol,
      testCases: noTests,
      constraints: noConstraints,
    }
  });
}

// Split into 4 batches
const batchSize = Math.ceil(needsWork.length / 4);
for (let i = 0; i < 4; i++) {
  const batch = needsWork.slice(i * batchSize, (i + 1) * batchSize);
  const outPath = path.join(__dirname, `batch-${i + 1}.json`);
  fs.writeFileSync(outPath, JSON.stringify(batch, null, 2));
  console.log(`Batch ${i + 1}: ${batch.length} problems → ${outPath}`);
}
console.log(`\nTotal: ${needsWork.length} problems needing content`);
