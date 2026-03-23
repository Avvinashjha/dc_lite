Given two strings `s` and `t`, find the smallest substring of `s` that contains every character of `t` (including duplicates). If no such substring exists, return an empty string.

There is exactly one unique minimum window when an answer exists.

### Examples

```
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
```

```
Input: s = "a", t = "a"
Output: "a"
```

```
Input: s = "a", t = "aa"
Output: ""
Explanation: 't' needs two 'a's but 's' only has one.
```

### Constraints

- `1 <= s.length, t.length <= 10^5`
- `s` and `t` consist of uppercase and lowercase English letters.
