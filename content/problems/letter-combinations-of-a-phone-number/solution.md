## Approach: Backtracking

Choose one mapped letter at each position. Keep the current choices in a shared path buffer, then join them into a string when every digit has been processed. Backtrack by removing the last choice before trying the next letter. Return an empty array immediately for empty input.

```javascript
function letterCombinationsOfAPhoneNumber(digits) {
  if (!digits.length) return [];
  const letters = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
  const result = [];
  const path = [];

  function visit(index) {
    if (index === digits.length) {
      result.push(path.join(""));
      return;
    }
    for (const letter of letters[Number(digits[index])]) {
      path.push(letter);
      visit(index + 1);
      path.pop();
    }
  }

  visit(0);
  return result;
}
```

Let `n` be the number of digits and `C` the product of their mapped letter counts. For nonempty input, there are exactly `C` results; `C` is at most `4^n`.

**Time Complexity:** O(n × C), including construction of the output strings.

**Space Complexity:** O(n) auxiliary space for the shared path and recursion, plus O(n × C) for the output. Empty input takes O(1) time and space.
