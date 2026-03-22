A **happy prefix** is a non-empty prefix of a string that is also a suffix (excluding the entire string itself). Given a string `s`, return the longest happy prefix. If no such prefix exists, return an empty string.

**Example 1:**
```
Input: s = "level"
Output: "l"
Explanation: "l" is both a prefix and suffix. "le" is a prefix but not a suffix.
```

**Example 2:**
```
Input: s = "ababab"
Output: "abab"
Explanation: "abab" is the longest string that is both a prefix and suffix.
```

**Example 3:**
```
Input: s = "a"
Output: ""
```

**Edge cases:** Single character strings always return `""`. Strings where all characters are the same (e.g., `"aaaa"` → `"aaa"`).
