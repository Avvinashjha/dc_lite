You are given three pegs — `A` (source), `B` (auxiliary), and `C` (destination) — and a stack of `n` disks of distinct sizes on peg `A`, arranged with the largest on the bottom and smallest on top.

Move the entire stack from `A` to `C`, obeying these rules:

1. Only **one disk** may be moved at a time.
2. Only the **top disk** of a peg can be moved.
3. **A larger disk may never be placed on top of a smaller disk.**

Return the **total number of moves** required.

**Example 1**

- Input: `n = 1`
- Output: `1`
- Explanation: Move the single disk from A to C.

**Example 2**

- Input: `n = 2`
- Output: `3`
- Explanation: A→B, A→C, B→C.

**Example 3**

- Input: `n = 3`
- Output: `7`
- Explanation: A→C, A→B, C→B, A→C, B→A, B→C, A→C.

**Constraints**

- `1 <= n <= 20`

**The canonical recursion**

Tower of Hanoi is the textbook example of multiple recursion with a clean recurrence `T(n) = 2·T(n-1) + 1`, which solves to exactly `2^n - 1` moves. Solving it is a rite of passage and an excellent check that you have internalized "trust the recursion."
