You're given a number represented as a string `num`, along with an integer `k`. By swapping any two digits within the string, at most `k` times, determine the largest possible numeric value you can form.

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
Explanation: Swapping '1' and '4' produces the largest value using just one swap.
```

**Edge cases:** When `k = 0`, the original number is returned unchanged. The digits may already be sorted in descending order. The maximum digit may appear more than once.
