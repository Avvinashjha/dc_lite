# Strings, text, and input

**Real-life problem:** A help desk normalizes customer reference codes.

**You will learn:** Immutable strings and equality; StringBuilder and formatting; Unicode and text boundaries; Parsing and input validation.

## Chapter 1: Immutable strings and equality

A String does not change after construction. Operations such as strip and toUpperCase return a result that you must use. equals compares content; == compares reference identity. String interning can make identity tests seem to work until input comes from another source.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
String first = new String("tea");
String second = new String("tea");
System.out.println(first == second);
System.out.println(first.equals(second));
```


<details>
<summary>Check the result and reasoning</summary>


```text
false
true
```


These are deliberately separate objects with equal content. Literal interning can make == appear to work on some examples, so do not infer a content-comparison rule from interned literals.

</details>

**Your turn:** What happens when you invoke first.toUpperCase() without storing its result?

<details>
<summary>Check your reasoning</summary>

first still contains tea. String operations return new results instead of mutating the original value.

</details>

## Chapter 2: StringBuilder and formatting

Build text incrementally with StringBuilder when many additions happen in a loop. A builder is mutable and is not a replacement for synchronization. Use formatted output to separate the template from its values, and choose an explicit locale when formatting machine-readable text.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var builder = new StringBuilder("Order");
builder.append(": ").append(3);
System.out.println(builder);
```


<details>
<summary>Check the result and reasoning</summary>


```text
Order: 3
```


The builder changes as each append executes. Converting it to a String produces a value useful for an output boundary. Sharing a builder among threads requires coordination; it is not intrinsically thread-safe.

</details>

**Your turn:** Why can repeated immutable concatenation be wasteful in a large loop?

<details>
<summary>Check your reasoning</summary>

It can repeatedly create intermediate strings. Prefer a builder or a suitable joining collector when accumulating many pieces.

</details>

## Chapter 3: Unicode and text boundaries

A Java char is a UTF-16 code unit, not necessarily a complete user-perceived character. Some code points occupy two chars; emoji sequences can contain multiple code points. Do not assume length equals the number of visible symbols or split arbitrary text at an unchecked char index.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
String symbol = "😀";
System.out.println(symbol.length());
System.out.println(symbol.codePointCount(0, symbol.length()));
```


<details>
<summary>Check the result and reasoning</summary>


```text
2
1
```


This emoji occupies a surrogate pair: two UTF-16 code units for one code point. A visible grapheme can be more complex still, so code points are not always the final measure of user-perceived characters.

</details>

**Your turn:** Would substring(0, 1) safely extract this entire emoji?

<details>
<summary>Check your reasoning</summary>

No. It would split the surrogate pair. Use code-point-aware traversal and, for user-perceived text boundaries, an appropriate grapheme segmentation approach.

</details>

## Chapter 4: Parsing and input validation

Read input as text, strip permitted whitespace, and parse it with an explicit error policy. Scanner nextInt leaves a line separator for a later nextLine, a common source of empty reads. Treat null, blank text, invalid numbers, and out-of-range values as different cases.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var scanner = new java.util.Scanner("12\nhello\n");
System.out.println(scanner.nextInt());
System.out.println(scanner.nextLine().isEmpty());
System.out.println(scanner.nextLine());
scanner.close();
```


<details>
<summary>Check the result and reasoning</summary>


```text
12
true
hello
```


nextInt consumes the numeric token, leaving the rest of the line. The nextLine immediately afterward returns that remainder, which is empty here.

</details>

**Your turn:** How can a command parser avoid this interaction?

<details>
<summary>Check your reasoning</summary>

Read whole lines consistently, then parse individual fields. Validate numeric syntax and business range separately.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Strings, text, and input",
  "code": "String raw = \"  ab-42  \";\nString code = raw.strip().toUpperCase(java.util.Locale.ROOT);\nSystem.out.println(code);\nSystem.out.println(raw.equals(code));",
  "output": "AB-42\nfalse",
  "steps": [
    {
      "label": "Original text",
      "detail": "raw still contains leading and trailing spaces."
    },
    {
      "label": "Normalize",
      "detail": "strip returns ab-42; uppercase with ROOT returns AB-42."
    },
    {
      "label": "Compare",
      "detail": "raw and code contain different text, so equals returns false."
    }
  ],
  "prediction": {
    "question": "What does the normalization and comparison print?",
    "options": [
      "AB-42\ntrue",
      "ab-42\nfalse",
      "  AB-42  \ntrue",
      "AB-42\nfalse"
    ],
    "answer": 3,
    "explanation": "raw still contains leading and trailing spaces. strip returns ab-42; uppercase with ROOT returns AB-42. raw and code contain different text, so equals returns false."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-fundamentals/module-06-strings-and-input/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
