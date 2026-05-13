Given an array of strings `strs`, **group the anagrams** together. You may return the answer in **any order** on LeetCode; for this site's test runner, return groups **sorted by the sorted-letter signature** (e.g. `"aet"` before `"ant"`), and **sort words inside each group** alphabetically so output matches the expected JSON exactly.

**Example**

- Input: `strs = ["eat","tea","tan","ate","nat","bat"]`
- Output: `[["bat"],["ate","eat","tea"],["nat","tan"]]`

**Example 2**

- Input: `strs = ["a"]`
- Output: `[["a"]]`

**Constraints**

- `1 <= strs.length <= 10^4`
- `0 <= strs[i].length <= 100`
- `strs[i]` consists of lowercase English letters.
