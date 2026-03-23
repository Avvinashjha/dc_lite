#!/usr/bin/env node
/**
 * Apply generated content from batch output files.
 * Usage: node scripts/apply-generated.js scripts/generated-1.json [scripts/generated-2.json ...]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS_DIR = path.join(__dirname, '..', 'content', 'problems');

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node scripts/apply-generated.js <file1.json> [file2.json ...]');
  process.exit(1);
}

let applied = 0, errors = 0;

for (const file of files) {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) { console.error(`Not found: ${filePath}`); continue; }

  let raw = fs.readFileSync(filePath, 'utf-8');
  // Fix common JSON issues from LLM output
  raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  // Fix escaped quotes inside already-quoted strings
  raw = raw.replace(/\\\\/g, '\\');

  let items;
  try {
    items = JSON.parse(raw);
  } catch (e) {
    // Try to extract valid JSON array
    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']');
    if (start >= 0 && end > start) {
      try {
        items = JSON.parse(raw.slice(start, end + 1));
      } catch (e2) {
        console.error(`  Cannot parse ${file}: ${e2.message}`);
        continue;
      }
    } else {
      console.error(`  Cannot parse ${file}: ${e.message}`);
      continue;
    }
  }
  console.log(`Processing ${filePath}: ${items.length} items`);

  for (const item of items) {
    const dir = path.join(PROBLEMS_DIR, item.slug);
    if (!fs.existsSync(dir)) { console.error(`  Missing dir: ${item.slug}`); errors++; continue; }

    const metaPath = path.join(dir, 'meta.json');
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

    // Write description
    if (item.description) {
      fs.writeFileSync(path.join(dir, 'description.md'), item.description.trim() + '\n');
    }

    // Write solution
    if (item.solution) {
      fs.writeFileSync(path.join(dir, 'solution.md'), item.solution.trim() + '\n');
    }

    // Merge meta fields
    let metaChanged = false;
    if (item.constraints && item.constraints.length > 0 && (!meta.constraints || meta.constraints.length === 0)) {
      meta.constraints = item.constraints;
      metaChanged = true;
    }
    if (item.testCases && item.testCases.length > 0 && (!meta.testCases || meta.testCases.length === 0)) {
      meta.testCases = item.testCases;
      metaChanged = true;
    }
    if (item.templateCode && (!meta.templateCode || meta.templateCode.includes('Write your solution here'))) {
      meta.templateCode = item.templateCode;
      metaChanged = true;
    }

    if (metaChanged) {
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
    }

    applied++;
  }
}

console.log(`\nDone: ${applied} applied, ${errors} errors`);
