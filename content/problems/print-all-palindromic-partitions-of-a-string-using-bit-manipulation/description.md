Given a string, find all ways to partition it such that every substring in the partition is a palindrome. Use bit manipulation to generate partition points.

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

**Edge cases:** Single character strings have exactly one partition. Strings with no multi-character palindromes produce only the fully-split partition.
