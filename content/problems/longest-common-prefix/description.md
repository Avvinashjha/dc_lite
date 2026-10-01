You're given an array of strings. Work out the longest prefix that every single one of them starts with. If the strings don't share any starting characters at all, return an empty string `""`.

**Example 1:**
```
Input: strs = ["flower", "flow", "flight"]
Output: "fl"
```

**Example 2:**
```
Input: strs = ["dog", "racecar", "car"]
Output: ""
Explanation: No common prefix exists.
```

**Edge cases:** Array with a single string returns that string. Empty array returns `""`. One of the strings is empty.
