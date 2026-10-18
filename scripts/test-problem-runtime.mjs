import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { invokeProblem, compareProblemResult } from '../src/utils/problemRuntime.js';

function solution(slug, args) {
  const dir = `content/problems/${slug}`;
  const meta = JSON.parse(fs.readFileSync(`${dir}/meta.json`,'utf8'));
  const code = [...fs.readFileSync(`${dir}/solution.md`,'utf8').matchAll(/```javascript\s*\n([\s\S]*?)```/g)].map(m=>m[1]).join('\n');
  const context = vm.createContext({structuredClone,args,config:meta.runner});
  return JSON.parse(JSON.stringify(vm.runInContext(`${code}\n(${invokeProblem.toString()})(${meta.runner?.mode === 'codec' ? '(() => {' + code + '; return {serialize, deserialize};})' : meta.functionName},args,config)`,context,{timeout:2000})));
}

test('node fixtures preserve shape, identity, and backward links',()=> {
  assert.deepEqual(invokeProblem(root=>root,[ [1,null,2,3] ],{argTypes:['tree'],outputType:'tree'}),[1,null,2,3]);
  assert.equal(invokeProblem((a,b)=>a.next===b.next,[[[1],[2],[3]]],{argTypes:['intersectionLists']}),true);
  assert.throws(()=>invokeProblem(head=>head,[[[1,null]]],{argTypes:['randomList'],outputType:'randomList'}),/independent/);
  assert.throws(()=>invokeProblem(head=>head,[[1,{val:2,child:[3]}]],{argTypes:['multilevel'],outputType:'multilevel'}),/flattened/);
});

test('random-list copies preserve the original and keep all copied links independent', () => {
  const config = {argTypes: ['randomList'], outputType: 'randomList'};
  assert.deepEqual(invokeProblem(head => {
    const copy = {val: head.val, next: null, random: null};
    copy.random = copy;
    return copy;
  }, [[[5, 0]]], config), [[5, 0]]);
  assert.throws(() => invokeProblem(head => {
    const copy = {val: head.val, next: null, random: null};
    head.val = 99;
    return copy;
  }, [[[5, null]]], config), /Restore the original/);
  assert.throws(() => invokeProblem(head => ({val: head.val, next: null, random: head}), [[[5, 0]]], config), /escapes copy/);
});

test('in-place cases check the input rather than an invented return value',()=> {
  assert.deepEqual(invokeProblem(a=>{a.reverse();},[[1,2]],{resultArg:0}),[2,1]);
  assert.deepEqual(invokeProblem(a=>{a[1]=2;return 2;},[[1,1,2]],{outputType:'uniquePrefix'}),{k:2,nums:[1,2]});
  const noMutation=invokeProblem(()=>2,[[1,1,2]],{outputType:'uniquePrefix'});
  assert.equal(compareProblemResult(noMutation,{k:2,nums:[1,2]},[],{}),false);
});

test('comparators accept alternatives while rejecting invalid answers and duplicates',()=> {
  assert.equal(compareProblemResult([1,0],[0,1],[[2,7],9],{validator:'twoSum'}),true);
  assert.equal(compareProblemResult([0,0],[0,1],[[2,7],4],{validator:'twoSum'}),false);
  assert.equal(compareProblemResult(['eat','oath'],['oath','eat'],[],{unordered:true}),true);
  assert.equal(compareProblemResult(['eat','eat'],['oath','eat'],[],{unordered:true}),false);
  assert.equal(compareProblemResult([[2,1]],[[1,2]],[],{unordered:true,unorderedInner:true}),true);
  assert.equal(compareProblemResult([3,2,1,0],[],[4,[[],[0],[0],[0]]],{validator:'topological'}),true);
  assert.equal(compareProblemResult([0,1,2,3],[],[4,[[],[0],[0],[0]]],{validator:'topological'}),false);
  assert.equal(compareProblemResult('abc','acb',[['ab','ac']],{validator:'alien'}),true);
  assert.equal(compareProblemResult('cba','abc',[['ab','ac']],{validator:'alien'}),false);
  assert.equal(compareProblemResult(0,[0],[[2,1]],{validator:'peak'}),true);
  assert.equal(compareProblemResult(1,[0],[[2,1]],{validator:'peak'}),false);
  assert.equal(compareProblemResult([1,2,3],[2,1,3],[[1,2,3]],{validator:'balancedBST'}),false);
  assert.equal(compareProblemResult([2,1,3],[2,1,3],[[1,2,3]],{validator:'balancedBST'}),true);
  assert.equal(compareProblemResult([1,null,2],[1,2],[[1,2],[2,1]],{validator:'prePost'}),true);
  assert.equal(compareProblemResult([1,null,3],[1,2],[[1,2],[2,1]],{validator:'prePost'}),false);
  assert.equal(compareProblemResult(105.000001,105,[],{tolerance:1e-5}),true);
  assert.equal(compareProblemResult(104,105,[],{tolerance:1e-5}),false);
});

test('class and factory state persists within a fixture and starts fresh between fixtures',()=> {
  class Counter {constructor(start){this.value=start;} next(){return ++this.value;} }
  const fixture=[[0],[['next'],['next']]];
  assert.deepEqual(invokeProblem(Counter,fixture,{mode:'operations'}),[1,2]);
  assert.deepEqual(invokeProblem(Counter,fixture,{mode:'operations'}),[1,2]);
  assert.deepEqual(fixture,[[0],[['next'],['next']]]);
  assert.deepEqual(invokeProblem(()=>({queue:{empty:()=>true}}),[[],[['queue.empty']]],{mode:'operations',factory:true}),[true]);
});

// Independent exhaustive oracles verify behavior beyond curated examples.
test('pattern search includes overlaps and balloon DP matches every burst order', () => {
  for (const text of strings('ab', 5)) {
    for (const pattern of [...strings('ab', 1), ...strings('ab', 2), ...strings('ab', 3)]) {
      const expected = [];
      for (let i = 0; i + pattern.length <= text.length; i++) if (text.slice(i, i + pattern.length) === pattern) expected.push(i);
      assert.deepEqual(solution('boyer-moore-algorithm-for-pattern-searching', [text, pattern]), expected);
    }
  }
  function burstAllOrders(values) {
    if (!values.length) return 0;
    return Math.max(...values.map((value, i) =>
      (values[i - 1] ?? 1) * value * (values[i + 1] ?? 1) + burstAllOrders(values.filter((_, j) => j !== i))));
  }
  for (const digits of strings('012', 4)) {
    const values = [...digits].map(Number);
    assert.equal(solution('burst-balloons', [values]), burstAllOrders(values));
  }
});

test('stock variants agree with exhaustive buy/sell choices on short histories', () => {
  function brute(prices, remaining, day = 0, holding = false) {
    if (day === prices.length) return holding ? -Infinity : 0;
    let best = brute(prices, remaining, day + 1, holding);
    if (holding) best = Math.max(best, prices[day] + brute(prices, remaining - 1, day + 1, false));
    else if (remaining > 0) best = Math.max(best, -prices[day] + brute(prices, remaining, day + 1, true));
    return best;
  }
  for (const digits of strings('013', 4)) {
    const prices = [...digits].map(Number);
    assert.equal(solution('best-time-to-buy-and-sell-stock', [prices]), brute(prices, 1));
    assert.equal(solution('best-time-to-buy-and-sell-stock-ii', [prices]), brute(prices, prices.length));
    for (const k of [1, 2]) assert.equal(solution('best-time-to-buy-and-sell-stock-iv', [k, prices]), brute(prices, k));
  }
});

test('book allocation and binary addition support published input limits', () => {
  const books = Array(100_000).fill(1_000_000);
  assert.equal(solution('allocate-minimum-pages-practice', [books, 100_000]), 1_000_000);
  assert.equal(solution('allocate-minimum-pages-practice', [books, 1]), 100_000_000_000);
  assert.equal(solution('add-binary', ['1'.repeat(10_000), '1']), '1' + '0'.repeat(10_000));
});

function strings(alphabet,length) { if(!length)return [''];return strings(alphabet,length-1).flatMap(s=>[...alphabet].map(c=>s+c)); }
test('distinct palindromic subsequences match enumeration on small strings',()=> {
  for(let n=1;n<=5;n++) for(const s of strings('ab',n)) {
    const values=new Set();
    for(let mask=1;mask<2**n;mask++) { let out=''; for(let i=0;i<n;i++)if(mask&2**i)out+=s[i]; if(out===[...out].reverse().join(''))values.add(out); }
    assert.equal(solution('count-different-palindromic-subsequences',[s]),values.size,s);
  }
});

test('one reversal handles duplicate boundaries and matches exhaustive reversal search',()=> {
  for(const s of strings('123',5)) {
    const arr=[...s].map(Number);let possible=false;
    for(let i=0;i<arr.length;i++)for(let j=i;j<arr.length;j++) {
      const candidate=[...arr.slice(0,i),...arr.slice(i,j+1).reverse(),...arr.slice(j+1)];
      if(candidate.every((v,k)=>k===0||candidate[k-1]<=v))possible=true;
    }
    assert.equal(solution('check-if-reversing-a-sub-array-make-the-array-sorted',[arr]),possible,s);
  }
});

test('window minima and inversion counts match direct enumeration',()=> {
  for(const s of strings('123',4)) {
    const arr=[...s].map(v=>Number(v)-2);
    const expected=arr.map((_,i)=>Math.max(...arr.slice(i).map((_,j)=>Math.min(...arr.slice(j,j+i+1)))));
    assert.deepEqual(solution('maximum-of-minimums-of-every-window-size-in-a-given-array',[arr]),expected);
    const counts=arr.map((v,i)=>arr.slice(i+1).filter(w=>w<v).length);
    assert.deepEqual(solution('count-of-smaller-numbers-after-self',[arr]),counts);
  }
});

test('disconnected negative cycles, flattening, and full-angle visibility regressions',()=> {
  assert.equal(solution('detect-a-negative-cycle-in-a-graph-bellman-ford',[4,[[2,3,-2],[3,2,1]]]),true);
  assert.deepEqual(solution('flattening-a-linked-list',[[[1,4],[2,3]]]),[1,2,3,4]);
  assert.equal(solution('maximum-number-of-visible-points',[[[1,0],[0,1],[-1,0]],360,[0,0]]),3);
  assert.equal(solution('pair-with-the-given-difference',[[1,2,3],0]),false);
  assert.equal(solution('total-number-of-spanning-trees-in-a-graph',[[[],[],[]],3]),0);
});

test('long chains and large connected grids stay within the published JavaScript limits',()=> {
  const chain=[];for(let i=0;i<10000;i++){chain.push(1);if(i<9999)chain.push(null);}
  assert.equal(solution('maximum-depth-of-binary-tree',[chain]),10000);
  assert.equal(solution('diameter-of-binary-tree',[chain]),9999);
  assert.equal(solution('binary-tree-maximum-path-sum',[chain]),10000);
  assert.deepEqual(solution('serialize-and-deserialize-binary-tree',[chain]),chain);
  const graph=Array.from({length:10000},(_,i)=>i<9999?[i+1]:[]);
  assert.equal(solution('detect-cycle-in-a-directed-graph',[10000,graph]),false);
  assert.equal(solution('find-eventual-safe-states',[graph]).length,10000);
  assert.equal(solution('depth-first-search-or-dfs-for-a-graph',[graph]).length,10000);
  const managers=Array.from({length:10000},(_,i)=>i-1),times=Array(10000).fill(1);times[9999]=0;
  assert.equal(solution('time-needed-to-inform-all-employees',[10000,0,managers,times]),9999);
  assert.equal(solution('number-of-islands',[Array.from({length:300},()=>Array(300).fill('1'))]),1);
  assert.equal(solution('making-a-large-island',[Array.from({length:500},()=>Array(500).fill(1))]),250000);
  const increasing=Array.from({length:200},(_,r)=>Array.from({length:200},(_,c)=>r*200+(r%2?199-c:c)));
  assert.equal(solution('longest-increasing-path-in-a-matrix',[increasing]),40000);
});

test('m-coloring uses vertex neighbors rather than confusing matrix entries with indices',()=> {
  assert.equal(solution('m-coloring-problem-practice',[[[1,2],[0,2],[0,1]],2,3]),false);
  assert.equal(solution('m-coloring-problem-practice',[[[],[],[]],1,3]),true);
});

test('shortest bridge supports a nearly full 100-by-100 first island',()=> {
  const grid=Array.from({length:100},()=>Array(100).fill(1));
  grid[98][99]=0;grid[99][98]=0;
  assert.equal(solution('shortest-bridge',[grid]),1);
});

test('maximum-number swaps matches exhaustive arrangements, including repeated digits', () => {
  for (const input of strings('012', 4)) {
    let reachable = new Set([input]);
    for (let swaps = 0; swaps <= 2; swaps++) {
      assert.equal(solution('find-maximum-number-possible-by-doing-at-most-k-swaps', [input, swaps]), [...reachable].sort().at(-1));
      const next = new Set(reachable);
      for (const value of reachable) {
        for (let i = 0; i < value.length; i++) {
          for (let j = i + 1; j < value.length; j++) {
            const digits = [...value];
            [digits[i], digits[j]] = [digits[j], digits[i]];
            next.add(digits.join(''));
          }
        }
      }
      reachable = next;
    }
  }
  assert.equal(solution('find-maximum-number-possible-by-doing-at-most-k-swaps', ['1'.repeat(10) + '9'.repeat(10) + '1'.repeat(10), 10]), '9'.repeat(10) + '1'.repeat(20));
});

test('first-occurrence KMP matches direct substring search with overlapping prefixes', () => {
  for (const haystack of strings('ab', 5)) {
    for (const needle of [...strings('ab', 1), ...strings('ab', 2), ...strings('ab', 3)]) {
      assert.equal(solution('find-the-index-of-the-first-occurrence-in-a-string', [haystack, needle]), haystack.indexOf(needle));
    }
  }
  const haystack = 'a'.repeat(9999) + 'b';
  assert.equal(solution('find-the-index-of-the-first-occurrence-in-a-string', [haystack, 'a'.repeat(4999) + 'b']), 5000);
});

test('multilevel flattening preserves every original node and its value', () => {
  const config = {argTypes: ['multilevel'], outputType: 'multilevel'};
  assert.deepEqual(invokeProblem(head => head, [[1, 2]], config), [1, 2]);
  assert.deepEqual(invokeProblem(head => head, [[]], config), []);
  assert.throws(() => invokeProblem(head => ({val: head.val, prev: null, next: null, child: null}), [[1]], config), /original nodes/);
  assert.throws(() => invokeProblem(head => {head.next = null; return head;}, [[1, 2]], config), /every original node/);
  assert.throws(() => invokeProblem(head => {head.val = 9; return head;}, [[1]], config), /without changing/);
  assert.throws(() => invokeProblem(head => {delete head.child; return head;}, [[1]], config), /flattened links/);
});

test('nested iterator skips empty lists without consuming values on repeated hasNext', () => {
  const code = fs.readFileSync('content/problems/flatten-nested-list-iterator/solution.md', 'utf8').match(/```javascript\n([\s\S]*?)```/)[1];
  const result = vm.runInNewContext(`${code}
    const iterator = new NestedIterator([[], [0, [], [-1]], [], 2]);
    [iterator.hasNext(), iterator.hasNext(), iterator.next(),
     iterator.hasNext(), iterator.hasNext(), iterator.next(),
     iterator.next(), iterator.hasNext(), iterator.hasNext()];`);
  assert.deepEqual(Array.from(result), [true, true, 0, true, true, -1, 2, false, false]);
});

test('randomized collection samples occurrences and preserves indices after removals', () => {
  const code = fs.readFileSync('content/problems/insert-delete-getrandom-o-1-duplicates-allowed/solution.md', 'utf8').match(/```javascript\n([\s\S]*?)```/)[1];
  const draws = [0, 0.34, 0.99, 0, 0.99];
  const controlledMath = Object.create(Math);
  controlledMath.random = () => draws.shift();
  const actual = vm.runInNewContext(`${code}
    const collection = new RandomizedCollection();
    collection.insert(1); collection.insert(1); collection.insert(2);
    const before = [collection.getRandom(), collection.getRandom(), collection.getRandom()];
    collection.remove(1);
    const after = [collection.getRandom(), collection.getRandom()].sort();
    collection.remove(1); collection.remove(2);
    [before, after, collection.remove(1), collection.insert(1)];`, {Math: controlledMath});
  assert.deepEqual(JSON.parse(JSON.stringify(actual)), [[1, 1, 2], [1, 2], false, true]);
});

test('intersection checks node identity and preserves both input lists', () => {
  const config = {argTypes: ['intersectionLists'], outputType: 'nodeValue'};
  assert.equal(invokeProblem((a, b) => a.next, [[[1], [2], [3]]], config), 3);
  assert.equal(invokeProblem(() => null, [[[3], [3], []]], config), null);
  assert.throws(() => invokeProblem(() => ({val: 3}), [[[1], [2], [3]]], config), /exact intersection/);
  assert.throws(() => invokeProblem(a => a, [[[3], [3], []]], config), /exact intersection/);
  assert.throws(() => invokeProblem(a => {const shared = a.next; a.next = null; return shared;}, [[[1], [2], [3]]], config), /Do not modify/);
});

test('equation deque matches pair enumeration after expiry and candidate removal', () => {
  for (let mask = 0; mask < 81; mask++) {
    let code = mask;
    const points = [0, 2, 3, 6].map(x => {
      const y = (code % 3 - 1) * 4;
      code = Math.floor(code / 3);
      return [x, y];
    });
    for (const k of [1, 2, 3, 6]) {
      let expected = -Infinity;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const distance = points[j][0] - points[i][0];
          if (distance <= k) expected = Math.max(expected, points[i][1] + points[j][1] + distance);
        }
      }
      assert.equal(solution('max-value-of-equation', [points, k]), expected);
    }
  }
});

test('rolling repeated-subarray DP matches direct contiguous-run search', () => {
  const arrays = [];
  for (let size = 1; size <= 3; size++) {
    for (let bits = 0; bits < 2 ** size; bits++) {
      arrays.push(Array.from({length: size}, (_, i) => (bits >> i) & 1));
    }
  }
  for (const a of arrays) for (const b of arrays) {
    let expected = 0;
    for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) {
      let length = 0;
      while (i + length < a.length && j + length < b.length && a[i + length] === b[j + length]) length++;
      expected = Math.max(expected, length);
    }
    assert.equal(solution('maximum-length-of-repeated-subarray', [a, b]), expected);
  }
});

test('tree width normalizes the first active node of each level', () => {
  const rightChain = [1];
  for (let i = 1; i < 3000; i++) rightChain.push(null, 1);
  assert.equal(solution('maximum-width-of-binary-tree', [rightChain]), 1);
  assert.equal(solution('maximum-width-of-binary-tree', [[1, 2, 3, null, 4, 5]]), 2);
  assert.equal(solution('maximum-width-of-binary-tree', [[1, 2, 3, 4, null, null, 5]]), 4);
});

test('linked-list merge sort receives nodes and handles the published maximum length', () => {
  assert.deepEqual(solution('merge-sort-for-linked-lists', [[3, 1, 2, 1]]), [1, 1, 2, 3]);
  const descending = Array.from({length: 50000}, (_, i) => 50000 - i);
  assert.deepEqual(solution('merge-sort-for-linked-lists', [descending]), [...descending].reverse());
});

test('middle-list output requires original node identity and unchanged input', () => {
  const config = {argTypes: ['list'], outputType: 'middleList'};
  assert.deepEqual(invokeProblem(head => head.next, [[1, 2, 3]], config), [2, 3]);
  assert.throws(() => invokeProblem(() => ({val: 2, next: {val: 3, next: null}}), [[1, 2, 3]], config), /original middle/);
  assert.throws(() => invokeProblem(head => head, [[7, 7]], config), /original middle/);
  assert.throws(() => invokeProblem(head => { const middle = head.next; head.next = null; return middle; }, [[1, 2]], config), /Preserve/);
});

test('cash settlement agrees with zero-sum subset partitions and exact large balances', () => {
  const slug = 'minimize-cash-flow-among-a-given-set-of-friends-who-have-borrowed-money-from-each-other';
  for (let seed = 0; seed < 50; seed++) {
    let state = seed + 1;
    const graph = Array.from({length: 5}, (_, i) => Array.from({length: 5}, (_, j) => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return i === j ? 0 : state % 4;
    }));
    const net = Array(5).fill(0);
    graph.forEach((row, i) => row.forEach((v, j) => {net[i] -= v; net[j] += v;}));
    const values = net.filter(v => v !== 0), count = 1 << values.length;
    const sums = Array(count).fill(0), groups = Array(count).fill(-Infinity);
    groups[0] = 0;
    for (let mask = 1; mask < count; mask++) {
      for (let i = 0; i < values.length; i++) if (mask & (1 << i)) sums[mask] += values[i];
      for (let sub = mask; sub; sub = (sub - 1) & mask) {
        if (sums[sub] === 0) groups[mask] = Math.max(groups[mask], groups[mask ^ sub] + 1);
      }
    }
    const optimum = values.length - groups[count - 1];
    const result = solution(slug, [graph]);
    assert.equal(result.length, optimum);
    assert.equal(compareProblemResult(result, Array(optimum), [graph], {validator: 'cashFlow'}), true);
  }
  const big = Number.MAX_SAFE_INTEGER;
  const graph = [[0,big,big],[big,0,1],[big,0,0]];
  const result = solution(slug, [graph]);
  assert.equal(compareProblemResult(result, [[1,2,1]], [graph], {validator: 'cashFlow'}), true);
  assert.equal(compareProblemResult([], [[1,2,1]], [graph], {validator: 'cashFlow'}), false);
});

test('stone merging matches enumeration of adjacent merge choices', () => {
  function brute(piles, k) {
    if (piles.length === 1) return 0;
    let best = Infinity;
    for (let i = 0; i + k <= piles.length; i++) {
      const cost = piles.slice(i, i + k).reduce((a, b) => a + b, 0);
      best = Math.min(best, cost + brute([...piles.slice(0, i), cost, ...piles.slice(i + k)], k));
    }
    return best;
  }
  for (let length = 1; length <= 5; length++) {
    for (let mask = 0; mask < 2 ** length; mask++) {
      const piles = Array.from({length}, (_, i) => 1 + ((mask >> i) & 1));
      for (const k of [2, 3, 4]) {
        const expected = brute(piles, k);
        assert.equal(solution('minimum-cost-to-merge-stones', [piles, k]), Number.isFinite(expected) ? expected : -1);
      }
    }
  }
});

test('equal-array moves handles maximum length without spreading arguments', () => {
  const values = Array(100000).fill(1000000000);
  values[0] = -1000000000;
  assert.equal(solution('minimum-moves-to-equal-array-elements', [values]), 199998000000000);
});

test('nine-queen solutions are complete, distinct, and nonattacking', () => {
  const boards = solution('n-queens', [9]);
  assert.equal(boards.length, 352);
  assert.equal(new Set(boards.map(b => b.join('/'))).size, 352);
  for (const board of boards) {
    assert.equal(board.length, 9);
    const cols = [], diag = new Set(), anti = new Set();
    board.forEach((row, r) => {
      assert.match(row, /^[.Q]{9}$/);
      assert.equal([...row].filter(c => c === 'Q').length, 1);
      const c = row.indexOf('Q');
      cols.push(c); diag.add(r-c); anti.add(r+c);
    });
    assert.equal(new Set(cols).size, 9);
    assert.equal(diag.size, 9);
    assert.equal(anti.size, 9);
  }
});

test('palindrome reference restores exact nodes and links on match and mismatch', () => {
  const markdown = fs.readFileSync('content/problems/palindrome-linked-list/solution.md', 'utf8');
  const code = markdown.match(/```javascript\s*\n([\s\S]*?)```/)[1];
  const check = vm.runInNewContext(`${code}\nisPalindrome`);
  for (const values of [[0], [1, 1], [1, 2], [1, 2, 1], [1, 2, 3], [1, 2, 2, 1], [1, 2, 3, 1], Array(100000).fill(7)]) {
    const nodes = values.map(val => ({val, next: null}));
    nodes.forEach((node, i) => { node.next = nodes[i + 1] || null; });
    const expected = values.every((value, i) => value === values[values.length - 1 - i]);
    assert.equal(check(nodes[0]), expected);
    nodes.forEach((node, i) => {
      assert.equal(node.val, values[i]);
      assert.equal(node.next, nodes[i + 1] || null);
    });
  }
});

test('palindrome pairs matches every ordered concatenation across small word subsets', () => {
  const candidates = ['', 'a', 'b', 'aa', 'ab', 'ba', 'aba'];
  for (let mask = 1; mask < 2 ** candidates.length; mask++) {
    const words = candidates.filter((_, i) => mask & (1 << i));
    const expected = [];
    words.forEach((a, i) => words.forEach((b, j) => {
      const joined = a + b;
      if (i !== j && joined === [...joined].reverse().join('')) expected.push([i, j]);
    }));
    const actual = solution('palindrome-pairs', [words]);
    const canonical = pairs => pairs.map(pair => pair.join(',')).sort();
    assert.deepEqual(canonical(actual), canonical(expected));
  }
});

test('stable partition rejects copied nodes, swapped duplicate nodes, and cycles', () => {
  const config = {argTypes: ['list'], outputType: 'partitionList'};
  assert.deepEqual(solution('partition-list', [[3, 1, 3, 2], 3]), [1, 2, 3, 3]);
  assert.throws(() => invokeProblem(() => ({val: 1, next: null}), [[1], 2], config), /original nodes/);
  assert.throws(() => invokeProblem(head => {
    const second = head.next;
    second.next = head; head.next = null;
    return second;
  }, [[1, 1], 2], config), /original nodes/);
  assert.throws(() => invokeProblem(head => {
    head.next = head;
    return head;
  }, [[1], 2], config), /Terminate/);
  assert.throws(() => invokeProblem(head => {
    head.val = 0;
    return head;
  }, [[1], 2], config), /original nodes/);
  assert.deepEqual(invokeProblem(head => head, [[], 2], config), []);
});

test('path sum handles maximum-height trees and only accepts a leaf endpoint', () => {
  const tree = [0];
  for (let i = 1; i < 5000; i++) tree.push(null, i === 4999 ? 1 : 0);
  assert.equal(solution('path-sum', [tree, 1]), true);
  assert.equal(solution('path-sum', [tree, 0]), false);
});

test('next-pointer runner requires exact neighbors and unchanged original tree', () => {
  const config = {argTypes: ['tree'], outputType: 'nextLevels'};
  assert.throws(() => invokeProblem(root => ({...root}), [[1]], config), /original root/);
  assert.throws(() => invokeProblem(root => {
    root.left.next = {val: root.right.val, next: null}; return root;
  }, [[1, 2, 2]], config), /next neighbor/);
  assert.throws(() => invokeProblem(root => {
    root.left = null; return root;
  }, [[1, 2, 3]], config), /child links/);
  assert.throws(() => invokeProblem(root => {
    root.next = root; return root;
  }, [[1]], config), /next neighbor/);
  assert.deepEqual(solution('populating-next-right-pointers-in-each-node', [[1, 2, 3, 4, 5, 6, 7]]), [[1], [2, 3], [4, 5, 6, 7]]);
});

test('BST neighbors must be original strict neighbors and preserve the tree', () => {
  const config = {argTypes: ['tree'], outputType: 'predecessorSuccessor'};
  assert.deepEqual(solution('predecessor-and-successor-practice', [[2, 1, 3], 2]), [1, 3]);
  assert.throws(() => invokeProblem(() => [{val: 1}, {val: 3}], [[2, 1, 3], 2], config), /original predecessor/);
  assert.throws(() => invokeProblem(root => [root, root.right], [[2, 1, 3], 2], config), /original predecessor/);
  assert.throws(() => invokeProblem(root => {
    const pair = [root.left, root.right]; root.left = null; return pair;
  }, [[2, 1, 3], 2], config), /Preserve/);
});

test('K-sum path enumeration handles a 10000-node chain without recursion', () => {
  const tree = [1];
  for (let i = 1; i < 10000; i++) tree.push(null, 1);
  const paths = solution('print-all-k-sum-paths-in-a-binary-tree', [tree, 10000]);
  assert.equal(paths.length, 1);
  assert.equal(paths[0].length, 10000);
  assert.equal(paths[0].every(value => value === 1), true);
});

test('radix sort handles maximum input length and ten-digit values', () => {
  const values = Array.from({length: 100000}, (_, i) => (i * 7919) % 1000000001);
  values[0] = 1000000000;
  const expected = values.slice().sort((a, b) => a - b);
  assert.deepEqual(solution('radix-sort-data-structures-and-algorithms-tutorials', [values]), expected);
});

test('list reorder rejects value-only changes and missing duplicate nodes', () => {
  const config = {argTypes: ['list'], outputType: 'reorderedList', resultArg: 0};
  assert.throws(() => invokeProblem(head => {
    head.next.val = 4; head.next.next.val = 2; head.next.next.next.val = 3;
  }, [[1, 2, 3, 4]], config), /original nodes/);
  assert.throws(() => invokeProblem(head => {
    head.next = null;
  }, [[1, 1, 1]], config), /original nodes/);
  assert.deepEqual(solution('rearrange-a-given-linked-list-in-place', [[1, 1, 1, 1]]), [1, 1, 1, 1]);
});

test('BST recovery rejects replacement nodes even with the correct serialized tree', () => {
  const config = {argTypes: ['tree'], outputType: 'tree', resultArg: 0, preserveTreeStructure: true};
  assert.throws(() => invokeProblem(root => {
    root.val = 2; root.left = {val: 1, left: null, right: null};
  }, [[1, 2]], config), /original tree nodes/);
  assert.deepEqual(invokeProblem(root => {
    [root.val, root.left.val] = [root.left.val, root.val];
  }, [[1, 2]], config), [2, 1]);
});

test('remove boxes agrees with enumeration of all same-color group removals', () => {
  const memo = new Map();
  function brute(boxes) {
    if (!boxes.length) return 0;
    const key = boxes.join(',');
    if (memo.has(key)) return memo.get(key);
    let best = 0;
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i; j < boxes.length && boxes[j] === boxes[i]; j++) {
        best = Math.max(best, (j - i + 1) ** 2 + brute([...boxes.slice(0, i), ...boxes.slice(j + 1)]));
      }
    }
    memo.set(key, best);
    return best;
  }
  for (let length = 1; length <= 6; length++) {
    for (let mask = 0; mask < 2 ** length; mask++) {
      const boxes = Array.from({length}, (_, i) => 1 + ((mask >> i) & 1));
      assert.equal(solution('remove-boxes', [boxes]), brute(boxes));
    }
  }
});

test('list deduplication accepts original duplicate choices but rejects copies and changed values', () => {
  const config = {argTypes: ['list'], outputType: 'list', originalListNodes: true};
  assert.deepEqual(invokeProblem(head => head.next, [[1, 1, 2]], config), [1, 2]);
  assert.throws(() => invokeProblem(() => ({val: 1, next: null}), [[1, 1]], config), /original list nodes/);
  assert.throws(() => invokeProblem(head => {
    head.val = 2; head.next = null; return head;
  }, [[1, 1]], config), /original list nodes/);
  assert.throws(() => invokeProblem(head => {
    head.next = head; return head;
  }, [[1]], config), /cycle/);
});

test('list filtering verifies exact survivors and their identity order', () => {
  const config = {argTypes: ['list'], outputType: 'list', originalListNodes: true, listFilter: 'excludeValue'};
  assert.throws(() => invokeProblem(head => {
    const second = head.next; second.next = head; head.next = null; return second;
  }, [[1, 1], 2], config), /required order/);
  assert.throws(() => invokeProblem(() => null, [[1], 2], config), /required original node/);
  assert.deepEqual(solution('remove-linked-list-elements', [[2, 1, 2, 1], 2]), [1, 1]);
  assert.deepEqual(solution('remove-duplicates-from-sorted-list-ii', [[1, 1, 2, 3, 3, 4]]), [2, 4]);
});

test('nth removal checks position even when all values match', () => {
  const config = {argTypes: ['list'], outputType: 'list', originalListNodes: true, listFilter: 'removeNth'};
  assert.throws(() => invokeProblem(head => head.next, [[1, 1, 1], 2], config), /required order/);
  assert.deepEqual(solution('remove-nth-node-from-end-of-list', [[1, 1, 1], 2]), [1, 1]);
  assert.deepEqual(solution('reorder-list', [[1, 2, 3, 4, 5]]), [1, 5, 2, 4, 3]);
});

test('reverse list requires reversed identities even when values are equal', () => {
  const config = {argTypes: ['list'], outputType: 'list', originalListNodes: true, listOrder: 'reverse'};
  assert.throws(() => invokeProblem(head => head, [[1, 1]], config), /required order/);
  assert.deepEqual(solution('reverse-linked-list', [[1, 1, 1]]), [1, 1, 1]);
  assert.deepEqual(solution('reverse-linked-list', [[]]), []);
});

test('segment and group reversal validate node identities and incomplete suffixes', () => {
  const base = {argTypes: ['list'], outputType: 'list', originalListNodes: true};
  assert.throws(() => invokeProblem(head => head, [[1, 1, 1], 1, 2], {...base, listOrder: 'reverseBetween'}), /required order/);
  assert.throws(() => invokeProblem(head => head, [[1, 1, 1], 2], {...base, listOrder: 'reverseGroups'}), /required order/);
  assert.deepEqual(solution('reverse-linked-list-ii', [[1, 1, 1], 1, 2]), [1, 1, 1]);
  assert.deepEqual(solution('reverse-nodes-in-k-group', [[1, 2, 3, 4, 5], 3]), [3, 2, 1, 4, 5]);
});

test('reverse pairs matches original-index enumeration with negatives and zeros', () => {
  for (let length = 1; length <= 4; length++) {
    for (let encoding = 0; encoding < 3 ** length; encoding++) {
      let value = encoding;
      const values = Array.from({length}, () => { const digit = value % 3; value = Math.floor(value / 3); return digit - 1; });
      let expected = 0;
      for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) if (values[i] > 2 * values[j]) expected++;
      assert.equal(solution('reverse-pairs', [values]), expected);
    }
  }
});

test('rotated search finds every present and missing target across small rotations', () => {
  for (let length = 1; length <= 8; length++) {
    const sorted = Array.from({length}, (_, i) => i * 2 - 8);
    for (let pivot = 0; pivot < length; pivot++) {
      const values = [...sorted.slice(pivot), ...sorted.slice(0, pivot)];
      for (let target = -9; target <= 8; target++) {
        assert.equal(solution('search-in-rotated-sorted-array', [values, target]), values.indexOf(target));
      }
    }
  }
});

test('even-odd list partition preserves identities and stable order', () => {
  const config = {argTypes: ['list'], outputType: 'list', originalListNodes: true, listOrder: 'evenOdd'};
  assert.throws(() => invokeProblem(head => {
    const second = head.next; second.next = head; head.next = null; return second;
  }, [[2, 2]], config), /required order/);
  assert.deepEqual(solution('segregate-even-and-odd-nodes-in-a-linked-list', [[0, -1, -2, -3, 4]]), [0, -2, 4, -1, -3]);
});

test('tree codec requires a string and independent serializer/deserializer scopes', () => {
  const config = {mode: 'codec'};
  const factory = () => ({
    serialize: root => JSON.stringify(root),
    deserialize: data => JSON.parse(data),
  });
  assert.deepEqual(invokeProblem(factory, [[1, null, 2]], config), [1, null, 2]);
  assert.throws(() => invokeProblem(() => ({serialize: root => root}), [[1]], config), /return a string/);
  assert.throws(() => invokeProblem(() => {
    let saved;
    return {serialize: root => { saved = root; return 'saved'; }, deserialize: () => {
      if (!saved) throw new Error('No saved tree');
      return saved;
    }};
  }, [[1]], config), /No saved tree/);
  const reused = {val: 1, left: null, right: null};
  assert.throws(() => invokeProblem(() => ({
    serialize: root => { reused.left = root; return 'x'; },
    deserialize: () => reused.left,
  }), [[1]], config), /independent nodes/);
});

test('tree codec reference handles a 10000-node chain without recursion', () => {
  const chain = [0];
  for (let i = 1; i < 10000; i++) chain.push(null, i % 1001);
  assert.deepEqual(solution('serialize-and-deserialize-binary-tree', [chain]), chain);
});

test('matrix zeroes uses original zeros and mutates the matrix at the size limit', () => {
  const matrix = Array.from({length: 200}, () => Array(200).fill(7));
  matrix[111][123] = 0;
  const expected = matrix.map((row, i) => row.map((value, j) => i === 111 || j === 123 ? 0 : value));
  assert.deepEqual(solution('set-matrix-zeroes', [matrix]), expected);
});

test('shortest bridge expands from the whole island and handles maximum grid size', () => {
  const grid = Array.from({length: 100}, () => Array(100).fill(0));
  grid[0][0] = 1;
  grid[99][99] = 1;
  assert.equal(solution('shortest-bridge', [grid]), 197);
  const largeIsland = Array.from({length: 100}, (_, i) => Array(100).fill(i < 98 ? 1 : 0));
  largeIsland[99][99] = 1;
  assert.equal(solution('shortest-bridge', [largeIsland]), 1);
});

test('path simplification handles maximum-length separators and literal dot names', () => {
  assert.equal(solution('simplify-path', ['/'.repeat(3000)]), '/');
  assert.equal(solution('simplify-path', ['/.../..hidden/../a..b/']), '/.../a..b');
});

test('sliding-window deque handles 100000 inputs and expired repeated maxima', () => {
  const values = Array.from({length: 100000}, (_, i) => i % 2 ? -10000 : 10000);
  assert.deepEqual(solution('sliding-window-maximum', [values, 50000]), Array(50001).fill(10000));
  assert.deepEqual(solution('sliding-window-maximum', [[9,9,1,2,3],2]), [9,9,2,3]);
});

test('snakes and ladders handles a maximum-size board without jumps', () => {
  const board = Array.from({length: 20}, () => Array(20).fill(-1));
  assert.equal(solution('snakes-and-ladders', [board]), 67);
});

test('cryptarithmetic accepts alternate assignments and checks exact long-word arithmetic', () => {
  const config = {validator: 'cryptarithm'};
  const args = [['A', 'B'], 'C'];
  assert.equal(compareProblemResult({A: 2, B: 3, C: 5}, {A: 1, B: 2, C: 3}, args, config), true);
  assert.equal(compareProblemResult({A: 1, B: 1, C: 2}, {}, args, config), false);
  assert.equal(compareProblemResult({A: 0, B: 2, C: 2}, {}, args, config), false);
  assert.equal(compareProblemResult({A: 1, B: 2}, {}, args, config), false);
  assert.equal(compareProblemResult({A: 0}, {A: 1}, [['A'], 'A'], config), false);
  const longArgs = [['A'.repeat(20), 'A'.repeat(20)], 'B'.repeat(20)];
  const actual = solution('solving-cryptarithmetic-puzzles', longArgs);
  assert.equal(compareProblemResult(actual, {A: 1, B: 2}, longArgs, config), true);
  assert.equal(compareProblemResult({A: 2, B: 3}, {}, longArgs, config), false);
  assert.equal(solution('solving-cryptarithmetic-puzzles', [['A', 'A'], 'A']), null);
});

test('value-only list sorting rejects replacement nodes and changed links', () => {
  const config = {argTypes: ['list'], outputType: 'list', resultArg: 0, preserveListLinks: true};
  assert.deepEqual(invokeProblem(head => {head.val = 0; head.next.val = 2;}, [[2,0]], config), [0,2]);
  assert.throws(() => invokeProblem(head => {head.val = 0; head.next = {val:2,next:null};}, [[2,0]], config), /original list nodes/);
  assert.throws(() => invokeProblem(head => {head.next = null;}, [[0,1]], config), /original list nodes/);
  assert.deepEqual(solution('sort-a-linked-list-of-0s-1s-and-2s', [Array(1000).fill(2)]), Array(1000).fill(2));
});

test('list sorting preserves original nodes and sorts the maximum-length input iteratively', () => {
  const config = {argTypes:['list'],outputType:'list',originalListNodes:true,requireAllOriginalNodes:true};
  assert.throws(() => invokeProblem(head => ({val:head.val,next:null}), [[1]], config), /original list nodes/);
  assert.throws(() => invokeProblem(head => {head.val=0;return head;}, [[1]], config), /without changing/);
  assert.throws(() => invokeProblem(head => head.next, [[1,1]], config), /every original list node/);
  const input = Array.from({length:50000}, (_, i) => 25000-i);
  assert.deepEqual(solution('sort-list', [input]), input.slice().reverse());
});

test('split-array reference handles upper-bound sums and all-zero inputs', () => {
  assert.equal(solution('split-array-largest-sum', [Array(1000).fill(1000000), 1]), 1000000000);
  assert.equal(solution('split-array-largest-sum', [Array(1000).fill(1000000), 50]), 20000000);
  assert.equal(solution('split-array-largest-sum', [Array(1000).fill(0), 50]), 0);
});

test('aggressive cows handles 100000 stalls and large coordinate differences', () => {
  const stalls = Array.from({length:100000}, (_, i) => i * 10000);
  assert.equal(solution('spoj-com-problem-aggrcow', [stalls, 2]), 999990000);
  assert.equal(solution('spoj-com-problem-aggrcow', [stalls, 100000]), 10000);
});

test('knight BFS handles the maximum board with compact storage', () => {
  assert.equal(solution('steps-by-knight-practice', [1000,[0,0],[999,999]]), 666);
  assert.equal(solution('steps-by-knight-practice', [1000,[999,999],[999,999]]), 0);
});

test('prefix-sum counts include overlapping zero ranges at maximum input lengths', () => {
  assert.equal(solution('subarray-sum-equals-k', [Array(20000).fill(0), 0]), 200010000);
  assert.equal(solution('subarray-sums-divisible-by-k', [Array(30000).fill(0), 10000]), 450015000);
  assert.equal(solution('subarray-sums-divisible-by-k', [[-1,2,9], 2]), 2);
});

test('iterative SCC traversal handles 5000-vertex chains and cycles', () => {
  const n = 5000;
  const chain = Array.from({length:n}, (_,i) => i+1<n ? [i+1] : []);
  const components = solution('strongly-connected-practice', [n,chain]);
  assert.equal(components.length,n);
  assert.equal(new Set(components.flat()).size,n);
  chain[n-1] = [0];
  const cycle = solution('strongly-connected-practice', [n,chain]);
  assert.equal(cycle.length,1);
  assert.equal(cycle[0].length,n);
});

test('subset problems respect one-use positions and maximum sizes', () => {
  assert.equal(solution('subset-sum-problem', [[3],6]), false);
  assert.equal(solution('subset-sum-problem', [Array(100).fill(10000),100000]), true);
  assert.equal(solution('subset-sum-problem', [Array(100).fill(10000),99999]), false);
  const unique = solution('subsets-ii', [Array.from({length:10},(_,i)=>i)]);
  assert.equal(unique.length,1024);
  assert.equal(new Set(unique.map(s=>JSON.stringify(s))).size,1024);
  assert.equal(solution('subsets-ii', [Array(10).fill(2)]).length,11);
});

test('linked-list subtraction handles a 10000-digit borrow chain exactly', () => {
  const large = [1, ...Array(9999).fill(0)];
  const expected = Array(9999).fill(9);
  assert.deepEqual(solution('subtract-two-numbers-represented-as-linked-lists', [large,[1]]), expected);
  assert.deepEqual(solution('subtract-two-numbers-represented-as-linked-lists', [[1],large]), expected);
  assert.deepEqual(solution('subtract-two-numbers-represented-as-linked-lists', [Array(10000).fill(0),[0]]), [0]);
});

test('subtree comparison handles long repeated-value trees and deep mismatches', () => {
  const chain = length => {
    const values = [1];
    for (let i=1;i<length;i++) values.push(null,1);
    return values;
  };
  const root = chain(2000), sub = chain(1000);
  assert.equal(solution('subtree-of-another-tree', [root,sub]), true);
  sub[sub.length-1] = 2;
  assert.equal(solution('subtree-of-another-tree', [root,sub]), false);
});

test('Sudoku runner requires in-place completion and exact digit strings', () => {
  const meta = JSON.parse(fs.readFileSync('content/problems/sudoku-solver/meta.json','utf8'));
  const fixture = meta.testCases[0];
  const returnedOnly = invokeProblem(() => fixture.expected, fixture.args, meta.runner);
  assert.equal(compareProblemResult(returnedOnly,fixture.expected,fixture.args,meta.runner),false);
  const numeric = fixture.expected.map(row=>row.map(Number));
  assert.equal(compareProblemResult(numeric,fixture.expected,fixture.args,meta.runner),false);
  const changedClue = structuredClone(fixture.expected);
  changedClue[0][0] = '1';
  assert.equal(compareProblemResult(changedClue,fixture.expected,fixture.args,meta.runner),false);
});

test('left-leaf and symmetry references handle depth-limit trees', () => {
  const leftChain = [1];
  for (let i=1;i<1000;i++) leftChain.push(1,null);
  assert.equal(solution('sum-of-left-leaves', [leftChain]),1);
  assert.equal(solution('symmetric-tree', [leftChain]),false);
  const full = Array(511).fill(1);
  assert.equal(solution('symmetric-tree', [full]),true);
  full[510] = 2;
  assert.equal(solution('symmetric-tree', [full]),false);
});

test('subarray minimum contributions remain exact at maximum size and value', () => {
  const n=30000, value=30000;
  const expected=Number(BigInt(value)*BigInt(n)*BigInt(n+1)/2n%1000000007n);
  assert.equal(solution('sum-of-subarray-minimums',[Array(n).fill(value)]),expected);
});

test('tree distance rerooting handles a 30000-vertex path without recursion', () => {
  const n=30000;
  const edges=Array.from({length:n-1},(_,i)=>[i,i+1]);
  const expected=Array.from({length:n},(_,i)=>i*(i+1)/2+(n-1-i)*(n-i)/2);
  assert.deepEqual(solution('sum-of-distances-in-tree',[n,edges]),expected);
});

test('egg-drop coverage matches an independent small minimax recurrence', () => {
  const dp=Array.from({length:5},()=>Array(21).fill(0));
  for(let n=1;n<=20;n++) dp[1][n]=n;
  for(let k=2;k<=4;k++) for(let n=1;n<=20;n++) {
    dp[k][n]=Infinity;
    for(let floor=1;floor<=n;floor++) dp[k][n]=Math.min(dp[k][n],1+Math.max(dp[k-1][floor-1],dp[k][n-floor]));
  }
  for(let k=1;k<=4;k++) for(let n=1;n<=20;n++) assert.equal(solution('super-egg-drop',[k,n]),dp[k][n]);
  assert.equal(solution('super-egg-drop',[100,10000]),14);
});

test('rising-water reference handles the maximum board and a high starting cell', () => {
  const n=50;
  const grid=Array.from({length:n},(_,r)=>Array.from({length:n},(_,c)=>r*n+c));
  assert.equal(solution('swim-in-rising-water',[grid]),2499);
  grid[0][0]=2499;grid[49][49]=0;
  assert.equal(solution('swim-in-rising-water',[grid]),2499);
});

test('text justification preserves trailing spaces and packs maximum word count', () => {
  const words=Array(300).fill('x'.repeat(20));
  const lines=solution('text-justification',[words,100]);
  assert.equal(lines.length,75);
  assert.ok(lines.every(line=>line.length===100));
  assert.deepEqual(lines.flatMap(line=>line.trim().split(/ +/)),words);
  assert.equal(lines[0],words[0]+' '.repeat(7)+words[0]+' '.repeat(7)+words[0]+' '.repeat(6)+words[0]);
  assert.equal(lines.at(-1),Array(4).fill(words[0]).join(' ')+' '.repeat(17));
  assert.equal(compareProblemResult(['a'],['a  '],[],{}),false);
});

test('celebrity elimination verifies both directions at the population limit', () => {
  const n=500, celebrity=321;
  const matrix=Array.from({length:n},(_,a)=>Array.from({length:n},(_,b)=>a!==b&&b===celebrity?1:0));
  assert.equal(solution('the-celebrity-problem',[n,matrix]),celebrity);
  matrix[499][celebrity]=0;
  assert.equal(solution('the-celebrity-problem',[n,matrix]),-1);
});

test('employee propagation handles 100000-person chains and parallel teams', () => {
  const n=100000;
  const manager=Array.from({length:n},(_,i)=>i-1);
  const times=Array(n).fill(1000);times[n-1]=0;
  assert.equal(solution('time-needed-to-inform-all-employees',[n,0,manager,times]),99999000);
  const star=Array(n).fill(0);star[0]=-1;
  const starTimes=Array(n).fill(0);starTimes[0]=1000;
  assert.equal(solution('time-needed-to-inform-all-employees',[n,0,star,starTimes]),1000);
});

test('topological validator accepts alternate orders and rejects missing or reversed vertices', () => {
  const config={validator:'topological'}, args=[4,[[],[0],[0],[0]]];
  assert.equal(compareProblemResult([3,1,2,0],[1,2,3,0],args,config),true);
  for (const invalid of [[0,1,2,3],[1,2,2,0],[1,2,0],[1,2,3,4],[1,2,3,'0']])
    assert.equal(compareProblemResult(invalid,[1,2,3,0],args,config),false);
  const n=10000, adj=Array.from({length:n},(_,i)=>i<n-1?[i+1]:[]);
  assert.deepEqual(solution('topological-sort-practice',[n,adj]),Array.from({length:n},(_,i)=>i));
});

test('spanning-tree determinant matches complete and complete-bipartite counts', () => {
  const complete=Array.from({length:10},(_,i)=>Array.from({length:10},(_,j)=>j).filter(j=>j!==i));
  assert.equal(solution('total-number-of-spanning-trees-in-a-graph',[complete,10]),100000000);
  const bipartite=Array.from({length:10},(_,i)=>Array.from({length:10},(_,j)=>j).filter(j=>(i<5)!==(j<5)));
  assert.equal(solution('total-number-of-spanning-trees-in-a-graph',[bipartite,10]),390625);
});

test('rainwater handles maximum width and height without overflow', () => {
  const heights=Array(20000).fill(0);heights[0]=heights[19999]=100000;
  assert.equal(solution('trapping-rain-water',[heights]),1999800000);
});

test('travelling salesman handles 20 cities with compact subset storage', () => {
  const markdown=fs.readFileSync('content/problems/travelling-salesman-problem-using-dynamic-programming/solution.md','utf8');
  const code=markdown.match(/```javascript\n([\s\S]*?)```/)[1];
  const tsp=new Function(code+'; return tsp;')();
  const n=20;
  const dist=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?0:((j===(i+1)%n)?1:10000)));
  assert.equal(tsp(dist),20);
});

test('trie supports maximum word length, repeated calls, and fresh fixtures', () => {
  const word='a'.repeat(2000);
  assert.deepEqual(solution('trie-data-structure',[[],[['insert',word],['search',word],['search',word.slice(1)],['startsWith',word.slice(1)]]]),[null,true,false,true]);
  const operations=[['insert','a'],...Array.from({length:29999},()=>['search','a'])];
  const actual=solution('trie-data-structure',[[],operations]);
  assert.equal(actual.length,30000);
  assert.equal(actual[0],null);
  assert.ok(actual.slice(1).every(value=>value===true));
  assert.deepEqual(solution('trie-data-structure',[[],[['search','a']]]),[false]);
});

test('tug-of-war accepts tied optima and enforces subset size and multiplicities', () => {
  const config={validator:'tug'}, args=[[1,2,3,4]], expected={minDiff:0,bestSubset:[1,4]};
  assert.equal(compareProblemResult({minDiff:0,bestSubset:[2,3]},expected,args,config),true);
  assert.equal(compareProblemResult({minDiff:0,bestSubset:[1,1]},expected,args,config),false);
  assert.equal(compareProblemResult({minDiff:0,bestSubset:[1]},expected,args,config),false);
  assert.equal(compareProblemResult({minDiff:4,bestSubset:[1,2]},expected,args,config),false);
  assert.equal(compareProblemResult({minDiff:1,bestSubset:[1,4]},expected,args,config),false);
  const values=Array.from({length:20},(_,i)=>i+1);
  const actual=solution('tug-of-war',[values]);
  assert.equal(compareProblemResult(actual,{minDiff:0},[values],config),true);
});

test('two-sum checker accepts reversed indices and rejects reuse and value output', () => {
  const config={validator:'twoSum'}, args=[[3,3],6];
  assert.equal(compareProblemResult([1,0],[0,1],args,config),true);
  for(const invalid of [[0,0],[3,3],[0,2],['0',1],[-1,1],[]])
    assert.equal(compareProblemResult(invalid,[0,1],args,config),false);
  const nums=Array.from({length:10000},(_,i)=>i+1);
  assert.deepEqual(solution('two-sum',[nums,19999]),[9998,9999]);
});

test('undirected cycle detection handles 100000 vertices and a late closing edge', () => {
  const n=100000, edges=Array.from({length:n-1},(_,i)=>[i,i+1]);
  assert.equal(solution('undirected-graph-cycle-practice',[n,edges]),false);
  edges.push([n-1,0]);
  assert.equal(solution('undirected-graph-cycle-practice',[n,edges]),true);
});

test('BST counts match an independent exact Catalan formula throughout the input range', () => {
  for(let n=1;n<=19;n++) {
    let binomial=1n;
    for(let i=1;i<=n;i++) binomial=binomial*BigInt(n+i)/BigInt(i);
    assert.equal(solution('unique-binary-search-trees',[n]),Number(binomial/BigInt(n+1)));
  }
});

test('generated BSTs contain all 1430 unique valid trees at n=8', () => {
  const trees=solution('unique-binary-search-trees-ii',[8]);
  assert.equal(trees.length,1430);
  assert.equal(new Set(trees.map(tree=>JSON.stringify(tree))).size,1430);
  for(const values of trees) {
    const root={val:values[0]}, queue=[root];let index=1;
    for(const node of queue) for(const side of ['left','right']) {
      const value=values[index++];
      if(value!=null) {node[side]={val:value};queue.push(node[side]);}
    }
    const inorder=[];
    function visit(node) {if(!node)return;visit(node.left);inorder.push(node.val);visit(node.right);}
    visit(root);
    assert.deepEqual(inorder,[1,2,3,4,5,6,7,8]);
  }
  const expected=[[1,null,2],[2,1]], config={unordered:true};
  assert.equal(compareProblemResult(expected.slice().reverse(),expected,[],config),true);
  assert.equal(compareProblemResult([expected[0],expected[0]],expected,[],config),false);
});

test('unique paths agrees with exact combinations for every allowed grid size', () => {
  const slug='unique-paths';
  const code=fs.readFileSync(`content/problems/${slug}/solution.md`,'utf8').match(/```javascript\s*\n([\s\S]*?)```/)[1];
  const fn=new Function(`${code}; return uniquePaths;`)();
  for(let m=1;m<=100;m++) for(let n=1;n<=100;n++) {
    let count=1n;
    for(let k=1;k<m;k++) count=count*BigInt(n+k-1)/BigInt(k);
    if(count<=2000000000n) assert.equal(fn(m,n),Number(count),`${m} by ${n}`);
  }
});

test('unique paths III matches route permutations for every 2 by 3 board and restores input', () => {
  const code=fs.readFileSync('content/problems/unique-paths-iii/solution.md','utf8').match(/```javascript\s*\n([\s\S]*?)```/)[1];
  const fn=new Function(`${code}; return uniquePathsIII;`)();
  const adjacent=(a,b)=>Math.abs(Math.floor(a/3)-Math.floor(b/3))+Math.abs(a%3-b%3)===1;
  for(let start=0;start<6;start++) for(let end=0;end<6;end++) {
    if(start===end) continue;
    const rest=Array.from({length:6},(_,i)=>i).filter(i=>i!==start&&i!==end);
    for(let blocked=0;blocked<16;blocked++) {
      const grid=Array.from({length:2},()=>Array(3).fill(0));
      grid[Math.floor(start/3)][start%3]=1;
      grid[Math.floor(end/3)][end%3]=2;
      rest.forEach((cell,i)=>{if(blocked>>i&1) grid[Math.floor(cell/3)][cell%3]=-1;});
      const middle=rest.filter((_,i)=>!(blocked>>i&1));
      let expected=0;
      function permute(prefix,remaining) {
        if(!remaining.length) {
          const route=[start,...prefix,end];
          if(route.slice(1).every((cell,i)=>adjacent(route[i],cell))) expected++;
          return;
        }
        remaining.forEach((cell,i)=>permute([...prefix,cell],remaining.filter((_,j)=>j!==i)));
      }
      permute([],middle);
      const original=structuredClone(grid);
      assert.equal(fn(grid),expected,JSON.stringify(original));
      assert.deepEqual(grid,original);
    }
  }
});

test('valid number matches an independent grammar across short token combinations', () => {
  const code=fs.readFileSync('content/problems/valid-number/solution.md','utf8').match(/```javascript\s*\n([\s\S]*?)```/)[1];
  const fn=new Function(`${code}; return isNumber;`)();
  const grammar=/^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;
  function check(s) {
    if(s.length) assert.equal(fn(s),grammar.test(s),s);
    if(s.length===5) return;
    for(const char of ['0','1','.','e','E','+','-','a']) check(s+char);
  }
  check('');
  for(const s of ['9'.repeat(20),'1e'+'9'.repeat(18),'.'.repeat(20)]) assert.equal(fn(s),grammar.test(s));
});

test('one-deletion palindrome agrees with exhaustive deletions and handles maximum length', () => {
  const code=fs.readFileSync('content/problems/valid-palindrome-ii/solution.md','utf8').match(/```javascript\s*\n([\s\S]*?)```/)[1];
  const fn=new Function(`${code}; return validPalindrome;`)();
  const palindrome=s=>s===[...s].reverse().join('');
  function check(s) {
    if(s.length) {
      const expected=palindrome(s)||[...s].some((_,i)=>palindrome(s.slice(0,i)+s.slice(i+1)));
      assert.equal(fn(s),expected,s);
    }
    if(s.length===8) return;
    for(const char of ['a','b','c']) check(s+char);
  }
  check('');
  assert.equal(fn('a'.repeat(100000)),true);
  assert.equal(fn('b'+'a'.repeat(99999)),true);
  assert.equal(fn('b'+'a'.repeat(99998)+'c'),false);
});

test('square detection agrees with a perpendicular-edge oracle for all small-grid point tuples', () => {
  const code=fs.readFileSync('content/problems/valid-square/solution.md','utf8').match(/```javascript\s*\n([\s\S]*?)```/)[1];
  const fn=new Function(`${code}; return validSquare;`)();
  const points=Array.from({length:9},(_,i)=>[i%3-1,Math.floor(i/3)-1]);
  function oracle(p) {
    for(let a=1;a<4;a++) for(let b=1;b<4;b++) {
      if(a===b) continue;
      const c=6-a-b;
      const u=p[a].map((v,i)=>v-p[0][i]),v=p[b].map((v,i)=>v-p[0][i]);
      const length=u[0]**2+u[1]**2;
      if(length>0&&length===v[0]**2+v[1]**2&&u[0]*v[0]+u[1]*v[1]===0&&
        p[c].every((value,i)=>value===p[0][i]+u[i]+v[i])) return true;
    }
    return false;
  }
  for(const a of points) for(const b of points) for(const c of points) for(const d of points) {
    const tuple=[a,b,c,d];
    assert.equal(fn(...tuple),oracle(tuple),JSON.stringify(tuple));
  }
});

test('BST validation handles 10000-node chains and inherited strict bounds', () => {
  const values=[0];
  for(let i=1;i<10000;i++) values.push(null,i);
  assert.equal(solution('validate-binary-search-tree',[values]),true);
  values[values.length-1]=9998;
  assert.equal(solution('validate-binary-search-tree',[values]),false);
  values[values.length-1]=-1;
  assert.equal(solution('validate-binary-search-tree',[values]),false);
  assert.equal(solution('validate-binary-search-tree',[[10,5,15,null,null,6,20]]),false);
});

test('vertical traversal respects row before value and sorts same-position ties', () => {
  const slug='vertical-order-traversal-of-a-binary-tree';
  assert.deepEqual(solution(slug,[[9,2,3,null,1,0]]),[[2],[9,0,1],[3]]);
  assert.deepEqual(solution(slug,[[1,2,3,4,6,5,7]]),[[4],[2],[1,5,6],[3],[7]]);
  const right=[0];
  for(let i=1;i<1000;i++) right.push(null,i);
  assert.deepEqual(solution(slug,[right]),Array.from({length:1000},(_,i)=>[i]));
  const expected=[[4],[2],[1,5,6],[3],[7]];
  assert.equal(compareProblemResult([[4],[2],[1,6,5],[3],[7]],expected,[],{}),false);
  assert.equal(compareProblemResult(expected.slice().reverse(),expected,[],{}),false);
});

test('compact water-jug BFS agrees with divisibility for small capacities and handles large inputs', () => {
  const code=fs.readFileSync('content/problems/water-jug-problem-using-bfs/solution.md','utf8').match(/```javascript\s*\n([\s\S]*?)```/)[1];
  const fn=new Function(`${code}; return canMeasureWater;`)();
  function gcd(a,b) {while(b) [a,b]=[b,a%b];return a;}
  for(let x=1;x<=15;x++) for(let y=1;y<=15;y++) for(let target=0;target<=x+y+1;target++) {
    assert.equal(fn(x,y,target),target<=x+y&&target%gcd(x,y)===0,`${x},${y},${target}`);
  }
  assert.equal(fn(999999,1000000,500000),true);
  assert.equal(fn(999998,1000000,499999),false);
});

test('weighted scheduling matches subset enumeration and supports 100000 touching jobs', () => {
  const code=fs.readFileSync('content/problems/weighted-job-scheduling/solution.md','utf8').match(/```javascript\s*\n([\s\S]*?)```/)[1];
  const fn=new Function(`${code}; return maxProfit;`)();
  let seed=1717;
  function random(n) {seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;}
  for(let trial=0;trial<200;trial++) {
    const jobs=Array.from({length:1+random(9)},()=>{const start=1+random(10);return [start,start+1+random(8),1+random(20)];});
    let expected=0;
    for(let mask=0;mask<1<<jobs.length;mask++) {
      const chosen=jobs.filter((_,i)=>mask>>i&1).sort((a,b)=>a[0]-b[0]);
      if(chosen.every((job,i)=>i===0||chosen[i-1][1]<=job[0])) expected=Math.max(expected,chosen.reduce((sum,job)=>sum+job[2],0));
    }
    assert.equal(fn(structuredClone(jobs)),expected,JSON.stringify(jobs));
  }
  assert.equal(fn(Array.from({length:100000},(_,i)=>[i+1,i+2,10000]).reverse()),1000000000);
});

test('trie word break agrees with exhaustive cut positions and handles long shared prefixes', () => {
  const code=fs.readFileSync('content/problems/word-break-problem-trie-solution/solution.md','utf8').match(/```javascript\s*\n([\s\S]*?)```/)[1];
  const fn=new Function(`${code}; return wordBreak;`)();
  const dictionaries=[['a','b'],['ab','ba'],['a','ab','baa'],['aa','aaa','bb'],['aba'],['a','a','bb']];
  for(let length=1;length<=8;length++) for(let bits=0;bits<1<<length;bits++) {
    const s=Array.from({length},(_,i)=>bits>>i&1?'a':'b').join('');
    for(const dictionary of dictionaries) {
      let expected=false;
      for(let cuts=0;cuts<1<<(length-1);cuts++) {
        const parts=[];let start=0;
        for(let i=0;i<length;i++) if(i===length-1||cuts>>i&1) {parts.push(s.slice(start,i+1));start=i+1;}
        if(parts.every(part=>dictionary.includes(part))) {expected=true;break;}
      }
      assert.equal(fn(s,dictionary),expected,JSON.stringify([s,dictionary]));
    }
  }
  const words=Array.from({length:20},(_,i)=>'a'.repeat(i+1));
  assert.equal(fn('a'.repeat(300),words),true);
  assert.equal(fn('a'.repeat(299)+'b',words),false);
  assert.equal(fn('a'.repeat(300),Array.from({length:1000},(_,i)=>'a'.repeat(17)+String(i).padStart(3,'0'))),false);
});

test('word ladder matches an explicit Hamming-distance graph across every small dictionary', () => {
  const code=fs.readFileSync('content/problems/word-ladder/solution.md','utf8').match(/```javascript\s*\n([\s\S]*?)```/)[1];
  const fn=new Function(`${code}; return ladderLength;`)();
  const words=Array.from({length:8},(_,bits)=>Array.from({length:3},(_,i)=>bits>>i&1?'a':'b').join(''));
  function oracle(begin,end,list) {
    if(!list.includes(end)) return 0;
    const queue=[[begin,1]],seen=new Set([begin]);
    for(const [word,length] of queue) {
      if(word===end) return length;
      for(const next of list) if(!seen.has(next)&&[...word].filter((c,i)=>c!==next[i]).length===1) {seen.add(next);queue.push([next,length+1]);}
    }
    return 0;
  }
  for(let mask=1;mask<256;mask++) {
    const list=words.filter((_,i)=>mask>>i&1);
    for(const end of words.slice(1)) assert.equal(fn(words[0],end,list),oracle(words[0],end,list),JSON.stringify([end,list]));
  }
  const list=Array.from({length:5000},(_,i)=>{
    let value=i,word='';
    for(let j=0;j<10;j++) {word+=String.fromCharCode(97+value%26);value=Math.floor(value/26);}
    return word;
  });
  assert.equal(fn('zzzzzzzzzz',list[4999],list),0);
});

test('word searches match independently enumerated board paths and restore cells', () => {
  function reference(slug,name) {
    const code=fs.readFileSync(`content/problems/${slug}/solution.md`,'utf8').match(/```javascript\s*\n([\s\S]*?)```/)[1];
    return new Function(`${code}; return ${name};`)();
  }
  const exists=reference('word-search','exist'),find=reference('word-search-ii','findWords');
  const words=[];
  for(let len=1;len<=5;len++) for(let bits=0;bits<1<<len;bits++) words.push(Array.from({length:len},(_,i)=>bits>>i&1?'a':'b').join(''));
  for(let bits=0;bits<16;bits++) {
    const board=Array.from({length:2},(_,r)=>Array.from({length:2},(_,c)=>bits>>(r*2+c)&1?'a':'b'));
    const original=structuredClone(board),possible=new Set(),queue=[];
    for(let cell=0;cell<4;cell++) queue.push([cell,1<<cell,board[cell>>1][cell%2]]);
    for(const [cell,mask,word] of queue) {
      possible.add(word);
      for(let next=0;next<4;next++) if(!(mask>>next&1)&&Math.abs((cell>>1)-(next>>1))+Math.abs(cell%2-next%2)===1) queue.push([next,mask|1<<next,word+board[next>>1][next%2]]);
    }
    for(const word of words) {assert.equal(exists(board,word),possible.has(word));assert.deepEqual(board,original);}
    assert.deepEqual(find(board,words).sort(),words.filter(word=>possible.has(word)).sort());
    assert.deepEqual(board,original);
  }
  assert.equal(exists(Array.from({length:6},()=>Array(6).fill('a')),'a'.repeat(14)+'b'),false);
  assert.equal(exists(Array.from({length:6},()=>Array(6).fill('a')),'a'.repeat(15)),true);
  const board=Array.from({length:12},()=>Array(12).fill('a'));
  const dictionary=Array.from({length:30000},(_,i)=>{let n=i,s='b';for(let j=0;j<4;j++){s+=String.fromCharCode(97+n%26);n=Math.floor(n/26);}return s;});
  dictionary[0]='aaaaaaaaaa';
  assert.deepEqual(find(board,dictionary),['aaaaaaaaaa']);
  assert.equal(compareProblemResult(['a','a'],['a'],[],{unordered:true}),false);
});
