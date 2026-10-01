Build a trie — also called a prefix tree, a tree structure that stores strings by sharing common prefixes along shared paths — supporting three operations: `insert` to add a word, `search` to check whether an exact word has been inserted, and `startsWith` to check whether any inserted word begins with a given prefix.

**Example:** after `insert("apple")`, `search("apple")` → `true`, `search("app")` → `false` (it was never inserted as a whole word), and `startsWith("app")` → `true` (since `"apple"` begins with `"app"`)
