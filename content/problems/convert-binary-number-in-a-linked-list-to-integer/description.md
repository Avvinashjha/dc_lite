You're given the `head` of a singly linked list whose nodes each hold a single bit, `0` or `1`. Reading the list from `head` to tail gives the binary digits of a number, with the **most significant bit at the head**. Convert that binary value to its decimal integer and return it.

Given the constraints below, the result always fits in a standard integer.

**Example 1**

- Input: `head = [1, 0, 1]`
- Output: `5` (binary `101` is `5`)

**Example 2**

- Input: `head = [0]`
- Output: `0`

**Constraints**

- The list has between `1` and `30` nodes
- Each `Node.val` is `0` or `1`
