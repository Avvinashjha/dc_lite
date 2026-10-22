# Practical lab: Threads, visibility, and shared state

Prevent lost updates when two workers count orders.

## Your challenge

Implement a synchronized counter, exercise it with two joined threads, and compare its contract with AtomicInteger.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] The final count is 2000 after both joins.
- [ ] The increment and read operations follow one consistent lock policy.
- [ ] Explain why volatile int plus count++ is insufficient.

<details>
<summary>Show a hint</summary>

Synchronize both increment and value methods on the same receiver.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
class Counter {
  private int value;
  synchronized void increment() { value++; }
  synchronized int value() { return value; }
}
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `backend/` for this stage. Run `./mvnw -pl backend test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-advanced/module-02-threads-and-shared-state/03-module-quiz) · [Try independent public practice](/quiz/java-threads-and-shared-state-practice) · [See the full path](/courses/java)
