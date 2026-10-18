import fs from 'node:fs';
import vm from 'node:vm';
import { invokeProblem, compareProblemResult } from '../src/utils/problemRuntime.js';
const root = 'content/problems';
const rows = [];
for (const slug of fs.readdirSync(root)) {
  const dir = `${root}/${slug}`;
  if (!fs.statSync(dir).isDirectory()) continue;
  const meta = JSON.parse(fs.readFileSync(`${dir}/meta.json`, 'utf8'));
  const solution = fs.readFileSync(`${dir}/solution.md`, 'utf8');
  const code = [...solution.matchAll(/```(?:javascript|js)\s*\n([\s\S]*?)```/g)].map(m=>m[1]).join('\n');
  const errors = [];
  for (const [index, test] of meta.testCases.entries()) {
    try {
      const context = vm.createContext({ console: { log() {} }, structuredClone });
      context.args = test.args; context.config = meta.runner || {};
      const actual = vm.runInContext(`${code}\n(${invokeProblem.toString()})(${meta.runner?.mode === 'codec' ? '(() => {' + code + '; return {serialize, deserialize};})' : meta.functionName}, args, config)`, context, { timeout: 2000 });
      if (!compareProblemResult(actual, test.expected, test.args, meta.runner)) errors.push({ case: index+1, actual, expected: test.expected });
    } catch (e) { errors.push({ case: index+1, error: e.message }); }
  }
  rows.push({ slug, tests: meta.testCases.length, errors });
}
const report = { total: rows.length, tested: rows.filter(r=>r.tests).length, cases: rows.reduce((n,r)=>n+r.tests,0), failures: rows.filter(r=>r.errors.length), missingTests: rows.filter(r=>!r.tests).map(r=>r.slug), problems: rows };
const reportIndex = process.argv.indexOf('--report');
if (reportIndex >= 0) fs.writeFileSync(process.argv[reportIndex+1],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({total:report.total,tested:report.tested,cases:report.cases,failures:report.failures},null,2));
if (report.failures.length || report.missingTests.length) process.exitCode = 1;
