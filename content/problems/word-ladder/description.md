You're given `beginWord`, `endWord`, and a list `wordList`. Each step lets you change exactly one letter of the current word, and whatever word results must appear in `wordList`. Find how many words long the shortest such chain from `beginWord` to `endWord` is, counting both endpoints; if no such chain exists, the answer is `0`.

All words have the same length and contain lowercase English letters. You may only replace one letter per step; inserting, deleting, or leaving the word unchanged is not a move.

`beginWord` does not have to be in `wordList`, but `endWord` and every word after the starting word must be. The endpoints are different.

For the first example, `hit → hot → dot → dog → cog` contains **5 words and 4 changes**, so return `5`. Return only the length, not the chain itself.
