#!/usr/bin/env node

/**
 * Helper script to add a new blog post
 * Usage: node scripts/add-post.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const q = (query) => new Promise(resolve => rl.question(query, resolve));

function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
}

async function main() {
  console.log('\n📝 Add New Blog Post\n');

  const title = await q('Post title: ');
  const description = await q('Description (120-155 chars): ');
  const author = (await q('Author (default: Your Name): ')) || 'Your Name';
  const category = (await q('Category (default: general): ')) || 'general';
  const tagsInput = await q('Tags (comma-separated): ');
  const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

  const slug = slugify(title);
  const date = new Date().toISOString().split('T')[0];
  const postDir = path.join(__dirname, '..', 'content', 'blog', slug);

  if (fs.existsSync(postDir)) {
    console.log(`\n❌ Post "${slug}" already exists!\n`);
    process.exit(1);
  }

  fs.mkdirSync(postDir, { recursive: true });

  const meta = { title, description, date, author, tags, category, draft: false };
  fs.writeFileSync(path.join(postDir, 'meta.json'), JSON.stringify(meta, null, 2));
  fs.writeFileSync(path.join(postDir, 'content.md'), `Write your content here in Markdown...\n`);

  console.log(`\n✅ Post created!\n   Directory: content/blog/${slug}/\n   Edit: content/blog/${slug}/content.md\n`);
  rl.close();
}

main();
