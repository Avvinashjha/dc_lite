Given a string containing only the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

A string is valid when every opening bracket has a matching closing bracket of the same type, and brackets close in the correct order. An empty string is considered valid.

### Examples

```
Input: s = "()"
Output: true
```

```
Input: s = "()[]{}"
Output: true
```

```
Input: s = "(]"
Output: false
```

```
Input: s = "([)]"
Output: false
```

```
Input: s = "{[]}"
Output: true
```

### Constraints

- `1 <= s.length <= 10^4`
- `s` consists of parentheses characters only.
