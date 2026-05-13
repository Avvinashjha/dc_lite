Write a function that reverses a string. The input string is given as an **array of characters** `s`.

You must do this by **modifying the input array in-place** with O(1) extra memory.

**Example 1**

- Input: `s = ["h","e","l","l","o"]`
- Output: `["o","l","l","e","h"]`

**Example 2**

- Input: `s = ["H","a","n","n","a","h"]`
- Output: `["h","a","n","n","a","H"]`

**Constraints**

- `1 <= s.length <= 10^5`
- `s[i]` is a printable ASCII character.

**What you will practice**

This is the archetypal two-pointer problem, and it also has a beautifully symmetric recursive solution: swap `s[left]` with `s[right]`, then recurse on the interior slice. It is the best place to compare iterative and recursive styles side-by-side.
