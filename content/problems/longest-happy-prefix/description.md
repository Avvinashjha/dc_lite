Call a non-empty prefix of a string a **happy prefix** if that same sequence of characters also shows up as a suffix of the string, as long as it isn't the whole string itself. Given a string `s`, find its longest happy prefix, or return an empty string if none exists.

**Edge cases:** Single character strings always return `""`. Strings where all characters are the same (e.g., `"aaaa"` → `"aaa"`).
