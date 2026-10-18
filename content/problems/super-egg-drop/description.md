You have `k` identical eggs and a building with `n` floors. There is an unknown highest safe floor `f` in `[0, n]`: an egg survives at floors at or below `f` and breaks above `f`. A broken egg cannot be reused. Determine the minimum number of drops needed in the worst case to identify `f`, including the possibilities that every floor is safe or no floor is safe.

Each drop tests one egg from one chosen floor. A surviving egg can be reused, and the next floor may depend on earlier outcomes. Return the guaranteed worst-case drop count, not the unknown floor or an average over outcomes.
