# Modern Java, reflection, and modules

**Real-life problem:** Model API outcomes and inspect explicit application metadata.

**You will learn:** Records, sealed types, and pattern switches; Annotations and reflection; JPMS, exports, and opens; Packaging and migration choices.

## Chapter 1: Records, sealed types, and pattern switches

Use a sealed result hierarchy to enumerate success and failure shapes. Record patterns and pattern matching reduce casts while preserving type checking. Keep compatibility notes for older codebases, and distinguish finalized language features from preview features before adopting syntax.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
record Point(int x, int y) {}
Object value = new Point(2,3);
if (value instanceof Point(int x, int y)) System.out.println(x + y);
```


<details>
<summary>Check the result and reasoning</summary>


```text
5
```


A record pattern deconstructs an already checked value without a manual cast. Pattern matching helps express a domain shape; it does not validate every business rule automatically. Keep required examples on finalized Java features.

</details>

**Your turn:** Does a record pattern make a mutable list component deeply immutable?

<details>
<summary>Check your reasoning</summary>

No. Pattern matching exposes components; it does not change their ownership or mutability.

</details>

## Chapter 2: Annotations and reflection

Annotations are metadata whose retention controls where they are available. Reflection can inspect types and invoke members, but it introduces runtime failure and access constraints. Prefer ordinary interfaces for normal application extension; use reflection when metadata-driven infrastructure actually needs it.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
@java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME) @interface Label { String value(); }
@Label("receipt") class Tagged {}
System.out.println(Tagged.class.getAnnotation(Label.class).value());
```


<details>
<summary>Check the result and reasoning</summary>


```text
receipt
```


Runtime retention makes metadata available to reflection. SOURCE retention would not preserve the annotation in the runtime class. Reflection can fail at runtime and must honor access and module boundaries.

</details>

**Your turn:** When is an ordinary interface preferable to reflective method-name lookup?

<details>
<summary>Check your reasoning</summary>

When normal application collaboration can be expressed as a typed contract. Reflection is useful infrastructure, not a default replacement for compile-time checking.

</details>

## Chapter 3: JPMS, exports, and opens

A module descriptor declares dependencies and exported packages. exports allows ordinary access to public APIs; opens permits reflective access under module rules. The module path and classpath have different boundaries. Avoid broad reflective access flags as a substitute for understanding your framework’s integration requirements.

**Follow the working project:** JPMS declares dependencies and API visibility. exports permits normal API access; opens permits reflective access under module rules. The classpath does not impose the same named-module boundary.

File in the [reference-project download](/downloads/java-course-labs.zip): `modules/hello/module-info.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
module course.hello { exports in.dailycoder.hello; }
```


</details>

**Observe:** The descriptor exports only the public hello package.

**Your turn:** What changes if a framework needs reflective access to nonpublic members?

<details>
<summary>Check your reasoning</summary>

Open the necessary package to the appropriate module deliberately. Do not broadly open every package just to avoid understanding the integration.

</details>

## Chapter 4: Packaging and migration choices

A JAR packages classes and resources. jlink creates a custom runtime image for a known module graph. Modernize incrementally with behavior tests and explicit target releases. Learn to read Java 8, 17, and 21 idioms, while using Java 25 LTS as this path’s environment.

**Follow the working project:** The verification script compiles a small module, runs it on the module path, builds a custom runtime image, and runs the same main through that image. A JAR packages classes; a jlink image includes selected runtime modules.

File in the [reference-project download](/downloads/java-course-labs.zip): `verify.sh`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```bash
#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if [ -n "${JAVA_HOME:-}" ]; then PATH="$JAVA_HOME/bin:$PATH"; export PATH; fi
(unset TEST_DB_URL TEST_DB_USER TEST_DB_PASSWORD; ./mvnw "$@" --batch-mode verify)
if [ -n "${TEST_DB_URL:-}" ]; then
  ./mvnw "$@" --batch-mode -pl backend test
fi
mkdir -p modules/target/classes
javac -d modules/target/classes modules/hello/module-info.java modules/hello/in/dailycoder/hello/Main.java
java --module-path modules/target/classes --module course.hello/in.dailycoder.hello.Main
runtime_root=$(mktemp -d)
trap 'rm -rf "$runtime_root"' EXIT HUP INT TERM
jlink --module-path modules/target/classes --add-modules course.hello --output "$runtime_root/image"
"$runtime_root/image/bin/java" --module course.hello/in.dailycoder.hello.Main
```


</details>

**Observe:** The named module runs normally and through its jlink runtime image.

**Your turn:** Why must the JDK used to create an image match the intended target platform?

<details>
<summary>Check your reasoning</summary>

The image contains platform-specific runtime components. Build and verify it for the platform on which it will run.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Modern Java, reflection, and modules",
  "code": "sealed interface Outcome permits Success, Failure {}\nrecord Success(String message) implements Outcome {}\nrecord Failure(String reason) implements Outcome {}\nString describe(Outcome result) {\n  return switch (result) {\n    case Success s -> \"OK: \" + s.message();\n    case Failure f -> \"FAIL: \" + f.reason();\n  };\n}\nSystem.out.println(describe(new Success(\"saved\")));",
  "output": "OK: saved",
  "steps": [
    {
      "label": "Enumerate",
      "detail": "The sealed interface permits Success and Failure."
    },
    {
      "label": "Match",
      "detail": "The runtime value is a Success."
    },
    {
      "label": "Describe",
      "detail": "The matching arm returns OK: saved. Null is outside this sample contract."
    }
  ],
  "prediction": {
    "question": "Which switch result is printed for the shown Success value?",
    "options": [
      "null",
      "OK: saved",
      "FAIL: saved",
      "Success"
    ],
    "answer": 1,
    "explanation": "The sealed interface permits Success and Failure. The runtime value is a Success. The matching arm returns OK: saved. Null is outside this sample contract."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-advanced/module-04-modern-java-and-modules/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
