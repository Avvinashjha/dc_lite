## Backtracking

```javascript
function letterCombinations(digits) {
  if (!digits) return [];
  const map = {'2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz'};
  const result = [];
  function bt(i, path) {
    if (i === digits.length) { result.push(path); return; }
    for (const c of map[digits[i]]) bt(i+1, path+c);
  }
  bt(0, '');
  return result;
}
```

**Time:** O(4^n) | **Space:** O(n)
