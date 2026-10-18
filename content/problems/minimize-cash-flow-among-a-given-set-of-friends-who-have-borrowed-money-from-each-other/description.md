Given an `N × N` debt matrix `graph`, where `graph[i][j]` is the amount person `i` owes person `j`, return a settlement using the **fewest individual payments**.

Each payment is `[payer, receiver, amount]`. People are numbered from `0` to `N - 1`, and amounts must be positive integers. Payments may be made between any two different people, even if no original debt connects them. Only each person’s net position must be preserved: total money received minus total money paid must equal their original incoming debts minus outgoing debts.

Minimize the number of payments, not the total amount transferred. Any optimal settlement is accepted, in any order. If everyone’s incoming and outgoing debts cancel, return `[]`.

For a chain where person `0` owes `1` five units and `1` owes `2` five units, a single payment `[0,2,5]` settles everyone’s net position. Cyclic debts may cancel without any payments.
