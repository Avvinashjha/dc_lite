Given an integer array `arr`, choose a common integer target and change every element to that value. Changing a value from `a` to `b` costs `|a - b|`.

Return the **minimum sum of these costs**, not the target value. The target may be any integer; you do not have to choose an existing array element. Multiple targets may achieve the same minimum cost.

For `[1,100,101]`, choosing `100` costs `99 + 0 + 1 = 100`. For `[1,10]`, any integer target from `1` through `10` gives cost `9`.
