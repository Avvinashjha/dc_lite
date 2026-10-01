You're given a string. Find every way to split it into substrings such that each piece reads the same forwards and backwards. Generate the split points using bit manipulation — each bitmask over the possible cut positions represents one candidate partition.

**Example 1:**
```
Input: s = "nitin"
Output: [["n","i","t","i","n"], ["n","iti","n"], ["nitin"]]
```

**Example 2:**
```
Input: s = "aab"
Output: [["a","a","b"], ["aa","b"]]
```

**Edge cases:** A single-character string has just one possible partition. If a string has no palindromic substring longer than one character, the only valid partition splits it into individual characters.
