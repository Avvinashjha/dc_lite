# Getters, Setters, and Computed Behavior

Getters and setters let properties behave like values while running functions behind the scenes.

You have seen this syntax before in objects and classes:

```js
const user = {
  firstName: "Ava",
  lastName: "Stone",

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
};

console.log(user.fullName); // "Ava Stone"
```

`fullName` looks like a property, but reading it calls a function.

That makes accessors an everyday form of metaprogramming.

## Getter Basics

A getter runs when code reads the property.

```js
const cart = {
  items: [
    { name: "Keyboard", price: 75 },
    { name: "Mouse", price: 25 },
  ],

  get total() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  },
};

console.log(cart.total); // 100
```

Use getters for values that can be derived from existing state.

## Setter Basics

A setter runs when code assigns to the property.

```js
const user = {
  firstName: "Ava",
  lastName: "Stone",

  set fullName(value) {
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
  },
};

user.fullName = "Mia Chen";

console.log(user.firstName); // "Mia"
console.log(user.lastName); // "Chen"
```

A setter receives the assigned value as its only argument.

## Getter and Setter Together

You can use a getter and setter for the same property.

```js
const user = {
  firstName: "Ava",
  lastName: "Stone",

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  set fullName(value) {
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
  },
};

console.log(user.fullName); // "Ava Stone"

user.fullName = "Mia Chen";

console.log(user.fullName); // "Mia Chen"
```

This can make a convenient public interface around internal data.

## Accessors in Classes

Classes support the same getter and setter syntax.

```js
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  get fahrenheit() {
    return this.celsius * 1.8 + 32;
  }

  set fahrenheit(value) {
    this.celsius = (value - 32) / 1.8;
  }
}

const temperature = new Temperature(0);

console.log(temperature.fahrenheit); // 32

temperature.fahrenheit = 68;

console.log(temperature.celsius); // 20
```

This is useful when one representation can be converted into another.

## Accessor Descriptors

Accessor properties have descriptors too.

```js
const user = {
  firstName: "Ava",
  lastName: "Stone",

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
};

console.log(Object.getOwnPropertyDescriptor(user, "fullName"));
```

The descriptor looks like this:

```js
{
  get: [Function: get fullName],
  set: undefined,
  enumerable: true,
  configurable: true
}
```

Accessor descriptors use `get` and `set`.

Data descriptors use `value` and `writable`.

A descriptor cannot be both a data descriptor and an accessor descriptor.

```js
Object.defineProperty(user, "badProperty", {
  value: "bad",
  get() {
    return "also bad";
  },
}); // TypeError
```

## Defining Accessors Manually

You can define accessors with `Object.defineProperty()`.

```js
const account = {
  balanceInCents: 1250,
};

Object.defineProperty(account, "balance", {
  get() {
    return this.balanceInCents / 100;
  },
  set(value) {
    this.balanceInCents = Math.round(value * 100);
  },
  enumerable: true,
  configurable: true,
});

console.log(account.balance); // 12.5

account.balance = 20;

console.log(account.balanceInCents); // 2000
```

This gives you descriptor-level control over accessor behavior.

## Validation with Setters

Setters can validate assignments.

```js
const user = {
  _age: 0,

  get age() {
    return this._age;
  },

  set age(value) {
    if (!Number.isInteger(value) || value < 0) {
      throw new TypeError("Age must be a non-negative integer");
    }

    this._age = value;
  },
};

user.age = 30;
console.log(user.age); // 30

user.age = -1; // TypeError
```

This can be helpful, but do not overuse it.

Code like `user.age = -1` can now throw an error, which may surprise callers if the object looks like plain data.

## Avoid Expensive Getters

A getter looks like a normal property read.

For that reason, it should usually be quick and predictable.

```js
const report = {
  rows: [],

  get summary() {
    // Avoid expensive network requests or heavy work in a getter.
    return `${this.rows.length} rows`;
  },
};
```

If work is expensive, asynchronous, or has side effects, prefer a method.

```js
const report = {
  async loadSummary() {
    const response = await fetch("/api/report-summary");
    return response.json();
  },
};
```

Methods make cost and behavior more obvious.

## Common Mistake: Infinite Recursion

Be careful when a setter writes to the same property it handles.

```js
const user = {
  set name(value) {
    this.name = value; // calls the setter again
  },
};

user.name = "Ava"; // RangeError: maximum call stack size exceeded
```

Use a different backing property.

```js
const user = {
  _name: "",

  get name() {
    return this._name;
  },

  set name(value) {
    this._name = value;
  },
};
```

The leading underscore is only a naming convention. It is not true privacy.

## Best Practices

Use getters for simple derived values.

Use setters sparingly for validation or synchronized state.

Avoid surprising side effects inside getters.

Prefer methods for expensive, asynchronous, or command-like behavior.

Make backing storage clear, especially when using setters.

## Summary

Getters and setters customize what happens when properties are read or written.

They are useful for derived values, validation, and convenient interfaces.

Because they make property access run code, they should stay predictable and easy to reason about.
