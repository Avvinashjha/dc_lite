Given two equal-length integer arrays `A` and `B` and an integer threshold `k`, return whether their entries can be rearranged so that **every** paired sum `A[i] + B[i]` is at least `k`.

Each entry must be used exactly once. Repeated values are separate entries, and equality with `k` is allowed. Return a boolean, not the rearranged arrays. You may reorder both input arrays.

For `A = [2, 1, 3]`, `B = [7, 8, 9]`, and `k = 10`, pair `[1, 2, 3]` with `[9, 8, 7]`. All three sums equal `10`. A large total sum alone does not guarantee that every pair can reach the threshold.
