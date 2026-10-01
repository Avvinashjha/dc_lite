You're given an array of `n` elements and a target size `r`. List every combination of `r` elements drawn from the array, always moving forward through the array (no revisiting earlier positions) so the combinations come out in sorted order.

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

**Edge cases:** With `r = 0`, the only valid combination is the empty one. If `r > n`, no combination is possible. If `r = n`, the entire array is the sole combination.
