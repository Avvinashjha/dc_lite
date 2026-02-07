#!/usr/bin/env node

/**
 * Validate all content in the content/ directory
 * Usage: node scripts/validate-posts.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_DIR = path.join(__dirname, '..', 'content');

let errors = 0;
let warnings = 0;

function check(condition, msg, isWarning = false) {
  if (!condition) {
    console.log(`  ${isWarning ? '⚠️' : '❌'} ${msg}`);
    isWarning ? warnings++ : errors++;
  }
}

function validateBlog() {
  console.log('\n📝 Validating Blog Posts...');
  const blogDir = path.join(CONTENT_DIR, 'blog');
  const dirs = fs.readdirSync(blogDir, { withFileTypes: true }).filter(d => d.isDirectory());

  dirs.forEach(d => {
    const metaPath = path.join(blogDir, d.name, 'meta.json');
    const contentPath = path.join(blogDir, d.name, 'content.md');

    check(fs.existsSync(metaPath), `${d.name}: missing meta.json`);
    check(fs.existsSync(contentPath), `${d.name}: missing content.md`);

    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      check(meta.title, `${d.name}: missing title`);
      check(meta.description, `${d.name}: missing description`);
      check(meta.date?.match(/^\d{4}-\d{2}-\d{2}$/), `${d.name}: invalid date format`);
      check(Array.isArray(meta.tags), `${d.name}: tags must be an array`);
      check(meta.title?.length <= 70, `${d.name}: title too long (${meta.title?.length} chars)`, true);
    }
  });

  console.log(`  ✅ ${dirs.length} blog posts checked`);
}

function validateCourses() {
  console.log('\n📚 Validating Courses...');
  const coursesDir = path.join(CONTENT_DIR, 'courses');
  const dirs = fs.readdirSync(coursesDir, { withFileTypes: true }).filter(d => d.isDirectory());

  dirs.forEach(d => {
    const metaPath = path.join(coursesDir, d.name, 'meta.json');
    check(fs.existsSync(metaPath), `${d.name}: missing meta.json`);

    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      check(meta.title, `${d.name}: missing title`);
      check(Array.isArray(meta.modules), `${d.name}: modules must be an array`);

      (meta.modules || []).forEach(mod => {
        const modDir = path.join(coursesDir, d.name, mod.slug);
        check(fs.existsSync(modDir), `${d.name}/${mod.slug}: module directory missing`);
        const modMeta = path.join(modDir, 'meta.json');
        if (fs.existsSync(modMeta)) {
          const mm = JSON.parse(fs.readFileSync(modMeta, 'utf-8'));
          (mm.lessons || []).forEach(l => {
            const lPath = path.join(modDir, `${l.slug}.md`);
            check(fs.existsSync(lPath), `${d.name}/${mod.slug}/${l.slug}.md: lesson file missing`);
          });
        }
      });
    }
  });

  console.log(`  ✅ ${dirs.length} courses checked`);
}

function validateDocs() {
  console.log('\n📖 Validating Docs...');
  const docsDir = path.join(CONTENT_DIR, 'docs');
  const dirs = fs.readdirSync(docsDir, { withFileTypes: true }).filter(d => d.isDirectory());

  dirs.forEach(d => {
    const metaPath = path.join(docsDir, d.name, 'meta.json');
    check(fs.existsSync(metaPath), `${d.name}: missing meta.json`);

    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      check(meta.title, `${d.name}: missing title`);
      (meta.sidebar || []).forEach(item => {
        const pagePath = path.join(docsDir, d.name, `${item.slug}.md`);
        check(fs.existsSync(pagePath), `${d.name}/${item.slug}.md: doc page missing`);
      });
    }
  });

  console.log(`  ✅ ${dirs.length} doc projects checked`);
}

console.log('🔍 Validating content...');
validateBlog();
validateCourses();
validateDocs();

console.log(`\n${'─'.repeat(40)}`);
if (errors > 0) {
  console.log(`❌ ${errors} error(s), ${warnings} warning(s)\n`);
  process.exit(1);
} else {
  console.log(`✅ All content valid! (${warnings} warning(s))\n`);
}
