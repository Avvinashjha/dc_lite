# Practical lab: Collections and equality

An inventory system tracks stock and unique product codes.

## Your challenge

Count occurrences in [tea, coffee, tea, milk] using a Map, then return the distinct codes in insertion order.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] tea has count 2.
- [ ] coffee and milk have count 1.
- [ ] The key order is tea, coffee, milk.

<details>
<summary>Show a hint</summary>

LinkedHashMap plus merge(key, 1, Integer::sum) handles first and repeated values.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
var counts = new java.util.LinkedHashMap<String, Integer>();
for (String code : java.util.List.of("tea", "coffee", "tea", "milk"))
  counts.merge(code, 1, Integer::sum);
System.out.println(counts);
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `developer-core/` for this stage. Run `./mvnw -pl developer-core test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-developer-core/module-02-collections-and-equality/03-module-quiz) · [Try independent public practice](/quiz/java-collections-and-equality-practice) · [See the full path](/courses/java)
