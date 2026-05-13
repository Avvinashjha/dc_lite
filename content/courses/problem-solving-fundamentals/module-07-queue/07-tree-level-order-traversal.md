# Binary Tree Level-Order Traversal

**LeetCode 102.** Given the root of a binary tree, return its **level-order traversal** — the node values grouped by level, from the root down.

```text
        3
       / \
      9   20
         /  \
        15   7

Output: [[3], [9, 20], [15, 7]]
```

This is the canonical BFS-on-a-tree interview problem. It also teaches the **level-by-level** BFS variant we previewed in the last lesson.

## Why a queue is perfect here

A tree's children are naturally discovered one parent at a time. If we put the root in a queue, dequeue it, and enqueue both children, we are exploring in the "ring 0, then ring 1, then ring 2…" pattern that BFS guarantees.

```text
Initial queue:  [3]

Dequeue 3 — current level = [3]
Enqueue children 9, 20 — next level = [9, 20]

Dequeue 9, 20 — current level = [9, 20]
Enqueue children of 9 (none) and of 20 (15, 7)  — next level = [15, 7]

Dequeue 15, 7 — current level = [15, 7]
No children. Queue empty. Done.
```

## The code — level-by-level BFS

```javascript
function levelOrder(root) {
  if (root === null) return [];

  const result = [];
  let level = [root];

  while (level.length > 0) {
    const values = [];
    const nextLevel = [];

    for (const node of level) {
      values.push(node.val);
      if (node.left)  nextLevel.push(node.left);
      if (node.right) nextLevel.push(node.right);
    }

    result.push(values);
    level = nextLevel;
  }
  return result;
}
```

Two arrays in each iteration:

- `level` — nodes at the current depth, in left-to-right order.
- `nextLevel` — children of all nodes in `level`, in left-to-right order.

Swapping `level = nextLevel` at the end of each iteration advances down the tree.

## Walkthrough

```text
Tree:
        3
       / \
      9   20
         /  \
        15   7

Iteration 1: level = [3]
  visit 3 -> values=[3]
  nextLevel = [9, 20]
  result = [[3]]

Iteration 2: level = [9, 20]
  visit 9  -> values=[9]     (no children)
  visit 20 -> values=[9, 20] (add 15, 7)
  nextLevel = [15, 7]
  result = [[3], [9, 20]]

Iteration 3: level = [15, 7]
  visit 15 -> values=[15]
  visit 7  -> values=[15, 7]
  nextLevel = []
  result = [[3], [9, 20], [15, 7]]

Iteration 4: level empty -> stop.

return [[3], [9, 20], [15, 7]]
```

## Alternative — single queue with size snapshot

If you prefer a single queue, you can still separate levels using the **queue length at the start of each level**:

```javascript
function levelOrder(root) {
  if (root === null) return [];
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const values = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      values.push(node.val);
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(values);
  }
  return result;
}
```

Capturing `levelSize` **before** the inner loop locks in how many nodes belong to the current level — even as we enqueue more during the iteration. Functionally equivalent; picks up the `shift()` cost (use a head index in large inputs).

## Complexity

- **Time:** O(n). Each node is enqueued and dequeued once.
- **Space:** O(w) where `w` is the maximum **width** of the tree. For a balanced tree of `n` nodes, `w ≈ n / 2`, so worst-case space is O(n).

## Variants — same engine, different output

Once you have the level-by-level traversal, many follow-up problems drop out:

- **LC 107 Level Order Traversal II** — return levels from leaves up. Just reverse the result at the end.
- **LC 103 Zigzag Level Order** — alternate left-to-right and right-to-left per level. Push into `values` either front or back based on level index parity.
- **LC 199 Right Side View** — for each level, keep the last (or first, depending on side) node's value.
- **LC 637 Average of Levels** — accumulate sum and count per level.
- **LC 515 Largest Value in Each Row** — track max per level.

All of them use the same two-array (or `levelSize`) BFS skeleton.

## A common bug — nested recursion disguised as BFS

Beginners sometimes write this:

```javascript
// WRONG: this is DFS collecting by depth, not BFS
function levelOrder(root) {
  const result = [];
  function go(node, depth) {
    if (!node) return;
    if (!result[depth]) result[depth] = [];
    result[depth].push(node.val);
    go(node.left, depth + 1);
    go(node.right, depth + 1);
  }
  go(root, 0);
  return result;
}
```

It **happens to produce the same output** on small trees, but it's DFS in disguise — the traversal order is not level-by-level (the values within each level are still left-to-right thanks to left-before-right recursion, but the visit order across levels is depth-first). For many interview problems (e.g., LC 199 Right Side View with careful accounting) the subtle difference bites.

Prefer an explicit queue so the BFS shape is visible in the code.

## Common bugs

1. **Forgetting to check `node.left` / `node.right` for `null`** before enqueuing — pushes a `null` that later crashes `node.val`.
2. **Not handling `root === null`** up front — returning `[[]]` instead of `[]` is a common off-by-one.
3. **Using `shift()` in a very deep tree** without swapping for a head-index queue, turning BFS into O(n²).

:::quiz
question: Which data structure makes level-order traversal natural?
options:
  - A queue, because it processes nodes in the order they are discovered.
  - A stack.
answer: 0
explanation: FIFO order corresponds to exploring the tree ring-by-ring; a stack would give depth-first.
:::

:::quiz
question: In the single-queue variant, capturing `levelSize = queue.length` at the start of the loop:
options:
  - Locks in how many nodes belong to the current level, so later enqueues don't bleed into it.
  - Is unnecessary; the loop already handles that.
answer: 0
explanation: Without the snapshot, newly-enqueued children would be consumed as if they were on the current level.
:::

:::quiz
question: Time and space complexity of level-order traversal:
options:
  - Time O(n); space O(w) where w is the tree's maximum width.
  - Time O(n log n); space O(log n).
answer: 0
explanation: Each node is processed once; the queue holds at most one full level.
:::

:::exercise
title: Implement levelOrder
description: Implement `levelOrder(root)` returning an array of arrays of node values grouped by level. Handle the empty tree case.
starterCode: |
  // TreeNode: { val, left, right }

  function levelOrder(root) {
    if (root === null) return [];
    const result = [];
    let level = [root];
    // while level not empty:
    //   build values and nextLevel; push values to result; advance level
    return result;
  }

  // Test (build a small tree)
  const root = {
    val: 3,
    left:  { val: 9,  left: null, right: null },
    right: {
      val: 20,
      left:  { val: 15, left: null, right: null },
      right: { val: 7,  left: null, right: null }
    }
  };
  console.log(levelOrder(root)); // [[3], [9, 20], [15, 7]]
  console.log(levelOrder(null)); // []
:::

## Practice

- [Binary Tree Level Order Traversal](/problems/binary-tree-level-order-traversal)
