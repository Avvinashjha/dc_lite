Given the head of a singly linked list and an integer `val`, remove every node whose value matches `val` and return the head of what's left. Note the head itself may change if the leading nodes are among those removed.

The surviving nodes should stay in their original relative order.

**Example 1**

- Input: `head = [1, 2, 6, 3, 4, 5, 6]`, `val = 6`
- Output: `[1, 2, 3, 4, 5]`

**Example 2**

- Input: `head = []`, `val = 1`
- Output: `[]`

**Example 3**

- Input: `head = [7, 7, 7, 7]`, `val = 7`
- Output: `[]`

**Constraints**

- The list has between `0` and `10^4` nodes
- `1 <= Node.val <= 50`
- `0 <= val <= 50`
