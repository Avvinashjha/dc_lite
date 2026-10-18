You have a row of stone piles and a number `k`. In one move, you may merge exactly `k` piles that sit next to each other into a single pile, and that move costs the sum of the stones involved. Return the minimum total cost to merge all piles into exactly one pile, or `-1` if this is impossible.

Piles cannot be reordered, and a newly merged pile may participate in later moves. Count its stones again when calculating those later costs. If there is already one pile, no moves are needed and the cost is `0`, even when `k` exceeds the number of piles.

For `[3,2,4,1]` with `k = 2`, merge `3+2` for cost `5`, then `4+1` for cost `5`, then the two resulting piles for cost `10`. The minimum total is `5 + 5 + 10 = 20`.
