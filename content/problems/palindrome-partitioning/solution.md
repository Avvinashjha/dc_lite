Use backtracking. At each index, try every possible prefix — if the prefix is a palindrome, add it to the current partition and recurse on the remainder. When the index reaches the end of the string, save the partition.

```javascript
function partition(s) {
  const result = [];

  function isPalindrome(str, left, right) {
    while (left < right) {
      if (str[left] !== str[right]) return false;
      left++;
      right--;
    }
    return true;
  }

  function backtrack(start, current) {
    if (start === s.length) {
      result.push([...current]);
      return;
    }
    for (let end = start; end < s.length; end++) {
      if (isPalindrome(s, start, end)) {
        current.push(s.substring(start, end + 1));
        backtrack(end + 1, current);
        current.pop();
      }
    }
  }

  backtrack(0, []);
  return result;
}
```

**Time:** O(n * 2^n) — there are 2^(n-1) ways to partition the string, and checking palindromes takes O(n).
**Space:** O(n) for recursion depth.
