Given the roots of two binary trees, `p` and `q`, determine whether they're structurally identical with matching values at every corresponding position, returning `true` if so and `false` otherwise.

Both shape and values matter together — if one tree has a child where the other has none at that same position, the trees are different regardless of values elsewhere.

**Example 1**

- Input: `p = [1, 2, 3]`, `q = [1, 2, 3]`
- Output: `true`

**Example 2**

- Input: `p = [1, 2]`, `q = [1, null, 2]`
- Output: `false` (different structure)

**Example 3**

- Input: `p = [1, 2, 1]`, `q = [1, 1, 2]`
- Output: `false` (same values if flattened, but not the same tree)

**Constraints**

- Each tree has between `0` and `100` nodes
- `-10^4 <= Node.val <= 10^4`
