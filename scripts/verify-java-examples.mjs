import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { javaCourses } from './data/java-curriculum.mjs';

const modules = javaCourses.flatMap(course => course.modules);
const examples = [
  ...modules.filter(mod => !mod.environment),
  ...modules.flatMap(mod => mod.workshops.map((workshop,index) => ({...workshop, id:`${mod.id}-chapter-${index+1}`})).filter(workshop => !workshop.project)),
];
const encode = value => Buffer.from(value).toString('base64');
const input = examples.map(mod => {
  const code = mod.code + (mod.id === 'first-program' ? '\nReceipt.main(new String[0]);' : '');
  return [mod.id, encode(code), encode(mod.output)].join('\t');
}).join('\n') + '\n';
const java = process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME,'bin','java') : 'java';
const version = spawnSync(java,['--version'],{encoding:'utf8'});
if (!/^(?:openjdk|java) 25(?:\.|\s)/m.test(version.stdout || '')) {
  console.error('These examples target Java 25. Set JAVA_HOME to a Java 25 JDK before running this check.');
  process.exit(1);
}
console.log(version.stdout.split('\n')[0]);
const result = spawnSync(java, ['--add-modules', 'jdk.jshell', fileURLToPath(new URL('./JavaExampleVerifier.java', import.meta.url))],
  { input, encoding:'utf8', timeout:120_000 });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) console.error(result.error.message);
process.exitCode = result.status ?? 1;
