You get two integer arrays `A` and `B`, both of length `N`, and an integer `K`. You may **reorder** `A` and **reorder** `B` independently (any permutation of each). Decide whether some pair of permutations makes `A[i] + B[i] >= K` true for **every** index `i` from `0` to `N - 1`.

If one arrangement works, return true; if no arrangement works, return false.

**Example 1**

- Input: `A = [2, 1, 3]`, `B = [7, 8, 9]`, `K = 10`
- Output: `true` (e.g. match small with large so each sum is at least `10`)

**Example 2**

- Input: `A = [1, 2, 2]`, `B = [1, 2, 2]`, `K = 5`
- Output: `false` (max sum of any pair is `4`)

**Constraints**

- `1 <= N <= 10^5`
- `1 <= A[i], B[i] <= 10^6`
- `0 <= K <= 10^9` (typical; confirm on your judge if needed)
