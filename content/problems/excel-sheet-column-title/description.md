Spreadsheet programs like Excel name columns `A, B, …, Z`, then continue with `AA, AB, …`, then `AAA`, and so forth. Given a positive integer `columnNumber` — where `1` corresponds to `A`, `2` to `B`, …, `26` to `Z`, and `27` to `AA` — return the matching column title as a string.

Think of it as base-26, except the digits start counting from **1** instead of 0, unlike ordinary binary or decimal place-value systems.

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
