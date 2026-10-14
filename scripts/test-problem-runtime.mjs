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
  return JSON.parse(JSON.stringify(vm.runInContext(`${code}\n(${invokeProblem.toString()})(${meta.functionName},args,config)`,context,{timeout:2000})));
}

test('node fixtures preserve shape, identity, and backward links',()=> {
  assert.deepEqual(invokeProblem(root=>root,[ [1,null,2,3] ],{argTypes:['tree'],outputType:'tree'}),[1,null,2,3]);
  assert.equal(invokeProblem((a,b)=>a.next===b.next,[[[1],[2],[3]]],{argTypes:['intersectionLists']}),true);
  assert.throws(()=>invokeProblem(head=>head,[[[1,null]]],{argTypes:['randomList'],outputType:'randomList'}),/independent/);
  assert.throws(()=>invokeProblem(head=>head,[[1,{val:2,child:[3]}]],{argTypes:['multilevel'],outputType:'multilevel'}),/flattened/);
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
