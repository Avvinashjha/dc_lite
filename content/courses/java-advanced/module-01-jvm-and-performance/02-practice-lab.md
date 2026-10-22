# Practical lab: JVM internals and performance

Diagnose a service whose memory use grows over time.

## Your challenge

Profile a local workload with JFR, compare a bounded cache to an unbounded map, and record evidence rather than adding a GC call.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] Capture a recording using jcmd <pid> JFR.start name=lab settings=profile duration=30s filename=lab.jfr.
- [ ] Record the workload and compare allocation or retention behavior.
- [ ] Explain why clear does not guarantee an immediate drop in process memory.

<details>
<summary>Show a hint</summary>

Run jcmd -l to find a local process id. Keep the workload alive while recording.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
// A bounded access-order cache for a single-threaded demonstration.
var bounded = new java.util.LinkedHashMap<Integer, byte[]>(16, 0.75f, true) {
  protected boolean removeEldestEntry(java.util.Map.Entry<Integer, byte[]> eldest) {
    return size() > 2;
  }
};
for (int i = 0; i < 3; i++) bounded.put(i, new byte[1024]);
System.out.println(bounded.size());
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `backend/` for this stage. Run `./mvnw -pl backend test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-advanced/module-01-jvm-and-performance/03-module-quiz) · [Try independent public practice](/quiz/java-jvm-and-performance-practice) · [See the full path](/courses/java)
