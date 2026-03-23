Trim the string, split on one or more whitespace characters to extract words, reverse the array, and join with a single space. The regex split handles multiple consecutive spaces cleanly.

```javascript
function reverseWords(s) {
  return s.trim().split(/\s+/).reverse().join(' ');
}
```

For a more manual approach without built-in reverse:

```javascript
function reverseWords(s) {
  const words = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && s[i] === ' ') i++;
    if (i >= s.length) break;
    let j = i;
    while (j < s.length && s[j] !== ' ') j++;
    words.push(s.substring(i, j));
    i = j;
  }

  let left = 0, right = words.length - 1;
  while (left < right) {
    [words[left], words[right]] = [words[right], words[left]];
    left++;
    right--;
  }
  return words.join(' ');
}
```

**Time:** O(n) — one pass to split, one to reverse.
**Space:** O(n) for the words array.
