# Practical lab: Lambdas, streams, and Optional

A shop computes revenue from paid orders.

## Your challenge

Find the largest paid order as an OptionalInt and provide zero only at the display boundary.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] The sample produces 100.
- [ ] A list with no paid orders displays 0.
- [ ] Do not call getAsInt without checking absence.

<details>
<summary>Show a hint</summary>

Use filter, mapToInt, max, and orElse.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
int largest = orders.stream().filter(Order::paid).mapToInt(Order::total).max().orElse(0);
System.out.println(largest);
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `developer-core/` for this stage. Run `./mvnw -pl developer-core test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-developer-core/module-03-lambdas-and-streams/03-module-quiz) · [Try independent public practice](/quiz/java-lambdas-and-streams-practice) · [See the full path](/courses/java)
