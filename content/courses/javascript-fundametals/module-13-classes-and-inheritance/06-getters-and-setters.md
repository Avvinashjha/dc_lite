# Getters and Setters

Getters and setters let class methods look like properties.

A getter reads a computed value.

A setter controls how a value is assigned.

```js
class User {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

const user = new User("Alice", "Sharma");

console.log(user.fullName); // Alice Sharma
```

Notice:

```js
user.fullName
```

not:

```js
user.fullName()
```

## Getters

Use `get` to define a getter.

```js
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height;
  }
}

const rectangle = new Rectangle(10, 5);

console.log(rectangle.area); // 50
```

`area` behaves like a property, but it is calculated by a method.

## Getters Should Not Require Arguments

Getters do not receive parameters.

They are for property-like values.

Good:

```js
get area() {
  return this.width * this.height;
}
```

If you need arguments, use a normal method.

```js
calculateDiscount(percent) {
  return this.price * (percent / 100);
}
```

## Setters

Use `set` to control assignment.

```js
class User {
  constructor(name) {
    this.name = name;
  }

  set email(value) {
    if (!value.includes("@")) {
      throw new Error("Invalid email");
    }

    this._email = value;
  }

  get email() {
    return this._email;
  }
}

const user = new User("Alice");

user.email = "alice@example.com";

console.log(user.email); // alice@example.com
```

The setter runs when you assign:

```js
user.email = "alice@example.com";
```

The getter runs when you read:

```js
user.email
```

## Why Use a Different Internal Name?

Inside the setter, do not assign to the same property name.

This causes infinite recursion:

```js
set email(value) {
  this.email = value; // calls the setter again
}
```

Use a different internal property:

```js
set email(value) {
  this._email = value;
}
```

The underscore is a naming convention that means:

```text
This is intended for internal use.
```

It does not make the property truly private.

Private fields are covered in the next lesson.

## Getters and Derived Data

Getters are useful for values derived from other properties.

```js
class Cart {
  constructor(items) {
    this.items = items;
  }

  get total() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  get itemCount() {
    return this.items.length;
  }
}

const cart = new Cart([
  { name: "Keyboard", price: 1200 },
  { name: "Mouse", price: 700 },
]);

console.log(cart.total); // 1900
console.log(cart.itemCount); // 2
```

The values are calculated when accessed.

## Setters and Validation

Setters can protect data.

```js
class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  set price(value) {
    if (value < 0) {
      throw new Error("Price cannot be negative");
    }

    this._price = value;
  }

  get price() {
    return this._price;
  }
}

const product = new Product("Keyboard", 1200);

product.price = 1500;

console.log(product.price); // 1500
```

The same validation runs in the constructor because the constructor assigns through the setter:

```js
this.price = price;
```

## Getters vs Methods

Use a getter when the value feels like a property.

```js
cart.total
```

Use a method when an action is being performed or arguments are needed.

```js
cart.calculateDiscount(10)
```

Avoid hiding expensive work behind a getter.

If a getter performs heavy calculations or network requests, it can surprise other developers.

## Best Practices

Use getters for derived property-like values.

Use setters for simple validation or controlled assignment.

Avoid side effects in getters.

Avoid expensive work in getters.

Use normal methods when arguments are needed.

Use private fields for stronger privacy when appropriate.

## Common Mistakes

### Mistake 1: Calling a Getter Like a Method

```js
console.log(user.fullName()); // TypeError
```

Use:

```js
console.log(user.fullName);
```

### Mistake 2: Recursive Setter

```js
set price(value) {
  this.price = value;
}
```

This calls the setter again and again.

Use a separate internal property:

```js
set price(value) {
  this._price = value;
}
```

### Mistake 3: Using a Getter for an Action

```js
get save() {
  // saves to database
}
```

Saving is an action.

Use a method:

```js
save() {}
```

## Quick Check

What does this log?

```js
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height;
  }
}

const rectangle = new Rectangle(4, 5);

console.log(rectangle.area);
```

It logs:

```text
20
```

## Summary

Getters and setters let methods behave like properties.

- `get` defines a property-like read operation.
- `set` defines controlled assignment.
- Getters are accessed without parentheses.
- Setters run during assignment.
- Use getters for derived values.
- Use setters for validation or controlled updates.
- Avoid recursive setters.
- Use normal methods for actions and arguments.
