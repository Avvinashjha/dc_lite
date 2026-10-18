## Backtracking over Cut Positions

At index `start`, try every nonempty substring beginning there. If it is a palindrome, append it to the current partition and recurse from the next character. Remove it when returning so the next choice starts with the same prefix of pieces.

When `start` reaches the end, copy the current partition into the result. Copying matters because backtracking subsequently changes the working array. Every partition corresponds to a unique sequence of cut positions, so this generates all valid partitions exactly once.

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

**Time:** O(n × 2^n) in the worst case. There are up to 2^(n - 1) cut patterns, and copying all returned partitions already requires O(n × 2^n) work for a string of identical letters.

**Space:** O(n) auxiliary space for the recursion and current partition, excluding the result. The returned partitions require up to O(n × 2^n) space.
