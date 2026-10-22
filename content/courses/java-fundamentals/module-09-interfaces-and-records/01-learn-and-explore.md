# Interfaces, abstraction, and modern models

**Real-life problem:** A payment checkout accepts different payment providers.

**You will learn:** Interfaces as contracts; Abstract classes and default methods; Enums and records; Sealed hierarchies and pattern matching.

## Chapter 1: Interfaces as contracts

An interface states what a collaborator can do without choosing its storage or implementation. A payment caller depends on charge, not on a particular provider class. Implementations can then be substituted in production or testing. Keep interfaces focused on the client’s actual needs.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
interface Notifier { String send(String text); }
Notifier email = text -> "sent: " + text;
System.out.println(email.send("receipt"));
```


<details>
<summary>Check the result and reasoning</summary>


```text
sent: receipt
```


The client depends on a capability. A lambda can implement this one-abstract-method interface. A production adapter may send email; a test adapter can record a call without performing network I/O.

</details>

**Your turn:** Would adding a second unrelated abstract method still allow this lambda?

<details>
<summary>Check your reasoning</summary>

No. It would no longer be a functional interface. Split unrelated responsibilities instead of forcing every implementation to provide them.

</details>

## Chapter 2: Abstract classes and default methods

An abstract class can combine shared state, constructors, and abstract behavior. Interfaces can provide default behavior but do not carry per-instance fields. A class can implement multiple interfaces, while it extends only one class. Resolve conflicting default implementations explicitly.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
interface Named { default String name() { return "guest"; } }
class Visitor implements Named {}
System.out.println(new Visitor().name());
```


<details>
<summary>Check the result and reasoning</summary>


```text
guest
```


A default method supplies inherited behavior without per-instance fields. Interfaces can also declare static helpers and private implementation helpers. Conflicting inherited default methods require an explicit resolution.

</details>

**Your turn:** How does an abstract class differ from this interface?

<details>
<summary>Check your reasoning</summary>

It can hold instance state and constructors and can mix abstract and implemented methods, but a class extends only one superclass.

</details>

## Chapter 3: Enums and records

Use an enum for a finite named set such as payment status. A record is a concise carrier of values with component accessors, a canonical constructor, and generated equality. Record components are final, but referenced lists can still be mutable: defensively copy them when required.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
enum State { NEW, PAID }
record Purchase(State state, java.util.List<String> items) { public Purchase { items = java.util.List.copyOf(items); } }
var source = new java.util.ArrayList<String>(); source.add("tea");
var purchase = new Purchase(State.NEW, source); source.clear();
System.out.println(purchase.items().size());
```


<details>
<summary>Check the result and reasoning</summary>


```text
1
```


The compact constructor creates a defensive list copy. The component remains final, and the external list no longer owns the record’s collection structure. Mutable elements would still require additional ownership decisions.

</details>

**Your turn:** Does this defensive copy deeply copy each item object?

<details>
<summary>Check your reasoning</summary>

No. It copies the list structure. Here strings are immutable, which makes sharing their references safe.

</details>

## Chapter 4: Sealed hierarchies and pattern matching

A sealed hierarchy restricts permitted direct subtypes. Pair it with pattern matching when all alternatives should be handled explicitly. Choose records for data and ordinary classes for stateful behavior; modern syntax improves expression but does not remove the need to design valid domain states.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
sealed interface Status permits Ready, Failed {}
record Ready(int count) implements Status {}
record Failed(String reason) implements Status {}
String describe(Status s) { return switch (s) { case Ready r -> "ready:" + r.count(); case Failed f -> "failed:" + f.reason(); }; }
System.out.println(describe(new Ready(2)));
```


<details>
<summary>Check the result and reasoning</summary>


```text
ready:2
```


A sealed domain limits alternatives, so the switch can be checked for exhaustiveness. Null is not automatically a valid domain alternative; this method rejects it unless a null case is added.

</details>

**Your turn:** What must change if a Pending subtype is permitted later?

<details>
<summary>Check your reasoning</summary>

Update the permits list, define Pending, and update exhaustive switches when recompiling. Decide its domain behavior explicitly.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Interfaces, abstraction, and modern models",
  "code": "interface Payment { int charge(int amount); }\nclass Card implements Payment {\n  public int charge(int amount) { return amount + 5; }\n}\nrecord Receipt(int charged) {}\nPayment payment = new Card();\nReceipt receipt = new Receipt(payment.charge(100));\nSystem.out.println(receipt.charged());",
  "output": "105",
  "steps": [
    {
      "label": "Contract",
      "detail": "payment exposes charge independently of the provider."
    },
    {
      "label": "Implementation",
      "detail": "Card adds the sample provider fee, yielding 105."
    },
    {
      "label": "Value model",
      "detail": "Receipt stores charged = 105 and exposes charged()."
    }
  ],
  "prediction": {
    "question": "What charged amount is printed by the receipt accessor?",
    "options": [
      "105",
      "100",
      "5",
      "0"
    ],
    "answer": 0,
    "explanation": "payment exposes charge independently of the provider. Card adds the sample provider fee, yielding 105. Receipt stores charged = 105 and exposes charged()."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-fundamentals/module-09-interfaces-and-records/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
