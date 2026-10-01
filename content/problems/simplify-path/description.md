You're given an absolute path in a Unix-style file system. Convert it into its canonical (simplified) form.

Along the way: a `"."` segment means stay in the current directory and can be dropped, a `".."` segment means step up to the parent directory, consecutive slashes collapse into one, and a trailing slash gets stripped. The simplified path always begins with exactly one `"/"`.

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
