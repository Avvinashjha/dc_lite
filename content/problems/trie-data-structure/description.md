Implement a `Trie` class that stores words and supports:

- `insert(word)`: store the word; no return value is required. Reinserting a word leaves it present.
- `search(word)`: return true only if that **complete word** was inserted.
- `startsWith(prefix)`: return true if at least one inserted word begins with the prefix.

A new instance starts empty. State persists across calls in one fixture; each fixture uses a fresh instance. Words and prefixes are nonempty lowercase strings.

After inserting `"apple"`, `search("app")` is false but `startsWith("app")` is true. Inserting `"app"` then makes both searches true without removing `"apple"`.
