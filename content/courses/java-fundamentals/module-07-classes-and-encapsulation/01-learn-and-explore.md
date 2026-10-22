# Classes, objects, and encapsulation

**Real-life problem:** A digital wallet protects its balance.

**You will learn:** Classes, instances, and constructors; Encapsulation and invariants; Instance versus static and object references; Immutable values, equals, and hashCode.

## Chapter 1: Classes, instances, and constructors

A class defines state and behavior; each instance owns its instance fields. A constructor establishes a valid initial state. Think of two wallets: they share rules, but adding money to one must not change the other. this identifies the current receiver.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
class Account { private int balance; Account(int opening) { if (opening < 0) throw new IllegalArgumentException(); this.balance = opening; } int balance() { return balance; } }
System.out.println(new Account(50).balance());
```


<details>
<summary>Check the result and reasoning</summary>


```text
50
```


The constructor establishes the invariant before the instance becomes available. private members belong to the declaring class, package access is the default, protected supports controlled inheritance access, and public exposes an API.

</details>

**Your turn:** Would a public setter accepting negative balances preserve this invariant?

<details>
<summary>Check your reasoning</summary>

No. Every mutating operation needs to preserve the rule; hiding only the initial field does not protect later state changes.

</details>

## Chapter 2: Encapsulation and invariants

Keep the balance private and expose operations that preserve its rules. A public setter that accepts any number allows impossible states. Encapsulation is the ability to maintain an invariant through a controlled API, not merely adding getters and setters to every field.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
class Stock { private int quantity = 2; void sell(int count) { if (count <= 0 || count > quantity) throw new IllegalArgumentException(); quantity -= count; } int remaining() { return quantity; } }
Stock stock = new Stock();
try { stock.sell(3); } catch (IllegalArgumentException ex) {}
System.out.println(stock.remaining());
```


<details>
<summary>Check the result and reasoning</summary>


```text
2
```


All checks run before mutation, so a rejected sale leaves the object unchanged. A no-op catch is acceptable here only to expose the preserved state in a tiny experiment; an application boundary must provide useful feedback.

</details>

**Your turn:** What goes wrong if quantity is decremented before validation?

<details>
<summary>Check your reasoning</summary>

A failed operation can leave partial or invalid state. Validate first, or use an explicit rollback strategy when work cannot be checked ahead of mutation.

</details>

## Chapter 3: Instance versus static and object references

Instance methods operate on a receiver; static members belong to the class. Assigning one wallet reference to another variable does not clone the wallet. Both variables can reach the same instance. Use an identity diagram to distinguish variables from the objects they reference.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
class Counter { static int created; Counter() { created++; } }
new Counter(); new Counter();
System.out.println(Counter.created);
```


<details>
<summary>Check the result and reasoning</summary>


```text
2
```


One static field is shared through the class rather than duplicated for each object. An inner nonstatic class carries an enclosing instance reference; a static nested class does not require an outer instance.

</details>

**Your turn:** Would using a static wallet balance be appropriate for independent customer wallets?

<details>
<summary>Check your reasoning</summary>

No. Every wallet would observe shared state. Keep balances as instance state, and use static members only for behavior or state genuinely belonging to the class.

</details>

## Chapter 4: Immutable values, equals, and hashCode

Value objects compare meaningful state rather than identity. Equal objects must have equal hash codes. Keep the fields used in equality stable when the object is a map key. Prefer immutable value types for amounts and identifiers; mutable entities need deliberate lifecycle rules.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
record ProductCode(String value) {}
var codes = new java.util.HashSet<ProductCode>();
codes.add(new ProductCode("T1"));
codes.add(new ProductCode("T1"));
System.out.println(codes.size());
```


<details>
<summary>Check the result and reasoning</summary>


```text
1
```


Record equality and hashCode use their components. Two separate objects with the same value therefore represent one set entry. A mutable field used in hashing can break lookup when changed after insertion.

</details>

**Your turn:** Would using only the same hash code prove two product codes are equal?

<details>
<summary>Check your reasoning</summary>

No. Hash collisions are legal. Hash-based collections also use equals to distinguish candidates.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Classes, objects, and encapsulation",
  "code": "class Wallet {\n  private int balance;\n  void deposit(int amount) {\n    if (amount <= 0) throw new IllegalArgumentException(\"Positive amount required\");\n    balance = Math.addExact(balance, amount);\n  }\n  int balance() { return balance; }\n}\nWallet first = new Wallet();\nWallet alias = first;\nalias.deposit(50);\nSystem.out.println(first.balance());",
  "output": "50",
  "steps": [
    {
      "label": "Allocate",
      "detail": "One Wallet object starts with balance 0."
    },
    {
      "label": "Alias",
      "detail": "first and alias both refer to that same wallet."
    },
    {
      "label": "Deposit",
      "detail": "alias.deposit changes the shared object; first.balance() is 50."
    }
  ],
  "prediction": {
    "question": "What balance is visible through first after alias.deposit(50)?",
    "options": [
      "100",
      "A new wallet is allocated, so first is unchanged",
      "50",
      "0"
    ],
    "answer": 2,
    "explanation": "One Wallet object starts with balance 0. first and alias both refer to that same wallet. alias.deposit changes the shared object; first.balance() is 50."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-fundamentals/module-07-classes-and-encapsulation/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
