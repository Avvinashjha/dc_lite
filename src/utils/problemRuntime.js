/** Keep displayed examples aligned with the executable fixture arguments. */
export function formatProblemInput(meta, args) {
  const signature = meta.templateCode.match(/(?:function\s+\w+|constructor)\(([^)]*)\)/);
  let names = signature ? signature[1].split(',').map(name=>name.trim()) : [];
  const runner = meta.runner || {};
  if (runner.mode === 'operations') names = ['constructorArgs','operations'];
  if (runner.mode === 'deleteNode') names = ['head','nodeIndex'];
  if (runner.argTypes?.[0] === 'cycleList') names = ['headFixture'];
  if (runner.argTypes?.[0] === 'intersectionLists') names = ['listFixture'];
  return args.map((value,i)=>(names[i] || `arg${i+1}`)+' = '+JSON.stringify(value)).join('\n');
}

/** JSON fixtures are converted to the node structures used by reference solutions. */
export function invokeProblem(fn, rawArgs, config = {}) {
  const args = structuredClone(rawArgs);
  function tree(values) {
    if (!values?.length || values[0] == null) return null;
    const root = { val: values[0], left: null, right: null, next: null }, queue = [root];
    let pos = 1;
    for (let i = 0; i < queue.length && pos < values.length; i++) {
      for (const side of ['left', 'right']) {
        const value = values[pos++];
        if (value != null) { queue[i][side] = { val: value, left: null, right: null, next: null }; queue.push(queue[i][side]); }
      }
    }
    return root;
  }
  function list(values) {
    let head = null;
    for (let i = values.length - 1; i >= 0; i--) head = { val: values[i], next: head };
    return head;
  }
  function find(root, value) {
    if (!root) return null;
    return root.val === value ? root : find(root.left, value) || find(root.right, value);
  }
  function nodes(head, pointer = 'next', value = 'val') {
    const out = [], seen = new Set();
    while (head) {
      if (seen.has(head)) throw new Error('Unexpected cycle in output');
      seen.add(head); out.push(head[value]); head = head[pointer];
    }
    return out;
  }
  function encodeTree(root) {
    if (!root) return [];
    const queue = [root], out = [], seen = new Set();
    for (let i = 0; i < queue.length; i++) {
      const node = queue[i];
      if (!node) { out.push(null); continue; }
      if (seen.has(node)) throw new Error('Unexpected cycle or shared node in output tree');
      seen.add(node); out.push(node.val); queue.push(node.left, node.right);
    }
    while (out.at(-1) === null) out.pop();
    return out;
  }
  function multi(values) {
    const dummy = {}, chain = []; let prev = dummy;
    for (const entry of values) {
      const node = { val: typeof entry === 'number' ? entry : entry.val, prev: prev === dummy ? null : prev, next: null, child: null };
      if (entry.child) node.child = multi(entry.child);
      prev.next = node; prev = node; chain.push(node);
    }
    return dummy.next || null;
  }
  let originals;
  for (let i = 0; i < (config.argTypes || []).length; i++) {
    const type = config.argTypes[i];
    if (type === 'tree') args[i] = tree(args[i]);
    if (type === 'list') args[i] = list(args[i]);
    if (type === 'knows') { const matrix = args[i]; args[i] = (a,b) => !!matrix[a][b]; }
    if (type === 'lists') args[i] = args[i].map(list);
    if (type === 'treeNode') args[i] = find(args[0], args[i]);
    if (type === 'multilevel') args[i] = multi(args[i]);
    if (type === 'randomList') {
      originals = args[i].map(([val]) => ({ val, next: null, random: null }));
      args[i].forEach(([, r], j) => { originals[j].next = originals[j + 1] || null; originals[j].random = r == null ? null : originals[r]; });
      args[i] = originals[0] || null;
    }
    if (type === 'bottomLists') {
      const heads = args[i].map(v => {
        let h = null; for (let j = v.length - 1; j >= 0; j--) h = { data: v[j], bottom: h, next: null }; return h;
      });
      heads.forEach((h,j) => { h.next = heads[j+1] || null; }); args[i] = heads[0] || null;
    }
    if (type === 'cycleList') {
      const [values, pos] = args[i]; const head = list(values), ns = []; let n = head;
      while (n) { ns.push(n); n = n.next; }
      if (pos >= 0) ns.at(-1).next = ns[pos]; args[i] = head;
    }
    if (type === 'intersectionLists') {
      const [a, b, shared] = args[i], tail = list(shared);
      function attach(v) { const h = list(v); if (!h) return tail; let n = h; while (n.next) n = n.next; n.next = tail; return h; }
      args.splice(i, 1, attach(a), attach(b));
    }
  }
  let result;
  if (config.mode === 'operations') {
    const [constructorArgs, operations] = args;
    const initial = constructorArgs.map((v,i) => config.constructorTypes?.[i] === 'tree' ? tree(v) : v);
    const instance = config.factory ? fn(...initial) : new fn(...initial);
    result = operations.map(([method, ...params]) => {
      const path = method.split('.'); let target = instance;
      for (const key of path.slice(0,-1)) target = target[key];
      const v = target[path.at(-1)](...params); return v === undefined ? null : v;
    });
  } else if (config.mode === 'iterator') {
    const instance = new fn(...args); result = [];
    while (instance.hasNext()) { if (result.length > 10000) throw new Error('Iterator did not finish'); result.push(instance.next()); }
  } else if (config.mode === 'deleteNode') {
    const head = args[0]; let node = head;
    for (let i = 0; i < args[1]; i++) node = node.next;
    fn(node); result = head;
  } else result = fn(...args);
  // In-place exercises are judged by the modified input, regardless of return value.
  if (config.resultArg !== undefined) result = args[config.resultArg];
  if (config.outputType === 'uniquePrefix') return { k: result, nums: args[0].slice(0,result) };
  if (config.outputType === 'tree') return encodeTree(result);
  if (config.outputType === 'trees') return result.map(encodeTree);
  if (config.outputType === 'list') return nodes(result);
  if (config.outputType === 'bottomList') return nodes(result, 'bottom', 'data');
  if (config.outputType === 'dll') {
    let previous = null, node = result;
    while (node) { if (node.left !== previous) throw new Error('Invalid backward link'); previous = node; node = node.right; }
    return nodes(result, 'right');
  }
  if (config.outputType === 'multilevel') {
    let previous = null, node = result;
    while (node) { if (node.prev !== previous || node.child) throw new Error('Invalid flattened links'); previous = node; node = node.next; }
    return nodes(result);
  }
  if (config.outputType === 'nodeValue') return result?.val ?? null;
  if (config.outputType === 'nodeValues') return result.map(n => n?.val ?? null);
  if (config.outputType === 'randomList') {
    const copied = []; let node = result;
    while (node) { if (copied.includes(node) || originals.includes(node)) throw new Error('Output must be an independent deep copy'); copied.push(node); node = node.next; }
    return copied.map(n => { const r = n.random == null ? null : copied.indexOf(n.random); if (r === -1) throw new Error('Random pointer escapes copy'); return [n.val, r]; });
  }
  if (config.outputType === 'nextLevels') {
    const levels = []; let left = result;
    while (left) { const level = [], seen = new Set(); let n = left; while (n) { if (seen.has(n)) throw new Error('Cycle in next pointers'); seen.add(n); level.push(n.val); n = n.next; } levels.push(level); left = left.left; }
    return levels;
  }
  return result;
}

export function compareProblemResult(actual, expected, args, config = {}) {
  if (config.validator === 'cryptarithm') {
    if (expected === null) return actual === null;
    if (!actual || typeof actual !== 'object') return false;
    const [words,result] = args, letters = new Set(words.join('')+result);
    const digits = [...letters].map(c=>actual[c]);
    if (digits.some(d=>!Number.isInteger(d)||d<0||d>9) || new Set(digits).size !== letters.size) return false;
    if ([...words,result].some(w=>actual[w[0]]===0)) return false;
    const number = w=>[...w].reduce((n,c)=>n*10n+BigInt(actual[c]),0n);
    return words.reduce((n,w)=>n+number(w),0n) === number(result);
  }
  if (config.validator === 'tug') {
    if (!actual || !Array.isArray(actual.bestSubset) || actual.bestSubset.length !== Math.floor(args[0].length/2)) return false;
    const remaining = args[0].slice();
    for (const v of actual.bestSubset) { const i=remaining.indexOf(v); if(i<0)return false; remaining.splice(i,1); }
    const diff = Math.abs(remaining.reduce((s,v)=>s+v,0)-actual.bestSubset.reduce((s,v)=>s+v,0));
    return diff === actual.minDiff && diff === expected.minDiff;
  }
  if (config.validator === 'cashFlow') {
    if (!Array.isArray(actual) || actual.length !== expected.length) return false;
    const graph = args[0], net = Array(graph.length).fill(0);
    graph.forEach((row,i)=>row.forEach((v,j)=>{net[i]-=v;net[j]+=v;}));
    for (const payment of actual) {
      if (!Array.isArray(payment)||payment.length!==3) return false;
      const [a,b,v]=payment;
      if (!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||a>=net.length||b>=net.length||a===b||!Number.isSafeInteger(v)||v<=0)return false;
      net[a]+=v;net[b]-=v;
    }
    return net.every(v=>v===0);
  }
  if (config.validator === 'zigzag') {
    if (!Array.isArray(actual) || actual.length !== args[0].length) return false;
    const a=actual.slice().sort((a,b)=>a-b), b=args[0].slice().sort((a,b)=>a-b);
    return a.every((v,i)=>v===b[i]) && actual.slice(1).every((v,i)=>i%2===0 ? actual[i]<=v : actual[i]>=v);
  }
  if (config.validator === 'balancedBST' || config.validator === 'prePost') {
    if (!Array.isArray(actual) || !actual.length) return false;
    const root = {val:actual[0]}, queue=[root]; let index=1;
    for(let i=0;i<queue.length&&index<actual.length;i++) for(const side of ['left','right']) {
      const v=actual[index++]; if(v!=null){queue[i][side]={val:v};queue.push(queue[i][side]);}
    }
    const pre=[],post=[],inorder=[];
    function traverse(n){if(!n)return 0;pre.push(n.val);const l=traverse(n.left);inorder.push(n.val);const r=traverse(n.right);post.push(n.val);return l<0||r<0||Math.abs(l-r)>1?-1:1+Math.max(l,r);}
    const height=traverse(root);
    const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
    return config.validator==='prePost' ? same(pre,args[0])&&same(post,args[1]) : height>=0&&same(inorder,args[0]);
  }
  if (config.validator === 'peak') {
    const nums = args[0]; return Number.isInteger(actual) && actual >= 0 && actual < nums.length && (actual === 0 || nums[actual] > nums[actual-1]) && (actual === nums.length-1 || nums[actual] > nums[actual+1]);
  }
  if (config.validator === 'twoSum') {
    return Array.isArray(actual) && actual.length === 2 && actual.every(i => Number.isInteger(i) && i >= 0 && i < args[0].length) && actual[0] !== actual[1] && args[0][actual[0]] + args[0][actual[1]] === args[1];
  }
  if (config.validator === 'topological') {
    const graph = args[1], order = actual;
    if (!Array.isArray(order) || order.length !== graph.length || new Set(order).size !== graph.length || order.some(x=>!Number.isInteger(x)||x<0||x>=graph.length)) return false;
    const pos = new Map(order.map((v,i)=>[v,i])); return graph.every((edges,u)=>edges.every(v=>pos.get(u)<pos.get(v)));
  }
  if (config.validator === 'alien') {
    if (expected === '') return actual === '';
    if (typeof actual !== 'string') return false;
    const words = args[0], chars = new Set(words.join(''));
    if (actual.length !== chars.size || new Set(actual).size !== chars.size || [...actual].some(c=>!chars.has(c))) return false;
    const pos = new Map([...actual].map((c,i)=>[c,i]));
    return words.slice(1).every((b,i)=> { const a = words[i]; let j = 0; while (j < a.length && j < b.length && a[j] === b[j]) j++; return j === Math.min(a.length,b.length) ? a.length <= b.length : pos.get(a[j]) < pos.get(b[j]); });
  }
  function equal(a,b) {
    if (typeof a === 'number' && typeof b === 'number') return Number.isFinite(a) && Math.abs(a-b) <= (config.tolerance || 0) * Math.max(1,Math.abs(b));
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v,i)=>equal(v,b[i]));
    if (a && b && typeof a === 'object' && typeof b === 'object') return Object.keys(a).length === Object.keys(b).length && Object.keys(b).every(k=>Object.hasOwn(a,k)&&equal(a[k],b[k]));
    return a === b;
  }
  function canonical(v, depth) {
    if (!Array.isArray(v)) return v;
    const out = v.map(x=>canonical(x,depth+1));
    if (depth === 0 && config.unordered || config.unorderedInner && depth === 1) out.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
    return out;
  }
  return equal(canonical(actual,0),canonical(expected,0));
}
