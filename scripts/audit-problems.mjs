import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve(process.cwd(), 'content/problems');
const slugs = fs.readdirSync(DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const report = {
  total: 0,
  draft: 0,
  badJson: [],
  noTestCases: [],
  noTemplate: [],
  noExamples: [],
  noDescription: [],
  emptyDescription: [],
  noConstraints: [],
  malformedTestCases: [],
  functionNoTemplate: [],
  testCaseModeMix: [],
};

for (const slug of slugs) {
  const metaPath = path.join(DIR, slug, 'meta.json');
  if (!fs.existsSync(metaPath)) continue;
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  } catch (e) {
    report.badJson.push({ slug, err: String(e.message) });
    continue;
  }
  report.total++;
  if (meta.draft) report.draft++;

  const tc = Array.isArray(meta.testCases) ? meta.testCases : [];
  if (!tc.length) report.noTestCases.push(slug);
  else {
    // check each test case shape
    let funcMode = 0, solveMode = 0, bad = 0;
    for (const t of tc) {
      const hasArgs = Array.isArray(t.args);
      const hasExpected = t.expected !== undefined;
      const hasInput = typeof t.input === 'string';
      const hasOutput = typeof t.output === 'string';
      if (hasArgs && hasExpected) funcMode++;
      else if (hasInput || hasOutput) solveMode++;
      else bad++;
    }
    if (bad) report.malformedTestCases.push({ slug, bad, total: tc.length });
    if (funcMode && solveMode) report.testCaseModeMix.push({ slug, funcMode, solveMode });
    // function-mode testcases require functionName + ideally templateCode
    if (funcMode && !meta.functionName) report.malformedTestCases.push({ slug, reason: 'args/expected but no functionName' });
  }

  if (!meta.templateCode) report.noTemplate.push(slug);
  if (meta.functionName && !meta.templateCode) report.functionNoTemplate.push(slug);

  const ex = Array.isArray(meta.examples) ? meta.examples : [];
  const descPath = path.join(DIR, slug, 'description.md');
  const hasDesc = fs.existsSync(descPath);
  const descText = hasDesc ? fs.readFileSync(descPath, 'utf-8').trim() : '';
  const descHasExample = /example/i.test(descText) || /```/.test(descText);
  if (!ex.length && !descHasExample) report.noExamples.push(slug);
  if (!hasDesc) report.noDescription.push(slug);
  else if (descText.length < 20) report.emptyDescription.push(slug);

  const cons = meta.constraints;
  const hasCons = Array.isArray(cons) ? cons.length > 0 : !!cons;
  if (!hasCons) report.noConstraints.push(slug);
}

const summary = {
  total: report.total,
  draft: report.draft,
  badJson: report.badJson.length,
  noTestCases: report.noTestCases.length,
  noTemplate: report.noTemplate.length,
  functionNoTemplate: report.functionNoTemplate.length,
  noExamples: report.noExamples.length,
  noDescription: report.noDescription.length,
  emptyDescription: report.emptyDescription.length,
  noConstraints: report.noConstraints.length,
  malformedTestCases: report.malformedTestCases.length,
  testCaseModeMix: report.testCaseModeMix.length,
};
console.log('=== SUMMARY ===');
console.log(JSON.stringify(summary, null, 2));
console.log('\n=== badJson ==='); console.log(JSON.stringify(report.badJson, null, 2));
console.log('\n=== malformedTestCases (first 30) ==='); console.log(JSON.stringify(report.malformedTestCases.slice(0,30), null, 2));
console.log('\n=== noDescription ==='); console.log(JSON.stringify(report.noDescription, null, 2));
console.log('\n=== emptyDescription ==='); console.log(JSON.stringify(report.emptyDescription, null, 2));
console.log('\n=== noTestCases count by sampling (first 40) ==='); console.log(JSON.stringify(report.noTestCases.slice(0,40), null, 2));

fs.writeFileSync(path.resolve(process.cwd(), 'scripts/_audit-out.json'), JSON.stringify(report, null, 2));
