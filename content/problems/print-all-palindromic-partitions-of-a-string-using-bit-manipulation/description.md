Given a string `s`, return every way to split it into nonempty contiguous substrings such that each substring is a palindrome. Preserve the original character order and use each character exactly once.

Use a **bitmask over cut positions** to enumerate candidate partitions. For a string of length `n`, there are `n - 1` gaps. Bit `i` indicates whether to cut after character `s[i]`; a zero bit leaves that gap joined.

For `s = "aab"`, mask `0` gives `["aab"]`, mask `1` gives `["a", "ab"]`, mask `2` gives `["aa", "b"]`, and mask `3` gives `["a", "a", "b"]`. Only the last two partitions qualify.

Return all qualifying partitions exactly once, in any outer order. Preserve substring order within each partition. A single-character string has one partition, and splitting every character individually always gives a valid partition. Return the partitions rather than printing them.
