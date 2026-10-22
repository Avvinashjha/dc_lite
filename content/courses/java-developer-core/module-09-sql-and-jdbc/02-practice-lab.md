# Practical lab: SQL, JDBC, and transactions

Persist expenses in a relational database.

## Your challenge

Create an expenses table and implement a JDBC repository with add and findAtLeast methods. Use a test database and prepared values.

## Environment

Maven project with a JDBC driver, DataSource, and expenses table containing (Food,1250) and (Bus,300). This is a project fragment, not a standalone JShell program.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] Food 1250 and Bus 300 persist across repository calls.
- [ ] findAtLeast(1000) returns only Food.
- [ ] A label containing an apostrophe is stored correctly.
- [ ] A failed multi-write transaction leaves no partial records.

<details>
<summary>Show a hint</summary>

Use CREATE TABLE expenses (id BIGINT PRIMARY KEY, label VARCHAR(100) NOT NULL, amount INTEGER NOT NULL CHECK (amount > 0)); manage test connections independently.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
// Insert fragment inside a resource-managed connection named connection.
try (var insert = connection.prepareStatement("INSERT INTO expenses(id, label, amount) VALUES (?, ?, ?)")) {
  insert.setLong(1, 1L);
  insert.setString(2, "Food");
  insert.setInt(3, 1250);
  insert.executeUpdate();
}
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `developer-core/` for this stage. Run `./mvnw -pl developer-core test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-developer-core/module-09-sql-and-jdbc/03-module-quiz) · [Try independent public practice](/quiz/java-sql-and-jdbc-practice) · [See the full path](/courses/java)
