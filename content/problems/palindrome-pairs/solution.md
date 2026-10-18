## Hash Map of Reversed Split Candidates

Map each word to its index. Split each word into `left + right` at every boundary, including the ends:

- If `right` is a palindrome and `reverse(left)` exists, appending that word produces a palindrome.
- If `left` is a palindrome and `reverse(right)` exists, prepending that word produces a palindrome.

Reject matches using the same index. Skip the second rule for the empty prefix: its full-reverse pair is already found by the first rule while processing the other word. This prevents duplicate pairs while still finding both orders involving an empty string.

Reverse each word once and take slices of that reversed word for the lookups. Check palindrome ranges directly on the original word to avoid allocating separate left and right strings just for those checks.

```javascript
function palindromePairs(words) {
  const map = new Map(words.map((word, i) => [word, i]));
  function isPalindrome(word, left, right) {
    while (left < right) {
      if (word[left++] !== word[right--]) return false;
    }
    return true;
  }
  const result = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const reversed = word.split("").reverse().join("");
    for (let split = 0; split <= word.length; split++) {
      if (isPalindrome(word, split, word.length - 1)) {
        const other = map.get(reversed.slice(word.length - split));
        if (other !== undefined && other !== i) result.push([i, other]);
      }
      if (split > 0 && isPalindrome(word, 0, split - 1)) {
        const other = map.get(reversed.slice(0, word.length - split));
        if (other !== undefined && other !== i) result.push([other, i]);
      }
    }
  }
  return result;
}
```

**Time:** O(N(K + 1)² + P), where N is the number of words, K is their maximum length, and P is the number of returned pairs. The split checks and string lookups take up to O(K) each.

**Space:** O(N + K) auxiliary space, plus O(P) for the result. The map refers to the original input strings; the reversed word and candidate strings use O(K) temporary space.
