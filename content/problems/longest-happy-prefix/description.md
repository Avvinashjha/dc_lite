Given a string `s`, return its longest **happy prefix**: a nonempty prefix that is also a suffix, but is shorter than the whole string. Return `""` if no such prefix exists.

The prefix and suffix may overlap. For `"ababab"`, the prefix at indices `0–3` and suffix at indices `2–5` are both `"abab"`, so return `"abab"`. For `"aaaa"`, return `"aaa"`; returning the entire string is not allowed.

A one-character string always returns `""`.
