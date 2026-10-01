You're given an integer array nums. In each move, choose some value present in the array, add that value to your score for every occurrence of it, and then remove every occurrence of that value along with any elements equal to value-1 and value+1. Keep making moves until no elements remain, and return the maximum total score achievable.

**Example:** nums = [3,4,2] → Output: 6 (pick 4, earning 4 and removing the 3; then pick 2, earning 2 — total 4 + 2 = 6)
