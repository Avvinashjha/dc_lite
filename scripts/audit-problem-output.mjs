import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const output = path.resolve(process.argv[2] || 'dist');
const content = path.resolve('content/problems');
const decode = value => value.replace(/&(?:amp|lt|gt|quot|#39|apos);/g, entity => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&apos;':"'"})[entity]);
const issues = [], sizes = [];
let checked = 0;
for (const slug of fs.readdirSync(content)) {
  const metaPath = path.join(content, slug, 'meta.json');
  if (!fs.existsSync(metaPath)) continue;
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  if (meta.draft) continue;
  const file = path.join(output, 'problems', slug, 'index.html');
  if (!fs.existsSync(file)) { issues.push({slug, error:'Missing rendered page'}); continue; }
  checked++;
  const html = fs.readFileSync(file, 'utf8');
  const title = decode((html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '').replace(/<[^>]*>/g,'')).trim();
  if (title !== meta.title) issues.push({slug,error:'Rendered heading differs from metadata',title});
  for (const id of ['run-js','run-tests','reset-js','format-js','problem-js-editor']) {
    if (!html.includes(`id="${id}"`)) issues.push({slug,error:`Missing ${id}`});
  }
  for (const pane of ['description','solution','discussion','notes']) {
    if (!html.includes(`data-pane="${pane}"`)) issues.push({slug,error:`Missing ${pane} pane`});
  }
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(match=>decode(match[1]));
  if (meta.externalUrl && hrefs.includes(meta.externalUrl)) issues.push({slug,error:'External problem-source link remains'});
  for (const visual of meta.visuals || []) {
    if (visual.svg) {
      const label=visual.svg.match(/aria-label="([^"]+)"/)?.[1];
      const title=visual.svg.match(/<title\b[^>]*>([\s\S]*?)<\/title>/)?.[1];
      if (!(label && html.includes(label)) && !(title && html.includes(title))) issues.push({slug,error:'Diagram accessible name missing from output'});
    }
  }
  sizes.push({slug,bytes:Buffer.byteLength(html),gzipBytes:gzipSync(html).length});
}
console.log(JSON.stringify({output,checked,issues,largestPages:sizes.sort((a,b)=>b.bytes-a.bytes).slice(0,5)},null,2));
if (issues.length || !checked) process.exitCode=1;
