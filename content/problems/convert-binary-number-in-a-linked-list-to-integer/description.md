You get the head of a singly linked list. Each node stores `0` or `1`. Treat the list from head to tail as the bits of a binary number, **most significant bit at the head**. Return the integer value in decimal.

The answer fits in a normal integer for the given constraints.

**Example 1**

- Input: `head = [1, 0, 1]`
- Output: `5` (binary `101` is `5`)

**Example 2**

- Input: `head = [0]`
- Output: `0`

**Constraints**

- The list has between `1` and `30` nodes
- Each `Node.val` is `0` or `1`
