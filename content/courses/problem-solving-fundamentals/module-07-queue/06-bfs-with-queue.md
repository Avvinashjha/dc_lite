# The BFS Pattern with a Queue

**Breadth-First Search (BFS)** is the algorithm a queue was invented for. It explores a graph (or tree) **level by level**, visiting all nodes at distance `k` before any node at distance `k + 1`. That "process-in-arrival-order" behavior is FIFO — which is exactly what a queue provides.

This lesson introduces the generic BFS template. The next three lessons apply it to trees, grids, and multi-source grids.

## The intuition

Imagine dropping a pebble in a still pond. Ripples spread outward one ring at a time. BFS is the algorithmic version: start at a source, visit all nodes one edge away, then all nodes two edges away, and so on.

```text
Source = 1

Ring 0:  1
Ring 1:  2, 3, 4        (neighbors of 1)
Ring 2:  5, 6, 7        (neighbors of ring 1 not yet seen)
...
```

Because BFS visits nodes in non-decreasing order of distance, **the first time it reaches a node is via a shortest path** (measured in number of edges). That's why BFS is the go-to algorithm for **shortest-path-by-edge-count** problems on unweighted graphs.

## The generic template

```javascript
function bfs(start, getNeighbors) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift();

    // ... process(node) ...

    for (const next of getNeighbors(node)) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
}
```

Three ingredients — present in every BFS you'll ever write:

1. A **queue** of nodes to visit (seeded with the source).
2. A **visited** set (or `dist[]` array, or coloring) so each node is enqueued at most once.
3. A **neighbor function** that yields adjacent nodes.

Note `queue.shift()` is O(n); for competitive-programming inputs swap for `queue[head++]` with a head index, or use the linked-list queue from lesson 04. For small/medium inputs the naive version is usually fine.

## Tracking distance

The template above doesn't track **distance from the source**. Two standard ways to add it:

### (a) Store `(node, dist)` pairs in the queue

```javascript
function shortestPath(start, target, getNeighbors) {
  const visited = new Set([start]);
  const queue = [[start, 0]];

  while (queue.length > 0) {
    const [node, dist] = queue.shift();
    if (node === target) return dist;

    for (const next of getNeighbors(node)) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([next, dist + 1]);
      }
    }
  }
  return -1;
}
```

Simple, easy to reason about, slightly more memory per queue entry.

### (b) Process the queue **one level at a time**

```javascript
function shortestPath(start, target, getNeighbors) {
  const visited = new Set([start]);
  let queue = [start];
  let dist = 0;

  while (queue.length > 0) {
    const next = [];
    for (const node of queue) {
      if (node === target) return dist;
      for (const nb of getNeighbors(node)) {
        if (!visited.has(nb)) {
          visited.add(nb);
          next.push(nb);
        }
      }
    }
    queue = next;
    dist++;
  }
  return -1;
}
```

Preferred when you need **level-by-level** information (e.g., tree level-order traversal). Separates "current level" from "next level" explicitly, which is easier to reason about.

### (c) Parallel `dist[]` array

For graphs with integer node IDs:

```javascript
const dist = new Array(n).fill(-1);
dist[start] = 0;
const queue = [start];
while (queue.length > 0) {
  const node = queue.shift();
  for (const nb of neighbors(node)) {
    if (dist[nb] === -1) {
      dist[nb] = dist[node] + 1;
      queue.push(nb);
    }
  }
}
```

No pairs, no extra level bookkeeping — `dist[]` is both the visited marker and the distance.

## Complexity

For a graph with `V` vertices and `E` edges:

- **Time:** O(V + E). Each node is visited once; each edge is traversed at most twice (once from each endpoint).
- **Space:** O(V) for the visited set and the queue.

## Why not DFS for shortest path?

DFS dives down one branch before exploring siblings. The first time it reaches a node, it has **some** path — but not necessarily the shortest. BFS, by contrast, expands in uniform rings of distance, guaranteeing shortest-path-first.

DFS has its own uses (cycle detection, topological sort, connected components in some styles) — but "unweighted shortest path" is BFS territory.

## A common pitfall — mark visited **on enqueue**, not on dequeue

```javascript
// WRONG: marks visited on dequeue
while (queue.length > 0) {
  const node = queue.shift();
  if (visited.has(node)) continue;
  visited.add(node);
  for (const nb of neighbors(node)) queue.push(nb);
}
```

This works for correctness but queues the **same node multiple times** before the first visit, blowing memory up. Mark visited **before** pushing to the queue.

## BFS vs DFS at a glance

| | BFS | DFS |
| --- | --- | --- |
| Data structure | Queue | Stack (explicit or call stack) |
| Order | Level-by-level | Branch-by-branch |
| Shortest-path (unweighted) | ✓ | ✗ |
| Memory (worst case) | O(width) | O(depth) |
| Natural recursion | No | Yes |

## Checklist before writing a BFS

1. What is the **source** (or sources)?
2. What is the **neighbor** function?
3. What does **visited** mean (is it a `Set`, `Map`, or a matrix of booleans)?
4. Do I need **distance**? If so, which of (a), (b), (c) above fits best?
5. What is the **termination condition** (visit all, find a target, fill a dist array)?

The next three lessons instantiate this checklist for trees, single-source grid BFS, and multi-source grid BFS.

:::quiz
question: Why does BFS find shortest paths in unweighted graphs?
options:
  - It visits nodes in non-decreasing order of distance, so the first time a node is reached is via a shortest path.
  - It sorts edges before exploring.
answer: 0
explanation: The FIFO queue guarantees that nodes are dequeued in the order of their distance from the source.
:::

:::quiz
question: Marking a node visited when it is DEQUEUED instead of when it is ENQUEUED leads to:
options:
  - Correct results but the queue may hold duplicates of the same node, wasting memory and time.
  - Incorrect shortest-path distances.
answer: 0
explanation: Correctness still holds with a `continue` on already-visited; efficiency suffers due to duplicate enqueues.
:::

:::quiz
question: Complexity of BFS on a graph with V vertices and E edges (using an adjacency list):
options:
  - O(V + E)
  - O(V · E)
answer: 0
explanation: Each vertex is visited once and each edge is considered once from each endpoint.
:::

:::exercise
title: Generic BFS template
description: Write a generic `bfs(start, getNeighbors, processNode)` function that processes each reachable node in BFS order. Mark visited on enqueue; use a simple array queue.
starterCode: |
  function bfs(start, getNeighbors, processNode) {
    const visited = new Set([start]);
    const queue = [start];
    while (queue.length > 0) {
      const node = queue.shift();
      processNode(node);
      for (const nb of getNeighbors(node)) {
        if (!visited.has(nb)) {
          visited.add(nb);
          queue.push(nb);
        }
      }
    }
  }

  // Tiny graph: 1 — 2 — 3 — 4; 2 — 5
  const adj = { 1: [2], 2: [1, 3, 5], 3: [2, 4], 4: [3], 5: [2] };
  bfs(1, n => adj[n], n => console.log(n)); // 1, 2, 3, 5, 4 (order of ring discovery)
:::

## Practice

No required practice for this lesson. The next lesson applies BFS to the most common tree problem.
