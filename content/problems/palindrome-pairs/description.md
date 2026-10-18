Given an array `words` of distinct lowercase English words, return every **ordered pair of indices** `[i, j]` such that `i != j` and `words[i] + words[j]` is a palindrome.

Concatenate the words in the specified order without adding a separator. The order within a pair matters: `[i, j]` and `[j, i]` are separate answers and do not necessarily both qualify. Return each valid pair exactly once; the outer array may be in any order. If no pairs qualify, return `[]`.

An empty string is allowed. It pairs in both orders with any other word that is itself a palindrome, but an index cannot pair with itself.

For `words = ["lls", "s"]`, the only answer is `[1, 0]`: `"slls"` is a palindrome, while `"llss"` is not.
