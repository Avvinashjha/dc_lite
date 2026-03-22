#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS_DIR = path.join(__dirname, '..', 'content', 'problems');

const CONTENT = {
"https-leetcode-com-problems-binary-tree-inorder-traversal": {
description: `Given the root of a binary tree, return the inorder traversal of its nodes' values.\n\n**Example:** root = [1,null,2,3] → Output: [1,3,2]`,
solution: `## Iterative with Stack\n\n\`\`\`javascript\nfunction inorderTraversal(root) {\n  const result = [], stack = [];\n  let curr = root;\n  while (curr || stack.length) {\n    while (curr) { stack.push(curr); curr = curr.left; }\n    curr = stack.pop();\n    result.push(curr.val);\n    curr = curr.right;\n  }\n  return result;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number[]}\n */\nfunction inorderTraversal(root) {\n  // Inorder traversal of binary tree\n}`,
testCases: []},

"https-leetcode-com-problems-implement-stack-using-queues": {
description: `Implement a last-in-first-out (LIFO) stack using only two queues.\n\n**Example:** push(1), push(2), top() → 2, pop() → 2`,
solution: `## Single Queue Rotation\n\n\`\`\`javascript\nclass MyStack {\n  constructor() { this.q = []; }\n  push(x) { this.q.push(x); for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift()); }\n  pop() { return this.q.shift(); }\n  top() { return this.q[0]; }\n  empty() { return !this.q.length; }\n}\n\`\`\`\n\n**Time:** push O(n), others O(1) | **Space:** O(n)`,
templateCode: `function MyStack() {}\nMyStack.prototype.push = function(x) {};\nMyStack.prototype.pop = function() {};\nMyStack.prototype.top = function() {};\nMyStack.prototype.empty = function() {};`,
testCases: []},

"https-practice-geeksforgeeks-org-problems-binary-tree-to-dll-1": {
description: `Convert a binary tree to a doubly linked list in-place. The left pointer should act as previous and right pointer as next. The DLL should follow inorder traversal order.\n\n**Example:** tree = [10,12,15,25,30,36] → DLL: 25↔12↔30↔10↔36↔15`,
solution: `## Inorder DFS\n\n\`\`\`javascript\nfunction bToDLL(root) {\n  let prev = null, head = null;\n  function inorder(node) {\n    if (!node) return;\n    inorder(node.left);\n    if (!prev) head = node;\n    else { node.left = prev; prev.right = node; }\n    prev = node;\n    inorder(node.right);\n  }\n  inorder(root);\n  return head;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {TreeNode}\n */\nfunction bToDLL(root) {\n  // Convert binary tree to DLL\n}`,
testCases: []},

"introduction-to-graph-coloring": {
description: `Given an undirected graph and M colors, determine if the graph can be colored with at most M colors such that no two adjacent vertices share the same color.\n\n**Example:** V=4, edges=[[0,1],[1,2],[2,3],[3,0],[0,2]], M=3 → true`,
solution: `## Backtracking\n\n\`\`\`javascript\nfunction graphColoring(V, adj, M) {\n  const colors = Array(V).fill(0);\n  function isSafe(v, c) {\n    for (const u of adj[v]) if (colors[u] === c) return false;\n    return true;\n  }\n  function solve(v) {\n    if (v === V) return true;\n    for (let c = 1; c <= M; c++) {\n      if (isSafe(v, c)) { colors[v] = c; if (solve(v+1)) return true; colors[v] = 0; }\n    }\n    return false;\n  }\n  return solve(0);\n}\n\`\`\`\n\n**Time:** O(M^V) | **Space:** O(V)`,
templateCode: `/**\n * @param {number} V\n * @param {number[][]} adj\n * @param {number} M\n * @return {boolean}\n */\nfunction graphColoring(V, adj, M) {\n  // Can graph be colored with M colors?\n}`,
testCases: []},

"largest-bst-in-a-binary-tree": {
description: `Given a binary tree, find the size of the largest subtree which is also a BST.\n\n**Example:** root = [10,5,15,1,8,null,7] → Output: 3 (subtree rooted at 5 with nodes 1,5,8)`,
solution: `## Bottom-Up DFS\n\nReturn {size, min, max, isBST} for each subtree.\n\n\`\`\`javascript\nfunction largestBST(root) {\n  let maxSize = 0;\n  function dfs(node) {\n    if (!node) return {size: 0, min: Infinity, max: -Infinity, isBST: true};\n    const l = dfs(node.left), r = dfs(node.right);\n    if (l.isBST && r.isBST && node.val > l.max && node.val < r.min) {\n      const size = l.size + r.size + 1;\n      maxSize = Math.max(maxSize, size);\n      return {size, min: Math.min(l.min, node.val), max: Math.max(r.max, node.val), isBST: true};\n    }\n    return {size: 0, min: -Infinity, max: Infinity, isBST: false};\n  }\n  dfs(root);\n  return maxSize;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number}\n */\nfunction largestBST(root) {\n  // Size of largest BST subtree\n}`,
testCases: []},

"letter-combinations-of-a-phone-number": {
description: `Given a string containing digits 2-9, return all possible letter combinations that the digits could represent (like on a phone keypad).\n\n**Example:** digits = "23" → ["ad","ae","af","bd","be","bf","cd","ce","cf"]`,
solution: `## Backtracking\n\n\`\`\`javascript\nfunction letterCombinations(digits) {\n  if (!digits) return [];\n  const map = {'2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz'};\n  const result = [];\n  function bt(i, path) {\n    if (i === digits.length) { result.push(path); return; }\n    for (const c of map[digits[i]]) bt(i+1, path+c);\n  }\n  bt(0, '');\n  return result;\n}\n\`\`\`\n\n**Time:** O(4^n) | **Space:** O(n)`,
templateCode: `/**\n * @param {string} digits\n * @return {string[]}\n */\nfunction letterCombinations(digits) {\n  // Phone keypad letter combinations\n}`,
testCases: [{args: ["23"], expected: ["ad","ae","af","bd","be","bf","cd","ce","cf"]}]},

"lru-cache-complete-tutorial": {
description: `Design an LRU (Least Recently Used) cache with get and put operations, both in O(1) time.\n\n**Example:** capacity=2, put(1,1), put(2,2), get(1)→1, put(3,3), get(2)→-1`,
solution: `## Hash Map + Doubly Linked List\n\n\`\`\`javascript\nclass LRUCache {\n  constructor(capacity) {\n    this.cap = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    this.map.delete(key);\n    this.map.set(key, value);\n    if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);\n  }\n}\n\`\`\`\n\n**Time:** O(1) for both operations | **Space:** O(capacity)`,
templateCode: `/**\n * @param {number} capacity\n */\nfunction LRUCache(capacity) {}\nLRUCache.prototype.get = function(key) {};\nLRUCache.prototype.put = function(key, value) {};`,
testCases: []},

"make-all-array-elements-equal-with-minimum-cost": {
description: `Given an array, find the minimum cost to make all elements equal, where cost is the sum of absolute differences.\n\n**Example:** arr = [1, 100, 101] → minimum cost = 100 (make all 100)`,
solution: `## Median Minimizes Absolute Deviations\n\n\`\`\`javascript\nfunction minCost(arr) {\n  arr.sort((a, b) => a - b);\n  const median = arr[Math.floor(arr.length / 2)];\n  return arr.reduce((sum, x) => sum + Math.abs(x - median), 0);\n}\n\`\`\`\n\n**Time:** O(n log n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} arr\n * @return {number}\n */\nfunction minCost(arr) {\n  // Min cost to equalize array\n}`,
testCases: [{args: [[1, 100, 101]], expected: 100}]},

"making-a-large-island": {
description: `Given a binary grid, you can change at most one 0 to 1. Return the size of the largest island.\n\n**Example:** grid = [[1,0],[0,1]] → Output: 3`,
solution: `## Union-Find / DFS with Island IDs\n\nLabel islands with IDs and sizes. For each 0, check adjacent islands.\n\n\`\`\`javascript\nfunction largestIsland(grid) {\n  const n = grid.length, dirs = [[0,1],[0,-1],[1,0],[-1,0]];\n  const sizes = new Map(); let id = 2, maxSize = 0;\n  function dfs(r, c, id) {\n    if (r<0||r>=n||c<0||c>=n||grid[r][c]!==1) return 0;\n    grid[r][c] = id;\n    return 1 + dfs(r+1,c,id) + dfs(r-1,c,id) + dfs(r,c+1,id) + dfs(r,c-1,id);\n  }\n  for (let i=0;i<n;i++) for (let j=0;j<n;j++)\n    if (grid[i][j]===1) { const s = dfs(i,j,id); sizes.set(id,s); maxSize = Math.max(maxSize,s); id++; }\n  for (let i=0;i<n;i++) for (let j=0;j<n;j++) if (grid[i][j]===0) {\n    const seen = new Set(); let total = 1;\n    for (const [dr,dc] of dirs) {\n      const nr=i+dr, nc=j+dc;\n      if (nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]>1&&!seen.has(grid[nr][nc])) {\n        seen.add(grid[nr][nc]); total += sizes.get(grid[nr][nc]);\n      }\n    }\n    maxSize = Math.max(maxSize, total);\n  }\n  return maxSize;\n}\n\`\`\`\n\n**Time:** O(n²) | **Space:** O(n²)`,
templateCode: `/**\n * @param {number[][]} grid\n * @return {number}\n */\nfunction largestIsland(grid) {\n  // Largest island after flipping one 0\n}`,
testCases: [{args: [[[1,0],[0,1]]], expected: 3}]},

"max-points-on-a-line": {
description: `Given an array of points on a 2D plane, find the maximum number of points that lie on the same straight line.\n\n**Example:** points = [[1,1],[2,2],[3,3]] → Output: 3`,
solution: `## For Each Point, Count Slopes\n\n\`\`\`javascript\nfunction maxPoints(points) {\n  if (points.length <= 2) return points.length;\n  let max = 2;\n  for (let i = 0; i < points.length; i++) {\n    const slopes = new Map();\n    for (let j = i+1; j < points.length; j++) {\n      const dx = points[j][0]-points[i][0], dy = points[j][1]-points[i][1];\n      const key = dx === 0 ? 'inf' : (dy/dx).toFixed(10);\n      slopes.set(key, (slopes.get(key)||1) + 1);\n      max = Math.max(max, slopes.get(key));\n    }\n  }\n  return max;\n}\n\`\`\`\n\n**Time:** O(n²) | **Space:** O(n)`,
templateCode: `/**\n * @param {number[][]} points\n * @return {number}\n */\nfunction maxPoints(points) {\n  // Max points on a line\n}`,
testCases: [{args: [[[1,1],[2,2],[3,3]]], expected: 3}]},

"maximize-the-cut-segments-practice": {
description: `Given a line of length N and three segment lengths x, y, z, maximize the total number of cut segments.\n\n**Example:** N=4, x=2, y=1, z=1 → Output: 4 (four segments of length 1)`,
solution: `## DP\n\n\`\`\`javascript\nfunction maximizeCuts(n, x, y, z) {\n  const dp = Array(n+1).fill(-1);\n  dp[0] = 0;\n  for (let i = 1; i <= n; i++) {\n    for (const len of [x, y, z]) {\n      if (i >= len && dp[i-len] !== -1) dp[i] = Math.max(dp[i], dp[i-len]+1);\n    }\n  }\n  return Math.max(dp[n], 0);\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {number} n\n * @param {number} x\n * @param {number} y\n * @param {number} z\n * @return {number}\n */\nfunction maximizeCuts(n, x, y, z) {\n  // Maximize cut segments\n}`,
testCases: [{args: [4, 2, 1, 1], expected: 4}]},

"maximum-width-of-binary-tree": {
description: `Given a binary tree, return the maximum width — the maximum number of nodes between any two nodes at the same level (including nulls between them).\n\n**Example:** root = [1,3,2,5,3,null,9] → Output: 4`,
solution: `## BFS with Position Tracking\n\n\`\`\`javascript\nfunction widthOfBinaryTree(root) {\n  if (!root) return 0;\n  let maxWidth = 0;\n  const q = [[root, 0n]];\n  while (q.length) {\n    const size = q.length, first = q[0][1];\n    let last = first;\n    for (let i = 0; i < size; i++) {\n      const [node, pos] = q.shift();\n      last = pos;\n      if (node.left) q.push([node.left, 2n*pos]);\n      if (node.right) q.push([node.right, 2n*pos+1n]);\n    }\n    const width = Number(last - first + 1n);\n    maxWidth = Math.max(maxWidth, width);\n  }\n  return maxWidth;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number}\n */\nfunction widthOfBinaryTree(root) {\n  // Maximum width of binary tree\n}`,
testCases: []},

"merge-sort-for-linked-lists": {
description: `Sort a linked list using merge sort.\n\n**Example:** head = [4,2,1,3] → [1,2,3,4]`,
solution: `## Split + Merge\n\n\`\`\`javascript\nfunction sortList(head) {\n  if (!head || !head.next) return head;\n  let slow = head, fast = head.next;\n  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }\n  const mid = slow.next; slow.next = null;\n  return merge(sortList(head), sortList(mid));\n}\nfunction merge(a, b) {\n  const dummy = {next: null}; let t = dummy;\n  while (a && b) { if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; } t = t.next; }\n  t.next = a || b;\n  return dummy.next;\n}\n\`\`\`\n\n**Time:** O(n log n) | **Space:** O(log n)`,
templateCode: `/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nfunction sortList(head) {\n  // Merge sort linked list\n}`,
testCases: []},

"most-stones-removed-with-same-row-or-column": {
description: `Given stones on a 2D plane, remove a stone if it shares a row or column with another. Return max stones removable.\n\n**Example:** stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]] → Output: 5`,
solution: `## Union-Find (Count Components)\n\nMax removable = total stones - number of connected components.\n\n\`\`\`javascript\nfunction removeStones(stones) {\n  const parent = new Map();\n  function find(x) { if (!parent.has(x)) parent.set(x, x); if (parent.get(x) !== x) parent.set(x, find(parent.get(x))); return parent.get(x); }\n  function union(a, b) { parent.set(find(a), find(b)); }\n  for (const [r, c] of stones) union(r, ~c);\n  const roots = new Set();\n  for (const [r] of stones) roots.add(find(r));\n  return stones.length - roots.size;\n}\n\`\`\`\n\n**Time:** O(n α(n)) | **Space:** O(n)`,
templateCode: `/**\n * @param {number[][]} stones\n * @return {number}\n */\nfunction removeStones(stones) {\n  // Max stones removable\n}`,
testCases: [{args: [[[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]], expected: 5}]},

"next-greater-element-i": {
description: `Given two arrays nums1 (subset of nums2), for each element in nums1 find the next greater element in nums2. Return -1 if no greater element exists.\n\n**Example:** nums1 = [4,1,2], nums2 = [1,3,4,2] → Output: [-1,3,-1]`,
solution: `## Monotonic Stack + Hash Map\n\n\`\`\`javascript\nfunction nextGreaterElement(nums1, nums2) {\n  const map = new Map(), stack = [];\n  for (const n of nums2) {\n    while (stack.length && stack[stack.length-1] < n) map.set(stack.pop(), n);\n    stack.push(n);\n  }\n  return nums1.map(n => map.get(n) ?? -1);\n}\n\`\`\`\n\n**Time:** O(m + n) | **Space:** O(n)`,
templateCode: `/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number[]}\n */\nfunction nextGreaterElement(nums1, nums2) {\n  // Next greater element for each in nums1\n}`,
testCases: [{args: [[4,1,2], [1,3,4,2]], expected: [-1,3,-1]}]},

"number-of-islands-2": {
description: `Given a grid, count the number of islands. An island is formed by connecting adjacent lands horizontally or vertically.\n\n**Example:** grid = [["1","1","0","0"],["1","1","0","0"],["0","0","1","0"],["0","0","0","1"]] → 3`,
solution: `## DFS Flood Fill\n\n\`\`\`javascript\nfunction numIslands(grid) {\n  const m = grid.length, n = grid[0].length;\n  let count = 0;\n  function dfs(r, c) {\n    if (r<0||r>=m||c<0||c>=n||grid[r][c]!=='1') return;\n    grid[r][c] = '0';\n    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);\n  }\n  for (let i=0;i<m;i++) for (let j=0;j<n;j++) if (grid[i][j]==='1') { count++; dfs(i,j); }\n  return count;\n}\n\`\`\`\n\n**Time:** O(mn) | **Space:** O(mn)`,
templateCode: `/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands(grid) {\n  // Count islands\n}`,
testCases: []},

"number-of-operations-to-make-network-connected": {
description: `Given n computers and connections, return the minimum number of cable moves to connect all computers. Return -1 if impossible.\n\n**Example:** n=4, connections=[[0,1],[0,2],[1,2]] → Output: 1`,
solution: `## Union-Find (Count Components)\n\nNeed at least n-1 edges. Extra edges = total - (n - components). Answer = components - 1.\n\n\`\`\`javascript\nfunction makeConnected(n, connections) {\n  if (connections.length < n - 1) return -1;\n  const parent = Array.from({length: n}, (_, i) => i);\n  function find(x) { return parent[x] === x ? x : (parent[x] = find(parent[x])); }\n  let components = n;\n  for (const [a, b] of connections) {\n    const pa = find(a), pb = find(b);\n    if (pa !== pb) { parent[pa] = pb; components--; }\n  }\n  return components - 1;\n}\n\`\`\`\n\n**Time:** O(E α(n)) | **Space:** O(n)`,
templateCode: `/**\n * @param {number} n\n * @param {number[][]} connections\n * @return {number}\n */\nfunction makeConnected(n, connections) {\n  // Min operations to connect network\n}`,
testCases: [{args: [4, [[0,1],[0,2],[1,2]]], expected: 1}]},

"ones-and-zeroes": {
description: `Given an array of binary strings and limits m zeros and n ones, return the max number of strings that can be formed within the limits.\n\n**Example:** strs = ["10","0001","111001","1","0"], m=5, n=3 → Output: 4`,
solution: `## 2D Knapsack DP\n\n\`\`\`javascript\nfunction findMaxForm(strs, m, n) {\n  const dp = Array.from({length: m+1}, () => Array(n+1).fill(0));\n  for (const s of strs) {\n    const zeros = [...s].filter(c => c==='0').length;\n    const ones = s.length - zeros;\n    for (let i = m; i >= zeros; i--)\n      for (let j = n; j >= ones; j--)\n        dp[i][j] = Math.max(dp[i][j], dp[i-zeros][j-ones] + 1);\n  }\n  return dp[m][n];\n}\n\`\`\`\n\n**Time:** O(L × m × n) | **Space:** O(m × n)`,
templateCode: `/**\n * @param {string[]} strs\n * @param {number} m\n * @param {number} n\n * @return {number}\n */\nfunction findMaxForm(strs, m, n) {\n  // Max strings within m zeros and n ones\n}`,
testCases: [{args: [["10","0001","111001","1","0"], 5, 3], expected: 4}]},

"online-stock-span": {
description: `Design a class that collects daily stock prices and returns the span — the number of consecutive days (including today) the price was <= today's price.\n\n**Example:** prices = [100,80,60,70,60,75,85] → spans = [1,1,1,2,1,4,6]`,
solution: `## Monotonic Stack\n\n\`\`\`javascript\nclass StockSpanner {\n  constructor() { this.stack = []; }\n  next(price) {\n    let span = 1;\n    while (this.stack.length && this.stack[this.stack.length-1][0] <= price)\n      span += this.stack.pop()[1];\n    this.stack.push([price, span]);\n    return span;\n  }\n}\n\`\`\`\n\n**Time:** O(1) amortized | **Space:** O(n)`,
templateCode: `function StockSpanner() {}\nStockSpanner.prototype.next = function(price) {\n  // Return stock span\n};`,
testCases: []},

"product-of-array-except-self": {
description: `Given an array nums, return an array where each element is the product of all other elements. Do not use division.\n\n**Example:** nums = [1,2,3,4] → Output: [24,12,8,6]`,
solution: `## Left and Right Products\n\n\`\`\`javascript\nfunction productExceptSelf(nums) {\n  const n = nums.length, result = Array(n).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < n; i++) { result[i] = prefix; prefix *= nums[i]; }\n  let suffix = 1;\n  for (let i = n-1; i >= 0; i--) { result[i] *= suffix; suffix *= nums[i]; }\n  return result;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1) extra`,
templateCode: `/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction productExceptSelf(nums) {\n  // Product of array except self\n}`,
testCases: [{args: [[1,2,3,4]], expected: [24,12,8,6]}]},

"range-sum-of-bst": {
description: `Given a BST, return the sum of values of all nodes with values between low and high inclusive.\n\n**Example:** root = [10,5,15,3,7,null,18], low=7, high=15 → Output: 32`,
solution: `## Pruned DFS\n\n\`\`\`javascript\nfunction rangeSumBST(root, low, high) {\n  if (!root) return 0;\n  if (root.val < low) return rangeSumBST(root.right, low, high);\n  if (root.val > high) return rangeSumBST(root.left, low, high);\n  return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @param {number} low\n * @param {number} high\n * @return {number}\n */\nfunction rangeSumBST(root, low, high) {\n  // Sum of BST values in range\n}`,
testCases: []},

"range-sum-query-2d-immutable": {
description: `Given a 2D matrix, handle multiple queries to find the sum of elements inside a given rectangle.\n\n**Example:** matrix = [[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]], sumRegion(2,1,4,3) → 8`,
solution: `## Prefix Sum 2D\n\n\`\`\`javascript\nclass NumMatrix {\n  constructor(matrix) {\n    const m = matrix.length, n = matrix[0].length;\n    this.prefix = Array.from({length: m+1}, () => Array(n+1).fill(0));\n    for (let i = 1; i <= m; i++)\n      for (let j = 1; j <= n; j++)\n        this.prefix[i][j] = matrix[i-1][j-1] + this.prefix[i-1][j] + this.prefix[i][j-1] - this.prefix[i-1][j-1];\n  }\n  sumRegion(r1, c1, r2, c2) {\n    return this.prefix[r2+1][c2+1] - this.prefix[r1][c2+1] - this.prefix[r2+1][c1] + this.prefix[r1][c1];\n  }\n}\n\`\`\`\n\n**Time:** O(1) per query, O(mn) init | **Space:** O(mn)`,
templateCode: `/**\n * @param {number[][]} matrix\n */\nfunction NumMatrix(matrix) {}\nNumMatrix.prototype.sumRegion = function(r1, c1, r2, c2) {};`,
testCases: []},

"remove-duplicates-from-sorted-list": {
description: `Given a sorted linked list, delete all duplicates so each element appears only once.\n\n**Example:** head = [1,1,2,3,3] → [1,2,3]`,
solution: `## One Pass\n\n\`\`\`javascript\nfunction deleteDuplicates(head) {\n  let curr = head;\n  while (curr && curr.next) {\n    if (curr.val === curr.next.val) curr.next = curr.next.next;\n    else curr = curr.next;\n  }\n  return head;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nfunction deleteDuplicates(head) {\n  // Remove duplicates from sorted list\n}`,
testCases: []},

"remove-duplicates-from-sorted-list-ii": {
description: `Given a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers.\n\n**Example:** head = [1,2,3,3,4,4,5] → [1,2,5]`,
solution: `## Dummy Head + Skip Groups\n\n\`\`\`javascript\nfunction deleteDuplicates(head) {\n  const dummy = {next: head};\n  let prev = dummy;\n  while (prev.next) {\n    let curr = prev.next;\n    while (curr.next && curr.val === curr.next.val) curr = curr.next;\n    if (prev.next === curr) prev = prev.next;\n    else prev.next = curr.next;\n  }\n  return dummy.next;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nfunction deleteDuplicates(head) {\n  // Remove all nodes with duplicates\n}`,
testCases: []},

"remove-linked-list-elements": {
description: `Remove all nodes with a given value from a linked list.\n\n**Example:** head = [1,2,6,3,4,5,6], val = 6 → [1,2,3,4,5]`,
solution: `## Dummy Head\n\n\`\`\`javascript\nfunction removeElements(head, val) {\n  const dummy = {next: head};\n  let curr = dummy;\n  while (curr.next) {\n    if (curr.next.val === val) curr.next = curr.next.next;\n    else curr = curr.next;\n  }\n  return dummy.next;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @param {number} val\n * @return {ListNode}\n */\nfunction removeElements(head, val) {\n  // Remove all nodes with given value\n}`,
testCases: []},

"remove-nth-node-from-end-of-list": {
description: `Remove the nth node from the end of a linked list and return the head.\n\n**Example:** head = [1,2,3,4,5], n = 2 → [1,2,3,5]`,
solution: `## Two Pointer (Gap of n)\n\n\`\`\`javascript\nfunction removeNthFromEnd(head, n) {\n  const dummy = {next: head};\n  let fast = dummy, slow = dummy;\n  for (let i = 0; i <= n; i++) fast = fast.next;\n  while (fast) { fast = fast.next; slow = slow.next; }\n  slow.next = slow.next.next;\n  return dummy.next;\n}\n\`\`\`\n\n**Time:** O(L) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @param {number} n\n * @return {ListNode}\n */\nfunction removeNthFromEnd(head, n) {\n  // Remove nth node from end\n}`,
testCases: []},

"reorder-list": {
description: `Reorder a linked list from L0→L1→...→Ln to L0→Ln→L1→Ln-1→L2→Ln-2→...\n\n**Example:** head = [1,2,3,4] → [1,4,2,3]`,
solution: `## Find Middle + Reverse + Merge\n\n\`\`\`javascript\nfunction reorderList(head) {\n  let slow = head, fast = head;\n  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }\n  let prev = null, curr = slow.next;\n  slow.next = null;\n  while (curr) { const next = curr.next; curr.next = prev; prev = curr; curr = next; }\n  let l1 = head, l2 = prev;\n  while (l2) { const n1 = l1.next, n2 = l2.next; l1.next = l2; l2.next = n1; l1 = n1; l2 = n2; }\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @return {void}\n */\nfunction reorderList(head) {\n  // Reorder linked list\n}`,
testCases: []},

"reverse-linked-list-ii": {
description: `Reverse the nodes of a linked list from position left to right.\n\n**Example:** head = [1,2,3,4,5], left=2, right=4 → [1,4,3,2,5]`,
solution: `## In-Place Reversal\n\n\`\`\`javascript\nfunction reverseBetween(head, left, right) {\n  const dummy = {next: head};\n  let prev = dummy;\n  for (let i = 0; i < left - 1; i++) prev = prev.next;\n  let curr = prev.next;\n  for (let i = 0; i < right - left; i++) {\n    const next = curr.next;\n    curr.next = next.next;\n    next.next = prev.next;\n    prev.next = next;\n  }\n  return dummy.next;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @param {number} left\n * @param {number} right\n * @return {ListNode}\n */\nfunction reverseBetween(head, left, right) {\n  // Reverse sublist from left to right\n}`,
testCases: []},

"reverse-nodes-in-k-group": {
description: `Reverse the nodes of a linked list k at a time. Nodes remaining less than k stay as-is.\n\n**Example:** head = [1,2,3,4,5], k = 2 → [2,1,4,3,5]`,
solution: `## Iterative K-Group Reversal\n\n\`\`\`javascript\nfunction reverseKGroup(head, k) {\n  const dummy = {next: head};\n  let prev = dummy;\n  while (true) {\n    let kth = prev;\n    for (let i = 0; i < k; i++) { kth = kth.next; if (!kth) return dummy.next; }\n    let curr = prev.next, next = curr.next;\n    for (let i = 0; i < k - 1; i++) {\n      curr.next = next.next; next.next = prev.next; prev.next = next; next = curr.next;\n    }\n    prev = curr;\n  }\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @param {number} k\n * @return {ListNode}\n */\nfunction reverseKGroup(head, k) {\n  // Reverse nodes in k-groups\n}`,
testCases: []},

"rotten-oranges-practice": {
description: `In a grid with fresh (1) and rotten (2) oranges, each minute rotten oranges infect adjacent fresh ones. Return the minimum minutes until no fresh orange remains, or -1.\n\n**Example:** grid = [[2,1,1],[1,1,0],[0,1,1]] → Output: 4`,
solution: `## Multi-source BFS\n\n\`\`\`javascript\nfunction orangesRotting(grid) {\n  const m = grid.length, n = grid[0].length, q = [];\n  let fresh = 0;\n  for (let i=0;i<m;i++) for (let j=0;j<n;j++) {\n    if (grid[i][j]===2) q.push([i,j]);\n    if (grid[i][j]===1) fresh++;\n  }\n  if (!fresh) return 0;\n  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];\n  let time = 0;\n  while (q.length && fresh) {\n    time++;\n    const size = q.length;\n    for (let k=0;k<size;k++) {\n      const [r,c] = q.shift();\n      for (const [dr,dc] of dirs) {\n        const nr=r+dr, nc=c+dc;\n        if (nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]===1) {\n          grid[nr][nc]=2; fresh--; q.push([nr,nc]);\n        }\n      }\n    }\n  }\n  return fresh ? -1 : time;\n}\n\`\`\`\n\n**Time:** O(mn) | **Space:** O(mn)`,
templateCode: `/**\n * @param {number[][]} grid\n * @return {number}\n */\nfunction orangesRotting(grid) {\n  // Minutes to rot all oranges\n}`,
testCases: [{args: [[[2,1,1],[1,1,0],[0,1,1]]], expected: 4}]},

"search-in-rotated-sorted-array": {
description: `Search for target in a rotated sorted array. Return its index, or -1.\n\n**Example:** nums = [4,5,6,7,0,1,2], target = 0 → Output: 4`,
solution: `## Modified Binary Search\n\n\`\`\`javascript\nfunction search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (nums[mid] === target) return mid;\n    if (nums[lo] <= nums[mid]) {\n      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;\n      else lo = mid + 1;\n    } else {\n      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;\n      else hi = mid - 1;\n    }\n  }\n  return -1;\n}\n\`\`\`\n\n**Time:** O(log n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n  // Search in rotated sorted array\n}`,
testCases: [{args: [[4,5,6,7,0,1,2], 0], expected: 4}, {args: [[4,5,6,7,0,1,2], 3], expected: -1}]},

"shortest-bridge": {
description: `Given a binary matrix with exactly two islands of 1s, return the minimum number of 0s to flip to connect the two islands.\n\n**Example:** grid = [[0,1],[1,0]] → Output: 1`,
solution: `## DFS to find island + BFS to expand\n\n\`\`\`javascript\nfunction shortestBridge(grid) {\n  const n = grid.length, q = [], dirs = [[0,1],[0,-1],[1,0],[-1,0]];\n  function dfs(r, c) {\n    if (r<0||r>=n||c<0||c>=n||grid[r][c]!==1) return;\n    grid[r][c] = 2; q.push([r, c]);\n    for (const [dr,dc] of dirs) dfs(r+dr, c+dc);\n  }\n  outer: for (let i=0;i<n;i++) for (let j=0;j<n;j++) if (grid[i][j]===1) { dfs(i,j); break outer; }\n  let steps = 0;\n  while (q.length) {\n    const size = q.length;\n    for (let k=0;k<size;k++) {\n      const [r,c] = q.shift();\n      for (const [dr,dc] of dirs) {\n        const nr=r+dr, nc=c+dc;\n        if (nr>=0&&nr<n&&nc>=0&&nc<n) {\n          if (grid[nr][nc]===1) return steps;\n          if (grid[nr][nc]===0) { grid[nr][nc]=2; q.push([nr,nc]); }\n        }\n      }\n    }\n    steps++;\n  }\n  return steps;\n}\n\`\`\`\n\n**Time:** O(n²) | **Space:** O(n²)`,
templateCode: `/**\n * @param {number[][]} grid\n * @return {number}\n */\nfunction shortestBridge(grid) {\n  // Min 0s to flip to connect two islands\n}`,
testCases: [{args: [[[0,1],[1,0]]], expected: 1}]},

"sort-list": {
description: `Sort a linked list in O(n log n) time and O(1) space.\n\n**Example:** head = [4,2,1,3] → [1,2,3,4]`,
solution: `## Merge Sort\n\n\`\`\`javascript\nfunction sortList(head) {\n  if (!head || !head.next) return head;\n  let slow = head, fast = head.next;\n  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }\n  const mid = slow.next; slow.next = null;\n  return merge(sortList(head), sortList(mid));\n}\nfunction merge(a, b) {\n  const d = {next:null}; let t = d;\n  while (a&&b) { if (a.val<=b.val) { t.next=a; a=a.next; } else { t.next=b; b=b.next; } t=t.next; }\n  t.next = a||b; return d.next;\n}\n\`\`\`\n\n**Time:** O(n log n) | **Space:** O(log n)`,
templateCode: `/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nfunction sortList(head) {\n  // Sort linked list\n}`,
testCases: []},

"split-array-largest-sum": {
description: `Given an array and integer k, split the array into k non-empty subarrays to minimize the largest sum among them.\n\n**Example:** nums = [7,2,5,10,8], k = 2 → Output: 18`,
solution: `## Binary Search on Answer\n\n\`\`\`javascript\nfunction splitArray(nums, k) {\n  let lo = Math.max(...nums), hi = nums.reduce((a,b)=>a+b,0);\n  while (lo < hi) {\n    const mid = (lo+hi)>>1;\n    let splits = 1, sum = 0;\n    for (const n of nums) { if (sum+n>mid) { splits++; sum=n; } else sum+=n; }\n    if (splits <= k) hi = mid; else lo = mid+1;\n  }\n  return lo;\n}\n\`\`\`\n\n**Time:** O(n log S) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nfunction splitArray(nums, k) {\n  // Minimize largest subarray sum\n}`,
testCases: [{args: [[7,2,5,10,8], 2], expected: 18}]},

"sum-of-subarray-minimums": {
description: `Given an array of integers, find the sum of min(subarray) for all contiguous subarrays. Return modulo 10^9+7.\n\n**Example:** arr = [3,1,2,4] → Output: 17`,
solution: `## Monotonic Stack (Contribution)\n\n\`\`\`javascript\nfunction sumSubarrayMins(arr) {\n  const MOD = 1e9+7, n = arr.length, stack = [];\n  let sum = 0;\n  for (let i = 0; i <= n; i++) {\n    while (stack.length && (i===n || arr[stack[stack.length-1]] >= arr[i])) {\n      const j = stack.pop();\n      const left = stack.length ? j - stack[stack.length-1] : j + 1;\n      const right = i - j;\n      sum = (sum + arr[j] * left * right) % MOD;\n    }\n    stack.push(i);\n  }\n  return sum;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {number[]} arr\n * @return {number}\n */\nfunction sumSubarrayMins(arr) {\n  // Sum of subarray minimums\n}`,
testCases: [{args: [[3,1,2,4]], expected: 17}]},

"super-egg-drop": {
description: `Given k eggs and n floors, find the minimum number of moves to determine the critical floor where an egg breaks.\n\n**Example:** k=2, n=6 → Output: 3`,
solution: `## DP: Moves-based approach\n\ndp[m][k] = max floors checkable with m moves and k eggs.\n\n\`\`\`javascript\nfunction superEggDrop(k, n) {\n  const dp = Array.from({length:n+1}, ()=>Array(k+1).fill(0));\n  let m = 0;\n  while (dp[m][k] < n) {\n    m++;\n    for (let j = 1; j <= k; j++) dp[m][j] = dp[m-1][j-1] + dp[m-1][j] + 1;\n  }\n  return m;\n}\n\`\`\`\n\n**Time:** O(kn) | **Space:** O(kn)`,
templateCode: `/**\n * @param {number} k\n * @param {number} n\n * @return {number}\n */\nfunction superEggDrop(k, n) {\n  // Min moves to find critical floor\n}`,
testCases: [{args: [2, 6], expected: 3}, {args: [1, 2], expected: 2}]},

"swim-in-rising-water": {
description: `Given an n×n grid where grid[i][j] represents elevation, find the minimum time t such that you can swim from (0,0) to (n-1,n-1) where you can only enter cells with elevation <= t.\n\n**Example:** grid = [[0,2],[1,3]] → Output: 3`,
solution: `## Binary Search + BFS / Dijkstra\n\n\`\`\`javascript\nfunction swimInWater(grid) {\n  const n = grid.length, dirs = [[0,1],[0,-1],[1,0],[-1,0]];\n  let lo = grid[0][0], hi = n*n-1;\n  while (lo < hi) {\n    const mid = (lo+hi)>>1;\n    const visited = Array.from({length:n}, ()=>Array(n).fill(false));\n    const q = [[0,0]]; visited[0][0] = true;\n    if (grid[0][0] > mid) { lo = mid+1; continue; }\n    while (q.length) {\n      const [r,c] = q.shift();\n      for (const [dr,dc] of dirs) {\n        const nr=r+dr,nc=c+dc;\n        if (nr>=0&&nr<n&&nc>=0&&nc<n&&!visited[nr][nc]&&grid[nr][nc]<=mid) { visited[nr][nc]=true; q.push([nr,nc]); }\n      }\n    }\n    if (visited[n-1][n-1]) hi = mid; else lo = mid+1;\n  }\n  return lo;\n}\n\`\`\`\n\n**Time:** O(n² log n) | **Space:** O(n²)`,
templateCode: `/**\n * @param {number[][]} grid\n * @return {number}\n */\nfunction swimInWater(grid) {\n  // Min time to swim from top-left to bottom-right\n}`,
testCases: [{args: [[[0,2],[1,3]]], expected: 3}]},

"text-justification": {
description: `Given an array of words and a maxWidth, format the text such that each line has exactly maxWidth characters and is fully justified.\n\n**Example:** words = ["This","is","an","example","of","text","justification."], maxWidth = 16`,
solution: `## Greedy Line Packing + Space Distribution\n\n\`\`\`javascript\nfunction fullJustify(words, maxWidth) {\n  const result = [];\n  let i = 0;\n  while (i < words.length) {\n    let j = i, lineLen = 0;\n    while (j < words.length && lineLen + words[j].length + (j-i) <= maxWidth) lineLen += words[j++].length;\n    const numWords = j - i, numSpaces = maxWidth - lineLen;\n    let line = words[i];\n    if (numWords === 1 || j === words.length) {\n      for (let k = i+1; k < j; k++) line += ' ' + words[k];\n      line += ' '.repeat(maxWidth - line.length);\n    } else {\n      const gaps = numWords - 1, spacePerGap = Math.floor(numSpaces / gaps), extra = numSpaces % gaps;\n      for (let k = 1; k < numWords; k++) line += ' '.repeat(spacePerGap + (k <= extra ? 1 : 0)) + words[i+k];\n    }\n    result.push(line); i = j;\n  }\n  return result;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {string[]} words\n * @param {number} maxWidth\n * @return {string[]}\n */\nfunction fullJustify(words, maxWidth) {\n  // Text justification\n}`,
testCases: []},

"the-celebrity-problem": {
description: `In a party of N people, a celebrity is someone known by everyone but knows no one. Given a knows(a, b) function, find the celebrity or return -1.\n\n**Example:** N=3, matrix=[[0,1,0],[0,0,0],[0,1,0]] → celebrity = 1`,
solution: `## Two Pointer Elimination\n\n\`\`\`javascript\nfunction findCelebrity(n, knows) {\n  let candidate = 0;\n  for (let i = 1; i < n; i++) if (knows(candidate, i)) candidate = i;\n  for (let i = 0; i < n; i++) {\n    if (i === candidate) continue;\n    if (knows(candidate, i) || !knows(i, candidate)) return -1;\n  }\n  return candidate;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number} n\n * @param {function} knows\n * @return {number}\n */\nfunction findCelebrity(n, knows) {\n  // Find celebrity in party\n}`,
testCases: []},

"the-kth-factor-of-n": {
description: `Given two positive integers n and k, return the kth factor of n, or -1 if n has fewer than k factors.\n\n**Example:** n = 12, k = 3 → Output: 3 (factors: 1,2,3,4,6,12)`,
solution: `## Simple Iteration\n\n\`\`\`javascript\nfunction kthFactor(n, k) {\n  for (let i = 1; i <= n; i++) {\n    if (n % i === 0 && --k === 0) return i;\n  }\n  return -1;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {number} n\n * @param {number} k\n * @return {number}\n */\nfunction kthFactor(n, k) {\n  // kth factor of n\n}\n\n// Sample: console.log(kthFactor(12, 3));`,
testCases: [{args: [12, 3], expected: 3}, {args: [7, 2], expected: 7}, {args: [4, 4], expected: -1}]},

"time-needed-to-inform-all-employees": {
description: `A company has n employees in a tree structure. Employee 0 is head. Return total time needed to inform all employees.\n\n**Example:** n=6, headID=2, manager=[2,2,-1,2,2,2], informTime=[0,0,1,0,0,0] → Output: 1`,
solution: `## DFS\n\n\`\`\`javascript\nfunction numOfMinutes(n, headID, manager, informTime) {\n  const children = Array.from({length:n}, ()=>[]);\n  for (let i=0;i<n;i++) if (manager[i]!==-1) children[manager[i]].push(i);\n  function dfs(id) {\n    let max = 0;\n    for (const child of children[id]) max = Math.max(max, dfs(child));\n    return informTime[id] + max;\n  }\n  return dfs(headID);\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(n)`,
templateCode: `/**\n * @param {number} n\n * @param {number} headID\n * @param {number[]} manager\n * @param {number[]} informTime\n * @return {number}\n */\nfunction numOfMinutes(n, headID, manager, informTime) {\n  // Time to inform all employees\n}`,
testCases: [{args: [6, 2, [2,2,-1,2,2,2], [0,0,1,0,0,0]], expected: 1}]},

"trie-data-structure": {
description: `Implement a Trie (prefix tree) with insert, search, and startsWith methods.\n\n**Example:** insert("apple"), search("apple")→true, search("app")→false, startsWith("app")→true`,
solution: `## Trie with Object Nodes\n\n\`\`\`javascript\nclass Trie {\n  constructor() { this.root = {}; }\n  insert(word) {\n    let node = this.root;\n    for (const c of word) { if (!node[c]) node[c] = {}; node = node[c]; }\n    node.$ = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (const c of word) { if (!node[c]) return false; node = node[c]; }\n    return !!node.$;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (const c of prefix) { if (!node[c]) return false; node = node[c]; }\n    return true;\n  }\n}\n\`\`\`\n\n**Time:** O(L) per operation | **Space:** O(total characters)`,
templateCode: `function Trie() {}\nTrie.prototype.insert = function(word) {};\nTrie.prototype.search = function(word) {};\nTrie.prototype.startsWith = function(prefix) {};`,
testCases: []},

"unique-binary-search-trees": {
description: `Given n, return the number of structurally unique BSTs that store values 1 to n.\n\n**Example:** n = 3 → Output: 5`,
solution: `## Catalan Number / DP\n\n\`\`\`javascript\nfunction numTrees(n) {\n  const dp = Array(n+1).fill(0);\n  dp[0] = dp[1] = 1;\n  for (let i = 2; i <= n; i++)\n    for (let j = 0; j < i; j++)\n      dp[i] += dp[j] * dp[i-1-j];\n  return dp[n];\n}\n\`\`\`\n\n**Time:** O(n²) | **Space:** O(n)`,
templateCode: `/**\n * @param {number} n\n * @return {number}\n */\nfunction numTrees(n) {\n  // Count unique BSTs with n nodes\n}`,
testCases: [{args: [3], expected: 5}, {args: [1], expected: 1}]},

"unique-binary-search-trees-ii": {
description: `Given n, generate all structurally unique BSTs that store values 1 to n.\n\n**Example:** n = 3 → Output: 5 different BST structures`,
solution: `## Recursive Generation\n\n\`\`\`javascript\nfunction generateTrees(n) {\n  function build(lo, hi) {\n    if (lo > hi) return [null];\n    const trees = [];\n    for (let i = lo; i <= hi; i++) {\n      for (const left of build(lo, i-1)) {\n        for (const right of build(i+1, hi)) {\n          trees.push({val: i, left, right});\n        }\n      }\n    }\n    return trees;\n  }\n  return n === 0 ? [] : build(1, n);\n}\n\`\`\`\n\n**Time:** O(4^n / n^(3/2)) | **Space:** O(4^n / n^(3/2))`,
templateCode: `/**\n * @param {number} n\n * @return {TreeNode[]}\n */\nfunction generateTrees(n) {\n  // Generate all unique BSTs\n}`,
testCases: []},

"valid-square": {
description: `Given four points, determine if they form a valid square (4 equal sides, 4 right angles).\n\n**Example:** p1=[0,0], p2=[1,1], p3=[1,0], p4=[0,1] → true`,
solution: `## Distance Check\n\nA valid square has 4 equal sides and 2 equal diagonals.\n\n\`\`\`javascript\nfunction validSquare(p1, p2, p3, p4) {\n  function dist(a, b) { return (a[0]-b[0])**2 + (a[1]-b[1])**2; }\n  const dists = [dist(p1,p2),dist(p1,p3),dist(p1,p4),dist(p2,p3),dist(p2,p4),dist(p3,p4)].sort((a,b)=>a-b);\n  return dists[0] > 0 && dists[0]===dists[1] && dists[1]===dists[2] && dists[2]===dists[3] && dists[4]===dists[5];\n}\n\`\`\`\n\n**Time:** O(1) | **Space:** O(1)`,
templateCode: `/**\n * @param {number[]} p1\n * @param {number[]} p2\n * @param {number[]} p3\n * @param {number[]} p4\n * @return {boolean}\n */\nfunction validSquare(p1, p2, p3, p4) {\n  // Check if 4 points form a valid square\n}`,
testCases: [{args: [[0,0],[1,1],[1,0],[0,1]], expected: true}]},

"vertical-order-traversal-of-a-binary-tree": {
description: `Given a binary tree, return the vertical order traversal. Nodes at the same position are sorted by value.\n\n**Example:** root = [3,9,20,null,null,15,7] → [[9],[3,15],[20],[7]]`,
solution: `## BFS with Column Tracking\n\n\`\`\`javascript\nfunction verticalTraversal(root) {\n  const nodes = [];\n  function dfs(node, row, col) {\n    if (!node) return;\n    nodes.push([col, row, node.val]);\n    dfs(node.left, row+1, col-1);\n    dfs(node.right, row+1, col+1);\n  }\n  dfs(root, 0, 0);\n  nodes.sort((a,b) => a[0]-b[0] || a[1]-b[1] || a[2]-b[2]);\n  const result = []; let prevCol = -Infinity;\n  for (const [col,,val] of nodes) {\n    if (col !== prevCol) { result.push([]); prevCol = col; }\n    result[result.length-1].push(val);\n  }\n  return result;\n}\n\`\`\`\n\n**Time:** O(n log n) | **Space:** O(n)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {number[][]}\n */\nfunction verticalTraversal(root) {\n  // Vertical order traversal\n}`,
testCases: []},

"recover-binary-search-tree": {
description: `Two nodes of a BST are swapped by mistake. Recover the tree without changing its structure.\n\n**Example:** root = [1,3,null,null,2] → [3,1,null,null,2]`,
solution: `## Morris Inorder / Stack Inorder\n\nFind two nodes where inorder sequence is violated.\n\n\`\`\`javascript\nfunction recoverTree(root) {\n  let first = null, second = null, prev = {val: -Infinity};\n  function inorder(node) {\n    if (!node) return;\n    inorder(node.left);\n    if (node.val < prev.val) {\n      if (!first) first = prev;\n      second = node;\n    }\n    prev = node;\n    inorder(node.right);\n  }\n  inorder(root);\n  [first.val, second.val] = [second.val, first.val];\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(h)`,
templateCode: `/**\n * @param {TreeNode} root\n * @return {void}\n */\nfunction recoverTree(root) {\n  // Recover BST with two swapped nodes\n}`,
testCases: []},

"redundant-connection": {
description: `Given an undirected graph that started as a tree with one extra edge, find that extra edge.\n\n**Example:** edges = [[1,2],[1,3],[2,3]] → Output: [2,3]`,
solution: `## Union-Find\n\n\`\`\`javascript\nfunction findRedundantConnection(edges) {\n  const parent = Array.from({length: edges.length+1}, (_,i) => i);\n  function find(x) { return parent[x] === x ? x : (parent[x] = find(parent[x])); }\n  for (const [u, v] of edges) {\n    if (find(u) === find(v)) return [u, v];\n    parent[find(u)] = find(v);\n  }\n}\n\`\`\`\n\n**Time:** O(n α(n)) | **Space:** O(n)`,
templateCode: `/**\n * @param {number[][]} edges\n * @return {number[]}\n */\nfunction findRedundantConnection(edges) {\n  // Find the redundant edge\n}`,
testCases: [{args: [[[1,2],[1,3],[2,3]]], expected: [2,3]}]},

"partition-list": {
description: `Given a linked list and a value x, partition it so all nodes < x come before nodes >= x.\n\n**Example:** head = [1,4,3,2,5,2], x = 3 → [1,2,2,4,3,5]`,
solution: `## Two Lists\n\n\`\`\`javascript\nfunction partition(head, x) {\n  const before = {next:null}, after = {next:null};\n  let b = before, a = after;\n  while (head) {\n    if (head.val < x) { b.next = head; b = b.next; }\n    else { a.next = head; a = a.next; }\n    head = head.next;\n  }\n  a.next = null; b.next = after.next;\n  return before.next;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {ListNode} head\n * @param {number} x\n * @return {ListNode}\n */\nfunction partition(head, x) {\n  // Partition list around x\n}`,
testCases: []},

"populating-next-right-pointers-in-each-node": {
description: `Given a perfect binary tree, populate each next pointer to point to its next right node. Set next to null if no next right node.\n\n**Example:** root = [1,2,3,4,5,6,7] → each node's next points to right sibling`,
solution: `## Level-by-Level Using Next Pointers\n\n\`\`\`javascript\nfunction connect(root) {\n  if (!root) return root;\n  let leftmost = root;\n  while (leftmost.left) {\n    let curr = leftmost;\n    while (curr) {\n      curr.left.next = curr.right;\n      if (curr.next) curr.right.next = curr.next.left;\n      curr = curr.next;\n    }\n    leftmost = leftmost.left;\n  }\n  return root;\n}\n\`\`\`\n\n**Time:** O(n) | **Space:** O(1)`,
templateCode: `/**\n * @param {Node} root\n * @return {Node}\n */\nfunction connect(root) {\n  // Connect next right pointers\n}`,
testCases: []},
};

// Apply
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
  let c = false;
  if (content.templateCode && (!meta.templateCode || meta.templateCode.includes('Write your solution here'))) { meta.templateCode = content.templateCode; c = true; }
  if (content.testCases?.length > 0 && (!meta.testCases || meta.testCases.length === 0)) { meta.testCases = content.testCases; c = true; }
  if (c) fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
  applied++;
}
console.log(`Applied content for ${applied} problems`);
