You get the head of a singly linked list. Return the **middle** node. If the number of nodes is even, there are two middle positions; return the **second** of those (the one closer to the tail).

You may return the node itself, not only its value, depending on what your API expects.

**Example 1**

- Input: `head = [1, 2, 3, 4, 5]`
- Output: `[3, 4, 5]` (the node with value `3`)

**Example 2**

- Input: `head = [1, 2, 3, 4, 5, 6]`
- Output: `[4, 5, 6]` (second middle has value `4`)

**Constraints**

- The list has between `1` and `100` nodes
- `1 <= Node.val <= 100`
