You're given a string `s` that holds a basic arithmetic expression made up of non-negative integers and the operators `+`, `-`, `*`, and `/`, with standard operator precedence (multiplication and division happen before addition and subtraction) and no parentheses anywhere. Evaluate the expression and return the result, truncating any division toward zero. The input is guaranteed to be a valid expression.

**Example 1:**
```
Input: s = "3+2*2"
Output: 7
```

**Example 2:**
```
Input: s = " 3/2 "
Output: 1
```

**Example 3:**
```
Input: s = " 3+5 / 2 "
Output: 5
```

**Edge cases:** The string may contain spaces anywhere. It may be a single number with no operators at all. Division truncates rather than rounds (e.g., `14 / 3 = 4`).
