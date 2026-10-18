Split `s` into nonempty, contiguous substrings so that every substring is a palindrome. Return **all distinct valid partitions**.

Each partition must preserve the original character order and use every character exactly once. You may place cuts between characters, but cannot rearrange, skip, or reuse characters. Return the substrings in their original order within each partition; the outer array may be in any order.

For `s = "aab"`, the partitions are `["a", "a", "b"]` and `["aa", "b"]`. Return both, not just the partition with the fewest pieces. Every individual character is a palindrome, so at least one partition always exists.
