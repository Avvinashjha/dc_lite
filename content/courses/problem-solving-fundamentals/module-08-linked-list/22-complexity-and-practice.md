# Complexity, Pitfalls, and Practice Ladder

A single page to close out the module: the complexity cheat-sheet, the most common bugs to watch for, the interview patterns you've just mastered, and a graded practice ladder.

## Complexity cheat-sheet

### Singly linked list

| Operation | Time | Space | Notes |
| --- | --- | --- | --- |
| Access by index | O(k) | O(1) | No random access; must walk |
| Search by value | O(n) | O(1) | |
| Insert at head | O(1) | O(1) | |
| Insert at tail (with tail pointer) | O(1) | O(1) | |
| Insert at tail (no tail pointer) | O(n) | O(1) | Walk to end first |
| Insert after given node | O(1) | O(1) | |
| Delete head | O(1) | O(1) | |
| Delete given node (non-tail, LC 237 trick) | O(1) | O(1) | Copy-from-next trick |
| Delete given node with predecessor | O(1) | O(1) | |
| Delete by value (first occurrence) | O(n) | O(1) | |
| Length | O(n) | O(1) | |
| Reverse (iterative) | O(n) | O(1) | |
| Reverse (recursive) | O(n) | O(n) stack | |
| Cycle detection (Floyd's) | O(n) | O(1) | |
| Find middle (slow/fast) | O(n) | O(1) | |
| Merge two sorted | O(m + n) | O(1) | Splice-based |
| Merge sort (sortList) | O(n log n) | O(log n) stack | True O(1) needs bottom-up |
| Deep copy with random pointers | O(n) | O(n) or O(1) | Hash map vs. interleave |

### Doubly linked list

| Operation | Time |
| --- | --- |
| Insert at either end | O(1) |
| Delete at either end | O(1) |
| Delete any node given its pointer | O(1) |
| Bidirectional traversal | O(n) |

### Space considerations

- **Per node:** singly linked ≈ 1 pointer + value. Doubly linked ≈ 2 pointers + value. In JS, object overhead can be 50–100 bytes per node — a lot compared to a tight array of numbers.
- **Algorithmic:** most list algorithms can be done in O(1) extra space if you're willing to mutate in place. Recursion adds O(depth) stack space.

## The pattern reference card

Here's every pattern you've touched in this module, in the form you'll recognize on the next problem:

| Signal | Pattern |
| --- | --- |
| "Remove / insert / splice at potentially the first position" | Dummy head |
| "Find the middle" or "split in half" | Slow/fast pointers (standard) |
| "Does the list have a cycle?" | Floyd's tortoise and hare |
| "Where does the cycle begin?" | Floyd's + reset-to-head phase 2 |
| "Remove the k-th from the end" | Lead/follow with fixed gap k+1 |
| "Reverse the list" | Iterative prev/cur/next |
| "Reverse a sublist" | Dummy head + predecessor + pull-forward |
| "Reverse in groups of k" | getKth + bounded reversal + re-stitch |
| "Merge two sorted lists" | Dummy head + tail cursor + splice remainder |
| "Sort a linked list" | Merge sort (slow/fast split with `fast = head.next`) |
| "Is the list a palindrome?" | Find middle + reverse second half + compare |
| "Do two lists intersect?" | Two pointers with head-switch trick |
| "Add two numbers / parallel-walk digits" | Loop while l1 \|\| l2 \|\| carry; track carry |
| "Deep copy with extra pointers (random, children, etc.)" | Map node→clone or interleave |
| "O(1) delete-anywhere + bidirectional walk" | Doubly linked list |

If you can recognize the signal, you already know what to reach for. That recognition **is** the interview skill.

## Top 10 bugs to watch for

Across the whole module:

1. **Forgetting to save a pointer before overwriting it.** `cur.next = something` without first saving the old `cur.next` cuts off the rest of the list.
2. **Not using a dummy head** when the head might change (delete, insert, merge, partition).
3. **Returning `head` instead of the new head** after reversing or deleting.
4. **Returning `dummy` instead of `dummy.next`.** The sentinel leaks into the output.
5. **Wrong loop guard:** `cur !== null` vs `cur.next !== null`. Know which one stops **on** the last node vs **past** it.
6. **Advancing both sides of an `if/else` when you should only advance on "else."** Classic bug in removal loops after splicing.
7. **Using value equality for node comparisons.** Use `===` (reference equality) for "same node."
8. **Missing the trailing carry** in Add Two Numbers.
9. **Corrupting the original in deep-copy** (interleaving without unweaving).
10. **Off-by-one in the gap pointer:** advancing lead by `n` instead of `n + 1` lands you on the wrong predecessor.

## Edge cases you should always check

Before submitting any linked-list solution:

- [ ] Empty list (`head === null`).
- [ ] Single-node list.
- [ ] Two-node list (boundary behavior of slow/fast and merge-sort splits).
- [ ] All elements identical.
- [ ] Target is the head.
- [ ] Target is the tail.
- [ ] k (or n) equals 1, and k equals length.
- [ ] Cyclic list (if the function could be called on one).

Running through this mental checklist catches ~80% of bugs.

## The recurring mental model

Every linked-list algorithm boils down to one or more of these primitives:

1. **Walk** (traverse with `cur = cur.next`).
2. **Save** (cache a pointer before overwriting).
3. **Flip** (rewrite a single `.next`).
4. **Splice** (connect one sub-chain to another).
5. **Split** (null-terminate somewhere in the middle to detach a sub-chain).
6. **Stitch** (reattach two sub-chains after modifications).

When you're stuck, ask: which of these six am I actually trying to do? Name the step, find the two or three pointers involved, write them down, and the code follows.

## The practice ladder

A graded set of problems roughly from easy to hard. Solve in order; resist the urge to skip.

### Tier 1 — warmup (single pattern)

- [Middle of the Linked List](/problems/middle-of-the-linked-list) — slow/fast.
- [Linked List Cycle](/problems/linked-list-cycle) — Floyd's, yes/no form.
- [Reverse Linked List](/problems/reverse-linked-list) — iterative & recursive.
- [Merge Two Sorted Lists](/problems/merge-two-sorted-lists) — dummy + splice.
- [Remove Linked List Elements](/problems/remove-linked-list-elements) — dummy + removal loop.
- [Remove Duplicates from Sorted List](/problems/remove-duplicates-from-sorted-list) — single-pass scan.

### Tier 2 — core (combine two patterns)

- [Remove Nth Node from End](/problems/remove-nth-node-from-end-of-list) — dummy + lead/follow gap.
- [Intersection of Two Linked Lists](/problems/intersection-of-two-linked-lists) — pointer-switch trick.
- [Palindrome Linked List](/problems/palindrome-linked-list) — middle + reverse + compare.
- [Reverse Linked List II](/problems/reverse-linked-list-ii) — dummy + predecessor + pull-forward.
- [Remove Duplicates from Sorted List II](/problems/remove-duplicates-from-sorted-list-ii) — dummy + lookahead.
- [Add Two Numbers](/problems/add-two-numbers) — parallel walk with carry.
- [Partition List](/problems/partition-list) — two dummy-headed lists, splice.

### Tier 3 — advanced (composition + pointer surgery)

- [Reorder List](/problems/reorder-list) — middle + reverse + interleave.
- [Sort List](/problems/sort-list) — merge sort.
- [Reverse Nodes in k-Group](/problems/reverse-nodes-in-k-group) — getKth + bounded reverse + re-stitch.
- [Copy List with Random Pointer](/problems/copy-list-with-random-pointer) — hash map or interleave.
- [Merge k Sorted Lists](/problems/merge-k-sorted-lists) — min-heap or divide-and-conquer pairwise merge.

### Tier 4 — LC 142 (no in-repo practice), plus exploratory

- **LC 142** Linked List Cycle II — Floyd's phase 2 derivation. Solve on LeetCode.
- **LC 287** Find the Duplicate Number — array as implicit linked list; cycle detection.
- **LC 146** LRU Cache — doubly linked list + hash map.

## One final habit

**Draw the before/after on paper.** Linked-list bugs die the moment you draw three boxes labeled `prev, cur, next` with arrows, and write the code to match. The algebra of `cur.next.next = prev.next.next` is unreadable; the picture is not.

Master the primitives, recognize the patterns, sanity-check the edges, and list problems stop being scary.

## What's next

You've completed **Module 08: Linked List**. You now have all six building-block data structures under your belt: stack, queue, deque, singly linked list, doubly linked list, and the base arrays/strings/maps/sets from earlier modules. Next modules will move into **tree** structures (binary trees, BSTs, tries) and **graphs** — and you'll see every pattern in this module resurface in a new disguise.
