You're given a string made up exclusively of the bracket characters `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`. Figure out whether the brackets in it are properly balanced.

The string counts as valid when every opening bracket is eventually closed by the matching bracket type, and the closures happen in the right nested order. An empty string is trivially valid.

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
