You're given a string `s`. Report `true` if removing **no more than one** character from it can turn it into a palindrome.

The string is made up solely of lowercase letters, and a string that's already a palindrome also counts — you're allowed to delete zero characters.

### Examples

```
Input: s = "aba"
Output: true
```

```
Input: s = "abca"
Output: true
Explanation: Take out 'b' to get "aca", or take out 'c' to get "aba" — either way you're left with a palindrome.
```

```
Input: s = "abc"
Output: false
```

### Constraints

- `1 <= s.length <= 10^5`
- `s` consists of lowercase English letters.
