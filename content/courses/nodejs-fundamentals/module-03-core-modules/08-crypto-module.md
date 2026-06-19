# The crypto Module

## Why It Matters

The `node:crypto` module provides cryptographic primitives: secure random bytes, hashing, HMACs, key derivation, encryption, signatures, and more. These tools are essential for tokens, integrity checks, password storage support, and secure protocols.

Cryptography is easy to misuse. Prefer high-level, reviewed libraries for complete authentication systems, and use `node:crypto` primitives with clear intent.

## Core Concepts

### Random values

Use cryptographic randomness for tokens:

```js
import { randomBytes } from 'node:crypto';

const token = randomBytes(32).toString('base64url');
console.log(token);
```

Do not use `Math.random()` for secrets.

### Hashing

Hashes produce a deterministic digest. They are useful for checksums and identifiers, not reversible encryption.

```js
import { createHash } from 'node:crypto';

const digest = createHash('sha256').update('hello').digest('hex');
console.log(digest);
```

Do not store passwords with a plain fast hash. Passwords need slow, salted password hashing such as bcrypt, scrypt, or Argon2.

### HMAC

HMAC proves that a message was produced by someone with a shared secret.

```js
import { createHmac } from 'node:crypto';

const signature = createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update('payload body')
  .digest('hex');

console.log(signature);
```

Use constant-time comparison when checking signatures.

## Syntax and Examples

### scrypt for password-derived keys

```js
import { scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const salt = randomBytes(16);
const key = await scryptAsync('user password', salt, 64);

console.log(Buffer.from(key).toString('hex'));
```

For application password storage, use a well-maintained password hashing library that encodes parameters and salts safely.

### Timing-safe comparison

```js
import { timingSafeEqual } from 'node:crypto';

function safeEqualHex(a, b) {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');

  return left.length === right.length && timingSafeEqual(left, right);
}
```

## Use Cases

Use `node:crypto` for:

- Generating session or reset tokens
- Webhook signature verification
- File integrity checks
- Secure random IDs
- HMAC-signed payloads
- Key derivation for lower-level protocols

## Common Mistakes

- Using `Math.random()` for security-sensitive tokens.
- Confusing hashing with encryption.
- Storing passwords with SHA-256.
- Comparing secrets with normal string equality.
- Inventing custom crypto protocols.
- Hardcoding secrets in source files.

## Practical Challenge

Write a script that accepts a file path and prints its SHA-256 hash. Then add an option to verify the hash against an expected value using `timingSafeEqual`.

## Recap

`node:crypto` gives you strong primitives, but primitives are not complete security designs. Use secure randomness, choose the right primitive, protect secrets, and prefer established libraries for full authentication and encryption workflows.
