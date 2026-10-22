# Practical lab: Exceptions and the fundamentals capstone

Build a resilient command-line expense tracker.

## Your challenge

Build the expense tracker using a record, a service class, and a command loop. Add a total command and recover from malformed input.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] Adding Food 1250 and Bus 300 gives a total of 1550.
- [ ] A negative amount and nonnumeric input show a useful error without exiting.
- [ ] list preserves valid expenses; exit terminates the loop.
- [ ] Keep parsing, storage, and printing in separate methods.

<details>
<summary>Show a hint</summary>

NumberFormatException extends IllegalArgumentException. Catch at the command boundary rather than inside every method.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
record Expense(String label, int amount) {
  public Expense {
    if (label == null || label.isBlank() || amount <= 0)
      throw new IllegalArgumentException("Invalid expense");
  }
}
var expenses = new java.util.ArrayList<Expense>();
expenses.add(new Expense("Food", 1250));
expenses.add(new Expense("Bus", 300));
int total = 0;
for (Expense expense : expenses) total = Math.addExact(total, expense.amount());
System.out.println(total);
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `fundamentals/` for this stage. Run `./mvnw -pl fundamentals test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-fundamentals/module-10-exceptions-and-capstone/03-module-quiz) · [Try independent public practice](/quiz/java-exceptions-and-capstone-practice) · [See the full path](/courses/java)
