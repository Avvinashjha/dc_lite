# Dangerous Code and Prototype Pollution

JavaScript is flexible.

That flexibility is powerful, but it also creates security risks when untrusted data controls code behavior.

Two important ideas to know are:

- avoid dynamic code execution
- be careful when copying untrusted object properties

## Avoid `eval`

`eval()` runs a string as JavaScript code.

```js
// Avoid this
const result = eval(userInput);
```

If `userInput` is untrusted, the string can do far more than return a value.

Most uses of `eval()` have safer alternatives.

## Avoid `new Function`

`new Function()` also creates executable code from a string.

```js
// Avoid this with untrusted strings
const calculate = new Function("price", `return ${formula}`);
```

This has similar risks to `eval()`.

If users need configurable behavior, prefer a small set of supported options.

```js
const operations = {
  addTax: (price) => price * 1.1,
  discount10: (price) => price * 0.9,
};

function applyOperation(price, operationName) {
  const operation = operations[operationName];

  if (!operation) {
    throw new Error("Unsupported operation");
  }

  return operation(price);
}
```

The user chooses an operation name.

Your code chooses the function.

## Dynamic Property Access

Dynamic property access is common.

```js
const value = user[fieldName];
```

This is not automatically unsafe.

But be careful when `fieldName` comes from untrusted input and controls sensitive behavior.

Prefer allow lists.

```js
const allowedFields = new Set(["name", "email", "createdAt"]);

function getDisplayValue(user, fieldName) {
  if (!allowedFields.has(fieldName)) {
    return "";
  }

  return user[fieldName];
}
```

## Prototype Pollution Awareness

JavaScript objects inherit from prototypes.

Prototype pollution happens when code accidentally lets untrusted input modify object prototypes or special properties used by many objects.

You do not need to know every low-level detail yet.

You should know the practical rule:

Be careful when merging untrusted objects into other objects.

## Risky Deep Merge Pattern

This simplified merge function recursively copies every key.

```js
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = target[key] ?? {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}
```

This kind of helper can be risky when `source` is untrusted.

Real-world merge utilities need to handle special keys, inherited properties, arrays, null values, and many edge cases.

## Safer Object Copying

Only copy expected properties.

```js
function parseProfileUpdate(input) {
  return {
    displayName: String(input.displayName ?? "").trim(),
    bio: String(input.bio ?? "").trim(),
  };
}
```

This approach ignores unexpected keys.

It also makes the accepted data shape clear.

## Use `Object.hasOwn`

When reading object properties from unknown objects, check own properties.

```js
function hasSetting(settings, key) {
  return Object.hasOwn(settings, key);
}
```

This avoids accidentally treating inherited properties as direct data.

Older code may use `Object.prototype.hasOwnProperty.call(object, key)`.

## JSON Is Data, Not Trust

Parsing JSON does not make data safe.

```js
const data = JSON.parse(responseText);
```

After parsing, the result is still untrusted data.

Validate its shape before using it in security-sensitive places.

## Common Mistakes

Do not run strings as JavaScript code.

Do not build formulas or filters with `eval()`.

Do not deep-merge untrusted objects casually.

Do not copy every property from an API payload into app state without considering the shape.

Do not assume `JSON.parse()` validates meaning.

## Summary

Avoid dynamic code execution with `eval()` and `new Function()`.

Use allow lists for configurable behavior.

When handling unknown objects, copy expected properties, validate shapes, and be aware of prototype-related risks.
