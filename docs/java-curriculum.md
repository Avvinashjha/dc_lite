# Java developer learning path

Research reviewed: 2026-10-22.

Three sequential courses, 30 modules, 120 short chapters, 30 guided walkthroughs, 30 local labs, 30 module quizzes, and 33 independent public quizzes. The guide and lab are separate lesson pages; each guide contains four chapter sections.

## Teaching approach

Every module starts with a familiar problem, introduces four short chapters, and connects them to an authored code example. Learners predict a result, step through the reasoning, modify the example locally, and check acceptance criteria before taking a module quiz. Hints and reference approaches stay collapsed until requested. The browser walkthrough shows authored states; it does not execute Java.

Use Java 25 LTS without preview features. Read older idioms when relevant. Use Maven consistently for project labs; Gradle is introduced as an alternative. Spring project setup uses a compatible stable release from Initializr, whose generated dependency versions and wrapper must be committed. Project fragments identify their required environment.

## Assessment design

Each module quiz has seven explained questions, including a prediction about the shown code, and a 70% pass threshold under the existing progression rules. Public practice has its own seven-question entry per topic plus one 20-question readiness quiz per course. Five questions overlap between a module assessment and its public practice set for retrieval practice; each set also has two exclusive questions. Readiness quizzes remix questions across ten modules. There are 270 distinct authored questions and 480 question placements across 63 quizzes. Quizzes are untimed and unranked; capstone checks provide evidence beyond multiple-choice scores. Public quizzes are independent of course enrollment.

## Runnable projects and chapter practice

Every chapter includes a worked example, a focused question, and a concealed answer. Standalone snippets can be run in Java 25 JShell; project examples identify their source file in the downloadable reference. The complete source archive includes a Maven wrapper, three capstones with regression tests, migrations, HTTP examples, and a named-module/jlink exercise. See [project setup and walkthroughs](../examples/java/README.md). The site serves the archive at /downloads/java-course-labs.zip.

## Course progression and chapter layout

### Java Fundamentals

**Prerequisite:** No programming experience required. Install a Java 25 JDK; use a terminal and an editor.

**Outcome:** Build and debug a command-line application with encapsulated domain models and validated input.

**Estimated effort:** 18–25 hours, including exercises. **Capstone:** Command-line expense tracker.

#### Module 1: Your first Java program

**Scenario:** A café needs a receipt printer.

1. **Java, the JDK, and the JVM.** Java source is a recipe; the compiler turns it into bytecode, and the JVM executes it. The JDK supplies development tools including javac, java, and JShell. This separation lets the same class file run on compatible JVMs on different operating systems. **Chapter practice:** How would you check the compiler as well?
2. **Install and verify your tools.** Install an OpenJDK 25 distribution and verify java --version, javac --version, and jshell --version in a new terminal. If they disagree, inspect JAVA_HOME and PATH before continuing. An IDE helps navigate projects, but the command line makes the execution model visible. **Chapter practice:** Change the price to 75. What should be printed?
3. **Source files, main, and console output.** Save a public class named Receipt in Receipt.java. The traditional public static void main(String[] args) entry point remains useful when reading existing projects. Compile with javac Receipt.java and run with java Receipt; do not include .class in the launch command. **Chapter practice:** Which file and folder would hold public class Cafe in package shop?
4. **JShell, compiler errors, and runtime errors.** Use JShell for small experiments. A missing semicolon prevents compilation; a program that compiles can still fail at runtime. Read the first useful error and the source line before changing unrelated code. Keep experiments small enough that you can predict their output. **Chapter practice:** What changes if "two" becomes "2"?

**Interactive activity:** Enter main → coffees = 2 → Print receipt.

**Lab:** Print a second line containing Total: 120 after the coffee count.

**Acceptance checks:**

- The original coffee line remains first.
- The second line is exactly Total: 120.
- Compile and run Receipt.java from a terminal.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 2: Values, types, and expressions

**Scenario:** A grocery store calculates basket totals.

1. **Primitive values and reference values.** Use int for ordinary whole-number counts, long for larger ranges, boolean for decisions, and double for approximate real numbers. String is a reference type. Local variables need a value before use. Field defaults do not mean uninitialized local variables are safe to read. **Chapter practice:** Can var count = 3 later accept the String "three"?
2. **Operators, promotion, and integer division.** Java evaluates expressions according to precedence and operand types. Dividing two ints discards the fractional part before any later assignment to double. Parentheses communicate intention. Convert an operand before division when a fractional result is required. **Chapter practice:** What are 5 % 2 and 1 << 3?
3. **Conversions, overflow, and final.** Widening an int to long preserves its value; narrowing may lose information. Ordinary integer arithmetic can overflow silently. Use Math.addExact when overflow must fail explicitly. final prevents reassignment of a variable; it does not make a referenced object immutable. **Chapter practice:** Why is Math.addExact(Integer.MAX_VALUE, 1) useful?
4. **Money and trustworthy input.** Use integer minor units for a simple basket, or BigDecimal with an explicit rounding rule for decimal financial calculations. Construct decimal amounts from strings. Validate quantities before calculation; changing the numeric type does not repair an invalid business rule. **Chapter practice:** Would price.multiply(...) change price if the result were ignored?

**Interactive activity:** Read quantities → Multiply → Compare divisions.

**Lab:** Calculate the cost of four apples and reject a negative quantity before multiplication.

**Acceptance checks:**

- Four apples cost 5000 paise.
- A negative quantity raises IllegalArgumentException.
- Zero apples cost zero.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 3: Decisions and loops

**Scenario:** A delivery service applies shipping rules.

1. **Conditions and short-circuit logic.** A branch encodes a rule: free shipping starts at a particular subtotal. Write boundary examples before the condition. && evaluates its right side only when the left side is true, which makes a null check followed by a method call safe when ordered correctly. **Chapter practice:** Can & replace && safely here?
2. **if, else, and switch expressions.** Use if for ranges and combinations of predicates. Use switch to map a finite set of values to outcomes. Arrow cases avoid accidental fall-through. A switch expression must produce a value for every possible input accepted by its type. **Chapter practice:** What would an unknown shipping name return? Is that a good business default?
3. **for, while, and enhanced for.** Use a counted loop when the index matters, an enhanced for for values, and while when repetition depends on evolving state. State the invariant: what remains true before and after an iteration? This makes termination and correctness easier to inspect. **Chapter practice:** Change the loop to start at zero and use i < 3. What result follows?
4. **Off-by-one errors and tracing.** For an array of length n, valid indexes are 0 through n - 1. Write a trace table with the index, current value, and accumulator. Test empty input, one item, and a value exactly at the shipping threshold. break exits a loop; continue skips the rest of its current iteration. **Chapter practice:** How many times does a while(false) body run? What about do { ... } while(false)?

**Interactive activity:** First order → Second order → Third order.

**Lab:** Count orders eligible for free shipping at a threshold of 1000, then test an empty order array.

**Acceptance checks:**

- The sample produces 1.
- An empty array produces 0.
- An order of exactly 1000 qualifies.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 4: Methods and debugging

**Scenario:** A restaurant reuses a tip calculator.

1. **Method signatures, parameters, and return values.** A method names a focused operation. Parameters make its inputs explicit; the return type describes its result. Prefer a calculation that returns a value over one that prints internally, so the same logic can be reused in a terminal, an API, and a test. **Chapter practice:** What input would expose overflow in this int-based square method?
2. **Scope, the call stack, and pass-by-value.** Each invocation has its own local variables. Java always passes values: primitive values are copied, and object reference values are copied too. A method can mutate a shared object through that copied reference, but assigning its parameter to another object does not replace the caller’s variable. **Chapter practice:** Would making the parameter final prevent mutate from assigning numbers[0]?
3. **Overloading and decomposition.** Overloads share a name but differ in parameter types or counts. Return type alone cannot distinguish them. Break a large feature into validation, calculation, and presentation so each method has a clear contract and a manageable set of cases. **Chapter practice:** What does sum() return with no arguments?
4. **Breakpoints and reading failures.** Set a breakpoint before the surprising calculation. Step into a method to inspect its inputs; step over when its implementation is already trusted. Read stack traces from the exception toward the first relevant application frame. Reproduce a bug with a small input before attempting a fix. **Chapter practice:** Should you change every division in the application after this one report?

**Interactive activity:** Call tip → Calculate → Return.

**Lab:** Add validation to tip so negative bills and percentages throw; preserve integer rounding toward zero.

**Acceptance checks:**

- tip(800, 10) returns 80.
- tip(99, 10) returns 9.
- Negative bill or percent throws IllegalArgumentException.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 5: Arrays and problem solving

**Scenario:** A weather station summarizes daily temperatures.

1. **Fixed-size arrays and indexes.** An array groups values of one element type into an indexed sequence. Its length is fixed at creation. Accessing an invalid index raises ArrayIndexOutOfBoundsException. An int array receives zero-initialized elements, but you still need to decide what those zeros mean in the domain. **Chapter practice:** Which access is invalid: seats[0], seats[2], or seats[3]?
2. **Accumulation, search, and empty inputs.** A sum starts at zero; a maximum cannot safely start at zero when all values may be negative. Choose an explicit empty-input policy before accessing element zero. Linear search examines values until it finds a match or exhausts the array. **Chapter practice:** How would the contract change if all matching indexes were needed?
3. **Two-dimensional arrays and copying.** A Java two-dimensional array is an array of array references and may be ragged. Copying the outer array does not deep-copy its rows. Arrays.copyOf creates a new one-dimensional array; copying reference elements still preserves references to the same objects. **Chapter practice:** How can you copy all the rows independently?
4. **Complexity and small test cases.** A single pass over n readings takes O(n) time. Nested full passes often take O(n²). Complexity describes growth, not exact elapsed time. Draw the array and trace a tiny example before optimizing. Include duplicates, negative values, empty input, and an item at the final index. **Chapter practice:** What is the auxiliary-space cost of creating a full copy of n readings?

**Interactive activity:** Initialize → Compare 4 → Compare 1.

**Lab:** Write maximum(int[] readings) that rejects an empty array and works for all-negative readings.

**Acceptance checks:**

- {-8, -3, -9} returns -3.
- {7} returns 7.
- {} throws IllegalArgumentException.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 6: Strings, text, and input

**Scenario:** A help desk normalizes customer reference codes.

1. **Immutable strings and equality.** A String does not change after construction. Operations such as strip and toUpperCase return a result that you must use. equals compares content; == compares reference identity. String interning can make identity tests seem to work until input comes from another source. **Chapter practice:** What happens when you invoke first.toUpperCase() without storing its result?
2. **StringBuilder and formatting.** Build text incrementally with StringBuilder when many additions happen in a loop. A builder is mutable and is not a replacement for synchronization. Use formatted output to separate the template from its values, and choose an explicit locale when formatting machine-readable text. **Chapter practice:** Why can repeated immutable concatenation be wasteful in a large loop?
3. **Unicode and text boundaries.** A Java char is a UTF-16 code unit, not necessarily a complete user-perceived character. Some code points occupy two chars; emoji sequences can contain multiple code points. Do not assume length equals the number of visible symbols or split arbitrary text at an unchecked char index. **Chapter practice:** Would substring(0, 1) safely extract this entire emoji?
4. **Parsing and input validation.** Read input as text, strip permitted whitespace, and parse it with an explicit error policy. Scanner nextInt leaves a line separator for a later nextLine, a common source of empty reads. Treat null, blank text, invalid numbers, and out-of-range values as different cases. **Chapter practice:** How can a command parser avoid this interaction?

**Interactive activity:** Original text → Normalize → Compare.

**Lab:** Create normalize(String value) that rejects null or blank input and returns a stripped uppercase code.

**Acceptance checks:**

- " ab-42 " becomes "AB-42".
- Blank input throws IllegalArgumentException.
- Null input throws IllegalArgumentException.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 7: Classes, objects, and encapsulation

**Scenario:** A digital wallet protects its balance.

1. **Classes, instances, and constructors.** A class defines state and behavior; each instance owns its instance fields. A constructor establishes a valid initial state. Think of two wallets: they share rules, but adding money to one must not change the other. this identifies the current receiver. **Chapter practice:** Would a public setter accepting negative balances preserve this invariant?
2. **Encapsulation and invariants.** Keep the balance private and expose operations that preserve its rules. A public setter that accepts any number allows impossible states. Encapsulation is the ability to maintain an invariant through a controlled API, not merely adding getters and setters to every field. **Chapter practice:** What goes wrong if quantity is decremented before validation?
3. **Instance versus static and object references.** Instance methods operate on a receiver; static members belong to the class. Assigning one wallet reference to another variable does not clone the wallet. Both variables can reach the same instance. Use an identity diagram to distinguish variables from the objects they reference. **Chapter practice:** Would using a static wallet balance be appropriate for independent customer wallets?
4. **Immutable values, equals, and hashCode.** Value objects compare meaningful state rather than identity. Equal objects must have equal hash codes. Keep the fields used in equality stable when the object is a map key. Prefer immutable value types for amounts and identifiers; mutable entities need deliberate lifecycle rules. **Chapter practice:** Would using only the same hash code prove two product codes are equal?

**Interactive activity:** Allocate → Alias → Deposit.

**Lab:** Add withdraw(int amount), rejecting nonpositive amounts and withdrawals larger than the balance.

**Acceptance checks:**

- Deposit 50 then withdraw 20 leaves 30.
- Withdraw 51 from balance 50 fails without changing the balance.
- Zero and negative withdrawals fail.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 8: Inheritance and polymorphism

**Scenario:** A checkout supports several shipping policies.

1. **An is-a relationship and inherited behavior.** Inheritance models a substitutable specialization. A subclass can reuse accessible behavior and override an instance method. Do not use inheritance merely to borrow a few lines of code; a subtype must honor the promises made by its parent. **Chapter practice:** Can a Vehicle reference call a Bicycle-only method without narrowing its type?
2. **Dynamic dispatch and overriding.** The declared reference type determines which members are accessible at compile time. The runtime object determines the overriding instance method that executes. @Override asks the compiler to verify your intent. Static methods are hidden, rather than dynamically dispatched in the same way. **Chapter practice:** Which form makes the static selection clearer?
3. **super, access, and final.** super can invoke a superclass constructor or implementation. Private state is not directly accessible in a subclass. final methods cannot be overridden; final classes cannot be subclassed. A protected member still needs a deliberate API boundary. **Chapter practice:** Why avoid calling overridable methods from a superclass constructor?
4. **Composition and the substitution principle.** A checkout can contain a shipping policy instead of becoming a shipping policy. Composition makes changing one behavior explicit and avoids fragile hierarchies. If a subtype rejects normal operations accepted by its parent, revisit whether the relationship represents substitution. **Chapter practice:** When is inheritance still a reasonable choice?

**Interactive activity:** Declare → Instantiate → Dispatch.

**Lab:** Add FreeShipping as a subtype whose fee is zero, then sum standard and free shipping through Shipping references.

**Acceptance checks:**

- new FreeShipping().fee() returns 0.
- A Shipping reference to FreeShipping still returns 0.
- The standard plus free total is 50.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 9: Interfaces, abstraction, and modern models

**Scenario:** A payment checkout accepts different payment providers.

1. **Interfaces as contracts.** An interface states what a collaborator can do without choosing its storage or implementation. A payment caller depends on charge, not on a particular provider class. Implementations can then be substituted in production or testing. Keep interfaces focused on the client’s actual needs. **Chapter practice:** Would adding a second unrelated abstract method still allow this lambda?
2. **Abstract classes and default methods.** An abstract class can combine shared state, constructors, and abstract behavior. Interfaces can provide default behavior but do not carry per-instance fields. A class can implement multiple interfaces, while it extends only one class. Resolve conflicting default implementations explicitly. **Chapter practice:** How does an abstract class differ from this interface?
3. **Enums and records.** Use an enum for a finite named set such as payment status. A record is a concise carrier of values with component accessors, a canonical constructor, and generated equality. Record components are final, but referenced lists can still be mutable: defensively copy them when required. **Chapter practice:** Does this defensive copy deeply copy each item object?
4. **Sealed hierarchies and pattern matching.** A sealed hierarchy restricts permitted direct subtypes. Pair it with pattern matching when all alternatives should be handled explicitly. Choose records for data and ordinary classes for stateful behavior; modern syntax improves expression but does not remove the need to design valid domain states. **Chapter practice:** What must change if a Pending subtype is permitted later?

**Interactive activity:** Contract → Implementation → Value model.

**Lab:** Implement a Cash payment with no fee and create a Receipt for an amount of 100.

**Acceptance checks:**

- Cash implements Payment.
- charge(100) returns 100.
- The receipt component accessor returns 100.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 10: Exceptions and the fundamentals capstone

**Scenario:** Build a resilient command-line expense tracker.

1. **Failures, exceptions, and recovery.** An exception signals an operation that could not complete normally. Catch only where you can recover or translate meaningfully. Reject bad input at the boundary, and preserve the original cause when wrapping an exception. Swallowing failures produces misleading success. **Chapter practice:** Why is throwing new RuntimeException("failed") without the cause less useful?
2. **Checked and unchecked exceptions.** The compiler requires checked exceptions to be caught or declared. RuntimeException subclasses are unchecked. This distinction is about the API contract, not whether an error matters. Use IllegalArgumentException for invalid caller input and domain-specific exceptions when callers need a meaningful recovery choice. **Chapter practice:** Is every important failure a checked exception?
3. **try-with-resources and cleanup.** Resources such as readers and JDBC connections must be closed. try-with-resources closes AutoCloseable resources in reverse declaration order, including exceptional paths. finally is useful for cleanup but should not return a value that hides the original failure. **Chapter practice:** With two resources declared left to right, which closes first?
4. **Capstone: model, validate, and report expenses.** Create an Expense record with a label and positive amount in minor units. Keep an in-memory collection, accept add/list/total/exit commands, and separate parsing from business methods. This first capstone needs no database; persistence arrives in the developer core course. **Chapter practice:** What evidence should demonstrate the finished capstone?

**Interactive activity:** Parse → Validate → Recover.

**Lab:** Build the expense tracker using a record, a service class, and a command loop. Add a total command and recover from malformed input.

**Acceptance checks:**

- Adding Food 1250 and Bus 300 gives a total of 1550.
- A negative amount and nonnumeric input show a useful error without exiting.
- list preserves valid expenses; exit terminates the loop.
- Keep parsing, storage, and printing in separate methods.

**Assessment:** seven-question module quiz; seven-question independent public practice.

### Java Developer Core

**Prerequisite:** Complete Java Fundamentals or be comfortable with methods, classes, interfaces, and exceptions.

**Outcome:** Build a tested application with database persistence, file import/export, and a replaceable HTTP integration.

**Estimated effort:** 25–35 hours, including exercises. **Capstone:** Persistent expense application.

#### Module 1: Generics and type safety

**Scenario:** A parcel locker stores different kinds of packages safely.

1. **Type parameters and reusable APIs.** A generic class expresses a relationship between values without giving up compile-time checking. Box<String> accepts and returns strings. Raw types discard that relationship and can move mistakes from compilation to runtime casts. Start with one type parameter and add more only when they represent independent roles. **Chapter practice:** Could Pair<String> accept an Integer as its second constructor argument?
2. **Bounds, generic methods, and invariance.** A bound such as T extends Number permits operations defined by Number. A generic method declares its type parameter before the return type. List<Integer> is not a subtype of List<Number>; otherwise a caller could insert a Double into a list that promised integers. **Chapter practice:** Why is List<Integer> not assignable to List<Number>?
3. **Wildcards and PECS.** A producer of values can use ? extends T; a consumer can use ? super T. Reading from an extends wildcard gives you the bound, while adding arbitrary values is unsafe. A super wildcard accepts T values but reads as Object. Prefer a concrete type parameter when input and output must stay related. **Chapter practice:** What type is safe when reading consumer.get(0)?
4. **Erasure and safe boundaries.** Most generic type information is erased from runtime object instances. You cannot construct new T() or test instanceof List<String>. Preserve safety at API boundaries and avoid unchecked casts. Generic collections use wrapper types such as Integer rather than primitive int. **Chapter practice:** How can an API preserve information needed to construct a T?

**Interactive activity:** Choose type → Store → Read.

**Lab:** Write sum(List<? extends Number> values), returning a double, and call it with integer and double lists.

**Acceptance checks:**

- List.of(1, 2, 3) produces 6.0.
- List.of(1.5, 2.5) produces 4.0.
- An empty list produces 0.0.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 2: Collections and equality

**Scenario:** An inventory system tracks stock and unique product codes.

1. **List, Set, Map, and Deque.** Choose a collection from its contract: a List is an indexed sequence with duplicates, a Set models uniqueness, and a Map associates keys with values. Deque supports efficient additions and removals at both ends. ArrayList is a useful default for iteration and indexed reads; do not assume every List has the same cost model. **Chapter practice:** Which structure would express unique visitor ids rather than a queue?
2. **Hashing, ordering, and mutable keys.** HashMap and HashSet use equality and hash codes to locate entries. Mutating a field used in a key’s hash code can make the entry unreachable by normal lookup. HashMap promises no iteration order. LinkedHashMap preserves insertion order; TreeMap orders keys by comparison. **Chapter practice:** What happens if a comparator treats two unequal keys as equal?
3. **Iteration, comparison, and safe updates.** Use a comparator to make ordering rules explicit, including tie-breakers. Structural changes during an ordinary for-each may produce ConcurrentModificationException. Use an iterator’s remove or collection operations designed for the change. That exception is a bug detector, not a concurrency guarantee. **Chapter practice:** Is ConcurrentModificationException a guarantee that every concurrent bug is detected?
4. **Immutable views and collection choices.** List.of produces an unmodifiable list and rejects nulls. An unmodifiable view can still reflect mutations made through its backing collection. A defensive copy separates ownership, but mutable elements still require care. Select structures by required behavior before micro-optimizing operations. **Chapter practice:** Which is preferable for an immutable model receiving a caller-owned list?

**Interactive activity:** Insert → Merge → Preserve order.

**Lab:** Count occurrences in [tea, coffee, tea, milk] using a Map, then return the distinct codes in insertion order.

**Acceptance checks:**

- tea has count 2.
- coffee and milk have count 1.
- The key order is tea, coffee, milk.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 3: Lambdas, streams, and Optional

**Scenario:** A shop computes revenue from paid orders.

1. **Functional interfaces and lambdas.** A functional interface has one abstract method. Predicate tests a value, Function transforms it, Consumer performs an action, and Supplier supplies a value. A lambda captures local variables only when they are final or effectively final; captured references can still point to mutable objects. **Chapter practice:** Can a captured local int be reassigned after the lambda is defined?
2. **Lazy pipelines and terminal operations.** A stream describes a traversal, not a container. filter keeps matching values; map transforms them. Intermediate operations are lazy until a terminal operation requests a result. Streams are consumed once. Prefer readable pipelines to deeply nested lambdas. **Chapter practice:** What happens if you construct a filter pipeline and never request a terminal result?
3. **Reduction, collection, and parallel pitfalls.** Use reductions for associative combinations and collectors for grouped results. Avoid shared mutable accumulators in forEach, especially with parallel streams. Parallel execution adds coordination and is not automatically faster; encounter order, blocking, and workload size all matter. **Chapter practice:** Why must a reduction combining partial results be associative?
4. **Optional and explicit absence.** Optional models a potentially absent return value. Use map, flatMap, or orElseGet to compose a result without unchecked get calls. orElse evaluates its argument eagerly. Optional does not replace every null field, and the Optional reference itself should not be null. **Chapter practice:** Should a method returning Optional ever return null to mean empty?

**Interactive activity:** Filter → Map → Reduce.

**Lab:** Find the largest paid order as an OptionalInt and provide zero only at the display boundary.

**Acceptance checks:**

- The sample produces 100.
- A list with no paid orders displays 0.
- Do not call getAsInt without checking absence.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 4: Dates, numbers, and text patterns

**Scenario:** A booking service schedules visits across time zones.

1. **Local dates versus instants.** LocalDate represents a calendar date without a clock or zone. Instant identifies a point on the timeline. LocalDateTime has no zone and cannot identify an unambiguous global instant by itself. Select a type that matches the business meaning instead of storing every timestamp as a string. **Chapter practice:** Would a LocalDateTime alone be sufficient to store a global meeting time?
2. **Zones, daylight saving, and testable time.** ZonedDateTime combines local information with zone rules. Daylight-saving transitions can make a local time ambiguous or nonexistent. Inject a Clock so expiry tests do not depend on wall-clock timing. Store instants for events and preserve the customer’s zone when it is part of the booking contract. **Chapter practice:** How would you test an expiry exactly at its deadline?
3. **BigDecimal and rounding policies.** Use decimal strings to construct exact decimal amounts. equals compares value and scale, while compareTo compares numerical value. Specify scale and RoundingMode for divisions that may repeat. State whether rounding occurs per item or on the final total because those policies can produce different results. **Chapter practice:** Why can three shares rounded to two decimals fail to sum to the original bill?
4. **Regular expressions and validation.** Pattern compiles an expression and Matcher applies it. matches requires the entire input; find searches for a matching subsequence. Escape backslashes in Java string literals. Keep validation bounded and simple, and use domain-aware parsers for complex formats instead of inventing a universal regex. **Chapter practice:** What Java string literal represents regex \d+?

**Interactive activity:** Calendar arithmetic → Decimal division → Apply policy.

**Lab:** Validate a booking code with two uppercase letters, a hyphen, and four digits; divide 100.00 between three people to two decimals.

**Acceptance checks:**

- AB-1234 matches; AB-12345 does not.
- Lowercase ab-1234 does not match.
- The rounded share is 33.33; explicitly note the remaining cent.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 5: Files, NIO, and resource management

**Scenario:** The expense tracker exports and imports a local report.

1. **Path, Files, and character encodings.** Path represents a location; Files performs operations. Prefer Path.resolve to manual separator concatenation. Specify UTF-8 for text interoperability. Relative paths resolve against the current working directory, so print the absolute path when diagnosing a missing file. **Chapter practice:** Why does a file work in an IDE but fail from a terminal?
2. **Buffered I/O and streaming large files.** readString is convenient for bounded small inputs. Large files need a streaming approach that does not load everything into memory. Files.lines returns a stream that owns an open resource; close it with try-with-resources. Close behavior matters even when a terminal operation short-circuits. **Chapter practice:** Will count automatically guarantee that the Files.lines resource is closed?
3. **Validation, CSV, and safe paths.** Treat imported files as input: bound size, validate fields, and report useful line numbers. CSV quoting allows embedded commas and line breaks, so split(",") is not a general CSV parser. Do not let an unchecked user filename escape an intended storage directory through path traversal or symlinks. **Chapter practice:** Import a malformed date or negative amount. Should a prefix of valid rows be committed?
4. **Serialization and reliable writes.** Use an explicit interchange format rather than native Java deserialization for untrusted data. For replacement writes, write a temporary file and move it into place when the filesystem supports the required atomic behavior. A successful write call alone does not establish a complete recovery strategy. **Chapter practice:** Does normalize() alone stop a symlink from escaping an upload directory?

**Interactive activity:** Create → Write and read → Close and clean.

**Lab:** Export three expenses, read them with a resource-managed line stream, and count nonblank records.

**Acceptance checks:**

- Three nonblank records count as 3.
- Adding a blank line does not increase the count.
- Close the stream and delete the temporary file even on failure.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 6: Builds, unit tests, and Git

**Scenario:** A team makes the expense tracker reproducible.

1. **Project layout and dependency management.** Use a standard Maven layout: src/main/java for production and src/test/java for tests. A pom declares the Java release and dependencies. Commit the Maven wrapper so teammates use a reproducible tool version; distinguish production dependencies from test-only dependencies. **Chapter practice:** Run the fundamentals tests from the archive root. Which command should you use?
2. **JUnit Jupiter and behavior tests.** A useful test arranges inputs, invokes behavior, and asserts an observable result. Cover normal behavior and meaningful boundaries. Use assertThrows for a documented rejection. Prefer checking a contract over checking private implementation details that change during a refactor. **Chapter practice:** Which existing test would fail if list() returned the mutable internal list?
3. **Parameterized tests and test doubles.** Parameterized tests exercise one behavior across a table of cases. Use a fake or stub for an external boundary when it makes the unit deterministic. Do not mock simple values or every collaborator; too much mocking can test only the arrangement of mocks. **Chapter practice:** Which additional discount cases are important?
4. **Git and a continuous feedback loop.** Commit coherent changes, review diffs before committing, and keep secrets out of version control. Run tests before opening a review. A CI job should use the declared JDK and wrapper, then test from a clean checkout. Gradle is a valid alternative; this path uses Maven consistently. **Chapter practice:** Should target/ directories and local database files be committed?

**Interactive activity:** Validate → Calculate → Test boundary.

**Lab:** Create a Maven project and add JUnit Jupiter tests for a 20% discount, zero discount, 100% discount, and invalid input.

**Acceptance checks:**

- ./mvnw test succeeds from the project root.
- assertEquals checks 800, 1000, and 0 for price 1000.
- assertThrows checks percentages -1 and 101.
- The production method lives under src/main/java.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 7: Clean design and practical patterns

**Scenario:** An order service chooses a pricing policy without a growing conditional.

1. **Cohesion, coupling, and SOLID.** Keep behavior that changes together in a cohesive component. Reduce coupling by passing focused collaborators. Single responsibility is about reasons to change, not forcing every class to contain one method. Use dependency inversion when a boundary needs substitutable behavior. **Chapter practice:** What should remain unchanged when a tax implementation changes?
2. **Strategy, factory, and builder.** Strategy captures interchangeable algorithms such as pricing rules. A factory centralizes meaningful construction choices. A builder helps when many optional settings need readable assembly and validation. Learn the problem each pattern solves before adding its classes. **Chapter practice:** Which pattern fits adapting a vendor’s exchange-rate response to ExchangeRates?
3. **Composition, immutability, and ownership.** Prefer explicit ownership of mutable state. Copy a list when accepting it into an immutable value object. A copied list of mutable elements is still shallow. Small immutable values simplify equality, caching, and reasoning across threads. **Chapter practice:** Does this require a deep copy of String objects?
4. **Refactoring without changing behavior.** Start from a passing behavior test, move one responsibility at a time, and rerun the relevant cases. Name operations in the domain’s language. Remove unnecessary abstraction when it makes a simple rule harder to inspect. Patterns should reduce the cost of change rather than decorate code. **Chapter practice:** Which input would fail to expose this refactor bug?

**Interactive activity:** Select strategy → Delegate → Result.

**Lab:** Add a festival pricing strategy that subtracts 100 but never returns a negative amount; test it through Pricing.

**Acceptance checks:**

- Base 1000 returns 900.
- Base 50 returns 0.
- Existing regular and member policies retain their behavior.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 8: Data structures and algorithmic thinking

**Scenario:** A support queue needs fast lookups and prioritized work.

1. **Lists, stacks, queues, and heaps.** Match access patterns to structures. ArrayDeque is a practical stack or queue when null elements are unnecessary. PriorityQueue exposes the least element according to its ordering at the head; iterating it does not produce a sorted sequence. State tie-breaking rules for equal priorities. **Chapter practice:** Which structure fits repeatedly taking the highest-priority job?
2. **Big O and space tradeoffs.** A hash-based lookup is expected O(1), while a linear scan is O(n). Extra memory can avoid repeated scans. These models simplify constant costs and distribution assumptions, so validate real bottlenecks with measurements. Space complexity counts auxiliary storage as well as the input representation when relevant. **Chapter practice:** Would this count duplicate pairs or repeated occurrences after the first?
3. **Sorting, binary search, and recursion.** Binary search requires sorted data under the same ordering used for the search. Recursion needs a base case and progress toward it; deep recursion can overflow the stack. Compare a recursive formulation with an iterative alternative when input depth is unbounded. **Chapter practice:** Why would returning 0 at n == 0 break the recurrence?
4. **Graphs and deliberate interview practice.** Represent connections using adjacency lists, then explore with breadth-first or depth-first traversal. Track visited vertices to avoid loops. For unweighted shortest path, BFS explores by distance. Explain invariants and edge cases rather than memorizing a final implementation. **Chapter practice:** Why does BFS find shortest paths only when these edges have equal cost?

**Interactive activity:** Enqueue → First poll → Remaining polls.

**Lab:** Create a support priority queue of Ticket(priority, id), serving lower priority numbers first and breaking ties by id.

**Acceptance checks:**

- Tickets (2, B), (1, C), (1, A) are served A, C, B.
- Repeated poll is used rather than relying on iteration order.
- An empty queue is handled without dereferencing null.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 9: SQL, JDBC, and transactions

**Scenario:** Persist expenses in a relational database.

1. **Relational models and SQL basics.** Create tables with primary keys, appropriate column types, and constraints. Practice SELECT, INSERT, UPDATE, DELETE, joins, and grouped aggregates. SQL NULL represents missing information and needs IS NULL rather than = NULL. Design queries from the required result and its cardinality. **Chapter practice:** Which query lists each owner’s total?
2. **Prepared statements and result mapping.** Use JDBC PreparedStatement parameters for values instead of concatenating user input into SQL. Parameters cannot replace arbitrary identifiers such as a table name; those need trusted allowlists. Map ResultSet columns deliberately and close the result, statement, and connection. **Chapter practice:** Can a parameter choose a table name?
3. **Transactions and connection pools.** A transaction groups changes that must succeed or fail together. Disable auto-commit when managing a transaction manually, commit only after all operations succeed, and roll back on failure. In an application, borrow connections from a configured pool and return them promptly. **Chapter practice:** Why is catching a JDBC exception and continuing to commit unsafe?
4. **Indexes, constraints, and concurrency.** An index trades write cost and storage for faster access patterns. Use uniqueness and foreign-key constraints to protect invariants even when multiple clients write concurrently. Explain plans reveal how a query runs. Application validation alone cannot reliably prevent concurrent duplicate writes. **Chapter practice:** What prevents two concurrent writers from creating the same supposedly unique code?

**Interactive activity:** Prepare → Bind → Read and close.

**Lab:** Create an expenses table and implement a JDBC repository with add and findAtLeast methods. Use a test database and prepared values.

**Acceptance checks:**

- Food 1250 and Bus 300 persist across repository calls.
- findAtLeast(1000) returns only Food.
- A label containing an apostrophe is stored correctly.
- A failed multi-write transaction leaves no partial records.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 10: HTTP, JSON, and the developer core capstone

**Scenario:** Turn the expense tracker into a tested application boundary.

1. **HTTP requests and response semantics.** A request has a method, target, headers, and sometimes a body. A response has a status, headers, and a body. GET retrieves a representation; POST commonly creates or triggers work. Distinguish transport failure from an HTTP error response: a server returning 404 still completed an HTTP exchange. **Chapter practice:** What is the difference between a connection failure and a 404 response?
2. **Java HttpClient and bounded calls.** Reuse HttpClient and set connection and request timeouts. Decode with the intended charset. Do not assume a response is successful because send returned. Check status, bound response handling, and preserve interruption when the caller cancels a blocking operation. **Chapter practice:** Does a timeout imply a remote state-changing operation did not happen?
3. **JSON, DTOs, and validation.** JSON is an interchange format with objects, arrays, strings, numbers, booleans, and null. Use a maintained parser such as Jackson in a Maven project rather than splitting strings. Keep external DTOs separate from database entities and validate their data before it reaches business operations. **Chapter practice:** Why not expose every persistence field as an import property?
4. **Capstone: persistent expense application.** Combine records, collection queries, a repository interface, JDBC storage, and unit tests. Add import/export and a monthly summary. Keep HTTP calls behind an adapter that tests can replace. Deliver a README with setup, schema creation, test commands, sample inputs, and known limits. **Chapter practice:** What should you demonstrate after restarting the process?

**Interactive activity:** Build URI → Set contract → Inspect.

**Lab:** Complete the persistent expense capstone with a replaceable exchange-rate client, deterministic tests, and a monthly report.

**Acceptance checks:**

- The monthly report excludes expenses outside its date range.
- JDBC storage survives a restart.
- A simulated HTTP 500 produces a useful failure rather than a fake exchange rate.
- Unit tests use a fake client and never require internet access.

**Assessment:** seven-question module quiz; seven-question independent public practice.

### Advanced Java & Backend Engineering

**Prerequisite:** Complete Java Developer Core or have working knowledge of collections, Maven, unit tests, SQL, and HTTP.

**Outcome:** Design, test, package, and diagnose a secure backend service while explaining concurrency and consistency tradeoffs.

**Estimated effort:** 35–50 hours, including exercises. **Capstone:** Secure expense REST API.

#### Module 1: JVM internals and performance

**Scenario:** Diagnose a service whose memory use grows over time.

1. **Loading, bytecode, and JIT compilation.** Class loaders locate definitions and the JVM links and initializes classes before use. The interpreter and just-in-time compiler cooperate to execute bytecode. Warm-up affects measurements: a single timing from a cold process is not evidence of steady-state performance. **Chapter practice:** Does compiling a .java file produce machine code for only your laptop?
2. **Stacks, heap, reachability, and garbage collection.** Each thread has a call stack; objects are generally managed in the heap, though optimizations can change physical allocation. Garbage collection reclaims unreachable storage, not resources such as sockets on a useful schedule. A growing cache that still retains objects can cause a memory leak even with a garbage collector. **Chapter practice:** Would assigning retained = null clear the list also referenced by alias?
3. **JFR, thread dumps, and heap evidence.** Use Java Flight Recorder to inspect allocation, CPU, locks, and latency with context. Thread dumps reveal blocked and waiting threads; heap evidence reveals retention. Begin with a reproducible symptom and compare before and after under the same workload. Do not guess a collector setting before identifying the bottleneck. **Chapter practice:** What context should accompany a performance recording?
4. **Benchmarking and responsible optimization.** Use JMH for isolated microbenchmarks rather than handwritten nanoTime loops. Account for warm-up, dead-code elimination, and realistic inputs. Optimize the slow path that measurements identify, and rerun behavior tests after a performance change. Native memory and process memory are not identical to live Java heap size. **Chapter practice:** Why is an unused loop timed once with nanoTime weak evidence?

**Interactive activity:** Retain → Clear → Eligibility.

**Lab:** Profile a local workload with JFR, compare a bounded cache to an unbounded map, and record evidence rather than adding a GC call.

**Acceptance checks:**

- Capture a recording using jcmd <pid> JFR.start name=lab settings=profile duration=30s filename=lab.jfr.
- Record the workload and compare allocation or retention behavior.
- Explain why clear does not guarantee an immediate drop in process memory.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 2: Threads, visibility, and shared state

**Scenario:** Prevent lost updates when two workers count orders.

1. **Thread lifecycle and shared data.** Starting a thread schedules work independently; calling run directly is an ordinary method call. join waits for completion. Identify which values are shared before adding threads: immutable values and confined state often remove the need for coordination entirely. **Chapter practice:** Would a sleep in the caller replace the completion guarantee of join?
2. **Races, visibility, and happens-before.** A read-modify-write such as count++ is not a single atomic operation. volatile provides visibility and ordering guarantees for its field, but does not make a compound increment atomic. Use the Java Memory Model’s happens-before relationships rather than assumptions about what a CPU probably does. **Chapter practice:** Why is volatile count++ still unsafe with several writers?
3. **Locks, atomics, and concurrent collections.** synchronized protects a critical section and establishes visibility through matching monitor operations. AtomicInteger provides atomic single-variable updates. ConcurrentHashMap supports concurrent access, but a check followed by a separate update is still a compound action; use an appropriate atomic method. **Chapter practice:** When would AtomicInteger not be enough for a transfer between two balances?
4. **Deadlocks and cancellation.** A deadlock can occur when threads wait on locks held by one another. Prefer consistent lock ordering and bounded waits where suitable. Interruption is cooperative cancellation; propagate it or restore the flag when translating. Thread safety needs an explicit state and locking policy, not scattered synchronized keywords. **Chapter practice:** How can two-lock code avoid one common deadlock pattern?

**Interactive activity:** Start → Coordinate → Join.

**Lab:** Implement a synchronized counter, exercise it with two joined threads, and compare its contract with AtomicInteger.

**Acceptance checks:**

- The final count is 2000 after both joins.
- The increment and read operations follow one consistent lock policy.
- Explain why volatile int plus count++ is insufficient.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 3: Executors, futures, and virtual threads

**Scenario:** A service makes several independent blocking lookups.

1. **Executors and task ownership.** An ExecutorService separates task submission from thread creation. Keep a clear owner responsible for closing it. A fixed pool limits worker concurrency but its default queue can still grow without bound. Design admission limits as well as thread limits. **Chapter practice:** Which additional bound can be necessary when requests arrive faster than tasks complete?
2. **Futures and CompletableFuture.** A Future represents a pending result; get may block and can fail. CompletableFuture composes stages with explicit success and failure paths. Understand which executor runs asynchronous work. Cancellation, timeouts, and exception translation are part of the API, not afterthoughts. **Chapter practice:** How do join and get differ in their exception API?
3. **Virtual threads for blocking workloads.** Virtual threads are lightweight Java threads useful for large numbers of tasks that spend time waiting. They do not make CPU-heavy work faster and do not enlarge a database connection pool. Use a virtual-thread-per-task executor rather than creating a pool of virtual threads. **Chapter practice:** Should a scarce database connection pool be resized merely because tasks use virtual threads?
4. **Bounded resources and structured lifetimes.** Place a bound around scarce resources such as database connections and outbound calls. Keep child work within an explicit lifetime, close executors, and define what happens if one result fails. This course uses finalized APIs; preview concurrency APIs are discussed as optional reading and are not required for labs. **Chapter practice:** Why can closing an executor still take time after a timed get fails?

**Interactive activity:** Submit → Collect → Close.

**Lab:** Submit three independent lookup tasks, give result retrieval a timeout, and document how failures and unfinished tasks are cleaned up.

**Acceptance checks:**

- Collect all three successful values.
- A deliberately slow task triggers a timed get failure.
- Request cancellation for remaining work and close the executor.
- Explain that cancellation is cooperative and close may still wait.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 4: Modern Java, reflection, and modules

**Scenario:** Model API outcomes and inspect explicit application metadata.

1. **Records, sealed types, and pattern switches.** Use a sealed result hierarchy to enumerate success and failure shapes. Record patterns and pattern matching reduce casts while preserving type checking. Keep compatibility notes for older codebases, and distinguish finalized language features from preview features before adopting syntax. **Chapter practice:** Does a record pattern make a mutable list component deeply immutable?
2. **Annotations and reflection.** Annotations are metadata whose retention controls where they are available. Reflection can inspect types and invoke members, but it introduces runtime failure and access constraints. Prefer ordinary interfaces for normal application extension; use reflection when metadata-driven infrastructure actually needs it. **Chapter practice:** When is an ordinary interface preferable to reflective method-name lookup?
3. **JPMS, exports, and opens.** A module descriptor declares dependencies and exported packages. exports allows ordinary access to public APIs; opens permits reflective access under module rules. The module path and classpath have different boundaries. Avoid broad reflective access flags as a substitute for understanding your framework’s integration requirements. **Chapter practice:** What changes if a framework needs reflective access to nonpublic members?
4. **Packaging and migration choices.** A JAR packages classes and resources. jlink creates a custom runtime image for a known module graph. Modernize incrementally with behavior tests and explicit target releases. Learn to read Java 8, 17, and 21 idioms, while using Java 25 LTS as this path’s environment. **Chapter practice:** Why must the JDK used to create an image match the intended target platform?

**Interactive activity:** Enumerate → Match → Describe.

**Lab:** Add a Pending record outcome and update the exhaustive switch. Define a deliberate null policy.

**Acceptance checks:**

- All three permitted outcomes have an explicit arm.
- Adding a new permitted subtype forces a conscious switch update.
- Reject null explicitly or handle it with a null case.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 5: Spring Boot and REST APIs

**Scenario:** Expose the expense tracker as a REST service.

1. **Spring Boot, dependency injection, and configuration.** Generate a Maven project with Spring Initializr, Java 25, and the current stable Spring Boot release compatible with it. Select Spring Web and Validation. Commit the wrapper and dependency versions. Constructor injection makes collaborators explicit and lets unit tests supply substitutes. **Chapter practice:** Which command starts the reference backend?
2. **Controllers, services, and DTOs.** A controller translates HTTP into an application call. A service owns business operations. Request and response DTOs define the external contract and keep persistence details private. Keep HTTP concerns out of reusable calculations and avoid returning entities directly. **Chapter practice:** Why is a controller that directly performs all SQL and calculations hard to test?
3. **REST semantics, validation, and error responses.** GET retrieves, POST can create, PUT replaces at a known URI, and DELETE removes. Return statuses that match outcomes, including 201 for creation and 404 for a missing resource. Validate request DTOs with Jakarta validation and translate failures into consistent ProblemDetail responses. **Chapter practice:** Should a validation error return 200 with a success-looking body?
4. **Pagination and API contracts.** Bound collection endpoints with a maximum page size and stable sorting. Document request fields, response shapes, and errors. Treat API changes as compatibility decisions: renaming a public field can break a caller even if all internal tests pass. Start with a modular monolith rather than splitting services before boundaries are understood. **Chapter practice:** What happens for page size 101 in this API?

**Interactive activity:** Route → Bind → Serialize.

**Lab:** Implement POST /expenses and GET /expenses/{id} with constructor-injected service and validated request DTOs.

**Acceptance checks:**

- POST a valid expense returns 201 and a Location header.
- GET the returned URI returns the saved DTO.
- An invalid amount returns a consistent 400 error.
- An unknown id returns 404.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 6: JPA, database migrations, and transactions

**Scenario:** Persist the expense API safely under concurrent updates.

1. **Entities, repositories, and DTO mapping.** Add Spring Data JPA and a PostgreSQL driver to the API project. An entity models persisted identity and lifecycle; a repository handles access. Define id generation explicitly. Use DTO mapping at the service boundary so lazy relationships and internal columns do not leak into JSON. **Chapter practice:** Why not use a mutable entity directly as the input to POST?
2. **Relationships, fetch plans, and N+1.** Map only relationships the application needs and understand their ownership. Lazy associations can trigger many additional queries while iterating. Inspect SQL and choose a fetch join, projection, or entity graph for the use case. Avoid solving N+1 by making every relationship eager. **Chapter practice:** How would you detect an N+1 regression after adding a relationship?
3. **Transactions and optimistic locking.** Place a transaction around a complete business operation. Proxy-based @Transactional requires a call through the proxy; self-invocation does not add a new transaction boundary. @Version detects conflicting updates, which callers need to handle explicitly. A transaction does not automatically imply the strongest isolation level. **Chapter practice:** Does the manual version comparison make @Version redundant?
4. **Migrations, indexes, and production safety.** Use a migration tool such as Flyway to evolve schemas with versioned changes. Keep production schema evolution separate from automatic destructive recreation. Add indexes based on query plans, and test with the same database family used in production. Document rollback or forward-fix choices for data changes. **Chapter practice:** Should an already applied V1 migration be edited to rename a live column?

**Interactive activity:** Read → First update → Conflicting update.

**Lab:** Persist the expense endpoints, add a migration and a version column, then reproduce two conflicting updates.

**Acceptance checks:**

- A restart retains created expenses.
- Schema creation is managed by a versioned migration.
- The stale update is surfaced as a deliberate conflict response.
- A list endpoint uses a bounded query and verified fetch plan.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 7: Application security and authorization

**Scenario:** Ensure each user sees only their own expenses.

1. **Authentication versus authorization.** Authentication establishes an identity; authorization decides whether that identity may perform an action on a resource. A logged-in user must not gain access to another user’s expense merely by changing an id. Perform object-level authorization in the operation that loads or changes the resource. **Chapter practice:** Why must updates and deletes use the same ownership rule as reads?
2. **Spring Security and established identity flows.** Use a SecurityFilterChain and maintained Spring Security integration. Prefer an established identity provider and standards such as OAuth2/OIDC rather than designing tokens or password storage. If passwords are stored, use a suitable adaptive password encoder. A JWT signature does not hide the token’s payload. **Chapter practice:** Why did a raw bcrypt value fail when the authentication manager expected a delegated format?
3. **Browser security and input boundaries.** CSRF and CORS solve different problems. Cookie-authenticated state-changing requests need deliberate CSRF protection. CORS controls browser cross-origin access and is not authorization. Bind only allowed DTO fields, validate inputs, and encode output for its destination. **Chapter practice:** Can a signed JWT be read by someone holding it?
4. **Secrets, logging, and abuse limits.** Keep credentials outside source control and avoid logging tokens, passwords, or personal expense details. Apply least privilege to database accounts and outbound credentials. Bound request sizes and rates. Maintain dependency updates and verify security behavior with tests for both allowed and denied requests. **Chapter practice:** Should an Authorization header be logged when debugging a 401?

**Interactive activity:** Authenticate → Authorize owner → Deny other user.

**Lab:** Add authenticated access to the expense API and enforce ownership in reads, updates, and deletes.

**Acceptance checks:**

- Anonymous access is rejected according to the configured authentication scheme.
- Alice can access her own expense.
- Bob cannot read or modify Alice’s expense by guessing an id.
- Security tests cover all three cases; logs contain no credentials.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 8: Integration tests and API contracts

**Scenario:** Catch API, database, and security regressions before release.

1. **A layered testing strategy.** Keep fast unit tests for domain rules, focused integration tests for boundaries, and a small number of complete user journeys. Every layer should detect a distinct risk. Testing private details at every layer produces maintenance work without improving confidence. **Chapter practice:** What extra risk does an HTTP test cover beyond directly invoking a service?
2. **Spring test slices and full application tests.** Use WebMvcTest for controller behavior with controlled collaborators, and DataJpaTest for persistence behavior. A SpringBootTest covers a wider context and costs more to start. Match the test boundary to the behavior being verified, including security filters when authorization is under test. **Chapter practice:** Would disabling filters make an authorization test meaningful?
3. **Testcontainers and real database behavior.** Use Testcontainers for disposable database instances when a container runtime is available. Apply real migrations and verify constraints, transaction effects, and query results. Explicitly account for container startup and cleanup. An in-memory database can be useful but is not proof of PostgreSQL behavior. **Chapter practice:** Which failure is especially important to catch against PostgreSQL?
4. **Contracts, determinism, and failure scenarios.** Assert status, important headers, and response fields. Test invalid input, unauthenticated calls, cross-user access, missing records, conflicts, and dependency failures. Inject Clock and fake external services to remove timing and internet dependence. Keep CI failures actionable with useful diagnostics. **Chapter practice:** Which assertion would detect an adapter converting HTTP 500 into a fake rate?

**Interactive activity:** Arrange → Allow → Deny.

**Lab:** Create a regression suite for expense creation, validation, persistence, and ownership with a PostgreSQL test container.

**Acceptance checks:**

- A clean test database runs all migrations.
- Controller tests verify 201, 400, and missing-record behavior.
- Authenticated cross-user reads and writes are denied.
- The same suite runs in CI with a documented container requirement.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 9: Resilience, caching, and messaging

**Scenario:** Prevent duplicate charges when a dependency times out.

1. **Timeouts, retries, and idempotency.** A timeout means the caller did not receive an answer in time; it does not prove the remote operation never happened. Retry only operations that are safe under an explicit idempotency policy. Bound attempts, add backoff with jitter, and avoid retries at every layer multiplying the load. **Chapter practice:** Would retrying a payment with a new idempotency key on every attempt prevent duplicates?
2. **Circuit breakers and resource isolation.** A circuit breaker temporarily stops calls after a failure threshold; it does not repair the dependency. Bulkheads and concurrency limits prevent one failing integration from consuming every worker or connection. Choose fallback behavior that remains truthful instead of inventing successful financial results. **Chapter practice:** What must happen if work throws after acquiring a permit?
3. **Caching and consistency.** A cache trades freshness and memory for reduced work. Define keys, TTL, invalidation, and ownership. Cache-aside loads on a miss but can suffer stampedes and stale data. Protect sensitive results by including identity or authorization scope in any cache contract that needs it. **Chapter practice:** Why must an owner-sensitive cache key or access check account for identity?
4. **Messaging, outbox, and duplicate delivery.** Queues decouple work but introduce delivery, ordering, and retry choices. At-least-once delivery requires idempotent consumers. An outbox records an event in the same database transaction as its business change, then publishes it asynchronously. It still requires duplicate handling and operational monitoring. **Chapter practice:** Why is an in-memory Set of processed ids insufficient?

**Interactive activity:** First e1 → Duplicate e1 → New e2.

**Lab:** Design and test a durable event consumer that applies an effect once per event id, including a crash between attempts.

**Acceptance checks:**

- Delivering the same event twice produces one business effect.
- The processed-id marker and effect commit in one transaction.
- A rollback leaves both absent so a retry can apply them.
- The design survives process restart and concurrent deliveries.

**Assessment:** seven-question module quiz; seven-question independent public practice.

#### Module 10: Delivery, observability, and final capstone

**Scenario:** Operate a secure expense API as a small production-style service.

1. **Configuration, containers, and CI.** Externalize environment configuration and secrets. Build a reproducible application artifact, use a supported runtime image, and run as a non-root user where supported. CI should compile, test, build, and verify configuration without needing production credentials. Keep the deployment path small enough to understand. **Chapter practice:** Which configuration must remain outside the image?
2. **Logs, metrics, traces, and health.** Structured logs explain events, metrics reveal rates and distributions, and traces connect work across boundaries. Use correlation identifiers without exposing secrets. Separate readiness from liveness so an application is not sent traffic before it can serve it. Restrict operational endpoints appropriately. **Chapter practice:** Why can average request latency hide a user-visible problem?
3. **Graceful shutdown and migration rollout.** Stop accepting new work, give active operations a bounded completion window, and close resources. Roll out compatible schema changes before removing old fields or columns. Verify a restore process rather than merely assuming backups work. Document how to detect and recover from a bad release. **Chapter practice:** What must be verified before removing an old database column used by a previous application version?
4. **Final capstone and developer readiness.** Deliver the expense API with authenticated ownership, validated DTOs, PostgreSQL migrations, optimistic locking, tests, an idempotent event workflow, and container packaging. Provide a walkthrough of one request, one failure, and one incident diagnosis. Explain tradeoffs rather than claiming that completing quizzes alone proves production readiness. **Chapter practice:** What additional work is needed before exposing this teaching demo publicly?

**Interactive activity:** Identify → Record → Observe.

**Lab:** Package and document the final API. Run a local container, exercise a complete owner journey, and diagnose one intentional dependency failure.

**Acceptance checks:**

- CI runs tests and produces a reproducible artifact.
- Container configuration uses external secrets and a persistent database.
- Create, read, update, conflict, and cross-user denial paths are demonstrated.
- Readiness, graceful shutdown, and failure logging are verified.
- README includes setup, API examples, migrations, restore notes, and limitations.

**Assessment:** seven-question module quiz; seven-question independent public practice.

## Boundaries and follow-on study

The path targets general Java backend development. Android, JavaFX, deep reactive programming, advanced Kubernetes administration, and vendor certification preparation are separate specializations. Required labs use finalized Java APIs. Interviews may need additional algorithm practice, and deployment to a real public service requires the learner’s own infrastructure and identity-provider configuration. No live Java execution service is added to this static site.

## Research and rationale

Dev.java’s language/API/JVM organization informs the core sequence. The LTS roadmap supports Java 25 as a stable teaching baseline. The virtual-thread guidance informs task-per-thread examples and explicit resource bounds. Spring’s REST, JPA, compatibility, and testing documentation informs the backend sequence. These are original teaching examples, not copied tutorials.

- [Java language, APIs, and JVM learning map](https://dev.java/learn/)
- [Java LTS release roadmap](https://www.oracle.com/technetwork/java/javase/tech/eol-135779.html)
- [Virtual thread adoption guidance](https://inside.java/2023/09/20/virtual-threads-adoption-guide/)
- [Maven project and dependency guides](https://maven.apache.org/guides/)
- [JUnit Jupiter user guide](https://docs.junit.org/6.1.3/overview.html)
- [Spring REST service guide](https://spring.io/guides/gs/rest-service/)
- [Spring Data JPA guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [Spring Boot testing reference](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html)
- [Spring Boot Java compatibility](https://docs.spring.io/spring-boot/system-requirements.html)

## Maintaining the content

Edit the authored modules, chapter workshops, and code predictions under scripts/data/java-*.mjs, then run node scripts/build-java-courses.mjs. The script regenerates the three Java courses, their 63 quizzes, this document, and the source-project ZIP; existing JavaScript, React, and Node courses are preserved. Run npm run test:java, npm run test:java:examples with Java 25, sh examples/java/verify.sh, and npm run build before publishing. Configure TEST_DB_URL/USER/PASSWORD to run the backend suite against an isolated PostgreSQL database too. The generated content uses the existing course progression and quiz scoring.
