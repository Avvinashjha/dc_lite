# Practical lab: Executors, futures, and virtual threads

A service makes several independent blocking lookups.

## Your challenge

Submit three independent lookup tasks, give result retrieval a timeout, and document how failures and unfinished tasks are cleaned up.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] Collect all three successful values.
- [ ] A deliberately slow task triggers a timed get failure.
- [ ] Request cancellation for remaining work and close the executor.
- [ ] Explain that cancellation is cooperative and close may still wait.

<details>
<summary>Show a hint</summary>

Future.get(timeout, TimeUnit) bounds that wait; it does not automatically cancel the task.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
  var task = executor.submit(() -> "available");
  try {
    System.out.println(task.get(1, java.util.concurrent.TimeUnit.SECONDS));
  } finally {
    task.cancel(true);
  }
}
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `backend/` for this stage. Run `./mvnw -pl backend test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-advanced/module-03-executors-and-virtual-threads/03-module-quiz) · [Try independent public practice](/quiz/java-executors-and-virtual-threads-practice) · [See the full path](/courses/java)
