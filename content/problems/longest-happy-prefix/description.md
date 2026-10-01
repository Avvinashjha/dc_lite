Call a non-empty prefix of a string a **happy prefix** if that same sequence of characters also shows up as a suffix of the string, as long as it isn't the whole string itself. Given a string `s`, find its longest happy prefix, or return an empty string if none exists.

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
