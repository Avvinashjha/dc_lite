#!/usr/bin/env node
/**
 * Generate descriptions, solutions, templateCode, and testCases for all problems.
 * This script contains the content data inline and writes directly to problem files.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS_DIR = path.join(__dirname, '..', 'content', 'problems');

// ─── CONTENT DATA ───────────────────────────────────────────────────────
// Each entry: slug → { description, solution, templateCode, testCases }
const CONTENT = {
"add-binary": {
description: `Given two binary strings \`a\` and \`b\`, return their sum as a binary string.

**Example 1:** Input: a = "11", b = "1" → Output: "100"
**Example 2:** Input: a = "1010", b = "1011" → Output: "10101"`,
solution: `## Bit-by-Bit Addition

Traverse both strings from right to left, adding corresponding digits along with any carry.

\`\`\`javascript
function addBinary(a, b) {
  let i = a.length - 1, j = b.length - 1, carry = 0, result = '';
  while (i >= 0 || j >= 0 || carry) {
    let sum = carry;
    if (i >= 0) sum += parseInt(a[i--]);
    if (j >= 0) sum += parseInt(b[j--]);
    result = (sum % 2) + result;
    carry = Math.floor(sum / 2);
  }
  return result;
}
\`\`\`

**Time:** O(max(m, n)) | **Space:** O(max(m, n))`,
templateCode: `/**\n * @param {string} a\n * @param {string} b\n * @return {string}\n */\nfunction addBinary(a, b) {\n  // Return sum of two binary strings\n}\n\n// Sample: console.log(addBinary("11", "1"));`,
testCases: [
  {args: ["11", "1"], expected: "100"},
  {args: ["1010", "1011"], expected: "10101"},
  {args: ["0", "0"], expected: "0"}
]},

"add-two-numbers": {
description: `You are given two non-empty linked lists representing two non-negative integers stored in reverse order. Each node contains a single digit. Add the two numbers and return the sum as a linked list.

**Example:** Input: l1 = [2,4,3], l2 = [5,6,4] → Output: [7,0,8] (342 + 465 = 807)`,
solution: `## Elementary Math with Carry

Traverse both lists simultaneously, summing digits with carry.

\`\`\`javascript
function addTwoNumbers(l1, l2) {
  let dummy = {val: 0, next: null}, curr = dummy, carry = 0;
  while (l1 || l2 || carry) {
    let sum = carry + (l1 ? l1.val : 0) + (l2 ? l2.val : 0);
    carry = Math.floor(sum / 10);
    curr.next = {val: sum % 10, next: null};
    curr = curr.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}
\`\`\`

**Time:** O(max(m, n)) | **Space:** O(max(m, n))`,
templateCode: `/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nfunction addTwoNumbers(l1, l2) {\n  // Add two numbers represented as linked lists\n}`,
testCases: [{args: [[2,4,3], [5,6,4]], expected: [7,0,8]}, {args: [[0], [0]], expected: [0]}]},

"add-two-numbers-ii": {
description: `Given two non-empty linked lists representing two non-negative integers where the most significant digit comes first, add them and return the sum as a linked list.

**Example:** Input: l1 = [7,2,4,3], l2 = [5,6,4] → Output: [7,8,0,7]`,
solution: `## Stack-Based Addition

Use stacks to reverse the digit order, then add with carry.

\`\`\`javascript
function addTwoNumbersII(l1, l2) {
  let s1 = [], s2 = [];
  while (l1) { s1.push(l1.val); l1 = l1.next; }
  while (l2) { s2.push(l2.val); l2 = l2.next; }
  let carry = 0, head = null;
  while (s1.length || s2.length || carry) {
    let sum = carry + (s1.pop() || 0) + (s2.pop() || 0);
    carry = Math.floor(sum / 10);
    let node = {val: sum % 10, next: head};
    head = node;
  }
  return head;
}
\`\`\`

**Time:** O(m + n) | **Space:** O(m + n)`,
templateCode: `/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nfunction addTwoNumbersII(l1, l2) {\n  // Add two numbers (MSB first)\n}`,
testCases: [{args: [[7,2,4,3], [5,6,4]], expected: [7,8,0,7]}]},

"alien-dictionary": {
description: `Given a sorted list of words from an alien language, derive the order of characters in that language. Return a string of characters in the correct order.

**Example:** Input: ["wrt","wrf","er","ett","rftt"] → Output: "wertf"`,
solution: `## Topological Sort

Build a directed graph from adjacent word comparisons, then perform topological sort.

\`\`\`javascript
function alienDictionary(words) {
  const graph = new Map(), inDeg = new Map();
  for (const w of words) for (const c of w) { graph.set(c, new Set()); inDeg.set(c, 0); }
  for (let i = 0; i < words.length - 1; i++) {
    const [a, b] = [words[i], words[i+1]];
    const minLen = Math.min(a.length, b.length);
    if (a.length > b.length && a.slice(0, minLen) === b.slice(0, minLen)) return "";
    for (let j = 0; j < minLen; j++) {
      if (a[j] !== b[j]) {
        if (!graph.get(a[j]).has(b[j])) { graph.get(a[j]).add(b[j]); inDeg.set(b[j], inDeg.get(b[j])+1); }
        break;
      }
    }
  }
  const q = [...inDeg.keys()].filter(c => inDeg.get(c) === 0), res = [];
  while (q.length) {
    const c = q.shift(); res.push(c);
    for (const n of graph.get(c)) { inDeg.set(n, inDeg.get(n)-1); if (inDeg.get(n)===0) q.push(n); }
  }
  return res.length === inDeg.size ? res.join('') : "";
}
\`\`\`

**Time:** O(C) where C = total chars | **Space:** O(U + min(U², N)) where U = unique chars`,
templateCode: `/**\n * @param {string[]} words\n * @return {string}\n */\nfunction alienDictionary(words) {\n  // Derive character order from sorted alien words\n}`,
testCases: [{args: [["wrt","wrf","er","ett","rftt"]], expected: "wertf"}, {args: [["z","x"]], expected: "zx"}]},

"all-nodes-distance-k-in-binary-tree": {
description: `Given a binary tree, a target node, and an integer K, return all nodes at distance K from the target.

**Example:** root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, K = 2 → Output: [7,4,1]`,
solution: `## BFS from Target with Parent Pointers

Build a parent map, then BFS from the target node K levels.

\`\`\`javascript
function distanceK(root, target, k) {
  const parents = new Map();
  function dfs(node, parent) {
    if (!node) return;
    parents.set(node, parent);
    dfs(node.left, node); dfs(node.right, node);
  }
  dfs(root, null);
  const visited = new Set(), q = [target];
  visited.add(target);
  let dist = 0;
  while (q.length && dist < k) {
    const size = q.length; dist++;
    for (let i = 0; i < size; i++) {
      const n = q.shift();
      for (const next of [n.left, n.right, parents.get(n)]) {
        if (next && !visited.has(next)) { visited.add(next); q.push(next); }
      }
    }
  }
  return q.map(n => n.val);
}
\`\`\`

**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {TreeNode} root\n * @param {TreeNode} target\n * @param {number} k\n * @return {number[]}\n */\nfunction distanceK(root, target, k) {\n  // Return all nodes at distance k from target\n}`,
testCases: []},

"allocate-minimum-pages-practice": {
description: `Given an array of N integers where arr[i] is the number of pages in the ith book, allocate books to M students such that the maximum pages assigned to any student is minimized. Each student gets at least one book, and books are contiguous.

**Example:** arr = [12, 34, 67, 90], M = 2 → Output: 113`,
solution: `## Binary Search on Answer

Binary search on the maximum pages. For each candidate, greedily check if M students can read all books.

\`\`\`javascript
function allocateMinimumPages(arr, m) {
  if (m > arr.length) return -1;
  let lo = Math.max(...arr), hi = arr.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let students = 1, pages = 0;
    for (const p of arr) {
      if (pages + p > mid) { students++; pages = p; }
      else pages += p;
    }
    if (students <= m) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
\`\`\`

**Time:** O(N log S) where S = sum of pages | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} arr\n * @param {number} m\n * @return {number}\n */\nfunction allocateMinimumPages(arr, m) {\n  // Minimize the maximum pages assigned\n}`,
testCases: [{args: [[12,34,67,90], 2], expected: 113}]},

"as-far-from-land-as-possible": {
description: `Given an N×N grid containing only 0s (water) and 1s (land), find the water cell with the maximum distance to the nearest land cell. Return that distance, or -1 if no water or no land exists.

**Example:** grid = [[1,0,1],[0,0,0],[1,0,1]] → Output: 2`,
solution: `## Multi-source BFS

Start BFS from all land cells simultaneously and expand outward.

\`\`\`javascript
function maxDistance(grid) {
  const n = grid.length, q = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (grid[i][j] === 1) q.push([i, j]);
  if (q.length === 0 || q.length === n * n) return -1;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  let dist = -1;
  while (q.length) {
    dist++;
    const size = q.length;
    for (let k = 0; k < size; k++) {
      const [r, c] = q.shift();
      for (const [dr, dc] of dirs) {
        const nr = r+dr, nc = c+dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
          grid[nr][nc] = 1; q.push([nr, nc]);
        }
      }
    }
  }
  return dist;
}
\`\`\`

**Time:** O(n²) | **Space:** O(n²)`,
templateCode: `/**\n * @param {number[][]} grid\n * @return {number}\n */\nfunction maxDistance(grid) {\n  // Find max distance from any water cell to nearest land\n}`,
testCases: [{args: [[[1,0,1],[0,0,0],[1,0,1]]], expected: 2}, {args: [[[1,0,0],[0,0,0],[0,0,0]]], expected: 4}]},

"backspace-string-compare": {
description: `Given two strings s and t, return true if they are equal when both are typed into empty text editors. '#' means a backspace character.

**Example:** s = "ab#c", t = "ad#c" → Output: true (both become "ac")`,
solution: `## Two Pointer from End

Process both strings from right to left, skipping characters after backspaces.

\`\`\`javascript
function backspaceCompare(s, t) {
  let i = s.length - 1, j = t.length - 1;
  while (i >= 0 || j >= 0) {
    let skip = 0;
    while (i >= 0 && (s[i] === '#' || skip > 0)) { skip += s[i] === '#' ? 1 : -1; i--; }
    skip = 0;
    while (j >= 0 && (t[j] === '#' || skip > 0)) { skip += t[j] === '#' ? 1 : -1; j--; }
    if (i >= 0 && j >= 0 && s[i] !== t[j]) return false;
    if ((i >= 0) !== (j >= 0)) return false;
    i--; j--;
  }
  return true;
}
\`\`\`

**Time:** O(m + n) | **Space:** O(1)`,
templateCode: `/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nfunction backspaceCompare(s, t) {\n  // Compare strings with backspace processing\n}\n\n// Sample: console.log(backspaceCompare("ab#c", "ad#c"));`,
testCases: [{args: ["ab#c", "ad#c"], expected: true}, {args: ["ab##", "c#d#"], expected: true}, {args: ["a#c", "b"], expected: false}]},

"balanced-binary-tree": {
description: `Given a binary tree, determine if it is height-balanced. A balanced tree is one where the depth of the two subtrees of every node never differs by more than one.

**Example:** root = [3,9,20,null,null,15,7] → Output: true`,
solution: `## Bottom-Up DFS

Return height of each subtree, returning -1 if unbalanced.

\`\`\`javascript
function isBalanced(root) {
  function height(node) {
    if (!node) return 0;
    const l = height(node.left), r = height(node.right);
    if (l === -1 || r === -1 || Math.abs(l - r) > 1) return -1;
    return Math.max(l, r) + 1;
  }
  return height(root) !== -1;
}
\`\`\`

**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {boolean}\n */\nfunction isBalanced(root) {\n  // Check if binary tree is height-balanced\n}`,
testCases: []},

"best-time-to-buy-and-sell-stock-iv": {
description: `You are given an array of prices and an integer k. Find the maximum profit you can achieve with at most k transactions. You may not engage in multiple transactions simultaneously.

**Example:** k = 2, prices = [2,4,1] → Output: 2`,
solution: `## DP with State Machine

Use dp[t][0/1] to track max profit after t transactions with/without stock.

\`\`\`javascript
function maxProfit(k, prices) {
  const n = prices.length;
  if (k >= n / 2) {
    let profit = 0;
    for (let i = 1; i < n; i++) profit += Math.max(0, prices[i] - prices[i-1]);
    return profit;
  }
  const dp = Array.from({length: k+1}, () => [-Infinity, -Infinity]);
  dp[0][0] = 0;
  for (const p of prices) {
    for (let t = k; t >= 1; t--) {
      dp[t][0] = Math.max(dp[t][0], dp[t][1] + p);
      dp[t][1] = Math.max(dp[t][1], dp[t-1][0] - p);
    }
  }
  return Math.max(...dp.map(d => d[0]));
}
\`\`\`

**Time:** O(nk) | **Space:** O(k)`,
templateCode: `/**\n * @param {number} k\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(k, prices) {\n  // Max profit with at most k transactions\n}`,
testCases: [{args: [2, [2,4,1]], expected: 2}, {args: [2, [3,2,6,5,0,3]], expected: 7}]},

"bfs-of-graph-practice": {
description: `Given a directed graph represented as an adjacency list, return the BFS traversal starting from node 0.

**Example:** adj = [[1,2],[3],[4],[],[]] → Output: [0,1,2,3,4]`,
solution: `## Standard BFS

Use a queue and visited set to traverse level by level.

\`\`\`javascript
function bfsOfGraph(adj) {
  const visited = new Set([0]), q = [0], result = [];
  while (q.length) {
    const node = q.shift();
    result.push(node);
    for (const next of adj[node]) {
      if (!visited.has(next)) { visited.add(next); q.push(next); }
    }
  }
  return result;
}
\`\`\`

**Time:** O(V + E) | **Space:** O(V)`,
templateCode: `/**\n * @param {number[][]} adj\n * @return {number[]}\n */\nfunction bfsOfGraph(adj) {\n  // BFS traversal from node 0\n}`,
testCases: [{args: [[[1,2],[3],[4],[],[]]], expected: [0,1,2,3,4]}]},

"binary-search-tree-iterator": {
description: `Implement a BST iterator that supports \`next()\` (returns next smallest element) and \`hasNext()\` operations, both running in average O(1) time with O(h) memory.

**Example:** BST = [7,3,15,null,null,9,20] → next() calls return: 3, 7, 9, 15, 20`,
solution: `## Controlled Inorder with Stack

Maintain a stack of left-spine nodes. On \`next()\`, pop and push right subtree's left spine.

\`\`\`javascript
class BSTIterator {
  constructor(root) {
    this.stack = [];
    this._pushLeft(root);
  }
  _pushLeft(node) {
    while (node) { this.stack.push(node); node = node.left; }
  }
  next() {
    const node = this.stack.pop();
    this._pushLeft(node.right);
    return node.val;
  }
  hasNext() { return this.stack.length > 0; }
}
\`\`\`

**Time:** O(1) amortized | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n */\nfunction BSTIterator(root) {\n  // Initialize BST iterator\n}\nBSTIterator.prototype.next = function() {};\nBSTIterator.prototype.hasNext = function() {};`,
testCases: []},

"binary-tree-cameras": {
description: `Given a binary tree, install cameras on nodes so that every node is monitored. A camera at a node monitors its parent, itself, and children. Return the minimum number of cameras needed.

**Example:** root = [0,0,null,0,0] → Output: 1`,
solution: `## Greedy DFS (Bottom-Up)

Each node has 3 states: 0 = needs camera, 1 = has camera, 2 = covered. Greedily place cameras at parents of uncovered leaves.

\`\`\`javascript
function minCameraCover(root) {
  let cameras = 0;
  function dfs(node) {
    if (!node) return 2;
    const l = dfs(node.left), r = dfs(node.right);
    if (l === 0 || r === 0) { cameras++; return 1; }
    if (l === 1 || r === 1) return 2;
    return 0;
  }
  if (dfs(root) === 0) cameras++;
  return cameras;
}
\`\`\`

**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number}\n */\nfunction minCameraCover(root) {\n  // Minimum cameras to monitor all nodes\n}`,
testCases: []},

"binary-tree-level-order-traversal": {
description: `Given a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).

**Example:** root = [3,9,20,null,null,15,7] → Output: [[3],[9,20],[15,7]]`,
solution: `## BFS with Queue

Process nodes level by level using a queue.

\`\`\`javascript
function levelOrder(root) {
  if (!root) return [];
  const result = [], q = [root];
  while (q.length) {
    const level = [], size = q.length;
    for (let i = 0; i < size; i++) {
      const node = q.shift();
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    result.push(level);
  }
  return result;
}
\`\`\`

**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number[][]}\n */\nfunction levelOrder(root) {\n  // Level order traversal\n}`,
testCases: []},

"binary-tree-maximum-path-sum": {
description: `Given a binary tree, find the maximum path sum. A path is any sequence of nodes connected by edges where each node appears at most once. The path does not need to pass through the root.

**Example:** root = [-10,9,20,null,null,15,7] → Output: 42 (15→20→7)`,
solution: `## DFS with Global Max

For each node, compute the max single-path sum through it and update global max.

\`\`\`javascript
function maxPathSum(root) {
  let max = -Infinity;
  function dfs(node) {
    if (!node) return 0;
    const l = Math.max(0, dfs(node.left));
    const r = Math.max(0, dfs(node.right));
    max = Math.max(max, l + r + node.val);
    return Math.max(l, r) + node.val;
  }
  dfs(root);
  return max;
}
\`\`\`

**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number}\n */\nfunction maxPathSum(root) {\n  // Find maximum path sum in binary tree\n}`,
testCases: []},

"binary-tree-paths": {
description: `Given the root of a binary tree, return all root-to-leaf paths in any order.

**Example:** root = [1,2,3,null,5] → Output: ["1->2->5", "1->3"]`,
solution: `## DFS with Path Tracking

\`\`\`javascript
function binaryTreePaths(root) {
  const result = [];
  function dfs(node, path) {
    if (!node) return;
    path += node.val;
    if (!node.left && !node.right) { result.push(path); return; }
    dfs(node.left, path + '->');
    dfs(node.right, path + '->');
  }
  dfs(root, '');
  return result;
}
\`\`\`

**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {string[]}\n */\nfunction binaryTreePaths(root) {\n  // Return all root-to-leaf paths\n}`,
testCases: []},

"binary-tree-right-side-view": {
description: `Given a binary tree, return the values of the nodes you can see ordered from top to bottom when looking at the tree from the right side.

**Example:** root = [1,2,3,null,5,null,4] → Output: [1,3,4]`,
solution: `## BFS Level Order (Last of Each Level)

\`\`\`javascript
function rightSideView(root) {
  if (!root) return [];
  const result = [], q = [root];
  while (q.length) {
    const size = q.length;
    for (let i = 0; i < size; i++) {
      const node = q.shift();
      if (i === size - 1) result.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
  }
  return result;
}
\`\`\`

**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number[]}\n */\nfunction rightSideView(root) {\n  // Return right side view of binary tree\n}`,
testCases: []},

"binary-tree-zigzag-level-order-traversal": {
description: `Given a binary tree, return the zigzag level order traversal (left to right, then right to left for the next level, alternating).

**Example:** root = [3,9,20,null,null,15,7] → Output: [[3],[20,9],[15,7]]`,
solution: `## BFS with Direction Flag

\`\`\`javascript
function zigzagLevelOrder(root) {
  if (!root) return [];
  const result = [], q = [root];
  let leftToRight = true;
  while (q.length) {
    const level = [], size = q.length;
    for (let i = 0; i < size; i++) {
      const node = q.shift();
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    result.push(leftToRight ? level : level.reverse());
    leftToRight = !leftToRight;
  }
  return result;
}
\`\`\`

**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number[][]}\n */\nfunction zigzagLevelOrder(root) {\n  // Zigzag level order traversal\n}`,
testCases: []},

"boyer-moore-algorithm-for-pattern-searching": {
description: `Implement the Boyer-Moore pattern searching algorithm. Given a text and a pattern, find all occurrences of the pattern in the text.

**Example:** text = "ABAAABCD", pattern = "ABC" → Output: [4]`,
solution: `## Boyer-Moore Bad Character Heuristic

Precompute bad character table to skip alignments.

\`\`\`javascript
function boyerMoore(text, pattern) {
  const m = pattern.length, n = text.length, result = [];
  const badChar = {};
  for (let i = 0; i < m; i++) badChar[pattern[i]] = i;
  let s = 0;
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && pattern[j] === text[s + j]) j--;
    if (j < 0) { result.push(s); s += (s + m < n) ? m - (badChar[text[s+m]] ?? -1) : 1; }
    else s += Math.max(1, j - (badChar[text[s+j]] ?? -1));
  }
  return result;
}
\`\`\`

**Time:** O(n/m) best, O(nm) worst | **Space:** O(alphabet size)`,
templateCode: `/**\n * @param {string} text\n * @param {string} pattern\n * @return {number[]}\n */\nfunction boyerMoore(text, pattern) {\n  // Find all occurrences of pattern in text\n}`,
testCases: [{args: ["ABAAABCD", "ABC"], expected: [4]}]},

"bst-with-dead-end-practice": {
description: `Given a BST containing only positive integers, check whether it has a dead end — a leaf node where no new element can be inserted.

**Example:** BST with nodes {8, 5, 2, 7, 11, 1, 3} → true (node 1 is dead end: can't insert 0 or 2)`,
solution: `## DFS with Range Tracking

Track valid range [low, high] for each node. A leaf is a dead end if low == high.

\`\`\`javascript
function isDeadEnd(root) {
  function dfs(node, lo, hi) {
    if (!node) return false;
    if (lo === hi) return true;
    return dfs(node.left, lo, node.val - 1) || dfs(node.right, node.val + 1, hi);
  }
  return dfs(root, 1, Infinity);
}
\`\`\`

**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {boolean}\n */\nfunction isDeadEnd(root) {\n  // Check if BST has a dead end\n}`,
testCases: []},

"burst-balloons": {
description: `Given n balloons with numbers on them, burst them to maximize coins. When you burst balloon i, you get nums[i-1] * nums[i] * nums[i+1] coins.

**Example:** nums = [3,1,5,8] → Output: 167`,
solution: `## Interval DP

dp[i][j] = max coins from bursting all balloons between i and j.

\`\`\`javascript
function maxCoins(nums) {
  const a = [1, ...nums, 1], n = a.length;
  const dp = Array.from({length: n}, () => Array(n).fill(0));
  for (let len = 2; len < n; len++) {
    for (let i = 0; i + len < n; i++) {
      const j = i + len;
      for (let k = i + 1; k < j; k++) {
        dp[i][j] = Math.max(dp[i][j], dp[i][k] + dp[k][j] + a[i]*a[k]*a[j]);
      }
    }
  }
  return dp[0][n-1];
}
\`\`\`

**Time:** O(n³) | **Space:** O(n²)`,
templateCode: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxCoins(nums) {\n  // Maximum coins from bursting balloons\n}`,
testCases: [{args: [[3,1,5,8]], expected: 167}, {args: [[1,5]], expected: 10}]},

"ceiling-in-a-sorted-array": {
description: `Given a sorted array and a value x, find the ceiling of x — the smallest element >= x.

**Example:** arr = [1, 2, 8, 10, 10, 12, 19], x = 5 → Output: 8`,
solution: `## Binary Search

\`\`\`javascript
function ceiling(arr, x) {
  let lo = 0, hi = arr.length - 1, result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] >= x) { result = arr[mid]; hi = mid - 1; }
    else lo = mid + 1;
  }
  return result;
}
\`\`\`

**Time:** O(log n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} arr\n * @param {number} x\n * @return {number}\n */\nfunction ceiling(arr, x) {\n  // Find smallest element >= x\n}`,
testCases: [{args: [[1,2,8,10,10,12,19], 5], expected: 8}, {args: [[1,2,8,10], 0], expected: 1}]},

"cheapest-flights-within-k-stops": {
description: `Find the cheapest price from source to destination with at most k stops in a flight network with n cities.

**Example:** n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1 → Output: 700`,
solution: `## Bellman-Ford (K+1 iterations)

Relax edges K+1 times to find shortest path with at most K stops.

\`\`\`javascript
function findCheapestPrice(n, flights, src, dst, k) {
  let prices = Array(n).fill(Infinity);
  prices[src] = 0;
  for (let i = 0; i <= k; i++) {
    const temp = [...prices];
    for (const [u, v, w] of flights) {
      if (prices[u] !== Infinity) temp[v] = Math.min(temp[v], prices[u] + w);
    }
    prices = temp;
  }
  return prices[dst] === Infinity ? -1 : prices[dst];
}
\`\`\`

**Time:** O(k * E) | **Space:** O(n)`,
templateCode: `/**\n * @param {number} n\n * @param {number[][]} flights\n * @param {number} src\n * @param {number} dst\n * @param {number} k\n * @return {number}\n */\nfunction findCheapestPrice(n, flights, src, dst, k) {\n  // Cheapest flight with at most k stops\n}`,
testCases: [{args: [4, [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 0, 3, 1], expected: 700}]},

"check-if-it-is-possible-to-finish-all-task-from-given-dependencies-course-schedule-i": {
description: `Given numCourses and prerequisite pairs, determine if it is possible to finish all courses (i.e., detect if the dependency graph has a cycle).

**Example:** numCourses = 2, prerequisites = [[1,0]] → Output: true`,
solution: `## Topological Sort (Kahn's Algorithm)

If we can process all courses via BFS topological sort, there's no cycle.

\`\`\`javascript
function canFinish(numCourses, prerequisites) {
  const graph = Array.from({length: numCourses}, () => []);
  const inDeg = Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) { graph[b].push(a); inDeg[a]++; }
  const q = [];
  for (let i = 0; i < numCourses; i++) if (inDeg[i] === 0) q.push(i);
  let count = 0;
  while (q.length) {
    const node = q.shift(); count++;
    for (const next of graph[node]) { if (--inDeg[next] === 0) q.push(next); }
  }
  return count === numCourses;
}
\`\`\`

**Time:** O(V + E) | **Space:** O(V + E)`,
templateCode: `/**\n * @param {number} numCourses\n * @param {number[][]} prerequisites\n * @return {boolean}\n */\nfunction canFinish(numCourses, prerequisites) {\n  // Check if all courses can be finished\n}`,
testCases: [{args: [2, [[1,0]]], expected: true}, {args: [2, [[1,0],[0,1]]], expected: false}]},

"check-if-reversing-a-sub-array-make-the-array-sorted": {
description: `Given an array, check if it can be sorted by reversing exactly one subarray.

**Example:** arr = [1, 2, 5, 4, 3] → Output: true (reverse subarray [5,4,3])`,
solution: `## Find Unsorted Window

Find the first and last position where the array deviates, check if reversing makes it sorted.

\`\`\`javascript
function canSortByReversing(arr) {
  const n = arr.length;
  let i = 0;
  while (i < n - 1 && arr[i] <= arr[i+1]) i++;
  if (i === n - 1) return true;
  let j = n - 1;
  while (j > 0 && arr[j] >= arr[j-1]) j--;
  const reversed = [...arr.slice(0, i), ...arr.slice(i, j+1).reverse(), ...arr.slice(j+1)];
  for (let k = 0; k < n - 1; k++) if (reversed[k] > reversed[k+1]) return false;
  return true;
}
\`\`\`

**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {number[]} arr\n * @return {boolean}\n */\nfunction canSortByReversing(arr) {\n  // Check if array can be sorted by reversing one subarray\n}`,
testCases: [{args: [[1,2,5,4,3]], expected: true}, {args: [[1,2,3,4]], expected: true}]},

"check-whether-a-given-graph-is-bipartite-or-not": {
description: `Given a graph, determine whether it is bipartite — can nodes be colored with 2 colors such that no two adjacent nodes share a color?

**Example:** graph = [[1,3],[0,2],[1,3],[0,2]] → Output: true`,
solution: `## BFS Coloring

Try 2-coloring the graph with BFS. If any conflict is found, it's not bipartite.

\`\`\`javascript
function isBipartite(graph) {
  const n = graph.length, color = Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    if (color[i] !== -1) continue;
    color[i] = 0;
    const q = [i];
    while (q.length) {
      const u = q.shift();
      for (const v of graph[u]) {
        if (color[v] === -1) { color[v] = 1 - color[u]; q.push(v); }
        else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}
\`\`\`

**Time:** O(V + E) | **Space:** O(V)`,
templateCode: `/**\n * @param {number[][]} graph\n * @return {boolean}\n */\nfunction isBipartite(graph) {\n  // Check if graph is bipartite\n}`,
testCases: [{args: [[[1,3],[0,2],[1,3],[0,2]]], expected: true}, {args: [[[1,2,3],[0,2],[0,1,3],[0,2]]], expected: false}]},

"climbing-stairs": {
description: `You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top?

**Example:** n = 3 → Output: 3 (1+1+1, 1+2, 2+1)`,
solution: `## Dynamic Programming (Fibonacci)

\`\`\`javascript
function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
\`\`\`

**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number} n\n * @return {number}\n */\nfunction climbStairs(n) {\n  // Count distinct ways to climb n stairs\n}\n\n// Sample: console.log(climbStairs(3));`,
testCases: [{args: [2], expected: 2}, {args: [3], expected: 3}, {args: [5], expected: 8}]},

"coin-change": {
description: `Given coins of different denominations and a total amount, return the fewest coins needed to make up that amount. Return -1 if not possible.

**Example:** coins = [1,2,5], amount = 11 → Output: 3 (5+5+1)`,
solution: `## Bottom-Up DP

dp[i] = minimum coins for amount i.

\`\`\`javascript
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}
\`\`\`

**Time:** O(amount × coins) | **Space:** O(amount)`,
templateCode: `/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nfunction coinChange(coins, amount) {\n  // Minimum coins to make amount\n}\n\n// Sample: console.log(coinChange([1,2,5], 11));`,
testCases: [{args: [[1,2,5], 11], expected: 3}, {args: [[2], 3], expected: -1}, {args: [[1], 0], expected: 0}]},

"construct-binary-tree-from-preorder-and-postorder-traversal": {
description: `Given preorder and postorder traversal arrays of a binary tree with distinct values, reconstruct the tree.

**Example:** preorder = [1,2,4,5,3,6,7], postorder = [4,5,2,6,7,3,1] → Output: [1,2,3,4,5,6,7]`,
solution: `## Recursive Construction

The first element of preorder is root, the second is the left subtree root. Find it in postorder to determine left subtree size.

\`\`\`javascript
function constructFromPrePost(preorder, postorder) {
  let preIdx = 0;
  const postMap = new Map();
  postorder.forEach((v, i) => postMap.set(v, i));
  function build(postLo, postHi) {
    if (postLo > postHi || preIdx >= preorder.length) return null;
    const node = { val: preorder[preIdx++], left: null, right: null };
    if (postLo === postHi) return node;
    const leftRootIdx = postMap.get(preorder[preIdx]);
    node.left = build(postLo, leftRootIdx);
    node.right = build(leftRootIdx + 1, postHi - 1);
    return node;
  }
  return build(0, postorder.length - 1);
}
\`\`\`

**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {number[]} preorder\n * @param {number[]} postorder\n * @return {TreeNode}\n */\nfunction constructFromPrePost(preorder, postorder) {\n  // Reconstruct tree from preorder and postorder\n}`,
testCases: []},

"construct-bst-from-preorder-traversal": {
description: `Given a preorder traversal of a BST, construct the BST.

**Example:** preorder = [8,5,1,7,10,12] → Output: BST with root 8`,
solution: `## Recursive with Bound

Use an upper bound to determine when to stop building the left subtree.

\`\`\`javascript
function bstFromPreorder(preorder) {
  let i = 0;
  function build(bound) {
    if (i >= preorder.length || preorder[i] > bound) return null;
    const node = { val: preorder[i++], left: null, right: null };
    node.left = build(node.val);
    node.right = build(bound);
    return node;
  }
  return build(Infinity);
}
\`\`\`

**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {number[]} preorder\n * @return {TreeNode}\n */\nfunction bstFromPreorder(preorder) {\n  // Build BST from preorder traversal\n}`,
testCases: []},

"convert-binary-number-in-a-linked-list-to-integer": {
description: `Given head of a singly linked list where each node contains 0 or 1, return the decimal value of the binary number.

**Example:** head = [1,0,1] → Output: 5`,
solution: `## Bit Shift Traversal

\`\`\`javascript
function getDecimalValue(head) {
  let num = 0;
  while (head) { num = num * 2 + head.val; head = head.next; }
  return num;
}
\`\`\`

**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @return {number}\n */\nfunction getDecimalValue(head) {\n  // Convert binary linked list to integer\n}`,
testCases: [{args: [[1,0,1]], expected: 5}, {args: [[0]], expected: 0}]},

"convert-sorted-array-to-binary-search-tree": {
description: `Given a sorted array, convert it to a height-balanced BST.

**Example:** nums = [-10,-3,0,5,9] → Output: [0,-3,9,-10,null,5]`,
solution: `## Recursive Mid-Point

Pick the middle element as root, recurse on left and right halves.

\`\`\`javascript
function sortedArrayToBST(nums) {
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    return { val: nums[mid], left: build(lo, mid-1), right: build(mid+1, hi) };
  }
  return build(0, nums.length - 1);
}
\`\`\`

**Time:** O(n) | **Space:** O(log n)`,
templateCode: `/**\n * @param {number[]} nums\n * @return {TreeNode}\n */\nfunction sortedArrayToBST(nums) {\n  // Convert sorted array to balanced BST\n}`,
testCases: []},

"copy-list-with-random-pointer": {
description: `Given a linked list where each node has an additional random pointer that could point to any node or null, create a deep copy of the list.

**Example:** head = [[7,null],[13,0],[11,4],[10,2],[1,0]] → Deep copy with same structure`,
solution: `## Interleave + Separate

Insert cloned nodes after originals, set random pointers, then separate.

\`\`\`javascript
function copyRandomList(head) {
  if (!head) return null;
  let curr = head;
  while (curr) {
    const clone = {val: curr.val, next: curr.next, random: null};
    curr.next = clone; curr = clone.next;
  }
  curr = head;
  while (curr) { if (curr.random) curr.next.random = curr.random.next; curr = curr.next.next; }
  const dummy = {next: null}; let tail = dummy; curr = head;
  while (curr) {
    tail.next = curr.next; tail = tail.next;
    curr.next = curr.next.next; curr = curr.next;
  }
  return dummy.next;
}
\`\`\`

**Time:** O(n) | **Space:** O(1) extra`,
templateCode: `/**\n * @param {Node} head\n * @return {Node}\n */\nfunction copyRandomList(head) {\n  // Deep copy linked list with random pointers\n}`,
testCases: []},

"count-bst-nodes-that-lie-in-a-given-range-practice": {
description: `Given a BST and a range [l, h], count all nodes with values in the range [l, h] inclusive.

**Example:** BST = [10,5,50,1,null,40,100], l=5, h=45 → Output: 3 (nodes 5, 10, 40)`,
solution: `## Pruned Inorder DFS

\`\`\`javascript
function countInRange(root, l, h) {
  if (!root) return 0;
  if (root.val < l) return countInRange(root.right, l, h);
  if (root.val > h) return countInRange(root.left, l, h);
  return 1 + countInRange(root.left, l, h) + countInRange(root.right, l, h);
}
\`\`\`

**Time:** O(h + k) where k = nodes in range | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @param {number} l\n * @param {number} h\n * @return {number}\n */\nfunction countInRange(root, l, h) {\n  // Count BST nodes in range [l, h]\n}`,
testCases: []},

"count-different-palindromic-subsequences": {
description: `Given a string s consisting of characters 'a', 'b', 'c', 'd', count the number of different non-empty palindromic subsequences. Return result mod 10^9 + 7.

**Example:** s = "bccb" → Output: 6 ("b","c","bb","bc","cb","bccb")`,
solution: `## Interval DP

dp[i][j] = count of unique palindromic subsequences in s[i..j].

\`\`\`javascript
function countPalindromicSubsequences(s) {
  const MOD = 1e9 + 7, n = s.length;
  const dp = Array.from({length: n}, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) {
        let lo = i + 1, hi = j - 1;
        while (lo <= hi && s[lo] !== s[i]) lo++;
        while (lo <= hi && s[hi] !== s[i]) hi--;
        if (lo > hi) dp[i][j] = dp[i+1][j-1] * 2 + 2;
        else if (lo === hi) dp[i][j] = dp[i+1][j-1] * 2 + 1;
        else dp[i][j] = dp[i+1][j-1] * 2 - dp[lo+1][hi-1];
      } else {
        dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1];
      }
      dp[i][j] = ((dp[i][j] % MOD) + MOD) % MOD;
    }
  }
  return dp[0][n-1];
}
\`\`\`

**Time:** O(n²) | **Space:** O(n²)`,
templateCode: `/**\n * @param {string} s\n * @return {number}\n */\nfunction countPalindromicSubsequences(s) {\n  // Count unique palindromic subsequences\n}`,
testCases: [{args: ["bccb"], expected: 6}]},

"count-of-smaller-numbers-after-self": {
description: `Given an integer array nums, return an array counts where counts[i] is the number of smaller elements to the right of nums[i].

**Example:** nums = [5,2,6,1] → Output: [2,1,1,0]`,
solution: `## Merge Sort with Index Tracking

Count inversions during merge sort by tracking original indices.

\`\`\`javascript
function countSmaller(nums) {
  const n = nums.length, counts = Array(n).fill(0);
  const indices = nums.map((_, i) => i);
  function mergeSort(lo, hi) {
    if (hi - lo <= 1) return;
    const mid = (lo + hi) >> 1;
    mergeSort(lo, mid); mergeSort(mid, hi);
    const temp = [];
    let i = lo, j = mid;
    while (i < mid && j < hi) {
      if (nums[indices[i]] > nums[indices[j]]) { counts[indices[i]] += hi - j; temp.push(indices[i++]); }
      else temp.push(indices[j++]);
    }
    while (i < mid) temp.push(indices[i++]);
    while (j < hi) temp.push(indices[j++]);
    for (let k = lo; k < hi; k++) indices[k] = temp[k - lo];
  }
  mergeSort(0, n);
  return counts;
}
\`\`\`

**Time:** O(n log n) | **Space:** O(n)`,
templateCode: `/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction countSmaller(nums) {\n  // Count smaller elements to the right\n}`,
testCases: [{args: [[5,2,6,1]], expected: [2,1,1,0]}]},

"count-square-submatrices-with-all-ones": {
description: `Given a m×n binary matrix, return the total number of square submatrices that contain all ones.

**Example:** matrix = [[0,1,1,1],[1,1,1,1],[0,1,1,1]] → Output: 15`,
solution: `## DP

dp[i][j] = largest square ending at (i,j). Sum all dp values.

\`\`\`javascript
function countSquares(matrix) {
  const m = matrix.length, n = matrix[0].length;
  let count = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] && i > 0 && j > 0) {
        matrix[i][j] = Math.min(matrix[i-1][j], matrix[i][j-1], matrix[i-1][j-1]) + 1;
      }
      count += matrix[i][j];
    }
  }
  return count;
}
\`\`\`

**Time:** O(mn) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[][]} matrix\n * @return {number}\n */\nfunction countSquares(matrix) {\n  // Count square submatrices with all 1s\n}`,
testCases: [{args: [[[0,1,1,1],[1,1,1,1],[0,1,1,1]]], expected: 15}]},

"counting-bits": {
description: `Given an integer n, return an array ans of length n+1 where ans[i] is the number of 1-bits in i.

**Example:** n = 5 → Output: [0,1,1,2,1,2]`,
solution: `## DP with Bit Trick

ans[i] = ans[i >> 1] + (i & 1).

\`\`\`javascript
function countBits(n) {
  const ans = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
  return ans;
}
\`\`\`

**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {number} n\n * @return {number[]}\n */\nfunction countBits(n) {\n  // Return array of bit counts 0..n\n}\n\n// Sample: console.log(countBits(5));`,
testCases: [{args: [2], expected: [0,1,1]}, {args: [5], expected: [0,1,1,2,1,2]}]},

"critical-connections-in-a-network": {
description: `Given n servers and connections between them, find all critical connections (bridges) whose removal would disconnect some servers.

**Example:** n=4, connections=[[0,1],[1,2],[2,0],[1,3]] → Output: [[1,3]]`,
solution: `## Tarjan's Bridge Algorithm

Track discovery time and lowest reachable ancestor for each node.

\`\`\`javascript
function criticalConnections(n, connections) {
  const graph = Array.from({length: n}, () => []);
  for (const [u, v] of connections) { graph[u].push(v); graph[v].push(u); }
  const disc = Array(n).fill(-1), low = Array(n).fill(0), result = [];
  let timer = 0;
  function dfs(u, parent) {
    disc[u] = low[u] = timer++;
    for (const v of graph[u]) {
      if (v === parent) continue;
      if (disc[v] === -1) {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) result.push([u, v]);
      } else low[u] = Math.min(low[u], disc[v]);
    }
  }
  dfs(0, -1);
  return result;
}
\`\`\`

**Time:** O(V + E) | **Space:** O(V + E)`,
templateCode: `/**\n * @param {number} n\n * @param {number[][]} connections\n * @return {number[][]}\n */\nfunction criticalConnections(n, connections) {\n  // Find all bridges in the network\n}`,
testCases: [{args: [4, [[0,1],[1,2],[2,0],[1,3]]], expected: [[1,3]]}]},

"daily-temperatures": {
description: `Given an array of daily temperatures, return an array where answer[i] is the number of days you have to wait after day i to get a warmer temperature. If no future day is warmer, answer[i] = 0.

**Example:** temperatures = [73,74,75,71,69,72,76,73] → Output: [1,1,4,2,1,1,0,0]`,
solution: `## Monotonic Stack

Maintain a decreasing stack of indices.

\`\`\`javascript
function dailyTemperatures(temperatures) {
  const n = temperatures.length, ans = Array(n).fill(0), stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length-1]]) {
      const j = stack.pop(); ans[j] = i - j;
    }
    stack.push(i);
  }
  return ans;
}
\`\`\`

**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures(temperatures) {\n  // Days until warmer temperature\n}`,
testCases: [{args: [[73,74,75,71,69,72,76,73]], expected: [1,1,4,2,1,1,0,0]}]},

"decode-string": {
description: `Given an encoded string like "3[a2[c]]", decode it. The encoding rule is: k[encoded_string] means the encoded_string is repeated k times.

**Example:** s = "3[a2[c]]" → Output: "accaccacc"`,
solution: `## Stack-Based Parsing

Use stacks to track multiplier and current string at each nesting level.

\`\`\`javascript
function decodeString(s) {
  const numStack = [], strStack = [];
  let curr = '', num = 0;
  for (const c of s) {
    if (c >= '0' && c <= '9') num = num * 10 + (c - '0');
    else if (c === '[') { numStack.push(num); strStack.push(curr); num = 0; curr = ''; }
    else if (c === ']') { curr = strStack.pop() + curr.repeat(numStack.pop()); }
    else curr += c;
  }
  return curr;
}
\`\`\`

**Time:** O(output length) | **Space:** O(output length)`,
templateCode: `/**\n * @param {string} s\n * @return {string}\n */\nfunction decodeString(s) {\n  // Decode the encoded string\n}\n\n// Sample: console.log(decodeString("3[a2[c]]"));`,
testCases: [{args: ["3[a]2[bc]"], expected: "aaabcbc"}, {args: ["3[a2[c]]"], expected: "accaccacc"}]},

"decode-ways": {
description: `A message of digits can be decoded to letters (1=A, 2=B, ..., 26=Z). Given a string s of digits, return the number of ways to decode it.

**Example:** s = "226" → Output: 3 ("BZ", "VF", "BBF")`,
solution: `## DP

\`\`\`javascript
function numDecodings(s) {
  if (s[0] === '0') return 0;
  const n = s.length;
  let prev2 = 1, prev1 = 1;
  for (let i = 1; i < n; i++) {
    let curr = 0;
    if (s[i] !== '0') curr += prev1;
    const two = parseInt(s.slice(i-1, i+1));
    if (two >= 10 && two <= 26) curr += prev2;
    prev2 = prev1; prev1 = curr;
  }
  return prev1;
}
\`\`\`

**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {string} s\n * @return {number}\n */\nfunction numDecodings(s) {\n  // Count decoding ways\n}`,
testCases: [{args: ["12"], expected: 2}, {args: ["226"], expected: 3}, {args: ["06"], expected: 0}]},

"delete-and-earn": {
description: `Given an array of integers, you can pick any element to earn its value, but you must also delete all elements equal to value-1 and value+1. Return the maximum points.

**Example:** nums = [3,4,2] → Output: 6 (delete 4, earn 3+3=6... wait, pick 2 and 3)`,
solution: `## House Robber on Frequency Array

Transform to a frequency-weighted array and solve like House Robber.

\`\`\`javascript
function deleteAndEarn(nums) {
  const max = Math.max(...nums);
  const sums = Array(max + 1).fill(0);
  for (const n of nums) sums[n] += n;
  let prev = 0, curr = 0;
  for (let i = 0; i <= max; i++) [prev, curr] = [curr, Math.max(curr, prev + sums[i])];
  return curr;
}
\`\`\`

**Time:** O(n + max) | **Space:** O(max)`,
templateCode: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction deleteAndEarn(nums) {\n  // Maximum points from delete and earn\n}`,
testCases: [{args: [[3,4,2]], expected: 6}, {args: [[2,2,3,3,3,4]], expected: 9}]},

"depth-first-search-or-dfs-for-a-graph": {
description: `Given a directed graph as an adjacency list, return the DFS traversal starting from node 0.

**Example:** adj = [[1,2],[3],[4],[],[]] → Output: [0,1,3,2,4]`,
solution: `## Recursive DFS

\`\`\`javascript
function dfsOfGraph(adj) {
  const visited = new Set(), result = [];
  function dfs(node) {
    visited.add(node); result.push(node);
    for (const next of adj[node]) if (!visited.has(next)) dfs(next);
  }
  dfs(0);
  return result;
}
\`\`\`

**Time:** O(V + E) | **Space:** O(V)`,
templateCode: `/**\n * @param {number[][]} adj\n * @return {number[]}\n */\nfunction dfsOfGraph(adj) {\n  // DFS traversal from node 0\n}`,
testCases: [{args: [[[1,2],[3],[4],[],[]]], expected: [0,1,3,2,4]}]},

"design-add-and-search-words-data-structure": {
description: `Design a data structure that supports adding new words and searching for a string where '.' can match any character.

**Example:** addWord("bad"), search("b.d") → true, search("b..") → true`,
solution: `## Trie with DFS for Wildcards

\`\`\`javascript
class WordDictionary {
  constructor() { this.root = {}; }
  addWord(word) {
    let node = this.root;
    for (const c of word) { if (!node[c]) node[c] = {}; node = node[c]; }
    node.$ = true;
  }
  search(word) {
    function dfs(node, i) {
      if (!node) return false;
      if (i === word.length) return !!node.$;
      if (word[i] === '.') return Object.keys(node).some(k => k !== '$' && dfs(node[k], i+1));
      return dfs(node[word[i]], i+1);
    }
    return dfs(this.root, 0);
  }
}
\`\`\`

**Time:** addWord O(L), search O(26^L) worst | **Space:** O(total chars)`,
templateCode: `function WordDictionary() {\n  // Initialize data structure\n}\nWordDictionary.prototype.addWord = function(word) {};\nWordDictionary.prototype.search = function(word) {};`,
testCases: []},

"detect-a-negative-cycle-in-a-graph-bellman-ford": {
description: `Given a weighted directed graph, detect if it contains a negative weight cycle using Bellman-Ford algorithm.

**Example:** V=4, edges=[[0,1,-1],[1,2,-2],[2,3,-3],[3,0,4]] → false (no negative cycle)`,
solution: `## Bellman-Ford

Run V-1 relaxations, then check if any edge can still be relaxed.

\`\`\`javascript
function hasNegativeCycle(V, edges) {
  const dist = Array(V).fill(Infinity);
  dist[0] = 0;
  for (let i = 0; i < V - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) return true;
  }
  return false;
}
\`\`\`

**Time:** O(V × E) | **Space:** O(V)`,
templateCode: `/**\n * @param {number} V\n * @param {number[][]} edges\n * @return {boolean}\n */\nfunction hasNegativeCycle(V, edges) {\n  // Detect negative cycle using Bellman-Ford\n}`,
testCases: []},

"detect-cycle-in-a-directed-graph": {
description: `Given a directed graph, detect if it contains a cycle.

**Example:** V=4, edges=[[0,1],[1,2],[2,3],[3,1]] → true (cycle: 1→2→3→1)`,
solution: `## DFS with Coloring

Use 3 states: WHITE (unvisited), GRAY (in current path), BLACK (done). A GRAY→GRAY edge means cycle.

\`\`\`javascript
function hasCycle(V, adj) {
  const color = Array(V).fill(0);
  function dfs(u) {
    color[u] = 1;
    for (const v of adj[u]) {
      if (color[v] === 1) return true;
      if (color[v] === 0 && dfs(v)) return true;
    }
    color[u] = 2;
    return false;
  }
  for (let i = 0; i < V; i++) if (color[i] === 0 && dfs(i)) return true;
  return false;
}
\`\`\`

**Time:** O(V + E) | **Space:** O(V)`,
templateCode: `/**\n * @param {number} V\n * @param {number[][]} adj\n * @return {boolean}\n */\nfunction hasCycle(V, adj) {\n  // Detect cycle in directed graph\n}`,
testCases: []},

"diameter-of-binary-tree": {
description: `Given a binary tree, find the length of the diameter — the longest path between any two nodes (measured in edges).

**Example:** root = [1,2,3,4,5] → Output: 3 (path: 4→2→1→3)`,
solution: `## DFS with Global Max

\`\`\`javascript
function diameterOfBinaryTree(root) {
  let diameter = 0;
  function depth(node) {
    if (!node) return 0;
    const l = depth(node.left), r = depth(node.right);
    diameter = Math.max(diameter, l + r);
    return Math.max(l, r) + 1;
  }
  depth(root);
  return diameter;
}
\`\`\`

**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number}\n */\nfunction diameterOfBinaryTree(root) {\n  // Find diameter of binary tree\n}`,
testCases: []},

"distance-of-nearest-cell-having-1-practice": {
description: `Given a binary matrix, find the distance of the nearest 1 for each cell. Distance is calculated as the sum of absolute differences of row and column indices.

**Example:** grid = [[0,0,0],[0,1,0],[1,0,1]] → Output: [[2,1,2],[1,0,1],[0,1,0]]`,
solution: `## Multi-source BFS

Start BFS from all cells containing 1 simultaneously.

\`\`\`javascript
function nearestCell(grid) {
  const m = grid.length, n = grid[0].length;
  const dist = Array.from({length: m}, () => Array(n).fill(Infinity));
  const q = [];
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      if (grid[i][j] === 1) { dist[i][j] = 0; q.push([i, j]); }
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  while (q.length) {
    const [r, c] = q.shift();
    for (const [dr, dc] of dirs) {
      const nr = r+dr, nc = c+dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && dist[nr][nc] > dist[r][c]+1) {
        dist[nr][nc] = dist[r][c]+1; q.push([nr, nc]);
      }
    }
  }
  return dist;
}
\`\`\`

**Time:** O(mn) | **Space:** O(mn)`,
templateCode: `/**\n * @param {number[][]} grid\n * @return {number[][]}\n */\nfunction nearestCell(grid) {\n  // Distance to nearest cell with 1\n}`,
testCases: [{args: [[[0,0,0],[0,1,0],[1,0,1]]], expected: [[2,1,2],[1,0,1],[0,1,0]]}]},

"distinct-subsequences": {
description: `Given strings s and t, count the number of distinct subsequences of s which equal t.

**Example:** s = "rabbbit", t = "rabbit" → Output: 3`,
solution: `## DP

dp[i][j] = number of ways s[0..i-1] forms t[0..j-1].

\`\`\`javascript
function numDistinct(s, t) {
  const m = s.length, n = t.length;
  const dp = Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= m; i++) {
    for (let j = n; j >= 1; j--) {
      if (s[i-1] === t[j-1]) dp[j] += dp[j-1];
    }
  }
  return dp[n];
}
\`\`\`

**Time:** O(mn) | **Space:** O(n)`,
templateCode: `/**\n * @param {string} s\n * @param {string} t\n * @return {number}\n */\nfunction numDistinct(s, t) {\n  // Count distinct subsequences\n}`,
testCases: [{args: ["rabbbit", "rabbit"], expected: 3}, {args: ["babgbag", "bag"], expected: 5}]},

"evaluate-division": {
description: `Given equations like a/b=2.0 and b/c=3.0, answer queries like a/c. If answer cannot be determined, return -1.0.

**Example:** equations=[["a","b"],["b","c"]], values=[2.0,3.0], queries=[["a","c"]] → Output: [6.0]`,
solution: `## Graph DFS

Build a weighted graph, DFS from dividend to divisor multiplying weights.

\`\`\`javascript
function calcEquation(equations, values, queries) {
  const graph = new Map();
  for (let i = 0; i < equations.length; i++) {
    const [a, b] = equations[i], v = values[i];
    if (!graph.has(a)) graph.set(a, []);
    if (!graph.has(b)) graph.set(b, []);
    graph.get(a).push([b, v]); graph.get(b).push([a, 1/v]);
  }
  function dfs(src, dst, visited) {
    if (!graph.has(src) || !graph.has(dst)) return -1;
    if (src === dst) return 1;
    visited.add(src);
    for (const [next, w] of graph.get(src)) {
      if (visited.has(next)) continue;
      const res = dfs(next, dst, visited);
      if (res !== -1) return w * res;
    }
    return -1;
  }
  return queries.map(([a, b]) => dfs(a, b, new Set()));
}
\`\`\`

**Time:** O(Q × (V + E)) | **Space:** O(V + E)`,
templateCode: `/**\n * @param {string[][]} equations\n * @param {number[]} values\n * @param {string[][]} queries\n * @return {number[]}\n */\nfunction calcEquation(equations, values, queries) {\n  // Evaluate division queries\n}`,
testCases: []},

"evaluate-reverse-polish-notation": {
description: `Evaluate an expression in Reverse Polish Notation. Valid operators are +, -, *, /. Division truncates toward zero.

**Example:** tokens = ["2","1","+","3","*"] → Output: 9 ((2+1)*3)`,
solution: `## Stack

\`\`\`javascript
function evalRPN(tokens) {
  const stack = [];
  for (const t of tokens) {
    if ('+-*/'.includes(t)) {
      const b = stack.pop(), a = stack.pop();
      if (t === '+') stack.push(a + b);
      else if (t === '-') stack.push(a - b);
      else if (t === '*') stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else stack.push(Number(t));
  }
  return stack[0];
}
\`\`\`

**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {string[]} tokens\n * @return {number}\n */\nfunction evalRPN(tokens) {\n  // Evaluate Reverse Polish Notation\n}`,
testCases: [{args: [["2","1","+","3","*"]], expected: 9}, {args: [["4","13","5","/","+"]], expected: 6}]},

"evaluation-of-postfix-expression": {
description: `Given a postfix expression, evaluate it and return the result. Supported operators: +, -, *, /.

**Example:** exp = "231*+9-" → Output: -4 (2+3*1-9)`,
solution: `## Stack-Based Evaluation

\`\`\`javascript
function evaluatePostfix(exp) {
  const stack = [];
  for (const c of exp) {
    if ('+-*/'.includes(c)) {
      const b = stack.pop(), a = stack.pop();
      if (c === '+') stack.push(a + b);
      else if (c === '-') stack.push(a - b);
      else if (c === '*') stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else stack.push(Number(c));
  }
  return stack[0];
}
\`\`\`

**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {string} exp\n * @return {number}\n */\nfunction evaluatePostfix(exp) {\n  // Evaluate postfix expression\n}`,
testCases: [{args: ["231*+9-"], expected: -4}]},

"excel-sheet-column-title": {
description: `Given a positive integer, return its corresponding Excel column title (1→A, 2→B, ..., 26→Z, 27→AA, ...).

**Example:** columnNumber = 28 → Output: "AB"`,
solution: `## Base-26 Conversion

\`\`\`javascript
function convertToTitle(columnNumber) {
  let result = '';
  while (columnNumber > 0) {
    columnNumber--;
    result = String.fromCharCode(65 + (columnNumber % 26)) + result;
    columnNumber = Math.floor(columnNumber / 26);
  }
  return result;
}
\`\`\`

**Time:** O(log n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number} columnNumber\n * @return {string}\n */\nfunction convertToTitle(columnNumber) {\n  // Convert number to Excel column title\n}\n\n// Sample: console.log(convertToTitle(28));`,
testCases: [{args: [1], expected: "A"}, {args: [28], expected: "AB"}, {args: [701], expected: "ZY"}]},

"find-eventual-safe-states": {
description: `Given a directed graph, return all nodes that are eventually safe (all paths from them lead to terminal nodes).

**Example:** graph = [[1,2],[2,3],[5],[0],[5],[],[]] → Output: [2,4,5,6]`,
solution: `## Reverse Topological Sort

Terminal nodes have no outgoing edges. Process in reverse — safe nodes are those with all successors safe.

\`\`\`javascript
function eventualSafeNodes(graph) {
  const n = graph.length, color = Array(n).fill(0);
  function dfs(u) {
    if (color[u] > 0) return color[u] === 2;
    color[u] = 1;
    for (const v of graph[u]) if (!dfs(v)) return false;
    color[u] = 2;
    return true;
  }
  const result = [];
  for (let i = 0; i < n; i++) if (dfs(i)) result.push(i);
  return result;
}
\`\`\`

**Time:** O(V + E) | **Space:** O(V)`,
templateCode: `/**\n * @param {number[][]} graph\n * @return {number[]}\n */\nfunction eventualSafeNodes(graph) {\n  // Find all eventually safe nodes\n}`,
testCases: [{args: [[[1,2],[2,3],[5],[0],[5],[],[]]], expected: [2,4,5,6]}]},

"find-peak-element": {
description: `Find a peak element in an array where nums[i] != nums[i+1]. A peak element is strictly greater than its neighbors. Return its index.

**Example:** nums = [1,2,3,1] → Output: 2`,
solution: `## Binary Search

\`\`\`javascript
function findPeakElement(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[mid + 1]) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
\`\`\`

**Time:** O(log n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findPeakElement(nums) {\n  // Find index of a peak element\n}`,
testCases: [{args: [[1,2,3,1]], expected: 2}, {args: [[1,2,1,3,5,6,4]], expected: 5}]},

"find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance": {
description: `Given n cities and weighted edges, find the city with the smallest number of reachable cities within distanceThreshold. If there's a tie, return the city with the greatest number.

**Example:** n=4, edges=[[0,1,3],[1,2,1],[1,3,4],[2,3,1]], threshold=4 → Output: 3`,
solution: `## Floyd-Warshall

Compute all-pairs shortest paths, then count reachable cities per node.

\`\`\`javascript
function findTheCity(n, edges, distanceThreshold) {
  const dist = Array.from({length: n}, () => Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const [u, v, w] of edges) { dist[u][v] = w; dist[v][u] = w; }
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
  let minCount = n, result = 0;
  for (let i = 0; i < n; i++) {
    const count = dist[i].filter(d => d <= distanceThreshold).length - 1;
    if (count <= minCount) { minCount = count; result = i; }
  }
  return result;
}
\`\`\`

**Time:** O(n³) | **Space:** O(n²)`,
templateCode: `/**\n * @param {number} n\n * @param {number[][]} edges\n * @param {number} distanceThreshold\n * @return {number}\n */\nfunction findTheCity(n, edges, distanceThreshold) {\n  // City with fewest reachable neighbors\n}`,
testCases: [{args: [4, [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], 4], expected: 3}]},

"find-median-of-bst": {
description: `Given a BST, find the median of its elements. For even count, median is the average of the two middle elements.

**Example:** BST = [6,3,8,1,4,7,9] → median = 6`,
solution: `## Morris Inorder Traversal (Two Pass)

First count nodes, then find the middle element(s) via inorder.

\`\`\`javascript
function findMedian(root) {
  let count = 0;
  function countNodes(node) { if (!node) return; countNodes(node.left); count++; countNodes(node.right); }
  countNodes(root);
  let idx = 0, prev = 0, result = 0;
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    idx++;
    if (count % 2 === 1 && idx === Math.ceil(count / 2)) result = node.val;
    if (count % 2 === 0) {
      if (idx === count / 2) prev = node.val;
      if (idx === count / 2 + 1) result = (prev + node.val) / 2;
    }
    inorder(node.right);
  }
  inorder(root);
  return result;
}
\`\`\`

**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number}\n */\nfunction findMedian(root) {\n  // Find median of BST\n}`,
testCases: []},
};

// ─── APPLY ──────────────────────────────────────────────────────────────
let applied = 0, skipped = 0;

for (const [slug, content] of Object.entries(CONTENT)) {
  const dir = path.join(PROBLEMS_DIR, slug);
  if (!fs.existsSync(dir)) { console.error(`Missing: ${slug}`); continue; }

  if (content.description) {
    const descPath = path.join(dir, 'description.md');
    const existing = fs.existsSync(descPath) ? fs.readFileSync(descPath, 'utf-8').trim() : '';
    if (existing === 'Description coming soon.' || existing === '') {
      fs.writeFileSync(descPath, content.description.trim() + '\n');
    }
  }

  if (content.solution) {
    const solPath = path.join(dir, 'solution.md');
    const existing = fs.existsSync(solPath) ? fs.readFileSync(solPath, 'utf-8').trim() : '';
    if (existing === 'Solution coming soon.' || existing === '') {
      fs.writeFileSync(solPath, content.solution.trim() + '\n');
    }
  }

  const metaPath = path.join(dir, 'meta.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  let metaChanged = false;

  if (content.templateCode && (!meta.templateCode || meta.templateCode.includes('Write your solution here'))) {
    meta.templateCode = content.templateCode;
    metaChanged = true;
  }
  if (content.testCases && content.testCases.length > 0 && (!meta.testCases || meta.testCases.length === 0)) {
    meta.testCases = content.testCases;
    metaChanged = true;
  }
  if (metaChanged) fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');

  applied++;
}

console.log(`Applied content for ${applied} problems`);
