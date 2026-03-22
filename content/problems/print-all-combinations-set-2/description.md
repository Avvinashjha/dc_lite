Given an array of `n` elements, generate and print all possible combinations of `r` elements. The combinations should be printed in sorted order — pick elements left to right without going back.

**Example 1:**
```
Input: arr = [1, 2, 3, 4], r = 2
Output: [1,2], [1,3], [1,4], [2,3], [2,4], [3,4]
```

**Example 2:**
```
Input: arr = [1, 2, 3], r = 3
Output: [1,2,3]
```

**Example 3:**
```
Input: arr = [1, 2, 3, 4, 5], r = 1
Output: [1], [2], [3], [4], [5]
```

**Edge cases:** `r = 0` returns one empty combination. `r > n` returns no combinations. `r = n` returns the full array as the only combination.
