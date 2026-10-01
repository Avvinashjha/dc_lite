You're given a string `s` made up of words — where a word is any run of non-space characters — separated by spaces. Produce a string containing those words in reverse order, with exactly one space between consecutive words.

Because the input can have leading or trailing spaces and runs of multiple spaces between words, make sure none of that extra spacing survives into the output.

### Examples

```
Input: s = "the sky is blue"
Output: "blue is sky the"
```

```
Input: s = "  hello world  "
Output: "world hello"
```

```
Input: s = "a good   example"
Output: "example good a"
```

### Constraints

- `1 <= s.length <= 10^4`
- `s` may contain leading or trailing spaces and multiple spaces between words.
