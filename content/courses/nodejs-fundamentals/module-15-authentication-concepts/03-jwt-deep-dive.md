# JWT Deep Dive

## Why It Matters

JSON Web Tokens, or JWTs, are widely used for API authentication and identity claims. They are compact, signed strings that can be verified by services without a database lookup. That makes them useful in distributed systems.

JWTs are also frequently misused. A JWT is not encrypted by default, not automatically revocable, and not a replacement for authorization design.

## Core Concepts

### Structure

A JWT has three base64url-encoded parts separated by dots:

```text
header.payload.signature
```

The header describes the algorithm and token type. The payload contains claims. The signature proves the token has not been modified.

### Claims

Common claims include:

- `sub`: subject, usually user ID.
- `iss`: issuer.
- `aud`: audience.
- `exp`: expiration time.
- `iat`: issued-at time.
- `nbf`: not-before time.
- `jti`: token ID.

Application-specific claims may include roles, tenant IDs, or permission hints. Keep claims small and avoid sensitive data.

### Signing Algorithms

HMAC algorithms such as HS256 use one shared secret to sign and verify. RSA or ECDSA algorithms use a private key to sign and a public key to verify.

For systems with many services, asymmetric signing is often safer because verifiers do not need the signing private key.

## Syntax/Examples

### Minimal HS256 JWT Implementation

In production, use a mature JWT library. This example shows the mechanics.

```js
import { createHmac, timingSafeEqual } from 'node:crypto';

function base64url(input) {
  return Buffer.from(JSON.stringify(input)).toString('base64url');
}

function sign(data, secret) {
  return createHmac('sha256', secret).update(data).digest('base64url');
}

export function createJwt(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64url(header);
  const encodedPayload = base64url(payload);
  const data = `${encodedHeader}.${encodedPayload}`;
  return `${data}.${sign(data, secret)}`;
}

export function verifyJwt(token, secret) {
  const [encodedHeader, encodedPayload, signature] = token.split('.');
  const data = `${encodedHeader}.${encodedPayload}`;
  const expected = sign(data, secret);

  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error('Invalid signature');
  }

  const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8'));
  if (header.alg !== 'HS256') throw new Error('Unexpected algorithm');

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    throw new Error('Token expired');
  }

  return payload;
}
```

This example checks the algorithm and expiration. Real libraries handle many more edge cases.

### Express Authorization Middleware

```js
export function requireJwt({ jwtService }) {
  return (req, res, next) => {
    try {
      const header = req.get('authorization') ?? '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) return res.status(401).json({ error: 'Missing token' });

      req.auth = jwtService.verify(token);
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.auth?.roles?.includes(role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}
```

Authentication says who the caller is. Authorization says what the caller may do.

## Use Cases

JWTs are useful for:

- Short-lived API access tokens.
- Service-to-service authentication.
- Passing identity from an auth service to resource services.
- Stateless verification at high request volume.

They are less useful for:

- Data that must be hidden from clients.
- Permissions that change every few seconds.
- Sessions requiring immediate global logout unless paired with revocation state.

## Tradeoffs

The biggest JWT tradeoff is stateless verification vs revocation. If a token is valid until `exp`, services can verify it without a database lookup. But if a user is disabled, the old token may still work until it expires unless services check a denylist, token version, or central authorization state.

A common compromise is short-lived access tokens, refresh token rotation, and server-side refresh token revocation.

## Common Mistakes

- Decoding a JWT without verifying the signature.
- Accepting the algorithm from the token without enforcing expected algorithms.
- Storing secrets or personal data in the payload.
- Using long-lived JWTs as permanent sessions.
- Trusting roles in old tokens after permissions changed.

## Practical Challenge

Create a short-lived JWT access token containing `sub`, `iss`, `aud`, `iat`, and `exp`. Write middleware that verifies the token and rejects wrong issuer, wrong audience, missing token, invalid signature, and expiration.

## Recap

A JWT is a signed set of claims, not encrypted storage. It is useful when services need to verify identity without a lookup. Keep tokens short-lived, validate issuer and audience, enforce algorithms, avoid secrets in payloads, and pair JWTs with a revocation strategy when business rules require it.

