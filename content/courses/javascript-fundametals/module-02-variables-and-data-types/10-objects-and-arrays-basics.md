# Basic Objects and Arrays

So far, you have learned about primitive values such as strings, numbers, booleans, `null`, `undefined`, symbols, and bigints.

Primitive values are useful, but they usually hold one simple piece of data.

Real applications often need grouped data.

For example, a user may have:

- a name
- an email
- an age
- a login status

A shopping cart may have:

- multiple products
- quantities
- prices
- a total

To model grouped data, JavaScript gives us non-primitive values, also called **reference types**.

The two most common reference types are:

- Objects
- Arrays

## Objects

An **object** stores related data as key-value pairs.

A key is the name of the property.

A value is the data stored under that key.

```js
const user = {
  firstName: "Asha",
  age: 25,
  isAdmin: false
};
```

In this object:

- `firstName` is a key, and `"Asha"` is its value.
- `age` is a key, and `25` is its value.
- `isAdmin` is a key, and `false` is its value.

Objects are useful when you want to describe one thing with multiple pieces of information.

## Object Values Can Be Any Type

Object values can be strings, numbers, booleans, arrays, other objects, functions, or any other JavaScript value.

```js
const user = {
  firstName: "Asha",
  age: 25,
  isAdmin: false,
  hobbies: ["reading", "coding"],
  address: {
    city: "Delhi",
    country: "India"
  }
};
```

This object contains:

- primitive values
- an array
- a nested object

## Accessing Object Properties

There are two common ways to access object properties:

- Dot notation
- Bracket notation

## Dot Notation

Dot notation is the most common and readable way.

```js
const user = {
  firstName: "Asha",
  age: 25
};

console.log(user.firstName); // Asha
console.log(user.age); // 25
```

Use dot notation when the property name is a normal identifier.

## Bracket Notation

Bracket notation is useful when:

- the key is stored in a variable
- the key has spaces or special characters
- the key is not a valid JavaScript identifier

```js
const user = {
  firstName: "Asha",
  age: 25
};

console.log(user["firstName"]); // Asha
```

Using a variable as the key:

```js
const user = {
  firstName: "Asha",
  age: 25
};

const key = "age";

console.log(user[key]); // 25
```

Example with a key that contains a space:

```js
const user = {
  "full name": "Asha Sharma"
};

console.log(user["full name"]); // Asha Sharma
```

## Updating Object Properties

Objects are mutable. That means you can change their contents.

```js
const user = {
  name: "Asha"
};

user.name = "Ravi";

console.log(user.name); // Ravi
```

You can also add new properties:

```js
const user = {
  name: "Asha"
};

user.email = "asha@example.com";

console.log(user);
```

Even though `user` was declared with `const`, the object contents can still change.

`const` prevents reassignment of the variable, not mutation of the object.

This is allowed:

```js
const user = {
  name: "Asha"
};

user.name = "Ravi";
```

This is not allowed:

```js
const user = {
  name: "Asha"
};

user = {
  name: "Ravi"
}; // Error
```

## Arrays

An **array** stores an ordered list of values.

```js
const colors = ["red", "green", "blue"];
```

Arrays are useful when you have multiple values in a specific order.

Examples:

```js
const scores = [90, 85, 100];
const users = ["Asha", "Ravi", "Maya"];
const mixed = [42, "hello", true, null];
```

Arrays can store any type of value, but in real projects it is usually clearer to keep related values of the same kind together.

## Accessing Array Elements

Array items are accessed by index.

Indexes start at `0`.

```js
const colors = ["red", "green", "blue"];

console.log(colors[0]); // red
console.log(colors[1]); // green
console.log(colors[2]); // blue
```

If you access an index that does not exist, JavaScript returns `undefined`.

```js
const colors = ["red", "green", "blue"];

console.log(colors[10]); // undefined
```

## Array Length

The `.length` property tells you how many items are in an array.

```js
const colors = ["red", "green", "blue"];

console.log(colors.length); // 3
```

To access the last item:

```js
const colors = ["red", "green", "blue"];

console.log(colors[colors.length - 1]); // blue
```

This works because the last index is always one less than the length.

## Updating Arrays

Arrays are mutable.

You can change an item by index:

```js
const numbers = [10, 20, 30];

numbers[0] = 99;

console.log(numbers); // [99, 20, 30]
```

You can add an item with `push()`:

```js
const numbers = [10, 20];

numbers.push(30);

console.log(numbers); // [10, 20, 30]
```

Like objects, arrays declared with `const` can still be mutated.

This is allowed:

```js
const numbers = [1, 2, 3];

numbers.push(4);
```

This is not allowed:

```js
const numbers = [1, 2, 3];

numbers = [4, 5, 6]; // Error
```

## Objects vs Arrays

Use an object when you want to describe something with named properties.

```js
const user = {
  name: "Asha",
  age: 25
};
```

Use an array when you want an ordered list.

```js
const users = ["Asha", "Ravi", "Maya"];
```

Comparison:

| Feature | Object | Array |
| --- | --- | --- |
| Syntax | `{}` | `[]` |
| Stores | Key-value pairs | Ordered items |
| Access by | Property name | Index number |
| Good for | Describing one entity | Lists of values |
| Example | `{ name: "Asha" }` | `["Asha", "Ravi"]` |

## Reference Types vs Value Types

This is the most important concept in this lesson.

Primitive values are copied by value.

Objects and arrays are copied by reference.

## Primitives Are Copied by Value

```js
let x = 10;
let y = x;

y = 20;

console.log(x); // 10
console.log(y); // 20
```

Changing `y` does not affect `x`.

## Objects Are Copied by Reference

```js
const person1 = {
  name: "Asha"
};

const person2 = person1;

person2.name = "Ravi";

console.log(person1.name); // Ravi
console.log(person2.name); // Ravi
```

This happens because `person1` and `person2` point to the same object in memory.

The object was not copied. The reference was copied.

## Arrays Are Also Copied by Reference

```js
const numbers1 = [1, 2, 3];
const numbers2 = numbers1;

numbers2.push(4);

console.log(numbers1); // [1, 2, 3, 4]
console.log(numbers2); // [1, 2, 3, 4]
```

Both variables refer to the same array.

## Making a Shallow Copy

If you want a new array, you can create a shallow copy with the spread operator.

```js
const numbers1 = [1, 2, 3];
const numbers2 = [...numbers1];

numbers2.push(4);

console.log(numbers1); // [1, 2, 3]
console.log(numbers2); // [1, 2, 3, 4]
```

For objects, you can also use the spread operator:

```js
const user1 = {
  name: "Asha"
};

const user2 = { ...user1 };

user2.name = "Ravi";

console.log(user1.name); // Asha
console.log(user2.name); // Ravi
```

This creates a shallow copy. You will learn more about shallow and deep copying in later modules.

## Putting It Together

Here is a small example using both objects and arrays:

```js
const cart = {
  user: "Asha",
  items: ["Laptop", "Mouse", "Keyboard"],
  isPaid: false
};

console.log(`${cart.user} has ${cart.items.length} items in the cart.`);
console.log(cart.items[0]); // Laptop
```

Objects and arrays are often used together to represent real application data.

## Summary

Objects and arrays let you store structured data.

Remember:

1. Objects use `{}` and store key-value pairs.
2. Arrays use `[]` and store ordered lists.
3. Object properties can be accessed with dot notation or bracket notation.
4. Array items are accessed by index, starting at `0`.
5. Objects and arrays are mutable.
6. `const` prevents reassignment, but it does not prevent object or array mutation.
7. Objects and arrays are copied by reference, not by value.
8. Use spread syntax to make a shallow copy.

Next, you will learn about type conversion and how JavaScript changes values from one type to another.