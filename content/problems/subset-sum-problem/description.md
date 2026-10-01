You're given an array of non-negative integers and a target value `sum`. Decide whether some subset of the array's elements adds up to exactly `sum`, and return `true` or `false` accordingly.

**Example 1:**
```
Input: arr = [3, 34, 4, 12, 5, 2], sum = 9
Output: true
Explanation: Picking [4, 5] gives a total of 9.
```

**Example 2:**
```
Input: arr = [3, 34, 4, 12, 5, 2], sum = 30
Output: false
```

**Edge cases:** A target of `sum = 0` is always achievable with the empty subset. Consider arrays with a single matching element, or where every element exceeds `sum`.
