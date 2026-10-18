Arrange `words` into lines of **exactly `maxWidth` characters**, preserving word order and spelling. Never split a word.

1. Pack each line greedily with as many words as fit, allowing at least one space between adjacent words.
2. For a nonfinal line with multiple words, distribute all remaining spaces between words as evenly as possible. Give any extra spaces to the leftmost gaps.
3. For the final line, use exactly one space between words and pad the right side with spaces.
4. For any single-word line, place all padding after the word.

Return an array of strings. **Every line, including the last, must have exactly `maxWidth` characters.** Trailing spaces are part of the answer.

For `["a","b","c","dddd"]` at width 8, the first line is `"a   b  c"`: its two gaps contain three and two spaces. The last line is `"dddd    "`.
