## Approach: Multiple recursion

The key insight: to move `n` disks from `A` to `C` using `B` as auxiliary, you can always break the task into three simpler tasks.

```text
  1. Move the top n-1 disks from A to B, using C as auxiliary.
  2. Move the single largest disk from A to C.            (1 move)
  3. Move the n-1 disks from B to C, using A as auxiliary.
```

Each of steps 1 and 3 is a smaller Tower of Hanoi problem. The base case `n = 1` is trivially one move.

```javascript
function towerOfHanoi(n, from = 'A', to = 'C', aux = 'B') {
  if (n === 1) return 1;
  const first  = towerOfHanoi(n - 1, from, aux, to);
  const middle = 1;
  const last   = towerOfHanoi(n - 1, aux, to, from);
  return first + middle + last;
}
```

**Time:** O(2^n) &nbsp; **Space:** O(n) stack

## Why exactly 2^n − 1 moves?

Let `T(n)` be the moves required. The recursion gives us:

```
T(1) = 1
T(n) = 2 * T(n - 1) + 1
```

Solving:

```
T(2) = 2*1 + 1 = 3
T(3) = 2*3 + 1 = 7
T(4) = 2*7 + 1 = 15
...
T(n) = 2^n - 1
```

This is also provably **optimal** — no strategy can move `n` disks in fewer moves.

## Bonus: printing every move

If you want the sequence instead of just the count, add a log / collector:

```javascript
function towerOfHanoi(n, from = 'A', to = 'C', aux = 'B', moves = []) {
  if (n === 1) {
    moves.push([from, to]);
    return moves;
  }
  towerOfHanoi(n - 1, from, aux, to, moves);
  moves.push([from, to]);
  towerOfHanoi(n - 1, aux, to, from, moves);
  return moves;
}
```

Call `towerOfHanoi(3)` and you get exactly `2^3 - 1 = 7` move pairs.
