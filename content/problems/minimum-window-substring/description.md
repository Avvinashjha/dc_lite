Given two strings `s` and `t`, locate the shortest contiguous substring of `s` that includes every character from `t`, matching duplicate counts as well. If no such substring is present, return an empty string instead.

Whenever a valid window exists, there's exactly one smallest one that satisfies the condition.

Matching is case-sensitive: `"a"` and `"A"` differ. Characters may occur in any order inside the window, and unrelated characters may be included. Duplicate requirements must be satisfied: for `t = "AAB"`, one `A` is insufficient. Return the substring itself, not its length.
