Given the head of a singly linked list, flip the direction of the entire list so what used to be the last node becomes the first, and return this new head.

Achieve this by rewiring each node's `next` pointer — either an iterative loop or a recursive approach works.

**Example 1**

- Input: `head = [1, 2, 3, 4, 5]`
- Output: `[5, 4, 3, 2, 1]`

**Example 2**

- Input: `head = [1, 2]`
- Output: `[2, 1]`

**Example 3**

- Input: `head = []`
- Output: `[]`

**Constraints**

- The list has between `0` and `5000` nodes
- `-5000 <= Node.val <= 5000`
