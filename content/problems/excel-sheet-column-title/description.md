Excel labels columns `A, B, …, Z`, then `AA, AB, …`, then `AAA`, and so on. You get a positive integer `columnNumber` where `1` means `A`, `2` means `B`, …, `26` means `Z`, `27` means `AA`. Return the column title string.

This is a base-26 style encoding, but note it is **1-based**, not 0-based like plain binary.

**Example 1**

- Input: `columnNumber = 1`
- Output: `"A"`

**Example 2**

- Input: `columnNumber = 28`
- Output: `"AB"`

**Example 3**

- Input: `columnNumber = 701`
- Output: `"ZY"`

**Constraints**

- `1 <= columnNumber <= 2^31 - 1`
