Given a string `digits` containing only digits from `2` through `9`, return every string formed by choosing **exactly one letter for each digit**, in the same order as the input digits.

Use this telephone keypad mapping:

| Digit | Letters | Digit | Letters |
| --- | --- | --- | --- |
| 2 | abc | 6 | mno |
| 3 | def | 7 | pqrs |
| 4 | ghi | 8 | tuv |
| 5 | jkl | 9 | wxyz |

Return each combination once, in any order. For an empty input, return `[]`.

For example, `"23"` produces `"ad"` by choosing `a` for `2` and `d` for `3`. It cannot produce `"da"`, because the digit order must be preserved. Repeated digits represent separate choices: `"22"` can produce `"aa"`, `"ab"`, and so on.
