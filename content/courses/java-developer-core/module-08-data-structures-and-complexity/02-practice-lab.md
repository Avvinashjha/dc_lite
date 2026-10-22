# Practical lab: Data structures and algorithmic thinking

A support queue needs fast lookups and prioritized work.

## Your challenge

Create a support priority queue of Ticket(priority, id), serving lower priority numbers first and breaking ties by id.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] Tickets (2, B), (1, C), (1, A) are served A, C, B.
- [ ] Repeated poll is used rather than relying on iteration order.
- [ ] An empty queue is handled without dereferencing null.

<details>
<summary>Show a hint</summary>

Compose comparingInt with thenComparing.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
record Ticket(int priority, String id) {}
var tickets = new java.util.PriorityQueue<Ticket>(java.util.Comparator.comparingInt(Ticket::priority).thenComparing(Ticket::id));
tickets.add(new Ticket(2, "B"));
tickets.add(new Ticket(1, "C"));
tickets.add(new Ticket(1, "A"));
while (!tickets.isEmpty()) System.out.println(tickets.poll().id());
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `developer-core/` for this stage. Run `./mvnw -pl developer-core test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-developer-core/module-08-data-structures-and-complexity/03-module-quiz) · [Try independent public practice](/quiz/java-data-structures-and-complexity-practice) · [See the full path](/courses/java)
