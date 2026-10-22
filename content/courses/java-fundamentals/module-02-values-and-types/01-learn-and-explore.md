# Values, types, and expressions

**Real-life problem:** A grocery store calculates basket totals.

**You will learn:** Primitive values and reference values; Operators, promotion, and integer division; Conversions, overflow, and final; Money and trustworthy input.

## Chapter 1: Primitive values and reference values

Use int for ordinary whole-number counts, long for larger ranges, boolean for decisions, and double for approximate real numbers. String is a reference type. Local variables need a value before use. Field defaults do not mean uninitialized local variables are safe to read.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int count = 3;
long population = 9000000000L;
boolean available = count > 0;
char initial = 'J';
System.out.println(available + ":" + initial);
```


<details>
<summary>Check the result and reasoning</summary>


```text
true:J
```


The L suffix makes the large literal a long. A char uses single quotes. byte and short cover smaller integer ranges; float uses an f suffix. var can infer a local type from an initializer, but it is not dynamic typing.

</details>

**Your turn:** Can var count = 3 later accept the String "three"?

<details>
<summary>Check your reasoning</summary>

No. The inferred type is int and remains int. Integer is a wrapper reference type used when an API requires an object; unboxing a null Integer throws NullPointerException.

</details>

## Chapter 2: Operators, promotion, and integer division

Java evaluates expressions according to precedence and operand types. Dividing two ints discards the fractional part before any later assignment to double. Parentheses communicate intention. Convert an operand before division when a fractional result is required.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
System.out.println(2 + 3 * 4);
System.out.println((2 + 3) * 4);
System.out.println(-5 / 2);
```


<details>
<summary>Check the result and reasoning</summary>


```text
14
20
-2
```


Multiplication binds more tightly than addition. Parentheses change grouping. Integer division truncates toward zero, including negative operands. % gives the integer remainder; logical and bitwise operators have different jobs.

</details>

**Your turn:** What are 5 % 2 and 1 << 3?

<details>
<summary>Check your reasoning</summary>

1 and 8. Remainder helps test divisibility; the left shift moves bits. Do not substitute bitwise & for short-circuit && when a guard must avoid evaluating an unsafe right operand.

</details>

## Chapter 3: Conversions, overflow, and final

Widening an int to long preserves its value; narrowing may lose information. Ordinary integer arithmetic can overflow silently. Use Math.addExact when overflow must fail explicitly. final prevents reassignment of a variable; it does not make a referenced object immutable.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
System.out.println((byte) 130);
final int[] counts = {1};
counts[0] = 2;
System.out.println(counts[0]);
```


<details>
<summary>Check the result and reasoning</summary>


```text
-126
2
```


Narrowing to byte keeps only eight bits. final fixes the reference binding, but the referenced array remains mutable. A widening conversion can still lose precision when a large integer becomes a floating-point value.

</details>

**Your turn:** Why is Math.addExact(Integer.MAX_VALUE, 1) useful?

<details>
<summary>Check your reasoning</summary>

It throws ArithmeticException instead of silently wrapping. Choose the numeric range and failure contract before accepting input.

</details>

## Chapter 4: Money and trustworthy input

Use integer minor units for a simple basket, or BigDecimal with an explicit rounding rule for decimal financial calculations. Construct decimal amounts from strings. Validate quantities before calculation; changing the numeric type does not repair an invalid business rule.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var price = new java.math.BigDecimal("0.10");
System.out.println(price.multiply(new java.math.BigDecimal("3")));
```


<details>
<summary>Check the result and reasoning</summary>


```text
0.30
```


Decimal strings preserve the intended decimal input. Binary floating point approximates many decimal fractions. BigDecimal is immutable: multiply returns a new value instead of changing price.

</details>

**Your turn:** Would price.multiply(...) change price if the result were ignored?

<details>
<summary>Check your reasoning</summary>

No. Use the returned value. Specify a rounding policy for divisions and decide whether prices are represented as paise or decimal rupees at each boundary.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Values, types, and expressions",
  "code": "int apples = 3;\nint priceInPaise = 1250;\nint total = apples * priceInPaise;\nSystem.out.println(total);\nSystem.out.println(5 / 2);\nSystem.out.println(5 / 2.0);",
  "output": "3750\n2\n2.5",
  "steps": [
    {
      "label": "Read quantities",
      "detail": "apples = 3; priceInPaise = 1250."
    },
    {
      "label": "Multiply",
      "detail": "total = 3750 paise. No floating point rounding is involved."
    },
    {
      "label": "Compare divisions",
      "detail": "5 / 2 evaluates to int 2; 5 / 2.0 evaluates to double 2.5."
    }
  ],
  "prediction": {
    "question": "What three lines does this basket example print?",
    "options": [
      "3750\n2.5\n2.5",
      "3750\n2\n2",
      "1250\n2\n2.5",
      "3750\n2\n2.5"
    ],
    "answer": 3,
    "explanation": "apples = 3; priceInPaise = 1250. total = 3750 paise. No floating point rounding is involved. 5 / 2 evaluates to int 2; 5 / 2.0 evaluates to double 2.5."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-fundamentals/module-02-values-and-types/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
