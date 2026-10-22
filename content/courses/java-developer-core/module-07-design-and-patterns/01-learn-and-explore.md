# Clean design and practical patterns

**Real-life problem:** An order service chooses a pricing policy without a growing conditional.

**You will learn:** Cohesion, coupling, and SOLID; Strategy, factory, and builder; Composition, immutability, and ownership; Refactoring without changing behavior.

## Chapter 1: Cohesion, coupling, and SOLID

Keep behavior that changes together in a cohesive component. Reduce coupling by passing focused collaborators. Single responsibility is about reasons to change, not forcing every class to contain one method. Use dependency inversion when a boundary needs substitutable behavior.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
interface Tax { int paise(int base); }
record Bill(Tax tax) { int total(int base) { return Math.addExact(base,tax.paise(base)); } }
System.out.println(new Bill(base -> base/10).total(1000));
```


<details>
<summary>Check the result and reasoning</summary>


```text
1100
```


The high-level bill depends on a tax capability, not a specific vendor integration. This is useful dependency inversion at a meaningful boundary, not a requirement to create an interface for every class.

</details>

**Your turn:** What should remain unchanged when a tax implementation changes?

<details>
<summary>Check your reasoning</summary>

The bill caller’s contract. Keep the responsibility for choosing a policy outside the calculation unless selection itself belongs to the domain operation.

</details>

## Chapter 2: Strategy, factory, and builder

Strategy captures interchangeable algorithms such as pricing rules. A factory centralizes meaningful construction choices. A builder helps when many optional settings need readable assembly and validation. Learn the problem each pattern solves before adding its classes.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
interface Pricing { int total(int base); }
Pricing member = base -> base * 9 / 10;
Pricing regular = base -> base;
System.out.println(member.total(1000) + ":" + regular.total(1000));
```


<details>
<summary>Check the result and reasoning</summary>


```text
900:1000
```


Strategy chooses behavior through a common contract. Factories choose construction, builders assemble complex configuration, adapters translate an external API, and decorators add behavior around another implementation.

</details>

**Your turn:** Which pattern fits adapting a vendor’s exchange-rate response to ExchangeRates?

<details>
<summary>Check your reasoning</summary>

Adapter. Keep vendor status codes and JSON mapping inside that boundary while the service depends on a stable domain-facing interface.

</details>

## Chapter 3: Composition, immutability, and ownership

Prefer explicit ownership of mutable state. Copy a list when accepting it into an immutable value object. A copied list of mutable elements is still shallow. Small immutable values simplify equality, caching, and reasoning across threads.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
record Basket(java.util.List<String> products) { public Basket { products = java.util.List.copyOf(products); } }
var source = new java.util.ArrayList<>(java.util.List.of("tea"));
var basket = new Basket(source);
source.clear();
System.out.println(basket.products());
```


<details>
<summary>Check the result and reasoning</summary>


```text
[tea]
```


Copying a caller-owned collection makes structural ownership explicit. An immutable value object avoids surprising changes after construction and makes many caching and thread-sharing scenarios easier to reason about.

</details>

**Your turn:** Does this require a deep copy of String objects?

<details>
<summary>Check your reasoning</summary>

No. Strings are immutable. Mutable product entities would need a separate policy rather than an automatic assumption that one list copy freezes everything.

</details>

## Chapter 4: Refactoring without changing behavior

Start from a passing behavior test, move one responsibility at a time, and rerun the relevant cases. Name operations in the domain’s language. Remove unnecessary abstraction when it makes a simple rule harder to inspect. Patterns should reduce the cost of change rather than decorate code.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
int before(int value) { return value * 9 / 10; }
int after(int value) { int discount = value / 10; return value - discount; }
System.out.println(before(101));
System.out.println(after(101));
```


<details>
<summary>Check the result and reasoning</summary>


```text
90
91
```


The expressions look equivalent over real numbers, but integer rounding makes them different. A behavior-preserving refactor needs representative and boundary tests rather than only a visual similarity check.

</details>

**Your turn:** Which input would fail to expose this refactor bug?

<details>
<summary>Check your reasoning</summary>

1000 produces 900 in both versions. Include values that are not evenly divisible by ten.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Clean design and practical patterns",
  "code": "interface Pricing { int total(int base); }\nclass RegularPricing implements Pricing {\n  public int total(int base) { return base; }\n}\nclass MemberPricing implements Pricing {\n  public int total(int base) { return base * 9 / 10; }\n}\nPricing policy = new MemberPricing();\nSystem.out.println(policy.total(1000));",
  "output": "900",
  "steps": [
    {
      "label": "Select strategy",
      "detail": "The caller chooses a MemberPricing implementation."
    },
    {
      "label": "Delegate",
      "detail": "total(1000) runs the membership algorithm."
    },
    {
      "label": "Result",
      "detail": "The same Pricing contract returns 900 without a type switch."
    }
  ],
  "prediction": {
    "question": "Which member price does the selected strategy print?",
    "options": [
      "100",
      "1100",
      "900",
      "1000"
    ],
    "answer": 2,
    "explanation": "The caller chooses a MemberPricing implementation. total(1000) runs the membership algorithm. The same Pricing contract returns 900 without a type switch."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-developer-core/module-07-design-and-patterns/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
