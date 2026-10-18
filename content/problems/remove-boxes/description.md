Given a row of colored boxes represented by integers in `boxes`, remove every box while maximizing your total score.

In one move, choose a nonempty consecutive group of `k` boxes that all have the same color. Remove them and earn `k²` points. The remaining boxes close the gap, so equal colors that were separated may become adjacent. You may choose any such group; it need not be a maximal run.

Return the highest total score, not the removal order. The integer labels identify colors and do not affect points.

For `[1, 2, 1]`, remove the middle `2` for `1` point, then the two adjacent `1`s for `4`, totaling `5`. Removing the leftmost box first would lead to only `3` points. Delaying a removal can therefore be better than removing an available group immediately.
