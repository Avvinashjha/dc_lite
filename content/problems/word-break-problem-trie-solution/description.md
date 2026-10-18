You're given a string `s` and a dictionary of words `wordDict`. Decide whether `s` can be broken up into a sequence of one or more dictionary words placed back to back, where the same dictionary word may be reused as many times as needed.

Every character must be used exactly once, in its original order. Each piece must be a complete dictionary word: a prefix alone is not enough. Dictionary order does not matter, and not every dictionary word needs to be used. Return a boolean, not the segmentation.

Use a trie to look up dictionary prefixes efficiently. For `s = "cars"` and `wordDict = ["car", "ca", "rs"]`, choose `"ca" + "rs"`; choosing `"car"` first would leave an unmatched `"s"`.
