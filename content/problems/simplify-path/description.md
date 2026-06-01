Given an absolute Unix-style file path, simplify it to its canonical form.

Rules: `"."` refers to the current directory, `".."` moves up one directory, multiple consecutive slashes are treated as a single slash, and any trailing slash is removed. The result always starts with a single `"/"`.

### Examples

```
Input: path = "/home/"
Output: "/home"
```

```
Input: path = "/home//foo/"
Output: "/home/foo"
```

```
Input: path = "/a/./b/../../c/"
Output: "/c"
```

```
Input: path = "/../"
Output: "/"
Explanation: Can't go above root.
```

### Constraints

- `1 <= path.length <= 3000`
- `path` consists of English letters, digits, `'.'`, `'/'`, or `'_'`.
