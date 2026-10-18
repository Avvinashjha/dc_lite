Given an array of `words` claimed to be sorted in an unknown alphabet, infer an ordering of its letters. Return each letter that appears in the input exactly once. If several orders are possible, return any of them.

Compare words lexicographically: the first different character determines their order. If one word is a prefix of another, the shorter word must come first.

Return an empty string if the claimed order is impossible, including contradictory letter relationships or a longer word placed before its own prefix.
