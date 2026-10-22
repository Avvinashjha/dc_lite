# Practical lab: Resilience, caching, and messaging

Prevent duplicate charges when a dependency times out.

## Your challenge

Design and test a durable event consumer that applies an effect once per event id, including a crash between attempts.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] Delivering the same event twice produces one business effect.
- [ ] The processed-id marker and effect commit in one transaction.
- [ ] A rollback leaves both absent so a retry can apply them.
- [ ] The design survives process restart and concurrent deliveries.

<details>
<summary>Show a hint</summary>

Use a unique event-id constraint and a transactional write, not only an in-memory Set or a check-then-act.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```sql
-- Durable consumer building block; apply this marker and the business effect
-- inside one transaction, handling duplicate-key outcomes deliberately.
CREATE TABLE processed_event (event_id VARCHAR(100) PRIMARY KEY);
-- INSERT INTO processed_event(event_id) VALUES (?);
-- perform business change; COMMIT both, or ROLLBACK both.
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `backend/` for this stage. Run `./mvnw -pl backend test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-advanced/module-09-resilience-caching-and-messaging/03-module-quiz) · [Try independent public practice](/quiz/java-resilience-caching-and-messaging-practice) · [See the full path](/courses/java)
