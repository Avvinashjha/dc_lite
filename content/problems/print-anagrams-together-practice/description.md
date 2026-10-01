You're given an array of strings. Cluster them so that any two words built from the same letters (same letter counts, regardless of order) land in the same group — that's what makes them anagrams of each other. Groups can come back in any order, and so can the words inside each group, unless the judge says otherwise.

Two empty strings count as anagrams of each other too.

**Example 1**

- Input: `words = ["eat", "tea", "tan", "ate", "nat", "bat"]`
- Output: `[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]` (or any equivalent grouping, order aside)

**Example 2**

- Input: `words = [""]`
- Output: `[[""]]`

**Example 3**

- Input: `words = ["a"]`
- Output: `[["a"]]`

**Constraints**

- `1 <= N <= 100` where `N` is `words.length`
- `1 <= words[i].length <= 10`
- Letters are lowercase English unless your judge says otherwise
