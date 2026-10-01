Given integers `n` and `k`, generate every possible way to pick `k` numbers out of the range `[1, n]`, returning them as a list of combinations in any order.

Order within a combination doesn't matter — picking `1` then `2` is the same selection as picking `2` then `1`, so each such group should appear only once.

### Examples

```
Input: n = 4, k = 2
Output: [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
```

```
Input: n = 1, k = 1
Output: [[1]]
```

### Constraints

- `1 <= n <= 20`
- `1 <= k <= n`
