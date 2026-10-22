# Files, NIO, and resource management

**Real-life problem:** The expense tracker exports and imports a local report.

**You will learn:** Path, Files, and character encodings; Buffered I/O and streaming large files; Validation, CSV, and safe paths; Serialization and reliable writes.

## Chapter 1: Path, Files, and character encodings

Path represents a location; Files performs operations. Prefer Path.resolve to manual separator concatenation. Specify UTF-8 for text interoperability. Relative paths resolve against the current working directory, so print the absolute path when diagnosing a missing file.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var base = java.nio.file.Path.of("reports");
System.out.println(base.resolve("october.txt").getFileName());
```


<details>
<summary>Check the result and reasoning</summary>


```text
october.txt
```


resolve composes paths without hard-coded platform separators. A Path describes a location; it does not open a file. Relative paths still depend on the process working directory.

</details>

**Your turn:** Why does a file work in an IDE but fail from a terminal?

<details>
<summary>Check your reasoning</summary>

The launch working directory may differ. Inspect path.toAbsolutePath() and configure the intended storage root explicitly.

</details>

## Chapter 2: Buffered I/O and streaming large files

readString is convenient for bounded small inputs. Large files need a streaming approach that does not load everything into memory. Files.lines returns a stream that owns an open resource; close it with try-with-resources. Close behavior matters even when a terminal operation short-circuits.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var path = java.nio.file.Files.createTempFile("course-", ".txt");
try { java.nio.file.Files.writeString(path,"one\ntwo\n",java.nio.charset.StandardCharsets.UTF_8); try(var lines = java.nio.file.Files.lines(path)) { System.out.println(lines.count()); } } finally { java.nio.file.Files.deleteIfExists(path); }
```


<details>
<summary>Check the result and reasoning</summary>


```text
2
```


The line stream owns an open file resource and must be closed. This small fixture is UTF-8. Streaming is suitable when the file is large, while readString loads the entire text into memory.

</details>

**Your turn:** Will count automatically guarantee that the Files.lines resource is closed?

<details>
<summary>Check your reasoning</summary>

No. Own the stream in try-with-resources, including when a terminal operation returns early or throws.

</details>

## Chapter 3: Validation, CSV, and safe paths

Treat imported files as input: bound size, validate fields, and report useful line numbers. CSV quoting allows embedded commas and line breaks, so split(",") is not a general CSV parser. Do not let an unchecked user filename escape an intended storage directory through path traversal or symlinks.

**Follow the working project:** The reference chooses a real JSON parser and a bounded import instead of pretending that comma splitting handles CSV. All rows are parsed and validated before the service begins its batch transaction.

File in the [reference-project download](/downloads/java-course-labs.zip): `developer-core/src/main/java/in/dailycoder/core/ExpenseFiles.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.core;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;
import java.util.List;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** JSON avoids pretending split(",") is a CSV parser. Dates are ISO strings. */
public final class ExpenseFiles {
    private static final ObjectMapper MAPPER = new ObjectMapper();
    public record Row(String label, int amount, String date) {}
    public static void write(Path path, List<Expense> values) throws IOException {
        var rows = values.stream().map(value -> new Row(value.label(), value.amount(), value.date().toString())).toList();
        Files.writeString(path, MAPPER.writeValueAsString(rows), StandardCharsets.UTF_8);
    }
    public static List<Expense> read(Path path) throws IOException {
        if (Files.size(path) > 1_000_000) throw new IOException("Import exceeds the one-megabyte lab limit");
        var rows = MAPPER.readValue(Files.readString(path, StandardCharsets.UTF_8), new TypeReference<List<Row>>() {});
        return rows.stream().map(row -> new Expense(0, row.label(), row.amount(), java.time.LocalDate.parse(row.date()))).toList();
    }
}
```


</details>

**Observe:** A JSON export preserves a label containing commas and quotation marks.

**Your turn:** Import a malformed date or negative amount. Should a prefix of valid rows be committed?

<details>
<summary>Check your reasoning</summary>

No. The import validates the complete input first and the repository batch is transactional. For very large files, design a separate bounded batch and recovery policy.

</details>

## Chapter 4: Serialization and reliable writes

Use an explicit interchange format rather than native Java deserialization for untrusted data. For replacement writes, write a temporary file and move it into place when the filesystem supports the required atomic behavior. A successful write call alone does not establish a complete recovery strategy.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var target = java.nio.file.Files.createTempFile("course-target-", ".txt");
var temporary = java.nio.file.Files.createTempFile(target.getParent(), "course-stage-", ".txt");
try { java.nio.file.Files.writeString(temporary,"complete"); java.nio.file.Files.move(temporary,target,java.nio.file.StandardCopyOption.REPLACE_EXISTING); System.out.println(java.nio.file.Files.readString(target)); } finally { java.nio.file.Files.deleteIfExists(temporary); java.nio.file.Files.deleteIfExists(target); }
```


<details>
<summary>Check the result and reasoning</summary>


```text
complete
```


Stage a complete result before replacing the destination. This example does not promise an atomic move; requesting ATOMIC_MOVE can fail on unsupported filesystems. Native object deserialization is not a safe default interchange format for untrusted input.

</details>

**Your turn:** Does normalize() alone stop a symlink from escaping an upload directory?

<details>
<summary>Check your reasoning</summary>

No. Resolve ownership and real paths under an explicit storage policy; lexical cleanup is not a complete filesystem security boundary.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Files, NIO, and resource management",
  "code": "var path = java.nio.file.Files.createTempFile(\"expenses-\", \".txt\");\ntry {\n  java.nio.file.Files.writeString(path, \"Food:1250\\nBus:300\\n\", java.nio.charset.StandardCharsets.UTF_8);\n  try (var lines = java.nio.file.Files.lines(path, java.nio.charset.StandardCharsets.UTF_8)) {\n    System.out.println(lines.count());\n  }\n} finally {\n  java.nio.file.Files.deleteIfExists(path);\n}",
  "output": "2",
  "steps": [
    {
      "label": "Create",
      "detail": "A temporary path is allocated for this experiment."
    },
    {
      "label": "Write and read",
      "detail": "UTF-8 writes two records; the line stream counts 2."
    },
    {
      "label": "Close and clean",
      "detail": "The stream closes before the temporary file is deleted."
    }
  ],
  "prediction": {
    "question": "How many lines are counted before the temporary file is deleted?",
    "options": [
      "2",
      "1",
      "0",
      "3"
    ],
    "answer": 0,
    "explanation": "A temporary path is allocated for this experiment. UTF-8 writes two records; the line stream counts 2. The stream closes before the temporary file is deleted."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-developer-core/module-05-files-and-resources/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

<details>
<summary>Official references and further reading</summary>

- [Java language, APIs, and JVM learning map](https://dev.java/learn/)
- [Java LTS release roadmap](https://www.oracle.com/technetwork/java/javase/tech/eol-135779.html)
- [Virtual thread adoption guidance](https://inside.java/2023/09/20/virtual-threads-adoption-guide/)
- [Maven project and dependency guides](https://maven.apache.org/guides/)
- [JUnit Jupiter user guide](https://docs.junit.org/6.1.3/overview.html)
- [Spring REST service guide](https://spring.io/guides/gs/rest-service/)
- [Spring Data JPA guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [Spring Boot testing reference](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html)
- [Spring Boot Java compatibility](https://docs.spring.io/spring-boot/system-requirements.html)

</details>
