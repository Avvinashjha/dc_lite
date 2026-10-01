You're given a string. Identify every character that shows up more than once, and report each one together with how many times it occurs.

Treat uppercase and lowercase as distinct characters — `'a'` and `'A'` don't count as the same.

### Examples

```
Input: "programming"
Output: { r: 2, g: 2, m: 2 }
```

```
Input: "hello world"
Output: { l: 3, o: 2 }
```

```
Input: "abcde"
Output: {} (no duplicates)
```

### Constraints

- The string can contain letters, digits, spaces, and special characters.
- An empty string should return no duplicates.
