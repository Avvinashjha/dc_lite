import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { formatJavaScript } from '../src/utils/formatJavaScript.js';

for (const [name, source] of [
  ['regex and quoted braces', '(()=>{const pattern=/[{};]/g;return "a{b};".match(pattern).join("")})()'],
  ['template literals', '(()=>{const n=3;return `value: ${n*2}; {ok}`})()'],
  ['automatic semicolon insertion', '(()=>{return\n{value:1}})()'],
  ['modern JavaScript', '(()=>{const x={a:{b:2}};return x?.a?.b??0})()'],
  ['comments and division', '(()=>{/* preserve this */const n=12/3;return n})()'],
]) {
  test(`format preserves ${name}`, async () => {
    const formatted = await formatJavaScript(source);
    assert.deepEqual(vm.runInNewContext(formatted), vm.runInNewContext(source));
    assert.equal(await formatJavaScript(formatted), formatted);
    if (source.includes('preserve this')) assert.match(formatted, /preserve this/);
  });
}
test('syntax errors and oversized inputs are rejected', async () => {
  await assert.rejects(formatJavaScript('function broken( {'), /Unexpected|Syntax|token/);
  await assert.rejects(formatJavaScript(' '.repeat(200_001)), /200 KB/);
});
