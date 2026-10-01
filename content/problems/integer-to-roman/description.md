Translate an integer into its Roman numeral form. The Roman numeral system is built from seven base symbols — `I` (1), `V` (5), `X` (10), `L` (50), `C` (100), `D` (500), and `M` (1000) — combined by addition, except for six special cases (4, 9, 40, 90, 400, 900) where a smaller symbol placed before a larger one means subtraction instead (so `IV` reads as 4 and `IX` as 9).

**Example 1:**
```
Input: num = 3749
Output: "MMMDCCXLIX"
```

**Example 2:**
```
Input: num = 58
Output: "LVIII"
Explanation: L = 50, V = 5, III = 3
```

**Example 3:**
```
Input: num = 1994
Output: "MCMXCIV"
Explanation: M = 1000, CM = 900, XC = 90, IV = 4
```

**Edge cases:** Minimum value is 1. Maximum is typically 3999.
