Determine whether a given string represents a valid number. Valid numbers include integers (`"42"`), decimals (`"3.14"`, `".5"`, `"2."`), and scientific notation (`"2e10"`, `"3.1E-5"`).

A valid number optionally starts with `'+'` or `'-'`, followed by digits (with an optional single decimal point), optionally followed by an exponent part (`'e'` or `'E'` with an optional sign and digits).

### Examples

```
Input: s = "0"       → true
Input: s = "e"       → false
Input: s = "."       → false
Input: s = ".1"      → true
Input: s = "2e10"    → true
Input: s = "-90E3"   → true
Input: s = "99e2.5"  → false (exponent must be integer)
Input: s = "1a"      → false
```

### Constraints

- `1 <= s.length <= 20`
- `s` consists of digits, `'+'`, `'-'`, `'.'`, `'e'`, or `'E'` only.
