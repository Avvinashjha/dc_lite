Given unique lowercase contact names `contacts` and a lowercase string `query`, return one suggestion list for each successive nonempty prefix of `query`.

A contact matches when it **starts with** the entire prefix. Include all matching contacts, sorted in lexicographic order. A contact exactly equal to the prefix also matches. Do not match text appearing only in the middle of a name.

The outer result must have exactly `query.length` lists, ordered from the one-character prefix to the full query. Use `[]` when a prefix has no matches, and continue returning an empty list for every longer prefix.

For `contacts = ["alice", "ali", "bob"]` and `query = "alix"`, return `[["ali", "alice"], ["ali", "alice"], ["ali", "alice"], []]` for `"a"`, `"al"`, `"ali"`, and `"alix"` respectively.
