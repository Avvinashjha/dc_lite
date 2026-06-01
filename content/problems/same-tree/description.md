You get the roots of two binary trees, `p` and `q`. Return `true` if they are the **same** tree: same shape and the same value at every corresponding node. Otherwise return `false`.

Compare structure and values together. One missing child on one side and a node on the other means the trees differ.

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
