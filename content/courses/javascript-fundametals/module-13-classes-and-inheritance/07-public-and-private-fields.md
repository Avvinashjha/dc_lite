# Public and Private Fields

Modern JavaScript classes support fields.

Fields are properties declared directly inside the class body.

```js
class Counter {
  count = 0;

  increment() {
    this.count += 1;
    return this.count;
  }
}

const counter = new Counter();

console.log(counter.increment()); // 1
```

`count = 0` is a public field.

Each instance gets its own `count`.

## Public Fields

Public fields can be read and changed from outside the class.

```js
class User {
  role = "user";

  constructor(name) {
    this.name = name;
  }
}

const user = new User("Alice");

console.log(user.role); // user

user.role = "admin";

console.log(user.role); // admin
```

Public fields are convenient for default instance properties.

## Fields vs Constructor Assignment

These are similar:

```js
class Counter {
  count = 0;
}
```

and:

```js
class Counter {
  constructor() {
    this.count = 0;
  }
}
```

Use fields for simple defaults.

Use the constructor when values depend on constructor arguments or validation.

```js
class User {
  active = true;

  constructor(name) {
    this.name = name;
  }
}
```

## Private Fields

Private fields start with `#`.

```js
class BankAccount {
  #balance = 0;

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount();

account.deposit(100);

console.log(account.getBalance()); // 100
```

You cannot access `#balance` from outside the class.

```js
console.log(account.#balance); // SyntaxError
```

Private fields provide real language-level privacy.

## Why Private Fields Are Useful

Private fields protect internal state.

```js
class BankAccount {
  #balance = 0;

  deposit(amount) {
    if (amount <= 0) {
      throw new Error("Deposit must be positive");
    }

    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount > this.#balance) {
      throw new Error("Insufficient funds");
    }

    this.#balance -= amount;
  }

  getBalance() {
    return this.#balance;
  }
}
```

Outside code cannot directly set an invalid balance.

```js
account.#balance = -999; // SyntaxError
```

The class controls how the value changes.

## Private Methods

Classes can also have private methods.

```js
class User {
  constructor(email) {
    this.email = this.#normalizeEmail(email);
  }

  #normalizeEmail(email) {
    return email.trim().toLowerCase();
  }
}

const user = new User(" ALICE@EXAMPLE.COM ");

console.log(user.email); // alice@example.com
```

Private methods are useful for internal helper behavior.

They cannot be called from outside the class.

## Private Fields Must Be Declared

Private fields must be declared in the class body before use.

```js
class Counter {
  #count = 0;

  increment() {
    this.#count += 1;
  }
}
```

This is invalid:

```js
class Counter {
  increment() {
    this.#count += 1; // SyntaxError if #count is not declared
  }
}
```

## Private Fields Are Not Object Properties You Can Bracket-Access

This does not work:

```js
account["#balance"];
```

Private fields are not normal string-keyed properties.

They are special private names known only inside the class.

## Underscore Convention vs Private Fields

Before private fields, developers often used underscores.

```js
class User {
  constructor(email) {
    this._email = email;
  }
}
```

But `_email` is still public.

```js
user._email = "bad value";
```

The underscore is only a convention.

Private fields are enforced by JavaScript.

```js
class User {
  #email;
}
```

## Best Practices

Use public fields for simple default properties.

Use private fields for internal state that should not be changed directly.

Expose controlled methods for changing private state.

Keep private helpers private.

Do not make everything private by default.

Use privacy when it protects important invariants.

## Common Mistakes

### Mistake 1: Trying to Access Private Fields Outside the Class

```js
account.#balance;
```

This is a syntax error.

Use a public method:

```js
account.getBalance();
```

### Mistake 2: Forgetting to Declare a Private Field

```js
class Counter {
  increment() {
    this.#count += 1;
  }
}
```

Declare it:

```js
class Counter {
  #count = 0;
}
```

### Mistake 3: Thinking `_name` Is Truly Private

```js
this._name = "Alice";
```

This is only a convention.

Outside code can still access it.

## Summary

Modern classes support public and private fields.

- Public fields are normal instance properties.
- Public fields can define simple defaults.
- Private fields start with `#`.
- Private fields are only accessible inside the class.
- Private methods also use `#`.
- Private fields must be declared before use.
- Use private fields to protect internal state and invariants.
