# Multi-Source BFS (Rotting Oranges Pattern)

A standard BFS starts from **one** source. But many problems ask: "for each cell, what is its distance to the **nearest** of several sources?" Run one BFS per source and you get O(S · R · C) — too slow. The trick: **seed the queue with all sources at distance 0 simultaneously**, then run a single BFS. Total cost stays at O(R · C).

This is called **multi-source BFS**. It's the pattern behind LeetCode 994 (Rotting Oranges), 542 (01 Matrix), 286 (Walls and Gates), and dozens of "fire spreads / ice melts / infection" problems.

## The mental model

Imagine all sources are **firefighters** racing outward at the same speed. The nearest fresh cell to any firefighter is reached in one step, regardless of which firefighter gets there — the queue handles the cross-talk automatically because BFS processes entries in distance order.

Since the queue already encodes distance = number of BFS layers, seeding it with all sources at layer 0 gives each cell the minimum over all sources for free.

## Canonical problem — Rotting Oranges (LC 994)

You have a grid with:

- `0` — empty cell.
- `1` — fresh orange.
- `2` — rotten orange.

Every minute, each rotten orange rots its 4 orthogonal neighbors that are fresh. Return the minimum number of minutes until **no fresh orange remains**, or `-1` if impossible.

```text
Initial:
2 1 1
1 1 0
0 1 1

Minute 1: the rotten (0,0) rots (0,1) and (1,0).
2 2 1
2 1 0
0 1 1

Minute 2: (0,1) rots (0,2); (1,0) has no fresh orthogonal neighbor; (1,1) becomes rotten from (0,1) or (1,0).
2 2 2
2 2 0
0 1 1

Minute 3: (1,1) rots (2,1); (0,2) has no fresh orthogonal neighbor (below is 0).
2 2 2
2 2 0
0 2 1

Minute 4: (2,1) rots (2,2).
2 2 2
2 2 0
0 2 2

All fresh oranges are now rotten. Answer: 4.
```

## The code

```javascript
function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const queue = [];
  let fresh = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c, 0]);   // [row, col, minute]
      else if (grid[r][c] === 1) fresh++;
    }
  }

  let minutes = 0;

  while (queue.length > 0) {
    const [r, c, t] = queue.shift();
    minutes = t;

    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (
        nr >= 0 && nr < rows &&
        nc >= 0 && nc < cols &&
        grid[nr][nc] === 1
      ) {
        grid[nr][nc] = 2;       // rot and mark visited
        fresh--;
        queue.push([nr, nc, t + 1]);
      }
    }
  }

  return fresh === 0 ? minutes : -1;
}
```

Three things to notice:

1. The initial pass enqueues **every** rotten cell at minute 0. That's multi-source BFS.
2. We keep a `fresh` counter. If it isn't zero at the end, some fresh orange was unreachable → return `-1`.
3. We mutate `grid` to mark cells as visited. Cleaner than a separate visited matrix, allowed since mutation is implied by the problem.

## Walkthrough

```text
Initial grid:
2 1 1
1 1 0
0 1 1

Initial scan:
  queue = [(0,0,0)]
  fresh = 6

Dequeue (0,0,0) minute=0
  neighbors: (0,1)=1 -> rot, queue+= (0,1,1), fresh=5
             (1,0)=1 -> rot, queue+= (1,0,1), fresh=4

Dequeue (0,1,1) minute=1
  neighbors: (0,2)=1 -> rot, queue+= (0,2,2), fresh=3
             (1,1)=1 -> rot, queue+= (1,1,2), fresh=2

Dequeue (1,0,1) minute=1
  no fresh neighbors

Dequeue (0,2,2) minute=2
  (1,2)=0 skip

Dequeue (1,1,2) minute=2
  (2,1)=1 -> rot, queue+= (2,1,3), fresh=1

Dequeue (2,1,3) minute=3
  (2,2)=1 -> rot, queue+= (2,2,4), fresh=0

Dequeue (2,2,4) minute=4
  no fresh neighbors

return fresh===0 ? 4 : -1 -> 4
```

## Alternative — level-by-level variant

Some prefer the "process the whole level at once, increment minute after" version:

```javascript
function orangesRotting(grid) {
  // ... setup fresh and queue with only (r, c) pairs, no minute ...
  let minutes = 0;
  while (queue.length > 0 && fresh > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of DIRS) {
        // ... same neighbor handling, no time in the tuple ...
      }
    }
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}
```

Equivalent in complexity; matches the "levelSize snapshot" pattern from tree level-order traversal. Some find it easier to reason about; others prefer the per-entry minute. Either is correct.

## Related multi-source problems

- **LC 542 01 Matrix.** Return, for each cell, the distance to the nearest `0`. Seed the queue with all `0`s; run BFS updating `dist[nr][nc] = dist[r][c] + 1`.
- **LC 286 Walls and Gates.** Fill each empty room with the distance to its nearest gate. Same pattern: seed the queue with all gates at distance 0.
- **LC 1162 As Far from Land as Possible.** Maximum distance from any water cell to the nearest land cell. Seed the queue with all land cells and track the deepest layer reached.

All of them reduce to: **seed with all sources, run one BFS, compute either a per-cell distance or a final maximum**.

## Why the single-BFS approach works

Think of the queue as a **priority queue sorted by distance**. Since BFS dequeues in FIFO order, and layer-0 items are enqueued before layer-1 items, and layer-1 before layer-2, the **first time** any cell is reached is its distance to the **nearest** source. Multiple sources don't break that because they all sit at layer 0 simultaneously; cross-talk is handled automatically by the visited check.

## Complexity

- **Time:** O(R · C). Each cell is enqueued once.
- **Space:** O(R · C) for the queue in the worst case (all cells rotten, enqueued at start).

## Common bugs

1. **Enqueueing each source with its own BFS loop.** O(S · R · C) — much too slow.
2. **Forgetting to count `fresh`.** Without it, you can't tell the difference between "all rotted successfully" and "some unreachable fresh oranges left."
3. **Off-by-one on minutes.** The LC 994 answer is minutes, not BFS layers — the very first layer is the initially-rotten cells at minute 0.
4. **Initializing `minutes` to `1`** because of 1-based thinking. Start at 0; update per dequeued entry or per level.
5. **Using a visited set plus mutation.** Pick one — either mutate the grid in place or use a separate visited structure. Using both leads to inconsistency bugs.

:::quiz
question: Why does multi-source BFS with all sources at layer 0 compute each cell's distance to the NEAREST source in a single pass?
options:
  - BFS dequeues cells in non-decreasing distance order; the first time a cell is reached is the minimum distance over all sources.
  - Because of mathematical coincidence; it actually doesn't work.
answer: 0
explanation: Layer 0 holds all sources, layer 1 holds anything one step from any source, and so on — the FIFO queue preserves this order automatically.
:::

:::quiz
question: Running a separate single-source BFS for each of S sources would cost:
options:
  - O(S · R · C) — too slow for large S or large grids.
  - O(R · C) — same as single-source BFS.
answer: 0
explanation: Each BFS visits every cell, and you'd do S of them.
:::

:::quiz
question: In Rotting Oranges, why do we also track a `fresh` counter?
options:
  - To distinguish "all fresh rotted successfully" from "some fresh oranges were unreachable" at the end.
  - It's just for debugging.
answer: 0
explanation: The final check `fresh === 0` determines whether to return minutes or -1.
:::

:::exercise
title: Implement orangesRotting
description: Implement LC 994 using multi-source BFS. Seed the queue with every initially-rotten orange, and return the last minute observed (or -1 if any fresh orange remains).
starterCode: |
  function orangesRotting(grid) {
    const rows = grid.length, cols = grid[0].length;
    const DIRS = [[-1,0],[1,0],[0,-1],[0,1]];
    const queue = [];
    let fresh = 0;
    // initial scan: push rottens at minute 0, count fresh
    let minutes = 0;
    // BFS loop: for each dequeued (r,c,t), rot fresh 4-neighbors
    return fresh === 0 ? minutes : -1;
  }

  console.log(orangesRotting([[2,1,1],[1,1,0],[0,1,1]])); // 4
  console.log(orangesRotting([[2,1,1],[0,1,1],[1,0,1]])); // -1
  console.log(orangesRotting([[0,2]]));                   // 0
:::

## Practice

No direct practice folder for Rotting Oranges in this repo. Try the pattern on [Flood Fill](/problems/flood-fill) (single-source variant) and revisit this lesson when comfortable.
