# Generics and type safety

**Real-life problem:** A parcel locker stores different kinds of packages safely.

**You will learn:** Type parameters and reusable APIs; Bounds, generic methods, and invariance; Wildcards and PECS; Erasure and safe boundaries.

## Chapter 1: Type parameters and reusable APIs

A generic class expresses a relationship between values without giving up compile-time checking. Box<String> accepts and returns strings. Raw types discard that relationship and can move mistakes from compilation to runtime casts. Start with one type parameter and add more only when they represent independent roles.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
record Pair<T>(T first, T second) {}
Pair<String> names = new Pair<>("Ada", "Lin");
System.out.println(names.first().length());
```


<details>
<summary>Check the result and reasoning</summary>


```text
3
```


The type parameter connects construction and retrieval. The compiler knows first returns String, so length is available without a cast. Pair<Integer> represents a different instantiation of the same reusable model.

</details>

**Your turn:** Could Pair<String> accept an Integer as its second constructor argument?

<details>
<summary>Check your reasoning</summary>

No. Both components have the same type parameter. Use a model with two independent type parameters if the roles genuinely have different types.

</details>

## Chapter 2: Bounds, generic methods, and invariance

A bound such as T extends Number permits operations defined by Number. A generic method declares its type parameter before the return type. List<Integer> is not a subtype of List<Number>; otherwise a caller could insert a Double into a list that promised integers.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
<T extends Number> double twice(T value) { return value.doubleValue() * 2; }
System.out.println(twice(3));
```


<details>
<summary>Check the result and reasoning</summary>


```text
6.0
```


The bound exposes Number operations without assuming a particular numeric subtype. Generic methods declare type parameters before the return type. Bounds can include a class and additional interfaces when those capabilities are required.

</details>

**Your turn:** Why is List<Integer> not assignable to List<Number>?

<details>
<summary>Check your reasoning</summary>

If it were, a caller could insert a Double through the Number reference and violate the integer list contract. Generic types are invariant by default.

</details>

## Chapter 3: Wildcards and PECS

A producer of values can use ? extends T; a consumer can use ? super T. Reading from an extends wildcard gives you the bound, while adding arbitrary values is unsafe. A super wildcard accepts T values but reads as Object. Prefer a concrete type parameter when input and output must stay related.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var target = new java.util.ArrayList<Number>();
java.util.List<? super Integer> consumer = target;
consumer.add(7);
System.out.println(target);
```


<details>
<summary>Check the result and reasoning</summary>


```text
[7]
```


A super wildcard safely consumes Integer values. A producer declared ? extends Number allows reading as Number but cannot accept an arbitrary Integer because its actual element type might be Double.

</details>

**Your turn:** What type is safe when reading consumer.get(0)?

<details>
<summary>Check your reasoning</summary>

Object. The actual list may be a list of Integer, Number, or Object, so a more specific read type is not guaranteed by the wildcard.

</details>

## Chapter 4: Erasure and safe boundaries

Most generic type information is erased from runtime object instances. You cannot construct new T() or test instanceof List<String>. Preserve safety at API boundaries and avoid unchecked casts. Generic collections use wrapper types such as Integer rather than primitive int.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
System.out.println(new java.util.ArrayList<String>().getClass() == new java.util.ArrayList<Integer>().getClass());
```


<details>
<summary>Check the result and reasoning</summary>


```text
true
```


Both instances share the same raw runtime class. Generic checking primarily happens during compilation; erasure explains why runtime instanceof cannot inspect a List<String> parameterization directly.

</details>

**Your turn:** How can an API preserve information needed to construct a T?

<details>
<summary>Check your reasoning</summary>

Supply a factory, Supplier<T>, or an appropriate type token. Do not assume new T() can find an unknown constructor after erasure.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Generics and type safety",
  "code": "class Box<T> {\n  private final T value;\n  Box(T value) { this.value = value; }\n  T get() { return value; }\n}\nBox<String> label = new Box<>(\"Parcel A\");\nSystem.out.println(label.get().toUpperCase(java.util.Locale.ROOT));",
  "output": "PARCEL A",
  "steps": [
    {
      "label": "Choose type",
      "detail": "T is String for this Box."
    },
    {
      "label": "Store",
      "detail": "The constructor receives Parcel A without a raw Object API."
    },
    {
      "label": "Read",
      "detail": "get() has compile-time return type String; no cast is needed."
    }
  ],
  "prediction": {
    "question": "What does the generic box example print?",
    "options": [
      "PARCEL A",
      "Parcel A",
      "Object",
      "A ClassCastException"
    ],
    "answer": 0,
    "explanation": "T is String for this Box. The constructor receives Parcel A without a raw Object API. get() has compile-time return type String; no cast is needed."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-developer-core/module-01-generics-and-type-safety/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
