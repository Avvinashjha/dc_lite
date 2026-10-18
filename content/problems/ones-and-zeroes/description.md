Given an array of binary strings `strs` and two budgets, `m` zeros and `n` ones, choose the largest possible number of strings whose **combined** counts use at most `m` zeros and at most `n` ones.

Each array entry can be selected at most once. Equal strings at different indices are separate choices. Select whole strings: you cannot split or edit them. You do not need to use either budget exactly, and selecting no strings is allowed.

Return the maximum **number of strings**, not their total length or the strings themselves.

For `strs = ["10", "0001", "111001", "1", "0"]`, `m = 5`, and `n = 3`, selecting `"10"`, `"0001"`, `"1"`, and `"0"` uses five zeros and three ones. The answer is `4`.
