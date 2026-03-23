## Approach: Backtracking

Map each digit to its corresponding letters. Recursively build combinations by choosing one letter per digit and advancing to the next digit. When the current combination length equals the digits length, add it to the result.

```javascript
function letterCombinationsOfAPhoneNumber(digits) {
  if (!digits.length) return [];
  const map = {2:"abc",3:"def",4:"ghi",5:"jkl",6:"mno",7:"pqrs",8:"tuv",9:"wxyz"};
  const result = [];
  function backtrack(i, curr) {
    if (i === digits.length) { result.push(curr); return; }
    for (const ch of map[digits[i]]) backtrack(i + 1, curr + ch);
  }
  backtrack(0, "");
  return result;
}
```

**Time Complexity:** O(4^n) where n is the length of digits

**Space Complexity:** O(n) for recursion depth
