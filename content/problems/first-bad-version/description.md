You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.

Suppose you have `n` versions `[1, 2, ..., n]` and you want to find out the first bad one, which causes all the following ones to be bad.

You are given an API `isBadVersion(version)` which returns whether `version` is bad.

**This site's runner:** Implement `firstBadVersion(n, firstBad)`. Treat `isBadVersion(version)` as `version >= firstBad` so tests can verify your logic without the LeetCode API.

**Example**

- Input: `n = 5`, `firstBad = 4`
- Output: `4`

**Constraints**

- `1 <= firstBad <= n <= 2^31 - 1`
