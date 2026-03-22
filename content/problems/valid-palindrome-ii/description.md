Given a string `s`, return `true` if it can become a palindrome after deleting **at most one** character.

The string only contains lowercase letters. If it's already a palindrome, return `true` as well (zero deletions is valid).

### Examples

```
Input: s = "aba"
Output: true
```

```
Input: s = "abca"
Output: true
Explanation: Removing 'b' gives "aca", or removing 'c' gives "aba" — both palindromes.
```

```
Input: s = "abc"
Output: false
```

### Constraints

- `1 <= s.length <= 10^5`
- `s` consists of lowercase English letters.
