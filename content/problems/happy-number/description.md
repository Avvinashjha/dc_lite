Determine whether a given positive integer `n` is a happy number. To test this, repeatedly replace the number with the sum of the squares of its individual digits. If this process eventually lands on `1`, the original number is happy; if instead it falls into a repeating cycle that never includes `1`, the number is not happy.

**Example 1:**
```
Input: n = 19
Output: true (1²+9²=82 → 8²+2²=68 → 6²+8²=100 → 1²+0²+0²=1)
```

**Example 2:**
```
Input: n = 2
Output: false
```
