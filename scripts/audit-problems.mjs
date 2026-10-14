import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { formatProblemInput } from '../src/utils/problemRuntime.js';

const root = path.resolve('content/problems');
const problems = [];
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const slug = entry.name, dir = path.join(root, slug), issues = [];
  let meta;
  try { meta = JSON.parse(fs.readFileSync(path.join(dir,'meta.json'),'utf8')); }
  catch (error) { problems.push({slug,issues:[error.message]}); continue; }
  for (const field of ['id','title','difficulty','topic','functionName','templateCode','sampleInput','sampleOutput','inputFormat','outputFormat']) {
    if (typeof meta[field] !== 'string' || !meta[field].trim()) issues.push(`Missing ${field}`);
  }
  for (const file of ['description.md','solution.md']) {
    if (!fs.existsSync(path.join(dir,file)) || fs.readFileSync(path.join(dir,file),'utf8').trim().length < 20) issues.push(`Missing ${file}`);
  }
  if (!Array.isArray(meta.constraints) || !meta.constraints.length || meta.constraints.some(c=>typeof c!=='string'||!c.trim())) issues.push('Missing/invalid constraints');
  const tests = Array.isArray(meta.testCases) ? meta.testCases : [];
  if (tests.length < 2) issues.push('At least two independent fixtures are required');
  const seen = new Set();
  for (const [i,test] of tests.entries()) {
    if (!Array.isArray(test.args) || !Object.hasOwn(test,'expected')) issues.push(`Malformed case ${i+1}`);
    const key = JSON.stringify(test.args);
    if (seen.has(key)) issues.push(`Duplicate input in case ${i+1}`);
    seen.add(key);
  }
  const examples = Array.isArray(meta.examples) ? meta.examples : [];
  if (examples.length < 2) issues.push('At least two examples are required');
  examples.forEach((example,i)=> {
    if (typeof example.input!=='string'||!example.input.trim()||typeof example.output!=='string') issues.push(`Malformed example ${i+1}`);
    else {
      try { JSON.parse(example.output); } catch { issues.push(`Example ${i+1} output is not valid JSON`); }
      if (example.output !== JSON.stringify(tests[i]?.expected)) issues.push(`Example ${i+1} does not match its fixture`);
      if (tests[i]?.args && example.input !== formatProblemInput(meta,tests[i].args)) issues.push(`Example ${i+1} input does not match its fixture`);
    }
  });
  if (meta.sampleInput !== examples[0]?.input || meta.sampleOutput !== examples[0]?.output) issues.push('Run Sample must match Example 1');
  try {
    const type = vm.runInNewContext(`${meta.templateCode}\n typeof ${meta.functionName}`,{}, {timeout:1000});
    if (type !== 'function') issues.push('Starter does not define the configured entry point');
  } catch (error) { issues.push(`Invalid starter: ${error.message}`); }
  problems.push({slug,tests:tests.length,examples:examples.length,issues});
}
const report = { total:problems.length, failures:problems.filter(p=>p.issues.length), problems };
const reportIndex = process.argv.indexOf('--report');
if (reportIndex >= 0) fs.writeFileSync(process.argv[reportIndex+1],JSON.stringify(report,null,2)+'\n');
console.log(`Problem content audit: ${problems.length} problems, ${report.failures.length} failures.`);
if(report.failures.length){console.log(JSON.stringify(report.failures,null,2));process.exitCode=1;}
