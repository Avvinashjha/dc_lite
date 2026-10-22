// Authored curriculum. Each question is [prompt, correct, distractors, explanation].
export default [
{
 id:'first-program', title:'Your first Java program', scenario:'A café needs a receipt printer.',
 chapters:[
 ['Java, the JDK, and the JVM','Java source is a recipe; the compiler turns it into bytecode, and the JVM executes it. The JDK supplies development tools including javac, java, and JShell. This separation lets the same class file run on compatible JVMs on different operating systems.'],
 ['Install and verify your tools','Install an OpenJDK 25 distribution and verify java --version, javac --version, and jshell --version in a new terminal. If they disagree, inspect JAVA_HOME and PATH before continuing. An IDE helps navigate projects, but the command line makes the execution model visible.'],
 ['Source files, main, and console output','Save a public class named Receipt in Receipt.java. The traditional public static void main(String[] args) entry point remains useful when reading existing projects. Compile with javac Receipt.java and run with java Receipt; do not include .class in the launch command.'],
 ['JShell, compiler errors, and runtime errors','Use JShell for small experiments. A missing semicolon prevents compilation; a program that compiles can still fail at runtime. Read the first useful error and the source line before changing unrelated code. Keep experiments small enough that you can predict their output.']
 ],
 code:'class Receipt {\n  public static void main(String[] args) {\n    int coffees = 2;\n    System.out.println("Coffees: " + coffees);\n  }\n}',
 output:'Coffees: 2', trace:[['Enter main','The JVM calls the entry point. No receipt has been printed.'],['coffees = 2','The local int holds the value 2.'],['Print receipt','String concatenation produces Coffees: 2, followed by a newline.']],
 task:'Print a second line containing Total: 120 after the coffee count.', checks:['The original coffee line remains first.','The second line is exactly Total: 120.','Compile and run Receipt.java from a terminal.'], hint:'Add another println inside main, after the existing one.', solution:'System.out.println("Total: 120");',
 questions:[
 ['Which tool compiles Receipt.java to bytecode?','javac',['java','npm','javadoc'],'javac compiles source; java launches a program.'],
 ['What runs Java bytecode?','A compatible JVM',['A CSS engine','Only the original compiler','A SQL server'],'The JVM executes bytecode for the target platform.'],
 ['A public class Receipt is saved in which file?','Receipt.java',['receipt.txt','Main.class','Receipt.js'],'A public top-level class uses a matching source filename.'],
 ['After javac Receipt.java succeeds, which command launches it?','java Receipt',['java Receipt.class','javac Receipt','run Receipt.java.class'],'The launcher takes the class name without .class.'],
 ['What does System.out.println("Hi") add after Hi?','A line terminator',['A semicolon','Nothing','The word null'],'println ends the output line.'],
 ['A missing semicolon normally causes what?','A compilation error',['A network timeout','A garbage collection pause','An automatic correction'],'The compiler rejects invalid syntax before execution.'],
 ['Which tool is useful for evaluating a Java expression interactively?','JShell',['Git','Docker','Pagefind'],'JShell is a Java REPL.'],
 ['java and javac report different major versions. What should you inspect first?','PATH and JAVA_HOME',['The monitor resolution','SQL indexes','The HTTP port'],'The terminal may be resolving commands from different JDK installations.']
 ]
},
{
 id:'values-and-types', title:'Values, types, and expressions', scenario:'A grocery store calculates basket totals.',
 chapters:[
 ['Primitive values and reference values','Use int for ordinary whole-number counts, long for larger ranges, boolean for decisions, and double for approximate real numbers. String is a reference type. Local variables need a value before use. Field defaults do not mean uninitialized local variables are safe to read.'],
 ['Operators, promotion, and integer division','Java evaluates expressions according to precedence and operand types. Dividing two ints discards the fractional part before any later assignment to double. Parentheses communicate intention. Convert an operand before division when a fractional result is required.'],
 ['Conversions, overflow, and final','Widening an int to long preserves its value; narrowing may lose information. Ordinary integer arithmetic can overflow silently. Use Math.addExact when overflow must fail explicitly. final prevents reassignment of a variable; it does not make a referenced object immutable.'],
 ['Money and trustworthy input','Use integer minor units for a simple basket, or BigDecimal with an explicit rounding rule for decimal financial calculations. Construct decimal amounts from strings. Validate quantities before calculation; changing the numeric type does not repair an invalid business rule.']
 ],
 code:'int apples = 3;\nint priceInPaise = 1250;\nint total = apples * priceInPaise;\nSystem.out.println(total);\nSystem.out.println(5 / 2);\nSystem.out.println(5 / 2.0);', output:'3750\n2\n2.5',
 trace:[['Read quantities','apples = 3; priceInPaise = 1250.'],['Multiply','total = 3750 paise. No floating point rounding is involved.'],['Compare divisions','5 / 2 evaluates to int 2; 5 / 2.0 evaluates to double 2.5.']],
 task:'Calculate the cost of four apples and reject a negative quantity before multiplication.', checks:['Four apples cost 5000 paise.','A negative quantity raises IllegalArgumentException.','Zero apples cost zero.'], hint:'An if statement can guard the calculation; use the control-flow module if it is new.', solution:'int apples = 4;\nif (apples < 0) throw new IllegalArgumentException("Negative quantity");\nSystem.out.println(apples * 1250);',
 questions:[
 ['What is the value of 5 / 2 in Java?','2',['2.5','3','Compilation error'],'Both operands are integers, so division truncates toward zero.'],
 ['Which expression evaluates to 2.5?','5 / 2.0',['(double) (5 / 2)','5 / 2','(int) 2.5'],'A floating-point operand changes the division before it happens.'],
 ['Which type is a reference type?','String',['int','boolean','double'],'String objects are accessed through references.'],
 ['What does final prevent for a local variable?','Reassignment',['Mutation of every referenced object','All exceptions','Overflow'],'final fixes the variable binding, not the internals of an object.'],
 ['Which decimal construction preserves the written decimal amount?','new BigDecimal("0.10")',['new BigDecimal(0.10)','(int) 0.10','new String(0.10)'],'The string constructor avoids importing a binary floating-point approximation.'],
 ['Reading a local int before assigning it produces what?','A compilation error',['Zero','null','A random value'],'Definite assignment is checked for local variables.'],
 ['What can ordinary int addition do when the mathematical result exceeds its range?','Wrap around',['Automatically become long','Always throw','Produce infinity'],'Integer overflow is silent for ordinary arithmetic.'],
 ['Which method detects overflow when adding two ints?','Math.addExact',['Math.abs','Integer.toString','Double.parseDouble'],'addExact throws ArithmeticException on overflow.']
 ]
},
{
 id:'decisions-and-loops', title:'Decisions and loops', scenario:'A delivery service applies shipping rules.',
 chapters:[
 ['Conditions and short-circuit logic','A branch encodes a rule: free shipping starts at a particular subtotal. Write boundary examples before the condition. && evaluates its right side only when the left side is true, which makes a null check followed by a method call safe when ordered correctly.'],
 ['if, else, and switch expressions','Use if for ranges and combinations of predicates. Use switch to map a finite set of values to outcomes. Arrow cases avoid accidental fall-through. A switch expression must produce a value for every possible input accepted by its type.'],
 ['for, while, and enhanced for','Use a counted loop when the index matters, an enhanced for for values, and while when repetition depends on evolving state. State the invariant: what remains true before and after an iteration? This makes termination and correctness easier to inspect.'],
 ['Off-by-one errors and tracing','For an array of length n, valid indexes are 0 through n - 1. Write a trace table with the index, current value, and accumulator. Test empty input, one item, and a value exactly at the shipping threshold. break exits a loop; continue skips the rest of its current iteration.']
 ], code:'int[] orders = {400, 600, 1000};\nint free = 0;\nfor (int subtotal : orders) {\n  if (subtotal >= 600) free++;\n}\nSystem.out.println(free);', output:'2',
 trace:[['First order','400 >= 600 is false; free = 0.'],['Second order','600 meets the boundary; free = 1.'],['Third order','1000 meets the boundary; free = 2.']],
 task:'Count orders eligible for free shipping at a threshold of 1000, then test an empty order array.', checks:['The sample produces 1.','An empty array produces 0.','An order of exactly 1000 qualifies.'], hint:'Keep >= and change only the threshold; initialize the counter before the loop.', solution:'int free = 0;\nfor (int subtotal : orders) {\n  if (subtotal >= 1000) free++;\n}\nSystem.out.println(free);',
 questions:[
 ['Which condition includes a subtotal of exactly 600?','subtotal >= 600',['subtotal > 600','subtotal < 600','subtotal != 600'],'Greater-than-or-equal includes the boundary.'],
 ['Which operator short-circuits when its left operand is false?','&&',['&','|','+'],'Logical AND does not need the right operand when the result is already false.'],
 ['What does continue do inside a loop?','Skip the remainder of the current iteration',['Exit the method','Always exit all loops','Restart the program'],'The next iteration proceeds according to the loop construct.'],
 ['Which index is the last valid index of a length-5 array?','4',['5','6','-1'],'Array indexes start at zero.'],
 ['How often does for (int i = 0; i < 3; i++) execute its body?','3 times',['2 times','4 times','Forever'],'The body sees i equal to 0, 1, and 2.'],
 ['Which switch form avoids implicit fall-through between cases?','Arrow cases using ->',['Colon cases without break','Any switch with an int','Any switch with a String'],'Arrow cases execute their own arm without falling into the next.'],
 ['A while condition is false before its first iteration. How often does the body run?','Zero times',['Once','Twice','Until break'],'while checks the condition before entering the body.'],
 ['Which is the most useful shipping-rule test set?','Below, at, and above the threshold',['Three unrelated variable names','Only a very large order','Only a nonempty array'],'Boundary tests reveal incorrect comparison operators.']
 ]
},
{
 id:'methods-and-debugging', title:'Methods and debugging', scenario:'A restaurant reuses a tip calculator.',
 chapters:[
 ['Method signatures, parameters, and return values','A method names a focused operation. Parameters make its inputs explicit; the return type describes its result. Prefer a calculation that returns a value over one that prints internally, so the same logic can be reused in a terminal, an API, and a test.'],
 ['Scope, the call stack, and pass-by-value','Each invocation has its own local variables. Java always passes values: primitive values are copied, and object reference values are copied too. A method can mutate a shared object through that copied reference, but assigning its parameter to another object does not replace the caller’s variable.'],
 ['Overloading and decomposition','Overloads share a name but differ in parameter types or counts. Return type alone cannot distinguish them. Break a large feature into validation, calculation, and presentation so each method has a clear contract and a manageable set of cases.'],
 ['Breakpoints and reading failures','Set a breakpoint before the surprising calculation. Step into a method to inspect its inputs; step over when its implementation is already trusted. Read stack traces from the exception toward the first relevant application frame. Reproduce a bug with a small input before attempting a fix.']
 ], code:'int tip(int bill, int percent) {\n  return bill * percent / 100;\n}\nint bill = 800;\nint result = tip(bill, 10);\nSystem.out.println(result);\nSystem.out.println(bill);', output:'80\n800',
 trace:[['Call tip','Copies 800 and 10 into the method parameters.'],['Calculate','800 * 10 / 100 produces 80.'],['Return','result becomes 80; caller bill remains 800.']],
 task:'Add validation to tip so negative bills and percentages throw; preserve integer rounding toward zero.', checks:['tip(800, 10) returns 80.','tip(99, 10) returns 9.','Negative bill or percent throws IllegalArgumentException.'], hint:'Guard invalid inputs before return. Consider overflow if this becomes a production money API.', solution:'int tip(int bill, int percent) {\n  if (bill < 0 || percent < 0) throw new IllegalArgumentException("Negative input");\n  return Math.multiplyExact(bill, percent) / 100;\n}',
 questions:[
 ['How are Java arguments passed?','By value',['By reference for all objects','By name','By source code substitution'],'An object argument copies the reference value, not the object itself.'],
 ['Can two overloads differ only in return type?','No',['Yes, always','Only for int','Only for public methods'],'The parameter list must distinguish overloaded declarations.'],
 ['What does return do?','Ends the current method invocation',['Always exits the JVM','Restarts the loop','Deletes all local variables globally'],'It optionally provides a value to the caller.'],
 ['Which design makes tip calculation easiest to unit test?','Return the tip without console input or output',['Read terminal input inside every calculation','Use a global bill variable','Print without returning a result'],'Explicit inputs and outputs reduce test setup and side effects.'],
 ['A method reassigns its object parameter. Does this replace the caller’s variable?','No',['Always','Only if the parameter is public','Only with final'],'The reassignment changes the local copy of the reference.'],
 ['What debugger action enters a called method?','Step into',['Step over','Resume to completion','Delete breakpoint'],'Step into follows execution into the method body.'],
 ['A local variable declared inside a block is normally visible where?','Within that block after its declaration',['Throughout all classes','Before its declaration everywhere','Only to the garbage collector'],'Lexical scope bounds where the name is accessible.'],
 ['What should you establish before fixing a reported calculation bug?','A small reproducible failing input',['A new framework','A larger monitor','A database migration'],'A reproducer lets you confirm both the cause and the repair.']
 ]
},
{
 id:'arrays-and-algorithms', title:'Arrays and problem solving', scenario:'A weather station summarizes daily temperatures.',
 chapters:[
 ['Fixed-size arrays and indexes','An array groups values of one element type into an indexed sequence. Its length is fixed at creation. Accessing an invalid index raises ArrayIndexOutOfBoundsException. An int array receives zero-initialized elements, but you still need to decide what those zeros mean in the domain.'],
 ['Accumulation, search, and empty inputs','A sum starts at zero; a maximum cannot safely start at zero when all values may be negative. Choose an explicit empty-input policy before accessing element zero. Linear search examines values until it finds a match or exhausts the array.'],
 ['Two-dimensional arrays and copying','A Java two-dimensional array is an array of array references and may be ragged. Copying the outer array does not deep-copy its rows. Arrays.copyOf creates a new one-dimensional array; copying reference elements still preserves references to the same objects.'],
 ['Complexity and small test cases','A single pass over n readings takes O(n) time. Nested full passes often take O(n²). Complexity describes growth, not exact elapsed time. Draw the array and trace a tiny example before optimizing. Include duplicates, negative values, empty input, and an item at the final index.']
 ], code:'int[] temperatures = {-3, 4, 1};\nint max = temperatures[0];\nfor (int value : temperatures) {\n  if (value > max) max = value;\n}\nSystem.out.println(max);', output:'4',
 trace:[['Initialize','max = -3, the first actual reading.'],['Compare 4','4 > -3, so max becomes 4.'],['Compare 1','1 is not greater than 4; max stays 4.']],
 task:'Write maximum(int[] readings) that rejects an empty array and works for all-negative readings.', checks:['{-8, -3, -9} returns -3.','{7} returns 7.','{} throws IllegalArgumentException.'], hint:'Check length before reading readings[0].', solution:'int maximum(int[] readings) {\n  if (readings.length == 0) throw new IllegalArgumentException("No readings");\n  int max = readings[0];\n  for (int value : readings) if (value > max) max = value;\n  return max;\n}',
 questions:[
 ['Can an existing Java array change its length?','No',['Yes, using add','Yes, assigning length','Only if final'],'Create a new array or use a resizable collection.'],
 ['What happens when an array index equals its length?','ArrayIndexOutOfBoundsException',['Returns zero','Returns the last element','Expands the array'],'The largest valid index is length - 1.'],
 ['What is a safe starting maximum for a known nonempty int array?','Its first element',['Always zero','Always one','Its length'],'An actual element handles arrays containing only negative values.'],
 ['How does a one-pass linear scan grow with n elements?','O(n)',['O(1)','O(log n)','O(n!)'],'It examines at most a constant amount of work per element.'],
 ['Does cloning an int[][] deep-copy all rows?','No',['Yes','Only if all rows are equal length','Only for negative values'],'The outer clone still refers to the original row arrays.'],
 ['What value fills a newly allocated int[3]?','0',['null','-1','Unspecified garbage'],'Array elements receive default values.'],
 ['Which case exposes initializing maximum to zero incorrectly?','An array of only negative numbers',['An array with a positive maximum','An array with a zero maximum','An array with one positive value'],'Zero would incorrectly exceed every real reading.'],
 ['What must you decide for a maximum operation on an empty array?','An explicit empty-input policy',['An arbitrary valid index','A mutable array length','A random default'],'There is no maximum element; reject or represent absence deliberately.']
 ]
},
{
 id:'strings-and-input', title:'Strings, text, and input', scenario:'A help desk normalizes customer reference codes.',
 chapters:[
 ['Immutable strings and equality','A String does not change after construction. Operations such as strip and toUpperCase return a result that you must use. equals compares content; == compares reference identity. String interning can make identity tests seem to work until input comes from another source.'],
 ['StringBuilder and formatting','Build text incrementally with StringBuilder when many additions happen in a loop. A builder is mutable and is not a replacement for synchronization. Use formatted output to separate the template from its values, and choose an explicit locale when formatting machine-readable text.'],
 ['Unicode and text boundaries','A Java char is a UTF-16 code unit, not necessarily a complete user-perceived character. Some code points occupy two chars; emoji sequences can contain multiple code points. Do not assume length equals the number of visible symbols or split arbitrary text at an unchecked char index.'],
 ['Parsing and input validation','Read input as text, strip permitted whitespace, and parse it with an explicit error policy. Scanner nextInt leaves a line separator for a later nextLine, a common source of empty reads. Treat null, blank text, invalid numbers, and out-of-range values as different cases.']
 ], code:'String raw = "  ab-42  ";\nString code = raw.strip().toUpperCase(java.util.Locale.ROOT);\nSystem.out.println(code);\nSystem.out.println(raw.equals(code));', output:'AB-42\nfalse',
 trace:[['Original text','raw still contains leading and trailing spaces.'],['Normalize','strip returns ab-42; uppercase with ROOT returns AB-42.'],['Compare','raw and code contain different text, so equals returns false.']],
 task:'Create normalize(String value) that rejects null or blank input and returns a stripped uppercase code.', checks:['" ab-42 " becomes "AB-42".','Blank input throws IllegalArgumentException.','Null input throws IllegalArgumentException.'], hint:'Check null before invoking isBlank; use Locale.ROOT for identifiers.', solution:'String normalize(String value) {\n  if (value == null || value.isBlank()) throw new IllegalArgumentException("Missing code");\n  return value.strip().toUpperCase(java.util.Locale.ROOT);\n}',
 questions:[
 ['Which operation compares String content?','equals',['==','instanceof','hashCode alone'],'equals tests content; == tests reference identity.'],
 ['What does calling strip() do to the original String?','Leaves it unchanged',['Mutates it','Deletes its reference','Makes it null'],'String is immutable; use the returned value.'],
 ['Which tool fits repeated text appends inside a loop?','StringBuilder',['Integer','ThreadLocal','FileLock'],'StringBuilder provides mutable accumulation.'],
 ['Does String.length() always count visible characters?','No',['Yes','Only when final','Only on Linux'],'It counts UTF-16 code units, not grapheme clusters.'],
 ['Which locale is appropriate for normalizing machine identifiers?','Locale.ROOT',['The user default in every case','A random locale','The timezone name'],'ROOT avoids locale-dependent case mapping for identifiers.'],
 ['What may nextLine() return immediately after Scanner.nextInt()?','The remainder of the current line, possibly empty',['Always the next integer','Always null','A StringBuilder'],'nextInt does not consume the whole line separator.'],
 ['Which check safely guards a following method call on value?','value != null && !value.isBlank()',['!value.isBlank() && value != null','value.isBlank() || value == null','value.length() > 0'],'Short-circuit evaluation checks null first.'],
 ['What does Integer.parseInt("abc") throw?','NumberFormatException',['IOException','ClassNotFoundException','No exception'],'The string is not a valid integer representation.']
 ]
},
{
 id:'classes-and-encapsulation', title:'Classes, objects, and encapsulation', scenario:'A digital wallet protects its balance.',
 chapters:[
 ['Classes, instances, and constructors','A class defines state and behavior; each instance owns its instance fields. A constructor establishes a valid initial state. Think of two wallets: they share rules, but adding money to one must not change the other. this identifies the current receiver.'],
 ['Encapsulation and invariants','Keep the balance private and expose operations that preserve its rules. A public setter that accepts any number allows impossible states. Encapsulation is the ability to maintain an invariant through a controlled API, not merely adding getters and setters to every field.'],
 ['Instance versus static and object references','Instance methods operate on a receiver; static members belong to the class. Assigning one wallet reference to another variable does not clone the wallet. Both variables can reach the same instance. Use an identity diagram to distinguish variables from the objects they reference.'],
 ['Immutable values, equals, and hashCode','Value objects compare meaningful state rather than identity. Equal objects must have equal hash codes. Keep the fields used in equality stable when the object is a map key. Prefer immutable value types for amounts and identifiers; mutable entities need deliberate lifecycle rules.']
 ], code:'class Wallet {\n  private int balance;\n  void deposit(int amount) {\n    if (amount <= 0) throw new IllegalArgumentException("Positive amount required");\n    balance = Math.addExact(balance, amount);\n  }\n  int balance() { return balance; }\n}\nWallet first = new Wallet();\nWallet alias = first;\nalias.deposit(50);\nSystem.out.println(first.balance());', output:'50',
 trace:[['Allocate','One Wallet object starts with balance 0.'],['Alias','first and alias both refer to that same wallet.'],['Deposit','alias.deposit changes the shared object; first.balance() is 50.']],
 task:'Add withdraw(int amount), rejecting nonpositive amounts and withdrawals larger than the balance.', checks:['Deposit 50 then withdraw 20 leaves 30.','Withdraw 51 from balance 50 fails without changing the balance.','Zero and negative withdrawals fail.'], hint:'Check every precondition before subtracting.', solution:'void withdraw(int amount) {\n  if (amount <= 0 || amount > balance) throw new IllegalArgumentException("Invalid withdrawal");\n  balance -= amount;\n}',
 questions:[
 ['What does assigning Wallet alias = first copy?','The reference value',['The entire wallet object','The class definition','The balance into a new object'],'Both variables can refer to one object.'],
 ['Why keep a wallet balance private?','To enforce valid changes through operations',['To make arithmetic faster','To guarantee thread safety','To prevent all exceptions'],'Encapsulation protects the invariant through the API.'],
 ['Which member belongs to the class rather than each instance?','A static field',['An instance field','this','A constructor parameter'],'Static state is associated with the class.'],
 ['What should a constructor establish?','A valid initial object state',['An arbitrary invalid balance','A second JVM','A global variable for every field'],'Constructor validation prevents invalid instances from escaping.'],
 ['If a.equals(b) is true, which must hold?','a.hashCode() == b.hashCode()',['a == b','a and b have different classes','Both hash codes are zero'],'The equality contract requires equal hash codes for equal objects.'],
 ['Does a private field alone make a class thread-safe?','No',['Yes','Only for ints','Only with getters'],'Visibility and synchronization are separate concerns.'],
 ['Why validate before subtracting a withdrawal?','A failed operation should preserve the balance',['Subtraction cannot use private fields','To force integer overflow','To allocate another wallet'],'Validate first so rejection does not leave partial state.'],
 ['What does this refer to in an instance method?','The current receiver object',['The superclass only','The current source file','Every instance at once'],'this is the object on which the instance method is invoked.']
 ]
},
{
 id:'inheritance-and-polymorphism', title:'Inheritance and polymorphism', scenario:'A checkout supports several shipping policies.',
 chapters:[
 ['An is-a relationship and inherited behavior','Inheritance models a substitutable specialization. A subclass can reuse accessible behavior and override an instance method. Do not use inheritance merely to borrow a few lines of code; a subtype must honor the promises made by its parent.'],
 ['Dynamic dispatch and overriding','The declared reference type determines which members are accessible at compile time. The runtime object determines the overriding instance method that executes. @Override asks the compiler to verify your intent. Static methods are hidden, rather than dynamically dispatched in the same way.'],
 ['super, access, and final','super can invoke a superclass constructor or implementation. Private state is not directly accessible in a subclass. final methods cannot be overridden; final classes cannot be subclassed. A protected member still needs a deliberate API boundary.'],
 ['Composition and the substitution principle','A checkout can contain a shipping policy instead of becoming a shipping policy. Composition makes changing one behavior explicit and avoids fragile hierarchies. If a subtype rejects normal operations accepted by its parent, revisit whether the relationship represents substitution.']
 ], code:'class Shipping { int fee() { return 50; } }\nclass Express extends Shipping {\n  @Override int fee() { return 100; }\n}\nShipping chosen = new Express();\nSystem.out.println(chosen.fee());', output:'100',
 trace:[['Declare','chosen has compile-time type Shipping.'],['Instantiate','Its runtime object is an Express.'],['Dispatch','The override Express.fee runs and returns 100.']],
 task:'Add FreeShipping as a subtype whose fee is zero, then sum standard and free shipping through Shipping references.', checks:['new FreeShipping().fee() returns 0.','A Shipping reference to FreeShipping still returns 0.','The standard plus free total is 50.'], hint:'Override fee with the same parameter list and a compatible return type.', solution:'class FreeShipping extends Shipping {\n  @Override int fee() { return 0; }\n}\nShipping free = new FreeShipping();\nSystem.out.println(new Shipping().fee() + free.fee());',
 questions:[
 ['A Shipping variable holds new Express(). Which instance fee override runs?','Express.fee',['Always Shipping.fee','Both automatically','Neither'],'Dynamic dispatch uses the runtime receiver.'],
 ['What does @Override help verify?','That a method overrides or implements a supertype method',['That the method is fastest','That an object is immutable','That code cannot throw'],'The compiler checks the override relationship.'],
 ['Can a final class be subclassed?','No',['Yes, with public','Only in the same file','Only with super'],'final prohibits extending the class.'],
 ['When is composition especially suitable?','A checkout has a replaceable shipping policy',['A checkout is always a kind of shipping fee','Every time a constructor exists','Only for primitive types'],'A has-a relationship can delegate behavior without inheritance.'],
 ['Can a subclass directly access a private superclass field?','No',['Yes, always','Only with this','Only with @Override'],'Private members are accessible only within their declaring top-level class context.'],
 ['Which principle requires a subtype to honor its parent’s behavioral promises?','Liskov substitution',['String interning','Integer promotion','Garbage collection'],'A subtype should be usable wherever the supertype is expected.'],
 ['What does super(...) invoke in a constructor?','A superclass constructor',['The subclass override','The JVM launcher','A static initializer in every class'],'It delegates construction to the superclass.'],
 ['Are static methods dispatched like overriding instance methods?','No',['Yes','Only when final','Only in interfaces'],'Static method selection follows the compile-time type.']
 ]
},
{
 id:'interfaces-and-records', title:'Interfaces, abstraction, and modern models', scenario:'A payment checkout accepts different payment providers.',
 chapters:[
 ['Interfaces as contracts','An interface states what a collaborator can do without choosing its storage or implementation. A payment caller depends on charge, not on a particular provider class. Implementations can then be substituted in production or testing. Keep interfaces focused on the client’s actual needs.'],
 ['Abstract classes and default methods','An abstract class can combine shared state, constructors, and abstract behavior. Interfaces can provide default behavior but do not carry per-instance fields. A class can implement multiple interfaces, while it extends only one class. Resolve conflicting default implementations explicitly.'],
 ['Enums and records','Use an enum for a finite named set such as payment status. A record is a concise carrier of values with component accessors, a canonical constructor, and generated equality. Record components are final, but referenced lists can still be mutable: defensively copy them when required.'],
 ['Sealed hierarchies and pattern matching','A sealed hierarchy restricts permitted direct subtypes. Pair it with pattern matching when all alternatives should be handled explicitly. Choose records for data and ordinary classes for stateful behavior; modern syntax improves expression but does not remove the need to design valid domain states.']
 ], code:'interface Payment { int charge(int amount); }\nclass Card implements Payment {\n  public int charge(int amount) { return amount + 5; }\n}\nrecord Receipt(int charged) {}\nPayment payment = new Card();\nReceipt receipt = new Receipt(payment.charge(100));\nSystem.out.println(receipt.charged());', output:'105',
 trace:[['Contract','payment exposes charge independently of the provider.'],['Implementation','Card adds the sample provider fee, yielding 105.'],['Value model','Receipt stores charged = 105 and exposes charged().']],
 task:'Implement a Cash payment with no fee and create a Receipt for an amount of 100.', checks:['Cash implements Payment.','charge(100) returns 100.','The receipt component accessor returns 100.'], hint:'An interface method implementation must be public.', solution:'class Cash implements Payment {\n  public int charge(int amount) { return amount; }\n}\nReceipt cashReceipt = new Receipt(new Cash().charge(100));\nSystem.out.println(cashReceipt.charged());',
 questions:[
 ['What is the main benefit of depending on Payment rather than Card?','Implementations can change behind a stable contract',['All fees become zero','The JVM skips compilation','The object becomes static'],'Interfaces separate the caller from the implementation.'],
 ['Can a class implement multiple interfaces?','Yes',['No','Only records can','Only abstract classes can'],'Java supports multiple interface types.'],
 ['Which accessor does record Receipt(int charged) provide?','charged()',['getCharged() automatically','charged as a public field','readCharged()'],'Record accessors use component names.'],
 ['Is a record containing an ArrayList automatically deeply immutable?','No',['Yes','Only if the record is public','Only if the list is empty initially'],'Final component references do not freeze referenced objects.'],
 ['What best models a fixed set of payment statuses?','An enum',['An unvalidated arbitrary int','A Thread','A Scanner'],'Enums give a named finite set of values.'],
 ['What does a sealed class restrict?','Its permitted direct subtypes',['All method calls','All object allocation','Every field to primitives'],'Sealing controls the hierarchy boundary.'],
 ['What visibility is required when implementing an ordinary public interface method?','public',['private','package-private only','Any visibility'],'An implementation cannot narrow access.'],
 ['Which construct can hold shared instance state and an abstract method?','An abstract class',['An interface instance field','An enum name string','A package declaration'],'Abstract classes can mix state and incomplete behavior.']
 ]
},
{
 id:'exceptions-and-capstone', title:'Exceptions and the fundamentals capstone', scenario:'Build a resilient command-line expense tracker.',
 chapters:[
 ['Failures, exceptions, and recovery','An exception signals an operation that could not complete normally. Catch only where you can recover or translate meaningfully. Reject bad input at the boundary, and preserve the original cause when wrapping an exception. Swallowing failures produces misleading success.'],
 ['Checked and unchecked exceptions','The compiler requires checked exceptions to be caught or declared. RuntimeException subclasses are unchecked. This distinction is about the API contract, not whether an error matters. Use IllegalArgumentException for invalid caller input and domain-specific exceptions when callers need a meaningful recovery choice.'],
 ['try-with-resources and cleanup','Resources such as readers and JDBC connections must be closed. try-with-resources closes AutoCloseable resources in reverse declaration order, including exceptional paths. finally is useful for cleanup but should not return a value that hides the original failure.'],
 ['Capstone: model, validate, and report expenses','Create an Expense record with a label and positive amount in minor units. Keep an in-memory collection, accept add/list/total/exit commands, and separate parsing from business methods. This first capstone needs no database; persistence arrives in the developer core course.']
 ], code:'int parseAmount(String text) {\n  int amount = Integer.parseInt(text);\n  if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");\n  return amount;\n}\ntry {\n  System.out.println(parseAmount("-10"));\n} catch (IllegalArgumentException ex) {\n  System.out.println(ex.getMessage());\n}', output:'Amount must be positive',
 trace:[['Parse','-10 is syntactically a valid integer.'],['Validate','The positive-amount rule rejects -10.'],['Recover','The catch prints the message; no invalid expense is saved.']],
 task:'Build the expense tracker using a record, a service class, and a command loop. Add a total command and recover from malformed input.', checks:['Adding Food 1250 and Bus 300 gives a total of 1550.','A negative amount and nonnumeric input show a useful error without exiting.','list preserves valid expenses; exit terminates the loop.','Keep parsing, storage, and printing in separate methods.'], hint:'NumberFormatException extends IllegalArgumentException. Catch at the command boundary rather than inside every method.', solution:'record Expense(String label, int amount) {\n  public Expense {\n    if (label == null || label.isBlank() || amount <= 0)\n      throw new IllegalArgumentException("Invalid expense");\n  }\n}\nvar expenses = new java.util.ArrayList<Expense>();\nexpenses.add(new Expense("Food", 1250));\nexpenses.add(new Expense("Bus", 300));\nint total = 0;\nfor (Expense expense : expenses) total = Math.addExact(total, expense.amount());\nSystem.out.println(total);',
 questions:[
 ['What must a caller do with a checked exception not caught locally?','Declare it in throws',['Ignore it','Turn off the compiler','Always terminate the JVM'],'Checked exceptions are part of the method contract.'],
 ['Which exception fits a negative amount supplied to a positive-amount API?','IllegalArgumentException',['ClassNotFoundException','InterruptedException','NoSuchMethodException'],'The argument violates the operation’s precondition.'],
 ['What does try-with-resources close automatically?','AutoCloseable resources',['Every object in scope','All static fields','Only Strings'],'The resource contract defines close().'],
 ['Why avoid catching an exception and doing nothing?','It hides failure and can imply success',['It guarantees a memory leak every time','It prevents compilation always','It changes integers to null'],'Handle, propagate, or record failure meaningfully.'],
 ['In what order are multiple try-with-resources resources closed?','Reverse declaration order',['Declaration order','Random order','They are never closed on failure'],'Later resources are closed before earlier resources.'],
 ['Is NumberFormatException checked?','No',['Yes','Only for negative numbers','Only inside main'],'It extends IllegalArgumentException, an unchecked RuntimeException.'],
 ['Where is a useful place to recover from malformed CLI commands?','The command-processing boundary',['Every getter','The record hashCode method','The compiler itself'],'The boundary can show feedback and accept another command.'],
 ['When wrapping an exception, why preserve its cause?','To retain diagnostic context',['To guarantee retry succeeds','To erase the stack trace','To convert all errors to checked exceptions'],'The cause records the original failure for diagnosis.']
 ]
}
];
