Given a number as a string and an integer `k`, find the largest number you can produce by swapping any two digits at most `k` times.

**Example 1:**
```
Input: num = "1234567", k = 4
Output: "7654321"
```

**Example 2:**
```
Input: num = "3435335", k = 3
Output: "5543333"
```

**Example 3:**
```
Input: num = "1234", k = 1
Output: "4231"
Explanation: Swap '1' and '4' to get the maximum in one swap.
```

**Edge cases:** `k = 0` returns the original number. Number already in descending order. Multiple occurrences of the maximum digit.
