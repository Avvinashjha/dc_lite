Given two strings `s` and `t`, locate the shortest contiguous substring of `s` that includes every character from `t`, matching duplicate counts as well. If no such substring is present, return an empty string instead.

Whenever a valid window exists, there's exactly one smallest one that satisfies the condition.

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
Explanation: `t` calls for two `'a'`s, but `s` only contains one.
```

### Constraints

- `1 <= s.length, t.length <= 10^5`
- `s` and `t` consist of uppercase and lowercase English letters.
