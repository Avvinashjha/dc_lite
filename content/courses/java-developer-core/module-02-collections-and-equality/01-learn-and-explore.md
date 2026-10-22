# Collections and equality

**Real-life problem:** An inventory system tracks stock and unique product codes.

**You will learn:** List, Set, Map, and Deque; Hashing, ordering, and mutable keys; Iteration, comparison, and safe updates; Immutable views and collection choices.

## Chapter 1: List, Set, Map, and Deque

Choose a collection from its contract: a List is an indexed sequence with duplicates, a Set models uniqueness, and a Map associates keys with values. Deque supports efficient additions and removals at both ends. ArrayList is a useful default for iteration and indexed reads; do not assume every List has the same cost model.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var queue = new java.util.ArrayDeque<String>();
queue.addLast("first"); queue.addLast("second");
System.out.println(queue.removeFirst());
```


<details>
<summary>Check the result and reasoning</summary>


```text
first
```


A queue serves items in arrival order. A stack can use the same Deque abstraction with push and pop at one end. ArrayDeque disallows null and avoids using legacy Stack as a default.

</details>

**Your turn:** Which structure would express unique visitor ids rather than a queue?

<details>
<summary>Check your reasoning</summary>

Set. Choose contracts first: List for sequence, Set for uniqueness, Map for associations, and Deque for end-based operations.

</details>

## Chapter 2: Hashing, ordering, and mutable keys

HashMap and HashSet use equality and hash codes to locate entries. Mutating a field used in a key’s hash code can make the entry unreachable by normal lookup. HashMap promises no iteration order. LinkedHashMap preserves insertion order; TreeMap orders keys by comparison.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var stock = new java.util.TreeMap<String,Integer>();
stock.put("tea",2); stock.put("coffee",1);
System.out.println(stock.keySet());
```


<details>
<summary>Check the result and reasoning</summary>


```text
[coffee, tea]
```


TreeMap orders keys by natural order or its comparator. HashMap supplies no iteration-order promise; LinkedHashMap preserves insertion order by default. Ordering is a contract rather than a coincidence observed in one run.

</details>

**Your turn:** What happens if a comparator treats two unequal keys as equal?

<details>
<summary>Check your reasoning</summary>

A sorted map treats the comparison result as its key-equivalence rule, which can replace an entry. Keep ordering consistent with intended key equality.

</details>

## Chapter 3: Iteration, comparison, and safe updates

Use a comparator to make ordering rules explicit, including tie-breakers. Structural changes during an ordinary for-each may produce ConcurrentModificationException. Use an iterator’s remove or collection operations designed for the change. That exception is a bug detector, not a concurrency guarantee.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var names = new java.util.ArrayList<>(java.util.List.of("Ada","Li","Maya"));
names.removeIf(name -> name.length() < 3);
names.sort(java.util.Comparator.comparingInt(String::length).thenComparing(java.util.Comparator.naturalOrder()));
System.out.println(names);
```


<details>
<summary>Check the result and reasoning</summary>


```text
[Ada, Maya]
```


removeIf performs a supported structural operation. The composed comparator expresses a primary key and deterministic tie-breaker. Avoid mutating a collection structurally through an unrelated path while iterating it.

</details>

**Your turn:** Is ConcurrentModificationException a guarantee that every concurrent bug is detected?

<details>
<summary>Check your reasoning</summary>

No. It is a best-effort fail-fast diagnostic, not a synchronization protocol.

</details>

## Chapter 4: Immutable views and collection choices

List.of produces an unmodifiable list and rejects nulls. An unmodifiable view can still reflect mutations made through its backing collection. A defensive copy separates ownership, but mutable elements still require care. Select structures by required behavior before micro-optimizing operations.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var backing = new java.util.ArrayList<>(java.util.List.of("tea"));
var view = java.util.Collections.unmodifiableList(backing);
var snapshot = java.util.List.copyOf(backing);
backing.add("coffee");
System.out.println(view.size() + ":" + snapshot.size());
```


<details>
<summary>Check the result and reasoning</summary>


```text
2:1
```


The unmodifiable view shares the backing structure; the copy is a snapshot of the structure at that moment. Neither operation recursively freezes mutable objects stored inside it.

</details>

**Your turn:** Which is preferable for an immutable model receiving a caller-owned list?

<details>
<summary>Check your reasoning</summary>

Usually a defensive copy such as List.copyOf, plus a deliberate policy for mutable elements and null values.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Collections and equality",
  "code": "var stock = new java.util.LinkedHashMap<String, Integer>();\nstock.put(\"tea\", 2);\nstock.merge(\"tea\", 3, Integer::sum);\nstock.put(\"coffee\", 1);\nSystem.out.println(stock.get(\"tea\"));\nSystem.out.println(stock.keySet());",
  "output": "5\n[tea, coffee]",
  "steps": [
    {
      "label": "Insert",
      "detail": "tea maps to 2."
    },
    {
      "label": "Merge",
      "detail": "The existing 2 and incoming 3 combine to 5."
    },
    {
      "label": "Preserve order",
      "detail": "coffee is inserted second; keys iterate as tea, coffee."
    }
  ],
  "prediction": {
    "question": "What count and key order does this LinkedHashMap example print?",
    "options": [
      "3\n[tea, coffee]",
      "5\n[coffee, tea]",
      "2\n[tea, coffee]",
      "5\n[tea, coffee]"
    ],
    "answer": 3,
    "explanation": "tea maps to 2. The existing 2 and incoming 3 combine to 5. coffee is inserted second; keys iterate as tea, coffee."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-developer-core/module-02-collections-and-equality/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
