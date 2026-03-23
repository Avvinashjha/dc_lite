You get an array of strings. Group them so that words that are anagrams of each other sit in the same group. Two strings are anagrams if they use the same multiset of letters (same counts, order may differ). The order of groups and the order of words inside a group can be any valid arrangement unless the problem statement on the judge says otherwise.

Empty strings are anagrams of each other.

**Example 1**

- Input: `words = ["eat", "tea", "tan", "ate", "nat", "bat"]`
- Output: `[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]` (or any grouping equivalent up to order)

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
