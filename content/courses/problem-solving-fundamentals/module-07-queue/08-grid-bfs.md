# Grid BFS (Shortest Path on a Grid)

Grids are graphs in disguise. Each cell is a node; each cell's neighbors are its 4 (or sometimes 8) adjacent cells. BFS on a grid is one of the **most frequently asked** interview patterns — it covers flood fill, shortest path in a binary matrix, shortest path with obstacles, and dozens of variants.

This lesson walks through **LC 1091 Shortest Path in Binary Matrix** and **LC 733 Flood Fill** as two representative examples. Once you internalize the template, every grid-BFS problem is a plug-and-play variation.

## The 4-direction trick

Instead of writing four `if` statements for N/E/S/W neighbors, iterate over a direction array:

```javascript
const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];   // N, S, W, E
// For 8-directional (including diagonals):
const DIRS8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
```

Then:

```javascript
for (const [dr, dc] of DIRS) {
  const nr = r + dr;
  const nc = c + dc;
  if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && /* valid */) {
    // enqueue (nr, nc)
  }
}
```

Clean, readable, and extends to 8-directional by swapping the array.

## Example 1 — Flood Fill (LC 733)

Replace all cells in a connected region with a new color. Classic paint-bucket.

```javascript
function floodFill(image, sr, sc, newColor) {
  const rows = image.length, cols = image[0].length;
  const oldColor = image[sr][sc];
  if (oldColor === newColor) return image;     // no-op edge case

  const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const queue = [[sr, sc]];
  image[sr][sc] = newColor;

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (
        nr >= 0 && nr < rows &&
        nc >= 0 && nc < cols &&
        image[nr][nc] === oldColor
      ) {
        image[nr][nc] = newColor;   // mark visited by recoloring
        queue.push([nr, nc]);
      }
    }
  }
  return image;
}
```

Notice we **mark cells visited by recoloring them** — no separate `visited` set needed. That's a common grid-BFS trick when you're allowed to mutate the input.

The `if (oldColor === newColor) return image;` guard is important: without it, we'd loop forever because the "visited via recolor" trick doesn't fire when the color doesn't change.

## Example 2 — Shortest Path in Binary Matrix (LC 1091)

Given an `n × n` binary grid where `0 = open` and `1 = wall`, find the shortest path from `(0, 0)` to `(n-1, n-1)`, moving in 8 directions. Return `-1` if impossible.

```javascript
function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n-1][n-1] === 1) return -1;

  const DIRS = [
    [-1,-1],[-1, 0],[-1, 1],
    [ 0,-1],        [ 0, 1],
    [ 1,-1],[ 1, 0],[ 1, 1],
  ];

  const dist = Array.from({ length: n }, () => new Array(n).fill(-1));
  dist[0][0] = 1;                          // path length includes start cell
  const queue = [[0, 0]];

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    if (r === n - 1 && c === n - 1) return dist[r][c];

    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (
        nr >= 0 && nr < n &&
        nc >= 0 && nc < n &&
        grid[nr][nc] === 0 &&
        dist[nr][nc] === -1
      ) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
  return -1;
}
```

Here we use a **`dist[][]` matrix** both as the visited marker and as the distance — `-1` means unvisited. The moment we dequeue the target, we return its distance. (We could also check on enqueue for early termination.)

## Walkthrough — shortest path

```text
grid = [
  [0, 0, 0],
  [1, 1, 0],
  [1, 1, 0],
]

Start (0,0), target (2,2). 8-directional.

dist[0][0]=1, queue=[(0,0)]

Dequeue (0,0):
  Neighbors: (0,1)=0 dist=2, (1,1)=1 blocked, (1,0)=1 blocked
  queue=[(0,1)]
  dist=[[1,2,-1],[-1,-1,-1],[-1,-1,-1]]

Dequeue (0,1):
  Neighbors: (0,0) visited, (0,2)=0 dist=3, (1,0) blocked, (1,1) blocked, (1,2)=0 dist=3
  queue=[(0,2),(1,2)]

Dequeue (0,2):
  Neighbors: (0,1) visited, (1,1) blocked, (1,2) visited
  queue=[(1,2)]

Dequeue (1,2):
  Neighbors: (0,1) visited, (0,2) visited, (1,1) blocked, (2,1) blocked, (2,2)=0 dist=4
  queue=[(2,2)]

Dequeue (2,2): target! return 4.
```

## Why BFS and not DFS on a grid?

Two reasons:

1. **Shortest path.** DFS might find **a** path but not the shortest. BFS's ring-by-ring traversal guarantees shortest first.
2. **Stack depth.** DFS on large grids can blow the call stack. BFS maintains state on the heap via its queue.

Use DFS only when:

- You just need any path (or just "is there a path?").
- You're counting connected components and don't care about distances.
- The grid is small enough to avoid stack overflow.

## Complexity

- **Time:** O(R · C). Each cell is enqueued at most once.
- **Space:** O(R · C) worst case for the queue and distance matrix.

Don't be seduced into thinking grid BFS is "just" `O(cells)` — always communicate both `R * C` and the queue space.

## Common bugs

1. **Using `shift()` on a large grid.** For a 500×500 grid, that's up to 250k shifts, each O(n). Swap to a head-index queue or use `pop()` with a reverse-order strategy (BFS needs FIFO, so head-index is the simple fix).
2. **Forgetting diagonals** when the problem asks for 8-directional movement.
3. **Off-by-one on bounds.** `nr < rows` and `nc < cols` — not `<=`.
4. **Marking the source as visited after enqueueing others.** Race condition — always mark the source before the BFS loop starts.
5. **Wrong initial distance.** LC 1091 counts cells, not edges; the start contributes 1 to the path length.

## Problem recognition

Clues that a grid BFS is the right approach:

- "Shortest path from A to B."
- "Minimum number of moves."
- "Distance from the nearest X."
- "Spread / contagion / fire propagation." (multi-source BFS — next lesson)
- "Flood fill / paint bucket."
- "Connected component size."

If the problem is phrased with distances or "minimum steps," start sketching a BFS. Even if the final solution turns out to be Dijkstra or A*, the BFS skeleton is always the right starting point for unweighted grids.

:::quiz
question: Why use BFS rather than DFS for shortest-path-on-a-grid problems?
options:
  - BFS visits cells in non-decreasing order of distance, so the first time a target is reached is via a shortest path.
  - DFS is slower per step.
answer: 0
explanation: BFS guarantees shortest-first on unweighted graphs; DFS can find any path but not necessarily the shortest.
:::

:::quiz
question: What's the purpose of the `if (oldColor === newColor) return image` guard in flood fill?
options:
  - To prevent an infinite loop — if we don't recolor, the "visited by recoloring" invariant doesn't fire and cells enqueue themselves repeatedly.
  - To save time.
answer: 0
explanation: Without it, neighbors keep matching oldColor after "recoloring," so they're re-enqueued endlessly.
:::

:::quiz
question: For grid BFS on an R × C grid, overall time and space complexity:
options:
  - Time O(R · C); space O(R · C).
  - Time O((R · C)²); space O(R + C).
answer: 0
explanation: Each cell is enqueued and dequeued at most once; the queue and dist matrix are bounded by total cells.
:::

:::exercise
title: Shortest path in a binary matrix
description: Implement `shortestPathBinaryMatrix(grid)` using grid BFS with 8 directions, a `dist[][]` matrix, and an iterative queue.
starterCode: |
  function shortestPathBinaryMatrix(grid) {
    const n = grid.length;
    if (grid[0][0] === 1 || grid[n-1][n-1] === 1) return -1;
    const DIRS = [
      [-1,-1],[-1,0],[-1,1],
      [ 0,-1],       [ 0,1],
      [ 1,-1],[ 1,0],[ 1,1],
    ];
    const dist = Array.from({ length: n }, () => new Array(n).fill(-1));
    dist[0][0] = 1;
    const queue = [[0, 0]];
    // standard BFS loop, return dist[n-1][n-1] when target reached
    return -1;
  }

  console.log(shortestPathBinaryMatrix([[0,1],[1,0]]));          // 2
  console.log(shortestPathBinaryMatrix([[0,0,0],[1,1,0],[1,1,0]])); // 4
  console.log(shortestPathBinaryMatrix([[1,0,0],[1,1,0],[1,1,0]])); // -1
:::

## Practice

- [Flood Fill](/problems/flood-fill)
