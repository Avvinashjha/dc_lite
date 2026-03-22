## Approach: Greedy with Value Table

Map all 13 Roman symbols (including the six subtractive forms) to their values in descending order. Greedily subtract the largest possible value and append the corresponding symbol until the number reaches zero.

```javascript
function intToRoman(num) {
  const values =  [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let result = '';

  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += symbols[i];
      num -= values[i];
    }
  }
  return result;
}
```

**Time Complexity:** O(1) — bounded by the fixed set of symbols (at most ~15 iterations)

**Space Complexity:** O(1)
