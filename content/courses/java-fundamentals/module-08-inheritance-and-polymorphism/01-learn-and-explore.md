# Inheritance and polymorphism

**Real-life problem:** A checkout supports several shipping policies.

**You will learn:** An is-a relationship and inherited behavior; Dynamic dispatch and overriding; super, access, and final; Composition and the substitution principle.

## Chapter 1: An is-a relationship and inherited behavior

Inheritance models a substitutable specialization. A subclass can reuse accessible behavior and override an instance method. Do not use inheritance merely to borrow a few lines of code; a subtype must honor the promises made by its parent.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
class Vehicle { String move() { return "move"; } }
class Bicycle extends Vehicle { @Override String move() { return "pedal"; } }
Vehicle ride = new Bicycle();
System.out.println(ride.move());
```


<details>
<summary>Check the result and reasoning</summary>


```text
pedal
```


A Bicycle is usable as a Vehicle here because it fulfills the movement contract. The runtime receiver selects its overriding instance method, even though the variable’s declared type is Vehicle.

</details>

**Your turn:** Can a Vehicle reference call a Bicycle-only method without narrowing its type?

<details>
<summary>Check your reasoning</summary>

No. Accessible members are checked against the declared type. Prefer a useful shared contract over unnecessary downcasts.

</details>

## Chapter 2: Dynamic dispatch and overriding

The declared reference type determines which members are accessible at compile time. The runtime object determines the overriding instance method that executes. @Override asks the compiler to verify your intent. Static methods are hidden, rather than dynamically dispatched in the same way.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
class Parent { static String kind() { return "parent"; } String name() { return "parent"; } }
class Child extends Parent { static String kind() { return "child"; } @Override String name() { return "child"; } }
Parent p = new Child();
System.out.println(p.kind() + ":" + p.name());
```


<details>
<summary>Check the result and reasoning</summary>


```text
parent:child
```


The static method is selected from the compile-time type; the instance override follows the runtime receiver. Calling a static method through an instance is legal but obscures that distinction.

</details>

**Your turn:** Which form makes the static selection clearer?

<details>
<summary>Check your reasoning</summary>

Use Parent.kind() for a class member. Do not describe static hiding as ordinary instance-method overriding.

</details>

## Chapter 3: super, access, and final

super can invoke a superclass constructor or implementation. Private state is not directly accessible in a subclass. final methods cannot be overridden; final classes cannot be subclassed. A protected member still needs a deliberate API boundary.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
class Priced { final int base; Priced(int base) { this.base = base; } }
class ExpressPrice extends Priced { ExpressPrice() { super(100); } int total() { return base + 20; } }
System.out.println(new ExpressPrice().total());
```


<details>
<summary>Check the result and reasoning</summary>


```text
120
```


super passes construction work to the parent before the subclass is fully initialized. A final field must be initialized once; a final class prevents subclasses, and a final method prevents overriding.

</details>

**Your turn:** Why avoid calling overridable methods from a superclass constructor?

<details>
<summary>Check your reasoning</summary>

Dynamic dispatch may reach subclass code before the subclass has initialized its own fields.

</details>

## Chapter 4: Composition and the substitution principle

A checkout can contain a shipping policy instead of becoming a shipping policy. Composition makes changing one behavior explicit and avoids fragile hierarchies. If a subtype rejects normal operations accepted by its parent, revisit whether the relationship represents substitution.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
interface Fee { int amount(); }
record Checkout(Fee fee) { int shipping() { return fee.amount(); } }
System.out.println(new Checkout(() -> 50).shipping());
```


<details>
<summary>Check the result and reasoning</summary>


```text
50
```


Checkout contains a policy rather than inheriting from it. This is composition: the part is supplied explicitly, and the caller can choose a different policy without creating a checkout subtype.

</details>

**Your turn:** When is inheritance still a reasonable choice?

<details>
<summary>Check your reasoning</summary>

When the subtype really fulfills the supertype’s behavioral promises. Prefer a has-a relationship when the goal is only to replace one collaborator.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Inheritance and polymorphism",
  "code": "class Shipping { int fee() { return 50; } }\nclass Express extends Shipping {\n  @Override int fee() { return 100; }\n}\nShipping chosen = new Express();\nSystem.out.println(chosen.fee());",
  "output": "100",
  "steps": [
    {
      "label": "Declare",
      "detail": "chosen has compile-time type Shipping."
    },
    {
      "label": "Instantiate",
      "detail": "Its runtime object is an Express."
    },
    {
      "label": "Dispatch",
      "detail": "The override Express.fee runs and returns 100."
    }
  ],
  "prediction": {
    "question": "Which fee is printed for the Shipping reference holding Express?",
    "options": [
      "150",
      "100",
      "50",
      "0"
    ],
    "answer": 1,
    "explanation": "chosen has compile-time type Shipping. Its runtime object is an Express. The override Express.fee runs and returns 100."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-fundamentals/module-08-inheritance-and-polymorphism/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
