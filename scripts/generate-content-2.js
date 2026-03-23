#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS_DIR = path.join(__dirname, '..', 'content', 'problems');

const CONTENT = {
"flatten-a-multilevel-doubly-linked-list": {
description: `Given a doubly linked list where some nodes have a child pointer to a separate doubly linked list, flatten the list so all nodes appear in a single-level list.\n\n**Example:** 1↔2↔3↔4↔5↔6, 3 has child 7↔8↔9↔10, 8 has child 11↔12 → 1↔2↔3↔7↔8↔11↔12↔9↔10↔4↔5↔6`,
solution: `## DFS/Stack\n\nProcess child lists before continuing with next pointer.\n\n\`\`\`javascript\nfunction flatten(head) {\n  let curr = head;\n  while (curr) {\n    if (curr.child) {\n      let childTail = curr.child;\n      while (childTail.next) childTail = childTail.next;\n      childTail.next = curr.next;\n      if (curr.next) curr.next.prev = childTail;\n      curr.next = curr.child;\n      curr.child.prev = curr;\n      curr.child = null;\n    }\n    curr = curr.next;\n  }\n  return head;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {Node} head\n * @return {Node}\n */\nfunction flatten(head) {\n  // Flatten multilevel doubly linked list\n}`,
testCases: []},

"flatten-binary-tree-to-linked-list": {
description: `Given a binary tree, flatten it to a linked list in-place using the right pointer (following pre-order traversal).\n\n**Example:** root = [1,2,5,3,4,null,6] → 1→2→3→4→5→6`,
solution: `## Morris-Style Rewiring\n\n\`\`\`javascript\nfunction flatten(root) {\n  let curr = root;\n  while (curr) {\n    if (curr.left) {\n      let pred = curr.left;\n      while (pred.right) pred = pred.right;\n      pred.right = curr.right;\n      curr.right = curr.left;\n      curr.left = null;\n    }\n    curr = curr.right;\n  }\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {void}\n */\nfunction flatten(root) {\n  // Flatten to linked list in-place\n}`,
testCases: []},

"flatten-nested-list-iterator": {
description: `Design an iterator to flatten a nested list of integers. Each element is either an integer or a list of elements.\n\n**Example:** [[1,1],2,[1,1]] → next() calls: 1, 1, 2, 1, 1`,
solution: `## Stack with Lazy Flattening\n\n\`\`\`javascript\nclass NestedIterator {\n  constructor(nestedList) { this.stack = [...nestedList].reverse(); }\n  hasNext() {\n    while (this.stack.length) {\n      const top = this.stack[this.stack.length - 1];\n      if (typeof top === 'number') return true;\n      this.stack.pop();\n      for (let i = top.length - 1; i >= 0; i--) this.stack.push(top[i]);\n    }\n    return false;\n  }\n  next() { return this.stack.pop(); }\n}\n\`\`\`\n\n**Time:** O(1) amortized | **Space:** O(n)`,
templateCode: `/**\n * @param {Array} nestedList\n */\nfunction NestedIterator(nestedList) {}\nNestedIterator.prototype.hasNext = function() {};\nNestedIterator.prototype.next = function() {};`,
testCases: []},

"flattening-a-linked-list": {
description: `Given a linked list where every node has a down pointer, flatten the list into a single sorted linked list.\n\n**Example:** 5→10→19→28 with down pointers 7→8→30, 20, 22→50, 35→40→45 → 5→7→8→10→19→20→22→28→30→35→40→45→50`,
solution: `## Merge Sort Style\n\nMerge lists from right to left.\n\n\`\`\`javascript\nfunction flattenList(root) {\n  if (!root || !root.right) return root;\n  root.right = flattenList(root.right);\n  root = merge(root, root.right);\n  return root;\n}\nfunction merge(a, b) {\n  if (!a) return b;\n  if (!b) return a;\n  if (a.val < b.val) { a.down = merge(a.down, b); return a; }\n  else { b.down = merge(a, b.down); return b; }\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {Node} root\n * @return {Node}\n */\nfunction flattenList(root) {\n  // Flatten sorted linked list\n}`,
testCases: []},

"flood-fill": {
description: `Given an image (2D grid), a starting pixel (sr, sc), and a new color, perform a flood fill — change the starting pixel and all connected same-color pixels to the new color.\n\n**Example:** image = [[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2 → [[2,2,2],[2,2,0],[2,0,1]]`,
solution: `## DFS\n\n\`\`\`javascript\nfunction floodFill(image, sr, sc, color) {\n  const orig = image[sr][sc];\n  if (orig === color) return image;\n  function dfs(r, c) {\n    if (r < 0 || r >= image.length || c < 0 || c >= image[0].length) return;\n    if (image[r][c] !== orig) return;\n    image[r][c] = color;\n    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);\n  }\n  dfs(sr, sc);\n  return image;\n}\n\`\`\`\n\n**Time:** O(mn) | **Space:** O(mn)`,
templateCode: `/**\n * @param {number[][]} image\n * @param {number} sr\n * @param {number} sc\n * @param {number} color\n * @return {number[][]}\n */\nfunction floodFill(image, sr, sc, color) {\n  // Flood fill from (sr, sc)\n}`,
testCases: [{args: [[[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2], expected: [[2,2,2],[2,2,0],[2,0,1]]}]},

"floyd-warshall-practice": {
description: `Implement Floyd-Warshall algorithm to find shortest distances between every pair of vertices in a weighted graph.\n\n**Example:** matrix = [[0,3,INF,5],[2,0,INF,4],[INF,1,0,INF],[INF,INF,2,0]] → shortest path matrix`,
solution: `## Floyd-Warshall DP\n\n\`\`\`javascript\nfunction floydWarshall(dist) {\n  const n = dist.length;\n  for (let k = 0; k < n; k++)\n    for (let i = 0; i < n; i++)\n      for (let j = 0; j < n; j++)\n        if (dist[i][k] + dist[k][j] < dist[i][j])\n          dist[i][j] = dist[i][k] + dist[k][j];\n  return dist;\n}\n\`\`\`\n\n**Time:** O(V³) | **Space:** O(V²)`,
templateCode: `/**\n * @param {number[][]} dist\n * @return {number[][]}\n */\nfunction floydWarshall(dist) {\n  // All-pairs shortest paths\n}`,
testCases: []},

"frog-jump": {
description: `A frog crosses a river by jumping on stones. From stone at position i with last jump of k units, it can jump k-1, k, or k+1 units. Can the frog reach the last stone?\n\n**Example:** stones = [0,1,3,5,6,8,12,17] → true`,
solution: `## DP with Hash Map\n\nTrack possible jump sizes at each stone.\n\n\`\`\`javascript\nfunction canCross(stones) {\n  const map = new Map();\n  for (const s of stones) map.set(s, new Set());\n  map.get(0).add(0);\n  for (const s of stones) {\n    for (const k of map.get(s)) {\n      for (const step of [k-1, k, k+1]) {\n        if (step > 0 && map.has(s + step)) map.get(s + step).add(step);\n      }\n    }\n  }\n  return map.get(stones[stones.length - 1]).size > 0;\n}\n\`\`\`\n\n**Time:** O(n²) | **Space:** O(n²)`,
templateCode: `/**\n * @param {number[]} stones\n * @return {boolean}\n */\nfunction canCross(stones) {\n  // Can frog reach last stone?\n}`,
testCases: [{args: [[0,1,3,5,6,8,12,17]], expected: true}, {args: [[0,1,2,3,4,8,9,11]], expected: false}]},

"gas-station-practice": {
description: `There are N gas stations in a circle. Given gas[i] and cost[i] to travel to next station, find the starting station index to complete the circuit, or -1.\n\n**Example:** gas = [1,2,3,4,5], cost = [3,4,5,1,2] → Output: 3`,
solution: `## Greedy\n\n\`\`\`javascript\nfunction canCompleteCircuit(gas, cost) {\n  let total = 0, tank = 0, start = 0;\n  for (let i = 0; i < gas.length; i++) {\n    const diff = gas[i] - cost[i];\n    total += diff; tank += diff;\n    if (tank < 0) { start = i + 1; tank = 0; }\n  }\n  return total >= 0 ? start : -1;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} gas\n * @param {number[]} cost\n * @return {number}\n */\nfunction canCompleteCircuit(gas, cost) {\n  // Starting station for circular tour\n}`,
testCases: [{args: [[1,2,3,4,5], [3,4,5,1,2]], expected: 3}]},

"given-a-matrix-of-o-and-x-replace-o-with-x-if-surrounded-by-x": {
description: `Given an m×n board containing 'X' and 'O', capture all regions surrounded by 'X' by flipping 'O' to 'X'. Border-connected 'O's are not captured.\n\n**Example:** board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]] → flip inner O's to X`,
solution: `## Border DFS\n\nMark border-connected O's as safe, then flip remaining O's.\n\n\`\`\`javascript\nfunction solve(board) {\n  const m = board.length, n = board[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== 'O') return;\n    board[r][c] = '#';\n    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);\n  }\n  for (let i = 0; i < m; i++) { dfs(i, 0); dfs(i, n-1); }\n  for (let j = 0; j < n; j++) { dfs(0, j); dfs(m-1, j); }\n  for (let i = 0; i < m; i++)\n    for (let j = 0; j < n; j++)\n      board[i][j] = board[i][j] === '#' ? 'O' : 'X';\n}\n\`\`\`\n\n**Time:** O(mn) | **Space:** O(mn)`,
templateCode: `/**\n * @param {string[][]} board\n * @return {void}\n */\nfunction solve(board) {\n  // Capture surrounded regions\n}`,
testCases: []},

"given-only-a-pointer-reference-to-a-node-to-be-deleted-in-a-singly-linked-list-how-do-you-delete-it": {
description: `Given only access to a node to be deleted (not the head), delete it from the singly linked list. The node is guaranteed not to be the tail.\n\n**Example:** Delete node 5 from 4→5→1→9 → 4→1→9`,
solution: `## Copy Next Node\n\nCopy the next node's value and skip it.\n\n\`\`\`javascript\nfunction deleteNode(node) {\n  node.val = node.next.val;\n  node.next = node.next.next;\n}\n\`\`\`\n\n**Time:** O(1) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} node\n * @return {void}\n */\nfunction deleteNode(node) {\n  // Delete node without head access\n}`,
testCases: []},

"happy-number": {
description: `A happy number is defined by replacing it with the sum of squares of its digits repeatedly until it equals 1 (happy) or loops endlessly (not happy).\n\n**Example:** n = 19 → true (1²+9²=82, 8²+2²=68, 6²+8²=100, 1²+0²+0²=1)`,
solution: `## Floyd's Cycle Detection\n\n\`\`\`javascript\nfunction isHappy(n) {\n  function next(num) {\n    let sum = 0;\n    while (num > 0) { sum += (num % 10) ** 2; num = Math.floor(num / 10); }\n    return sum;\n  }\n  let slow = n, fast = next(n);\n  while (fast !== 1 && slow !== fast) { slow = next(slow); fast = next(next(fast)); }\n  return fast === 1;\n}\n\`\`\`\n\n**Time:** O(log n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number} n\n * @return {boolean}\n */\nfunction isHappy(n) {\n  // Check if n is a happy number\n}\n\n// Sample: console.log(isHappy(19));`,
testCases: [{args: [19], expected: true}, {args: [2], expected: false}]},

"implement-queue-using-stacks": {
description: `Implement a FIFO queue using only two stacks. Support push, pop, peek, and empty operations.\n\n**Example:** push(1), push(2), peek() → 1, pop() → 1, empty() → false`,
solution: `## Two Stacks (Amortized O(1))\n\n\`\`\`javascript\nclass MyQueue {\n  constructor() { this.s1 = []; this.s2 = []; }\n  push(x) { this.s1.push(x); }\n  pop() { this._move(); return this.s2.pop(); }\n  peek() { this._move(); return this.s2[this.s2.length - 1]; }\n  empty() { return !this.s1.length && !this.s2.length; }\n  _move() { if (!this.s2.length) while (this.s1.length) this.s2.push(this.s1.pop()); }\n}\n\`\`\`\n\n**Time:** O(1) amortized | **Space:** O(n)`,
templateCode: `function MyQueue() {\n  // Initialize queue using stacks\n}\nMyQueue.prototype.push = function(x) {};\nMyQueue.prototype.pop = function() {};\nMyQueue.prototype.peek = function() {};\nMyQueue.prototype.empty = function() {};`,
testCases: []},

"implement-stack-using-queues": {
description: `Implement a LIFO stack using only two queues.\n\n**Example:** push(1), push(2), top() → 2, pop() → 2, empty() → false`,
solution: `## Single Queue (Push O(n))\n\n\`\`\`javascript\nclass MyStack {\n  constructor() { this.q = []; }\n  push(x) {\n    this.q.push(x);\n    for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());\n  }\n  pop() { return this.q.shift(); }\n  top() { return this.q[0]; }\n  empty() { return this.q.length === 0; }\n}\n\`\`\`\n\n**Time:** push O(n), others O(1) | **Space:** O(n)`,
templateCode: `function MyStack() {\n  // Initialize stack using queues\n}\nMyStack.prototype.push = function(x) {};\nMyStack.prototype.pop = function() {};\nMyStack.prototype.top = function() {};\nMyStack.prototype.empty = function() {};`,
testCases: []},

"implement-stack-and-queue-using-deque": {
description: `Implement both stack and queue operations using a deque (double-ended queue) data structure.`,
solution: `## Deque Wrapper\n\n\`\`\`javascript\nclass Deque {\n  constructor() { this.items = []; }\n  pushFront(x) { this.items.unshift(x); }\n  pushBack(x) { this.items.push(x); }\n  popFront() { return this.items.shift(); }\n  popBack() { return this.items.pop(); }\n  peekFront() { return this.items[0]; }\n  peekBack() { return this.items[this.items.length - 1]; }\n  isEmpty() { return this.items.length === 0; }\n}\n// Stack: pushBack + popBack\n// Queue: pushBack + popFront\n\`\`\`\n\n**Time:** O(1) for all operations (with linked list) | **Space:** O(n)`,
templateCode: `function Deque() {\n  // Initialize deque\n}\nDeque.prototype.pushFront = function(x) {};\nDeque.prototype.pushBack = function(x) {};\nDeque.prototype.popFront = function() {};\nDeque.prototype.popBack = function() {};`,
testCases: []},

"implement-two-stacks-in-an-array": {
description: `Implement two stacks using a single array efficiently, such that neither stack overflows unless the total elements exceed the array size.`,
solution: `## Two-End Approach\n\nStack 1 grows from left, Stack 2 grows from right.\n\n\`\`\`javascript\nclass TwoStacks {\n  constructor(n) { this.arr = new Array(n); this.top1 = -1; this.top2 = n; this.size = n; }\n  push1(x) { if (this.top1 < this.top2 - 1) this.arr[++this.top1] = x; }\n  push2(x) { if (this.top1 < this.top2 - 1) this.arr[--this.top2] = x; }\n  pop1() { return this.top1 >= 0 ? this.arr[this.top1--] : -1; }\n  pop2() { return this.top2 < this.size ? this.arr[this.top2++] : -1; }\n}\n\`\`\`\n\n**Time:** O(1) | **Space:** O(n)`,
templateCode: `function TwoStacks(n) {\n  // Initialize two stacks in one array\n}\nTwoStacks.prototype.push1 = function(x) {};\nTwoStacks.prototype.push2 = function(x) {};\nTwoStacks.prototype.pop1 = function() {};\nTwoStacks.prototype.pop2 = function() {};`,
testCases: []},

"integer-to-english-words": {
description: `Convert a non-negative integer to its English words representation.\n\n**Example:** num = 1234567 → "One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven"`,
solution: `## Chunk by Thousands\n\n\`\`\`javascript\nfunction numberToWords(num) {\n  if (num === 0) return "Zero";\n  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',\n    'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];\n  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];\n  const thousands = ['','Thousand','Million','Billion'];\n  function helper(n) {\n    if (n === 0) return '';\n    if (n < 20) return ones[n] + ' ';\n    if (n < 100) return tens[Math.floor(n/10)] + ' ' + helper(n%10);\n    return ones[Math.floor(n/100)] + ' Hundred ' + helper(n%100);\n  }\n  let result = '', i = 0;\n  while (num > 0) {\n    if (num % 1000 !== 0) result = helper(num % 1000) + thousands[i] + ' ' + result;\n    num = Math.floor(num / 1000); i++;\n  }\n  return result.trim();\n}\n\`\`\`\n\n**Time:** O(1) | **Space:** O(1)`,
templateCode: `/**\n * @param {number} num\n * @return {string}\n */\nfunction numberToWords(num) {\n  // Convert integer to English words\n}`,
testCases: [{args: [123], expected: "One Hundred Twenty Three"}, {args: [0], expected: "Zero"}]},

"intersection-of-two-linked-lists": {
description: `Given two singly linked lists, find the node at which they intersect. Return null if no intersection.\n\n**Example:** listA = [4,1,8,4,5], listB = [5,6,1,8,4,5] → intersect at node 8`,
solution: `## Two Pointer\n\nTraverse both lists; when one ends, redirect to the other's head.\n\n\`\`\`javascript\nfunction getIntersectionNode(headA, headB) {\n  let a = headA, b = headB;\n  while (a !== b) {\n    a = a ? a.next : headB;\n    b = b ? b.next : headA;\n  }\n  return a;\n}\n\`\`\`\n\n**Time:** O(m + n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} headA\n * @param {ListNode} headB\n * @return {ListNode}\n */\nfunction getIntersectionNode(headA, headB) {\n  // Find intersection node\n}`,
testCases: []},

"invert-binary-tree": {
description: `Given the root of a binary tree, invert it (swap left and right children at every node).\n\n**Example:** root = [4,2,7,1,3,6,9] → [4,7,2,9,6,3,1]`,
solution: `## Recursive DFS\n\n\`\`\`javascript\nfunction invertTree(root) {\n  if (!root) return null;\n  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];\n  return root;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {TreeNode}\n */\nfunction invertTree(root) {\n  // Invert binary tree\n}`,
testCases: []},

"knight-dialer": {
description: `A chess knight on a phone dialpad can make N hops. Count how many distinct phone numbers of length N the knight can dial. Return modulo 10^9+7.\n\n**Example:** n = 1 → 10, n = 2 → 20`,
solution: `## DP with Transition Map\n\n\`\`\`javascript\nfunction knightDialer(n) {\n  const MOD = 1e9 + 7;\n  const moves = {0:[4,6],1:[6,8],2:[7,9],3:[4,8],4:[0,3,9],5:[],6:[0,1,7],7:[2,6],8:[1,3],9:[2,4]};\n  let dp = Array(10).fill(1);\n  for (let i = 1; i < n; i++) {\n    const next = Array(10).fill(0);\n    for (let d = 0; d <= 9; d++)\n      for (const prev of moves[d]) next[d] = (next[d] + dp[prev]) % MOD;\n    dp = next;\n  }\n  return dp.reduce((a, b) => (a + b) % MOD, 0);\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number} n\n * @return {number}\n */\nfunction knightDialer(n) {\n  // Count distinct numbers of length n\n}`,
testCases: [{args: [1], expected: 10}, {args: [2], expected: 20}]},

"kth-smallest-element-in-a-bst": {
description: `Given the root of a BST and an integer k, return the kth smallest element.\n\n**Example:** root = [3,1,4,null,2], k = 1 → Output: 1`,
solution: `## Inorder Traversal\n\n\`\`\`javascript\nfunction kthSmallest(root, k) {\n  const stack = [];\n  let curr = root;\n  while (curr || stack.length) {\n    while (curr) { stack.push(curr); curr = curr.left; }\n    curr = stack.pop();\n    if (--k === 0) return curr.val;\n    curr = curr.right;\n  }\n}\n\`\`\`\n\n**Time:** O(H + k) | **Space:** O(H)`,
templateCode: `/**\n * @param {TreeNode} root\n * @param {number} k\n * @return {number}\n */\nfunction kthSmallest(root, k) {\n  // kth smallest element in BST\n}`,
testCases: []},

"linked-list-cycle": {
description: `Given head of a linked list, determine if the list has a cycle.\n\n**Example:** head = [3,2,0,-4], pos = 1 → true (tail connects to node 1)`,
solution: `## Floyd's Tortoise and Hare\n\n\`\`\`javascript\nfunction hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @return {boolean}\n */\nfunction hasCycle(head) {\n  // Detect cycle in linked list\n}`,
testCases: []},

"longest-common-substring-practice": {
description: `Given two strings, find the length of the longest common substring.\n\n**Example:** S1 = "ABCDGH", S2 = "ACDGHR" → Output: 4 ("CDGH")`,
solution: `## DP\n\n\`\`\`javascript\nfunction longestCommonSubstring(s1, s2) {\n  const m = s1.length, n = s2.length;\n  let max = 0, prev = Array(n + 1).fill(0);\n  for (let i = 1; i <= m; i++) {\n    const curr = Array(n + 1).fill(0);\n    for (let j = 1; j <= n; j++) {\n      if (s1[i-1] === s2[j-1]) { curr[j] = prev[j-1] + 1; max = Math.max(max, curr[j]); }\n    }\n    prev = curr;\n  }\n  return max;\n}\n\`\`\`\n\n**Time:** O(mn) | **Space:** O(n)`,
templateCode: `/**\n * @param {string} s1\n * @param {string} s2\n * @return {number}\n */\nfunction longestCommonSubstring(s1, s2) {\n  // Length of longest common substring\n}`,
testCases: [{args: ["ABCDGH", "ACDGHR"], expected: 4}]},

"longest-increasing-subsequence": {
description: `Given an array of integers, return the length of the longest strictly increasing subsequence.\n\n**Example:** nums = [10,9,2,5,3,7,101,18] → Output: 4 ([2,3,7,101])`,
solution: `## Binary Search + Patience Sorting\n\n\`\`\`javascript\nfunction lengthOfLIS(nums) {\n  const tails = [];\n  for (const num of nums) {\n    let lo = 0, hi = tails.length;\n    while (lo < hi) {\n      const mid = (lo + hi) >> 1;\n      if (tails[mid] < num) lo = mid + 1;\n      else hi = mid;\n    }\n    tails[lo] = num;\n  }\n  return tails.length;\n}\n\`\`\`\n\n**Time:** O(n log n) | **Space:** O(n)`,
templateCode: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction lengthOfLIS(nums) {\n  // Length of longest increasing subsequence\n}`,
testCases: [{args: [[10,9,2,5,3,7,101,18]], expected: 4}, {args: [[0,1,0,3,2,3]], expected: 4}]},

"longest-increasing-path-in-a-matrix": {
description: `Given an m×n matrix of integers, find the length of the longest increasing path. You can move in 4 directions.\n\n**Example:** matrix = [[9,9,4],[6,6,8],[2,1,1]] → Output: 4 (1→2→6→9)`,
solution: `## DFS with Memoization\n\n\`\`\`javascript\nfunction longestIncreasingPath(matrix) {\n  const m = matrix.length, n = matrix[0].length;\n  const memo = Array.from({length: m}, () => Array(n).fill(0));\n  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];\n  function dfs(r, c) {\n    if (memo[r][c]) return memo[r][c];\n    let max = 1;\n    for (const [dr, dc] of dirs) {\n      const nr = r+dr, nc = c+dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c])\n        max = Math.max(max, 1 + dfs(nr, nc));\n    }\n    return memo[r][c] = max;\n  }\n  let result = 0;\n  for (let i = 0; i < m; i++)\n    for (let j = 0; j < n; j++)\n      result = Math.max(result, dfs(i, j));\n  return result;\n}\n\`\`\`\n\n**Time:** O(mn) | **Space:** O(mn)`,
templateCode: `/**\n * @param {number[][]} matrix\n * @return {number}\n */\nfunction longestIncreasingPath(matrix) {\n  // Longest increasing path in matrix\n}`,
testCases: [{args: [[[9,9,4],[6,6,8],[2,1,1]]], expected: 4}]},

"lowest-common-ancestor-of-a-binary-search-tree": {
description: `Given a BST and two nodes p and q, find their lowest common ancestor.\n\n**Example:** root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8 → Output: 6`,
solution: `## BST Property\n\nIf both values < root, go left. If both > root, go right. Otherwise, root is LCA.\n\n\`\`\`javascript\nfunction lowestCommonAncestor(root, p, q) {\n  while (root) {\n    if (p.val < root.val && q.val < root.val) root = root.left;\n    else if (p.val > root.val && q.val > root.val) root = root.right;\n    else return root;\n  }\n}\n\`\`\`\n\n**Time:** O(h) | **Space:** O(1)`,
templateCode: `/**\n * @param {TreeNode} root\n * @param {TreeNode} p\n * @param {TreeNode} q\n * @return {TreeNode}\n */\nfunction lowestCommonAncestor(root, p, q) {\n  // LCA in BST\n}`,
testCases: []},

"lowest-common-ancestor-of-a-binary-tree": {
description: `Given a binary tree and two nodes p and q, find their lowest common ancestor.\n\n**Example:** root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1 → Output: 3`,
solution: `## Recursive DFS\n\n\`\`\`javascript\nfunction lowestCommonAncestor(root, p, q) {\n  if (!root || root === p || root === q) return root;\n  const left = lowestCommonAncestor(root.left, p, q);\n  const right = lowestCommonAncestor(root.right, p, q);\n  if (left && right) return root;\n  return left || right;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @param {TreeNode} p\n * @param {TreeNode} q\n * @return {TreeNode}\n */\nfunction lowestCommonAncestor(root, p, q) {\n  // LCA in binary tree\n}`,
testCases: []},

"maximum-depth-of-binary-tree": {
description: `Given a binary tree, find its maximum depth — the number of nodes along the longest path from root to farthest leaf.\n\n**Example:** root = [3,9,20,null,null,15,7] → Output: 3`,
solution: `## Recursive DFS\n\n\`\`\`javascript\nfunction maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number}\n */\nfunction maxDepth(root) {\n  // Maximum depth of binary tree\n}`,
testCases: []},

"maximum-product-of-three-numbers": {
description: `Given an integer array, find the maximum product of three numbers.\n\n**Example:** nums = [1,2,3,4] → Output: 24`,
solution: `## Sort and Check Two Cases\n\nMax is either the product of 3 largest or 2 smallest (negative) × largest.\n\n\`\`\`javascript\nfunction maximumProduct(nums) {\n  nums.sort((a, b) => a - b);\n  const n = nums.length;\n  return Math.max(\n    nums[n-1] * nums[n-2] * nums[n-3],\n    nums[0] * nums[1] * nums[n-1]\n  );\n}\n\`\`\`\n\n**Time:** O(n log n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maximumProduct(nums) {\n  // Maximum product of three numbers\n}`,
testCases: [{args: [[1,2,3,4]], expected: 24}, {args: [[-4,-3,-2,1,60]], expected: 720}]},

"maximum-product-subarray": {
description: `Given an integer array, find the contiguous subarray with the largest product.\n\n**Example:** nums = [2,3,-2,4] → Output: 6 ([2,3])`,
solution: `## Track Min and Max\n\nMaintain current min and max products (a negative min can become max when multiplied by negative).\n\n\`\`\`javascript\nfunction maxProduct(nums) {\n  let max = nums[0], curMax = nums[0], curMin = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    const temp = curMax;\n    curMax = Math.max(nums[i], nums[i] * curMax, nums[i] * curMin);\n    curMin = Math.min(nums[i], nums[i] * temp, nums[i] * curMin);\n    max = Math.max(max, curMax);\n  }\n  return max;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxProduct(nums) {\n  // Maximum product subarray\n}`,
testCases: [{args: [[2,3,-2,4]], expected: 6}, {args: [[-2,0,-1]], expected: 0}]},

"merge-two-sorted-lists": {
description: `Merge two sorted linked lists into one sorted list.\n\n**Example:** l1 = [1,2,4], l2 = [1,3,4] → Output: [1,1,2,3,4,4]`,
solution: `## Iterative Merge\n\n\`\`\`javascript\nfunction mergeTwoLists(l1, l2) {\n  const dummy = {val: 0, next: null};\n  let curr = dummy;\n  while (l1 && l2) {\n    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }\n    else { curr.next = l2; l2 = l2.next; }\n    curr = curr.next;\n  }\n  curr.next = l1 || l2;\n  return dummy.next;\n}\n\`\`\`\n\n**Time:** O(m + n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nfunction mergeTwoLists(l1, l2) {\n  // Merge two sorted linked lists\n}`,
testCases: [{args: [[1,2,4], [1,3,4]], expected: [1,1,2,3,4,4]}]},

"middle-of-the-linked-list": {
description: `Given a linked list, return the middle node. If two middle nodes, return the second one.\n\n**Example:** head = [1,2,3,4,5] → Output: node 3`,
solution: `## Slow and Fast Pointers\n\n\`\`\`javascript\nfunction middleNode(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }\n  return slow;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nfunction middleNode(head) {\n  // Return middle node of linked list\n}`,
testCases: []},

"minimum-path-sum": {
description: `Given an m×n grid of non-negative numbers, find a path from top-left to bottom-right minimizing the sum.\n\n**Example:** grid = [[1,3,1],[1,5,1],[4,2,1]] → Output: 7 (1→3→1→1→1)`,
solution: `## DP\n\n\`\`\`javascript\nfunction minPathSum(grid) {\n  const m = grid.length, n = grid[0].length;\n  for (let i = 0; i < m; i++)\n    for (let j = 0; j < n; j++) {\n      if (i === 0 && j === 0) continue;\n      const top = i > 0 ? grid[i-1][j] : Infinity;\n      const left = j > 0 ? grid[i][j-1] : Infinity;\n      grid[i][j] += Math.min(top, left);\n    }\n  return grid[m-1][n-1];\n}\n\`\`\`\n\n**Time:** O(mn) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[][]} grid\n * @return {number}\n */\nfunction minPathSum(grid) {\n  // Minimum path sum top-left to bottom-right\n}`,
testCases: [{args: [[[1,3,1],[1,5,1],[4,2,1]]], expected: 7}]},

"missing-number": {
description: `Given an array of n distinct numbers in range [0, n], return the missing number.\n\n**Example:** nums = [3,0,1] → Output: 2`,
solution: `## XOR or Math\n\n\`\`\`javascript\nfunction missingNumber(nums) {\n  const n = nums.length;\n  return n * (n + 1) / 2 - nums.reduce((a, b) => a + b, 0);\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction missingNumber(nums) {\n  // Find the missing number in [0, n]\n}\n\n// Sample: console.log(missingNumber([3,0,1]));`,
testCases: [{args: [[3,0,1]], expected: 2}, {args: [[0,1]], expected: 2}, {args: [[9,6,4,2,3,5,7,0,1]], expected: 8}]},

"minimum-moves-to-equal-array-elements": {
description: `Given an integer array, find the minimum number of moves to make all elements equal. In one move, you can increment n-1 elements by 1.\n\n**Example:** nums = [1,2,3] → Output: 3`,
solution: `## Math Insight\n\nIncrementing n-1 elements by 1 is equivalent to decrementing 1 element by 1. Answer = sum - n * min.\n\n\`\`\`javascript\nfunction minMoves(nums) {\n  const min = Math.min(...nums);\n  return nums.reduce((sum, n) => sum + n - min, 0);\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction minMoves(nums) {\n  // Minimum moves to equalize array\n}`,
testCases: [{args: [[1,2,3]], expected: 3}]},

"maximal-square": {
description: `Given an m×n binary matrix, find the largest square containing only 1's and return its area.\n\n**Example:** matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]] → Output: 4`,
solution: `## DP\n\ndp[i][j] = side length of largest square ending at (i,j).\n\n\`\`\`javascript\nfunction maximalSquare(matrix) {\n  const m = matrix.length, n = matrix[0].length;\n  const dp = Array.from({length: m}, () => Array(n).fill(0));\n  let max = 0;\n  for (let i = 0; i < m; i++)\n    for (let j = 0; j < n; j++) {\n      if (matrix[i][j] === '1') {\n        dp[i][j] = i > 0 && j > 0 ? Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1 : 1;\n        max = Math.max(max, dp[i][j]);\n      }\n    }\n  return max * max;\n}\n\`\`\`\n\n**Time:** O(mn) | **Space:** O(mn)`,
templateCode: `/**\n * @param {string[][]} matrix\n * @return {number}\n */\nfunction maximalSquare(matrix) {\n  // Largest square of 1s - return area\n}`,
testCases: []},

"maximal-rectangle": {
description: `Given a rows×cols binary matrix, find the largest rectangle containing only 1's and return its area.\n\n**Example:** matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]] → Output: 6`,
solution: `## Histogram per Row + Largest Rectangle in Histogram\n\n\`\`\`javascript\nfunction maximalRectangle(matrix) {\n  if (!matrix.length) return 0;\n  const n = matrix[0].length, heights = Array(n).fill(0);\n  let max = 0;\n  for (const row of matrix) {\n    for (let j = 0; j < n; j++) heights[j] = row[j] === '1' ? heights[j] + 1 : 0;\n    max = Math.max(max, largestRect(heights));\n  }\n  return max;\n}\nfunction largestRect(h) {\n  const stack = [], n = h.length;\n  let max = 0;\n  for (let i = 0; i <= n; i++) {\n    while (stack.length && (i === n || h[i] < h[stack[stack.length-1]])) {\n      const height = h[stack.pop()];\n      const width = stack.length ? i - stack[stack.length-1] - 1 : i;\n      max = Math.max(max, height * width);\n    }\n    stack.push(i);\n  }\n  return max;\n}\n\`\`\`\n\n**Time:** O(mn) | **Space:** O(n)`,
templateCode: `/**\n * @param {string[][]} matrix\n * @return {number}\n */\nfunction maximalRectangle(matrix) {\n  // Largest rectangle of 1s\n}`,
testCases: []},

"maximum-length-of-repeated-subarray": {
description: `Given two integer arrays, return the maximum length of a subarray that appears in both arrays.\n\n**Example:** nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7] → Output: 3 ([3,2,1])`,
solution: `## DP\n\n\`\`\`javascript\nfunction findLength(nums1, nums2) {\n  const m = nums1.length, n = nums2.length;\n  const dp = Array(n + 1).fill(0);\n  let max = 0;\n  for (let i = 1; i <= m; i++) {\n    for (let j = n; j >= 1; j--) {\n      dp[j] = nums1[i-1] === nums2[j-1] ? dp[j-1] + 1 : 0;\n      max = Math.max(max, dp[j]);\n    }\n  }\n  return max;\n}\n\`\`\`\n\n**Time:** O(mn) | **Space:** O(n)`,
templateCode: `/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nfunction findLength(nums1, nums2) {\n  // Max length of repeated subarray\n}`,
testCases: [{args: [[1,2,3,2,1], [3,2,1,4,7]], expected: 3}]},

"merge-k-sorted-lists": {
description: `Merge k sorted linked lists and return one sorted list.\n\n**Example:** lists = [[1,4,5],[1,3,4],[2,6]] → Output: [1,1,2,3,4,4,5,6]`,
solution: `## Divide and Conquer\n\n\`\`\`javascript\nfunction mergeKLists(lists) {\n  if (!lists.length) return null;\n  function merge(a, b) {\n    const dummy = {next: null}; let curr = dummy;\n    while (a && b) {\n      if (a.val <= b.val) { curr.next = a; a = a.next; }\n      else { curr.next = b; b = b.next; }\n      curr = curr.next;\n    }\n    curr.next = a || b;\n    return dummy.next;\n  }\n  while (lists.length > 1) {\n    const merged = [];\n    for (let i = 0; i < lists.length; i += 2)\n      merged.push(i+1 < lists.length ? merge(lists[i], lists[i+1]) : lists[i]);\n    lists = merged;\n  }\n  return lists[0];\n}\n\`\`\`\n\n**Time:** O(N log k) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode[]} lists\n * @return {ListNode}\n */\nfunction mergeKLists(lists) {\n  // Merge k sorted linked lists\n}`,
testCases: []},

"merge-two-binary-trees": {
description: `Given two binary trees, merge them into a new tree. If nodes overlap, sum the values.\n\n**Example:** root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7] → [3,4,5,5,4,null,7]`,
solution: `## Recursive DFS\n\n\`\`\`javascript\nfunction mergeTrees(t1, t2) {\n  if (!t1) return t2;\n  if (!t2) return t1;\n  return {\n    val: t1.val + t2.val,\n    left: mergeTrees(t1.left, t2.left),\n    right: mergeTrees(t1.right, t2.right)\n  };\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {TreeNode} t1\n * @param {TreeNode} t2\n * @return {TreeNode}\n */\nfunction mergeTrees(t1, t2) {\n  // Merge two binary trees\n}`,
testCases: []},

"minimum-absolute-difference-in-bst": {
description: `Given a BST, find the minimum absolute difference between values of any two nodes.\n\n**Example:** root = [4,2,6,1,3] → Output: 1`,
solution: `## Inorder Traversal\n\n\`\`\`javascript\nfunction getMinimumDifference(root) {\n  let prev = -Infinity, min = Infinity;\n  function inorder(node) {\n    if (!node) return;\n    inorder(node.left);\n    min = Math.min(min, node.val - prev);\n    prev = node.val;\n    inorder(node.right);\n  }\n  inorder(root);\n  return min;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number}\n */\nfunction getMinimumDifference(root) {\n  // Min absolute difference in BST\n}`,
testCases: []},

"number-of-islands": {
description: `Given an m×n 2D grid of '1's (land) and '0's (water), count the number of islands.\n\n**Example:** grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]] → Output: 3`,
solution: `## DFS Flood Fill\n\n\`\`\`javascript\nfunction numIslands(grid) {\n  const m = grid.length, n = grid[0].length;\n  let count = 0;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);\n  }\n  for (let i = 0; i < m; i++)\n    for (let j = 0; j < n; j++)\n      if (grid[i][j] === '1') { count++; dfs(i, j); }\n  return count;\n}\n\`\`\`\n\n**Time:** O(mn) | **Space:** O(mn)`,
templateCode: `/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands(grid) {\n  // Count number of islands\n}`,
testCases: []},

"palindrome-number": {
description: `Given an integer x, return true if it's a palindrome (reads the same backward as forward).\n\n**Example:** x = 121 → true, x = -121 → false`,
solution: `## Reverse Half\n\n\`\`\`javascript\nfunction isPalindrome(x) {\n  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;\n  let rev = 0;\n  while (x > rev) { rev = rev * 10 + x % 10; x = Math.floor(x / 10); }\n  return x === rev || x === Math.floor(rev / 10);\n}\n\`\`\`\n\n**Time:** O(log n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number} x\n * @return {boolean}\n */\nfunction isPalindrome(x) {\n  // Check if integer is palindrome\n}\n\n// Sample: console.log(isPalindrome(121));`,
testCases: [{args: [121], expected: true}, {args: [-121], expected: false}, {args: [10], expected: false}]},

"palindrome-linked-list": {
description: `Given a singly linked list, determine if it is a palindrome.\n\n**Example:** head = [1,2,2,1] → true`,
solution: `## Reverse Second Half\n\n\`\`\`javascript\nfunction isPalindrome(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }\n  let prev = null;\n  while (slow) { const next = slow.next; slow.next = prev; prev = slow; slow = next; }\n  while (prev) {\n    if (prev.val !== head.val) return false;\n    prev = prev.next; head = head.next;\n  }\n  return true;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @return {boolean}\n */\nfunction isPalindrome(head) {\n  // Check if linked list is palindrome\n}`,
testCases: []},

"path-sum": {
description: `Given a binary tree and a target sum, determine if the tree has a root-to-leaf path where the values sum to the target.\n\n**Example:** root = [5,4,8,11,null,13,4,7,2,null,null,null,1], target = 22 → true (5→4→11→2)`,
solution: `## DFS\n\n\`\`\`javascript\nfunction hasPathSum(root, targetSum) {\n  if (!root) return false;\n  if (!root.left && !root.right) return root.val === targetSum;\n  const remaining = targetSum - root.val;\n  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @param {number} targetSum\n * @return {boolean}\n */\nfunction hasPathSum(root, targetSum) {\n  // Check if root-to-leaf path sums to target\n}`,
testCases: []},

"path-sum-iii": {
description: `Given a binary tree, find the number of paths where values sum to a given target. Path doesn't need to start at root or end at leaf.\n\n**Example:** root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8 → Output: 3`,
solution: `## Prefix Sum DFS\n\n\`\`\`javascript\nfunction pathSum(root, targetSum) {\n  let count = 0;\n  const prefixSums = new Map([[0, 1]]);\n  function dfs(node, sum) {\n    if (!node) return;\n    sum += node.val;\n    count += prefixSums.get(sum - targetSum) || 0;\n    prefixSums.set(sum, (prefixSums.get(sum) || 0) + 1);\n    dfs(node.left, sum); dfs(node.right, sum);\n    prefixSums.set(sum, prefixSums.get(sum) - 1);\n  }\n  dfs(root, 0);\n  return count;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {TreeNode} root\n * @param {number} targetSum\n * @return {number}\n */\nfunction pathSum(root, targetSum) {\n  // Count paths summing to target\n}`,
testCases: []},

"power-of-two": {
description: `Given an integer n, return true if it is a power of two.\n\n**Example:** n = 16 → true, n = 3 → false`,
solution: `## Bit Manipulation\n\n\`\`\`javascript\nfunction isPowerOfTwo(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}\n\`\`\`\n\n**Time:** O(1) | **Space:** O(1)`,
templateCode: `/**\n * @param {number} n\n * @return {boolean}\n */\nfunction isPowerOfTwo(n) {\n  // Check if n is a power of two\n}\n\n// Sample: console.log(isPowerOfTwo(16));`,
testCases: [{args: [1], expected: true}, {args: [16], expected: true}, {args: [3], expected: false}]},

"reverse-integer": {
description: `Given a signed 32-bit integer x, return x with its digits reversed. Return 0 if the result overflows.\n\n**Example:** x = 123 → 321, x = -123 → -321`,
solution: `## Pop and Push Digits\n\n\`\`\`javascript\nfunction reverse(x) {\n  let result = 0;\n  while (x !== 0) {\n    result = result * 10 + x % 10;\n    x = Math.trunc(x / 10);\n  }\n  return result > 2**31 - 1 || result < -(2**31) ? 0 : result;\n}\n\`\`\`\n\n**Time:** O(log x) | **Space:** O(1)`,
templateCode: `/**\n * @param {number} x\n * @return {number}\n */\nfunction reverse(x) {\n  // Reverse digits of integer\n}\n\n// Sample: console.log(reverse(123));`,
testCases: [{args: [123], expected: 321}, {args: [-123], expected: -321}, {args: [120], expected: 21}]},

"reverse-linked-list": {
description: `Given the head of a singly linked list, reverse it and return the new head.\n\n**Example:** head = [1,2,3,4,5] → [5,4,3,2,1]`,
solution: `## Iterative\n\n\`\`\`javascript\nfunction reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nfunction reverseList(head) {\n  // Reverse linked list\n}`,
testCases: [{args: [[1,2,3,4,5]], expected: [5,4,3,2,1]}]},

"same-tree": {
description: `Given roots of two binary trees, check if they are the same (structurally identical with same node values).\n\n**Example:** p = [1,2,3], q = [1,2,3] → true`,
solution: `## Recursive\n\n\`\`\`javascript\nfunction isSameTree(p, q) {\n  if (!p && !q) return true;\n  if (!p || !q || p.val !== q.val) return false;\n  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} p\n * @param {TreeNode} q\n * @return {boolean}\n */\nfunction isSameTree(p, q) {\n  // Check if two trees are identical\n}`,
testCases: []},

"symmetric-tree": {
description: `Given the root of a binary tree, check whether it is a mirror of itself (symmetric around its center).\n\n**Example:** root = [1,2,2,3,4,4,3] → true`,
solution: `## Recursive Mirror Check\n\n\`\`\`javascript\nfunction isSymmetric(root) {\n  function isMirror(a, b) {\n    if (!a && !b) return true;\n    if (!a || !b || a.val !== b.val) return false;\n    return isMirror(a.left, b.right) && isMirror(a.right, b.left);\n  }\n  return isMirror(root, root);\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {boolean}\n */\nfunction isSymmetric(root) {\n  // Check if tree is symmetric\n}`,
testCases: []},

"subtree-of-another-tree": {
description: `Given roots of two binary trees, check if the second tree is a subtree of the first.\n\n**Example:** root = [3,4,5,1,2], subRoot = [4,1,2] → true`,
solution: `## DFS + Same Tree\n\n\`\`\`javascript\nfunction isSubtree(root, subRoot) {\n  if (!root) return false;\n  if (isSame(root, subRoot)) return true;\n  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);\n}\nfunction isSame(a, b) {\n  if (!a && !b) return true;\n  if (!a || !b || a.val !== b.val) return false;\n  return isSame(a.left, b.left) && isSame(a.right, b.right);\n}\n\`\`\`\n\n**Time:** O(m × n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @param {TreeNode} subRoot\n * @return {boolean}\n */\nfunction isSubtree(root, subRoot) {\n  // Check if subRoot is subtree of root\n}`,
testCases: []},

"sum-of-left-leaves": {
description: `Given the root of a binary tree, return the sum of all left leaves.\n\n**Example:** root = [3,9,20,null,null,15,7] → Output: 24 (9 + 15)`,
solution: `## DFS\n\n\`\`\`javascript\nfunction sumOfLeftLeaves(root) {\n  if (!root) return 0;\n  let sum = 0;\n  if (root.left && !root.left.left && !root.left.right) sum += root.left.val;\n  else sum += sumOfLeftLeaves(root.left);\n  sum += sumOfLeftLeaves(root.right);\n  return sum;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number}\n */\nfunction sumOfLeftLeaves(root) {\n  // Sum of all left leaves\n}`,
testCases: []},

"unique-paths": {
description: `A robot is on an m×n grid starting top-left. It can only move right or down. How many unique paths to bottom-right?\n\n**Example:** m = 3, n = 7 → Output: 28`,
solution: `## DP\n\n\`\`\`javascript\nfunction uniquePaths(m, n) {\n  const dp = Array(n).fill(1);\n  for (let i = 1; i < m; i++)\n    for (let j = 1; j < n; j++)\n      dp[j] += dp[j-1];\n  return dp[n-1];\n}\n\`\`\`\n\n**Time:** O(mn) | **Space:** O(n)`,
templateCode: `/**\n * @param {number} m\n * @param {number} n\n * @return {number}\n */\nfunction uniquePaths(m, n) {\n  // Count unique paths in m×n grid\n}\n\n// Sample: console.log(uniquePaths(3, 7));`,
testCases: [{args: [3, 7], expected: 28}, {args: [3, 2], expected: 3}]},

"validate-binary-search-tree": {
description: `Given the root of a binary tree, determine if it is a valid BST.\n\n**Example:** root = [2,1,3] → true, root = [5,1,4,null,null,3,6] → false`,
solution: `## DFS with Range\n\n\`\`\`javascript\nfunction isValidBST(root) {\n  function validate(node, min, max) {\n    if (!node) return true;\n    if (node.val <= min || node.val >= max) return false;\n    return validate(node.left, min, node.val) && validate(node.right, node.val, max);\n  }\n  return validate(root, -Infinity, Infinity);\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {boolean}\n */\nfunction isValidBST(root) {\n  // Validate binary search tree\n}`,
testCases: []},

"word-ladder": {
description: `Given beginWord, endWord, and a wordList, find the shortest transformation sequence length from beginWord to endWord, changing one letter at a time.\n\n**Example:** beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"] → Output: 5`,
solution: `## BFS\n\n\`\`\`javascript\nfunction ladderLength(beginWord, endWord, wordList) {\n  const wordSet = new Set(wordList);\n  if (!wordSet.has(endWord)) return 0;\n  const q = [[beginWord, 1]];\n  const visited = new Set([beginWord]);\n  while (q.length) {\n    const [word, len] = q.shift();\n    for (let i = 0; i < word.length; i++) {\n      for (let c = 97; c <= 122; c++) {\n        const next = word.slice(0,i) + String.fromCharCode(c) + word.slice(i+1);\n        if (next === endWord) return len + 1;\n        if (wordSet.has(next) && !visited.has(next)) {\n          visited.add(next); q.push([next, len + 1]);\n        }\n      }\n    }\n  }\n  return 0;\n}\n\`\`\`\n\n**Time:** O(M² × N) where M=word length, N=word list size | **Space:** O(M × N)`,
templateCode: `/**\n * @param {string} beginWord\n * @param {string} endWord\n * @param {string[]} wordList\n * @return {number}\n */\nfunction ladderLength(beginWord, endWord, wordList) {\n  // Shortest transformation sequence length\n}`,
testCases: [{args: ["hit", "cog", ["hot","dot","dog","lot","log","cog"]], expected: 5}]},

"trapping-rain-water": {
description: `Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.\n\n**Example:** height = [0,1,0,2,1,0,1,3,2,1,2,1] → Output: 6`,
solution: `## Two Pointers\n\n\`\`\`javascript\nfunction trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0, water = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      leftMax = Math.max(leftMax, height[left]);\n      water += leftMax - height[left];\n      left++;\n    } else {\n      rightMax = Math.max(rightMax, height[right]);\n      water += rightMax - height[right];\n      right--;\n    }\n  }\n  return water;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} height\n * @return {number}\n */\nfunction trap(height) {\n  // Compute trapped rainwater\n}\n\n// Sample: console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]));`,
testCases: [{args: [[0,1,0,2,1,0,1,3,2,1,2,1]], expected: 6}, {args: [[4,2,0,3,2,5]], expected: 9}]},

"sliding-window-maximum": {
description: `Given an array and window size k, return the max value in each sliding window.\n\n**Example:** nums = [1,3,-1,-3,5,3,6,7], k = 3 → Output: [3,3,5,5,6,7]`,
solution: `## Monotonic Deque\n\n\`\`\`javascript\nfunction maxSlidingWindow(nums, k) {\n  const deque = [], result = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (deque.length && deque[0] <= i - k) deque.shift();\n    while (deque.length && nums[deque[deque.length-1]] <= nums[i]) deque.pop();\n    deque.push(i);\n    if (i >= k - 1) result.push(nums[deque[0]]);\n  }\n  return result;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(k)`,
templateCode: `/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nfunction maxSlidingWindow(nums, k) {\n  // Max in each sliding window\n}`,
testCases: [{args: [[1,3,-1,-3,5,3,6,7], 3], expected: [3,3,5,5,6,7]}]},

"serialize-and-deserialize-binary-tree": {
description: `Design an algorithm to serialize a binary tree to a string and deserialize the string back to a tree.\n\n**Example:** root = [1,2,3,null,null,4,5] → "1,2,null,null,3,4,null,null,5,null,null"`,
solution: `## Preorder with null markers\n\n\`\`\`javascript\nfunction serialize(root) {\n  const result = [];\n  function dfs(node) {\n    if (!node) { result.push('null'); return; }\n    result.push(node.val);\n    dfs(node.left); dfs(node.right);\n  }\n  dfs(root);\n  return result.join(',');\n}\nfunction deserialize(data) {\n  const vals = data.split(',');\n  let i = 0;\n  function build() {\n    if (vals[i] === 'null') { i++; return null; }\n    const node = {val: Number(vals[i++]), left: null, right: null};\n    node.left = build(); node.right = build();\n    return node;\n  }\n  return build();\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {string}\n */\nfunction serialize(root) {}\n/**\n * @param {string} data\n * @return {TreeNode}\n */\nfunction deserialize(data) {}`,
testCases: []},

"rotate-image": {
description: `Rotate an n×n matrix 90 degrees clockwise in-place.\n\n**Example:** matrix = [[1,2,3],[4,5,6],[7,8,9]] → [[7,4,1],[8,5,2],[9,6,3]]`,
solution: `## Transpose + Reverse Rows\n\n\`\`\`javascript\nfunction rotate(matrix) {\n  const n = matrix.length;\n  for (let i = 0; i < n; i++)\n    for (let j = i + 1; j < n; j++)\n      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];\n  for (const row of matrix) row.reverse();\n}\n\`\`\`\n\n**Time:** O(n²) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[][]} matrix\n * @return {void}\n */\nfunction rotate(matrix) {\n  // Rotate matrix 90 degrees clockwise\n}`,
testCases: []},
};

// ─── APPLY ──────────────────────────────────────────────────────────────
let applied = 0;
for (const [slug, content] of Object.entries(CONTENT)) {
  const dir = path.join(PROBLEMS_DIR, slug);
  if (!fs.existsSync(dir)) { console.error(`Missing: ${slug}`); continue; }
  if (content.description) {
    const p = path.join(dir, 'description.md');
    const e = fs.existsSync(p) ? fs.readFileSync(p, 'utf-8').trim() : '';
    if (e === 'Description coming soon.' || e === '') fs.writeFileSync(p, content.description.trim() + '\n');
  }
  if (content.solution) {
    const p = path.join(dir, 'solution.md');
    const e = fs.existsSync(p) ? fs.readFileSync(p, 'utf-8').trim() : '';
    if (e === 'Solution coming soon.' || e === '') fs.writeFileSync(p, content.solution.trim() + '\n');
  }
  const metaPath = path.join(dir, 'meta.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  let metaChanged = false;
  if (content.templateCode && (!meta.templateCode || meta.templateCode.includes('Write your solution here'))) {
    meta.templateCode = content.templateCode; metaChanged = true;
  }
  if (content.testCases && content.testCases.length > 0 && (!meta.testCases || meta.testCases.length === 0)) {
    meta.testCases = content.testCases; metaChanged = true;
  }
  if (metaChanged) fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
  applied++;
}
console.log(`Applied content for ${applied} problems`);
