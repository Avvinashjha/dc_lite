# Encryption vs Hashing

## Why It Matters

Authentication systems handle secrets: passwords, session identifiers, API keys, refresh tokens, private keys, and personal data. Two words appear constantly around secrets: encryption and hashing. They are related to cryptography, but they solve different problems.

Confusing them leads to serious security mistakes. Passwords should be hashed, not encrypted. Sensitive values that must be read later may need encryption. Tokens often need signing. Each choice answers a different question.

## Core Concepts

### Encryption

Encryption transforms readable data into unreadable ciphertext using a key. It is reversible if you have the correct key.

Use encryption when the application must recover the original value later, such as:

- Storing an OAuth refresh token for a connected account.
- Protecting a personal identifier at rest.
- Sending confidential data over a secure channel.

If the key is stolen, encrypted data may be recoverable. Key management is therefore part of encryption, not an optional detail.

### Hashing

Hashing transforms data into a fixed-size digest. It is designed to be one-way. You verify by hashing the candidate input and comparing results.

Use hashing when the application does not need the original value back, such as:

- Password storage.
- API key lookup using a stored key hash.
- File integrity checks.

Password hashing must be slow and salted. General-purpose hashes like SHA-256 are too fast for password storage because attackers can test many guesses quickly.

### Signing

Signing proves that data was produced by someone with a secret or private key and was not modified. JWTs are commonly signed. Signing does not hide the data.

A signed token can still be read by anyone who has it. Do not put secrets in a signed JWT payload.

## Syntax/Examples

### Password Hashing with `node:crypto`

For production password hashing, use a mature password hashing library such as Argon2 or bcrypt. The built-in `scrypt` API is useful for understanding the pattern and can be used carefully.

```js
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, 64);
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  const [saltHex, keyHex] = storedHash.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const storedKey = Buffer.from(keyHex, 'hex');
  const derivedKey = await scryptAsync(password, salt, storedKey.length);

  return timingSafeEqual(storedKey, derivedKey);
}
```

Important details:

- Each password gets a unique random salt.
- Verification compares derived values using `timingSafeEqual`.
- The original password is never stored.

### Symmetric Encryption Example

```js
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const algorithm = 'aes-256-gcm';

export function encryptText(plainText, key) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptText(payload, key) {
  const [ivHex, authTagHex, encryptedHex] = payload.split(':');
  const decipher = createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}
```

For AES-256-GCM, the key must be 32 bytes and protected outside source code, usually through a secrets manager or secure environment configuration.

## Use Cases

Use hashing for:

- Passwords.
- API keys where the plaintext is shown only once.
- Reset tokens stored server-side.
- Integrity checks.

Use encryption for:

- Data that must be recovered.
- Stored provider tokens.
- Sensitive fields with regulatory requirements.

Use signing for:

- JWT access tokens.
- Webhook verification.
- Tamper-resistant cookies.

## Tradeoffs

Hashing is safer for passwords because there is no key that can decrypt every password. But users can still choose weak passwords, so slow hashing, salts, rate limiting, and breach detection matter.

Encryption protects data at rest, but the application needs access to keys. If attackers compromise both database and application secrets, encryption may not help. Use key rotation and least privilege.

## Common Mistakes

- Encrypting passwords instead of hashing them.
- Hashing passwords with unsalted SHA-256.
- Storing encryption keys in the repository.
- Putting secrets inside JWT payloads because the token is signed.
- Comparing secret values with normal string equality when timing attacks matter.

## Practical Challenge

Implement registration and login helpers. Registration should hash the password before storage. Login should verify the supplied password against the stored hash. Add a test that the same password produces different stored hashes because each hash uses a new salt.

## Recap

Encryption is reversible with a key. Hashing is one-way. Signing proves integrity and authenticity but does not hide data. Passwords should be slow-hashed with salts. Values that must be recovered may need authenticated encryption and careful key management.

