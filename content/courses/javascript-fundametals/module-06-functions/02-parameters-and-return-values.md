# Parameters and Return Values

A function becomes useful when it can work with different input values and produce a result.

For example, this function always greets the same person:

```js
function greet() {
  console.log("Hello, Alice!");
}

greet(); // Hello, Alice!
```

That works, but it is limited.

If you want the same function to greet different people, you need a way to pass data into it:

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("Alice"); // Hello, Alice!
greet("Bob"); // Hello, Bob!
```

That is what **parameters** and **arguments** are for.

If a function is like a small machine, parameters are the inputs you design the machine to accept, and return values are the results it gives back.

## Parameters vs Arguments

Developers often use the words **parameter** and **argument** casually, but they have different meanings.

A **parameter** is the named placeholder in the function definition.

An **argument** is the actual value passed into the function call.

```js
function add(a, b) {
  return a + b;
}

add(5, 10);
```

In this function:

- `a` and `b` are parameters
- `5` and `10` are arguments

You can read it like this:

```text
When add is called with 5 and 10,
put 5 into a,
put 10 into b,
then run the function body.
```

The function definition creates placeholders:

```js
function add(a, b) {
  return a + b;
}
```

The function call provides real values:

```js
add(5, 10);
```

## Working With One Parameter

A function can have one parameter:

```js
function square(number) {
  return number * number;
}

const result = square(4);

console.log(result); // 16
```

Here is what happens:

1. `square(4)` calls the function.
2. The argument `4` is assigned to the parameter `number`.
3. The function calculates `number * number`.
4. The function returns `16`.
5. The returned value is stored in `result`.

The parameter only exists while the function is running.

```js
function square(number) {
  return number * number;
}

console.log(number); // ReferenceError
```

The parameter `number` belongs to the function's scope.

## Working With Multiple Parameters

A function can have multiple parameters separated by commas.

```js
function createGreeting(greeting, name, punctuation) {
  return `${greeting}, ${name}${punctuation}`;
}

const message = createGreeting("Hello", "Alice", "!");

console.log(message); // Hello, Alice!
```

Arguments are matched to parameters by position.

In this call:

```js
createGreeting("Hello", "Alice", "!");
```

JavaScript assigns the values like this:

| Parameter | Argument |
| --- | --- |
| `greeting` | `"Hello"` |
| `name` | `"Alice"` |
| `punctuation` | `"!"` |

The order matters.

This call uses the same values in the wrong order:

```js
const message = createGreeting("Alice", "Hello", "!");

console.log(message); // Alice, Hello!
```

JavaScript does not know what each value means. It only follows the order of the arguments.

## Missing Arguments

If you pass fewer arguments than the function expects, the missing parameters become `undefined`.

```js
function createGreeting(greeting, name, punctuation) {
  return `${greeting}, ${name}${punctuation}`;
}

const message = createGreeting("Hello", "Alice");

console.log(message); // Hello, Aliceundefined
```

The third parameter, `punctuation`, did not receive a value.

So JavaScript uses `undefined`.

You can see it more clearly here:

```js
function showValues(a, b, c) {
  console.log(a);
  console.log(b);
  console.log(c);
}

showValues(1, 2);
```

Output:

```text
1
2
undefined
```

You will learn about default parameters in the next lesson. They help solve this problem cleanly.

## Extra Arguments

If you pass more arguments than the function has parameters, the extra arguments are ignored by the named parameters.

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3, 4)); // 5
```

The function only defines two parameters:

```js
a
b
```

So JavaScript assigns:

| Parameter | Argument |
| --- | --- |
| `a` | `2` |
| `b` | `3` |

The extra argument `4` is not assigned to a named parameter.

Later in this module, you will learn about rest parameters, which let you collect multiple arguments into one array.

## The `return` Keyword

The `return` keyword sends a value back to the place where the function was called.

Example:

```js
function multiply(x, y) {
  return x * y;
}

const result = multiply(4, 5);

console.log(result); // 20
```

The function call:

```js
multiply(4, 5)
```

evaluates to:

```js
20
```

That returned value is then stored in `result`.

This is one of the most important ideas in functions:

```js
const result = multiply(4, 5);
```

The function call is replaced by the value it returns.

## `return` Stops the Function

The `return` statement does two things:

- sends a value back to the caller
- stops the function immediately

Example:

```js
function multiply(x, y) {
  return x * y;

  console.log("This will never run.");
}

const result = multiply(4, 5);

console.log(result); // 20
```

The `console.log()` after `return` never runs.

Once JavaScript reaches `return`, the function is finished.

This means you can use `return` to stop early:

```js
function getDiscount(age) {
  if (age < 0) {
    return "Invalid age";
  }

  if (age >= 65) {
    return "Senior discount";
  }

  return "No discount";
}

console.log(getDiscount(-2)); // Invalid age
console.log(getDiscount(70)); // Senior discount
console.log(getDiscount(30)); // No discount
```

When a `return` runs, JavaScript exits the function and does not check the rest of the function body.

## Returning vs Logging

A common beginner mistake is confusing `return` with `console.log()`.

They are not the same.

`console.log()` prints a value to the console.

`return` gives a value back to the code that called the function.

Compare these two functions:

```js
function addAndLog(a, b) {
  console.log(a + b);
}

function addAndReturn(a, b) {
  return a + b;
}
```

Calling the first function prints the value:

```js
const firstResult = addAndLog(2, 3);

console.log(firstResult);
```

Output:

```text
5
undefined
```

The function printed `5`, but it did not return anything.

So `firstResult` is `undefined`.

Calling the second function returns the value:

```js
const secondResult = addAndReturn(2, 3);

console.log(secondResult); // 5
```

Use `console.log()` when you want to inspect or display something in the console.

Use `return` when the rest of your program needs the result.

## Functions Without `return`

If a function does not explicitly return a value, JavaScript returns `undefined`.

```js
function sayHi(name) {
  console.log(`Hi, ${name}`);
}

const greeting = sayHi("Charlie");

console.log(greeting); // undefined
```

The function runs, and it prints:

```text
Hi, Charlie
```

But it does not return a value.

So `greeting` becomes `undefined`.

An empty `return` also returns `undefined`:

```js
function stopIfInvalid(value) {
  if (value == null) {
    return;
  }

  return `Value: ${value}`;
}

console.log(stopIfInvalid(null)); // undefined
console.log(stopIfInvalid("test")); // Value: test
```

An empty `return` is useful when you want to stop the function early without producing a value.

## Returning Expressions

You can return any expression.

An expression is code that produces a value.

```js
function getFullName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

console.log(getFullName("Ada", "Lovelace")); // Ada Lovelace
```

You can return a calculation:

```js
function calculateArea(width, height) {
  return width * height;
}

console.log(calculateArea(5, 4)); // 20
```

You can return a comparison:

```js
function isAdult(age) {
  return age >= 18;
}

console.log(isAdult(20)); // true
console.log(isAdult(16)); // false
```

You can return a ternary expression:

```js
function getAccessMessage(isLoggedIn) {
  return isLoggedIn ? "Welcome back!" : "Please sign in.";
}

console.log(getAccessMessage(true)); // Welcome back!
```

## Returning One Value

A function can return only one value directly.

```js
function getUserInfo() {
  return "Alice";
  return 32;
}

console.log(getUserInfo()); // Alice
```

The second `return` never runs.

Once the first `return` executes, the function stops.

But that one returned value can be an array or an object.

This lets you group multiple pieces of data together.

## Returning an Array

Use an array when the returned values have a clear order.

```js
function getMinMax(numbers) {
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  return [min, max];
}

const result = getMinMax([10, 5, 8, 20]);

console.log(result[0]); // 5
console.log(result[1]); // 20
```

This works, but the meaning of `result[0]` and `result[1]` is not obvious unless you know the function.

Arrays are fine when position is natural, but they can become unclear.

## Returning an Object

Use an object when named properties make the result easier to understand.

```js
function getUserStats(user) {
  return {
    name: user.name,
    isActive: user.status === "active",
    loginCount: user.logins,
  };
}

const stats = getUserStats({
  name: "Alice",
  status: "active",
  logins: 42,
});

console.log(stats.name); // Alice
console.log(stats.isActive); // true
console.log(stats.loginCount); // 42
```

This is often clearer than returning an array because each value has a name.

For most beginner-friendly code, returning an object is a good choice when a function needs to return multiple related values.

## Early Returns

An **early return** exits a function before the main logic runs.

This is useful for invalid cases.

```js
function processPayment(amount, user) {
  if (amount <= 0) {
    return "Invalid amount";
  }

  if (!user) {
    return "User not found";
  }

  return "Payment successful";
}

console.log(processPayment(0, { name: "Sam" })); // Invalid amount
console.log(processPayment(25, null)); // User not found
console.log(processPayment(25, { name: "Sam" })); // Payment successful
```

Early returns can make code easier to read because they avoid deeply nested `if...else` blocks.

Instead of this:

```js
function processPayment(amount, user) {
  if (amount > 0) {
    if (user) {
      return "Payment successful";
    } else {
      return "User not found";
    }
  } else {
    return "Invalid amount";
  }
}
```

You can write this:

```js
function processPayment(amount, user) {
  if (amount <= 0) {
    return "Invalid amount";
  }

  if (!user) {
    return "User not found";
  }

  return "Payment successful";
}
```

The second version is usually easier to scan.

## Parameters Are Local Variables

Parameters behave like local variables inside the function.

```js
function updateName(name) {
  name = name.toUpperCase();
  return name;
}

const userName = "mira";
const updatedName = updateName(userName);

console.log(updatedName); // MIRA
console.log(userName); // mira
```

Changing the parameter `name` does not change the original string stored in `userName`.

With objects and arrays, the situation is different because they are reference values:

```js
function addRole(user) {
  user.role = "admin";
  return user;
}

const user = {
  name: "Mira",
};

const updatedUser = addRole(user);

console.log(updatedUser.role); // admin
console.log(user.role); // admin
```

The parameter `user` receives a reference to the same object.

Changing the object through the parameter changes the original object too.

This connects back to what you learned in the objects and arrays lesson.

## Best Practices

Use clear parameter names:

```js
function calculateTotal(price, quantity) {
  return price * quantity;
}
```

This is better than:

```js
function calculateTotal(a, b) {
  return a * b;
}
```

Return values instead of only logging them when the result needs to be reused:

```js
function calculateTax(amount) {
  return amount * 0.18;
}

const tax = calculateTax(100);
const total = 100 + tax;

console.log(total); // 118
```

Keep functions focused on one job:

```js
function calculateSubtotal(price, quantity) {
  return price * quantity;
}
```

If a function needs many unrelated parameters or returns many unrelated values, it may be doing too much.

Use early returns for invalid input:

```js
function getUsername(user) {
  if (!user) {
    return "Guest";
  }

  return user.name;
}
```

## Common Mistakes

### Mistake 1: Mixing Up Parameters and Arguments

```js
function greet(name) {
  return `Hello, ${name}`;
}

greet("Alice");
```

`name` is the parameter.

`"Alice"` is the argument.

### Mistake 2: Forgetting to Return a Value

```js
function double(number) {
  number * 2;
}

const result = double(5);

console.log(result); // undefined
```

The calculation happens, but it is not returned.

Correct version:

```js
function double(number) {
  return number * 2;
}

const result = double(5);

console.log(result); // 10
```

### Mistake 3: Putting Code After `return`

```js
function getMessage() {
  return "Hello";
  console.log("This will never run");
}
```

The `console.log()` is unreachable because the function has already returned.

### Mistake 4: Passing Arguments in the Wrong Order

```js
function introduce(name, age) {
  return `${name} is ${age} years old.`;
}

console.log(introduce(30, "Riya")); // 30 is Riya years old.
```

The function still runs, but the result is wrong because the arguments are in the wrong order.

Correct version:

```js
console.log(introduce("Riya", 30)); // Riya is 30 years old.
```

## Quick Check

What does this function return?

```js
function getStatus(score) {
  if (score >= 50) {
    return "Pass";
  }

  return "Fail";
}

getStatus(80);
```

It returns:

```js
"Pass"
```

What does this function return?

```js
function showStatus(score) {
  if (score >= 50) {
    console.log("Pass");
  }
}

const result = showStatus(80);
```

It logs:

```text
Pass
```

But it returns:

```js
undefined
```

There is no `return` statement.

## Summary

Parameters and return values let functions communicate with the rest of your program.

- **Parameters** are named placeholders in a function definition.
- **Arguments** are the actual values passed into a function call.
- Arguments are assigned to parameters by position.
- Missing arguments become `undefined`.
- Extra arguments are ignored unless you use rest parameters or other advanced tools.
- `return` sends a value back to the caller and stops the function.
- A function without `return` returns `undefined`.
- To return multiple related values, return an array or object.
