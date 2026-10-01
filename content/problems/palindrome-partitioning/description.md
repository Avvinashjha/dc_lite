Given a string `s`, split it into pieces so that every piece is itself a palindrome, and return every way of partitioning the string that achieves this.

A palindrome is a sequence that reads identically in both directions. Each partitioning must account for every character of `s` exactly once, with no characters skipped or reused.

### Examples

```
Input: s = "aab"
Output: [["a", "a", "b"], ["aa", "b"]]
```

```
Input: s = "a"
Output: [["a"]]
```

### Constraints

- `1 <= s.length <= 16`
- `s` contains only lowercase English letters.
