Check whether a given string qualifies as a well-formed number. That covers plain integers (`"42"`), decimal values (`"3.14"`, `".5"`, `"2."`), and numbers written in scientific notation (`"2e10"`, `"3.1E-5"`).

Structurally, a valid number may begin with a `'+'` or `'-'` sign, then a run of digits that can contain at most one decimal point, and may optionally end with an exponent — an `'e'` or `'E'` followed by an optional sign and more digits.

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
